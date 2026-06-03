import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { styles } from '@/app/room/[id]/_calendar.styles';

interface CalendarTabsProps {
  activeTab: 'group' | 'mine';
  onTabChange: (tab: 'group' | 'mine') => void;
}

export const CalendarTabs = ({ activeTab, onTabChange }: CalendarTabsProps) => {
  return (
    <View style={styles.tabContainer}>
      <Pressable 
        style={({ pressed }) => [styles.tab, activeTab === 'group' && styles.activeTab, pressed && { opacity: 0.7 }]}
        onPress={() => onTabChange('group')}
      >
        <Text style={activeTab === 'group' ? styles.activeTabText : styles.inactiveTabText}>Group View</Text>
      </Pressable>
      <Pressable 
        style={({ pressed }) => [styles.tab, activeTab === 'mine' && styles.activeTab, pressed && { opacity: 0.7 }]}
        onPress={() => onTabChange('mine')}
      >
        <Text style={activeTab === 'mine' ? styles.activeTabText : styles.inactiveTabText}>My Schedule</Text>
      </Pressable>
    </View>
  );
};
