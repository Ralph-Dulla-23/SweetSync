import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { colors } from '@/constants/theme';
import { CaretRight } from 'phosphor-react-native';
import { styles } from '@/app/(tabs)/_profile.styles';

interface PrivacySettingsProps {
  profilePublic: boolean;
  heatMapOnly: boolean;
  onOpenPrivacy: (tab: 'profile' | 'schedule') => void;
}

export const PrivacySettings = ({ profilePublic, heatMapOnly, onOpenPrivacy }: PrivacySettingsProps) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>Privacy</Text>
      <View style={styles.sectionCard}>
        <Pressable style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]} onPress={() => onOpenPrivacy('profile')}>
          <Text style={styles.rowText}>Profile visibility</Text>
          <View style={styles.rowRight}><Text style={styles.rowValue}>{profilePublic ? 'Public' : 'Private'}</Text><CaretRight size={16} color={colors.textTertiary} /></View>
        </Pressable>
        <View style={styles.rowDivider} />
        <Pressable style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]} onPress={() => onOpenPrivacy('schedule')}>
          <Text style={styles.rowText}>Schedule visibility</Text>
          <View style={styles.rowRight}><Text style={styles.rowValue}>{heatMapOnly ? 'Heat map only' : 'Detailed'}</Text><CaretRight size={16} color={colors.textTertiary} /></View>
        </Pressable>
      </View>
    </View>
  );
};
