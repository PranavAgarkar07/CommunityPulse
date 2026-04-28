/**
 * CommunityPulse — SVG Icon Library
 * All icons from a consistent set (Lucide-style, 24x24 viewBox)
 * No emojis — following UI/UX Pro Max guidelines
 */
import React from 'react';
import Svg, { Path, Circle, Rect, Line, Polyline, Polygon } from 'react-native-svg';

const defaultSize = 24;
const defaultColor = '#171D1A';

export function HomeIcon({ size = defaultSize, color = defaultColor, strokeWidth = 1.75 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <Polyline points="9 22 9 12 15 12 15 22" />
    </Svg>
  );
}

export function ClipboardIcon({ size = defaultSize, color = defaultColor, strokeWidth = 1.75 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      <Path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <Path d="M12 11h4" /><Path d="M12 16h4" /><Path d="M8 11h.01" /><Path d="M8 16h.01" />
    </Svg>
  );
}

export function PlusCircleIcon({ size = defaultSize, color = defaultColor, strokeWidth = 1.75 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="12" r="10" />
      <Path d="M12 8v8" /><Path d="M8 12h8" />
    </Svg>
  );
}

export function UserIcon({ size = defaultSize, color = defaultColor, strokeWidth = 1.75 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <Circle cx="12" cy="7" r="4" />
    </Svg>
  );
}

export function AlertTriangleIcon({ size = defaultSize, color = defaultColor, strokeWidth = 1.75 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <Path d="M12 9v4" /><Path d="M12 17h.01" />
    </Svg>
  );
}

export function CheckCircleIcon({ size = defaultSize, color = defaultColor, strokeWidth = 1.75 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <Polyline points="22 4 12 14.01 9 11.01" />
    </Svg>
  );
}

export function XCircleIcon({ size = defaultSize, color = defaultColor, strokeWidth = 1.75 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="12" r="10" />
      <Path d="m15 9-6 6" /><Path d="m9 9 6 6" />
    </Svg>
  );
}

export function MapPinIcon({ size = defaultSize, color = defaultColor, strokeWidth = 1.75 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <Circle cx="12" cy="10" r="3" />
    </Svg>
  );
}

export function WifiOffIcon({ size = defaultSize, color = defaultColor, strokeWidth = 1.75 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M1 6C1 6 5 2 12 2s11 4 11 4" /><Path d="M5 12.55a11 11 0 0 1 14.08 0" />
      <Path d="M1.42 9a16 16 0 0 1 21.16 0" /><Path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <Path d="m2 2 20 20" /><Line x1="12" x2="12.01" y1="20" y2="20" />
    </Svg>
  );
}

export function WifiIcon({ size = defaultSize, color = defaultColor, strokeWidth = 1.75 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M5 12.55a11 11 0 0 1 14.08 0" /><Path d="M1.42 9a16 16 0 0 1 21.16 0" />
      <Path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><Line x1="12" x2="12.01" y1="20" y2="20" />
    </Svg>
  );
}

export function ChevronRightIcon({ size = defaultSize, color = defaultColor, strokeWidth = 1.75 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="m9 18 6-6-6-6" />
    </Svg>
  );
}

export function ArrowLeftIcon({ size = defaultSize, color = defaultColor, strokeWidth = 1.75 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="m12 19-7-7 7-7" /><Path d="M19 12H5" />
    </Svg>
  );
}

export function StarIcon({ size = defaultSize, color = defaultColor, fill = 'none', strokeWidth = 1.75 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </Svg>
  );
}

export function TargetIcon({ size = defaultSize, color = defaultColor, strokeWidth = 1.75 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="12" r="10" /><Circle cx="12" cy="12" r="6" /><Circle cx="12" cy="12" r="2" />
    </Svg>
  );
}

export function BrainIcon({ size = defaultSize, color = defaultColor, strokeWidth = 1.75 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
      <Path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
    </Svg>
  );
}

export function ShieldIcon({ size = defaultSize, color = defaultColor, strokeWidth = 1.75 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </Svg>
  );
}

export function BellIcon({ size = defaultSize, color = defaultColor, strokeWidth = 1.75 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <Path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </Svg>
  );
}

export function GlobeIcon({ size = defaultSize, color = defaultColor, strokeWidth = 1.75 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="12" r="10" />
      <Path d="M2 12h20" />
      <Path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </Svg>
  );
}

export function CameraIcon({ size = defaultSize, color = defaultColor, strokeWidth = 1.75 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <Circle cx="12" cy="13" r="3" />
    </Svg>
  );
}

export function MailIcon({ size = defaultSize, color = defaultColor, strokeWidth = 1.75 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Rect width="20" height="16" x="2" y="4" rx="2" />
      <Path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </Svg>
  );
}

export function LockIcon({ size = defaultSize, color = defaultColor, strokeWidth = 1.75 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <Path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </Svg>
  );
}

export function PhoneIcon({ size = defaultSize, color = defaultColor, strokeWidth = 1.75 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 13 19.79 19.79 0 0 1 1.91 4.4 2 2 0 0 1 3.88 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </Svg>
  );
}

export function UsersIcon({ size = defaultSize, color = defaultColor, strokeWidth = 1.75 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <Circle cx="9" cy="7" r="4" />
      <Path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <Path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </Svg>
  );
}

export function ActivityIcon({ size = defaultSize, color = defaultColor, strokeWidth = 1.75 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </Svg>
  );
}

export function LogOutIcon({ size = defaultSize, color = defaultColor, strokeWidth = 1.75 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <Polyline points="16 17 21 12 16 7" />
      <Line x1="21" x2="9" y1="12" y2="12" />
    </Svg>
  );
}

export function SettingsIcon({ size = defaultSize, color = defaultColor, strokeWidth = 1.75 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <Circle cx="12" cy="12" r="3" />
    </Svg>
  );
}

export function TrendingUpIcon({ size = defaultSize, color = defaultColor, strokeWidth = 1.75 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <Polyline points="16 7 22 7 22 13" />
    </Svg>
  );
}

export function HeartHandshakeIcon({ size = defaultSize, color = defaultColor, strokeWidth = 1.75 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      <Path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66" />
      <Path d="m18 15-2-2" /><Path d="m15 18-2-2" />
    </Svg>
  );
}

export function ClockIcon({ size = defaultSize, color = defaultColor, strokeWidth = 1.75 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="12" r="10" />
      <Path d="M12 6v6l4 2" />
    </Svg>
  );
}

export function EyeIcon({ size = defaultSize, color = defaultColor, strokeWidth = 1.75 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <Circle cx="12" cy="12" r="3" />
    </Svg>
  );
}

export function EyeOffIcon({ size = defaultSize, color = defaultColor, strokeWidth = 1.75 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <Path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <Path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <Path d="m2 2 20 20" />
    </Svg>
  );
}

export function PencilIcon({ size = defaultSize, color = defaultColor, strokeWidth = 1.75 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    </Svg>
  );
}

export function ChevronDownIcon({ size = defaultSize, color = defaultColor, strokeWidth = 1.75 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="m6 9 6 6 6-6" />
    </Svg>
  );
}

export function CheckIcon({ size = defaultSize, color = defaultColor, strokeWidth = 1.75 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M20 6 9 17l-5-5" />
    </Svg>
  );
}

export function MicIcon({ size = defaultSize, color = defaultColor, strokeWidth = 1.75 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <Path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <Path d="M12 19v4" />
      <Path d="M8 23h8" />
    </Svg>
  );
}
