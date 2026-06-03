import React from 'react';
import { View, Text, Switch, Platform, Pressable } from 'react-native';
import { colors } from '@/constants/theme';
import { styles } from '@/app/(tabs)/_profile.styles';

interface NotificationSettingsProps {
  roomInvites: boolean;
  onSetRoomInvites: (val: boolean) => void;
  uploadReminders: boolean;
  onSetUploadReminders: (val: boolean) => void;
  votingOpened: boolean;
  onSetVotingOpened: (val: boolean) => void;
  eventConfirmed: boolean;
  onSetEventConfirmed: (val: boolean) => void;
  reminders: boolean;
  onSetReminders: (val: boolean) => void;
}

export const NotificationSettings = ({
  roomInvites,
  onSetRoomInvites,
  uploadReminders,
  onSetUploadReminders,
  votingOpened,
  onSetVotingOpened,
  eventConfirmed,
  onSetEventConfirmed,
  reminders,
  onSetReminders,
}: NotificationSettingsProps) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>Notifications</Text>
      <View style={styles.sectionCard}>
        {[
          { label: 'Room invites', value: roomInvites, setter: onSetRoomInvites },
          { label: 'Upload reminders', value: uploadReminders, setter: onSetUploadReminders },
          { label: 'Voting opened', value: votingOpened, setter: onSetVotingOpened },
          { label: 'Event confirmed', value: eventConfirmed, setter: onSetEventConfirmed },
        ].map((item, idx) => (
          <React.Fragment key={item.label}>
            <View style={styles.row}>
              <Text style={styles.rowText}>{item.label}</Text>
              <Switch 
                value={item.value} 
                onValueChange={item.setter}
                trackColor={{ false: colors.borderDefault, true: colors.mintSoft }}
                thumbColor={Platform.OS === 'ios' ? undefined : colors.white}
              />
            </View>
            {idx < 3 && <View style={styles.rowDivider} />}
          </React.Fragment>
        ))}
        <View style={styles.rowDivider} />
        <Pressable style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}>
          <View><Text style={styles.rowText}>Time Reminders</Text><Text style={[styles.userEmail, { fontSize: 12 }]}>Day/Hour before event</Text></View>
          <Switch 
            value={reminders} 
            onValueChange={onSetReminders}
            trackColor={{ false: colors.borderDefault, true: colors.mintSoft }}
            thumbColor={Platform.OS === 'ios' ? undefined : colors.white}
          />
        </Pressable>
      </View>
    </View>
  );
};
