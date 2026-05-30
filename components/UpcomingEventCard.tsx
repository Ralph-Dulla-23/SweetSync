import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, fonts, spacing, radius } from '@/constants/theme';
import { Card } from './Card';
import { Calendar, MapPin, Users, Clock } from 'phosphor-react-native';
import { Event, Member } from '@/types';
import { slotIndexToTime } from '@/lib/time';
import { AvatarStack } from './AvatarStack';

interface UpcomingEventCardProps {
  event: Event;
  members: Member[];
  onPress?: () => void;
}

export const UpcomingEventCard: React.FC<UpcomingEventCardProps> = ({ event, members, onPress }) => {
  const eventMembers = members.filter(m => event.members.includes(m.id));
  const startTime = slotIndexToTime(event.startSlot);
  const endTime = slotIndexToTime(event.endSlot);

  // Format date: "Fri, May 15"
  const dateObj = new Date(event.date);
  const formattedDate = dateObj.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });

  return (
    <Card variant="mint" style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.categoryLabel}>{event.category?.toUpperCase() || 'EVENT'}</Text>
          <Text style={styles.title}>{event.title}</Text>
        </View>
        <View style={styles.dateBadge}>
          <Text style={styles.dateDay}>{formattedDate.split(',')[1].trim().split(' ')[1]}</Text>
          <Text style={styles.dateMonth}>{formattedDate.split(',')[1].trim().split(' ')[0]}</Text>
        </View>
      </View>

      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Clock size={16} color={colors.mintPunch} weight="bold" />
          <Text style={styles.detailText}>{startTime} - {endTime}</Text>
        </View>
        {event.location && (
          <View style={[styles.detailItem, { marginLeft: spacing[4] }]}>
            <MapPin size={16} color={colors.mintPunch} weight="bold" />
            <Text style={styles.detailText} numberOfLines={1}>{event.location}</Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <AvatarStack 
          avatars={eventMembers.map(m => ({ name: m.name, uri: m.avatarUri }))}
          size={28}
          max={4}
        />
        <Text style={styles.memberCount}>
          {eventMembers.length} {eventMembers.length === 1 ? 'is' : 'are'} going
        </Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing[3],
    padding: spacing[5],
    borderWidth: 1,
    borderColor: colors.mintSoft,
  },  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[3],
  },
  titleContainer: {
    flex: 1,
  },
  categoryLabel: {
    fontFamily: fonts.bodySemibold,
    fontSize: 10,
    color: colors.mintPunch,
    letterSpacing: 1,
    marginBottom: 2,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 20,
    color: colors.textPrimary,
  },
  dateBadge: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.mintSoft,
    minWidth: 45,
  },
  dateDay: {
    fontFamily: fonts.display,
    fontSize: 16,
    color: colors.mintPunch,
  },
  dateMonth: {
    fontFamily: fonts.bodySemibold,
    fontSize: 9,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  detailText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 13,
    color: colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing[3],
    borderTopWidth: 0.5,
    borderTopColor: colors.mintSoft,
  },
  memberCount: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textSecondary,
  },
});
