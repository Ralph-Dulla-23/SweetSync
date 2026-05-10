import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { colors, fonts, spacing, radius } from '@/constants/theme';
import { Header } from '@/components/Header';
import { HeatMap } from '@/components/HeatMap';
import { useHeatMap } from '@/hooks/useHeatMap';
import { Info, Sparkle, X, Users } from 'phosphor-react-native';
import { styles } from './calendar.styles';

export default function CalendarScreen() {
  const { 
    mockData, 
    magicSlots, 
    selectedSlot, 
    handleCellPress, 
    clearSelection 
  } = useHeatMap(5);

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
            </View>
            <Text style={styles.legendText}>Free</Text>
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
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][selectedSlot.dayIndex]} at {selectedSlot.hourIndex + 8}:00
              </Text>
              <TouchableOpacity onPress={clearSelection}>
                <X size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.detailSubtitle}>
              {selectedSlot.freeCount} members are available
            </Text>
          </View>
          <View style={styles.memberList}>
            {selectedSlot.members.map((member, i) => (
              <View key={i} style={styles.memberChip}>
                <Users size={14} color={colors.indigoPunch} weight="fill" />
                <Text style={styles.memberChipText}>{member}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}


