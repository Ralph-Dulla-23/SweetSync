import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { colors } from '@/constants/theme';
import { SignOut } from 'phosphor-react-native';
import { styles } from '@/app/(tabs)/_profile.styles';

interface AccountSettingsProps {
  onSignOut: () => void;
  onDeleteAccount: () => void;
}

export const AccountSettings = ({ onSignOut, onDeleteAccount }: AccountSettingsProps) => {
  return (
    <>
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Account</Text>
        <View style={styles.sectionCard}>
          <Pressable style={({ pressed }) => [styles.row, pressed && { opacity: 0.6 }]} onPress={onSignOut}>
            <View style={styles.rowLeft}><SignOut size={22} color={colors.textTertiary} weight="bold" /><Text style={styles.rowText}>Sign out</Text></View>
          </Pressable>
        </View>
      </View>

      <View style={styles.dangerZone}>
        <Text style={styles.dangerZoneLabel}>Danger Zone</Text>
        <View style={styles.dangerZoneCard}>
          <Pressable style={({ pressed }) => [styles.row, pressed && { opacity: 0.6 }]} onPress={onDeleteAccount}>
            <Text style={styles.dangerZoneText}>Delete Account</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
};
