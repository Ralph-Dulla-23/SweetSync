import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { 
  House, 
  CalendarBlank, 
  Plus, 
  ListChecks, 
  UserCircle 
} from 'phosphor-react-native';
import { colors, fonts, spacing } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.peachPunch,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          height: 56 + insets.bottom,
          paddingBottom: insets.bottom,
          borderTopWidth: 0.5,
          borderTopColor: colors.borderDefault,
          backgroundColor: colors.surface,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.bodySemibold,
          fontSize: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <House weight={focused ? 'bold' : 'regular'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color, focused }) => (
            <CalendarBlank weight={focused ? 'bold' : 'regular'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <View style={styles.createButton}>
              <Plus weight="bold" size={24} color="#FFFFFF" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="votes"
        options={{
          title: 'Votes',
          tabBarIcon: ({ color, focused }) => (
            <ListChecks weight={focused ? 'bold' : 'regular'} size={24} color={color} />
          ),
          tabBarBadge: 2, // Example badge, would be dynamic
          tabBarBadgeStyle: {
            backgroundColor: colors.peachPunch,
            color: '#FFFFFF',
            fontSize: 10,
            fontFamily: fonts.bodySemibold,
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <UserCircle weight={focused ? 'bold' : 'regular'} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  createButton: {
    width: 48,
    height: 32,
    backgroundColor: colors.indigoPunch,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    ...Platform.select({
      ios: {
        shadowColor: colors.indigoPunch,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});
