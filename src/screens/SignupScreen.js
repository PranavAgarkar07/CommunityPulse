/**
 * SignupScreen — exact match of stitch_remix_of_remix_of_google (1) reference
 * Layout: mint bg → logo top bar → white card → fields → role radio cards → CTA → footer
 */
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Animated,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle } from 'react-native-svg';
import { Colors, Radius, Shadow } from '../theme/colors';
import {
  UserIcon, MailIcon, GlobeIcon, UsersIcon, LockIcon,
} from '../components/Icons';
import { useAuth } from '../context/AuthContext';

/* ── Volunteer Activism icon (heart + hands, filled style) ── */
function HeartHandIcon({ size = 22, color = Colors.primary }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
    </Svg>
  );
}

/* ── Terrain / mountain icon for Field Operations ── */
function TerrainIcon({ size = 22, color = Colors.primary }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M14 6l-1-2H5v17h2v-7h5l1 2h7V6h-6zm4 8h-4l-1-2H7V6h5l1 2h5v6z" />
    </Svg>
  );
}

/* ── Hub icon for NGO Coordination ── */
function HubIcon({ size = 22, color = Colors.secondary }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
      <Path d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zm0 2c4.97 0 9 4.03 9 9s-4.03 9-9 9-9-4.03-9-9 4.03-9 9-9zm-4 5v8h2v-3h4v3h2V8H8zm2 1h4v3h-4V9z" />
    </Svg>
  );
}

/* ── Group icon for Volunteer Hub ── */
function GroupIcon({ size = 22, color = Colors.tertiary }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
    </Svg>
  );
}

/* ── Arrow right icon ── */
function ArrowRightIcon({ size = 20, color = '#FFF' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M5 12h14M12 5l7 7-7 7" />
    </Svg>
  );
}

const ROLES = [
  {
    id: 'field',
    label: 'Field Operations',
    sub: 'on-the-ground reporting',
    Icon: TerrainIcon,
    color: Colors.primary,
    selectedBg: '#86F8C9', // primary-fixed / mint highlight
    accentColor: Colors.primary,
  },
  {
    id: 'ngo',
    label: 'NGO Coordination',
    sub: 'logistics & resource management',
    Icon: HubIcon,
    color: Colors.secondary,
    selectedBg: Colors.surfaceContainerLow,
    accentColor: Colors.secondary,
  },
  {
    id: 'volunteer',
    label: 'Volunteer Hub',
    sub: 'community support',
    Icon: GroupIcon,
    color: Colors.tertiary,
    selectedBg: Colors.surfaceContainerLow,
    accentColor: Colors.tertiary,
  },
];

