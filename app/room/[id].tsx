import React, { useMemo, useCallback } from "react";
import * as Linking from 'expo-linking';
import * as Clipboard from 'expo-clipboard';
import { 
  FlatList, 
  Share,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FadeOutUp } from "react-native-reanimated";
import Animated from "react-native-reanimated";
import { Header } from "@/components/Header";
import { RoomInteriorSkeleton } from "@/components/RoomInteriorSkeleton";
import { useRoom } from "@/hooks/useRoom";
import { useAuth } from "@/hooks/useAuth";
import { useSweetToast } from "@/hooks/useSweetToast";
import { styles } from "./_[id].styles";
import { MemberRow, RoomHeader, RoomFooter, CTAAction } from "./RoomComponents";

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

export default function RoomInterior() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { room, loading, updateStatus, startSimulation } = useRoom(id as string);
  const toast = useSweetToast();
  const isFirstRender = useIsFirstRender();

  const isHost = room?.hostId === user?.id;

  const handleCopyCode = useCallback(async () => {
    await Clipboard.setStringAsync(id as string);
    toast.show({
      type: 'success',
      text1: 'Code Copied! 📋',
      text2: 'Share it with the squad to join.'
    });
    if (Haptics) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [id, toast]);

  const handleInvite = useCallback(async () => {
    const url = Linking.createURL(`/join`, { queryParams: { code: id as string } });
    try {
      await Share.share({
        message: `Join my SweetSync room to coordinate! Code: ${id}\n${url}`,
      });
    } catch (error) {
      // Silent error
    }
  }, [id]);

  const handleNudge = useCallback((memberId: string) => {
    toast.show({
      type: 'success',
      text1: 'Nudge Sent! 🍑',
      text2: 'Reminded them to sync their schedule.'
    });
    if (Haptics) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [toast]);

  const handleProceed = useCallback(async () => {
    if (!isHost) return;

    if (room?.sessionStatus === 'collecting') {
      await updateStatus('processing');
      // In a real app, this would trigger a background task. 
      // For the demo, Room Interior will redirect based on status change.
      router.push(`/room/${id}/processing`);
    } else if (room?.sessionStatus === 'voting_slots') {
      router.push(`/room/${id}/vote-slots`);
    } else if (room?.sessionStatus === 'confirmed') {
      const eventId = room.upcomingEvents?.[0]?.id;
      if (eventId) router.push(`/confirmed/${eventId}`);
    }
  }, [id, room?.sessionStatus, router, updateStatus, room?.upcomingEvents, isHost]);

  const handleSimulate = useCallback(() => {
    startSimulation();
    if (Haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, [startSimulation]);

  const handleLeave = useCallback(() => {
    router.replace('/(tabs)');
  }, [router]);

  const uploadedCount = room?.members.filter(m => m.status === "uploaded").length || 0;
  const totalCount = room ? (room.expectedCount > 0 ? room.expectedCount : Math.max(room.members.length, 1)) : 1;
  const progress = Math.min((uploadedCount / totalCount) * 100, 100);
  
  const isReady = uploadedCount >= totalCount;
  const canProceed = uploadedCount >= 3 || (uploadedCount / totalCount >= 0.5);

  const cta: CTAAction = useMemo(() => {
    const defaultAction = () => handleProceed();
    if (!room) return { title: "Loading...", variant: "ghost", onPress: () => {}, disabled: true, label: "N/A" };
    
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
          disabled: false,
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
  }, [room, handleProceed, isReady, canProceed, isHost, id, router, toast]);

  if (loading || !room) {
    return <RoomInteriorSkeleton />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Animated.View 
        style={{ flex: 1 }}
        exiting={FadeOutUp.duration(400)}
      >
        <Header 
          title={room.name} 
          subtitle={room.description || "Coordinate with the squad"}
          showBack 
          backLabel="Rooms" 
          userAvatar
        />

        <FlatList
          data={room.members}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <MemberRow 
              member={item}
              index={index}
              isLast={index === room.members.length - 1}
              onNudge={handleNudge}
              isFirstRender={isFirstRender}
            />
          )}
          ListHeaderComponent={
            <RoomHeader 
              room={room}
              isHost={isHost}
              uploadedCount={uploadedCount}
              totalCount={totalCount}
              progress={progress}
              isReady={isReady}
              isFirstRender={isFirstRender}
              handleCopyCode={handleCopyCode}
              handleSimulate={handleSimulate}
              handleInvite={handleInvite}
              id={id}
              router={router}
            />
          }
          ListFooterComponent={
            <RoomFooter 
              cta={cta}
              isReady={isReady}
              room={room}
              uploadedCount={uploadedCount}
              canProceed={canProceed}
              isFirstRender={isFirstRender}
              handleLeave={handleLeave}
            />
          }
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
        />
      </Animated.View>
    </SafeAreaView>
  );
}
