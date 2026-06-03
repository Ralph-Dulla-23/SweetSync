import React, { useMemo, useEffect } from 'react';
import { 
  View, 
  Text, 
  Pressable, 
} from 'react-native';
import { colors } from '@/constants/theme';
import { getHeatShadeIndex } from '@/lib/heatmap';
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
  FadeIn,
  SharedValue,
  withSpring
} from 'react-native-reanimated';
import { styles } from './HeatMap.styles';
import { slotIndexToTime } from '@/lib/time';

// Static heat color lookup — avoids per-cell interpolateColor worklets
const HEAT_COLORS = [
  colors.pageBg,
  colors.indigoBase,
  colors.indigoSoft,
  colors.indigoMid,
  colors.indigoPunch,
  colors.indigoNeon,
] as const;

interface HeatCellProps {
  slot: TimeSlot;
  totalMembers: number;
  isMagic: boolean;
  isSelected: boolean;
  isUncertain: boolean;
  isPreferred: boolean;
  myPreference: Preference;
  isEditMode: boolean;
  blockTitle: string | null;
  backgroundColor: string; 
  pulse: SharedValue<number>;
  onPress: (slot: TimeSlot) => void;
  onToggle: (date: string, slotIndex: number) => void;
}

interface AnimatedRingCellProps {
  slot: TimeSlot;
  isMagic: boolean;
  isSelected: boolean;
  isUncertain: boolean;
  isPreferred: boolean;
  isEditMode: boolean;
  isMeBusy: boolean;
  blockTitle: string | null;
  backgroundColor: string;
  pulse: SharedValue<number>;
  onPress: (slot: TimeSlot) => void;
  onToggle: (date: string, slotIndex: number) => void;
}

