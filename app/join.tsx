import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TextInput, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors, fonts, spacing, radius } from '@/constants/theme';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';

export default function JoinRoomScreen() {
  const [code, setCode] = useState('');
  const router = useRouter();

  const handleJoin = () => {
    // Logic to join room would go here
    if (code.length === 6) {
      router.push('/(tabs)');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Join a Room" 
        showBack 
        backLabel="Create" 
      />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.form}>
          <Text style={styles.label}>Enter Room Code</Text>
          <Text style={styles.description}>
            Ask the room host for the 6-digit invite code.
          </Text>
          
          <TextInput
            style={styles.input}
            placeholder="X X X X X X"
            placeholderTextColor={colors.textTertiary}
            value={code}
            onChangeText={setCode}
            autoCapitalize="characters"
            maxLength={6}
            autoFocus
          />

          <Button 
            title="Join Room" 
            onPress={handleJoin}
            disabled={code.length < 6}
            style={code.length < 6 ? styles.disabledButton : undefined}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.pageBg,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing[5],
    paddingTop: spacing[8],
  },
  form: {
    gap: spacing[2],
  },
  label: {
    fontFamily: fonts.bodySemibold,
    fontSize: 16,
    color: colors.textPrimary,
  },
  description: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing[4],
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radius.md,
    padding: spacing[4],
    fontSize: 24,
    fontFamily: fonts.display,
    textAlign: 'center',
    letterSpacing: 4,
    color: colors.indigoPunch,
    marginBottom: spacing[4],
  },
  disabledButton: {
    opacity: 0.5,
  },
});
