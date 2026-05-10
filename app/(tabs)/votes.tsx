import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors, fonts, spacing, radius } from '@/constants/theme';
import { Header } from '@/components/Header';
import { Card } from '@/components/Card';
import { AvatarStack } from '@/components/AvatarStack';
import { ListChecks, Clock, MagicWand, CaretRight } from 'phosphor-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { styles } from './votes.styles';

interface PendingVote {
  id: string;
  roomId: string;
  roomName: string;
  type: 'time' | 'activity';
  members: { initial: string }[];
  deadline: string;
}

const mockPendingVotes: PendingVote[] = [
  {
    id: 'v1',
    roomId: '1',
    roomName: 'Friday Gang',
    type: 'time',
    members: [{ initial: 'R' }, { initial: 'J' }, { initial: 'M' }],
    deadline: 'Closing in 2h',
  },
  {
    id: 'v2',
    roomId: '2',
    roomName: 'Study Squad',
    type: 'activity',
    members: [{ initial: 'A' }, { initial: 'T' }],
    deadline: 'New activity suggested',
  },
];

export default function VotesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Votes" 
        subtitle="Your squad is waiting" 
        subtitlePosition="above"
      />
      
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {mockPendingVotes.length > 0 ? (
          <View style={styles.list}>
            {mockPendingVotes.map((vote, index) => (
              <Animated.View 
                key={vote.id}
                entering={FadeInUp.delay(100 + index * 100)}
              >
                <TouchableOpacity 
                  activeOpacity={0.8}
                  onPress={() => router.push(`/room/${vote.roomId}/vote-${vote.type === 'time' ? 'slots' : 'activity'}`)}
                >
                  <Card variant="peach" style={styles.voteCard}>
                    <View style={styles.cardLeft}>
                      <View style={[
                        styles.iconCircle, 
                        { backgroundColor: vote.type === 'time' ? colors.indigoBase : colors.peachBase }
                      ]}>
                        {vote.type === 'time' ? (
                          <Clock size={20} color={colors.indigoPunch} weight="fill" />
                        ) : (
                          <MagicWand size={20} color={colors.peachPunch} weight="fill" />
                        )}
                      </View>
                      <View style={styles.info}>
                        <Text style={styles.roomName}>{vote.roomName}</Text>
                        <Text style={styles.voteType}>
                          Vote on {vote.type === 'time' ? 'Time Slots' : 'Activities'}
                        </Text>
                        <Text style={styles.deadline}>{vote.deadline}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.cardRight}>
                      <AvatarStack avatars={vote.members.map(m => ({ name: m.initial }))} size={20} />
                      <CaretRight size={18} color={colors.textTertiary} />
                    </View>
                  </Card>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <ListChecks size={64} color={colors.borderDefault} weight="thin" />
            <Text style={styles.emptyTitle}>All caught up!</Text>
            <Text style={styles.emptySubtitle}>You've voted in all active sessions.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

