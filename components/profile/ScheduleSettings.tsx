import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { colors } from '@/constants/theme';
import { CaretRight, FileText, MagicWand, ClockCounterClockwise, Plus } from 'phosphor-react-native';
import { styles } from '@/app/(tabs)/_profile.styles';

interface ScheduleSettingsProps {
  filesCount: number;
  onOpenFiles: () => void;
}

export const ScheduleSettings = ({ filesCount, onOpenFiles }: ScheduleSettingsProps) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>Schedule</Text>
      <View style={[styles.sectionCard, styles.engineCard]}>
        <Pressable 
          style={({ pressed }) => [styles.row, styles.engineRow, pressed && { opacity: 0.7 }]}
          onPress={onOpenFiles}
        >
          <View style={styles.rowLeft}>
            <FileText size={22} color={colors.indigoPunch} weight="duotone" />
            <Text style={styles.rowText}>Uploaded schedules</Text>
          </View>
          <View style={styles.rowRight}>
            <Text style={styles.rowValue}>{filesCount} {filesCount === 1 ? 'file' : 'files'}</Text>
            <CaretRight size={16} color={colors.textTertiary} />
          </View>
        </Pressable>
        <View style={styles.rowDivider} />
        <Pressable style={({ pressed }) => [styles.row, styles.engineRow, pressed && { opacity: 0.7 }]}>
          <View style={styles.rowLeft}><MagicWand size={22} color={colors.indigoPunch} weight="duotone" /><Text style={styles.rowText}>Default Time Range</Text></View>
          <View style={styles.rowRight}><Text style={styles.rowValue}>7 AM - 12 AM</Text><CaretRight size={16} color={colors.textTertiary} /></View>
        </Pressable>
        <View style={styles.rowDivider} />
        <Pressable style={({ pressed }) => [styles.row, styles.engineRow, pressed && { opacity: 0.7 }]}>
          <View style={styles.rowLeft}><ClockCounterClockwise size={22} color={colors.indigoPunch} weight="duotone" /><Text style={styles.rowText}>Quiet Hours</Text></View>
          <View style={styles.rowRight}><Text style={styles.rowValue}>11 PM - 8 AM</Text><CaretRight size={16} color={colors.textTertiary} /></View>
        </Pressable>
        <View style={styles.rowDivider} />
        <View style={[styles.row, styles.engineRow, { opacity: 0.6 }]}>
          <View style={styles.rowLeft}><Plus size={22} color={colors.indigoPunch} weight="duotone" /><Text style={styles.rowText}>Connect Google Calendar</Text></View>
          <View style={styles.badge}><Text style={styles.badgeText}>COMING SOON</Text></View>
        </View>
      </View>
    </View>
  );
};
