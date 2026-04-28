/**
 * LoginScreen — exact match of stitch_remix_of_remix_of_google reference
 * Layout: mint bg → logo top → white card (blue left accent) → form → social → footer
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
import Svg, { Path, G } from 'react-native-svg';
import { Colors, Radius, Shadow } from '../theme/colors';
import {
  MailIcon, LockIcon, EyeIcon, EyeOffIcon, ShieldIcon, PhoneIcon,
} from '../components/Icons';
import { useAuth } from '../context/AuthContext';
import { useGoogleAuth } from '../hooks/useGoogleAuth';

/* ── Waves / Logo icon (filled, like Material "waves") ── */
function WavesIcon({ size = 24, color = '#FFF' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M17 16.99c-1.35 0-2.2-.42-2.95-.8-.65-.33-1.18-.6-2.05-.6-.9 0-1.4.27-2.05.6-.75.38-1.57.8-2.95.8s-2.2-.42-2.95-.8c-.65-.33-1.18-.6-2.05-.6v-1.99c1.35 0 2.2.42 2.95.8.65.33 1.18.6 2.05.6s1.4-.27 2.05-.6c.75-.38 1.57-.8 2.95-.8 1.35 0 2.2.42 2.95.8.65.33 1.18.6 2.05.6s1.4-.27 2.05-.6c.75-.38 1.57-.8 2.95-.8v1.99c-.9 0-1.4.27-2.05.6-.75.38-1.6.8-2.95.8zm0-4c-1.35 0-2.2-.42-2.95-.8-.65-.33-1.18-.6-2.05-.6-.9 0-1.4.27-2.05.6-.75.38-1.57.8-2.95.8s-2.2-.42-2.95-.8c-.65-.33-1.18-.6-2.05-.6v-2c1.35 0 2.2.42 2.95.8.65.33 1.18.6 2.05.6s1.4-.27 2.05-.6c.75-.38 1.57-.8 2.95-.8 1.35 0 2.2.42 2.95.8.65.33 1.18.6 2.05.6s1.4-.27 2.05-.6c.75-.38 1.57-.8 2.95-.8v2c-.9 0-1.4.27-2.05.6-.75.38-1.6.8-2.95.8zm0-4c-1.35 0-2.2-.42-2.95-.8-.65-.33-1.18-.6-2.05-.6-.9 0-1.4.27-2.05.6-.75.38-1.57.8-2.95.8s-2.2-.42-2.95-.8c-.65-.33-1.18-.6-2.05-.6V6.19c1.35 0 2.2.42 2.95.8.65.32 1.18.6 2.05.6s1.4-.27 2.05-.6c.75-.38 1.57-.8 2.95-.8 1.35 0 2.2.42 2.95.8.65.33 1.18.6 2.05.6s1.4-.27 2.05-.6c.75-.38 1.57-.8 2.95-.8v1.99c-.9 0-1.4.27-2.05.6-.75.39-1.6.81-2.95.81z" />
    </Svg>
  );
}

