import React from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  Modal as RNModal,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { colors, spacing, radius, fonts } from "@/constants/theme";
import { Header } from "@/components/Header";
import { Sparkle, Info, X, Users, Camera, Bell, Eye, EyeSlash, Warning, CaretRight } from "phosphor-react-native";
import Animated, { 
  FadeIn, 
  FadeInDown, 
  Layout, 
  SlideInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  withTiming,
  Easing
} from "react-native-reanimated";
import { GestureDetector, Gesture } from "react-native-gesture-handler";

import { CalendarSkeleton } from "@/components/CalendarSkeleton";
import { useHeatMap } from "@/hooks/useHeatMap";
import { useGlobalAvailability } from "@/hooks/useGlobalAvailability";
import { Button } from "@/components/Button";
import { HeatMap } from "@/components/HeatMap";
import { slotIndexToTime } from "@/lib/time";
import * as ImagePicker from 'expo-image-picker';
import { styles } from "./_calendar.styles";
import { format, parseISO } from "date-fns";

import { useSafeAreaInsets } from "react-native-safe-area-context";

// --- Interactive Bottom Sheet Sub-component ---
function InteractiveBottomSheet({ selectedSlot, clearSelection, isNudgeSlot, id, router }: any) {
  const insets = useSafeAreaInsets();
  
  // Sheet is roughly 160-200px tall in compact mode. 
  // We'll hide it 400px down to be safe.
  const OPEN_Y = 0;
  const HIDDEN_Y = 400; 

  const translateY = useSharedValue(HIDDEN_Y);

  // Internal state to hold data during transition
  const [internalSlot, setInternalSlot] = React.useState<any>(null);

  const SPRING_CONFIG = { 
    damping: 25, 
    stiffness: 180,
    mass: 1,
    overshootClamping: true // Absolute no bounce to prevent "jumping" feel
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
      // Trigger dismissal animation if external state is cleared
      handleDismiss();
    }
  }, [selectedSlot]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    zIndex: 1000,
    // Hide completely when far enough down to avoid overlapping tabs or touch issues
    opacity: translateY.value > 380 ? 0 : 1,
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
          styles.compactSheet, 
          animatedStyle,
          { 
            paddingBottom: Math.max(insets.bottom, spacing[2]),
            paddingTop: spacing[3] // Tighter top padding
          }
        ]}
      >
        <View style={styles.compactSheetInner}>
          <View style={styles.compactHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.compactTitle}>
                {formattedDate} at {formattedTime}
              </Text>
              <Text style={styles.compactSubtitle}>
                {displaySlot.freeCount} available ({displaySlot.preferredCount} prefer this)
              </Text>
            </View>
            <TouchableOpacity 
              onPress={handleDismiss}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
              style={{ padding: 4 }}
            >
              <X size={18} color={colors.textSecondary} weight="bold" />
            </TouchableOpacity>
          </View>

          <View style={styles.compactChips}>
            {displaySlot.members.map((member: string, i: number) => {
              const isPreferred = displaySlot.preferredMembers.includes(member);
              return (
                <View key={i} style={[styles.memberChip, isPreferred && { backgroundColor: colors.indigoBase }]}>
                  <Users size={14} color={isPreferred ? colors.indigoNeon : colors.indigoPunch} weight="fill" />
                  <Text style={[styles.memberChipText, isPreferred && { color: colors.indigoPunch }]}>{member}</Text>
                </View>
              );
            })}
          </View>
          
          <Button 
            title="Start Voting" 
            variant="indigo"
            onPress={() => router.push(`/room/${id}/vote-slots`)}
            style={{ marginTop: spacing[2], height: 48 }}
          />
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

