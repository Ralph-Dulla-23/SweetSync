import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Avatar } from './Avatar';
import { colors, fonts, radius } from '@/constants/theme';

interface AvatarStackProps {
  avatars: { uri?: string; name?: string }[];
  size?: number;
  max?: number;
}

export function AvatarStack({ avatars, size = 32, max = 4 }: AvatarStackProps) {
  const visibleAvatars = avatars.slice(0, max);
  const remaining = avatars.length - max;

  return (
    <View style={styles.container}>
      {visibleAvatars.map((avatar, index) => (
        <Avatar
          key={index}
          uri={avatar.uri}
          name={avatar.name}
          size={size}
          style={[
            styles.avatar,
            {
              marginLeft: index === 0 ? 0 : -size / 3,
              zIndex: max - index,
            },
          ]}
        />
      ))}
      {remaining > 0 && (
        <View
          style={[
            styles.more,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              marginLeft: -size / 3,
              zIndex: 0,
            },
          ]}
        >
          <Text style={[styles.moreText, { fontSize: size * 0.4 }]}>
            +{remaining}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    borderWidth: 2,
    borderColor: colors.surface,
  },
  more: {
    backgroundColor: colors.indigoBase,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  moreText: {
    fontFamily: fonts.bodySemibold,
    color: colors.indigoPunch,
  },
});
