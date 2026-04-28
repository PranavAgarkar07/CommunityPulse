/**
 * AppContext — shared live data across all screens
 *
 * Provides:
 *  - urgentNeed      : single most urgent unassigned need (HomeScreen banner)
 *  - recentActivity  : last 4 activity log entries (HomeScreen)
 *  - appConfig       : AI pipeline status + feature flags (HomeScreen strip)
 *  - unreadCount     : bell badge count
 *  - tasks           : needs list for TasksScreen (ward-filtered)
 *
 * All data is real-time via onSnapshot subscriptions.
 * Unsubscribes automatically on user logout.
 */
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  subscribeToUrgentNeed,
  subscribeToActivity,
  subscribeToAppConfig,
  subscribeToUnreadCount,
  subscribeToNeeds,
} from '../services/firestoreService';
import { useAuth } from './AuthContext';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const { currentUser, userProfile } = useAuth();

  const [urgentNeed,     setUrgentNeed]     = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [appConfig,      setAppConfig]      = useState(null);
  const [unreadCount,    setUnreadCount]    = useState(0);
  const [tasks,          setTasks]          = useState([]);
  const [dataLoading,    setDataLoading]    = useState(true);

  // Hold refs to unsubscribe functions
  const unsubRefs = useRef([]);

  useEffect(() => {
    // Clear previous subscriptions when user changes
    unsubRefs.current.forEach(fn => fn());
    unsubRefs.current = [];

    if (!currentUser) {
      setUrgentNeed(null);
      setRecentActivity([]);
      setTasks([]);
      setUnreadCount(0);
      setDataLoading(false);
      return;
    }

    setDataLoading(true);
    const ward = userProfile?.ward || 'Ward 4';
    const uid  = currentUser.uid;

    // Subscribe to all collections simultaneously
    const u1 = subscribeToUrgentNeed(need => {
      setUrgentNeed(need);
      setDataLoading(false);
    });

    const u2 = subscribeToActivity(uid, 4, logs => setRecentActivity(logs));

    const u3 = subscribeToAppConfig(config => setAppConfig(config));

    const u4 = subscribeToUnreadCount(uid, count => setUnreadCount(count));

    const u5 = subscribeToNeeds(ward, null, needs => setTasks(needs));

    unsubRefs.current = [u1, u2, u3, u4, u5];

    return () => {
      unsubRefs.current.forEach(fn => fn());
    };
  }, [currentUser?.uid, userProfile?.ward]);

  const value = {
    urgentNeed,
    recentActivity,
    appConfig,
    unreadCount,
    tasks,
    dataLoading,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppData must be used inside AppProvider');
  return ctx;
}
