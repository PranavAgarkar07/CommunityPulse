/**
 * ReportScreen — Restyled to match The Empathetic Engine design system
 * Mint background, white cards with left-accent bars, uppercase labels.
 */
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, TextInput,
  Animated, StatusBar, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { Colors, Radius, Shadow } from '../theme/colors';
import {
  WifiOffIcon, MapPinIcon, AlertTriangleIcon, ActivityIcon,
  ClipboardIcon, CheckCircleIcon, BrainIcon, ShieldIcon,
  CameraIcon, PlusCircleIcon, MicIcon,
} from '../components/Icons';
import { useAuth } from '../context/AuthContext';
import { submitReport, logActivity } from '../services/firestoreService';

/* ─── Data ─── */
const CATEGORIES = [
  { id: 'food',      label: 'Food',      Icon: AlertTriangleIcon, color: Colors.urgent },
  { id: 'health',    label: 'Health',    Icon: ActivityIcon,      color: Colors.secondary },
  { id: 'shelter',   label: 'Shelter',   Icon: ClipboardIcon,     color: Colors.tertiary },
  { id: 'water',     label: 'Water',     Icon: CheckCircleIcon,   color: Colors.primary },
  { id: 'education', label: 'Education', Icon: BrainIcon,         color: Colors.high },
  { id: 'safety',    label: 'Safety',    Icon: ShieldIcon,        color: Colors.medium },
];

const URGENCY_LEVELS = [
  { id: 'critical', label: 'Critical', sub: 'Life-threatening · Immediate', color: Colors.urgent },
  { id: 'high',     label: 'High',     sub: 'Needs attention today',        color: Colors.high },
  { id: 'medium',   label: 'Medium',   sub: 'Within 48 hours',              color: Colors.medium },
  { id: 'low',      label: 'Low',      sub: 'This week is fine',            color: Colors.primary },
];

/* ─── Inline tiny icons ─── */
function HeartHandIcon({ size = 20, color = Colors.primary }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
    </Svg>
  );
}

