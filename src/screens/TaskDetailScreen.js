/**
 * TaskDetailScreen — exact match of stitch_remix_of_remix_of_google (3)
 *
 * Sections (top → bottom):
 *  1. Top App Bar — "← Task Detail" + share icon (mint bg, no gradient)
 *  2. Hero card — FOOD badge + urgency score, title, location, time assigned
 *  3. Status Stepper — Dispatched → Accepted → In Progress → Done
 *  4. What's Needed card — description text + reporter attribution row
 *  5. Map placeholder — teal tinted card, distance info + "Open in Maps"
 *  6. Completion Form card — textarea + photo button + "Mark as complete" CTA
 *
 * Design: mint bg, white cards with 4px green left accent, 16px radius,
 * 20px padding, uppercase labels, 8pt spacing grid.
 */
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable,
  StatusBar, TextInput, Animated, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme/colors';
import {
  ArrowLeftIcon, CheckCircleIcon, MapPinIcon,
  ClockIcon, CameraIcon, CheckIcon, BrainIcon, TrendingUpIcon,
  GlobeIcon, UsersIcon,
} from '../components/Icons';
import { useAuth } from '../context/AuthContext';
import { acceptTask, completeTask, getNeed } from '../services/firestoreService';

/* ─── Status stepper config ──────────────────────────────────────────────────── */
const STEPS = ['DISPATCHED', 'ACCEPTED', 'IN PROGRESS', 'DONE'];

const AI_FACTORS = [
  { label: 'Skill Match',      value: 95, color: Colors.primary },
  { label: 'Language',         value: 100, color: Colors.secondary },
  { label: 'Zone Proximity',   value: 90, color: Colors.tertiary },
  { label: 'Past Completion',  value: 98, color: Colors.primary },
  { label: 'Availability',     value: 85, color: Colors.secondary },
];

function AnimatedBar({ value, color, delay = 0 }) {
  const w = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(w, { toValue: value, duration: 800, delay, useNativeDriver: false }).start();
  }, []);
  return (
    <View style={styles.factorBarBg}>
      <Animated.View style={[styles.factorBarFill, {
        backgroundColor: color,
        width: w.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }),
      }]} />
    </View>
  );
}

