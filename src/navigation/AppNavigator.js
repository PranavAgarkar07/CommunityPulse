import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';

import LoginScreen      from '../screens/LoginScreen';
import SignupScreen     from '../screens/SignupScreen';
import HomeScreen       from '../screens/HomeScreen';
import TasksScreen      from '../screens/TasksScreen';
import TaskDetailScreen from '../screens/TaskDetailScreen';
import ProfileScreen    from '../screens/ProfileScreen';
import ReportScreen     from '../screens/ReportScreen';
import { CustomTabBar } from '../components/CustomTabBar';

const Stack = createStackNavigator();
const Tab   = createBottomTabNavigator();

// ── Bottom Tab Navigator ──────────────────────────────────────────────────────
function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen name="Home"    component={HomeScreen} />
      <Tab.Screen name="Report"  component={ReportScreen} />
      <Tab.Screen name="Tasks"   component={TasksScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// ── Auth Stack (unauthenticated) ──────────────────────────────────────────────
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login"  component={LoginScreen}  options={{ animation: 'fade' }} />
      <Stack.Screen name="Signup" component={SignupScreen} options={{ animation: 'slide_from_right' }} />
    </Stack.Navigator>
  );
}

// ── App Stack (authenticated) ─────────────────────────────────────────────────
function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: Colors.surfaceContainerLow },
      }}
    >
      <Stack.Screen name="MainApp"    component={MainTabs}        options={{ animation: 'fade' }} />
      <Stack.Screen name="TaskDetail" component={TaskDetailScreen} options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="Profile"    component={ProfileScreen}   options={{ animation: 'slide_from_right' }} />
    </Stack.Navigator>
  );
}

// ── Root Navigator — auth-gated ───────────────────────────────────────────────
export default function AppNavigator() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.surfaceContainerLow }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {currentUser ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
