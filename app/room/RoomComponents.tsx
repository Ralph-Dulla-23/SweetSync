import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable,
} from "react-native";
import { CheckCircle, Bell, UsersThree, CaretRight, Calendar, Sparkle, MagicWand, Copy } from "phosphor-react-native";
import { colors, fonts, spacing, radius } from "@/constants/theme";
import { Header } from "@/components/Header";
import { ProgressBar } from "@/components/ProgressBar";
import { Button, ButtonVariant } from "@/components/Button";
import { Avatar } from "@/components/Avatar";
import { Card } from "@/components/Card";
import Animated, { 
  FadeInUp, 
  FadeInDown,
} from "react-native-reanimated";
import { UpcomingEventCard } from "@/components/UpcomingEventCard";
import { ActivityDiscovery } from "@/components/ActivityDiscovery";
import { styles } from "./_[id].styles";
import { globalStyles } from "@/styles/global";

const localStyles = StyleSheet.create({
  heatmapButton: {
    backgroundColor: colors.surface,
    marginBottom: spacing[4],
    borderRadius: radius.lg,
    padding: spacing[5],
    borderWidth: 1,
    borderColor: colors.borderDefault,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  heatmapButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
  },
  heatmapIconContainer: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.indigoBase,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heatmapButtonTitle: {
    fontFamily: fonts.bodySemibold,
    fontSize: 15,
    color: colors.textPrimary,
  },
  heatmapButtonSubtitle: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 2,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing[6],
    marginBottom: spacing[8],
    marginTop: 0,
  },
  quickAction: {
    alignItems: 'center',
    gap: spacing[2],
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionLabel: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textSecondary,
  },
});

export const MemberRow = React.memo(({ member, index, isLast, onNudge, isFirstRender = true }: { member: any; index: number; isLast: boolean; onNudge: (id: string) => void; isFirstRender?: boolean }) => {
  const [nudged, setNudged] = React.useState(member.lastNudgeAt ? (Date.now() - member.lastNudgeAt < 12 * 60 * 60 * 1000) : false);
  
  const handleNudge = () => {
    if (!nudged) {
      setNudged(true);
      onNudge(member.id);
    }
  };

  return (
    <Animated.View 
      entering={isFirstRender ? FadeInDown.delay(400 + index * 50).duration(500) : undefined}
      style={[styles.memberRow, isLast && styles.lastMemberRow]}
    >
      <Avatar uri={member.avatarUri} name={member.name} size={44} />
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{member.name}</Text>
        <View style={styles.statusRow}>
          <View style={[styles.statusDot, { backgroundColor: member.status === 'uploaded' ? colors.mintPunch : colors.peachSoft }]} />
          <Text style={styles.memberStatus}>
            {member.status === 'uploaded' ? 'Synced' : 'Thinking...'}
          </Text>
        </View>
      </View>
      
      {member.status === 'pending' && (
        <Button 
          title={nudged ? "Nudged" : "Nudge"}
          variant="ghost"
          disabled={nudged}
          onPress={handleNudge}
          style={styles.nudgeButton}
          textStyle={styles.nudgeButtonText}
          icon={<Bell size={14} color={nudged ? colors.textTertiary : colors.peachPunch} weight={nudged ? "fill" : "bold"} />}
        />
      )}
      {member.status === 'uploaded' && (
        <CheckCircle size={22} color={colors.mintPunch} weight="fill" />
      )}
    </Animated.View>
  );
});

