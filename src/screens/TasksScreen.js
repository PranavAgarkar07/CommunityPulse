/**
 * TasksScreen — exact match of Stitch "Volunteer: My Tasks List"
 * Exact tasks from Stitch HTML:
 * 1. Deliver food supplies — 5 families in Nagar Road (CRITICAL, FOOD, ACTIVE)
 * 2. Medical check-up coordination — elderly residents (HIGH, HEALTH, ACTIVE)
 * 3. Temporary roof repair assessment — 3 homes (MEDIUM, SHELTER, ACTIVE)
 * 4. Tutoring session — Sunflower School (LOW, EDUCATION, CLOSED)
 * 5. Street lighting hazard report — Main Road junction (MEDIUM, SAFETY, PENDING)
 */
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  Pressable, Animated, StatusBar,
} from 'react-native';
import { Colors, Typography, Radius, Shadow } from '../theme/colors';
import {
  AlertTriangleIcon, CheckCircleIcon, ActivityIcon,
  ClipboardIcon, MapPinIcon, ChevronRightIcon, BrainIcon,
  UsersIcon, ShieldIcon,
} from '../components/Icons';
import { useAppData } from '../context/AppContext';

const FILTER_TABS = ['All', 'Active', 'In Progress', 'Closed'];

function UrgencyBar({ value, color, delay = 0 }) {
  const w = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(w, { toValue: value, duration: 700, delay, useNativeDriver: false }).start();
  }, []);
  return (
    <View style={styles.barBg}>
      <Animated.View style={[styles.barFill, {
        backgroundColor: color,
        width: w.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }),
      }]} />
    </View>
  );
}

