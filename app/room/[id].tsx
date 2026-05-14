import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CheckCircle, Bell, UsersThree, CaretRight } from "phosphor-react-native";
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
import { useRoom } from "@/hooks/useRoom";
import { useAuth } from "@/hooks/useAuth";
import { styles } from "./_[id].styles";

// Optional Haptics
let Haptics: any;
try {
  Haptics = require('expo-haptics');
} catch (e) {
  Haptics = null;
}

const localStyles = StyleSheet.create({
  heatmapButton: {
    backgroundColor: colors.white,
    marginHorizontal: spacing[4],
    marginBottom: spacing[4],
    borderRadius: radius.lg,
    padding: spacing[3],
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
    gap: spacing[3],
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
});

const NudgeAllBanner = ({ pendingCount, onNudgeAll }: { pendingCount: number; onNudgeAll: () => void }) => {
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
      entering={FadeInDown.duration(600)}
      style={styles.nudgeAllBanner}
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

const MemberRow = React.memo(({ member, index, isLast, onNudge }: { member: any; index: number; isLast: boolean; onNudge: (id: string) => void }) => {
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
  };

  return (
    <Animated.View 
      entering={FadeInUp.duration(600).delay(200 + index * 50).springify().damping(18)}
    >
      <View 
        style={[
          styles.memberRow, 
          isLast && styles.noBorder
        ]}
      >
        <View style={styles.memberLeft}>
          <Avatar 
            name={member.name} 
            uri={member.avatarUri}
            size={44} 
            color={member.status === "uploaded" ? colors.peachPunch : colors.textTertiary} 
          />
          <View style={styles.memberInfo}>
            <Text style={styles.memberName}>{member.name}</Text>
            <View style={styles.statusRow}>
              {member.isHost && <Text style={styles.hostTag}>Host</Text>}
              <Text style={[
                styles.memberStatus,
                member.status === "pending" && styles.pendingText
              ]}>
                {member.status === "uploaded" ? "Synced" : nudged ? "Nudged (on cooldown)" : "Waiting for upload"}
              </Text>
            </View>
          </View>
        </View>
        
        {member.status === "uploaded" ? (
          <View style={styles.statusIndicator}>
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
  const { room, loading, nudgeMember } = useRoom(id as string);

  const handleNudge = React.useCallback((memberId: string) => {
    nudgeMember(memberId);
  }, [nudgeMember]);

  const handleNudgeAll = React.useCallback(() => {
    room?.members.filter(m => m.status === 'pending').forEach(m => nudgeMember(m.id));
  }, [room, nudgeMember]);

  if (loading || !room) {
    return <RoomInteriorSkeleton />;
  }

  const isHost = room.hostId === user?.id;
  const pendingMembers = room.members.filter(m => m.status === "pending");
  const uploadedCount = room.members.length - pendingMembers.length;
  const totalCount = room.members.length;
  const progress = (uploadedCount / totalCount) * 100;
  const isReady = uploadedCount === totalCount;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header 
        title={room.name} 
        subtitle={room.description || "Coordinate with the squad"}
        showBack 
        backLabel="Rooms" 
      />

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Section - Deeply Branded */}
        <Card 
          variant={isReady ? 'mint' : 'peach'} 
          style={styles.progressSection}
        >
          <View style={styles.progressHeader}>
            <View style={styles.progressValueContainer}>
              <Text style={[styles.progressMainValue, { color: isReady ? colors.mintPunch : colors.peachPunch }]}>
                {uploadedCount}
              </Text>
              <Text style={styles.progressTotalValue}>/{totalCount}</Text>
            </View>
            <View style={styles.progressInfo}>
              <Text style={styles.progressTitle}>Syncing Souls</Text>
              <Text style={styles.progressSubtitle}>
                {isReady ? "The squad is fully synced" : `${totalCount - uploadedCount} friends to go`}
              </Text>
            </View>
          </View>
          <ProgressBar 
            progress={progress} 
            color={isReady ? colors.mintPunch : colors.peachPunch} 
            height={10} 
          />
        </Card>

        {isHost && pendingMembers.length > 1 && (
          <NudgeAllBanner 
            pendingCount={pendingMembers.length} 
            onNudgeAll={handleNudgeAll} 
          />
        )}

        {/* Member List - Social and Responsive */}
        <View style={styles.sectionHeader}>
          <UsersThree size={16} color={colors.textTertiary} weight="bold" />
          <Text style={styles.sectionTitle}>The Squad</Text>
        </View>

        <TouchableOpacity 
          style={localStyles.heatmapButton}
          onPress={() => router.push(`/room/${id}/calendar`)}
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
            />
          ))}
        </View>


        {/* Action Area */}
        <Animated.View entering={FadeInUp.duration(600).delay(800)} style={styles.footer}>
          <Button 
            title="Reveal the Magic" 
            variant={isReady ? "indigo" : "ghost"}
            disabled={!isReady}
            onPress={() => router.push(`/room/${id}/processing`)}
            style={styles.mainButton}
          />
          {!isReady && (
            <Text style={styles.footerNote}>
              Waiting for the squad to reveal free time 🍑
            </Text>
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
