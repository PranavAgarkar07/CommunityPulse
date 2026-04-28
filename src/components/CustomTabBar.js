/**
 * CustomTabBar — matches stitch_remix_of_remix_of_google reference exactly:
 *  - Frosted white bar, rounded top corners, full width
 *  - Active tab: mint green bg pill + small teal bar indicator above + green icon/label
 *  - Inactive tab: green-tinted icon + uppercase label, no background
 *  - All tabs always show icon + label (11px uppercase)
 */
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  AccessibilityInfo,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import {
  HomeIcon,
  ClipboardIcon,
  PlusCircleIcon,
  UserIcon,
} from './Icons';

const TABS = [
  { name: 'Home',    Icon: HomeIcon,       label: 'HOME'   },
  { name: 'Report',  Icon: PlusCircleIcon, label: 'REPORT' },
  { name: 'Tasks',   Icon: ClipboardIcon,  label: 'TASKS'  },
  { name: 'Profile', Icon: UserIcon,       label: 'PROFILE'},
];

function TabItem({ tab, isFocused, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={tab.label}
      onPress={onPress}
      style={styles.tabItem}
    >
      {/* Teal indicator bar above active tab */}
      {isFocused && <View style={styles.activeBar} />}

      {/* Pill background for active tab */}
      <View style={[styles.tabContent, isFocused && styles.tabContentActive]}>
        <tab.Icon
          size={24}
          color={isFocused ? Colors.primary : Colors.outline}
          strokeWidth={isFocused ? 2.5 : 1.75}
        />
        <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
          {tab.label}
        </Text>
      </View>
    </Pressable>
  );
}

export function CustomTabBar({ state, navigation }) {
  const insets = useSafeAreaInsets();

  const onPress = useCallback(
    (route, isFocused) => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });
      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate({ name: route.name, merge: true });
      }
    },
    [navigation]
  );

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {TABS.map((tab, index) => (
        <TabItem
          key={tab.name}
          tab={tab}
          isFocused={state.index === index}
          onPress={() => onPress(state.routes[index], state.index === index)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingHorizontal: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -8 },
        shadowOpacity: 0.04,
        shadowRadius: 16,
      },
      android: { elevation: 16 },
    }),
  },

  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    minWidth: 44,
    minHeight: 44,
  },

  /* Teal top-indicator bar (active only) */
  activeBar: {
    position: 'absolute',
    top: -12,
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },

  /* Pill background */
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  tabContentActive: {
    backgroundColor: Colors.surfaceContainerLow, // mint #EFF5EF
  },

  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.outline,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  tabLabelActive: {
    color: Colors.primary,
  },
});