/* ─── Stepper ────────────────────────────────────────────────────────────────── */
function StatusStepper({ currentStep }) {
  return (
    <View style={styles.stepperCard}>
      {/* Connecting lines behind circles */}
      <View style={styles.stepperLineContainer}>
        {STEPS.map((_, i) => {
          if (i === STEPS.length - 1) return null;
          const filled = i < currentStep;
          return (
            <View
              key={i}
              style={[styles.stepperLine, filled && styles.stepperLineFilled]}
            />
          );
        })}
      </View>

      {/* Step circles + labels */}
      <View style={styles.stepperRow}>
        {STEPS.map((label, i) => {
          const done    = i <= currentStep;
          const current = i === currentStep;
          return (
            <View key={label} style={styles.stepCol}>
              <View style={[
                styles.stepCircle,
                done    && styles.stepCircleDone,
                current && styles.stepCircleCurrent,
              ]}>
                {done
                  ? <CheckIcon size={14} color="#fff" strokeWidth={2.5} />
                  : null
                }
              </View>
              <Text style={[styles.stepLabel, done && styles.stepLabelDone]}>
                {label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

/* ─── Screen ─────────────────────────────────────────────────────────────────── */

export default function TaskDetailScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { currentUser } = useAuth();

  // Nav params may be a partial object (e.g. from HomeScreen urgent banner).
  // Use it immediately for fast render, then fetch the full doc from Firestore.
  const initialTask = route.params?.task || {
    title: 'Food emergency — Nagar Road families',
    category: 'FOOD',
    location: 'Ward 4, Nagar Road, Solapur',
    distance: '0.8 km',
    urgency: 82,
    urgencyLabel: 'CRITICAL',
    color: Colors.error,
    status: 'ACTIVE',
  };
  const taskId = route.params?.taskId || initialTask.id;

  const [task, setLocalTask] = useState(initialTask);
  const [outcome, setOutcome] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch the full Firestore document to get description, reporterName, etc.
  useEffect(() => {
    if (!taskId) return;
    getNeed(taskId)
      .then(full => { if (full) setLocalTask(prev => ({ ...prev, ...full })); })
      .catch(() => { /* keep nav-params fallback on error */ });
  }, [taskId]);

  // Map status/stepperState to step index
  const getStepIndex = (t) => {
    const s = t.stepperState || (t.status === 'ACTIVE' ? 'DISPATCHED' : t.status);
    const idx = STEPS.indexOf(s);
    return idx === -1 ? 0 : idx;
  };

  const currentStep    = getStepIndex(task);
  // Correctly distinguish who owns this task
  const isMyTask       = task.assignedTo === currentUser?.uid;
  const isTakenByOther = !!(task.assignedTo && task.assignedTo !== currentUser?.uid);
  const isCompleted    = task.status === 'CLOSED';

  const handleAccept = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await acceptTask(task.id, currentUser.uid);
      setLocalTask({ ...task, status: 'IN_PROGRESS', assignedTo: currentUser.uid, stepperState: 'ACCEPTED' });
    } catch (e) {
      Alert.alert('Could not accept task', e.message || 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!outcome.trim() || loading) return;
    setLoading(true);
    try {
      // Pass the real task title so activity feed shows human-readable text
      await completeTask(task.id, currentUser.uid, outcome, task.title);
      setLocalTask({ ...task, status: 'CLOSED', stepperState: 'DONE' });
    } catch (e) {
      Alert.alert('Could not complete task', e.message || 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const categoryColor = task.category === 'FOOD'
    ? { bg: '#FAEEDA', text: '#633806' }
    : { bg: Colors.primaryFixed, text: Colors.onSurface };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surfaceContainerLow} />

      {/* ── Top App Bar ────────────────────────────────────────────────────── */}
      <View style={styles.topBar}>
        <Pressable
          style={styles.topBarBtn}
          onPress={() => navigation.canGoBack() && navigation.goBack()}
        >
          <ArrowLeftIcon size={20} color={Colors.onSurface} strokeWidth={2} />
        </Pressable>
        <Text style={styles.topBarTitle}>Task Detail</Text>
        <View style={styles.topBarBtn} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Hero Card ──────────────────────────────────────────────────── */}
        <View style={styles.heroCard}>
          <View style={styles.cardAccent} />
          <View style={styles.heroBody}>
            {/* Badges row */}
            <View style={styles.badgeRow}>
              <View style={[styles.catBadge, { backgroundColor: categoryColor.bg }]}>
                <Text style={[styles.catBadgeTxt, { color: categoryColor.text }]}>
                  {task.category || 'FOOD'}
                </Text>
              </View>
              <View style={styles.urgencyBadge}>
                <Text style={styles.urgencyBadgeMark}>!</Text>
                <Text style={styles.urgencyBadgeTxt}>{task.urgency || task.urgencyScore || 82}</Text>
              </View>
            </View>

            {/* Title */}
            <Text style={styles.heroTitle}>{task.title}</Text>

            {/* Meta */}
            <View style={styles.metaRow}>
              <MapPinIcon size={16} color={Colors.onSurfaceVariant} strokeWidth={2} />
              <Text style={styles.metaTxt}>{task.location?.area || task.location || 'Nagar Road'}</Text>
            </View>
            <View style={styles.metaRow}>
              <ClockIcon size={16} color={Colors.onSurfaceVariant} strokeWidth={2} />
              <Text style={styles.metaTxt}>Assigned 28 minutes ago</Text>
            </View>
          </View>
        </View>

        {/* ── Status Stepper ───────────────────────────────────────── */}
        <StatusStepper currentStep={currentStep} />

        {/* ── Explainable AI Match Card ──────────────────────────────── */}
        <View style={styles.card}>
          <View style={[styles.cardAccent, { backgroundColor: Colors.secondary }]} />
          <View style={styles.cardBody}>
            {/* Header row */}
            <View style={styles.aiMatchHeader}>
              <View style={styles.aiMatchTitleRow}>
                <BrainIcon size={16} color={Colors.secondary} strokeWidth={1.75} />
                <Text style={styles.aiMatchTitle}>Explainable AI Match</Text>
              </View>
              <View style={styles.matchScoreBadge}>
                <Text style={styles.matchScoreTxt}>98% Match</Text>
              </View>
            </View>
            <Text style={styles.aiMatchSub}>Why you were selected for this need:</Text>

            <View style={{ gap: 10, marginTop: 12 }}>
              {AI_FACTORS.map((f, i) => (
                <View key={i}>
                  <View style={styles.factorRow}>
                    <Text style={styles.factorLabel}>{f.label}</Text>
                    <Text style={[styles.factorValue, { color: f.color }]}>{f.value}%</Text>
                  </View>
                  <AnimatedBar value={f.value} color={f.color} delay={i * 80} />
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* ── What's Needed ──────────────────────────────────────────────── */}
        <View style={styles.card}>
          <View style={styles.cardAccent} />
          <View style={styles.cardBody}>
            <Text style={styles.sectionLabel}>WHAT'S NEEDED</Text>
            <Text style={styles.needsTxt}>
              {task.description || '5 families near the Nagar Road well have had no food for 3 days. Elderly residents (4 people aged 65+) and young children (6 children under 10) present. Reporter confirmed physical presence on site.'}
            </Text>

            {/* Reporter attribution — uses real data from Firestore */}
            {(() => {
              const reporterName     = task.reporterName || task.createdByName || 'Volunteer';
              const reporterInitials = task.reporterInitials ||
                reporterName.split(' ').filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase();
              const createdAt = task.createdAt;
              let timeAgo = '';
              if (createdAt) {
                const ms  = Date.now() - (createdAt.toMillis?.() ?? createdAt * 1000 ?? 0);
                const min = Math.floor(ms / 60000);
                timeAgo = min < 1    ? 'just now'
                  : min < 60         ? `${min} min ago`
                  : min < 1440       ? `${Math.floor(min / 60)}h ago`
                  : `${Math.floor(min / 1440)}d ago`;
              }
              return (
                <View style={styles.reporterRow}>
                  <View style={styles.reporterAvatar}>
                    <Text style={styles.reporterAvatarTxt}>{reporterInitials}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.reporterName}>{reporterName}</Text>
                    <Text style={styles.reporterRole}>Field report</Text>
                  </View>
                  {timeAgo ? <Text style={styles.reporterTime}>{timeAgo}</Text> : null}
                </View>
              );
            })()}
          </View>
        </View>

        {/* ── Map Placeholder ────────────────────────────────────────────── */}
        <View style={styles.mapCard}>
          {/* Teal grid map background */}
          <LinearGradient
            colors={['#00503A', '#006B4A', '#007A54']}
            style={styles.mapBg}
          >
            {/* Decorative grid lines */}
            {[0, 1, 2, 3, 4].map(i => (
              <View key={`h${i}`} style={[styles.mapGridH, { top: `${20 * i}%` }]} />
            ))}
            {[0, 1, 2, 3, 4].map(i => (
              <View key={`v${i}`} style={[styles.mapGridV, { left: `${20 * i}%` }]} />
            ))}

            {/* Pin */}
            <View style={styles.mapPin}>
              <View style={styles.mapPinOuter}>
                <View style={styles.mapPinInner} />
              </View>
            </View>
          </LinearGradient>

          {/* Distance overlay bar */}
          <View style={styles.mapOverlay}>
            <View style={styles.mapDistanceRow}>
              <MapPinIcon size={14} color={Colors.primary} strokeWidth={2} />
              <Text style={styles.mapDistanceTxt}>
                {task.distance || '0.8 km'} · 10 min walk
              </Text>
            </View>
            <Pressable>
              <Text style={styles.mapOpenTxt}>OPEN IN MAPS ↗</Text>
            </Pressable>
          </View>
        </View>

        {/* ── Action Buttons (multi-user aware) ──────────────────────────── */}
        {isCompleted ? (
          /* ── Task is Done ── */
          <View style={[styles.card, styles.doneCard]}>
            <CheckCircleIcon size={24} color={Colors.primary} strokeWidth={2.5} />
            <Text style={styles.doneTxt}>Task completed! +10 impact points recorded.</Text>
          </View>

        ) : isTakenByOther ? (
          /* ── Taken by a different volunteer ── */
          <View style={styles.card}>
            <View style={[styles.cardAccent, { backgroundColor: Colors.outline }]} />
            <View style={styles.cardBody}>
              <Text style={styles.sectionLabel}>TASK STATUS</Text>
              <Text style={styles.needsTxt}>
                This task has been accepted by another volunteer and is currently in progress.
              </Text>
              <View style={[styles.takenBadge]}>
                <CheckIcon size={14} color={Colors.secondary} strokeWidth={2.5} />
                <Text style={styles.takenBadgeTxt}>IN PROGRESS — assigned to another volunteer</Text>
              </View>
            </View>
          </View>

        ) : isMyTask ? (
          /* ── I accepted this — show completion form ── */
          <View style={styles.card}>
            <View style={styles.cardAccent} />
            <View style={styles.cardBody}>
              <Text style={styles.sectionLabel}>MARK THIS TASK COMPLETE</Text>

              <TextInput
                style={styles.textarea}
                placeholder="What did you do? Who did you help? Describe the outcome..."
                placeholderTextColor={Colors.outline}
                multiline
                numberOfLines={4}
                value={outcome}
                onChangeText={setOutcome}
                textAlignVertical="top"
              />

              <Pressable style={styles.photoBtn}>
                <CameraIcon size={22} color={Colors.primary} strokeWidth={1.75} />
                <Text style={styles.photoBtnTxt}>+ ADD COMPLETION PHOTO</Text>
              </Pressable>

              <Pressable
                style={styles.completeBtn}
                onPress={handleComplete}
                disabled={loading || !outcome.trim()}
              >
                <LinearGradient
                  colors={['#00694C', '#008560']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={[styles.completeBtnInner, (loading || !outcome.trim()) && { opacity: 0.6 }]}
                >
                  <CheckCircleIcon size={20} color="#fff" strokeWidth={2.5} />
                  <Text style={styles.completeBtnTxt}>{loading ? 'Completing...' : 'Mark as complete'}</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>

        ) : (
          /* ── Available — show Accept button ── */
          <View style={styles.card}>
            <View style={styles.cardAccent} />
            <View style={styles.cardBody}>
              <Text style={styles.sectionLabel}>TAKE ACTION</Text>
              <Text style={styles.needsTxt}>Confirm you are available to handle this field assignment.</Text>

              <Pressable
                style={styles.completeBtn}
                onPress={handleAccept}
                disabled={loading}
              >
                <LinearGradient
                  colors={['#00694C', '#008560']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={[styles.completeBtnInner, loading && { opacity: 0.7 }]}
                >
                  <CheckIcon size={20} color="#fff" strokeWidth={2.5} />
                  <Text style={styles.completeBtnTxt}>{loading ? 'Accepting...' : 'Accept Task'}</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        )}


      </ScrollView>
    </View>
  );
}

/* ─── Styles ────────────────────────────────────────────────────────────────── */
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLow,
  },

  /* Top bar */
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 10,
    backgroundColor: Colors.surfaceContainerLow,
  },
  topBarBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.onSurface,
    letterSpacing: -0.3,
  },

  /* Scroll */
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 16,
  },

  /* Card shell with left accent */
  card: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 16,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  cardAccent: {
    width: 4,
    backgroundColor: Colors.primary,
  },
  cardBody: {
    flex: 1,
    padding: 20,
  },

  /* Hero card */
  heroCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 16,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  heroBody: {
    flex: 1,
    padding: 20,
    gap: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  catBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  catBadgeTxt: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  urgencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#E24B4A',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  urgencyBadgeMark: {
    fontSize: 12,
    fontWeight: '900',
    color: '#fff',
  },
  urgencyBadgeTxt: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.onSurface,
    lineHeight: 28,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaTxt: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
  },

  /* Stepper */
  stepperCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 16,
    padding: 20,
    paddingTop: 20,
  },
  stepperLineContainer: {
    position: 'absolute',
    top: 20 + 16, // card padding + half circle height
    left: 20 + 16, // card padding + half circle width
    right: 20 + 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 0,
  },
  stepperLine: {
    flex: 1,
    height: 2,
    backgroundColor: Colors.outlineVariant,
    opacity: 0.4,
  },
  stepperLineFilled: {
    backgroundColor: Colors.primary,
    opacity: 1,
  },
  stepperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    zIndex: 1,
  },
  stepCol: {
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surfaceContainerLowest,
    borderWidth: 2,
    borderColor: Colors.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleDone: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  stepCircleCurrent: {
    borderWidth: 3,
    borderColor: Colors.primaryFixed,
  },
  stepLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.outline,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  stepLabelDone: {
    color: Colors.primary,
  },

  /* Section label */
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1.5,
    marginBottom: 12,
  },

  /* What's Needed */
  needsTxt: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    lineHeight: 22,
    marginBottom: 16,
  },
  reporterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceContainerHigh,
  },
  reporterAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reporterAvatarTxt: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  reporterName: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  reporterRole: {
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    marginTop: 1,
  },
  reporterTime: {
    fontSize: 10,
    fontWeight: '500',
    color: Colors.outline,
  },

  /* Map */
  mapCard: {
    borderRadius: 16,
    overflow: 'hidden',
    height: 160,
  },
  mapBg: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapGridH: {
    position: 'absolute',
    left: 0, right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  mapGridV: {
    position: 'absolute',
    top: 0, bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  mapPin: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPinOuter: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(186,26,26,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPinInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.error,
  },
  mapOverlay: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  mapDistanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  mapDistanceTxt: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  mapOpenTxt: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.4,
  },

  /* Completion form */
  textarea: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: Colors.onSurface,
    minHeight: 100,
    marginBottom: 12,
    borderWidth: 0,
  },
  photoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.outlineVariant,
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 16,
  },
  photoBtnTxt: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.outline,
    letterSpacing: 0.8,
  },
  completeBtn: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  completeBtnInner: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  completeBtnTxt: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.2,
  },

  /* AI Match card */
  aiMatchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  aiMatchTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  aiMatchTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  matchScoreBadge: {
    backgroundColor: Colors.primaryFixed,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  matchScoreTxt: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  aiMatchSub: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    marginBottom: 4,
  },
  factorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  factorLabel: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },
  factorValue: {
    fontSize: 11,
    fontWeight: '700',
  },
  factorBarBg: {
    height: 5,
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 999,
    overflow: 'hidden',
  },
  factorBarFill: {
    height: '100%',
    borderRadius: 999,
  },

  /* Done state */
  doneCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 12,
    backgroundColor: Colors.primaryFixed,
  },
  doneTxt: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
    flex: 1,
  },

  /* Taken-by-other state */
  takenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.secondaryContainer || '#DDF4EB',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 4,
  },
  takenBadgeTxt: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.secondary,
    letterSpacing: 0.4,
    flex: 1,
  },
});
