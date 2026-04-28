/**
 * HomeScreen — exact match of stitch_remix_of_remix_of_google (4)
 *
 * Layout (top → bottom):
 *  1. Top Bar: "Good morning, Rahul" + Ward 4 badge | bell (red dot) + RK avatar
 *  2. Stats Row: 3 colored tiles (Tasks Done / Active Task / Impact Score)
 *  3. Urgent Task Banner: red left accent, FOOD + URGENT badges, Accept Now CTA
 *  4. Recent Activity: section header + "VIEW ALL" + 4 individual white cards
 *  5. Spotlight Banner: full-width dark blue card, "Coordinate..." + LEARN MORE
 */
import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  Pressable, Animated, StatusBar, ActivityIndicator, Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import {
  BellIcon, CheckCircleIcon, XCircleIcon,
  ActivityIcon, TrendingUpIcon, StarIcon,
  AlertTriangleIcon, MapPinIcon, WifiIcon, BrainIcon, ClockIcon, ClipboardIcon,
} from '../components/Icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppContext';

/* ─── Data ───────────────────────────────────────────────────────────────────── */
const STATS = [
  {
    value: '12',
    label: 'TASKS DONE',
    sub: '+3 last month',
    bg: '#EAF3DE',
    accent: '#27500A',
    textColor: '#27500A',
    subColor: '#27500A',
    Icon: TrendingUpIcon,
  },
  {
    value: '1',
    label: 'ACTIVE\nTASK',
    sub: 'pending acceptance',
    bg: '#FFF8E1',
    accent: '#633806',
    textColor: '#633806',
    subColor: '#633806',
    dot: '#EF9F27',
  },
  {
    value: '74',
    label: 'IMPACT\nSCORE',
    sub: '+8 this week',
    bg: '#E1F5EE',
    accent: '#085041',
    textColor: '#085041',
    subColor: '#085041',
    star: true,
  },
];

const ACTIVITY = [
  {
    Icon: CheckCircleIcon,
    iconBg: Colors.primaryFixed,
    iconColor: Colors.primary,
    title: 'Food task completed · Ward 4',
    sub: '5 families assisted',
    time: '2 DAYS AGO',
  },
  {
    Icon: XCircleIcon,
    iconBg: Colors.errorContainer,
    iconColor: Colors.error,
    title: 'Health task declined · Ward 3',
    sub: 'Reassigned to volunteer',
    time: '4 DAYS AGO',
  },
  {
    Icon: CheckCircleIcon,
    iconBg: Colors.primaryFixed,
    iconColor: Colors.primary,
    title: 'Shelter assessment closed · Ward 4',
    sub: 'Documentation submitted',
    time: '1 WEEK AGO',
  },
  {
    Icon: CheckCircleIcon,
    iconBg: Colors.primaryFixed,
    iconColor: Colors.primary,
    title: 'Education tutoring done · Ward 2',
    sub: 'Session 4 of 10',
    time: '2 WEEKS AGO',
  },
];

