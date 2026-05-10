import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { colors, fonts, spacing, radius } from '@/constants/theme';
import { Header } from '@/components/Header';
import { HeatMap } from '@/components/HeatMap';
import { useHeatMap } from '@/hooks/useHeatMap';
import { useGlobalAvailability } from '@/hooks/useGlobalAvailability';
import { Info, Sparkle, X, Users, CalendarBlank } from 'phosphor-react-native';
import { styles } from './_calendar.styles';
import { format, parseISO } from 'date-fns';
import { slotIndexToTime } from '@/lib/time';

export default function CalendarScreen() {
  const { 
    mockData, 
    magicSlots, 
    selectedSlot, 
    handleCellPress, 
    clearSelection 
  } = useHeatMap(5);

  const { isEmpty, mySchedule } = useGlobalAvailability();

  if (isEmpty) {
    return (
      <SafeAreaView style={styles.container}>
        <Header 
          title="Calendar" 
          rightElement={<Text style={styles.month}>May 2026</Text>}
        />
        <View style={localStyles.emptyContainer}>
          <CalendarBlank size={48} color={colors.textTertiary} weight="thin" />
          <Text style={localStyles.emptyText}>No events yet — create a room to get started.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Calendar" 
        rightElement={<Text style={styles.month}>May 2026</Text>}
      />
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Global Availability</Text>
          <Text style={styles.sectionSubtitle}>Combined view of all your rooms</Text>
        </View>

        <HeatMap 
          data={mockData}
          totalMembers={5}
          magicSlots={magicSlots}
          onCellPress={handleCellPress}
          selectedSlot={selectedSlot}
          mySchedule={mySchedule}
        />

        <View style={styles.legendContainer}>
          <View style={styles.legendRow}>
            <Text style={styles.legendText}>Busy</Text>
            <View style={styles.legendGradient}>
              <View style={[styles.legendStep, { backgroundColor: colors.pageBg }]} />
              <View style={[styles.legendStep, { backgroundColor: colors.indigoBase }]} />
              <View style={[styles.legendStep, { backgroundColor: colors.indigoSoft }]} />
              <View style={[styles.legendStep, { backgroundColor: colors.indigoMid }]} />
              <View style={[styles.legendStep, { backgroundColor: colors.indigoPunch }]} />
              <View style={[styles.legendStep, { backgroundColor: colors.indigoNeon }]} />
            </View>
            <Text style={styles.legendText}>Prefer</Text>
          </View>
        </View>
      </ScrollView>

      {/* Selected Slot Detail */}
      {selectedSlot && (
        <View style={styles.detailSheet}>
          <View style={styles.dragHandle} />
          <View style={styles.detailHeader}>
            <View style={styles.detailTitleRow}>
              <Text style={styles.detailTitle}>
                {format(parseISO(selectedSlot.date), 'EEEE, MMM do')} at {slotIndexToTime(selectedSlot.slotIndex)}
              </Text>
              <TouchableOpacity onPress={clearSelection}>
                <X size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.detailSubtitle}>
              {selectedSlot.freeCount} members are available ({selectedSlot.preferredCount} prefer this)
            </Text>
          </View>
          <View style={styles.memberList}>
            {selectedSlot.members.map((member, i) => {
              const isPreferred = selectedSlot.preferredMembers.includes(member);
              return (
                <View key={i} style={[styles.memberChip, isPreferred && { backgroundColor: colors.indigoBase }]}>
                  <Users size={14} color={isPreferred ? colors.indigoNeon : colors.indigoPunch} weight="fill" />
                  <Text style={[styles.memberChipText, isPreferred && { color: colors.indigoPunch }]}>{member}</Text>
                </View>
              );
            })}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing[8],
    gap: spacing[4],
  },
  emptyText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  }
});
