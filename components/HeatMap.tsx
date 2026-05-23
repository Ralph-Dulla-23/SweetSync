import React, { useMemo, useEffect } from 'react';
import { 
  View, 
  Text, 
  Pressable, 
} from 'react-native';
import { colors, fonts } from '@/constants/theme';
import { getHeatShade, getHeatShadeIndex } from '@/lib/heatmap';
import { Sparkle, Users, Warning } from 'phosphor-react-native';
import { TimeSlot, MyBlock, Preference } from '@/types';
import { springConfigs } from '@/constants/animation';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withSequence, 
  withTiming, 
  Easing,
  interpolateColor,
  FadeInUp,
  SharedValue,
  withDelay,
  runOnJS,
  withSpring
} from 'react-native-reanimated';
import { styles } from './HeatMap.styles';
import { slotIndexToTime } from '@/lib/time';

interface HeatCellProps {
  slot: TimeSlot;
  totalMembers: number;
  isMagic: boolean;
  isSelected: boolean;
  isUncertain: boolean;
  myPreference: Preference;
  isEditMode: boolean;
  blockTitle: string | null;
  pulse: SharedValue<number>;
  onPress: (slot: TimeSlot) => void;
  onToggle: (date: string, slotIndex: number) => void;
}

const HeatCell = React.memo(({
  slot,
  totalMembers,
  isMagic,
  isSelected,
  isUncertain,
  myPreference,
  isEditMode,
  blockTitle,
  pulse,
  onPress,
  onToggle,
}: HeatCellProps) => {
  const isMeBusy = myPreference === 0;
  
  // Task G: Shade Index for background color transitions
  const targetIndex = useMemo(() => {
    if (isEditMode) {
      if (isMeBusy) return 0; // pageBg
      return myPreference === 2 ? 4 : 3; // indigoNeon (4) or indigoPunch (3)
    }
    return getHeatShadeIndex(slot.freeCount, totalMembers);
  }, [isEditMode, isMeBusy, myPreference, slot.freeCount, totalMembers]);

  const colorIndex = useSharedValue(targetIndex);

  useEffect(() => {
    colorIndex.value = withTiming(targetIndex, {
      duration: 220,
      easing: Easing.out(Easing.cubic),
    });
  }, [targetIndex]);

  const animatedBackground = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        colorIndex.value,
        [0, 1, 2, 3, 4],
        [
          colors.pageBg,
          colors.indigoBase,
          colors.indigoSoft,
          colors.indigoMid,
          colors.indigoPunch,
        ]
      ),
    };
  });

  // Task H: Tap ring expansion
  const ringScale = useSharedValue(1);
  
  const handlePress = () => {
    if (isEditMode) {
      onToggle(slot.date, slot.slotIndex);
      return;
    }

    if (isMagic) {
      ringScale.value = withSequence(
        withSpring(1.2, springConfigs.bouncy),
        withTiming(1, { duration: 100 })
      );
      // Open details after ring responds
      setTimeout(() => {
        onPress(slot);
      }, 150);
    } else {
      onPress(slot);
    }
  };

  const ringAnimatedStyle = useAnimatedStyle(() => {
    if (!isMagic && !isUncertain) return {};
    const borderColor = isUncertain ? colors.peachPunch : colors.peachPunch;
    return {
      borderColor: interpolateColor(
        pulse.value,
        [0, 1],
        [borderColor, isUncertain ? colors.white : colors.peachSoft]
      ),
      borderWidth: (isMagic ? 1.5 : 2) + pulse.value * 1,
      transform: [{ scale: ringScale.value }],
    };
  });

  // Selection scale animation
  const selectionScale = useSharedValue(1);
  useEffect(() => {
    if (isSelected) {
      selectionScale.value = withSequence(
        withTiming(1.15, { duration: 150, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 150, easing: Easing.in(Easing.quad) })
      );
    }
  }, [isSelected]);

  const selectedAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: selectionScale.value }],
  }));

  return (
    <Pressable 
      onPress={handlePress}
      style={styles.cellWrapper}
    >
      <Animated.View
        style={[
          styles.cell, 
          animatedBackground,
          isMagic && styles.magicSlotCell,
          isSelected && styles.selectedCell,
          isUncertain && { borderWidth: 2, borderStyle: 'solid' },
          isEditMode && !isMeBusy && styles.myBusyCell,
          ringAnimatedStyle,
          selectedAnimatedStyle,
        ]}
      >
        {isMagic && (slot.slotIndex % 2 === 0) && (
          <View style={styles.sparkleContainer}>
            <Sparkle size={14} weight="fill" color={colors.peachPunch} />
          </View>
        )}
        {isUncertain && (
          <View style={[styles.sparkleContainer, { backgroundColor: colors.peachPunch, borderRadius: 10, padding: 1 }]}>
            <Warning size={12} weight="bold" color={colors.white} />
          </View>
        )}
        {isSelected && (
          <View style={styles.selectionIndicator}>
            <Users size={12} weight="bold" color={colors.white} />
            <Text style={styles.selectionText}>{slot.freeCount}</Text>
          </View>
        )}
        {isEditMode && !isMeBusy && blockTitle && (
          <Text style={styles.cellTitle} numberOfLines={1}>{blockTitle}</Text>
        )}
      </Animated.View>
    </Pressable>
  );
});

interface DayColumnProps {
  dayIndex: number;
  slots: TimeSlot[];
  totalMembers: number;
  magicSlotsSet: Set<string>; // Optimized O(1) lookup
  uncertainSlotsSet: Set<string>; // Optimized O(1) lookup
  selectedSlot: TimeSlot | null;
  mySchedule: Map<string, Preference>;
  myBlocksMap: Map<string, string>; // Optimized O(1) lookup
  isEditMode: boolean;
  pulse: SharedValue<number>;
  onCellPress: (slot: TimeSlot) => void;
  onToggleCell: (date: string, slotIndex: number) => void;
}

