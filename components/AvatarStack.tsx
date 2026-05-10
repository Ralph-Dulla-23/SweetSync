import React from 'react';
import { View, Text, ViewStyle } from 'react-native';
import { Avatar } from './Avatar';
import { colors } from '@/constants/theme';
import { styles } from './AvatarStack.styles';

interface AvatarStackProps {
  avatars: { uri?: string; name?: string }[];
  size?: number;
  max?: number;
  overlap?: number;
  style?: ViewStyle;
}

export function AvatarStack({ avatars, size = 32, max = 4, overlap, style }: AvatarStackProps) {
  const visibleAvatars = avatars.slice(0, max);
  const remaining = avatars.length - max;
  const actualOverlap = overlap !== undefined ? overlap : size / 3;

  return (
    <View style={[styles.container, style]}>
      {visibleAvatars.map((avatar, index) => (
        <Avatar
          key={index}
          uri={avatar.uri}
          name={avatar.name}
          size={size}
          style={{
            borderWidth: 2,
            borderColor: colors.surface,
            marginLeft: index === 0 ? 0 : -actualOverlap,
            zIndex: max - index,
          } as any}
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
              marginLeft: -actualOverlap,
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