// ── AI Pipeline Success State ──────────────────────────────────────────────────
function SuccessState({ onReset }) {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  const STEPS = [
    { label: 'Queued',                       done: true,  status: 'done' },
    { label: 'Parsing (Gemini OCR)',          done: true,  status: 'done' },
    { label: 'Extracting fields',            done: true,  status: 'done' },
    { label: 'AI scored: 92 urgency',        done: true,  status: 'done' },
    { label: 'Volunteer matched → Rahul',   done: false, status: 'pending' },
  ];

  return (
    <Animated.View style={[styles.successCard, Shadow.float, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
      {/* Green left accent */}
      <View style={[styles.cardAccent, { backgroundColor: Colors.primary }]} />
      <View style={styles.successBody}>
        <View style={styles.successIcon}>
          <CheckCircleIcon size={40} color={Colors.primary} strokeWidth={1.5} />
        </View>
        <Text style={styles.successTitle}>Report Submitted!</Text>
        <Text style={styles.successSub}>AI pipeline processing your report</Text>

        <View style={styles.pipeline}>
          {STEPS.map((s, i) => (
            <View key={i} style={styles.pipelineItem}>
              <View style={[styles.pipelineDot, s.done ? styles.pipelineDotDone : styles.pipelineDotPending]} />
              {i < STEPS.length - 1 && (
                <View style={[styles.pipelineLine, s.done && styles.pipelineLineDone]} />
              )}
              <Text style={[styles.pipelineTxt, !s.done && styles.pipelineTxtPending]}>{s.label}</Text>
            </View>
          ))}
        </View>

        <Pressable style={styles.resetBtn} onPress={onReset}>
          <Text style={styles.resetTxt}>Submit Another Report</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function ReportScreen({ navigation }) {
  const { currentUser, userProfile } = useAuth();
  const [category, setCategory] = useState(null);
  const [urgency,  setUrgency]  = useState(null);
  const [desc, setDesc]         = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [descFocus, setDescFocus] = useState(false);

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 80, friction: 12, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleSubmit = async () => {
    if (!category || !urgency) return;
    setSubmitting(true);

    // Build reporter display name + initials from their profile
    const fullName = userProfile?.displayName || 'Volunteer';
    const nameParts = fullName.trim().split(' ');
    const initials = nameParts.length >= 2
      ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
      : fullName.slice(0, 2).toUpperCase();

    try {
      const reportId = await submitReport(currentUser?.uid, {
        category,
        urgency,
        description: desc,
        ward:             userProfile?.ward || 'Ward 4',
        area:             userProfile?.zone || 'Nagar Road',
        reporterName:     fullName,
        reporterInitials: initials,
      });
      // Log to activity feed so it shows on HomeScreen immediately
      await logActivity(currentUser?.uid, {
        action:    'REPORTED',
        taskTitle: `${category.charAt(0).toUpperCase() + category.slice(1)} report submitted`,
        outcome:   desc || `${urgency.charAt(0).toUpperCase() + urgency.slice(1)} urgency — Task active`,
        needId:    reportId,
      });
      setSubmitted(true);
    } catch (e) {
      Alert.alert('Submit failed', e.message || 'Could not save report. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <View style={styles.root}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.surfaceContainerLow} />
        
        {/* Top App Bar */}
        <View style={styles.topBar}>
          <View style={styles.topBarLeft}>
            <HeartHandIcon size={20} color={Colors.primary} />
            <Text style={styles.topBarTitle}>New Report</Text>
          </View>
          <View style={styles.offlineBadge}>
            <WifiOffIcon size={10} color={Colors.secondary} strokeWidth={2} />
            <Text style={styles.offlineTxt}>OFFLINE</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={[styles.scrollContent, { justifyContent: 'center', flex: 1 }]}>
          <SuccessState onReset={() => setSubmitted(false)} />
        </ScrollView>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surfaceContainerLow} />

      {/* Top App Bar */}
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <HeartHandIcon size={20} color={Colors.primary} />
          <Text style={styles.topBarTitle}>New Report</Text>
        </View>
        <View style={styles.offlineBadge}>
          <WifiOffIcon size={10} color={Colors.secondary} strokeWidth={2} />
          <Text style={styles.offlineTxt}>OFFLINE</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], gap: 16 }}>
          
          {/* ── LOCATION (Small Card) ── */}
          <View style={[styles.card, Shadow.soft]}>
            <View style={[styles.cardAccent, { backgroundColor: Colors.secondary }]} />
            <View style={[styles.cardBody, { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12 }]}>
              <MapPinIcon size={18} color={Colors.secondary} strokeWidth={2} />
              <View style={{ flex: 1 }}>
                <Text style={styles.locTxt}>Ward 4, Nagar Road, Solapur</Text>
                <Text style={styles.locSubTxt}>Auto-detected location</Text>
              </View>
            </View>
          </View>

          {/* ── CATEGORY ── */}
          <View style={[styles.card, Shadow.soft]}>
            <View style={[styles.cardAccent, { backgroundColor: Colors.primary }]} />
            <View style={styles.cardBody}>
              <Text style={styles.fieldLabel}>NEED CATEGORY <Text style={styles.required}>*</Text></Text>
              
              <View style={styles.catGrid}>
                {CATEGORIES.map(cat => (
                  <Pressable
                    key={cat.id}
                    style={[styles.catCard, category === cat.id && { borderColor: cat.color, backgroundColor: cat.color + '10' }]}
                    onPress={() => setCategory(cat.id)}
                  >
                    <cat.Icon
                      size={24}
                      color={category === cat.id ? cat.color : Colors.onSurfaceVariant}
                      strokeWidth={1.75}
                    />
                    <Text style={[styles.catLabel, category === cat.id && { color: cat.color, fontWeight: '700' }]}>
                      {cat.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>

          {/* ── URGENCY ── */}
          <View style={[styles.card, Shadow.soft]}>
            <View style={[styles.cardAccent, { backgroundColor: Colors.urgent }]} />
            <View style={styles.cardBody}>
              <Text style={styles.fieldLabel}>URGENCY LEVEL <Text style={styles.required}>*</Text></Text>
              
              {URGENCY_LEVELS.map(u => (
                <Pressable
                  key={u.id}
                  style={[styles.urgencyRow, urgency === u.id && { backgroundColor: u.color + '10', borderColor: u.color }]}
                  onPress={() => setUrgency(u.id)}
                >
                  <View style={[styles.urgencyDot, { backgroundColor: urgency === u.id ? u.color : Colors.surfaceContainerHigh }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.urgencyLabel, urgency === u.id && { color: u.color }]}>{u.label}</Text>
                    <Text style={styles.urgencySub}>{u.sub}</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>

          {/* ── DESCRIPTION ── */}
          <View style={[styles.card, Shadow.soft]}>
            <View style={[styles.cardAccent, { backgroundColor: Colors.tertiary }]} />
            <View style={styles.cardBody}>
              <Text style={styles.fieldLabel}>DESCRIPTION</Text>
              <Text style={styles.fieldSub}>Any Indian language supported — Marathi, Hindi, Telugu, Kannada…</Text>
              
              <View style={[styles.inputBox, descFocus && styles.inputBoxFocus]}>
                <TextInput
                  style={styles.textArea}
                  value={desc}
                  onChangeText={setDesc}
                  placeholder="e.g. 5 kutumbe ani 3 mulat gheun ahet, jevana chi garaj aahe..."
                  placeholderTextColor={Colors.outline}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  onFocus={() => setDescFocus(true)}
                  onBlur={() => setDescFocus(false)}
                />
              </View>
            </View>
          </View>

          {/* ── PHOTO ── */}
          <View style={[styles.card, Shadow.soft]}>
            <View style={[styles.cardAccent, { backgroundColor: Colors.primary }]} />
            <View style={styles.cardBody}>
              <Pressable style={styles.photoBtn}>
                <CameraIcon size={20} color={Colors.primary} strokeWidth={1.75} />
                <View>
                  <Text style={styles.photoBtnTitle}>Attach Photo Evidence</Text>
                  <Text style={styles.photoBtnSub}>Gemini OCR will process handwritten forms</Text>
                </View>
              </Pressable>
            </View>
          </View>

          {/* ── VOICE NOTE ── */}
          <View style={[styles.card, Shadow.soft]}>
            <View style={[styles.cardAccent, { backgroundColor: Colors.tertiary }]} />
            <View style={styles.cardBody}>
              <Pressable style={styles.voiceBtn}>
                <View style={styles.voiceIconBox}>
                  <MicIcon size={20} color={Colors.tertiary} strokeWidth={1.75} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.voiceBtnTitle}>Record Voice Note</Text>
                  <Text style={styles.voiceBtnSub}>Speak in any Indian language — auto-transcribed</Text>
                </View>
              </Pressable>
            </View>
          </View>

          {/* ── SUBMIT ── */}
          <Pressable
            style={[styles.submitBtn, (!category || !urgency || submitting) && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            <LinearGradient
              colors={category && urgency && !submitting ? ['#00694C', '#008560'] : [Colors.surfaceContainerHigh, Colors.surfaceContainerHigh]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={styles.submitInner}
            >
              <PlusCircleIcon size={20} color={category && urgency && !submitting ? '#FFF' : Colors.outline} strokeWidth={1.75} />
              <Text style={[styles.submitTxt, (!category || !urgency || submitting) && { color: Colors.outline }]}>
                {submitting ? 'Saving…' : 'Submit Report'}
              </Text>
            </LinearGradient>
          </Pressable>

          <Text style={styles.footer}>
            Reports sync automatically when connected. Offline data stored securely.
          </Text>

        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surfaceContainerLow },

  /* Top app bar */
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 12,
    backgroundColor: 'rgba(239,245,239,0.92)',
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  topBarTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.primary,
    letterSpacing: -0.4,
  },
  offlineBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.secondaryFixed + '40',
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radius.full,
  },
  offlineTxt: { fontSize: 9, fontWeight: '700', color: Colors.secondary, letterSpacing: 0.8 },

  /* Scroll */
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 100 },

  /* Generic card shell */
  card: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 12,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  cardAccent: { width: 4 },
  cardBody: { flex: 1, padding: 16 },

  /* Location */
  locTxt: { fontSize: 14, fontWeight: '700', color: Colors.onSurface },
  locSubTxt: { fontSize: 12, color: Colors.onSurfaceVariant, marginTop: 2 },

  /* Form Labels */
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
    letterSpacing: 0.9,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  fieldSub: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    marginBottom: 14,
    marginTop: -4,
  },
  required: { color: Colors.urgent },

  /* Category Grid */
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  catCard: {
    width: '31%', aspectRatio: 1,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', gap: 8,
    borderWidth: 1.5, borderColor: 'transparent',
    flex: 1, minWidth: '30%', paddingVertical: 14,
  },
  catLabel: { fontSize: 11, fontWeight: '600', color: Colors.onSurfaceVariant },

  /* Urgency Rows */
  urgencyRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 14, borderRadius: 12, marginBottom: 8,
    backgroundColor: Colors.surfaceContainerLow,
    borderWidth: 1.5, borderColor: 'transparent',
  },
  urgencyDot: { width: 14, height: 14, borderRadius: 7 },
  urgencyLabel: { fontSize: 14, fontWeight: '700', color: Colors.onSurface },
  urgencySub: { fontSize: 12, color: Colors.onSurfaceVariant, marginTop: 2 },

  /* Description Input */
  inputBox: {
    backgroundColor: Colors.surfaceVariant,
    borderRadius: 12, padding: 14,
    borderWidth: 1.5, borderColor: 'transparent', minHeight: 110,
  },
  inputBoxFocus: { borderColor: Colors.primary, backgroundColor: Colors.surfaceContainerLowest },
  textArea: { fontSize: 15, color: Colors.onSurface, lineHeight: 22, minHeight: 90 },

  /* Photo Button */
  photoBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 12, padding: 16,
    borderWidth: 1.5, borderColor: 'rgba(188,202,193,0.5)',
    borderStyle: 'dashed',
  },
  photoBtnTitle: { fontSize: 14, fontWeight: '700', color: Colors.primary },
  photoBtnSub: { fontSize: 12, color: Colors.onSurfaceVariant, marginTop: 2 },

  /* Submit Button */
  submitBtn: { borderRadius: 12, overflow: 'hidden', marginTop: 4 },
  submitBtnDisabled: { opacity: 0.6 },
  submitInner: { height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  submitTxt: { fontSize: 16, fontWeight: '700', color: '#FFF' },

  footer: { fontSize: 11, color: Colors.outline, textAlign: 'center', lineHeight: 18, marginTop: 8 },

  /* Success state */
  successCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    marginHorizontal: 4,
  },
  successBody: {
    flex: 1,
    padding: 28,
    alignItems: 'center',
  },
  successIcon: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: Colors.surfaceContainerLow,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
  },
  successTitle: { fontSize: 24, fontWeight: '800', color: Colors.onSurface, marginBottom: 6, letterSpacing: -0.5 },
  successSub: { fontSize: 14, color: Colors.onSurfaceVariant, marginBottom: 28 },
  pipeline: { width: '100%', gap: 0, marginBottom: 24 },
  pipelineItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 10, position: 'relative',
  },
  pipelineDot: { width: 20, height: 20, borderRadius: 10 },
  pipelineDotDone: { backgroundColor: Colors.primary },
  pipelineDotPending: { backgroundColor: Colors.surfaceContainerHigh },
  pipelineLine: {
    position: 'absolute', left: 9, top: 30,
    width: 2, height: 20, backgroundColor: Colors.surfaceContainerHigh,
  },
  pipelineLineDone: { backgroundColor: Colors.primary },
  pipelineTxt: { fontSize: 13, fontWeight: '700', color: Colors.onSurface },
  pipelineTxtPending: { color: Colors.outline },
  resetBtn: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 12, paddingVertical: 14, paddingHorizontal: 24,
    width: '100%', alignItems: 'center',
  },
  resetTxt: { fontSize: 14, fontWeight: '700', color: Colors.primary },

  /* Voice note button */
  voiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1.5,
    borderColor: Colors.tertiary + '40',
  },
  voiceIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.tertiary + '18',
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceBtnTitle: { fontSize: 14, fontWeight: '700', color: Colors.tertiary },
  voiceBtnSub: { fontSize: 12, color: Colors.onSurfaceVariant, marginTop: 2 },
});