function TaskCard({ task, index, navigation }) {
  const scaleAnim = useRef(new Animated.Value(0.97)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, tension: 80, friction: 10, delay: index * 70, useNativeDriver: true }),
      Animated.timing(fadeAnim,  { toValue: 1, duration: 400, delay: index * 70, useNativeDriver: true }),
    ]).start();
  }, []);

  const isClosed = task.status === 'CLOSED';
  const score    = task.urgencyScore ?? task.urgency ?? 0;

  // Urgency colour derived from numeric score
  const urgencyColor = isClosed ? Colors.primary
    : score >= 80 ? Colors.urgent
    : score >= 60 ? Colors.high
    : score >= 40 ? Colors.medium
    : Colors.primary;

  const urgencyLabel = task.urgencyLabel
    || (score >= 80 ? 'CRITICAL' : score >= 60 ? 'HIGH' : score >= 40 ? 'MEDIUM' : 'LOW');

  // Closed tasks get a muted, completed style
  if (isClosed) {
    return (
      <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
        <Pressable
          style={[styles.taskCard, styles.taskCardClosed, Shadow.soft]}
          onPress={() => navigation.navigate('TaskDetail', { taskId: task.id, task })}
        >
          {/* Green left accent = completed */}
          <View style={[styles.taskAccent, { backgroundColor: Colors.primary }]} />

          {/* Checkmark icon */}
          <View style={[styles.taskIconBox, { backgroundColor: Colors.primaryFixed }]}>
            <CheckCircleIcon size={20} color={Colors.primary} strokeWidth={2} />
          </View>

          {/* Content */}
          <View style={styles.taskContent}>
            {/* Badges */}
            <View style={styles.taskBadges}>
              <View style={[styles.urgencyChip, { backgroundColor: Colors.outline + '20' }]}>
                <Text style={[styles.urgencyChipTxt, { color: Colors.outline }]}>{urgencyLabel}</Text>
              </View>
              <View style={styles.catChip}>
                <Text style={styles.catChipTxt}>{task.category}</Text>
              </View>
              {/* CLOSED badge — distinct green pill */}
              <View style={styles.closedStatusChip}>
                <Text style={styles.closedStatusTxt}>✓ DONE</Text>
              </View>
            </View>

            {/* Title — muted + strikethrough-ish via color */}
            <Text style={styles.taskTitleClosed} numberOfLines={2}>
              {task.title}
            </Text>

            {/* Location */}
            <View style={styles.locRow}>
              <MapPinIcon size={12} color={Colors.outline} strokeWidth={2} />
              <Text style={[styles.locTxt, { color: Colors.outline }]}>{task.location} · {task.distance}</Text>
            </View>

            {/* Completed score row */}
            <View style={styles.scoreRow}>
              <Text style={[styles.scoreLabel, { color: Colors.outline }]}>URGENCY SCORE</Text>
              <Text style={[styles.scoreNum, { color: Colors.outline }]}>{score}/100</Text>
            </View>
            {/* Greyed-out full bar to show the task is done */}
            <View style={styles.barBg}>
              <View style={[styles.barFill, { width: `${score}%`, backgroundColor: Colors.outline + '60' }]} />
            </View>
          </View>

          {/* Chevron */}
          <View style={styles.chevronWrap}>
            <ChevronRightIcon size={16} color={Colors.outline} strokeWidth={2} />
          </View>
        </Pressable>
      </Animated.View>
    );
  }

  // ── Active / In-Progress tasks ──
  const iconBg = urgencyColor + '18';

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
      <Pressable
        style={[styles.taskCard, Shadow.soft]}
        onPress={() => navigation.navigate('TaskDetail', { taskId: task.id, task })}
      >
        {/* Left accent bar */}
        <View style={[styles.taskAccent, { backgroundColor: urgencyColor }]} />

        {/* Icon box */}
        <View style={[styles.taskIconBox, { backgroundColor: iconBg }]}>
          <AlertTriangleIcon size={20} color={urgencyColor} strokeWidth={1.75} />
        </View>

        {/* Content */}
        <View style={styles.taskContent}>
          {/* Badges */}
          <View style={styles.taskBadges}>
            <View style={[styles.urgencyChip, { backgroundColor: urgencyColor + '18' }]}>
              <Text style={[styles.urgencyChipTxt, { color: urgencyColor }]}>{urgencyLabel}</Text>
            </View>
            <View style={styles.catChip}>
              <Text style={styles.catChipTxt}>{task.category}</Text>
            </View>
            <View style={[styles.statusChip, {
              backgroundColor: task.status === 'IN_PROGRESS'
                ? '#FFF3CD' : Colors.primary + '18',
            }]}>
              <Text style={[styles.statusChipTxt, {
                color: task.status === 'IN_PROGRESS' ? '#856404' : Colors.primary,
              }]}>
                {task.status === 'IN_PROGRESS' ? 'IN PROGRESS' : task.status}
              </Text>
            </View>
          </View>

          {/* Title */}
          <Text style={styles.taskTitle} numberOfLines={2}>
            {task.title}
          </Text>

          {/* Location */}
          <View style={styles.locRow}>
            <MapPinIcon size={12} color={Colors.outline} strokeWidth={2} />
            <Text style={styles.locTxt}>{task.location} · {task.distance}</Text>
          </View>

          {/* Urgency score + animated bar */}
          <View style={styles.scoreRow}>
            <Text style={styles.scoreLabel}>URGENCY SCORE</Text>
            <Text style={[styles.scoreNum, { color: urgencyColor }]}>{score}/100</Text>
          </View>
          <UrgencyBar value={score} color={urgencyColor} delay={index * 70} />
        </View>

        {/* Arrow button */}
        <View style={styles.chevronWrap}>
          <ChevronRightIcon size={16} color={Colors.primary} strokeWidth={2.5} />
        </View>
      </Pressable>
    </Animated.View>
  );
}


