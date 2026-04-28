/**
 * ProfileScreen — exact match of stitch_remix_of_remix_of_google (2)
 *
 * Layout:
 *  - Top App Bar: "My Profile" + "Save" button (same as reference header)
 *  - Avatar: rounded square (72px), initials "RK", edit badge
 *  - Name + phone + IMPACT badge
 *  - YOUR SKILLS section: toggle chips (selected = green filled, unselected = outlined)
 *  - LANGUAGES SPOKEN: same chip pattern
 *  - YOUR PRIMARY ZONE: location dropdown row
 *  - WHEN ARE YOU AVAILABLE?: grid (days × time slots)
 *  - Last active footer
 *
 * Design tokens: mint bg, primary green, surfaceContainerLow, uppercase labels
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import {
  MapPinIcon, ChevronDownIcon, CheckIcon, StarIcon, PencilIcon, LockIcon,
} from '../components/Icons';
import { useAuth } from '../context/AuthContext';

/* ─── Static data (matches Stitch reference) ─────────────────────────────────── */
const ALL_SKILLS = ['Medical', 'Cooking', 'Logistics', 'Teaching', 'Counselling', 'Construction', 'Translation', 'IT Support', 'Driving'];
const SELECTED_SKILLS_DEFAULT = ['Medical', 'Cooking', 'Logistics'];

const ALL_LANGS = ['Marathi', 'Hindi', 'English', 'Urdu', 'Kannada', 'Telugu'];
const SELECTED_LANGS_DEFAULT = ['Marathi', 'Hindi'];

const DAYS    = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const PERIODS = ['MORNING', 'AFTERNOON', 'EVENING'];

// true = available, false = unavailable
const AVAIL_GRID = {
  MORNING:   [true,  true,  true,  true,  true,  true,  false],
  AFTERNOON: [true,  true,  true,  true,  true,  false, false],
  EVENING:   [false, false, false, false, false, false, false],
};

/* ─── Sub-components ─────────────────────────────────────────────────────────── */
function SectionLabel({ children }) {
  return <Text style={styles.sectionLabel}>{children}</Text>;
}

function Chip({ label, selected, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text style={[styles.chipTxt, selected && styles.chipTxtSelected]}>
        {label}
      </Text>
      {selected && <CheckIcon size={14} color="#fff" strokeWidth={2.5} />}
    </Pressable>
  );
}

