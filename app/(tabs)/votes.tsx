import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, fonts, spacing, radius } from '@/constants/theme';
import { Header } from '@/components/Header';
import { AvatarStack } from '@/components/AvatarStack';
import { 
  ListChecks, 
  Clock, 
  MagicWand, 
  CaretRight, 
  Sparkle,
  CaretDown,
  CaretUp,
  CheckCircle 
} from 'phosphor-react-native';
import Animated, { 
  FadeInUp, 
  FadeOutLeft,
  Layout, 
  FadeInDown
} from 'react-native-reanimated';
import { styles } from './_votes.styles';
import { VotesSkeleton } from '@/components/VotesSkeleton';
import { VotePills, VoteType } from '@/components/VotePills';

// Attempt to import haptics (optional for now)
let Haptics: any;
try {
  Haptics = require('expo-haptics');
} catch (e) {
  Haptics = null;
}

interface VoteOption {
  id: string;
  label: string;
}

interface PendingVote {
  id: string;
  roomId: string;
  roomName: string;
  type: 'time' | 'activity';
  members: { initial: string }[];
  deadline: string;
  options: VoteOption[];
}

const mockPendingVotes: PendingVote[] = [
  {
    id: 'v1',
    roomId: '1',
    roomName: 'Friday Gang',
    type: 'time',
    members: [{ initial: 'R' }, { initial: 'J' }, { initial: 'M' }],
    deadline: 'Closing in 2h',
    options: [
      { id: 't1', label: 'Fri 6:00 PM' },
      { id: 't2', label: 'Sat 4:30 PM' }
    ]
  },
  {
    id: 'v2',
    roomId: '2',
    roomName: 'Study Squad',
    type: 'activity',
    members: [{ initial: 'A' }, { initial: 'T' }],
    deadline: 'New activity suggested',
    options: []
  },
];

const TaskCard = ({ vote, onClear }: { vote: PendingVote; onClear: (id: string) => void }) => {
  const router = useRouter();
  const [voted, setVoted] = React.useState(false);

  const handleVote = (type: VoteType) => {
    if (Haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setVoted(true);
    setTimeout(() => onClear(vote.id), 800);
  };

  if (voted) {
    return (
      <Animated.View exiting={FadeOutLeft} style={styles.successCard}>
        <CheckCircle size={24} color={colors.mintPunch} weight="fill" />
        <Text style={styles.successText}>Vote Cast! Squad unblocked 🍑</Text>
      </Animated.View>
    );
  }

  const handleCardPress = () => {
    if (vote.type === 'time') {
      router.push(`/room/${vote.roomId}/vote-slots`);
    } else {
      router.push(`/room/${vote.roomId}/vote-activity`);
    }
  };

  return (
    <View style={[
      styles.voteCard,
      { borderColor: vote.type === 'time' ? colors.indigoSoft : colors.peachSoft }
    ]}>
      <TouchableOpacity 
        style={styles.cardMainAction}
        onPress={handleCardPress}
        activeOpacity={0.7}
      >
        <View style={styles.cardLeft}>
          <View style={[
            styles.iconCircle, 
            { 
              backgroundColor: vote.type === 'time' ? colors.indigoBase : colors.peachBase,
              borderColor: vote.type === 'time' ? colors.indigoSoft : colors.peachSoft
            }
          ]}>
            {vote.type === 'time' ? (
              <Clock size={24} color={colors.indigoPunch} weight="duotone" />
            ) : (
              <MagicWand size={24} color={colors.peachPunch} weight="duotone" />
            )}
          </View>
          <View style={styles.info}>
            <Text style={styles.voteType}>
              {vote.type === 'time' ? 'Pick a Time' : 'Suggest Activity'}
            </Text>
            <Text style={styles.roomName} numberOfLines={1}>{vote.roomName}</Text>
          </View>
        </View>
        
        <View style={styles.fullViewButton}>
          <CaretRight size={20} color={colors.textTertiary} weight="bold" />
        </View>
      </TouchableOpacity>

      <View style={styles.quickVoteContainer}>
        <View style={styles.quickVoteHeader}>
          <Sparkle size={14} color={colors.peachPunch} weight="fill" />
          <Text style={styles.quickVoteLabel}>QUICK VOTE</Text>
        </View>

        {vote.type === 'time' ? (
          <View style={styles.optionsList}>
            {vote.options.map(option => (
              <View key={option.id} style={styles.optionRow}>
                <Text style={styles.optionLabel}>{option.label}</Text>
                <VotePills onVote={handleVote} />
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.activityInputContainer}>
            <TextInput 
              style={styles.inlineInput}
              placeholder="Suggest something..."
              placeholderTextColor={colors.textTertiary}
              onSubmitEditing={() => handleVote('free')}
            />
            <TouchableOpacity 
              style={styles.inlineSubmit}
              onPress={() => handleVote('free')}
              accessibilityLabel="Submit activity"
              accessibilityRole="button"
            >
              <CaretRight size={20} color={colors.white} weight="bold" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default function VotesScreen() {
  const [loading, setLoading] = React.useState(true);
  const [tasks, setTasks] = React.useState(mockPendingVotes);

  React.useEffect(() => {
    // Simulate data fetch
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header 
        title="Action Center" 
        subtitle="Unblock your squad" 
        subtitlePosition="above"
      />
      
      {loading ? (
        <VotesSkeleton />
      ) : (
        <ScrollView 
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {tasks.length > 0 ? (
            <View style={styles.list}>
              <View style={styles.feedHeader}>
                <ListChecks size={16} color={colors.textTertiary} weight="bold" />
                <Text style={styles.feedTitle}>PENDING TASKS ({tasks.length})</Text>
              </View>

              {tasks.map((vote, index) => (
                <Animated.View 
                  key={vote.id}
                  entering={FadeInUp.delay(100 + index * 100)}
                  layout={Layout.springify()}
                >
                  <TaskCard vote={vote} onClear={(id) => setTasks(prev => prev.filter(t => t.id !== id))} />
                </Animated.View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <View style={[styles.iconCircle, { backgroundColor: colors.indigoBase, width: 80, height: 80, borderRadius: 40 }]}>
                <Sparkle size={40} color={colors.indigoPunch} weight="duotone" />
              </View>
              <Text style={styles.emptyTitle}>All caught up!</Text>
              <Text style={styles.emptySubtitle}>You've voted in all active sessions.</Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
