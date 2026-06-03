/**
 * App Navigator — Navigation Configuration
 *
 * Tab-based navigation with Home and Settings tabs.
 * Uses React Navigation with a bottom tab bar styled
 * to match the dark premium theme.
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { Colors, Typography } from '../constants/theme';
import { useSettingsStore } from '../stores/settingsStore';

const Tab = createBottomTabNavigator();

export function AppNavigator() {
  const onboardingCompleted = useSettingsStore((state) => state.onboardingCompleted);

  if (!onboardingCompleted) {
    return <OnboardingScreen />;
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: Colors.accent.saffron,
          tabBarInactiveTintColor: Colors.text.tertiary,
          tabBarLabelStyle: styles.tabLabel,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Panchang',
            tabBarIcon: ({ color }) => (
              <TabIcon emoji="🕉️" color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarLabel: 'Settings',
            tabBarIcon: ({ color }) => (
              <TabIcon emoji="⚙️" color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// Simple emoji-based tab icon (avoids vector icon setup for now)
function TabIcon({ emoji }: { emoji: string; color: string }) {
  return (
    <React.Fragment>
      {React.createElement(
        require('react-native').Text,
        { style: { fontSize: 20 } },
        emoji,
      )}
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.background.deepIndigo,
    borderTopColor: Colors.glass.borderLight,
    borderTopWidth: StyleSheet.hairlineWidth,
    height: 80,
    paddingBottom: 20,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.medium,
  },
});