// --- Main Screen ---
export default function GroupCalendar() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<'group' | 'mine'>('group');
  const [showImagePreview, setShowImagePreview] = React.useState(true);

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
    lowConfidenceCells,
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
  } = useHeatMap(5);

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

  if (loading) {
    return <CalendarSkeleton />;
  }

  const handleScanPress = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets[0].uri) {
      simulateOCR(result.assets[0].uri);
    }
  };

  const handleToggleCell = (date: string, slotIndex: number) => {
    if (mySchedule.has(`${date}-${slotIndex}`)) {
      removeBlockAt(date, slotIndex);
    } else {
      setPendingCell({ date, slotIndex });
      setBlockTitle("");
      setStartSlotIndex(slotIndex);
      setEndSlotIndex(slotIndex + 2); // Default 1 hour later
      setQuickAddVisible(true);
    }
  };

  const handleSaveBlock = () => {
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
  };

  const isNudgeSlot = selectedSlot && selectedSlot.freeCount === 4;

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Availability" 
        subtitle="Friday Gang • 5 members"
        showBack 
        backLabel="Room" 
      />

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'group' && styles.activeTab]}
          onPress={() => setActiveTab('group')}
        >
          <Text style={activeTab === 'group' ? styles.activeTabText : styles.inactiveTabText}>Group View</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'mine' && styles.activeTab]}
          onPress={() => setActiveTab('mine')}
        >
          <Text style={activeTab === 'mine' ? styles.activeTabText : styles.inactiveTabText}>My Schedule</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {activeTab === 'mine' && (
          <View style={styles.mineHeader}>
            <Animated.View entering={FadeInDown.delay(100).duration(500)}>
              <View style={styles.impactBanner}>
                <Sparkle size={18} color={colors.peachPunch} weight="fill" />
                <Text style={styles.impactText}>
                  Your schedule helps find <Text style={styles.bold}>{potentialMagicSlots.length} new "Magic Slots"</Text> for the group.
                </Text>
              </View>
            </Animated.View>

            {emptyDays.length > 0 && (
              <Animated.View entering={FadeInDown.delay(200).duration(500)}>
                <View style={styles.warningBanner}>
                  <Info size={16} color={colors.peachDeep} weight="bold" />
                  <Text style={styles.warningText}>
                    Update your schedule to help find better times!
                  </Text>
                </View>
              </Animated.View>
            )}

            <Animated.View entering={FadeInDown.delay(300).duration(500)}>
              <View style={styles.editNotice}>
                <Info size={16} color={colors.indigoPunch} />
                <Text style={styles.editNoticeText}>Tap to mark busy blocks (30m intervals)</Text>
              </View>
            </Animated.View>
            
            <Button 
              onPress={handleScanPress}
              disabled={isScanning}
              style={styles.scanButton}
            >
              {isScanning ? (
                <ActivityIndicator color={colors.white} size="small" />
              ) : (
                <>
                  <Camera size={20} color={colors.white} weight="fill" />
                  <Text style={styles.scanButtonText}>Scan Schedule</Text>
                </>
              )}
            </Button>
          </View>
        )}

        <HeatMap 
          data={mockData}
          totalMembers={5}
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
              <View style={[styles.legendBox, { backgroundColor: colors.indigoPunch }]} />
              <Text style={styles.legendText}>Busy</Text>
              <View style={[styles.legendBox, { backgroundColor: colors.indigoNeon, marginLeft: 16 }]} />
              <Text style={styles.legendText}>Preferred</Text>
              <View style={[styles.legendBox, { backgroundColor: colors.pageBg, marginLeft: 16 }]} />
              <Text style={styles.legendText}>Free</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* OCR Confirmation Modal (Full Screen) */}
      <RNModal visible={!!draftSchedule} animationType="slide">
        <SafeAreaView style={styles.confirmModalContainer}>
          <View style={styles.modalHeaderFixed}>
            <View style={styles.modalHeaderTop}>
              <Text style={styles.confirmModalTitle}>Confirm Extraction</Text>
              <TouchableOpacity 
                style={styles.previewToggle} 
                onPress={() => setShowImagePreview(!showImagePreview)}
              >
                {showImagePreview ? <EyeSlash size={20} color={colors.indigoPunch} /> : <Eye size={20} color={colors.indigoPunch} />}
                <Text style={styles.previewToggleText}>{showImagePreview ? "Hide Original" : "Show Original"}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.uncertaintyHint}>
              <View style={styles.uncertaintyDot} />
              <Text style={styles.uncertaintyText}>Double-tap blocks to mark them as "Preferred".</Text>
            </View>
          </View>

          {showImagePreview && scannedImageUri && (
            <View style={styles.imageAnchorContainer}>
              <Image source={{ uri: scannedImageUri }} style={styles.anchorImage} resizeMode="contain" />
              <View style={styles.imageOverlayLabel}>
                <Text style={styles.imageOverlayText}>SOURCE OF TRUTH</Text>
              </View>
            </View>
          )}
          
          <ScrollView contentContainerStyle={styles.modalGridScroll}>
            <HeatMap 
              data={mockData}
              totalMembers={5}
              magicSlots={[]}
              isEditMode={true}
              onToggleCell={toggleDraftCell}
              mySchedule={draftSchedule || new Map()}
              lowConfidenceCells={lowConfidenceCells}
            />
          </ScrollView>

          <View style={styles.confirmModalFooter}>
            <TouchableOpacity style={styles.discardButton} onPress={discardDraft}>
              <Text style={styles.discardButtonText}>Discard</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={confirmDraft}>
              <Text style={styles.confirmButtonText}>Looks Good</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </RNModal>

      {/* Manual Add Modal (Transparent Overlay) */}
      <RNModal
        visible={isQuickAddVisible}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.quickAddTitle}>Add Busy Block</Text>
              <TouchableOpacity onPress={() => setQuickAddVisible(false)}>
                <X size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>What's the plan?</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Work, Gym, Class"
                placeholderTextColor={colors.textTertiary}
                value={blockTitle}
                onChangeText={setBlockTitle}
                autoFocus
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Set Time Range</Text>
              <View style={localStyles.pickerRow}>
                {/* Start Time Picker */}
                <View style={localStyles.pickerColumn}>
                  <Text style={localStyles.columnLabel}>START</Text>
                  <ScrollView style={localStyles.pickerList} showsVerticalScrollIndicator={false}>
                    {Array.from({ length: 48 }, (_, i) => i).map(s => (
                      <TouchableOpacity 
                        key={`start-${s}`}
                        style={[localStyles.slotItem, startSlotIndex === s && localStyles.activeSlotItem]}
                        onPress={() => {
                          setStartSlotIndex(s);
                          if (s >= endSlotIndex) setEndSlotIndex(s + 1);
                        }}
                      >
                        <Text style={[localStyles.slotText, startSlotIndex === s && localStyles.activeSlotText]}>
                          {slotIndexToTime(s)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                <View style={localStyles.divider}>
                  <CaretRight size={16} color={colors.textTertiary} weight="bold" />
                </View>

                {/* End Time Picker */}
                <View style={localStyles.pickerColumn}>
                  <Text style={localStyles.columnLabel}>END</Text>
                  <ScrollView style={localStyles.pickerList} showsVerticalScrollIndicator={false}>
                    {Array.from({ length: 49 }, (_, i) => i).filter(s => s > startSlotIndex).map(s => (
                      <TouchableOpacity 
                        key={`end-${s}`}
                        style={[localStyles.slotItem, endSlotIndex === s && localStyles.activeSlotItem]}
                        onPress={() => setEndSlotIndex(s)}
                      >
                        <Text style={[localStyles.slotText, endSlotIndex === s && localStyles.activeSlotText]}>
                          {s === 48 ? "00:00" : slotIndexToTime(s)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
            </View>

            <Button 
              title="Add to Schedule" 
              onPress={handleSaveBlock}
              style={styles.saveButton}
            />
          </View>
        </View>
      </RNModal>


      {/* Floating Interactive Bottom Sheet */}
      <InteractiveBottomSheet 
        selectedSlot={selectedSlot}
        clearSelection={clearSelection}
        isNudgeSlot={isNudgeSlot}
        id={id as string}
        router={router}
      />
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  pickerRow: {
    flexDirection: 'row',
    height: 180,
    backgroundColor: colors.pageBg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    overflow: 'hidden',
  },
  pickerColumn: {
    flex: 1,
  },
  columnLabel: {
    fontFamily: fonts.bodySemibold,
    fontSize: 10,
    color: colors.textTertiary,
    textAlign: 'center',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.borderDefault,
    letterSpacing: 1,
  },
  pickerList: {
    flex: 1,
  },
  slotItem: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.02)',
  },
  activeSlotItem: {
    backgroundColor: colors.indigoBase,
  },
  slotText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textPrimary,
  },
  activeSlotText: {
    fontFamily: fonts.bodySemibold,
    color: colors.indigoPunch,
  },
  divider: {
    width: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.pageBg,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderColor: colors.borderDefault,
  },
});
