import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, spacing, radius } from '@/constants/theme';
import { Header } from '@/components/Header';
import { HeatMap } from '@/components/HeatMap';
import { useHeatMap } from '@/hooks/useHeatMap';
import { useGlobalAvailability } from '@/hooks/useGlobalAvailability';
import { Info, Sparkle, X, Users, CalendarBlank } from 'phosphor-react-native';
import { styles } from './_calendar.styles';
import { format, parseISO } from 'date-fns';
import { slotIndexToTime } from '@/lib/time';
import { 
  GestureDetector, 
  Gesture,
} from 'react-native-gesture-handler';
import Animated, { 
  FadeIn, 
  FadeInDown, 
  Layout, 
  SlideInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS
} from 'react-native-reanimated';

// --- Sub-components ---

function InteractiveBottomSheet({ selectedSlot, clearSelection }: any) {
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(0);
  const context = useSharedValue({ y: 0 });

  const gesture = Gesture.Pan()
    .minDistance(10)
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      translateY.value = Math.max(0, event.translationY + context.value.y);
    })
    .onEnd((event) => {
      if (translateY.value > 80 || event.velocityY > 500) {
        translateY.value = withSpring(600, { damping: 25, stiffness: 150 });
        runOnJS(clearSelection)();
      } else {
        translateY.value = withSpring(0, { damping: 20 });
      }
    });

  React.useEffect(() => {
    if (selectedSlot) {
      translateY.value = withSpring(0, { damping: 20 });
    }
  }, [selectedSlot]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    zIndex: 1000,
  }));

  const formattedDate = selectedSlot ? format(parseISO(selectedSlot.date), 'EEEE, MMM do') : '';
  const formattedTime = selectedSlot ? slotIndexToTime(selectedSlot.slotIndex) : '';

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View 
        layout={Layout.springify().damping(22).stiffness(100)}
        style={[
          styles.detailSheet, 
          !selectedSlot && { height: 0, opacity: 0 },
          animatedStyle,
          { paddingBottom: insets.bottom + 20 }
        ]}
      >
        <View style={styles.dragHandle} />
        {selectedSlot && (
          <View style={{ flex: 1 }}>
            <View style={styles.detailHeader}>
              <View style={styles.detailTitleRow}>
                <Text style={styles.detailTitle}>
                  {formattedDate} at {formattedTime}
                </Text>
                <TouchableOpacity 
                  onPress={clearSelection}
                  hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                  style={{ padding: 4 }}
                >
                  <X size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
              <Text style={styles.detailSubtitle}>
                {selectedSlot.freeCount} members are available ({selectedSlot.preferredCount} prefer this)
              </Text>
            </View>
            <View style={styles.memberList}>
              {selectedSlot.members.map((member: string, i: number) => {
                const isPreferred = selectedSlot.preferredMembers.includes(member);
                return (
                  <View key={i} style={[styles.memberChip, isPreferred && { backgroundColor: colors.indigoBase }]}>
                    <Users size={14} color={isPreferred ? colors.indigoNeon : colors.indigoPunch} weight="fill" />
                    <Text style={[styles.memberChipText, i === 0 && { color: colors.indigoPunch }]}>{member}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </Animated.View>
    </GestureDetector>
  );
}

// --- Main Screen ---
export default function CalendarScreen() {
  const insets = useSafeAreaInsets();
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
      <SafeAreaView style={styles.container} edges={['top']}>
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
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header 
        title="Calendar" 
        rightElement={<Text style={styles.month}>May 2026</Text>}
      />
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 + insets.bottom }]}
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

      {/* Selected Slot Detail - Interactive Bottom Sheet */}
      <InteractiveBottomSheet 
        selectedSlot={selectedSlot}
        clearSelection={clearSelection}
      />
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
