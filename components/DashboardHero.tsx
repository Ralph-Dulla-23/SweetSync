import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, spacing } from '@/constants/theme';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

interface DashboardHeroProps {
  userName: string;
  roomCount: number;
  pendingVotes: number;
  nextEvent?: { title: string; time: string; room: string };
  onCreateRoom?: () => void;
}

export const DashboardHero = React.memo(({ 
  userName, 
  roomCount, 
  pendingVotes, 
  nextEvent,
  onCreateRoom 
}: DashboardHeroProps) => {
  const hasUrgentAction = pendingVotes > 0;
  const isEmptyState = roomCount === 0;

  // Variant & Color Logic
  const variant = isEmptyState ? "peach" : (hasUrgentAction ? "indigo" : "peach");
  const textColor = hasUrgentAction && !isEmptyState ? colors.white : colors.textPrimary;
  const labelColor = hasUrgentAction && !isEmptyState ? 'rgba(255,255,255,0.8)' : colors.textSecondary;

  return (
    <Card variant={variant} style={styles.container}>
      <View style={styles.content}>
        <Text style={[styles.greeting, { color: labelColor }]}>
          {isEmptyState ? "WELCOME TO SWEETSYNC" : `HEY, ${userName.toUpperCase()}`}
        </Text>
        
        <Text style={[styles.message, { color: textColor }]}>
          {isEmptyState 
            ? "Let's find some free time." 
            : (hasUrgentAction ? "Your squad is stalling! ⏳" : "Let's find some time to play. 🍑")
          }
        </Text>

        <Text style={[styles.subMessage, { color: labelColor }]}>
          {isEmptyState
            ? "Create your first room and invite friends to sync schedules."
            : (hasUrgentAction 
                ? `You have ${pendingVotes} rooms with open voting sessions.`
                : nextEvent 
                  ? `Next: ${nextEvent.title} at ${nextEvent.time}`
                  : "Sync your schedule to see overlaps.")
          }
        </Text>

        <Button 
          title={isEmptyState ? "Create First Room" : (hasUrgentAction ? "Go Vote" : "Sync Schedule")} 
          variant={hasUrgentAction && !isEmptyState ? "primary" : "indigo"}
          onPress={onCreateRoom || (() => {})}
          style={styles.cta}
        />
      </View>
    </Card>
  );
});


const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing[5],
    marginTop: spacing[2],
    marginBottom: spacing[4],
    padding: spacing[5],
  },
  content: {
    gap: spacing[1],
  },
  greeting: {
    fontFamily: fonts.bodySemibold,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  message: {
    fontFamily: fonts.display,
    fontSize: 24,
    lineHeight: 30,
    marginTop: spacing[1],
  },
  subMessage: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: spacing[2],
  },
  cta: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: spacing[2],
  }
});
