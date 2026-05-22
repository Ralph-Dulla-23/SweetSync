import React from "react";
import * as Linking from 'expo-linking';
import * as Clipboard from 'expo-clipboard';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator,
  Share,
  AccessibilityInfo
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CheckCircle, Bell, UsersThree, CaretRight, Calendar, Sparkle, MagicWand, Copy } from "phosphor-react-native";
import { colors, fonts, spacing, radius } from "@/constants/theme";
import { Header } from "@/components/Header";
import { ProgressBar } from "@/components/ProgressBar";
import { Button } from "@/components/Button";
import { Avatar } from "@/components/Avatar";
import { Card } from "@/components/Card";
import Animated, { 
  FadeInUp, 
  FadeInDown,
} from "react-native-reanimated";
import { RoomInteriorSkeleton } from "@/components/RoomInteriorSkeleton";
import { UpcomingEventCard } from "@/components/UpcomingEventCard";
import { ActivityDiscovery } from "@/components/ActivityDiscovery";
import { useRoom } from "@/hooks/useRoom";
import { useAuth } from "@/hooks/useAuth";
import { useSweetToast } from "@/hooks/useSweetToast";
import { styles } from "./_[id].styles";

function useIsFirstRender() {
  const isFirst = React.useRef(true);
  React.useEffect(() => {
    isFirst.current = false;
  }, []);
  return isFirst.current;
}

// Optional Haptics
let Haptics: any;
try {
  Haptics = require('expo-haptics');
} catch (e) {
  Haptics = null;
}

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
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderDefault,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionLabel: {
    fontFamily: fonts.bodySemibold,
    fontSize: 12,
    color: colors.textSecondary,
  },
});

