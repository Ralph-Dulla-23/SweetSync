import React, { useMemo, useCallback } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { colors } from "@/constants/theme";
import { Header } from "@/components/Header";
import { Question, Sparkle } from "phosphor-react-native";
import Animated, { 
  FadeOutUp,
} from "react-native-reanimated";

import { CalendarSkeleton } from "@/components/CalendarSkeleton";
import { useHeatMap } from "@/hooks/useHeatMap";
import { useGlobalAvailability } from "@/hooks/useGlobalAvailability";
import { HeatMap } from "@/components/HeatMap";
import * as ImagePicker from 'expo-image-picker';
import { styles } from "./_calendar.styles";

import { useRoom } from "@/hooks/useRoom";
import { CalendarOnboarding } from "@/components/CalendarOnboarding";
import { InteractiveBottomSheet } from "./CalendarComponents";

// Sub-components
import { QuickAddModal } from "@/components/room/QuickAddModal";
import { OCRConfirmationModal } from "@/components/room/OCRConfirmationModal";
import { CalendarTabs } from "@/components/room/CalendarTabs";
import { MineViewHeader } from "@/components/room/MineViewHeader";

export default function GroupCalendar() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { room } = useRoom(id as string);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<'group' | 'mine'>('group');
  const [showHelp, setShowHelp] = React.useState(false);

  const { mySchedule: globalSchedule } = useGlobalAvailability();

  // Quick Add Modal State (Manual Blocking)
  const [isQuickAddVisible, setQuickAddVisible] = React.useState(false);
  const [blockTitle, setBlockTitle] = React.useState("");
  const [startSlotIndex, setStartSlotIndex] = React.useState<number>(0);
  const [endSlotIndex, setEndSlotIndex] = React.useState<number>(0);
  const [pendingCell, setPendingCell] = React.useState<{date: string, slotIndex: number} | null>(null);

  const { 
    mockData, 
    magicSlots, 
    selectedSlot, 
    myBlocks,
    mySchedule,
    isScanning,
    draftSchedule,
    scannedImageUri,
    emptyDays,
    potentialMagicSlots,
    simulateOCR,
    confirmDraft,
    toggleDraftCell,
    discardDraft,
    handleCellPress, 
    addBlock,
    removeBlockAt,
    clearSelection 
  } = useHeatMap(id as string);

  // Merge global schedule into local view for 'My Schedule' tab
  const combinedSchedule = React.useMemo(() => {
    if (activeTab !== 'mine') return mySchedule;
    const merged = new Map(globalSchedule);
    mySchedule.forEach((pref, key) => merged.set(key, pref));
    return merged;
  }, [mySchedule, globalSchedule, activeTab]);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleScanPress = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets[0].uri) {
      simulateOCR(result.assets[0].uri);
    }
  }, [simulateOCR]);

  const handleToggleCell = useCallback((date: string, slotIndex: number) => {
    if (mySchedule.has(`${date}-${slotIndex}`)) {
      removeBlockAt(date, slotIndex);
    } else {
      setPendingCell({ date, slotIndex });
      setBlockTitle("");
      setStartSlotIndex(slotIndex);
      setEndSlotIndex(slotIndex + 2); // Default 1 hour later
      setQuickAddVisible(true);
    }
  }, [mySchedule, removeBlockAt]);

  const handleSaveBlock = useCallback(() => {
    if (pendingCell) {
      addBlock({
        title: blockTitle || "Busy",
        date: pendingCell.date,
        startSlot: startSlotIndex,
        endSlot: Math.max(startSlotIndex, endSlotIndex - 1),
        preference: 1,
      });
    }
    setQuickAddVisible(false);
  }, [pendingCell, blockTitle, startSlotIndex, endSlotIndex, addBlock]);

  const isNudgeSlot = useMemo(() => selectedSlot && selectedSlot.freeCount === (room?.members.length || 1) - 1, [selectedSlot, room?.members.length]);

  if (loading) {
    return <CalendarSkeleton />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <CalendarOnboarding 
        forceShow={showHelp} 
        onComplete={() => setShowHelp(false)} 
      />
      
      <Animated.View 
        style={{ flex: 1 }}
        exiting={FadeOutUp.duration(400)}
      >
        <Header 
          title="Availability" 
          subtitle={`${room?.name || "Room"} • ${room?.members.length || 0} members`}
          showBack 
          backLabel="Room" 
          rightElement={
            <Pressable onPress={() => setShowHelp(true)} style={{ padding: 4 }}>
              <Question size={24} color={colors.textSecondary} />
            </Pressable>
          }
        />

        <CalendarTabs 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {activeTab === 'mine' && (
            <MineViewHeader 
              potentialMagicSlotsCount={potentialMagicSlots.length}
              emptyDays={emptyDays}
              isScanning={isScanning}
              onScanPress={handleScanPress}
            />
          )}

          <HeatMap 
            data={mockData}
            totalMembers={room?.members.length || 1}
            magicSlots={magicSlots}
            onCellPress={handleCellPress}
            selectedSlot={selectedSlot}
            isEditMode={activeTab === 'mine'}
            onToggleCell={handleToggleCell}
            mySchedule={combinedSchedule}
            myBlocks={myBlocks}
          />

          {/* Improved Legend */}
          {activeTab === 'group' ? (
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
              <View style={styles.magicSlotInfo}>
                <Sparkle size={14} weight="fill" color={colors.peachPunch} />
                <Text style={styles.magicSlotText}>AI-found "Magic Slots"</Text>
              </View>
            </View>
          ) : (
            <View style={styles.legendContainer}>
              <View style={styles.legendRow}>
                <View style={styles.legendLeft}>
                  <View style={[styles.legendIndicator, { backgroundColor: colors.indigoPunch }]} />
                  <Text style={styles.legendText}>Busy</Text>
                </View>
                <View style={styles.legendLeft}>
                  <View style={[styles.legendIndicator, { backgroundColor: colors.indigoNeon }]} />
                  <Text style={styles.legendText}>Preferred</Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        <InteractiveBottomSheet 
          selectedSlot={selectedSlot}
          room={room}
          onClose={clearSelection}
          isNudgeSlot={isNudgeSlot}
        />
      </Animated.View>

      <QuickAddModal 
        visible={isQuickAddVisible}
        onClose={() => setQuickAddVisible(false)}
        onSave={handleSaveBlock}
        blockTitle={blockTitle}
        onSetBlockTitle={setBlockTitle}
        startSlotIndex={startSlotIndex}
        onSetStartSlotIndex={setStartSlotIndex}
        endSlotIndex={endSlotIndex}
        onSetEndSlotIndex={setEndSlotIndex}
      />

      <OCRConfirmationModal 
        visible={!!draftSchedule}
        scannedImageUri={scannedImageUri}
        draftSchedule={draftSchedule}
        onClose={discardDraft}
        onConfirm={confirmDraft}
        onToggleCell={toggleDraftCell}
      />
    </SafeAreaView>
  );
}
