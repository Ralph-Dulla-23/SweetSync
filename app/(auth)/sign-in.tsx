import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CaretLeft, Envelope, Lock, Sparkle } from 'phosphor-react-native';
import { colors, fonts, spacing, radius } from '@/constants/theme';
import { Button } from '@/components/Button';
import { GoogleIcon } from '@/components/GoogleIcon';
import { supabase } from '@/lib/supabase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/useAuth';
import Animated, { 
  FadeIn, 
  FadeInDown, 
  Layout, 
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { styles } from './_sign-in.styles';

const SPRING_CONFIG = { 
  damping: 25, 
  stiffness: 200, 
  mass: 1,
  overshootClamping: true
};

export default function SignIn() {
  const router = useRouter();
  const { mode } = useLocalSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(mode === 'signup');
  const [step, setStep] = useState<'email' | 'password'>('email');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsSignUp(mode === 'signup');
    setStep('email');
    setError(null);
  }, [mode]);

  const { signInDemo } = useAuth();

  const handleGoogleSignIn = () => {
    console.warn('Google Sign In is in Demo Mode.');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      signInDemo();
      router.replace('/(tabs)');
    }, 1000);
  };

  const handleDemoSignIn = () => {
    setLoading(true);
    // Move immediately to dashboard, where the skeleton will handle the perceived load
    signInDemo();
    router.replace('/(tabs)');
  };

  const handleNextStep = () => {
    setError(null);
    if (!email) {
      setError('Please enter your email');
      return;
    }
    // Simple email regex
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    setStep('password');
  };

  const handleAuth = async () => {
    setError(null);
    const isSupabaseConfigured = !!process.env.EXPO_PUBLIC_SUPABASE_URL && !!process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

    if (!isSupabaseConfigured) {
      console.warn('Running in Demo Mode. Bypassing real authentication.');
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        signInDemo();
        router.replace('/(tabs)');
      }, 1000);
      return;
    }

    if (!password) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        Alert.alert('Success', 'Check your email for the confirmation link!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
    setError(null);
    const isSupabaseConfigured = !!process.env.EXPO_PUBLIC_SUPABASE_URL && !!process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!isSupabaseConfigured) {
      setError('Magic links are disabled in demo mode.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: 'sweetsync://(tabs)',
        },
      });
      if (error) throw error;
      Alert.alert('Success', 'Check your email for the magic link!');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderHeader = () => {
    const isStepEmail = step === 'email';
    
    return (
      <View style={styles.header}>
        <View style={[
          styles.logoContainer, 
          !isStepEmail && { borderColor: colors.indigoSoft, backgroundColor: colors.indigoBase }
        ]}>
          <Sparkle 
            size={32} 
            weight="fill" 
            color={isStepEmail ? colors.peachPunch : colors.indigoPunch} 
          />
        </View>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{isStepEmail ? (isSignUp ? 'Create' : 'Welcome') : 'Enter'}</Text>
          <Text style={[
            styles.titleAccent, 
            !isStepEmail && { color: colors.indigoPunch }
          ]}>
            {isStepEmail ? (isSignUp ? ' Account' : ' Back') : ' Password'}
          </Text>
        </View>
        <Text style={styles.subtitle}>
          {isStepEmail 
            ? (isSignUp ? 'Join SweetSync and start planning together.' : 'Sign in to sync with your group.')
            : `Continuing as ${email}`}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <Animated.ScrollView 
          entering={FadeInDown.duration(800).damping(20)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View>
            <TouchableOpacity 
              onPress={() => step === 'password' ? setStep('email') : router.back()}
              style={styles.backButton}
            >
              <CaretLeft size={20} weight="bold" color={step === 'password' ? colors.indigoPunch : colors.peachPunch} />
            </TouchableOpacity>
          </View>

          <Animated.View layout={Layout.springify().damping(25).stiffness(200)}>
            {renderHeader()}

            <View style={styles.form}>
              {error && (
                <Animated.View 
                  entering={FadeInDown.duration(400)}
                  style={styles.errorContainer}
                >
                  <Text style={styles.errorText}>{error}</Text>
                </Animated.View>
              )}

              {step === 'email' ? (
                <View key="email-step" style={{ gap: spacing[4] }}>
                  <View style={[styles.inputContainer, error && styles.inputError]}>
                    <Envelope size={20} color={colors.textTertiary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Email"
                      placeholderTextColor={colors.textTertiary}
                      value={email}
                      onChangeText={(text) => {
                        setEmail(text);
                        setError(null);
                      }}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      autoFocus={true}
                    />
                  </View>

                  <Button
                    title="Continue"
                    onPress={handleNextStep}
                    style={styles.authButton}
                  />

                  <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>or</Text>
                    <View style={styles.dividerLine} />
                  </View>

                  <Button
                    title="Google"
                    onPress={handleGoogleSignIn}
                    variant="secondary"
                    icon={<GoogleIcon size={20} />}
                    style={styles.googleButton}
                    textStyle={styles.googleButtonText}
                  />
                </View>
              ) : (
                <View key="password-step" style={{ gap: spacing[4] }}>
                  <View style={[styles.inputContainer, error && styles.inputError, { borderColor: colors.indigoSoft, backgroundColor: colors.indigoBase }]}>
                    <Lock size={20} color={colors.textTertiary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Password"
                      placeholderTextColor={colors.textTertiary}
                      value={password}
                      onChangeText={(text) => {
                        setPassword(text);
                        setError(null);
                      }}
                      secureTextEntry
                      autoFocus={true}
                    />
                  </View>

                  <Button
                    title={loading ? '' : (isSignUp ? 'Sign Up' : 'Sign In')}
                    variant={isSignUp ? 'primary' : 'indigo'}
                    onPress={handleAuth}
                    disabled={loading}
                    style={styles.authButton}
                  >
                    {loading && <ActivityIndicator color="#FFFFFF" />}
                  </Button>

                  {!isSignUp && (
                    <TouchableOpacity 
                      onPress={handleMagicLink}
                      style={styles.magicLinkContainer}
                      disabled={loading}
                    >
                      <Text style={styles.magicLinkText}>
                        Forgot password? <Text style={styles.magicLinkAction}>Send Magic Link</Text>
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}

              <View style={styles.toggleContainer}>
                <TouchableOpacity 
                  onPress={() => {
                    setIsSignUp(!isSignUp);
                    setStep('email');
                    setError(null);
                  }}
                  style={{ marginBottom: spacing[4], alignItems: 'center' }}
                >
                  <Text style={styles.toggleText}>
                    {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                    <Text style={[styles.toggleAction, !isSignUp && { color: colors.indigoPunch }]}>
                      {isSignUp ? 'Sign In' : 'Sign Up'}
                    </Text>
                  </Text>
                </TouchableOpacity>

                <Button
                  title="Continue with Demo Account"
                  onPress={handleDemoSignIn}
                  variant="ghost"
                  style={styles.demoButton}
                  textStyle={styles.demoButtonText}
                />
              </View>
            </View>
          </Animated.View>
        </Animated.ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

