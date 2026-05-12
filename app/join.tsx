import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors, fonts, spacing, radius } from '@/constants/theme';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { Users, CaretRight, ShieldCheck } from 'phosphor-react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { styles } from './_join.styles';

export default function JoinRoomScreen() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJoin = () => {
    if (code.length < 7) {
      setError("Please enter a valid code (e.g. SS-1234)");
      return;
    }
    setError(null);
    setLoading(true);
    
    // Simulate finding room
    setTimeout(() => {
      setLoading(false);
      // Link to a mock room
      router.replace(`/room/1`);
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Join a Squad" 
        showBack 
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <Animated.View entering={FadeInDown.duration(600)}>
            <View style={styles.hero}>
              <View style={styles.iconCircle}>
                <Users size={32} color={colors.peachPunch} weight="duotone" />
              </View>
              <Text style={styles.heroTitle}>Enter Group Code</Text>
              <Text style={styles.heroSubtitle}>
                Your squad leader should have shared a code like "SS-1234" with you.
              </Text>
            </View>
          </Animated.View>

          <View style={styles.form}>
            <View style={[styles.inputContainer, error && styles.inputError]}>
              <TextInput
                style={styles.input}
                placeholder="SS-0000"
                placeholderTextColor={colors.textTertiary}
                value={code}
                onChangeText={(text) => {
                  let formatted = text.toUpperCase();
                  if (formatted.length === 2 && !formatted.includes('-') && code.length < text.length) {
                    formatted = formatted + '-';
                  }
                  setCode(formatted);
                  setError(null);
                }}
                maxLength={7}
                autoFocus
                keyboardType="default"
                autoCapitalize="characters"
              />
            </View>

            {error && (
              <Animated.View entering={FadeIn}>
                <Text style={styles.errorText}>{error}</Text>
              </Animated.View>
            )}

            <Button 
              title="Find my Squad" 
              variant="primary"
              onPress={handleJoin}
              loading={loading}
              disabled={code.length < 4 || loading}
              style={styles.joinButton}
            />
          </View>

          <View style={styles.privacyNote}>
            <ShieldCheck size={16} color={colors.textTertiary} />
            <Text style={styles.privacyText}>
              Codes keep your group's schedule private to the squad.
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