const NudgeAllBanner = ({ pendingCount, onNudgeAll, isFirstRender = true }: { pendingCount: number; onNudgeAll: () => void; isFirstRender?: boolean }) => {
  const [nudgedAll, setNudgedAll] = React.useState(false);

  const handlePress = () => {
    setNudgedAll(true);
    onNudgeAll();
    if (Haptics) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  if (nudgedAll) return null;

  return (
    <Animated.View 
      entering={isFirstRender ? FadeInDown.duration(600) : undefined}
      style={[styles.nudgeAllBanner, { marginTop: 0, marginBottom: spacing[8] }]}
    >
      <View style={styles.nudgeAllContent}>
        <View style={styles.nudgeAllIcon}>
          <Bell size={20} color={colors.peachPunch} weight="fill" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.nudgeAllTitle}>{pendingCount} friends haven't synced yet</Text>
          <Text style={styles.nudgeAllSubtitle}>Nudge them all with one tap?</Text>
        </View>
        <TouchableOpacity 
          style={styles.nudgeAllButton}
          onPress={handlePress}
        >
          <Text style={styles.nudgeAllButtonText}>NUDGE ALL</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const MemberRow = React.memo(({ member, index, isLast, onNudge, isFirstRender = true }: { member: any; index: number; isLast: boolean; onNudge: (id: string) => void; isFirstRender?: boolean }) => {
  // Simulate a 12-hour cool-down using a mock state/timestamp logic
  // In a real app, this would be fetched from the member's relation metadata
  const [nudged, setNudged] = React.useState(member.lastNudgeAt ? (Date.now() - member.lastNudgeAt < 12 * 60 * 60 * 1000) : false);

  const handlePress = () => {
    if (nudged) return;
    setNudged(true);
    onNudge(member.id);
    if (Haptics) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    AccessibilityInfo.announceForAccessibility(`Nudged ${member.name}`);
  };

  const statusText = member.status === "uploaded" ? "Synced" : nudged ? "Nudged (on cooldown)" : "Waiting for upload";

  return (
    <Animated.View 
      entering={isFirstRender ? FadeInUp.duration(600).delay(200 + index * 50).springify().damping(18) : undefined}
    >
      <View 
        style={[
          styles.memberRow, 
          isLast && styles.noBorder
        ]}
        accessible={true}
        accessibilityLabel={`${member.name}, ${member.isHost ? 'Host, ' : ''}${statusText}`}
      >
        <View style={styles.memberLeft} importantForAccessibility="no-hide-descendants">
          <Avatar 
            name={member.name} 
            uri={member.avatarUri}
            size={44} 
            color={member.status === "uploaded" ? colors.peachPunch : colors.textTertiary} 
          />
          <View style={styles.memberInfo}>
            <Text style={styles.memberName} numberOfLines={1} ellipsizeMode="tail">{member.name}</Text>
            <View style={styles.statusRow}>
              {member.isHost && <Text style={styles.hostTag}>Host</Text>}
              <Text style={[
                styles.memberStatus,
                member.status === "pending" && styles.pendingText
              ]} numberOfLines={1} ellipsizeMode="tail">
                {statusText}
              </Text>
            </View>
          </View>
        </View>
        
        {member.status === "uploaded" ? (
          <View style={styles.statusIndicator} importantForAccessibility="no-hide-descendants">
            <CheckCircle size={26} weight="fill" color={colors.mintPunch} />
          </View>
        ) : (
          <TouchableOpacity 
            style={[
              styles.nudgeButton,
              nudged && { backgroundColor: colors.pageBg, borderColor: colors.borderDefault, opacity: 0.6 }
            ]}
            activeOpacity={0.7}
            onPress={handlePress}
            disabled={nudged}
            accessibilityRole="button"
            accessibilityLabel={nudged ? `${member.name} nudged` : `Nudge ${member.name}`}
          >
            {nudged ? (
              <CheckCircle size={20} color={colors.textTertiary} weight="fill" />
            ) : (
              <Bell size={20} color={colors.peachPunch} weight="bold" />
            )}
            <Text style={[
              styles.nudgeLabel,
              nudged && { color: colors.textTertiary }
            ]}>
              {nudged ? "Sent!" : "Nudge"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
});

export default function RoomInterior() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const toast = useSweetToast();
  const { room, loading, nudgeMember, updateStatus, startSimulation } = useRoom(id as string);
  const isFirstRender = useIsFirstRender();

  const isHost = room?.hostId === user?.id;

  const handleNudge = React.useCallback((memberId: string) => {
    nudgeMember(memberId);
  }, [nudgeMember]);

  const handleNudgeAll = React.useCallback(() => {
    room?.members.filter(m => m.status === 'pending').forEach(m => nudgeMember(m.id));
  }, [room, nudgeMember]);

  const handleInvite = async () => {
    if (!room) return;
    try {
      // Create a one-tap deep link
      const joinUrl = Linking.createURL('/join', {
        queryParams: { code: room.id },
      });

      await Share.share({
        message: `The squad is syncing! 🍑\n\nI just created "${room.name}" on SweetSync. Hop in so we can find the perfect time to hang!\n\nTap to join: ${joinUrl}\n\n(Or use code: ${room.id})`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleCopyCode = React.useCallback(async () => {
    if (!room) return;
    await Clipboard.setStringAsync(room.id);
    if (Haptics) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    AccessibilityInfo.announceForAccessibility("Join code copied to clipboard");
    // In a real app, we might show a Toast here too
  }, [room]);

  const handleProceed = React.useCallback(() => {
    if (!isHost && room?.sessionStatus === 'collecting') {
      toast.show({
        type: 'info',
        text1: 'Waiting for Host',
        text2: 'Only the squad leader can reveal the magic! 🍑'
      });
      return;
    }
    // Navigate to respective flow based on status
    if (room?.sessionStatus === 'collecting') {
      updateStatus('processing');
      router.push(`/room/${id}/processing`);
    } else if (room?.sessionStatus === 'voting_slots') {
      router.push(`/room/${id}/vote-slots`);
    } else if (room?.sessionStatus === 'voting_activity') {
      router.push(`/room/${id}/vote-activity`);
    } else if (room?.sessionStatus === 'confirmed') {
      const eventId = room.upcomingEvents?.[0]?.id;
      if (eventId) router.push(`/confirmed/${eventId}`);
    }
  }, [id, room?.sessionStatus, router, updateStatus, room?.upcomingEvents, isHost, toast]);

  const handleSimulate = React.useCallback(() => {
    startSimulation();
    if (Haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, [startSimulation]);

  if (loading || !room) {
    return <RoomInteriorSkeleton />;
  }

  const uploadedCount = room.members.filter(m => m.status === "uploaded").length;
  const pendingMembers = room.members.filter(m => m.status === "pending");
  
  // Logic from study: Rooms use current members as denominator if expectedCount is 0
  const totalCount = room.expectedCount > 0 ? room.expectedCount : Math.max(room.members.length, 1);
  const progress = Math.min((uploadedCount / totalCount) * 100, 100);
  
  const isReady = uploadedCount >= totalCount;
  const canProceed = uploadedCount >= 3 || (uploadedCount / totalCount >= 0.5);

  // Dynamic CTA mapping based on PRD Session State Machine
  const getMainCTA = () => {
    const defaultAction = () => handleProceed();
    
    switch (room.sessionStatus) {
      case 'collecting':
        if (isReady) return { title: "Reveal the Magic", variant: "indigo", onPress: defaultAction, label: "Reveal magic slots", disabled: !isHost };
        if (canProceed) return { title: "Reveal Early", variant: "primary", onPress: defaultAction, label: "Reveal provisional slots", disabled: !isHost };
        return { 
          title: "Waiting for Squad...", 
          variant: "ghost", 
          onPress: () => {
            if (isHost) {
              toast.show({
                type: 'info',
                text1: 'Not quite ready! 🍑',
                text2: `We need at least 50% or 3 friends synced to reveal slots.`
              });
            }
          }, 
          disabled: false, // Make it pressable so we can show the toast
          label: "Waiting for more friends to sync" 
        };
      
      case 'processing':
        return { title: "AI is Thinking...", variant: "ghost", onPress: () => {}, disabled: true, label: "Syncing schedules" };
      
      case 'voting_slots':
        return { title: "Cast your Vote", variant: "indigo", onPress: () => router.push(`/room/${id}/vote-slots`), label: "Pick a time slot" };
      
      case 'voting_activity':
        return { title: "Pick the Plan", variant: "indigo", onPress: () => router.push(`/room/${id}/vote-activity`), label: "Vote on activities" };
      
      case 'confirmed':
        const eventId = room.upcomingEvents?.[0]?.id;
        return { title: "View Confirmed Plan", variant: "mint", onPress: () => eventId && router.push(`/confirmed/${eventId}`), label: "Celebration screen" };
      
      case 'expired':
        return { title: "Start New Session", variant: "peach", onPress: () => {}, label: "Restart scheduling cycle" };
      
      default:
        return { title: "Unknown State", variant: "ghost", onPress: () => {}, disabled: true, label: "N/A" };
    }
  };

  const cta = getMainCTA();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header 
        title={room.name} 
        subtitle={room.description || "Coordinate with the squad"}
        showBack 
        backLabel="Rooms" 
        userAvatar
      />

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Join Code Display */}
        <Animated.View 
          entering={isFirstRender ? FadeInDown.duration(600).delay(100) : undefined}
          style={styles.joinCodeContainer}
        >
          <View style={styles.joinCodeContent}>
            <Text style={styles.joinCodeLabel}>ROOM CODE</Text>
            <View style={styles.joinCodeRow}>
              <Text style={styles.joinCodeValue}>{room.id.toUpperCase()}</Text>
              <TouchableOpacity 
                style={styles.copyButton}
                onPress={handleCopyCode}
                accessibilityLabel="Copy room code"
                accessibilityRole="button"
              >
                <Copy size={18} color={colors.peachPunch} weight="bold" />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Simulation Banner (Host Only) */}
        {isHost && room.sessionStatus === 'collecting' && uploadedCount < totalCount && (
          <Animated.View entering={isFirstRender ? FadeInDown.duration(600) : undefined}>
            <TouchableOpacity 
              style={[styles.nudgeAllBanner, { backgroundColor: colors.indigoBase, borderColor: colors.indigoSoft, marginBottom: spacing[6] }]}
              onPress={handleSimulate}
            >
              <View style={styles.nudgeAllContent}>
                <View style={[styles.nudgeAllIcon, { backgroundColor: colors.white }]}>
                  <MagicWand size={20} color={colors.indigoPunch} weight="fill" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.nudgeAllTitle, { color: colors.indigoPunch }]}>Prototype Mode</Text>
                  <Text style={[styles.nudgeAllSubtitle, { color: colors.textSecondary }]}>Tap to simulate friends joining & syncing</Text>
                </View>
                <View style={[styles.nudgeAllButton, { backgroundColor: colors.indigoPunch }]}>
                  <Text style={[styles.nudgeAllButtonText, { color: colors.white }]}>START</Text>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        )}
        {/* Progress Section - Deeply Branded */}
        <Card 
          variant={isReady || room.sessionStatus === 'confirmed' ? 'mint' : 'peach'} 
          style={styles.progressSection}
        >
          <View style={styles.progressHeader}>
            <View style={styles.progressValueContainer}>
              <Text style={[styles.progressMainValue, { color: isReady || room.sessionStatus === 'confirmed' ? colors.mintPunch : colors.peachPunch }]}>
                {uploadedCount}
              </Text>
              <Text style={styles.progressTotalValue}>/{totalCount}</Text>
            </View>
            <View style={styles.progressInfo}>
              <Text style={styles.progressTitle}>Syncing Souls</Text>
              <Text style={styles.progressSubtitle}>
                {isReady || room.sessionStatus === 'confirmed' ? "The squad is fully synced" : `${totalCount - uploadedCount} friends to go`}
              </Text>
            </View>
          </View>
          <ProgressBar 
            progress={progress} 
            color={isReady || room.sessionStatus === 'confirmed' ? colors.mintPunch : colors.peachPunch} 
            height={10} 
          />
        </Card>

        {/* Quick Actions Row */}
        <Animated.View 
          entering={isFirstRender ? FadeInUp.duration(600).delay(200) : undefined}
          style={localStyles.quickActionsRow}
        >
          <TouchableOpacity 
            style={localStyles.quickAction}
            onPress={handleInvite}
            accessibilityLabel="Invite members"
            accessibilityRole="button"
          >
            <View style={[localStyles.actionIcon, { backgroundColor: colors.peachBase }]}>
              <UsersThree size={24} color={colors.peachPunch} />
            </View>
            <Text style={localStyles.actionLabel}>Invite</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={localStyles.quickAction} 
            onPress={() => router.push(`/room/${id}/calendar?tab=mine`)}
            accessibilityLabel="Update my schedule"
            accessibilityRole="button"
          >
            <View style={[localStyles.actionIcon, { backgroundColor: colors.indigoBase }]}>
              <Calendar size={24} color={colors.indigoPunch} />
            </View>
            <Text style={localStyles.actionLabel}>Schedule</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={localStyles.quickAction}
            onPress={() => {
              if (room.sessionStatus === 'voting_activity') {
                router.push(`/room/${id}/vote-activity`);
              } else {
                // If not in voting phase yet, we can still suggest ideas
                // For now, route to the same screen but it should handle the 'suggest' only mode
                router.push(`/room/${id}/vote-activity?mode=suggest`);
              }
            }}
            accessibilityLabel="View activity ideas"
            accessibilityRole="button"
          >
            <View style={[localStyles.actionIcon, { backgroundColor: colors.mintBase }]}>
              <Sparkle size={24} color={colors.mintPunch} weight="fill" />
            </View>
            <Text style={localStyles.actionLabel}>Ideas</Text>
          </TouchableOpacity>
        </Animated.View>

        {isHost && pendingMembers.length > 1 && room.sessionStatus === 'collecting' && (
          <NudgeAllBanner 
            pendingCount={pendingMembers.length} 
            onNudgeAll={handleNudgeAll} 
            isFirstRender={isFirstRender}
          />
        )}

        {/* Confirmed Events */}
        {room.upcomingEvents && room.upcomingEvents.length > 0 && (
          <Animated.View 
            entering={isFirstRender ? FadeInUp.duration(600).delay(400) : undefined}
            style={{ marginBottom: spacing[8] }}
          >
            <View style={styles.sectionHeader}>
              <CheckCircle size={16} color={colors.mintPunch} weight="bold" />
              <Text style={styles.sectionTitle}>Confirmed Plans</Text>
            </View>
            {room.upcomingEvents.map(event => (
              <UpcomingEventCard 
                key={event.id} 
                event={event} 
                members={room.members} 
                onPress={() => router.push(`/confirmed/${event.id}`)}
              />
            ))}
          </Animated.View>
        )}

        {/* AI Suggestions */}
        {room.activitySuggestions && room.activitySuggestions.length > 0 && (
          <Animated.View entering={isFirstRender ? FadeInUp.duration(600).delay(600) : undefined}>
            <ActivityDiscovery suggestions={room.activitySuggestions} />
          </Animated.View>
        )}

        {/* Member List - Social and Responsive */}
        <Animated.View entering={isFirstRender ? FadeInUp.duration(600).delay(800) : undefined}>
          <View style={styles.sectionHeader}>
            <UsersThree size={16} color={colors.textTertiary} weight="bold" />
            <Text style={styles.sectionTitle}>The Squad</Text>
          </View>

          <TouchableOpacity 
            style={localStyles.heatmapButton}
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
          </TouchableOpacity>

          <View style={styles.memberList}>
            {room.members.map((member, index) => (
              <MemberRow 
                key={member.id}
                member={member}
                index={index}
                isLast={index === room.members.length - 1}
                onNudge={handleNudge}
                isFirstRender={isFirstRender}
              />
            ))}
          </View>
        </Animated.View>

        {/* Spacer to push footer down without massive ScrollView padding */}
        <View style={{ flex: 1 }} />

        {/* Action Area */}
        <Animated.View entering={isFirstRender ? FadeInUp.duration(600).delay(1000) : undefined} style={styles.footer}>
          <Button 
            title={cta.title} 
            variant={cta.variant as any}
            disabled={cta.disabled}
            onPress={cta.onPress}
            style={styles.mainButton}
            accessibilityLabel={cta.label}
          />
          {room.sessionStatus === 'collecting' && !isReady && (
            <Text style={[styles.footerNote, canProceed && { color: colors.peachPunch, fontFamily: fonts.bodySemibold }]}>
              {canProceed 
                ? "Proceed anyway? AI will show gaps based on synced data." 
                : "Waiting for the squad to reveal free time 🍑"}
            </Text>
          )}
          {room.sessionStatus === 'voting_slots' && (
            <Text style={styles.footerNote}>
              AI found {uploadedCount} free windows. Pick your favorites!
            </Text>
          )}
          {room.sessionStatus === 'confirmed' && (
            <Text style={[styles.footerNote, { color: colors.mintPunch, fontFamily: fonts.bodySemibold }]}>
              Plan confirmed! Check your device calendar. 📅
            </Text>
          )}
        </Animated.View>

        <TouchableOpacity 
          style={styles.leaveButton}
          onPress={() => router.replace('/(tabs)')}
          accessibilityLabel="Leave this room"
          accessibilityRole="button"
        >
          <Text style={styles.leaveButtonText}>Leave Room</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
