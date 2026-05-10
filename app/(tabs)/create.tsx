import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView,
  TextInput,
  Share
} from 'react-native';
import { colors, fonts, spacing, radius } from "@/constants/theme";
import { 
  Plus, 
  Users, 
  CalendarPlus, 
  CaretRight, 
  Check,
  Copy,
  ShareNetwork,
  MagicWand
} from "phosphor-react-native";
import { useRouter } from "expo-router";
import { Header } from "@/components/Header";
import { Button } from "@/components/Button";
import Animated, { FadeInRight, FadeOutLeft, Layout } from 'react-native-reanimated';
import { styles } from './_create.styles';

type CreateStep = 'choice' | 'session_details' | 'room_details' | 'success';

export default function CreateScreen() {
  const router = useRouter();
  const [step, setStep] = useState<CreateStep>('choice');
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("SS-7291");

  const handleCreateSession = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('success');
    }, 1500);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join my squad on SweetSync! Use code: ${generatedCode} 🍑`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const renderChoice = () => (
    <Animated.View 
      entering={FadeInRight} 
      exiting={FadeOutLeft}
      style={styles.stepContainer}
    >
      <TouchableOpacity 
        style={[styles.heroCard, styles.mintCard]}
        activeOpacity={0.8}
        onPress={() => setStep('session_details')}
      >
        <View style={[styles.heroIconContainer, { backgroundColor: colors.mintSoft }]}>
          <CalendarPlus size={36} color={colors.mintPunch} weight="bold" />
        </View>
        <View style={styles.heroInfo}>
          <Text style={styles.heroTitle}>New Session</Text>
          <Text style={styles.heroDescription}>Coordinate a specific event or hangout</Text>
        </View>
      </TouchableOpacity>

      <Text style={styles.sectionLabel}>Groups & Spaces</Text>

      <View style={styles.secondaryActions}>
        <TouchableOpacity 
          style={[styles.optionCard, styles.indigoCard]}
          activeOpacity={0.7}
          onPress={() => setStep('room_details')}
        >
          <View style={[styles.iconContainer, { backgroundColor: colors.indigoSoft }]}>
            <Plus size={24} color={colors.indigoPunch} weight="bold" />
          </View>
          <View style={styles.optionInfo}>
            <Text style={styles.optionTitle}>New Room</Text>
            <Text style={styles.optionDescription}>Persistent space for squads</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.optionCard, styles.peachCard]}
          onPress={() => router.push("/join")}
          activeOpacity={0.7}
        >
          <View style={[styles.iconContainer, { backgroundColor: colors.peachSoft }]}>
            <Users size={24} color={colors.peachPunch} weight="bold" />
          </View>
          <View style={styles.optionInfo}>
            <Text style={styles.optionTitle}>Join a Room</Text>
            <Text style={styles.optionDescription}>Enter a group code</Text>
          </View>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderSessionDetails = () => (
    <Animated.View 
      entering={FadeInRight} 
      exiting={FadeOutLeft}
      style={styles.stepContainer}
    >
      <View style={styles.formHero}>
        <Text style={styles.formTitle}>What are we planning?</Text>
        <Text style={styles.formSubtitle}>Give your session a name that gets the squad excited.</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>SESSION NAME</Text>
          <TextInput 
            style={styles.textInput}
            placeholder="e.g. Friday Night Drinks, Beach Trip"
            placeholderTextColor={colors.textTertiary}
            value={name}
            onChangeText={setName}
            autoFocus
          />
        </View>

        <View style={styles.aiSuggestion}>
          <MagicWand size={18} color={colors.indigoPunch} weight="fill" />
          <Text style={styles.aiSuggestionText}>
            Tip: You can change the name later once the AI finds the perfect time.
          </Text>
        </View>

        <Button 
          title="Create & Get Invite Code" 
          variant="primary"
          onPress={handleCreateSession}
          disabled={!name.trim() || loading}
          loading={loading}
          style={styles.createButton}
        />
        
        <TouchableOpacity 
          onPress={() => setStep('choice')}
          style={styles.backLink}
        >
          <Text style={styles.backLinkText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderSuccess = () => (
    <Animated.View 
      entering={FadeInRight} 
      style={styles.stepContainer}
    >
      <View style={styles.successHeader}>
        <View style={styles.checkCircle}>
          <Check size={40} color={colors.white} weight="bold" />
        </View>
        <Text style={styles.successTitle}>Invite the Squad!</Text>
        <Text style={styles.successSubtitle}>Your session "{name}" is ready. Share this code to start syncing.</Text>
      </View>

      <View style={styles.codeCard}>
        <Text style={styles.codeLabel}>JOIN CODE</Text>
        <Text style={styles.codeValue}>{generatedCode}</Text>
        <TouchableOpacity style={styles.copyButton}>
          <Copy size={20} color={colors.peachPunch} />
          <Text style={styles.copyText}>Copy Code</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.successActions}>
        <Button 
          title="Share Invite Link" 
          variant="primary"
          onPress={handleShare}
          icon={<ShareNetwork size={22} color={colors.white} />}
          style={styles.finalButton}
        />
        <Button 
          title="Go to Room" 
          variant="secondary"
          onPress={() => router.push(`/room/1`)}
          style={styles.finalButton}
        />
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title={step === 'choice' ? "Create" : "New Session"} 
        subtitle={step === 'choice' ? "Start something fresh" : "Step 1 of 2"} 
        subtitlePosition="above" 
      />
      
      <ScrollView 
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {step === 'choice' && renderChoice()}
        {step === 'session_details' && renderSessionDetails()}
        {step === 'success' && renderSuccess()}
      </ScrollView>
    </SafeAreaView>
  );
}

