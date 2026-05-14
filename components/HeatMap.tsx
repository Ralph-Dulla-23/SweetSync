import React, { useMemo, useEffect } from 'react';
import { 
  View, 
  Text, 
  Pressable, 
} from 'react-native';
import { colors, fonts } from '@/constants/theme';
import { getHeatShade } from '@/lib/heatmap';
import { Sparkle, Users, Warning } from 'phosphor-react-native';
import { TimeSlot, MyBlock, Preference } from '@/types';
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
  withDelay
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

// Lightweight static cell for the majority of the grid
const StaticHeatCell = React.memo(({
  slot,
  backgroundColor,
  isEditMode,
  isMeBusy,
  isUncertain,
  blockTitle,
  onPress,
  onToggle,
}: any) => {
  return (
    <Pressable 
      onPress={() => isEditMode ? onToggle(slot.date, slot.slotIndex) : onPress(slot)}
      style={styles.cellWrapper}
    >
      <View
        style={[
          styles.cell, 
          { backgroundColor },
          isEditMode && !isMeBusy && styles.myBusyCell,
          isUncertain && { borderColor: colors.peachPunch, borderWidth: 1, borderStyle: 'dashed' }
        ]}
      >
        {isEditMode && !isMeBusy && blockTitle && (
          <Text style={styles.cellTitle} numberOfLines={1}>{blockTitle}</Text>
        )}
      </View>
    </Pressable>
  );
});

// Heavier cell only for magic/selected/uncertain slots with animations
const AnimatedHeatCell = React.memo(({
  slot,
  backgroundColor,
  isMagic,
  isSelected,
  isUncertain,
  isEditMode,
  isMeBusy,
  blockTitle,
  pulse,
  onPress,
  onToggle,
  freeCount,
}: any) => {
  const magicAnimatedStyle = useAnimatedStyle(() => {
    if (!isMagic && !isUncertain) return {};
    const borderColor = isUncertain ? colors.peachPunch : colors.peachPunch;
    return {
      borderColor: interpolateColor(
        pulse.value,
        [0, 1],
        [borderColor, isUncertain ? colors.white : colors.peachSoft]
      ),
      borderWidth: (isMagic ? 1.5 : 2) + pulse.value * 1,
    };
  });

  const scale = useSharedValue(1);
  useEffect(() => {
    if (isSelected) {
      scale.value = withSequence(
        withTiming(1.15, { duration: 150, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 150, easing: Easing.in(Easing.quad) })
      );
    }
  }, [isSelected]);

  const selectedAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable 
      onPress={() => isEditMode ? onToggle(slot.date, slot.slotIndex) : onPress(slot)}
      style={styles.cellWrapper}
    >
      <Animated.View
        style={[
          styles.cell, 
          { backgroundColor },
          isMagic && styles.magicSlotCell,
          isSelected && styles.selectedCell,
          isUncertain && { borderWidth: 2, borderStyle: 'solid' },
          isEditMode && !isMeBusy && styles.myBusyCell,
          magicAnimatedStyle,
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
            <Text style={styles.selectionText}>{freeCount}</Text>
          </View>
        )}
        {isEditMode && !isMeBusy && blockTitle && (
          <Text style={styles.cellTitle} numberOfLines={1}>{blockTitle}</Text>
        )}
      </Animated.View>
    </Pressable>
  );
});

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
  
  const backgroundColor = isEditMode 
    ? (isMeBusy ? colors.pageBg : (myPreference === 2 ? colors.indigoNeon : colors.indigoPunch))
    : getHeatShade(slot.freeCount, slot.preferredCount, totalMembers);

  if (isMagic || isSelected || isUncertain) {
    return (
      <AnimatedHeatCell 
        slot={slot}
        backgroundColor={backgroundColor}
        isMagic={isMagic}
        isSelected={isSelected}
        isUncertain={isUncertain}
        isEditMode={isEditMode}
        isMeBusy={isMeBusy}
        blockTitle={blockTitle}
        pulse={pulse}
        onPress={onPress}
        onToggle={onToggle}
        freeCount={slot.freeCount}
      />
    );
  }

  return (
    <StaticHeatCell 
      slot={slot}
      backgroundColor={backgroundColor}
      isEditMode={isEditMode}
      isMeBusy={isMeBusy}
      isUncertain={isUncertain}
      blockTitle={blockTitle}
      onPress={onPress}
      onToggle={onToggle}
    />
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
  return (
    <Animated.View 
      entering={FadeInUp.delay(dayIndex * 50).duration(400)}
      style={styles.column}
    >
      {slots.map((slot) => {
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
      })}
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