export const RoomHeader = React.memo(({ 
  room, 
  isHost, 
  uploadedCount, 
  totalCount, 
  progress, 
  isReady, 
  isFirstRender, 
  handleCopyCode, 
  handleSimulate, 
  handleInvite,
  id,
  router
}: any) => {
  return (
    <View>
      <Animated.View entering={isFirstRender ? FadeInDown.duration(800) : undefined}>
        <Card style={styles.mainCard}>
          <View style={styles.progressHeader}>
            <View>
              <Text style={styles.progressTitle}>Syncing Progress</Text>
              <Text style={styles.progressSubtitle}>{uploadedCount} of {totalCount} friends synced</Text>
            </View>
            <View style={[styles.badge, isReady ? styles.readyBadge : styles.waitingBadge]}>
              <Text style={[styles.badgeText, isReady ? styles.readyBadgeText : styles.waitingBadgeText]}>
                {isReady ? "Ready to reveal" : "Collecting"}
              </Text>
            </View>
          </View>
          
          <ProgressBar progress={progress} height={10} style={styles.progressBar} />
          
          <View style={styles.syncTips}>
            <Sparkle size={16} color={colors.indigoPunch} weight="fill" />
            <Text style={styles.syncTipText}>
              The more schedules, the better the magic.
            </Text>
          </View>
        </Card>
      </Animated.View>

      <Animated.View entering={isFirstRender ? FadeInUp.duration(600).delay(400) : undefined}>
        <View style={localStyles.quickActionsRow}>
          <Pressable style={localStyles.quickAction} onPress={handleCopyCode}>
            <View style={localStyles.quickActionIcon}>
              <Copy size={20} color={colors.textSecondary} />
            </View>
            <Text style={localStyles.quickActionLabel}>Copy Code</Text>
          </Pressable>
          <Pressable style={localStyles.quickAction} onPress={handleInvite}>
            <View style={localStyles.quickActionIcon}>
              <MagicWand size={20} color={colors.textSecondary} />
            </View>
            <Text style={localStyles.quickActionLabel}>Invite</Text>
          </Pressable>
          {isHost && (
            <Pressable style={localStyles.quickAction} onPress={handleSimulate}>
              <View style={[localStyles.quickActionIcon, { borderColor: colors.peachSoft, backgroundColor: colors.peachBase }]}>
                <Sparkle size={20} color={colors.peachPunch} weight="fill" />
              </View>
              <Text style={localStyles.quickActionLabel}>Simulate</Text>
            </Pressable>
          )}
        </View>
      </Animated.View>

      {room.upcomingEvents && room.upcomingEvents.length > 0 && (
        <Animated.View entering={isFirstRender ? FadeInUp.duration(600).delay(600) : undefined} style={styles.confirmedPlansContainer}>
          <View style={styles.sectionHeader}>
            <Calendar size={16} color={colors.textTertiary} weight="bold" />
            <Text style={styles.sectionTitle}>Confirmed Plan</Text>
          </View>
          <UpcomingEventCard event={room.upcomingEvents[0]} />
        </Animated.View>
      )}

      {room.activitySuggestions && room.activitySuggestions.length > 0 && (
        <Animated.View entering={isFirstRender ? FadeInUp.duration(600).delay(600) : undefined}>
          <ActivityDiscovery suggestions={room.activitySuggestions} />
        </Animated.View>
      )}

      <Animated.View entering={isFirstRender ? FadeInUp.duration(600).delay(800) : undefined}>
        <View style={styles.sectionHeader}>
          <UsersThree size={16} color={colors.textTertiary} weight="bold" />
          <Text style={styles.sectionTitle}>The Squad</Text>
        </View>

        <Pressable 
          style={({ pressed }) => [localStyles.heatmapButton, pressed && { opacity: 0.7 }]}
          onPress={() => router.push(`/room/${id}/calendar`)}
          accessibilityLabel="View group availability heatmap"
          accessibilityRole="button"
        >
          <View style={localStyles.heatmapButtonContent}>
            <View style={localStyles.heatmapIconContainer}>
              <UsersThree size={20} color={colors.indigoPunch} weight="duotone" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={localStyles.heatmapButtonTitle}>View Group Heatmap</Text>
              <Text style={localStyles.heatmapButtonSubtitle}>See everyone's availability & add your own</Text>
            </View>
            <CaretRight size={20} color={colors.textTertiary} />
          </View>
        </Pressable>
      </Animated.View>
    </View>
  );
});

export interface CTAAction {
  title: string;
  variant: ButtonVariant;
  onPress: () => void;
  label: string;
  disabled?: boolean;
}

export const RoomFooter = React.memo(({ 
  cta, 
  isReady, 
  room, 
  uploadedCount, 
  canProceed, 
  isFirstRender, 
  handleLeave 
}: {
  cta: CTAAction;
  isReady: boolean;
  room: any;
  uploadedCount: number;
  canProceed: boolean;
  isFirstRender: boolean;
  handleLeave: () => void;
}) => {
  return (
    <View>
      <Animated.View entering={isFirstRender ? FadeInUp.duration(600).delay(1000) : undefined} style={styles.footer}>
        <Button 
          title={cta.title} 
          variant={cta.variant}
          disabled={cta.disabled}
          onPress={cta.onPress}
          style={styles.mainButton}
          accessibilityLabel={cta.label}
        />
        {room.sessionStatus === 'collecting' && !isReady && (
          <Text style={[styles.footerNote, canProceed && styles.footerNoteProceed]}>
            {canProceed 
              ? "Proceed anyway? AI will show gaps based on synced data." 
              : "Waiting for the squad to reveal free time 🍑"}
          </Text>
        )}
        {room.sessionStatus === 'voting_slots' && (
          <Text style={styles.footerNote}>
            Review the best times & sync up!
          </Text>
        )}
        
        <Pressable 
          style={styles.leaveButton}
          onPress={handleLeave}
        >
          <Text style={styles.leaveButtonText}>Back to Dashboard</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
});
