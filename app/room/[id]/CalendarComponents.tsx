import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable,
} from "react-native";
import { X, Users } from "phosphor-react-native";
import { colors, spacing, radius, fonts } from "@/constants/theme";
import Animated, { 
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { Button } from "@/components/Button";
import { slotIndexToTime } from "@/lib/time";
import { format, parseISO } from "date-fns";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { springConfigs } from "@/constants/animation";
import { styles } from "./_calendar.styles";

export const localStyles = StyleSheet.create({
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

const getAction = (sessionStatus: string, id: string, router: any) => {
  if (sessionStatus === 'voting_slots' || sessionStatus === 'voting_activity') {
    return { title: "Start Voting", onPress: () => router.push(`/room/${id}/vote-slots`) };
  }
  if (sessionStatus === 'processing') {
    return { title: "AI is Syncing...", onPress: () => router.push(`/room/${id}/processing`), variant: "ghost" as const };
  }
  return { title: "Reveal the Magic", onPress: () => router.push(`/room/${id}/processing`) };
};

export const InteractiveBottomSheet = React.memo(({ selectedSlot, clearSelection, isNudgeSlot, id, router, sessionStatus }: any) => {
  const insets = useSafeAreaInsets();
  
  // Sheet is roughly 160-200px tall in compact mode. 
  // We'll hide it 400px down to be safe.
  const OPEN_Y = 0;
  const HIDDEN_Y = 400; 

  const translateY = useSharedValue(HIDDEN_Y);

  // Internal state to hold data during transition
  const [internalSlot, setInternalSlot] = React.useState<any>(null);

  const handleDismiss = React.useCallback(() => {
    translateY.value = withSpring(HIDDEN_Y, springConfigs.gestural, (finished) => {
      if (finished) {
        runOnJS(setInternalSlot)(null);
        runOnJS(clearSelection)();
      }
    });
  }, [clearSelection, HIDDEN_Y, translateY]);

  React.useEffect(() => {
    if (selectedSlot) {
      setInternalSlot(selectedSlot);
      translateY.value = withSpring(OPEN_Y, springConfigs.gestural);
    } else if (internalSlot) {
      // Trigger dismissal animation if external state is cleared
      handleDismiss();
    }
  }, [selectedSlot, internalSlot, handleDismiss, OPEN_Y, translateY]);

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

  const action = getAction(sessionStatus, id, router);

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
            translateY.value = withSpring(OPEN_Y, springConfigs.gestural);
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
            <Pressable 
              onPress={handleDismiss}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
              style={styles.compactHeaderClose}
            >
              <X size={18} color={colors.textSecondary} weight="bold" />
            </Pressable>
          </View>

          <View style={styles.compactChips}>
            <View style={styles.memberSection}>
              <Text style={styles.sectionLabel}>FREE SQUAD</Text>
              <View style={styles.memberList}>
                {displaySlot.members.map((member: string, i: number) => {
                  const isPreferred = displaySlot.preferredMembers.includes(member);
                  return (
                    <View key={i} style={[styles.memberChip, isPreferred && styles.memberChipPreferred]}>
                      <Users size={14} color={isPreferred ? colors.indigoNeon : colors.indigoPunch} weight="fill" />
                      <Text style={[styles.memberChipText, isPreferred && styles.memberChipTextPreferred]}>{member}</Text>
                    </View>
                  );
                })}
              </View>
            </View>

            <View style={styles.memberSection}>
              <Text style={styles.sectionLabel}>BUSY / UNSYNCED</Text>
              <View style={styles.memberList}>
                {displaySlot.busyMembers.map((member: string, i: number) => (
                  <View key={i} style={[styles.memberChip, styles.busyChip]}>
                    <X size={12} color={colors.textSecondary} weight="bold" />
                    <Text style={[styles.memberChipText, styles.busyChipText]}>{member}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
          
          <Button 
            title={action.title} 
            variant={action.variant as any}
            onPress={action.onPress}
            style={{ marginTop: spacing[4], height: 52 }}
          />
        </View>
      </Animated.View>
    </GestureDetector>
  );
});