const AnimatedRingCell = React.memo(({
  slot,
  isMagic,
  isSelected,
  isUncertain,
  isPreferred,
  isEditMode,
  isMeBusy,
  blockTitle,
  backgroundColor,
  pulse,
  onPress,
  onToggle,
}: AnimatedRingCellProps) => {
  const ringScale = useSharedValue(1);
  const selectionScale = useSharedValue(1);

  const handlePress = React.useCallback(() => {
    if (isEditMode) { onToggle(slot.date, slot.slotIndex); return; }
    if (isMagic) {
      ringScale.value = withSequence(
        withSpring(1.2, springConfigs.bouncy),
        withTiming(1, { duration: 100 })
      );
      setTimeout(() => onPress(slot), 150);
    } else {
      onPress(slot);
    }
  }, [isEditMode, isMagic, slot, onPress, onToggle, ringScale]);

  useEffect(() => {
    if (isSelected) {
      selectionScale.value = withSequence(
        withTiming(1.15, { duration: 150, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 150, easing: Easing.in(Easing.quad) })
      );
    }
  }, [isSelected, selectionScale]);

  const ringAnimatedStyle = useAnimatedStyle(() => {
    const startColor = isMagic ? colors.peachPunch : isPreferred ? colors.indigoNeon : 'transparent';
    const endColor = isUncertain ? colors.white : isPreferred ? colors.indigoPunch : colors.peachSoft;
    const baseScale = isPreferred ? (1 + pulse.value * 0.03) : (1 + pulse.value * 0.05);
    
    return {
      borderColor: interpolateColor(
        pulse.value,
        [0, 1],
        [startColor, endColor]
      ),
      transform: [
        { scale: ringScale.value * selectionScale.value * baseScale }
      ],
      opacity: isPreferred ? 0.9 + pulse.value * 0.1 : 1,
    };
  });

  return (
    <Pressable onPress={handlePress} style={[styles.cellWrapper, { zIndex: isSelected ? 3 : (isMagic || isPreferred || isUncertain) ? 2 : 1 }]}>
      <Animated.View
        style={[
          styles.cell,
          { backgroundColor },
          isMagic && styles.magicSlotCell,
          isSelected && styles.selectedCell,
          isPreferred && styles.preferredGlow,
          isUncertain && { borderWidth: 2, borderStyle: 'solid' },
          isEditMode && !isMeBusy && styles.myBusyCell,
          ringAnimatedStyle,
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

interface StaticCellProps {
  slot: TimeSlot;
  isEditMode: boolean;
  isMeBusy: boolean;
  blockTitle: string | null;
  backgroundColor: string;
  onPress: (slot: TimeSlot) => void;
  onToggle: (date: string, slotIndex: number) => void;
}

const StaticCell = React.memo(({
  slot,
  isEditMode,
  isMeBusy,
  blockTitle,
  backgroundColor,
  onPress,
  onToggle,
}: StaticCellProps) => {
  const handlePress = () => {
    if (isEditMode) { onToggle(slot.date, slot.slotIndex); return; }
    onPress(slot);
  };

  return (
    <Pressable onPress={handlePress} style={styles.cellWrapper}>
      <View
        style={[
          styles.cell,
          { backgroundColor },
          isEditMode && !isMeBusy && styles.myBusyCell,
        ]}
      >
        {isEditMode && !isMeBusy && blockTitle && (
          <Text style={styles.cellTitle} numberOfLines={1}>{blockTitle}</Text>
        )}
      </View>
    </Pressable>
  );
});

const HeatCell = React.memo(({
  slot,
  totalMembers,
  isMagic,
  isSelected,
  isUncertain,
  isPreferred,
  myPreference,
  isEditMode,
  blockTitle,
  backgroundColor,
  pulse,
  onPress,
  onToggle,
}: HeatCellProps) => {
  const isMeBusy = myPreference === 0;
  const needsAnimation = isMagic || isUncertain || isSelected || isPreferred;

  if (needsAnimation) {
    return (
      <AnimatedRingCell
        slot={slot}
        isMagic={isMagic}
        isSelected={isSelected}
        isUncertain={isUncertain}
        isPreferred={isPreferred}
        isEditMode={isEditMode}
        isMeBusy={isMeBusy}
        blockTitle={blockTitle}
        backgroundColor={backgroundColor}
        pulse={pulse}
        onPress={onPress}
        onToggle={onToggle}
      />
    );
  }

  return (
    <StaticCell
      slot={slot}
      isEditMode={isEditMode}
      isMeBusy={isMeBusy}
      blockTitle={blockTitle}
      backgroundColor={backgroundColor}
      onPress={onPress}
      onToggle={onToggle}
    />
  );
});

interface DayColumnProps {
  dayIndex: number;
  slots: TimeSlot[];
  totalMembers: number;
  magicSlotsSet: Set<string>; 
  uncertainSlotsSet: Set<string>; 
  selectedSlotKey: string | null;
  mySchedule: Map<string, Preference>;
  myBlocksMap: Map<string, string>; 
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
  selectedSlotKey,
  mySchedule,
  myBlocksMap,
  isEditMode,
  pulse,
  onCellPress,
  onToggleCell,
}: DayColumnProps) => {
  const isColumnActive = useMemo(() => {
    return slots.some(slot => {
      const key = `${slot.date}-${slot.slotIndex}`;
      return magicSlotsSet.has(key) || selectedSlotKey === key;
    });
  }, [slots, magicSlotsSet, selectedSlotKey]);

  const columnZIndex = useMemo(() => {
    const columnDate = slots[0]?.date || '___';
    const isSelectedCol = selectedSlotKey?.startsWith(columnDate);
    if (isSelectedCol) return 20;
    if (isColumnActive) return 10;
    return 1;
  }, [isColumnActive, selectedSlotKey, slots]);

  const renderedCells = useMemo(() => {
    return slots.map((slot) => {
      const slotKey = `${slot.date}-${slot.slotIndex}`;
      const isMagic = !isEditMode && magicSlotsSet.has(slotKey);
      const isUncertain = uncertainSlotsSet.has(slotKey);
      const isSelected = !isEditMode && selectedSlotKey === slotKey;
      const myPreference = mySchedule.get(slotKey) ?? 0;
      const blockTitle = myBlocksMap.get(slotKey) || null;

      let colorIndex: number;
      if (isEditMode) {
        const isMeBusy = myPreference === 0;
        colorIndex = isMeBusy ? 0 : myPreference === 2 ? 5 : 4;
      } else {
        colorIndex = getHeatShadeIndex(slot.freeCount, slot.preferredCount, totalMembers);
      }
      const backgroundColor = HEAT_COLORS[Math.min(colorIndex, HEAT_COLORS.length - 1)];
      const isPreferred = colorIndex === 5;

      return (
        <HeatCell 
          key={slotKey}
          slot={slot}
          totalMembers={totalMembers}
          isMagic={isMagic}
          isSelected={isSelected}
          isUncertain={isUncertain}
          isPreferred={isPreferred}
          myPreference={myPreference}
          isEditMode={isEditMode}
          blockTitle={blockTitle}
          backgroundColor={backgroundColor}
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
    selectedSlotKey, 
    mySchedule, 
    myBlocksMap, 
    isEditMode, 
    pulse, 
    onCellPress, 
    onToggleCell
  ]);

  return (
    <View style={[styles.column, { zIndex: columnZIndex }]}>
      {renderedCells}
    </View>
  );
}, (prev, next) => {
  const columnDate = prev.slots[0]?.date || '___';
  const prevWasSelected = prev.selectedSlotKey?.startsWith(columnDate);
  const nextIsSelected = next.selectedSlotKey?.startsWith(columnDate);
  
  if (prev.slots !== next.slots) return false;
  if (prev.totalMembers !== next.totalMembers) return false;
  if (prev.isEditMode !== next.isEditMode) return false;
  if (prev.mySchedule !== next.mySchedule) return false;
  if (prev.myBlocksMap !== next.myBlocksMap) return false;
  if (prev.magicSlotsSet !== next.magicSlotsSet) return false;
  if (prev.uncertainSlotsSet !== next.uncertainSlotsSet) return false;
  
  if (prev.selectedSlotKey !== next.selectedSlotKey) {
    if (prevWasSelected || nextIsSelected) return false;
  }
  
  return true;
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

const EMPTY_SCHEDULE = new Map<string, Preference>();
const EMPTY_BLOCKS: MyBlock[] = [];
const EMPTY_CONFIDENCE: string[] = [];

export const HeatMap: React.FC<HeatMapProps> = ({
  data,
  totalMembers,
  magicSlots,
  onCellPress = () => {},
  selectedSlot = null,
  isEditMode = false,
  onToggleCell = () => {},
  mySchedule = EMPTY_SCHEDULE,
  myBlocks = EMPTY_BLOCKS,
  startSlot = 14, 
  endSlot = 48,   
  lowConfidenceCells = EMPTY_CONFIDENCE,
  backgroundOpacity = 1,
}) => {
  const pulse = useSharedValue(0);

  useEffect(() => {
    const timerId = setTimeout(() => {
      pulse.value = withRepeat(
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
        -1,
        true
      );
    }, 500);
    return () => clearTimeout(timerId);
  }, [pulse]);

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

  const myBlocksMap = useMemo(() => {
    const map = new Map<string, string>();
    myBlocks.forEach(b => {
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

  const selectedSlotKey = useMemo(() => {
    return selectedSlot ? `${selectedSlot.date}-${selectedSlot.slotIndex}` : null;
  }, [selectedSlot]);

  return (
    <View style={[styles.gridContainer, { opacity: backgroundOpacity }]}>
      <View style={styles.dayHeaderRow}>
        <View style={styles.timeLabelSpacer} />
        {DAYS.map((day) => (
          <View style={styles.dayHeaderCell} key={day}>
            <Text style={[styles.dayLabel, day === "Thu" && styles.todayLabel]}>{day}</Text>
          </View>
        ))}
      </View>

      <View style={styles.gridBody}>
        <View style={styles.timeColumn}>
          {timeLabels.map((time) => (
            <View key={time} style={styles.timeLabelCell}>
              <Text style={styles.timeLabel}>{time}</Text>
            </View>
          ))}
        </View>

        <Animated.View entering={FadeIn.duration(300)} style={styles.cellsArea}>
          {visibleData.map((columnSlots, dayIndex) => (
            <DayColumn 
              key={columnSlots[0]?.date || `col-${dayIndex}`}
              dayIndex={dayIndex}
              slots={columnSlots}
              totalMembers={totalMembers}
              magicSlotsSet={magicSlotsSet}
              uncertainSlotsSet={uncertainSlotsSet}
              selectedSlotKey={selectedSlotKey}
              mySchedule={mySchedule}
              myBlocksMap={myBlocksMap}
              isEditMode={isEditMode}
              pulse={pulse}
              onCellPress={onCellPress}
              onToggleCell={onToggleCell}
            />
          ))}
        </Animated.View>
      </View>
    </View>
  );
};