export default function SignupScreen({ navigation }) {
  const { signUp } = useAuth();
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole]       = useState('field');
  const [nameFocus, setNameFocus]   = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [passFocus, setPassFocus]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 80, friction: 12, useNativeDriver: true }),
    ]).start();
  }, []);

  async function handleSignUp() {
    if (!name || !email || !password) { setError('Please fill in all fields.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setError('');
    setLoading(true);
    try {
      await signUp(email.trim(), password, { displayName: name, role });
      // AppNavigator auto-routes to AppStack
    } catch (e) {
      setError(e.message?.replace('Firebase: ', '').replace(/ \(.*\/.*\)\.?/g, '') || 'Sign up failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surfaceContainerLow} />

      {/* ── Top app bar (glass-style) ── */}
      <Animated.View style={[styles.topBar, { opacity: fadeAnim }]}>
        <Image
          source={require('../../assets/icon.png')}
          style={styles.topBarLogo}
          resizeMode="cover"
        />
        <Text style={styles.topBarTitle}>CommunityPulse</Text>
      </Animated.View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Main card ── */}
        <Animated.View
          style={[
            styles.card,
            Shadow.float,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Card header */}
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Create{'\n'}Account</Text>
            <Text style={styles.cardSubtitle}>
              Enter your details and select your operational role to access the portal.
            </Text>
          </View>

          {/* Full Name */}
          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>FULL NAME</Text>
            <View style={[styles.inputBox, nameFocus && styles.inputBoxFocus]}>
              <UserIcon size={20} color={nameFocus ? Colors.primary : Colors.outline} strokeWidth={1.75} />
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Jane Doe"
                placeholderTextColor={Colors.outline}
                autoCapitalize="words"
                onFocus={() => setNameFocus(true)}
                onBlur={() => setNameFocus(false)}
              />
            </View>
          </View>

          {/* Email Address */}
          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>EMAIL ADDRESS</Text>
            <View style={[styles.inputBox, emailFocus && styles.inputBoxFocus]}>
              <MailIcon size={20} color={emailFocus ? Colors.primary : Colors.outline} strokeWidth={1.75} />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="jane.doe@organization.org"
                placeholderTextColor={Colors.outline}
                autoCapitalize="none"
                keyboardType="email-address"
                onFocus={() => setEmailFocus(true)}
                onBlur={() => setEmailFocus(false)}
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>PASSWORD</Text>
            <View style={[styles.inputBox, passFocus && styles.inputBoxFocus]}>
              <LockIcon size={20} color={passFocus ? Colors.primary : Colors.outline} strokeWidth={1.75} />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Min. 6 characters"
                placeholderTextColor={Colors.outline}
                secureTextEntry
                onFocus={() => setPassFocus(true)}
                onBlur={() => setPassFocus(false)}
              />
            </View>
          </View>

          {/* Primary Operational Role */}
          <View style={styles.roleSection}>
            <Text style={styles.fieldLabel}>PRIMARY OPERATIONAL ROLE</Text>

            {ROLES.map((r) => {
              const isSelected = role === r.id;
              return (
                <Pressable
                  key={r.id}
                  style={[
                    styles.roleCard,
                    { borderLeftColor: r.accentColor },
                    isSelected && { backgroundColor: r.selectedBg },
                  ]}
                  onPress={() => setRole(r.id)}
                >
                  {/* Icon container */}
                  <View style={styles.roleIconBox}>
                    <r.Icon size={22} color={r.color} />
                  </View>

                  {/* Text */}
                  <View style={styles.roleTextBox}>
                    <Text style={styles.roleLabel}>{r.label}</Text>
                    <Text style={styles.roleSub}>{r.sub}</Text>
                  </View>

                  {/* Radio indicator */}
                  <View style={[styles.radio, isSelected && { borderColor: r.accentColor }]}>
                    {isSelected && (
                      <View style={[styles.radioDot, { backgroundColor: r.accentColor }]} />
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* Error */}
          {!!error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorTxt}>{error}</Text>
            </View>
          )}

          {/* CTA button */}
          <Pressable
            style={[styles.ctaBtn, loading && { opacity: 0.7 }]}
            onPress={handleSignUp}
            disabled={loading}
          >
            <LinearGradient
              colors={['#00694C', '#008560']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.ctaGradient}
            >
              <Text style={styles.ctaText}>
                {loading ? 'Creating account…' : 'Create Account'}
              </Text>
            </LinearGradient>
          </Pressable>

          {/* Footer: login link */}
          <View style={styles.loginRow}>
            <Text style={styles.loginPrompt}>Already have an account? </Text>
            <Pressable onPress={() => navigation?.navigate('Login')}>
              <Text style={styles.loginLink}>Log In here</Text>
            </Pressable>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLow, // #EFF5EF mint
  },

  /* Error */
  errorBox: {
    backgroundColor: '#FCEBEB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorTxt: {
    fontSize: 13,
    color: '#791F1F',
    fontWeight: '500',
    lineHeight: 18,
  },

  /* Top bar */
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 12,
    backgroundColor: 'rgba(239,245,239,0.7)',
  },
  topBarLogo: {
    width: 36,
    height: 36,
    borderRadius: 9,        // 25% of 36 = squircle shape per Android guidelines
    backgroundColor: '#EEF5EF',
    borderWidth: 1,
    borderColor: 'rgba(0,105,76,0.15)',
  },
  topBarTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.primary,
    letterSpacing: -0.5,
  },

  /* Scroll */
  scroll: {
    padding: 20,
    paddingBottom: 48,
  },

  /* Card */
  card: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 16,
    padding: 28,
    overflow: 'hidden',
  },

  /* Card header */
  cardHeader: {
    marginBottom: 28,
  },
  cardTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.onSurface,
    letterSpacing: -1,
    lineHeight: 40,
    marginBottom: 12,
  },
  cardSubtitle: {
    fontSize: 15,
    color: Colors.onSurfaceVariant,
    lineHeight: 22,
  },

  /* Fields */
  fieldWrap: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
    letterSpacing: 0.9,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surfaceVariant,  // #DEE4DE
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  inputBoxFocus: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderColor: Colors.primary,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.onSurface,
    fontWeight: '400',
    padding: 0,
  },

  /* Role section */
  roleSection: {
    marginBottom: 28,
  },

  /* Individual role card */
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 12,
    borderLeftWidth: 4,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginTop: 10,
  },
  roleIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleTextBox: {
    flex: 1,
    gap: 2,
  },
  roleLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.onSurface,
    letterSpacing: -0.2,
  },
  roleSub: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    lineHeight: 16,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  /* CTA */
  ctaBtn: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  ctaGradient: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: 0.2,
  },

  /* Login row */
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  loginPrompt: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
});