/* ─── Main Screen ────────────────────────────────────────────────────────────── */
export default function ProfileScreen({ navigation }) {
  const { signOut, userProfile, currentUser } = useAuth();
  const insets = useSafeAreaInsets();

  // Pre-populate from Firestore profile
  const [skills, setSkills] = useState(
    new Set(userProfile?.skills?.length ? userProfile.skills : SELECTED_SKILLS_DEFAULT)
  );
  const [langs, setLangs] = useState(
    new Set(userProfile?.languages?.length ? userProfile.languages : SELECTED_LANGS_DEFAULT)
  );
  const [avail,  setAvail]  = useState(AVAIL_GRID);
  const [saving, setSaving] = useState(false);

  // Derived display values
  const displayName = userProfile?.displayName || 'Volunteer';
  const initials    = userProfile?.avatarInitials ||
    displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const impactScore = userProfile?.stats?.impactScore ?? 0;
  const ward        = userProfile?.ward || 'Ward 4';
  const email       = userProfile?.email || currentUser?.email || '';

  const handleSave = async () => {
    if (!currentUser) return;
    setSaving(true);
    try {
      const { updateUserProfile } = await import('../services/firestoreService');
      await updateUserProfile(currentUser.uid, {
        skills:    [...skills],
        languages: [...langs],
        ward,
      });
    } catch (e) {
      console.warn('Profile save failed:', e.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleSkill = (s) => setSkills(prev => {
    const next = new Set(prev);
    next.has(s) ? next.delete(s) : next.add(s);
    return next;
  });

  const toggleLang = (l) => setLangs(prev => {
    const next = new Set(prev);
    next.has(l) ? next.delete(l) : next.add(l);
    return next;
  });

  const toggleAvail = (period, dayIdx) => setAvail(prev => {
    const row = [...prev[period]];
    row[dayIdx] = !row[dayIdx];
    return { ...prev, [period]: row };
  });

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surfaceContainerLow} />

      {/* ── Top App Bar ─────────────────────────────────────────────────────── */}
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>My Profile</Text>
        <Pressable onPress={handleSave} disabled={saving}>
          <Text style={[styles.saveBtn, saving && { opacity: 0.5 }]}>{saving ? 'Saving…' : 'Save'}</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 90 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Profile Header ──────────────────────────────────────────────── */}
        <View style={styles.profileSection}>
          {/* Avatar */}
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              <Text style={styles.avatarTxt}>{initials}</Text>
            </View>
            <View style={styles.editBadge}>
              <PencilIcon size={12} color={Colors.primary} strokeWidth={2.5} />
            </View>
          </View>

          {/* Name */}
          <Text style={styles.name}>{displayName}</Text>

          {/* Email */}
          <View style={styles.phoneRow}>
            <LockIcon size={14} color={Colors.onSurfaceVariant} strokeWidth={2} />
            <Text style={styles.phoneTxt}>{email}</Text>
          </View>

          {/* Impact badge */}
          <View style={styles.impactBadge}>
            <StarIcon size={14} color="#085041" strokeWidth={0} fill="#085041" />
            <Text style={styles.impactTxt}>IMPACT · {impactScore}</Text>
          </View>
        </View>

        {/* ── Skills ──────────────────────────────────────────────────────── */}
        <SectionLabel>YOUR SKILLS</SectionLabel>
        <View style={styles.chipRow}>
          {ALL_SKILLS.map(s => (
            <Chip key={s} label={s} selected={skills.has(s)} onPress={() => toggleSkill(s)} />
          ))}
        </View>

        {/* ── Languages ───────────────────────────────────────────────────── */}
        <SectionLabel>LANGUAGES SPOKEN</SectionLabel>
        <View style={styles.chipRow}>
          {ALL_LANGS.map(l => (
            <Chip key={l} label={l} selected={langs.has(l)} onPress={() => toggleLang(l)} />
          ))}
        </View>

        {/* ── Zone ────────────────────────────────────────────────────────── */}
        <SectionLabel>YOUR PRIMARY ZONE</SectionLabel>
        <Pressable style={styles.zoneRow}>
          <MapPinIcon size={18} color={Colors.primary} strokeWidth={2} />
          <Text style={styles.zoneTxt}>{ward} — Nagar Road area</Text>
          <ChevronDownIcon size={18} color={Colors.onSurfaceVariant} strokeWidth={2} />
        </Pressable>

        {/* ── Availability Grid ────────────────────────────────────────────── */}
        <SectionLabel>WHEN ARE YOU AVAILABLE?</SectionLabel>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View>
            {/* Day headers */}
            <View style={styles.gridRow}>
              <View style={styles.periodLabelCell} />
              {DAYS.map(d => (
                <View key={d} style={styles.dayHeader}>
                  <Text style={styles.dayHeaderTxt}>{d}</Text>
                </View>
              ))}
            </View>
            {/* Time rows */}
            {PERIODS.map(period => (
              <View key={period} style={styles.gridRow}>
                <View style={styles.periodLabelCell}>
                  <Text style={styles.periodLabel}>{period}</Text>
                </View>
                {DAYS.map((d, i) => {
                  const on = avail[period][i];
                  return (
                    <Pressable
                      key={d}
                      onPress={() => toggleAvail(period, i)}
                      style={[styles.gridCell, on && styles.gridCellOn]}
                    >
                      {on && <CheckIcon size={16} color="#fff" strokeWidth={2.5} />}
                    </Pressable>
                  );
                })}
              </View>
            ))}
          </View>
        </ScrollView>

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <Text style={styles.lastActive}>Last active: 2 hours ago</Text>

        {/* Sign out */}
        <Pressable
          style={styles.signOutBtn}
          onPress={signOut}
        >
          <Text style={styles.signOutTxt}>Sign Out</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

/* ─── Styles ────────────────────────────────────────────────────────────────── */
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLow, // mint #EFF5EF
  },

  /* Top bar */
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: Colors.surfaceContainerLow,
  },
  topBarTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.onSurface,
    letterSpacing: -0.3,
  },
  saveBtn: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.outline,
  },

  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 24,
    paddingTop: 8,
    gap: 16,
  },

  /* Profile header */
  profileSection: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  avatarWrapper: { position: 'relative' },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 16, // rounded square like reference (bg-primary-container)
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarTxt: {
    fontSize: 26,
    fontWeight: '600',
    color: '#fff',
  },
  editBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.onSurface,
    marginTop: 4,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  phoneTxt: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
  },
  impactBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: '#E1F5EE',
    borderRadius: 999,
  },
  impactTxt: {
    fontSize: 11,
    fontWeight: '700',
    color: '#085041',
    letterSpacing: 0.8,
  },

  /* Section labels */
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: Colors.onSurfaceVariant,
    opacity: 0.7,
    marginBottom: -8,
  },

  /* Chips */
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    backgroundColor: 'transparent',
  },
  chipSelected: {
    backgroundColor: Colors.primaryContainer,
    borderColor: Colors.primaryContainer,
  },
  chipTxt: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.onSurfaceVariant,
  },
  chipTxtSelected: {
    color: '#fff',
  },

  /* Zone */
  zoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.outlineVariant + '50',
  },
  zoneTxt: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: Colors.onSurface,
  },

  /* Availability grid */
  gridRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  periodLabelCell: {
    width: 76,
    justifyContent: 'center',
  },
  periodLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
    letterSpacing: 0.6,
  },
  dayHeader: {
    width: 44,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  dayHeaderTxt: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
    letterSpacing: 0.4,
  },
  gridCell: {
    width: 44,
    height: 40,
    borderRadius: 4,
    backgroundColor: Colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: Colors.outlineVariant + '50',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  gridCellOn: {
    backgroundColor: Colors.primaryContainer,
    borderColor: Colors.primaryContainer,
  },

  /* Footer */
  lastActive: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    opacity: 0.6,
    fontStyle: 'italic',
    paddingTop: 8,
  },

  signOutBtn: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.errorContainer,
    borderRadius: 14,
    marginTop: 4,
  },
  signOutTxt: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.urgent,
  },
});