/* ── Google "G" logo ── */
function GoogleLogo({ size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <Path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <Path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <Path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
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

export default function LoginScreen({ navigation }) {
  const { signIn } = useAuth();
  const { handleGoogleSignIn, googleLoading, googleError } = useGoogleAuth();
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [showPass, setShowPass]   = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [passFocus, setPassFocus]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 80, friction: 12, useNativeDriver: true }),
    ]).start();
  }, []);

  async function handleSignIn() {
    if (!email || !password) { setError('Please enter email and password.'); return; }
    setError('');
    setLoading(true);
    try {
      await signIn(email.trim(), password);
      // AppNavigator automatically switches to AppStack on auth state change
    } catch (e) {
      setError(e.message?.replace('Firebase: ', '').replace(/ \(.*\/.*\)\.?/g, '') || 'Sign in failed.');
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

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Logo / Brand ── */}
        <Animated.View style={[styles.brandRow, { opacity: fadeAnim }]}>
          <Image 
            source={require('../../assets/icon.png')} 
            style={styles.logoImage} 
            resizeMode="cover"
          />
          <Text style={styles.brandName}>CommunityPulse</Text>
        </Animated.View>

        {/* ── Login Card ── */}
        <Animated.View
          style={[
            styles.card,
            Shadow.float,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Blue left accent bar */}
          <View style={styles.accentBar} />

          {/* Card content (padded away from accent bar) */}
          <View style={styles.cardInner}>

            {/* Header */}
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Sign In</Text>
              <Text style={styles.cardSubtitle}>
                Enter your credentials to access field operations.
              </Text>
            </View>

            {/* Email field */}
            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>EMAIL ADDRESS</Text>
              <View style={[styles.inputBox, emailFocus && styles.inputBoxFocus]}>
                <MailIcon size={20} color={emailFocus ? Colors.primary : Colors.outline} strokeWidth={1.75} />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="coordinator@ngo.org"
                  placeholderTextColor={Colors.outline}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  onFocus={() => setEmailFocus(true)}
                  onBlur={() => setEmailFocus(false)}
                />
              </View>
            </View>

            {/* Password field */}
            <View style={styles.fieldWrap}>
              <View style={styles.pwdLabelRow}>
                <Text style={styles.fieldLabel}>PASSWORD</Text>
                <Pressable>
                  <Text style={styles.forgotLink}>FORGOT PASSWORD?</Text>
                </Pressable>
              </View>
              <View style={[styles.inputBox, passFocus && styles.inputBoxFocus]}>
                <LockIcon size={20} color={passFocus ? Colors.primary : Colors.outline} strokeWidth={1.75} />
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor={Colors.outline}
                  secureTextEntry={!showPass}
                  onFocus={() => setPassFocus(true)}
                  onBlur={() => setPassFocus(false)}
                />
                <Pressable onPress={() => setShowPass(!showPass)} hitSlop={8}>
                  {showPass
                    ? <EyeOffIcon size={20} color={Colors.outline} strokeWidth={1.75} />
                    : <EyeIcon    size={20} color={Colors.outline} strokeWidth={1.75} />
                  }
                </Pressable>
              </View>
            </View>

            {/* Error message */}
            {!!error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorTxt}>{error}</Text>
              </View>
            )}

            {/* Primary CTA */}
            <Pressable
              style={[styles.signInBtn, loading && { opacity: 0.7 }]}
              onPress={handleSignIn}
              disabled={loading}
            >
              <LinearGradient
                colors={['#00694C', '#008560']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.signInGradient}
              >
                <Text style={styles.signInText}>
                  {loading ? 'Signing in…' : 'Sign In to Dashboard'}
                </Text>
                {!loading && <ArrowRightIcon size={20} color="#FFF" />}
              </LinearGradient>
            </Pressable>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social buttons */}
            <View style={styles.socialRow}>
              {/* Google */}
              <Pressable
                style={[styles.socialBtn, googleLoading && { opacity: 0.6 }]}
                onPress={handleGoogleSignIn}
                disabled={googleLoading}
              >
                <GoogleLogo size={20} />
                <Text style={styles.socialBtnText}>
                  {googleLoading ? 'Signing in…' : 'Google'}
                </Text>
              </Pressable>

              {/* Phone */}
              <Pressable style={styles.socialBtn}>
                <PhoneIcon size={20} color={Colors.primary} strokeWidth={1.75} />
                <Text style={styles.socialBtnText}>Phone</Text>
              </Pressable>
            </View>
            {googleError ? (
              <Text style={{ color: Colors.error, fontSize: 12, textAlign: 'center', marginTop: 8 }}>
                {googleError}
              </Text>
            ) : null}

            {/* Footer: sign up link */}
            <View style={styles.signupRow}>
              <Text style={styles.signupPrompt}>New to field operations? </Text>
              <Pressable onPress={() => navigation?.navigate('Signup')}>
                <Text style={styles.signupLink}>Request an account</Text>
              </Pressable>
            </View>

          </View>
        </Animated.View>

        {/* ── Security note ── */}
        <Animated.View style={[styles.securityRow, { opacity: fadeAnim }]}>
          <ShieldIcon size={14} color={Colors.outline} strokeWidth={1.5} />
          <Text style={styles.securityText}>
            ENCRYPTED CONNECTION • AUTHORIZED PERSONNEL ONLY
          </Text>
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
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 32,
  },

  /* Brand row */
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 28,
    alignSelf: 'center',
  },
  logoImage: {
    width: 48,
    height: 48,
    borderRadius: 12, // 25% of width, mimics iOS/Android squircle
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  brandName: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.onSurface,
    letterSpacing: -0.5,
  },

  /* Card */
  card: {
    backgroundColor: Colors.surfaceContainerLowest, // #FFF
    borderRadius: 12,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  accentBar: {
    width: 5,
    backgroundColor: Colors.secondary, // #1960A6 blue
  },
  cardInner: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 28,
  },

  /* Card header */
  cardHeader: {
    marginBottom: 28,
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.onSurface,
    letterSpacing: -0.5,
    marginBottom: 8,
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
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
    letterSpacing: 0.8,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  pwdLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  forgotLink: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surfaceVariant, // #DEE4DE
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(188,202,193,0.15)',
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

  /* CTA button */
  signInBtn: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  signInGradient: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  signInText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: 0.2,
  },

  /* Divider */
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.outlineVariant,
    opacity: 0.3,
  },
  dividerText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },

  /* Social */
  socialRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(188,202,193,0.3)',
    backgroundColor: Colors.surfaceContainerLowest,
  },
  socialBtnText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.onSurface,
  },

  /* Sign up */
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  signupPrompt: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
  },
  signupLink: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },

  /* Security note */
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 20,
    opacity: 0.7,
  },
  securityText: {
    fontSize: 9,
    fontWeight: '500',
    color: Colors.onSurfaceVariant,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
