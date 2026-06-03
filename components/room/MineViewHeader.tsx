import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Sparkle, Info, Camera } from 'phosphor-react-native';
import { colors } from '@/constants/theme';
import { Button } from '@/components/Button';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { styles } from '@/app/room/[id]/_calendar.styles';

interface MineViewHeaderProps {
  potentialMagicSlotsCount: number;
  emptyDays: number[];
  isScanning: boolean;
  onScanPress: () => void;
}

export const MineViewHeader = ({
  potentialMagicSlotsCount,
  emptyDays,
  isScanning,
  onScanPress,
}: MineViewHeaderProps) => {
  return (
    <View style={styles.mineHeader}>
      <Animated.View entering={FadeInDown.delay(100).duration(500)}>
        <View style={styles.impactBanner}>
          <Sparkle size={18} color={colors.peachPunch} weight="fill" />
          <Text style={styles.impactText}>
            Your schedule helps find <Text style={styles.bold}>{potentialMagicSlotsCount} new "Magic Slots"</Text> for the group.
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
        onPress={onScanPress}
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
  );
};
