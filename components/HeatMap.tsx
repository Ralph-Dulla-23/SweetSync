import React, { useMemo, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
} from 'react-native';
import { colors, fonts } from '@/constants/theme';
import { getHeatShade } from '@/lib/heatmap';
import { Sparkle, Users } from 'phosphor-react-native';
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
  SharedValue
} from 'react-native-reanimated';
import { styles } from './HeatMap.styles';
import { slotIndexToTime } from '@/lib/time';

interface HeatCellProps {
  slot: TimeSlot;
  totalMembers: number;
  isMagic: boolean;
  isSelected: boolean;
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
      onPress={() => isEditMode ? onToggle(slot.date, slot.slotIndex) : onPress(slot)}
      style={styles.cellWrapper}
    >
      <Animated.View
        style={[
          styles.cell, 
          { backgroundColor },
          isMagic && styles.magicSlotCell,
          isSelected && styles.selectedCell,
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
    </TouchableOpacity>
  );
});

interface DayColumnProps {
  dayIndex: number;
  slots: TimeSlot[];
  totalMembers: number;
  magicSlots: { date: string; slotIndex: number }[];
  selectedSlot: TimeSlot | null;
  mySchedule: Map<string, Preference>;
  myBlocks: MyBlock[];
  isEditMode: boolean;
  pulse: SharedValue<number>;
  onCellPress: (slot: TimeSlot) => void;
  onToggleCell: (date: string, slotIndex: number) => void;
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
        const isMagic = !isEditMode && magicSlots.some(s => s.date === slot.date && s.slotIndex === slot.slotIndex);
        const isSelected = !isEditMode && selectedSlot?.date === slot.date && selectedSlot?.slotIndex === slot.slotIndex;
        const myPreference = mySchedule.get(`${slot.date}-${slot.slotIndex}`) ?? 0;
        const block = myBlocks.find(b => b.date === slot.date && b.startSlot === slot.slotIndex);
        
        return (
          <HeatCell 
            key={`${slot.date}-${slot.slotIndex}`}
            slot={slot}
            totalMembers={totalMembers}
            isMagic={isMagic}
            isSelected={isSelected}
            myPreference={myPreference}
            isEditMode={isEditMode}
            blockTitle={block ? block.title : null}
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
}) => {
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
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
              magicSlots={magicSlots}
              selectedSlot={selectedSlot}
              mySchedule={mySchedule}
              myBlocks={myBlocks}
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
