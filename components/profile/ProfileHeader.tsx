import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Avatar } from '@/components/Avatar';
import { colors } from '@/constants/theme';
import { styles } from '@/app/(tabs)/_profile.styles';

interface ProfileHeaderProps {
  name: string;
  email: string;
  onEdit: () => void;
}

export const ProfileHeader = ({ name, email, onEdit }: ProfileHeaderProps) => {
  return (
    <View style={styles.userCard}>
      <Avatar name={name} size={64} color={colors.peachPunch} />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{name}</Text>
        <Text style={styles.userEmail}>{email}</Text>
      </View>
      <Pressable 
        style={({ pressed }) => [styles.editProfileBtn, pressed && { opacity: 0.7 }]}
        onPress={onEdit}
      >
        <Text style={styles.editProfileText}>Edit</Text>
      </Pressable>
    </View>
  );
};