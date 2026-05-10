import React, { useMemo, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
} from 'react-native';
import { colors, fonts, spacing, radius } from '@/constants/theme';
import { getHeatShade } from '@/lib/heatmap';
import { Sparkle, Users } from 'phosphor-react-native';
import { TimeSlot, MyBlock } from '@/types';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withSequence, 
  withTiming, 
  Easing,
  interpolateColor,
  FadeInUp
} from 'react-native-reanimated';
import { styles } from './HeatMap.styles';

interface HeatCellProps {
  slot: TimeSlot;
  totalMembers: number;
  isMagic: boolean;
  isSelected: boolean;
  isMeBusy: boolean;
  isEditMode: boolean;
  blockTitle: string | null;
  onPress: (slot: TimeSlot) => void;
  onToggle: (day: number, hour: number) => void;
}

const HeatCell = React.memo(({
  slot,
  totalMembers,
  isMagic,
  isSelected,
  isMeBusy,
  isEditMode,
  blockTitle,
  onPress,
  onToggle,
}: HeatCellProps) => {
  const backgroundColor = isEditMode 
    ? (isMeBusy ? colors.indigoPunch : colors.pageBg)
    : getHeatShade(slot.freeCount, totalMembers);

  // Pulse animation for Magic Slots
  const pulse = useSharedValue(0);
  useEffect(() => {
    if (isMagic) {
      pulse.value = withRepeat(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        -1,
        true
      );
    } else {
      pulse.value = 0;
    }
  }, [isMagic]);

  const magicAnimatedStyle = useAnimatedStyle(() => {
    if (!isMagic) return {};
    return {
      borderColor: interpolateColor(
        pulse.value,
        [0, 1],
        [colors.peachPunch, colors.peachSoft]
      ),
      borderWidth: 1.5 + pulse.value * 0.5,
    };
  });

  // Pop animation for Selection
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
    <TouchableOpacity 
      activeOpacity={0.6}
      onPress={() => isEditMode ? onToggle(slot.dayIndex, slot.hourIndex) : onPress(slot)}
      style={styles.cellWrapper}
    >
      <Animated.View
        style={[
          styles.cell, 
          { backgroundColor },
          isMagic && styles.magicSlotCell,
          isSelected && styles.selectedCell,
          isEditMode && isMeBusy && styles.myBusyCell,
          magicAnimatedStyle,
          selectedAnimatedStyle,
        ]}
      >
        {isMagic && slot.hourIndex === 8 && (
          <View style={styles.sparkleContainer}>
            <Sparkle size={14} weight="fill" color={colors.peachPunch} />
          </View>
        )}
        {isSelected && (
          <View style={styles.selectionIndicator}>
            <Users size={12} weight="bold" color={colors.white} />
            <Text style={styles.selectionText}>{slot.freeCount}</Text>
          </View>
        )}
        {isEditMode && isMeBusy && blockTitle && (
          <Text style={styles.cellTitle} numberOfLines={1}>{blockTitle}</Text>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
});

interface DayColumnProps {
  dayIndex: number;
  slots: TimeSlot[];
  totalMembers: number;
  magicSlots: { dayIndex: number; hourIndex: number }[];
  selectedSlot: TimeSlot | null;
  mySchedule: Set<string>;
  myBlocks: MyBlock[];
  isEditMode: boolean;
  onCellPress: (slot: TimeSlot) => void;
  onToggleCell: (day: number, hour: number) => void;
}

const DayColumn = React.memo(({
  dayIndex,
  slots,
  totalMembers,
  magicSlots,
  selectedSlot,
  mySchedule,
  myBlocks,
  isEditMode,
  onCellPress,
  onToggleCell,
}: DayColumnProps) => {
  return (
    <Animated.View 
      entering={FadeInUp.delay(dayIndex * 50).duration(400)}
      style={styles.column}
    >
      {slots.map((slot, hourIndex) => {
        const isMagic = !isEditMode && magicSlots.some(s => s.dayIndex === dayIndex && s.hourIndex === hourIndex);
        const isSelected = !isEditMode && selectedSlot?.dayIndex === dayIndex && selectedSlot?.hourIndex === hourIndex;
        const isMeBusy = mySchedule.has(`${dayIndex}-${hourIndex}`);
        const block = myBlocks.find(b => b.dayIndex === dayIndex && b.startHour === hourIndex);
        
        return (
          <HeatCell 
            key={`${dayIndex}-${hourIndex}`}
            slot={slot}
            totalMembers={totalMembers}
            isMagic={isMagic}
            isSelected={isSelected}
            isMeBusy={isMeBusy}
            isEditMode={isEditMode}
            blockTitle={block ? block.title : null}
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
  magicSlots: { dayIndex: number; hourIndex: number }[];
  onCellPress?: (slot: TimeSlot) => void;
  selectedSlot?: TimeSlot | null;
  isEditMode?: boolean;
  onToggleCell?: (dayIndex: number, hourIndex: number) => void;
  mySchedule?: Set<string>;
  myBlocks?: MyBlock[];
  lowConfidenceCells?: string[];
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TIMES = ["8 AM", "10 AM", "12 PM", "2 PM", "4 PM", "6 PM", "8 PM", "10 PM"];

export const HeatMap: React.FC<HeatMapProps> = ({
  data,
  totalMembers,
  magicSlots,
  onCellPress = () => {},
  selectedSlot = null,
  isEditMode = false,
  onToggleCell = () => {},
  mySchedule = new Set(),
  myBlocks = [],
}) => {
  return (
    <View style={styles.gridContainer}>
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
          {TIMES.map((time) => (
            <View key={time} style={styles.timeLabelCell}>
              <Text style={styles.timeLabel}>{time}</Text>
            </View>
          ))}
        </View>

        {/* Heat Map Cells (Columns) */}
        <View style={styles.cellsArea}>
          {data.map((columnSlots, dayIndex) => (
            <DayColumn 
              key={`col-${dayIndex}`}
              dayIndex={dayIndex}
              slots={columnSlots}
              totalMembers={totalMembers}
              magicSlots={magicSlots}
              selectedSlot={selectedSlot}
              mySchedule={mySchedule}
              myBlocks={myBlocks}
              isEditMode={isEditMode}
              onCellPress={onCellPress}
              onToggleCell={onToggleCell}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

