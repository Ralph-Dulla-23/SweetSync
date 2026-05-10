import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView,
  TouchableOpacity,
  Modal,
  TextInput,
  Image,
  ActivityIndicator,
  Modal as RNModal,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { colors, fonts, spacing, radius } from "@/constants/theme";
import { Header } from "@/components/Header";
import { Sparkle, Info, X, Users, Camera, Bell, Eye, EyeSlash } from "phosphor-react-native";
import Animated, { 
  FadeIn, 
  FadeInDown, 
  Layout, 
  FadeInUp,
  SlideInDown,
  SlideOutDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS
} from "react-native-reanimated";
import { GestureDetector, Gesture } from "react-native-gesture-handler";

import { CalendarSkeleton } from "@/components/CalendarSkeleton";
import { useHeatMap } from "@/hooks/useHeatMap";
import { Button } from "@/components/Button";
import { HeatMap } from "@/components/HeatMap";
import * as ImagePicker from 'expo-image-picker';
import { styles } from "./calendar.styles";

export default function GroupCalendar() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<'group' | 'mine'>('group');
  const [showImagePreview, setShowImagePreview] = React.useState(true);

  // Quick Add Modal State (Manual Blocking)
  const [isQuickAddVisible, setQuickAddVisible] = React.useState(false);
  const [blockTitle, setBlockTitle] = React.useState("");
  const [blockDuration, setBlockDuration] = React.useState(1);
  const [pendingCell, setPendingCell] = React.useState<{day: number, hour: number} | null>(null);

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

  const handleToggleCell = (dayIndex: number, hourIndex: number) => {
    if (mySchedule.has(`${dayIndex}-${hourIndex}`)) {
      removeBlockAt(dayIndex, hourIndex);
    } else {
      setPendingCell({ day: dayIndex, hour: hourIndex });
      setBlockTitle("");
      setBlockDuration(1);
      setQuickAddVisible(true);
    }
  };

  const handleSaveBlock = () => {
    if (pendingCell) {
      addBlock({
        title: blockTitle || "Busy",
        dayIndex: pendingCell.day,
        startHour: pendingCell.hour,
        endHour: Math.min(pendingCell.hour + blockDuration - 1, 13),
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
                    {["Mon", "Tue", "Wed", "Thu", "Fri"][emptyDays[0]]} looks empty. Did we miss a page?
                  </Text>
                </View>
              </Animated.View>
            )}

            <Animated.View entering={FadeInDown.delay(300).duration(500)}>
              <View style={styles.editNotice}>
                <Info size={16} color={colors.indigoPunch} />
                <Text style={styles.editNoticeText}>Tap or drag to mark busy blocks</Text>
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
          mySchedule={mySchedule}
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
              </View>
              <Text style={styles.legendText}>Free</Text>
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
              <Text style={styles.legendText}>My Busy Blocks</Text>
              <View style={[styles.legendBox, { backgroundColor: colors.pageBg, marginLeft: 16 }]} />
              <Text style={styles.legendText}>Available</Text>
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
              <Text style={styles.uncertaintyText}>I've highlighted blocks I was unsure about. Please check them.</Text>
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
              mySchedule={draftSchedule || new Set()}
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
              <Text style={styles.formLabel}>Duration (hours)</Text>
              <View style={styles.durationRow}>
                {[1, 2, 3, 4].map(h => (
                  <TouchableOpacity 
                    key={h}
                    style={[styles.durationPill, blockDuration === h && styles.activeDurationPill]}
                    onPress={() => setBlockDuration(h)}
                  >
                    <Text style={[styles.durationText, blockDuration === h && styles.activeDurationText]}>{h}h</Text>
                  </TouchableOpacity>
                ))}
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

// --- Interactive Bottom Sheet Sub-component ---
const InteractiveBottomSheet = ({ selectedSlot, clearSelection, isNudgeSlot, id, router }: any) => {
  const translateY = useSharedValue(0);
  const context = useSharedValue({ y: 0 });

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      // Only allow dragging down
      translateY.value = Math.max(0, event.translationY + context.value.y);
    })
    .onEnd((event) => {
      if (translateY.value > 100 || event.velocityY > 500) {
        // Dismiss
        translateY.value = withSpring(400, { damping: 20 });
        runOnJS(clearSelection)();
      } else {
        // Snap back
        translateY.value = withSpring(0, { damping: 20 });
      }
    });

  // Reset position when a new slot is selected
  React.useEffect(() => {
    if (selectedSlot) {
      translateY.value = 0;
    }
  }, [selectedSlot]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (selectedSlot) {
    return (
      <GestureDetector gesture={gesture}>
        <Animated.View 
          entering={SlideInDown.springify().damping(18).stiffness(120)}
          layout={Layout.springify()}
          style={[styles.bottomSheetPeek, styles.detailSheet, animatedStyle]}
        >
          <View style={styles.dragHandle} />
          <View style={styles.detailHeader}>
            <View style={styles.detailTitleRow}>
              <Text style={styles.detailTitle}>
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][selectedSlot.dayIndex]} at {selectedSlot.hourIndex + 8}:00
              </Text>
              <TouchableOpacity onPress={clearSelection}>
                <X size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.detailSubtitle}>
              {selectedSlot.freeCount} of 5 members are free
            </Text>
          </View>

          {isNudgeSlot && (
            <Animated.View entering={FadeIn.duration(300)}>
              <View style={styles.nudgeBanner}>
                <Bell size={16} color={colors.peachPunch} weight="fill" />
                <Text style={styles.nudgeText}>
                  {selectedSlot.busyMembers[0] === "Me" 
                    ? "Everyone is free but you! Can you make it?" 
                    : `Only ${selectedSlot.busyMembers[0]} is busy. Nudge them?`}
                </Text>
              </View>
            </Animated.View>
          )}

          <View style={styles.memberSection}>
            <Text style={styles.sectionLabel}>FREE</Text>
            <View style={styles.memberList}>
              {selectedSlot.members.map((member: string, i: number) => (
                <View key={i} style={styles.memberChip}>
                  <Users size={14} color={colors.indigoPunch} weight="fill" />
                  <Text style={styles.memberChipText}>{member}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={[styles.memberSection, { marginTop: spacing[3] }]}>
            <Text style={styles.sectionLabel}>BUSY</Text>
            <View style={styles.memberList}>
              {selectedSlot.busyMembers.map((member: string, i: number) => (
                <View key={i} style={[styles.memberChip, styles.busyChip]}>
                  <Text style={styles.busyChipText}>{member}</Text>
                </View>
              ))}
            </View>
          </View>

          <Button 
            title="Start Voting with Squad" 
            onPress={() => router.push(`/room/${id}/vote-slots`)}
            style={styles.voteButton}
          />
        </Animated.View>
      </GestureDetector>
    );
  }

  return (
    <Animated.View 
      entering={SlideInDown.duration(400)}
      layout={Layout.springify()}
      style={styles.bottomSheetPeek}
    >
      <View style={styles.dragHandle} />
      <View style={styles.peekContent}>
        <Info size={16} color={colors.indigoPunch} weight="bold" />
        <Text style={styles.peekText}>Saturday 4PM looks perfect for everyone</Text>
      </View>
    </Animated.View>
  );
  };

