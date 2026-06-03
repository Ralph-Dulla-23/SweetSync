import React from 'react';
import { View, Text, Pressable, TextInput, ScrollView, Modal } from 'react-native';
import { X, CaretRight } from 'phosphor-react-native';
import { colors } from '@/constants/theme';
import { Button } from '@/components/Button';
import { slotIndexToTime } from '@/lib/time';
import { styles } from '@/app/room/[id]/_calendar.styles';
import { localStyles } from '@/app/room/[id]/CalendarComponents';

interface QuickAddModalProps {
  visible: boolean;
  blockTitle: string;
  onSetBlockTitle: (val: string) => void;
  startSlotIndex: number;
  onSetStartSlotIndex: (val: number) => void;
  endSlotIndex: number;
  onSetEndSlotIndex: (val: number) => void;
  onSave: () => void;
  onClose: () => void;
}

export const QuickAddModal = ({
  visible,
  blockTitle,
  onSetBlockTitle,
  startSlotIndex,
  onSetStartSlotIndex,
  endSlotIndex,
  onSetEndSlotIndex,
  onSave,
  onClose,
}: QuickAddModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeaderRow}>
            <Text style={styles.quickAddTitle}>Add Busy Block</Text>
            <Pressable onPress={onClose}>
              <X size={24} color={colors.textSecondary} />
            </Pressable>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>What's the plan?</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Work, Gym, Class"
              placeholderTextColor={colors.textTertiary}
              value={blockTitle}
              onChangeText={onSetBlockTitle}
              autoFocus
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Set Time Range</Text>
            <View style={localStyles.pickerRow}>
              <View style={localStyles.pickerColumn}>
                <Text style={localStyles.columnLabel}>START</Text>
                <ScrollView style={localStyles.pickerList} showsVerticalScrollIndicator={false}>
                  {Array.from({ length: 48 }, (_, i) => i).map(s => (
                    <Pressable 
                      key={`start-${s}`}
                      style={[localStyles.slotItem, startSlotIndex === s && localStyles.activeSlotItem]}
                      onPress={() => {
                        onSetStartSlotIndex(s);
                        if (s >= endSlotIndex) onSetEndSlotIndex(s + 1);
                      }}
                    >
                      <Text style={[localStyles.slotText, startSlotIndex === s && localStyles.activeSlotText]}>
                        {slotIndexToTime(s)}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>

              <View style={localStyles.divider}>
                <CaretRight size={16} color={colors.textTertiary} weight="bold" />
              </View>

              <View style={localStyles.pickerColumn}>
                <Text style={localStyles.columnLabel}>END</Text>
                <ScrollView style={localStyles.pickerList} showsVerticalScrollIndicator={false}>
                  {Array.from({ length: 49 }, (_, i) => i).filter(s => s > startSlotIndex).map(s => (
                    <Pressable 
                      key={`end-${s}`}
                      style={[localStyles.slotItem, endSlotIndex === s && localStyles.activeSlotItem]}
                      onPress={() => onSetEndSlotIndex(s)}
                    >
                      <Text style={[localStyles.slotText, endSlotIndex === s && localStyles.activeSlotText]}>
                        {s === 48 ? "00:00" : slotIndexToTime(s)}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            </View>
          </View>

          <Button 
            title="Add to Schedule" 
            onPress={onSave}
            style={styles.saveButton}
          />
        </View>
      </View>
    </Modal>
  );
};