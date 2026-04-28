/**
 * AuthContext — wraps Firebase Auth
 *
 * Provides:
 *  - currentUser   : Firebase auth user object (or null)
 *  - userProfile   : Firestore users/{uid} document
 *  - loading       : true while auth state is resolving
 *  - signIn(email, password)
 *  - signUp(email, password, profileData)
 *  - signOut()
 *  - updateProfile(fields)
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile as firebaseUpdateProfile,
} from 'firebase/auth';
import { auth } from '../services/firebase';
import {
  createUserProfile,
  subscribeToUser,
  updateUserProfile,
} from '../services/firestoreService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser]   = useState(null);
  const [userProfile, setUserProfile]   = useState(null);
  const [loading, setLoading]           = useState(true);

  /* ── Listen to Firebase Auth state ── */
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubAuth;
  }, []);

  /* ── Mirror Firestore profile when user logs in ── */
  useEffect(() => {
    if (!currentUser) {
      setUserProfile(null);
      return;
    }
    const unsubProfile = subscribeToUser(currentUser.uid, profile => {
      setUserProfile(profile);
    });
    return unsubProfile;
  }, [currentUser]);

  /* ── Auth actions ── */
  async function signIn(email, password) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  }

  async function signUp(email, password, profileData = {}) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await firebaseUpdateProfile(cred.user, {
      displayName: profileData.displayName || '',
    });
    // Non-blocking — auth succeeds even if Firestore write is temporarily blocked
    try {
      await createUserProfile(cred.user.uid, { email, ...profileData });
    } catch (firestoreErr) {
      console.warn('Profile write failed (check Firestore rules):', firestoreErr.message);
    }
    return cred.user;
  }

  async function signOut() {
    await firebaseSignOut(auth);
    setUserProfile(null);
  }

  async function updateProfile(fields) {
    if (!currentUser) return;
    await updateUserProfile(currentUser.uid, fields);
  }

  const value = {
    currentUser,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
