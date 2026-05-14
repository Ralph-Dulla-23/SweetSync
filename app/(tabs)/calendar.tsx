import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, spacing, radius } from '@/constants/theme';
import { Header } from '@/components/Header';
import { HeatMap } from '@/components/HeatMap';
import { EmptyState } from '@/components/EmptyState';
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
  runOnJS,
  SlideOutDown
} from 'react-native-reanimated';

// --- Interactive Bottom Sheet Sub-component ---
function InteractiveBottomSheet({ selectedSlot, clearSelection }: any) {
  const insets = useSafeAreaInsets();
  const SHEET_HEIGHT = 220; // Reduced height for more compact feel
  
  const OPEN_Y = 0;
  const HIDDEN_Y = SHEET_HEIGHT + 50;

  const translateY = useSharedValue(HIDDEN_Y);

  // Internal state to hold data during transition
  const [internalSlot, setInternalSlot] = React.useState<any>(null);

  const SPRING_CONFIG = { 
    damping: 25, 
    stiffness: 200, // Slightly snappier
    mass: 1,
    overshootClamping: true
  };

  const handleDismiss = React.useCallback(() => {
    translateY.value = withSpring(HIDDEN_Y, SPRING_CONFIG, (finished) => {
      if (finished) {
        runOnJS(setInternalSlot)(null);
        runOnJS(clearSelection)();
      }
    });
  }, [clearSelection]);

  React.useEffect(() => {
    if (selectedSlot) {
      setInternalSlot(selectedSlot);
      translateY.value = withSpring(OPEN_Y, SPRING_CONFIG);
    } else if (internalSlot) {
      handleDismiss();
    }
  }, [selectedSlot]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    zIndex: 1000,
    opacity: translateY.value > SHEET_HEIGHT ? 0 : 1,
  }));

  const displaySlot = selectedSlot || internalSlot;
  if (!displaySlot) return null;

  const formattedDate = format(parseISO(displaySlot.date), 'EEEE, MMM do');
  const formattedTime = slotIndexToTime(displaySlot.slotIndex);

  return (
    <GestureDetector 
      gesture={Gesture.Pan()
        .onUpdate((e) => {
          translateY.value = Math.max(OPEN_Y, e.translationY);
        })
        .onEnd((e) => {
          if (e.translationY > 80 || e.velocityY > 500) {
            runOnJS(handleDismiss)();
          } else {
            translateY.value = withSpring(OPEN_Y, SPRING_CONFIG);
          }
        })
      }
    >
      <Animated.View 
        style={[
          styles.detailSheet, 
          { 
            height: SHEET_HEIGHT,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            // Removed insets.bottom because it sits on the tab bar
            paddingBottom: spacing[3]
          },
          animatedStyle,
        ]}
      >
        <View style={styles.dragHandle} />
        
        <View style={{ flex: 1 }}>
          <View style={styles.detailHeader}>
            <View style={styles.detailTitleRow}>
              <Text style={styles.detailTitle}>
                {formattedDate} at {formattedTime}
              </Text>
              <TouchableOpacity 
                onPress={handleDismiss}
                hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                style={{ padding: 4 }}
              >
                <X size={20} color={colors.textSecondary} weight="bold" />
              </TouchableOpacity>
            </View>
            <Text style={styles.detailSubtitle}>
              {displaySlot.freeCount} members are available ({displaySlot.preferredCount} prefer this)
            </Text>
          </View>
          
          <View style={styles.memberList}>
            {displaySlot.members.map((member: string, i: number) => {
              const isPreferred = displaySlot.preferredMembers.includes(member);
              return (
                <View key={i} style={[styles.memberChip, isPreferred && { backgroundColor: colors.indigoBase }]}>
                  <Users size={14} color={isPreferred ? colors.indigoNeon : colors.indigoPunch} weight="fill" />
                  <Text style={[styles.memberChipText, i === 0 && { color: colors.indigoPunch }]}>{member}</Text>
                </View>
              );
            })}
          </View>
        </View>
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

  const mockTasks = [
    { id: 't1', title: 'Movie Night', squad: 'Weekend Plans', time: '8:00 PM', type: 'squad' },
    { id: 't2', title: 'Study Session', squad: 'Personal', time: '10:00 AM', type: 'personal' },
    { id: 't3', title: 'Gym with Marco', squad: 'Personal', time: '4:00 PM', type: 'personal' },
  ];

  if (isEmpty) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header 
          title="Calendar" 
          rightElement={<Text style={styles.month}>May 2026</Text>}
        />
        <EmptyState 
          icon={<CalendarBlank size={48} color={colors.textTertiary} weight="thin" />}
          title="No events yet"
          description="Create a room or join one to start syncing your squad's schedule."
        />
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
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 + insets.bottom }]}
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

        <View style={styles.taskSection}>
          <View style={styles.taskHeader}>
            <Text style={styles.taskSectionTitle}>Today's Plans</Text>
          </View>
          
          <View style={styles.taskList}>
            {mockTasks.map((task, i) => (
              <Animated.View 
                key={task.id}
                entering={FadeInDown.delay(i * 100)}
                style={[
                  styles.taskItem,
                  task.type === 'squad' ? styles.squadTask : styles.personalTask
                ]}
              >
                <View style={styles.taskLeft}>
                  <Text style={styles.taskTime}>{task.time}</Text>
                  <View style={styles.taskDetails}>
                    <Text style={styles.taskTitle}>{task.title}</Text>
                    <Text style={styles.taskSquad}>{task.squad}</Text>
                  </View>
                </View>
                <View style={[
                  styles.taskStatus,
                  { backgroundColor: task.type === 'squad' ? colors.mintPunch : colors.peachPunch }
                ]} />
              </Animated.View>
            ))}
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
