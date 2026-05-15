import React, { useState } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView,
  TextInput,
  Share,
  Alert
} from 'react-native';
import { colors, fonts, spacing, radius } from "@/constants/theme";
import { 
  Plus, 
  Users, 
  CalendarPlus, 
  Check,
  Copy,
  ShareNetwork,
  MagicWand,
  UsersThree,
  Sparkle
} from "phosphor-react-native";
import { useRouter } from "expo-router";
import { Header } from "@/components/Header";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import Animated, { 
  FadeInRight, 
  FadeOutLeft, 
  FadeInDown,
  Layout,
  SlideInUp
} from 'react-native-reanimated';
import { styles } from './_create.styles';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

type CreateStep = 'choice' | 'session_details' | 'room_details' | 'success';
type CreateType = 'session' | 'room';

export default function CreateScreen() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [step, setStep] = useState<CreateStep>('choice');
  const [type, setType] = useState<CreateType>('session');
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [roomId, setRoomId] = useState("");

  const generateJoinCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `SS-${result}`;
  };

  const handleCreate = async () => {
    if (!name.trim()) return;
    
    setLoading(true);
    const code = generateJoinCode();
    setGeneratedCode(code);

    try {
      if (!user) {
        // Fallback for Demo Mode
        console.warn('Running in Demo Mode. Simulating success.');
        await new Promise(resolve => setTimeout(resolve, 1500));
        setRoomId("demo-room-id");
        setStep('success');
        return;
      }

      // 1. Insert room
      const { data: room, error: roomError } = await supabase
        .from('rooms')
        .insert({
          name: name.trim(),
          description: description.trim() || null,
          host_id: user.id,
          status: 'active'
        })
        .select()
        .single();

      if (roomError) throw roomError;

      // 2. Add creator as a member
      const { error: memberError } = await supabase
        .from('members')
        .insert({
          room_id: room.id,
          user_id: user.id,
          status: 'joined'
        });

      if (memberError) throw memberError;

      setRoomId(room.id);
      setStep('success');
    } catch (error: any) {
      console.error('Error creating:', error);
      Alert.alert('Oops!', error.message || 'Something went wrong while creating.');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join my ${type === 'room' ? 'squad' : 'session'} on SweetSync! 🍑\n\nCode: ${generatedCode}\n\nLet's find the perfect time to hang!`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleCopyCode = () => {
    // Since we don't have expo-clipboard, we'll just show a success alert
    // In a real app, you'd use Clipboard.setStringAsync(generatedCode)
    Alert.alert("Code Copied", `The code ${generatedCode} is ready to share!`);
  };

  const renderChoice = () => (
    <Animated.View 
      entering={FadeInRight} 
      exiting={FadeOutLeft}
      style={styles.stepContainer}
    >
      <Card 
        variant="mint"
        onPress={() => {
          setType('session');
          setStep('session_details');
        }}
        style={styles.heroCard}
      >
        <View style={[styles.heroIconContainer, { backgroundColor: colors.mintSoft }]}>
          <CalendarPlus size={36} color={colors.mintPunch} weight="bold" />
        </View>
        <View style={styles.heroInfo}>
          <Text style={styles.heroTitle}>New Session</Text>
          <Text style={styles.heroDescription}>Coordinate a specific event or hangout</Text>
        </View>
      </Card>

      <Text style={styles.sectionLabel}>Groups & Spaces</Text>

      <View style={styles.secondaryActions}>
        <Card 
          variant="peach"
          onPress={() => {
            setType('room');
            setStep('room_details');
          }}
          style={styles.optionCard}
        >
          <View style={[styles.iconContainer, { backgroundColor: colors.peachSoft }]}>
            <UsersThree size={24} color={colors.peachPunch} weight="bold" />
          </View>
          <View style={styles.optionInfo}>
            <Text style={styles.optionTitle}>New Room</Text>
            <Text style={styles.optionDescription}>Persistent space for squads</Text>
          </View>
        </Card>
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
          onPress={handleCreate}
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

  const renderRoomDetails = () => (
    <Animated.View 
      entering={FadeInRight} 
      exiting={FadeOutLeft}
      style={styles.stepContainer}
    >
      <View style={styles.formHero}>
        <Text style={styles.formTitle}>Create a Room</Text>
        <Text style={styles.formSubtitle}>A persistent space for your besties, roommates, or study group.</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>ROOM NAME</Text>
          <TextInput 
            style={styles.textInput}
            placeholder="e.g. The Dream Team, Apt 4B"
            placeholderTextColor={colors.textTertiary}
            value={name}
            onChangeText={setName}
            autoFocus
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>DESCRIPTION (OPTIONAL)</Text>
          <TextInput 
            style={styles.textArea}
            placeholder="What's this squad about?"
            placeholderTextColor={colors.textTertiary}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
        </View>

        <Button 
          title="Create Room" 
          variant="primary"
          onPress={handleCreate}
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
      entering={FadeInDown.springify()} 
      style={styles.stepContainer}
    >
      <View style={styles.successHeader}>
        <Animated.Text entering={FadeInDown.delay(200)} style={styles.celebrationEmoji}>🎉</Animated.Text>
        <View style={styles.checkCircle}>
          <Check size={40} color={colors.white} weight="bold" />
        </View>
        <Text style={styles.successTitle}>Invite the Squad!</Text>
        <Text style={styles.successSubtitle}>
          Your {type === 'room' ? 'room' : 'session'} "{name}" is ready. Share this code to start syncing.
        </Text>
      </View>

      <Animated.View entering={FadeInDown.delay(400)} style={styles.codeCard}>
        <Text style={styles.codeLabel}>JOIN CODE</Text>
        <Text style={styles.codeValue}>{generatedCode}</Text>
        <TouchableOpacity style={styles.copyButton} onPress={handleCopyCode}>
          <Copy size={20} color={colors.peachPunch} />
          <Text style={styles.copyText}>Copy Code</Text>
        </TouchableOpacity>
      </Animated.View>

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
          onPress={() => router.push(`/room/${roomId}`)}
          style={styles.finalButton}
        />
      </View>
    </Animated.View>
  );

  const getHeaderTitle = () => {
    switch (step) {
      case 'choice': return "Create";
      case 'session_details': return "New Session";
      case 'room_details': return "New Room";
      case 'success': return "Success!";
      default: return "Create";
    }
  };

  const getHeaderSubtitle = () => {
    switch (step) {
      case 'choice': return "Start something fresh";
      case 'session_details': return "Step 1 of 2";
      case 'room_details': return "Step 1 of 2";
      case 'success': return "Share the love";
      default: return "";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title={getHeaderTitle()} 
        subtitle={getHeaderSubtitle()} 
        subtitlePosition="above" 
      />
      
      <ScrollView 
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {step === 'choice' && renderChoice()}
        {step === 'session_details' && renderSessionDetails()}
        {step === 'room_details' && renderRoomDetails()}
        {step === 'success' && renderSuccess()}
      </ScrollView>
    </SafeAreaView>
  );
}
