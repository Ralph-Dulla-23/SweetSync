import React from 'react';
import { View } from 'react-native';
import { ScheduleSettings } from './ScheduleSettings';
import { NotificationSettings } from './NotificationSettings';
import { PrivacySettings } from './PrivacySettings';
import { AccountSettings } from './AccountSettings';

interface PreferencesFormProps {
  filesCount: number;
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
  profilePublic: boolean;
  heatMapOnly: boolean;
  onOpenFiles: () => void;
  onOpenPrivacy: (tab: 'profile' | 'schedule') => void;
  onSignOut: () => void;
  onDeleteAccount: () => void;
}

export const PreferencesForm = (props: PreferencesFormProps) => {
  return (
    <View>
      <ScheduleSettings 
        filesCount={props.filesCount} 
        onOpenFiles={props.onOpenFiles} 
      />
      
      <NotificationSettings 
        roomInvites={props.roomInvites}
        onSetRoomInvites={props.onSetRoomInvites}
        uploadReminders={props.uploadReminders}
        onSetUploadReminders={props.onSetUploadReminders}
        votingOpened={props.votingOpened}
        onSetVotingOpened={props.onSetVotingOpened}
        eventConfirmed={props.eventConfirmed}
        onSetEventConfirmed={props.onSetEventConfirmed}
        reminders={props.reminders}
        onSetReminders={props.onSetReminders}
      />

      <PrivacySettings 
        profilePublic={props.profilePublic}
        heatMapOnly={props.heatMapOnly}
        onOpenPrivacy={props.onOpenPrivacy}
      />

      <AccountSettings 
        onSignOut={props.onSignOut}
        onDeleteAccount={props.onDeleteAccount}
      />
    </View>
  );
};