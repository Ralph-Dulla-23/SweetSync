import React, { useMemo } from 'react';
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

  return (
    <TouchableOpacity 
      activeOpacity={0.6}
      onPress={() => isEditMode ? onToggle(slot.dayIndex, slot.hourIndex) : onPress(slot)}
      style={[
        styles.cell, 
        { backgroundColor },
        isMagic && styles.magicSlotCell,
        isSelected && styles.selectedCell,
        isEditMode && isMeBusy && styles.myBusyCell
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
    <View style={styles.column}>
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
    </View>
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

const styles = StyleSheet.create({
  gridContainer: {
    marginTop: spacing[2],
    paddingHorizontal: spacing[4],
  },
  dayHeaderRow: {
    flexDirection: "row",
    marginBottom: spacing[3],
  },
  timeLabelSpacer: {
    width: 44,
  },
  dayHeaderCell: {
    flex: 1,
    alignItems: "center",
  },
  dayLabel: {
    fontFamily: fonts.bodySemibold,
    fontSize: 11,
    color: colors.textTertiary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  todayLabel: {
    color: colors.peachPunch,
  },
  gridBody: {
    flexDirection: "row",
  },
  timeColumn: {
    width: 44,
    justifyContent: "space-between",
  },
  timeLabelCell: {
    height: 64, 
    justifyContent: "flex-start",
  },
  timeLabel: {
    fontFamily: fonts.bodySemibold,
    fontSize: 10,
    color: colors.textTertiary,
    textAlign: "right",
    paddingRight: 8,
    marginTop: -6,
  },
  cellsArea: {
    flex: 1,
    flexDirection: "row",
    gap: 1.5,
  },
  column: {
    flex: 1,
    gap: 1.5,
  },
  cell: {
    height: 32,
    borderRadius: 2,
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.03)",
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    paddingHorizontal: 2,
  },
  magicSlotCell: {
    backgroundColor: colors.peachBase,
    borderColor: colors.peachPunch,
    borderWidth: 1.5,
    zIndex: 1,
  },
  selectedCell: {
    borderColor: colors.indigoPunch,
    borderWidth: 2,
    zIndex: 2,
    shadowColor: colors.indigoPunch,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  myBusyCell: {
    borderColor: colors.indigoMid,
    borderWidth: 0.5,
  },
  selectionIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.indigoPunch,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 2,
  },
  selectionText: {
    color: 'white',
    fontSize: 10,
    fontFamily: fonts.bodySemibold,
  },
  sparkleContainer: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    padding: 3,
    borderWidth: 1,
    borderColor: colors.peachPunch,
    zIndex: 2,
    shadowColor: colors.peachPunch,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cellTitle: {
    fontSize: 8,
    fontFamily: fonts.bodySemibold,
    color: colors.white,
    textAlign: 'center',
  },
});
