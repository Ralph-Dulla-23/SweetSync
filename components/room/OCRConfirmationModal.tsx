import React from 'react';
import { View, Text, Pressable, Image, ScrollView, Modal, SafeAreaView } from 'react-native';
import { Eye, EyeSlash } from 'phosphor-react-native';
import { colors } from '@/constants/theme';
import { HeatMap } from '@/components/HeatMap';
import { styles } from '@/app/room/[id]/_calendar.styles';
import { TimeSlot } from '@/types';

interface OCRConfirmationModalProps {
  visible: boolean;
  draftSchedule: Map<string, number> | null;
  scannedImageUri: string | null;
  showImagePreview: boolean;
  onSetShowImagePreview: (val: boolean) => void;
  lowConfidenceCells: string[];
  mockData: TimeSlot[][];
  onToggleDraftCell: (date: string, slotIndex: number) => void;
  onDiscard: () => void;
  onConfirm: () => void;
}

export const OCRConfirmationModal = ({
  visible,
  draftSchedule,
  scannedImageUri,
  showImagePreview,
  onSetShowImagePreview,
  lowConfidenceCells,
  mockData,
  onToggleDraftCell,
  onDiscard,
  onConfirm,
}: OCRConfirmationModalProps) => {
  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={styles.confirmModalContainer}>
        <View style={styles.modalHeaderFixed}>
          <View style={styles.modalHeaderTop}>
            <Text style={styles.confirmModalTitle}>Confirm Extraction</Text>
            <Pressable 
              style={[styles.previewToggle, showImagePreview && { backgroundColor: colors.indigoPunch }]} 
              onPress={() => onSetShowImagePreview(!showImagePreview)}
            >
              {showImagePreview ? <EyeSlash size={20} color={colors.white} /> : <Eye size={20} color={colors.indigoPunch} />}
              <Text style={[styles.previewToggleText, showImagePreview && { color: colors.white }]}>
                {showImagePreview ? "Ghost Overlay: On" : "Show Overlay"}
              </Text>
            </Pressable>
          </View>
          <Text style={styles.confirmModalSubtitle}>
            Our AI extracted these busy blocks. {showImagePreview ? "Compare against your screenshot below." : "Tap blocks to correct any errors."}
          </Text>
          <View style={styles.uncertaintyHint}>
            <View style={[styles.uncertaintyDot, { backgroundColor: colors.peachPunch }]} />
            <Text style={styles.uncertaintyText}>Pulsing blocks need your review.</Text>
          </View>
        </View>

        <View style={{ flex: 1 }}>
          {showImagePreview && scannedImageUri && (
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
              <Image 
                source={{ uri: scannedImageUri }} 
                style={{ width: '100%', height: '100%', opacity: 0.35 }} 
                resizeMode="cover" 
              />
            </View>
          )}
          
          <ScrollView contentContainerStyle={styles.modalGridScroll}>
            <HeatMap 
              data={mockData}
              totalMembers={5}
              magicSlots={[]}
              isEditMode={true}
              onToggleCell={onToggleDraftCell}
              mySchedule={draftSchedule || new Map()}
              lowConfidenceCells={lowConfidenceCells}
              backgroundOpacity={showImagePreview ? 0.85 : 1}
            />
          </ScrollView>
        </View>

        <View style={styles.confirmModalFooter}>
          <Pressable style={styles.discardButton} onPress={onDiscard}>
            <Text style={styles.discardButtonText}>Discard</Text>
          </Pressable>
          <Pressable style={styles.confirmButton} onPress={onConfirm}>
            <Text style={styles.confirmButtonText}>Confirm My Schedule</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
};