/* ─── Screen ─────────────────────────────────────────────────────────────────── */
export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { userProfile } = useAuth();
  const { urgentNeed, recentActivity, appConfig, unreadCount } = useAppData();

  const firstName = userProfile?.displayName?.split(' ')[0] || 'Volunteer';
  const ward      = userProfile?.ward || 'Ward 4';
  const initials  = userProfile?.avatarInitials || firstName.slice(0, 2).toUpperCase();
  const sts       = userProfile?.stats || { tasksDone: 0, activeTask: 0, impactScore: 0 };

  function timeAgo(ts) {
    if (!ts) return '';
    const ms = Date.now() - (ts.toMillis?.() || 0);
    const m  = Math.floor(ms / 60000);
    if (m < 1)  return 'JUST NOW';
    if (m < 60) return `${m}M AGO`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}H AGO`;
    return `${Math.floor(h / 24)}D AGO`;
  }
  function greeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  }

  const activeTaskCount = Math.max(0, sts.activeTask || 0);
  const STAT_TILES = [
    { value: String(sts.tasksDone || 0),  label: 'TASKS DONE',   sub: 'Lifetime total',
      bg: '#EAF3DE', accent: '#27500A', textColor: '#27500A', subColor: '#27500A', star: false, dot: null },
    { value: String(activeTaskCount), label: 'ACTIVE\nTASK', sub: activeTaskCount > 0 ? 'In progress' : 'None pending',
      bg: '#FFF8E1', accent: '#633806', textColor: '#633806', subColor: '#633806', dot: activeTaskCount > 0 ? '#EF9F27' : null, star: false },
    { value: String(sts.impactScore || 0), label: 'IMPACT\nSCORE', sub: 'Community points',
      bg: '#E1F5EE', accent: '#085041', textColor: '#085041', subColor: '#085041', star: true, dot: null },
  ];

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surfaceContainerLow} />

      {/* ── Top App Bar ─────────────────────────────────────────────────────── */}
      <View style={[styles.topBar, { paddingTop: insets.top + 10 }]}>
        {/* Left: greeting */}
        <View style={styles.topLeft}>
          <Image 
            source={require('../../assets/icon.png')} 
            style={styles.headerLogo} 
            resizeMode="cover"
          />
          <View>
            <Text style={styles.greeting}>{greeting()}, {firstName}</Text>
            <View style={styles.wardBadge}><Text style={styles.wardTxt}>{ward}</Text></View>
          </View>
        </View>

        {/* Right: bell + synced badge + avatar */}
        <View style={styles.topRight}>
          <View style={styles.syncedBadge}>
            <WifiIcon size={11} color={Colors.primary} strokeWidth={2.5} />
            <Text style={styles.syncedTxt}>{appConfig ? 'SYNCED' : 'SYNCING…'}</Text>
          </View>
          <Pressable style={styles.bellWrap}>
            <BellIcon size={22} color={Colors.onSurfaceVariant} strokeWidth={1.75} />
            {unreadCount > 0 && <View style={styles.bellDot} />}
          </Pressable>
          <Pressable style={styles.avatar} onPress={() => navigation.navigate('Profile')}>
            <Text style={styles.avatarTxt}>{initials}</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 110 }]}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Stats Row: 3 color tiles ───────────────────────────────────── */}
        <View style={styles.statsRow}>
          {STAT_TILES.map((s, i) => (
            <View key={i} style={[styles.statTile, { backgroundColor: s.bg, borderLeftColor: s.accent }]}>
              <View style={styles.statValueRow}>
                <Text style={[styles.statValue, { color: s.textColor }]}>{s.value}</Text>
                {s.dot && <View style={[styles.statDot, { backgroundColor: s.dot }]} />}
                {s.star && <StarIcon size={16} color={s.textColor} strokeWidth={0} fill={s.textColor} />}
              </View>
              <Text style={[styles.statLabel, { color: s.textColor }]}>{s.label}</Text>
              <Text style={[styles.statSub, { color: s.subColor }]}>{s.sub}</Text>
            </View>
          ))}
        </View>

        {urgentNeed ? (
          <View style={styles.urgentCard}>
            <View style={styles.urgentAccent} />
            <View style={styles.urgentBody}>
              <View style={styles.urgentBadges}>
                <View style={styles.foodBadge}>
                  <Text style={styles.foodBadgeTxt}>{urgentNeed.category}</Text>
                </View>
                <View style={styles.urgentBadge}>
                  <AlertTriangleIcon size={11} color="#791F1F" strokeWidth={2.5} />
                  <Text style={styles.urgentBadgeTxt}>{urgentNeed.urgencyLabel || 'URGENT'}</Text>
                </View>
              </View>
              <Text style={styles.urgentTitle}>{urgentNeed.title}</Text>
              <Text style={styles.urgentDesc}>
                {urgentNeed.location?.area || urgentNeed.location?.ward || 'Field area'}
              </Text>
              <View style={styles.urgentFooter}>
                <Text style={styles.urgentTime}>Score: {urgentNeed.urgencyScore ?? '–'}</Text>
                <Pressable
                  style={styles.acceptBtn}
                  onPress={() => navigation.navigate('TaskDetail', { taskId: urgentNeed.id, task: urgentNeed })}
                >
                  <Text style={styles.acceptBtnTxt}>Accept now</Text>
                </Pressable>
              </View>
            </View>
          </View>
        ) : (
          <View style={[styles.urgentCard, { opacity: 0.55 }]}>
            <View style={styles.urgentAccent} />
            <View style={styles.urgentBody}>
              <Text style={styles.urgentTitle}>No urgent tasks right now ✨</Text>
              <Text style={styles.urgentDesc}>All needs are assigned — check Tasks tab for updates</Text>
            </View>
          </View>
        )}

        {/* ── AI Pipeline Active strip ───────────────────────────────── */}
        <View style={styles.aiStrip}>
          <View style={[styles.aiStripAccent]} />
          <View style={styles.aiStripBody}>
            <View style={styles.aiStripIconBox}>
              <BrainIcon size={18} color={Colors.secondary} strokeWidth={1.75} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.aiStripTitle}>AI Pipeline Active</Text>
              <Text style={styles.aiStripSub}>
                3 new needs scored · 2 volunteers matched · 1 report processing
              </Text>
            </View>
          </View>
        </View>

        {/* ── Recent Activity ────────────────────────────────────────────── */}
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Recent activity</Text>
          <Pressable onPress={() => navigation.navigate('Tasks')}>
            <Text style={styles.viewAll}>VIEW ALL</Text>
          </Pressable>
        </View>

        <View style={styles.activityList}>
          {recentActivity.length > 0 ? recentActivity.map((item, i) => {
            const isCompleted = item.action === 'COMPLETED';
            const isReported  = item.action === 'REPORTED';
            const iconBg = isCompleted ? Colors.primaryFixed
              : isReported ? Colors.secondaryContainer || '#DDF4EB'
              : Colors.errorContainer;
            const icon = isCompleted
              ? <CheckCircleIcon size={20} color={Colors.primary} strokeWidth={2} />
              : isReported
              ? <ClipboardIcon   size={20} color={Colors.secondary} strokeWidth={2} />
              : <XCircleIcon     size={20} color={Colors.error}     strokeWidth={2} />;
            return (
              <Pressable key={item.id || i} style={styles.actCard}>
                <View style={[styles.actIcon, { backgroundColor: iconBg }]}>
                  {icon}
                </View>
                <View style={styles.actContent}>
                  <Text style={styles.actTitle}>
                    {item.taskTitle || item.needId || 'Task activity'}
                  </Text>
                  <Text style={styles.actSub}>{item.outcome || item.action}</Text>
                </View>
                <Text style={styles.actTime}>
                  {item.timestamp ? timeAgo(item.timestamp) : ''}
                </Text>
              </Pressable>
            );
          }) : (
            <View style={styles.actCard}>
              <View style={[styles.actIcon, { backgroundColor: Colors.surfaceContainerHigh }]}>
                <ActivityIcon size={20} color={Colors.outline} strokeWidth={2} />
              </View>
              <View style={styles.actContent}>
                <Text style={styles.actTitle}>No activity yet</Text>
                <Text style={styles.actSub}>Complete your first task to see history</Text>
              </View>
            </View>
          )}
        </View>

        {/* ── Spotlight Banner: Coordinator ─────────────────────────────── */}
        <Pressable style={styles.spotlight}>
          <LinearGradient
            colors={['#1A3A5C', '#1960a6', '#2474CC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.spotlightInner}
          >
            <View style={styles.spotlightContent}>
              <Text style={styles.spotlightTitle}>Coordinate regional logistics</Text>
              <Text style={styles.spotlightSub}>New coordinator training opens soon</Text>
            </View>
            <View style={styles.learnBtn}>
              <Text style={styles.learnBtnTxt}>LEARN MORE</Text>
            </View>
          </LinearGradient>
        </Pressable>

      </ScrollView>
    </View>
  );
}

/* ─── Styles ─────────────────────────────────────────────────────────────────── */
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLow,
  },

  syncedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.primaryFixed + '80',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  syncedTxt: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.6,
  },

  /* Top bar */
  topBar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: 'rgba(239,245,239,0.85)',
  },
  topLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerLogo: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  greeting: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.onSurface,
    marginBottom: 4,
  },
  wardBadge: {
    backgroundColor: '#E1F5EE',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  wardTxt: {
    fontSize: 12,
    fontWeight: '600',
    color: '#085041',
  },
  topRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 2,
  },
  bellWrap: { position: 'relative' },
  bellDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error,
    borderWidth: 1.5,
    borderColor: Colors.surfaceContainerLow,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarTxt: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },

  /* Scroll */
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 16,
  },

  /* Stats 3-column row */
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statTile: {
    flex: 1,
    height: 128,
    borderRadius: 12,
    borderLeftWidth: 4,
    padding: 14,
    justifyContent: 'space-between',
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  statDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
    lineHeight: 14,
    textTransform: 'uppercase',
  },
  statSub: {
    fontSize: 10,
    fontWeight: '700',
  },

  /* Urgent card */
  urgentCard: {
    backgroundColor: '#FFFBFB',
    borderRadius: 12,
    flexDirection: 'row',
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  urgentAccent: {
    width: 4,
    backgroundColor: '#E24B4A',
  },
  urgentBody: {
    flex: 1,
    padding: 16,
    gap: 8,
  },
  urgentBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  foodBadge: {
    backgroundColor: '#FAEEDA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  foodBadgeTxt: {
    fontSize: 10,
    fontWeight: '700',
    color: '#633806',
    letterSpacing: 0.8,
  },
  urgentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FCEBEB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  urgentBadgeTxt: {
    fontSize: 10,
    fontWeight: '700',
    color: '#791F1F',
    letterSpacing: 0.8,
  },
  urgentTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    lineHeight: 22,
  },
  urgentDesc: {
    fontSize: 13,
    color: '#666666',
  },
  urgentFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  urgentTime: {
    fontSize: 11,
    color: '#999999',
    fontWeight: '500',
  },
  acceptBtn: {
    backgroundColor: '#1D9E75',
    paddingHorizontal: 20,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptBtnTxt: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },

  /* AI Pipeline Active strip */
  aiStrip: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 12,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  aiStripAccent: {
    width: 4,
    backgroundColor: Colors.secondary,
  },
  aiStripBody: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  aiStripIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.secondaryFixed + '30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiStripTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.secondary,
  },
  aiStripSub: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
    lineHeight: 16,
  },

  /* Section header */
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: -4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.onSurface,
  },
  viewAll: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.6,
  },

  /* Activity cards — individual white cards (not grouped) */
  activityList: {
    gap: 10,
  },
  actCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  actIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actContent: { flex: 1 },
  actTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.onSurface,
    lineHeight: 18,
  },
  actSub: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  actTime: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.outline,
    letterSpacing: 0.3,
  },

  /* Spotlight banner */
  spotlight: {
    borderRadius: 16,
    overflow: 'hidden',
    height: 160,
  },
  spotlightInner: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  spotlightContent: { gap: 4 },
  spotlightTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    lineHeight: 26,
  },
  spotlightSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  learnBtn: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  learnBtnTxt: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 1,
  },
});
