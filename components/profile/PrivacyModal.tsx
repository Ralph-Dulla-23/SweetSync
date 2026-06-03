import React from 'react';
import { Modal, Pressable, View, Text } from 'react-native';
import { colors } from '@/constants/theme';
import { Check } from 'phosphor-react-native';
import { Button } from '@/components/Button';
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { styles } from '@/app/(tabs)/_profile.styles';

interface PrivacyModalProps {
  visible: boolean;
  activeTab: 'profile' | 'schedule';
  profilePublic: boolean;
  heatMapOnly: boolean;
  onClose: () => void;
  onSetProfilePublic: (val: boolean) => void;
  onSetHeatMapOnly: (val: boolean) => void;
}

export const PrivacyModal = ({
  visible,
  activeTab,
  profilePublic,
  heatMapOnly,
  onClose,
  onSetProfilePublic,
  onSetHeatMapOnly,
}: PrivacyModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable 
        style={styles.modalOverlay} 
        onPress={onClose}
      >
        <Animated.View 
          entering={SlideInDown} 
          exiting={SlideOutDown}
          style={styles.modalContent}
        >
          <View style={styles.modalHeader}>
            <View style={styles.modalHandle} />
          </View>
          
          <View style={styles.modalBody}>
            <Text style={styles.modalTitle}>
              {activeTab === 'profile' ? 'Profile Visibility' : 'Schedule Visibility'}
            </Text>

            {activeTab === 'profile' ? (
              <View>
                <Pressable 
                  style={({ pressed }) => [styles.modalOption, pressed && { opacity: 0.7 }]}
                  onPress={() => { onSetProfilePublic(true); onClose(); }}
                >
                  <View style={styles.modalOptionText}>
                    <Text style={styles.modalOptionTitle}>Public</Text>
                    <Text style={styles.modalOptionDescription}>Anyone can search for you by name or email.</Text>
                  </View>
                  {profilePublic && <Check size={24} color={colors.peachPunch} weight="bold" />}
                </Pressable>

                <Pressable 
                  style={({ pressed }) => [styles.modalOption, pressed && { opacity: 0.7 }]}
                  onPress={() => { onSetProfilePublic(false); onClose(); }}
                >
                  <View style={styles.modalOptionText}>
                    <Text style={styles.modalOptionTitle}>Private</Text>
                    <Text style={styles.modalOptionDescription}>Only people in your rooms can see your profile.</Text>
                  </View>
                  {!profilePublic && <Check size={24} color={colors.peachPunch} weight="bold" />}
                </Pressable>
              </View>
            ) : (
              <View>
                <Pressable 
                  style={({ pressed }) => [styles.modalOption, pressed && { opacity: 0.7 }]}
                  onPress={() => { onSetHeatMapOnly(true); onClose(); }}
                >
                  <View style={styles.modalOptionText}>
                    <Text style={styles.modalOptionTitle}>Heat map only</Text>
                    <Text style={styles.modalOptionDescription}>Friends only see when you're free, not why you're busy.</Text>
                  </View>
                  {heatMapOnly && <Check size={24} color={colors.indigoPunch} weight="bold" />}
                </Pressable>

                <Pressable 
                  style={({ pressed }) => [styles.modalOption, pressed && { opacity: 0.7 }]}
                  onPress={() => { onSetHeatMapOnly(false); onClose(); }}
                >
                  <View style={styles.modalOptionText}>
                    <Text style={styles.modalOptionTitle}>Detailed</Text>
                    <Text style={styles.modalOptionDescription}>Room members can see individual event blocks.</Text>
                  </View>
                  {!heatMapOnly && <Check size={24} color={colors.indigoPunch} weight="bold" />}
                </Pressable>
              </View>
            )}

            <Button 
              title="Close" 
              variant="ghost" 
              onPress={onClose}
              style={styles.modalCloseBtn}
            />
          </View>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};