/**
 * AuthScreen — exact match of Stitch "Auth: Default State" + "Login: Secure Access"
 * Design: CommunityPulse · The Empathetic Engine · Stitch colors exact
 */
import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Pressable, Animated,
  StatusBar, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Radius } from '../theme/colors';
import { GlobeIcon, ActivityIcon, UsersIcon, ShieldIcon, BrainIcon } from '../components/Icons';

const { width } = Dimensions.get('window');

// Feature pills matching Stitch exactly
const FEATURES = [
  { label: 'PAPER-FIRST OCR',  color: null },
  { label: '12 INDIAN LANGUAGES', color: Colors.secondary, Icon: GlobeIcon },
  { label: 'EXPLAINABLE AI',   color: Colors.tertiary, Icon: BrainIcon },
  { label: 'OFFLINE-FIRST',    color: null },
  { label: 'VOLUNTEER MATCH',  color: Colors.primary, Icon: UsersIcon },
  { label: 'ZONE INTELLIGENCE',color: Colors.tertiary, Icon: ShieldIcon },
];

const STATS = [
  { value: '12', label: 'LANGUAGES' },
  { value: '70%', label: 'NGOS SERVED' },
  { value: '0–100', label: 'AI SCORE' },
];

export default function AuthScreen({ navigation }) {
  const fadeAnim   = useRef(new Animated.Value(0)).current;
  const slideAnim  = useRef(new Animated.Value(32)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 65, friction: 11, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.timing(rotateAnim, { toValue: 1, duration: 14000, useNativeDriver: true })
    ).start();
  }, []);

  const spin = rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* Deep forest green gradient — exact Stitch colors */}
      <LinearGradient
        colors={['#00352A', '#00523E', '#006B4A', '#005B3E']}
        locations={[0, 0.3, 0.7, 1]}
        style={styles.bg}
      />

      {/* Geometric bg circles */}
      <View style={[styles.bgCircle, { top: -80, right: -80, width: 320, height: 320, opacity: 0.06 }]} />
      <View style={[styles.bgCircle, { bottom: 120, left: -60, width: 240, height: 240, opacity: 0.05 }]} />

      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

        {/* Globe icon badge */}
        <View style={styles.iconBadge}>
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <GlobeIcon size={36} color={Colors.primaryFixed} strokeWidth={1.5} />
          </Animated.View>
        </View>

        {/* Brand */}
        <Text style={styles.brand}>COMMUNITYPULSE</Text>
        <Text style={styles.headline}>The Empathetic{'\n'}Engine.</Text>
        <Text style={styles.tagline}>
          Coordinating humanitarian aid with clarity, urgency, and compassion — for NGOs in India's toughest field conditions.
        </Text>

        {/* Stats row — exactly 3 columns matching Stitch */}
        <View style={styles.statsRow}>
          {STATS.map((s, i) => (
            <View key={i} style={[styles.statBox, i < STATS.length - 1 && styles.statBorder]}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Feature pills grid — 2 per row matching Stitch */}
        <View style={styles.pillGrid}>
          {FEATURES.map((f, i) => (
            <View key={i} style={[
              styles.pill,
              f.color ? { borderColor: f.color + '50', backgroundColor: f.color + '18' } : styles.pillDefault,
            ]}>
              {f.Icon && <f.Icon size={11} color={f.color || Colors.primaryFixed} strokeWidth={2} />}
              <Text style={[styles.pillText, f.color ? { color: Colors.primaryFixed } : {}]}>{f.label}</Text>
            </View>
          ))}
        </View>

        {/* Primary CTA */}
        <Pressable
          style={styles.ctaBtn}
          onPress={() => navigation.navigate('Login')}
        >
          <LinearGradient
            colors={[Colors.primaryFixed, Colors.primaryFixedDim]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.ctaInner}
          >
            <Text style={styles.ctaText}>Sign In to Field Operations</Text>
            <Text style={styles.ctaArrow}>›</Text>
          </LinearGradient>
        </Pressable>

        {/* Secondary link */}
        <Pressable
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate('Signup')}
        >
          <Text style={styles.secondaryText}>Request Field Access →</Text>
        </Pressable>

      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#00352A' },
  bg: { ...StyleSheet.absoluteFillObject },
  bgCircle: {
    position: 'absolute', borderRadius: 999,
    borderWidth: 1, borderColor: Colors.primaryFixed,
  },
  content: {
    flex: 1, paddingHorizontal: 28, paddingTop: 72, paddingBottom: 48,
    justifyContent: 'center',
  },
  iconBadge: {
    width: 72, height: 72, borderRadius: 20,
    backgroundColor: 'rgba(134,248,201,0.15)',
    borderWidth: 1, borderColor: 'rgba(134,248,201,0.3)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 24,
  },
  brand: {
    fontSize: 11, fontWeight: '700', letterSpacing: 3,
    color: Colors.primaryFixed, marginBottom: 8,
    opacity: 0.8,
  },
  headline: {
    fontSize: 40, fontWeight: '800', color: '#FFFFFF',
    letterSpacing: -1.2, lineHeight: 46, marginBottom: 16,
  },
  tagline: {
    fontSize: 14, fontWeight: '400', color: 'rgba(255,255,255,0.7)',
    lineHeight: 22, marginBottom: 28,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: Radius.xl, marginBottom: 20,
  },
  statBox: { flex: 1, alignItems: 'center', paddingVertical: 16 },
  statBorder: { borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.1)' },
  statValue: { fontSize: 20, fontWeight: '800', color: '#FFF', letterSpacing: -0.5 },
  statLabel: { fontSize: 9, fontWeight: '600', color: 'rgba(255,255,255,0.5)', letterSpacing: 1.2, marginTop: 3, textTransform: 'uppercase' },
  pillGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 32 },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: Radius.full, borderWidth: 1,
  },
  pillDefault: { borderColor: 'rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.07)' },
  pillText: { fontSize: 10, fontWeight: '600', letterSpacing: 0.5, color: 'rgba(255,255,255,0.8)' },
  ctaBtn: { borderRadius: Radius.xl, overflow: 'hidden', marginBottom: 16 },
  ctaInner: {
    flexDirection: 'row', height: 56,
    alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingHorizontal: 24,
  },
  ctaText: { fontSize: 16, fontWeight: '700', color: Colors.primary },
  ctaArrow: { fontSize: 22, fontWeight: '300', color: Colors.primary },
  secondaryBtn: { alignItems: 'center', paddingVertical: 12 },
  secondaryText: { fontSize: 14, fontWeight: '500', color: 'rgba(255,255,255,0.65)' },
});
