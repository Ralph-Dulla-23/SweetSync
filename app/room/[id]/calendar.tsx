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
import { useLocalSearchParams } from "expo-router";
import { colors, fonts, spacing, radius } from "@/constants/theme";
import { Header } from "@/components/Header";
import { Sparkle, Info, X, Users, Camera, Bell, Eye, EyeSlash } from "phosphor-react-native";
import { HeatMap } from "@/components/HeatMap";
import { useHeatMap } from "@/hooks/useHeatMap";
import { Button } from "@/components/Button";
import * as ImagePicker from 'expo-image-picker';

export default function GroupCalendar() {
  const { id } = useLocalSearchParams();
  const [activeTab, setActiveTab] = React.useState<'group' | 'mine'>('group');
  const [showImagePreview, setShowImagePreview] = React.useState(true);
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

  // Quick Add Modal State (Manual Blocking)
  const [isQuickAddVisible, setQuickAddVisible] = React.useState(false);
  const [blockTitle, setBlockTitle] = React.useState("");
  const [blockDuration, setBlockDuration] = React.useState(1);
  const [pendingCell, setPendingCell] = React.useState<{day: number, hour: number} | null>(null);

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
            <View style={styles.impactBanner}>
              <Sparkle size={18} color={colors.peachPunch} weight="fill" />
              <Text style={styles.impactText}>
                Your schedule helps find <Text style={styles.bold}>{potentialMagicSlots.length} new "Magic Slots"</Text> for the group.
              </Text>
            </View>

            {emptyDays.length > 0 && (
              <View style={styles.warningBanner}>
                <Info size={16} color={colors.peachDeep} weight="bold" />
                <Text style={styles.warningText}>
                  {["Mon", "Tue", "Wed", "Thu", "Fri"][emptyDays[0]]} looks empty. Did we miss a page?
                </Text>
              </View>
            )}

            <View style={styles.editNotice}>
              <Info size={16} color={colors.indigoPunch} />
              <Text style={styles.editNoticeText}>Tap or drag to mark busy blocks</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.scanButton} 
              onPress={handleScanPress}
              disabled={isScanning}
            >
              {isScanning ? (
                <ActivityIndicator color={colors.white} size="small" />
              ) : (
                <Camera size={20} color={colors.white} weight="fill" />
              )}
              <Text style={styles.scanButtonText}>
                {isScanning ? "AI is reading..." : "Scan Schedule"}
              </Text>
            </TouchableOpacity>
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


      {/* Floating Bottom Sheet Peek or Selected Slot Detail */}
      {selectedSlot ? (
        <View style={[styles.bottomSheetPeek, styles.detailSheet]}>
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
            <View style={styles.nudgeBanner}>
              <Bell size={16} color={colors.peachPunch} weight="fill" />
              <Text style={styles.nudgeText}>
                {selectedSlot.busyMembers[0] === "Me" 
                  ? "Everyone is free but you! Can you make it?" 
                  : `Only ${selectedSlot.busyMembers[0]} is busy. Nudge them?`}
              </Text>
            </View>
          )}

          <View style={styles.memberSection}>
            <Text style={styles.sectionLabel}>FREE</Text>
            <View style={styles.memberList}>
              {selectedSlot.members.map((member, i) => (
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
              {selectedSlot.busyMembers.map((member, i) => (
                <View key={i} style={[styles.memberChip, styles.busyChip]}>
                  <Text style={styles.busyChipText}>{member}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.bottomSheetPeek}>
          <View style={styles.dragHandle} />
          <View style={styles.peekContent}>
            <Info size={16} color={colors.indigoPunch} weight="bold" />
            <Text style={styles.peekText}>Saturday 4PM looks perfect for everyone</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.pageBg,
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    gap: spacing[2],
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  activeTab: {
    backgroundColor: colors.indigoPunch,
    borderColor: colors.indigoPunch,
  },
  activeTabText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 13,
    color: colors.white,
  },
  inactiveTabText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 13,
    color: colors.textSecondary,
  },
  scrollContent: {
    paddingBottom: 160,
  },
  mineHeader: {
    paddingHorizontal: spacing[5],
    marginBottom: spacing[4],
    gap: spacing[2],
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.indigoPunch,
    paddingVertical: 12,
    borderRadius: radius.md,
    gap: spacing[2],
    shadowColor: colors.indigoPunch,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  scanButtonText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 15,
    color: colors.white,
  },
  legendContainer: {
    marginTop: spacing[8],
    alignItems: "center",
    gap: spacing[4],
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[4],
  },
  legendGradient: {
    flexDirection: "row",
    height: 12,
    width: 160,
    borderRadius: 6,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: colors.borderDefault,
  },
  legendStep: {
    flex: 1,
  },
  legendText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 12,
    color: colors.textSecondary,
  },
  magicSlotInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
    backgroundColor: colors.peachBase,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 0.5,
    borderColor: colors.peachSoft,
  },
  magicSlotText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 12,
    color: colors.peachPunch,
  },
  bottomSheetPeek: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    alignItems: "center",
    paddingTop: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 20,
    zIndex: 10,
  },
  detailSheet: {
    height: 320,
    alignItems: 'stretch',
    paddingHorizontal: spacing[5],
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderDefault,
    marginBottom: 16,
    alignSelf: 'center',
  },
  peekContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
  },
  peekText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 14,
    color: colors.textPrimary,
  },
  detailHeader: {
    marginBottom: spacing[3],
  },
  detailTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailTitle: {
    fontFamily: fonts.display,
    fontSize: 20,
    color: colors.textPrimary,
  },
  detailSubtitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSecondary,
  },
  nudgeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.peachBase,
    padding: 10,
    borderRadius: radius.md,
    gap: 8,
    marginBottom: spacing[4],
    borderWidth: 0.5,
    borderColor: colors.peachSoft,
  },
  nudgeText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 13,
    color: colors.peachPunch,
    flex: 1,
  },
  memberSection: {
    gap: spacing[2],
  },
  sectionLabel: {
    fontFamily: fonts.bodySemibold,
    fontSize: 11,
    color: colors.textTertiary,
    letterSpacing: 1,
  },
  memberList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  memberChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.indigoBase,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.full,
    gap: spacing[1],
  },
  memberChipText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 12,
    color: colors.indigoPunch,
  },
  busyChip: {
    backgroundColor: colors.pageBg,
  },
  busyChipText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 12,
    color: colors.textSecondary,
  },
  editNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    padding: spacing[3],
    backgroundColor: colors.indigoBase,
    borderRadius: radius.md,
    borderWidth: 0.5,
    borderColor: colors.indigoSoft,
  },
  editNoticeText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 13,
    color: colors.indigoPunch,
  },
  legendBox: {
    width: 12,
    height: 12,
    borderRadius: 2,
    borderWidth: 0.5,
    borderColor: colors.borderDefault,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[5],
  },
  modalContent: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing[6],
    gap: spacing[6],
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quickAddTitle: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.textPrimary,
  },
  formGroup: {
    gap: spacing[2],
  },
  formLabel: {
    fontFamily: fonts.bodySemibold,
    fontSize: 14,
    color: colors.textSecondary,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radius.md,
    padding: spacing[4],
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.textPrimary,
    backgroundColor: colors.pageBg,
  },
  durationRow: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  durationPill: {
    flex: 1,
    height: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.pageBg,
  },
  activeDurationPill: {
    borderColor: colors.indigoPunch,
    backgroundColor: colors.indigoBase,
  },
  durationText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 14,
    color: colors.textSecondary,
  },
  activeDurationText: {
    color: colors.indigoPunch,
  },
  saveButton: {
    height: 54,
  },
  confirmModalContainer: {
    flex: 1,
    backgroundColor: colors.pageBg,
  },
  modalHeaderFixed: {
    padding: spacing[5],
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderDefault,
  },
  confirmModalTitle: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  confirmModalSubtitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  modalGridScroll: {
    paddingVertical: spacing[4],
  },
  confirmModalFooter: {
    flexDirection: 'row',
    padding: spacing[5],
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.borderDefault,
    gap: spacing[3],
  },
  discardButton: {
    flex: 1,
    height: 54,
    borderRadius: radius.md,
    backgroundColor: colors.pageBg,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    justifyContent: 'center',
    alignItems: 'center',
  },
  discardButtonText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 16,
    color: colors.textSecondary,
  },
  confirmButton: {
    flex: 2,
    height: 54,
    borderRadius: radius.md,
    backgroundColor: colors.indigoPunch,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.indigoPunch,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmButtonText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 16,
    color: colors.white,
  },
  modalHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  previewToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: colors.indigoBase,
    borderRadius: radius.full,
  },
  previewToggleText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 12,
    color: colors.indigoPunch,
  },
  imageAnchorContainer: {
    height: 200,
    backgroundColor: colors.black,
    position: 'relative',
  },
  anchorImage: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  imageOverlayLabel: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  imageOverlayText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 10,
    color: colors.white,
    letterSpacing: 1,
  },
  impactBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.peachBase,
    padding: 12,
    borderRadius: radius.md,
    gap: 10,
    marginBottom: spacing[3],
    borderWidth: 1,
    borderColor: colors.peachSoft,
  },
  impactText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.peachDeep,
    flex: 1,
    lineHeight: 18,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F1',
    padding: 12,
    borderRadius: radius.md,
    gap: 10,
    marginBottom: spacing[3],
    borderWidth: 1,
    borderColor: colors.peachSoft,
  },
  warningText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 13,
    color: colors.peachDeep,
    flex: 1,
  },
  bold: {
    fontFamily: fonts.bodySemibold,
    color: colors.peachPunch,
  },
  uncertaintyHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  uncertaintyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.peachMid,
  },
  uncertaintyText: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
});