const DayColumn = React.memo(({
  dayIndex,
  slots,
  totalMembers,
  magicSlotsSet,
  uncertainSlotsSet,
  selectedSlot,
  mySchedule,
  myBlocksMap,
  isEditMode,
  pulse,
  onCellPress,
  onToggleCell,
}: DayColumnProps) => {
  // Memoize the mapping logic to prevent recalculation unless data changes
  const renderedCells = useMemo(() => {
    return slots.map((slot) => {
      const slotKey = `${slot.date}-${slot.slotIndex}`;
      const isMagic = !isEditMode && magicSlotsSet.has(slotKey);
      const isUncertain = uncertainSlotsSet.has(slotKey);
      const isSelected = !isEditMode && selectedSlot?.date === slot.date && selectedSlot?.slotIndex === slot.slotIndex;
      const myPreference = mySchedule.get(slotKey) ?? 0;
      const blockTitle = myBlocksMap.get(slotKey) || null;
      
      return (
        <HeatCell 
          key={slotKey}
          slot={slot}
          totalMembers={totalMembers}
          isMagic={isMagic}
          isSelected={isSelected}
          isUncertain={isUncertain}
          myPreference={myPreference}
          isEditMode={isEditMode}
          blockTitle={blockTitle}
          pulse={pulse}
          onPress={onCellPress}
          onToggle={onToggleCell}
        />
      );
    });
  }, [
    slots, 
    totalMembers, 
    magicSlotsSet, 
    uncertainSlotsSet, 
    selectedSlot, 
    mySchedule, 
    myBlocksMap, 
    isEditMode, 
    pulse, 
    onCellPress, 
    onToggleCell
  ]);

  return (
    <Animated.View 
      entering={FadeInUp.delay(dayIndex * 50).duration(400)}
      style={styles.column}
    >
      {renderedCells}
    </Animated.View>
  );
});


interface HeatMapProps {
  data: TimeSlot[][];
  totalMembers: number;
  magicSlots: { date: string; slotIndex: number }[];
  onCellPress?: (slot: TimeSlot) => void;
  selectedSlot?: TimeSlot | null;
  isEditMode?: boolean;
  onToggleCell?: (date: string, slotIndex: number) => void;
  mySchedule?: Map<string, Preference>;
  myBlocks?: MyBlock[];
  startSlot?: number;
  endSlot?: number;
  lowConfidenceCells?: string[];
  backgroundOpacity?: number;
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const HeatMap: React.FC<HeatMapProps> = ({
  data,
  totalMembers,
  magicSlots,
  onCellPress = () => {},
  selectedSlot = null,
  isEditMode = false,
  onToggleCell = () => {},
  mySchedule = new Map(),
  myBlocks = [],
  startSlot = 14, // 7 AM
  endSlot = 48,   // 12 AM
  lowConfidenceCells = [],
  backgroundOpacity = 1,
}) => {
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, []);

  const timeLabels = useMemo(() => {
    const labels = [];
    for (let s = startSlot; s < endSlot; s += 2) {
      labels.push(slotIndexToTime(s));
    }
    return labels;
  }, [startSlot, endSlot]);

  const visibleData = useMemo(() => {
    return data.map(column => column.slice(startSlot, endSlot));
  }, [data, startSlot, endSlot]);

  // Pre-calculate block map for O(1) lookup inside the loop
  const myBlocksMap = useMemo(() => {
    const map = new Map<string, string>();
    myBlocks.forEach(b => {
      // Map all slots of the block
      for (let s = b.startSlot; s <= b.endSlot; s++) {
        map.set(`${b.date}-${s}`, b.title);
      }
    });
    return map;
  }, [myBlocks]);

  const magicSlotsSet = useMemo(() => {
    return new Set(magicSlots.map(s => `${s.date}-${s.slotIndex}`));
  }, [magicSlots]);

  const uncertainSlotsSet = useMemo(() => {
    return new Set(lowConfidenceCells);
  }, [lowConfidenceCells]);

  return (
    <View style={[styles.gridContainer, { opacity: backgroundOpacity }]}>
      {/* Day Headers */}
      <View style={styles.dayHeaderRow}>
        <View style={styles.timeLabelSpacer} />
        {DAYS.map((day) => (
          <View style={styles.dayHeaderCell} key={day}>
            <Text style={[styles.dayLabel, day === "Thu" && styles.todayLabel]}>{day}</Text>
          </View>
        ))}
      </View>

      {/* Grid Content */}
      <View style={styles.gridBody}>
        {/* Time Labels Column */}
        <View style={styles.timeColumn}>
          {timeLabels.map((time) => (
            <View key={time} style={styles.timeLabelCell}>
              <Text style={styles.timeLabel}>{time}</Text>
            </View>
          ))}
        </View>

        {/* Heat Map Cells (Columns) */}
        <View style={styles.cellsArea}>
          {visibleData.map((columnSlots, dayIndex) => (
            <DayColumn 
              key={`col-${dayIndex}`}
              dayIndex={dayIndex}
              slots={columnSlots}
              totalMembers={totalMembers}
              magicSlotsSet={magicSlotsSet}
              uncertainSlotsSet={uncertainSlotsSet}
              selectedSlot={selectedSlot}
              mySchedule={mySchedule}
              myBlocksMap={myBlocksMap}
              isEditMode={isEditMode}
              pulse={pulse}
              onCellPress={onCellPress}
              onToggleCell={onToggleCell}
            />
          ))}
        </View>
      </View>
    </View>
  );
};
