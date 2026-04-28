/**
 * useGoogleAuth — Reusable Google Sign-In hook
 *
 * Uses expo-auth-session + Firebase Auth GoogleAuthProvider.
 * Works with Expo Go (redirect URI scheme) and standalone builds.
 *
 * SETUP REQUIRED:
 *   1. Firebase Console → Authentication → Sign-in method → Google → Enable
 *   2. Copy Web Client ID → paste as WEB_CLIENT_ID below
 *   3. Firebase Console → Authentication → Authorized domains → add your scheme
 */
import { useEffect, useCallback } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session/providers/google';
import { useState } from 'react';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../services/firebase';
import { createUserProfile } from '../services/firestoreService';

// ── PASTE YOUR WEB CLIENT ID FROM FIREBASE CONSOLE HERE ──────────────────────
const WEB_CLIENT_ID = '449254913174-5du98folpu1r15rhim8utejvcrj7njj1.apps.googleusercontent.com';
// ─────────────────────────────────────────────────────────────────────────────

WebBrowser.maybeCompleteAuthSession();

export function useGoogleAuth() {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError,   setGoogleError]   = useState('');

  const [request, response, promptAsync] = AuthSession.useAuthRequest({
    expoClientId:   WEB_CLIENT_ID,   // used by Expo Go (proxy mode)
    webClientId:    WEB_CLIENT_ID,   // used in web / standalone
    androidClientId: WEB_CLIENT_ID,  // fallback for native Android
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      setGoogleLoading(true);
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(async result => {
          const user = result.user;
          const isNew = result.additionalUserInfo?.isNewUser
            ?? (result.operationType === 'signIn' && !result.user.metadata.lastSignInTime);
          if (isNew || result.additionalUserInfo?.isNewUser) {
            // Create Firestore profile for new Google users
            await createUserProfile(user.uid, {
              displayName: user.displayName || '',
              email:       user.email || '',
              ward:        'Ward 4',
            }).catch(() => {/* non-blocking */});
          }
        })
        .catch(e => setGoogleError(e.message || 'Google sign-in failed.'))
        .finally(() => setGoogleLoading(false));
    }
    if (response?.type === 'error') {
      setGoogleError('Google sign-in was cancelled or failed.');
    }
  }, [response]);

  const handleGoogleSignIn = useCallback(() => {
    setGoogleError('');
    promptAsync();
  }, [promptAsync]);

  return { handleGoogleSignIn, googleLoading, googleError, googleRequest: request };
}