export default function TasksScreen({ navigation }) {
  const [filter, setFilter] = useState('All');
  const { tasks: liveTasks, dataLoading } = useAppData();

  // Use live tasks; fall back gracefully to empty while loading
  const allTasks = liveTasks || [];
  const filtered = filter === 'All'        ? allTasks
    : filter === 'Active'                  ? allTasks.filter(t => t.status === 'ACTIVE')
    : filter === 'In Progress'             ? allTasks.filter(t => t.status === 'IN_PROGRESS')
    : filter === 'Closed'                  ? allTasks.filter(t => t.status === 'CLOSED')
    : allTasks;
  const activeCount = allTasks.filter(t => t.status === 'ACTIVE' || t.status === 'IN_PROGRESS').length;


  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My Tasks</Text>
          <Text style={styles.subtitle}>Field assignments in your zone</Text>
        </View>
        <View style={styles.activeBadge}>
          <AlertTriangleIcon size={13} color={Colors.urgent} strokeWidth={2.5} />
          <Text style={styles.activeBadgeTxt}>{activeCount} ACTIVE</Text>
        </View>
      </View>

      {/* Filter tabs */}
      <View style={styles.filterRow}>
        {FILTER_TABS.map(tab => (
          <Pressable
            key={tab}
            style={[styles.filterTab, filter === tab && styles.filterTabActive]}
            onPress={() => setFilter(tab)}
          >
            {filter === tab && <View style={styles.filterDot} />}
            <Text style={[styles.filterTxt, filter === tab && styles.filterTxtActive]}>{tab}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {filtered.map((task, i) => (
          <TaskCard key={task.id} task={task} index={i} navigation={navigation} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surfaceContainerLow },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16,
    backgroundColor: Colors.surfaceContainerLowest,
  },
  title: { fontSize: 26, fontWeight: '800', color: Colors.onSurface, letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: Colors.onSurfaceVariant, marginTop: 2 },
  activeBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.errorContainer,
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: Radius.full,
  },
  activeBadgeTxt: { fontSize: 11, fontWeight: '700', color: Colors.urgent },
  filterRow: {
    flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: Colors.surfaceContainerLowest,
    borderBottomWidth: 1, borderBottomColor: Colors.surfaceContainerLow,
  },
  filterTab: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radius.full,
    backgroundColor: Colors.surfaceContainerLow,
  },
  filterTabActive: { backgroundColor: Colors.primary },
  filterDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: Colors.primaryFixed },
  filterTxt: { fontSize: 13, fontWeight: '500', color: Colors.onSurfaceVariant },
  filterTxtActive: { color: '#FFF', fontWeight: '700' },
  scroll: { flex: 1 },
  scrollContent: { padding: 14, paddingBottom: 100, gap: 10 },
  taskCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radius.xl, flexDirection: 'row',
    overflow: 'hidden', alignItems: 'stretch',
  },
  taskAccent: { width: 4 },
  taskIconBox: {
    width: 48, height: 48, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center',
    alignSelf: 'center', marginLeft: 14,
  },
  taskContent: { flex: 1, padding: 14, paddingRight: 6 },
  taskBadges: { flexDirection: 'row', gap: 6, marginBottom: 8, flexWrap: 'wrap' },
  urgencyChip: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: Radius.full },
  urgencyChipTxt: { fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },
  catChip: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: Radius.full, backgroundColor: Colors.surfaceContainerLow },
  catChipTxt: { fontSize: 9, fontWeight: '600', color: Colors.onSurfaceVariant },
  statusChip: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: Radius.full },
  statusChipTxt: { fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },
  taskTitle: { fontSize: 13, fontWeight: '700', color: Colors.onSurface, lineHeight: 18, marginBottom: 6 },
  taskTitleClosed: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.outline,
    lineHeight: 18,
    marginBottom: 6,
    textDecorationLine: 'line-through',
    textDecorationColor: Colors.outline,
  },

  /* Closed card — subtle muted background */
  taskCardClosed: {
    backgroundColor: Colors.surfaceContainerLow,
    opacity: 0.85,
  },

  /* ✓ DONE badge */
  closedStatusChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryFixed,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  closedStatusTxt: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.4,
  },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 10 },
  locTxt: { fontSize: 11, color: Colors.onSurfaceVariant, flex: 1 },
  closedLbl: { fontSize: 11, color: Colors.statusClosed, fontStyle: 'italic' },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  scoreLabel: { fontSize: 9, fontWeight: '700', color: Colors.outline, letterSpacing: 1 },
  scoreNum: { fontSize: 11, fontWeight: '800' },
  barBg: { height: 4, backgroundColor: Colors.surfaceContainerHigh, borderRadius: Radius.full, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: Radius.full },
  chevronWrap: {
    alignSelf: 'center',
    marginRight: 14,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
