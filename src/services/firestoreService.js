/**
 * Firestore service — all database read/write operations in one place.
 * Import individual functions where needed rather than using Firestore
 * calls scattered across screens.
 */
import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc, setDoc,
  query, where, orderBy, onSnapshot,
  serverTimestamp, Timestamp, runTransaction, increment,
} from 'firebase/firestore';
import { db } from './firebase';

/* ─── Collection references ─────────────────────────────────────────────────── */
export const Col = {
  users:       () => collection(db, 'users'),
  needs:       () => collection(db, 'needs'),
  reports:     () => collection(db, 'reports'),
  activityLog: () => collection(db, 'activity_log'),
  notifications: () => collection(db, 'notifications'),
  appConfig:   () => collection(db, 'app_config'),
};

/* ─── Users ─────────────────────────────────────────────────────────────────── */

/** Create a new volunteer profile on signup */
export async function createUserProfile(uid, data) {
  await setDoc(doc(db, 'users', uid), {
    uid,
    displayName:   data.displayName || '',
    email:         data.email || '',
    phone:         data.phone || '',
    role:          'volunteer',
    avatarInitials: (data.displayName || 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
    ward:          data.ward || 'Ward 4',
    zone:          data.zone || '',
    languages:     data.languages || [],
    skills:        data.skills || [],
    availability:  {
      monday: [], tuesday: [], wednesday: [], thursday: [],
      friday: [], saturday: [], sunday: [],
    },
    stats: {
      tasksDone:     0,
      activeTask:    0,
      impactScore:   0,
      rating:        0,
      matchAccuracy: 0,
    },
    fcmToken:  null,
    isActive:  true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastSeenAt: serverTimestamp(),
  });
}

/** Real-time listener on a user's profile */
export function subscribeToUser(uid, callback) {
  return onSnapshot(doc(db, 'users', uid), snap => {
    if (snap.exists()) callback({ id: snap.id, ...snap.data() });
  });
}

/** Update volunteer profile fields */
export async function updateUserProfile(uid, fields) {
  await updateDoc(doc(db, 'users', uid), {
    ...fields,
    updatedAt: serverTimestamp(),
  });
}

/** Update FCM token */
export async function updateFcmToken(uid, token) {
  await updateDoc(doc(db, 'users', uid), {
    fcmToken:     token,
    fcmUpdatedAt: serverTimestamp(),
  });
}

/* ─── Needs (Tasks) ─────────────────────────────────────────────────────────── */

/** Real-time listener: top ACTIVE need by urgency for HomeScreen urgent banner */
export function subscribeToUrgentNeed(callback) {
  const q = query(
    Col.needs(),
    where('status', '==', 'ACTIVE'),
  );
  return onSnapshot(q, snap => {
    // Sort client-side to avoid composite index requirement
    const needs = snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter(n => !n.assignedTo)
      .sort((a, b) => (b.urgencyScore || 0) - (a.urgencyScore || 0));
    callback(needs[0] || null);
  });
}

/** Real-time listener: needs filtered by status for TasksScreen */
export function subscribeToNeeds(ward, status, callback) {
  // Fetch all needs — filter client-side to avoid nested map query issues
  const q = query(Col.needs());
  return onSnapshot(q, snap => {
    let needs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    // Filter by status client-side
    if (status && status !== 'All') {
      needs = needs.filter(n => n.status === status.toUpperCase());
    }
    // Sort by urgency descending
    needs.sort((a, b) => (b.urgencyScore || 0) - (a.urgencyScore || 0));
    callback(needs);
  });
}

/** Get a single need by ID */
export async function getNeed(needId) {
  const snap = await getDoc(doc(db, 'needs', needId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

/** Volunteer accepts a task — uses transaction to prevent double-accept race condition */
export async function acceptTask(needId, uid) {
  const needRef  = doc(db, 'needs', needId);
  const userRef  = doc(db, 'users', uid);

  await runTransaction(db, async (tx) => {
    const snap = await tx.get(needRef);
    if (!snap.exists()) throw new Error('Task not found');
    if (snap.data().assignedTo) throw new Error('This task has already been accepted by another volunteer');

    tx.update(needRef, {
      status:       'IN_PROGRESS',
      stepperState: 'ACCEPTED',
      assignedTo:   uid,
      assignedAt:   serverTimestamp(),
      updatedAt:    serverTimestamp(),
    });
  });

  // Increment active task count on the user profile
  await updateDoc(userRef, {
    'stats.activeTask': increment(1),
    updatedAt:          serverTimestamp(),
  });
}

/** Volunteer completes a task — updates task state + user stats */
export async function completeTask(needId, uid, outcome, taskTitle = '', impactDelta = 10) {
  // Update the need document
  await updateDoc(doc(db, 'needs', needId), {
    status:       'CLOSED',
    stepperState: 'DONE',
    completedAt:  serverTimestamp(),
    updatedAt:    serverTimestamp(),
  });

  // Update user stats atomically: +1 tasksDone, -1 activeTask, +impactDelta impactScore
  await updateDoc(doc(db, 'users', uid), {
    'stats.tasksDone':   increment(1),
    'stats.activeTask':  increment(-1),
    'stats.impactScore': increment(impactDelta),
    updatedAt:           serverTimestamp(),
  });

  // Log the activity with real task title
  await logActivity(uid, {
    needId,
    action:      'COMPLETED',
    taskTitle:   taskTitle || 'Field task',
    outcome,
    impactDelta,
    iconType:    'CHECK',
  });
}

/** Volunteer declines a task — resets task + decrements user active count */
export async function declineTask(needId, uid, taskTitle = '') {
  await updateDoc(doc(db, 'needs', needId), {
    status:       'ACTIVE',
    stepperState: 'DISPATCHED',
    assignedTo:   null,
    updatedAt:    serverTimestamp(),
  });

  // Decrement active task count
  await updateDoc(doc(db, 'users', uid), {
    'stats.activeTask': increment(-1),
    updatedAt:          serverTimestamp(),
  });

  await logActivity(uid, {
    needId,
    action:      'DECLINED',
    taskTitle:   taskTitle || 'Field task',
    outcome:     'Task returned to pool',
    iconType:    'X',
    impactDelta: 0,
  });
}

/* ─── Reports ───────────────────────────────────────────────────────────────── */

/** Submit a new field report and create a corresponding task (need) */
export async function submitReport(uid, reportData) {
  const timestamp = serverTimestamp();
  
  // 1. Create the Report
  const reportDoc = await addDoc(Col.reports(), {
    submittedBy:    uid,
    category:       reportData.category || null,
    urgencyLevel:   reportData.urgency || null,
    description:    reportData.description || '',
    language:       'auto',
    location: {
      ward:         'Ward 4',
      area:         'Nagar Road, Solapur',
      autoDetected: true,
    },
    photoUrl:        null,
    voiceNoteUrl:    null,
    pipelineStatus:  'SCORED',
    pipelineSteps: [
      { step: 'QUEUED',     done: true,  timestamp: Timestamp.now() },
      { step: 'PARSING',    done: true,  timestamp: Timestamp.now() },
      { step: 'EXTRACTING', done: true,  timestamp: Timestamp.now() },
      { step: 'SCORED',     done: true,  timestamp: Timestamp.now() },
      { step: 'MATCHED',    done: false, timestamp: null },
    ],
    linkedNeedId:   null,
    syncStatus:     'SYNCED',
    submittedAt:    timestamp,
  });

  // 2. Map urgency level to numeric score
  const urgencyScores = { critical: 92, high: 78, medium: 55, low: 35 };
  const score = urgencyScores[reportData.urgency?.toLowerCase()] || 50;

  // 3. Create the corresponding Need (Task) so it's visible to others
  // Use user's ward if provided, else default
  const ward = reportData.ward || 'Ward 4';
  const area = reportData.area || 'Nagar Road';

  // Build a readable title from description (max 60 chars, no trailing ...)
  const rawTitle = reportData.description?.trim();
  const title = rawTitle
    ? (rawTitle.length > 60 ? rawTitle.slice(0, 57) + '…' : rawTitle)
    : `${(reportData.category || 'General').charAt(0).toUpperCase() + (reportData.category || 'general').slice(1)} assistance needed in ${ward}`;

  const needDoc = await addDoc(Col.needs(), {
    title,
    description:      reportData.description || '',
    category:         (reportData.category || 'GENERAL').toUpperCase(),
    location:         `${ward}, ${area}`,
    distance:         reportData.distance || 'Nearby',
    urgency:          score,
    urgencyScore:     score,
    urgencyLabel:     (reportData.urgency || 'MEDIUM').toUpperCase(),
    status:           'ACTIVE',
    stepperState:     'DISPATCHED',
    assignedTo:       null,
    createdBy:        uid,
    reporterName:     reportData.reporterName || 'Volunteer',
    reporterInitials: reportData.reporterInitials || 'V',
    reportId:         reportDoc.id,
    createdAt:        timestamp,
    updatedAt:        timestamp,
  });

  // 4. Link the need back to the report
  await updateDoc(doc(db, 'reports', reportDoc.id), {
    linkedNeedId: needDoc.id
  });

  return reportDoc.id;
}

/** Real-time listener for report pipeline status */
export function subscribeToReport(reportId, callback) {
  return onSnapshot(doc(db, 'reports', reportId), snap => {
    if (snap.exists()) callback({ id: snap.id, ...snap.data() });
  });
}

/* ─── Activity Log ──────────────────────────────────────────────────────────── */

/** Write an activity log entry */
export async function logActivity(uid, { action, taskTitle = '', outcome = '', needId = null, impactDelta = 0, iconType = 'CHECK' } = {}) {
  await addDoc(Col.activityLog(), {
    userId: uid,
    action,
    taskTitle,
    outcome,
    needId,
    impactDelta,
    iconType,
    timestamp: serverTimestamp(),
  });
}

/** Real-time listener: last N activity entries for a user */
export function subscribeToActivity(uid, count = 4, callback) {
  // Single where clause only — no composite index needed
  const q = query(Col.activityLog(), where('userId', '==', uid));
  return onSnapshot(q, snap => {
    // Sort by timestamp descending client-side, take top N
    const logs = snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .sort((a, b) => {
        const ta = a.timestamp?.toMillis?.() || 0;
        const tb = b.timestamp?.toMillis?.() || 0;
        return tb - ta;
      })
      .slice(0, count);
    callback(logs);
  });
}

/* ─── App Config ────────────────────────────────────────────────────────────── */

/** Real-time listener for global app config (AI pipeline strip, feature flags) */
export function subscribeToAppConfig(callback) {
  return onSnapshot(doc(db, 'app_config', 'global'), snap => {
    if (snap.exists()) callback(snap.data());
  });
}

/* ─── Notifications ─────────────────────────────────────────────────────────── */

/** Count unread notifications for bell badge */
export function subscribeToUnreadCount(uid, callback) {
  const q = query(
    Col.notifications(),
    where('targetUserId', '==', uid),
    where('read', '==', false),
  );
  return onSnapshot(q, snap => callback(snap.size));
}

/** Mark a notification as read */
export async function markNotificationRead(notifId) {
  await updateDoc(doc(db, 'notifications', notifId), {
    read:   true,
    readAt: serverTimestamp(),
  });
}
