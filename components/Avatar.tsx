import React from 'react';
import { View, Image, Text, ViewStyle } from 'react-native';
import { colors, radius, fonts } from '@/constants/theme';

import { styles } from './Avatar.styles';

interface AvatarProps {
  uri?: string;
  name?: string;
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export function Avatar({ uri, name, size = 40, color, style }: AvatarProps) {
  const initials = name
    ? name
        .trim()
        .split(/\s+/)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '';

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        style,
      ]}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width: size, height: size, borderRadius: size / 2 }}
        />
      ) : (
        <View
          style={[
            styles.placeholder,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: color || colors.peachSoft,
            },
          ]}
        >
          <Text
            style={[
              styles.initials,
              {
                fontSize: size * 0.4,
              },
            ]}
          >
            {initials}
          </Text>
        </View>
      )}
    </View>
  );
}

