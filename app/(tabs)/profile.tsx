import React, { useState } from 'react';
import { 
  Pressable, 
  ScrollView,
  Alert,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/theme';
import { 
  ShareNetwork,
  Camera,
} from 'phosphor-react-native';
import { Header } from '@/components/Header';
import { styles } from './_profile.styles';
import { ProfileSkeleton } from '@/components/ProfileSkeleton';

// Sub-components
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { PreferencesForm } from '@/components/profile/PreferencesForm';
import { FileList } from '@/components/profile/FileList';
import { SupportView } from '@/components/profile/SupportView';
import { PrivacyPolicyView } from '@/components/profile/PrivacyPolicyView';
import { PrivacyModal } from '@/components/profile/PrivacyModal';

interface UploadedFile {
  id: string;
  name: string;
  date: string;
  type: 'image' | 'pdf';
}

const mockFiles: UploadedFile[] = [
  { id: '1', name: 'Spring_Schedule.png', date: 'May 5, 2026', type: 'image' },
  { id: '2', name: 'Work_Hours.pdf', date: 'May 8, 2026', type: 'pdf' },
];

type ViewType = 'main' | 'files' | 'support' | 'privacy-policy';

export default function ProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<UploadedFile[]>(mockFiles);
  const [view, setView] = useState<ViewType>('main');
  
  // Notification States
  const [roomInvites, setRoomInvites] = useState(true);
  const [uploadReminders, setUploadReminders] = useState(true);
  const [votingOpened, setVotingOpened] = useState(true);
  const [eventConfirmed, setEventConfirmed] = useState(true);
  const [reminders, setReminders] = useState(false);

  // Privacy States
  const [profilePublic, setProfilePublic] = useState(true);
  const [heatMapOnly, setHeatMapOnly] = useState(true);
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);
  const [activePrivacyTab, setActivePrivacyTab] = useState<'profile' | 'schedule'>('profile');

  React.useEffect(() => {
    // Simulate data fetch
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Join my squad on SweetSync and let\'s find time to hang out! Use my link: sweetsync.app/u/raphael',
      });
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  const handleScan = () => {
    Alert.alert(
      "Magic Scanner",
      "Ready to scan? Point your camera at a printed schedule or upload a screenshot to extract your hours.",
      [
        { text: "Later", style: "cancel" },
        { text: "Start Scanning", onPress: () => {} }
      ]
    );
  };

  const handleDeleteFile = (id: string) => {
    Alert.alert(
      "Delete Schedule",
      "Are you sure? This will remove these hours from all your group rooms.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => setFiles(files.filter(f => f.id !== id))
        }
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      "Clear All Schedules",
      "This will remove all your availability data. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Clear All", 
          style: "destructive",
          onPress: () => setFiles([])
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This is permanent. All your rooms, votes, and schedules will be deleted forever.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete Forever", 
          style: "destructive",
          onPress: () => { /* Delete Account Flow */ }
        }
      ]
    );
  };

  const openPrivacyModal = (tab: 'profile' | 'schedule') => {
    setActivePrivacyTab(tab);
    setPrivacyModalVisible(true);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title="Profile" />
        <ProfileSkeleton />
      </SafeAreaView>
    );
  }

  const headerRight = (
    <Pressable 
      onPress={view === 'main' ? handleShare : handleScan}
      style={({ pressed }) => [{ padding: 4 }, pressed && { opacity: 0.7 }]}
    >
      {view === 'main' ? (
        <ShareNetwork size={24} color={colors.peachPunch} weight="duotone" />
      ) : view === 'files' ? (
        <Camera size={24} color={colors.indigoPunch} weight="duotone" />
      ) : null}
    </Pressable>
  );

  const getHeaderTitle = () => {
    switch(view) {
      case 'files': return "Manage";
      case 'support': return "Help";
      case 'privacy-policy': return "Policy";
      default: return "Profile";
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header 
        title={getHeaderTitle()} 
        showBack={view !== 'main'}
        backLabel="Profile"
        onBackPress={() => setView('main')}
        rightElement={headerRight}
      />
      
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {view === 'main' && (
          <>
            <ProfileHeader name="Raphael" email="raphael@email.com" onEdit={() => {}} />
            <PreferencesForm 
              filesCount={files.length}
              roomInvites={roomInvites}
              onSetRoomInvites={setRoomInvites}
              uploadReminders={uploadReminders}
              onSetUploadReminders={setUploadReminders}
              votingOpened={votingOpened}
              onSetVotingOpened={setVotingOpened}
              eventConfirmed={eventConfirmed}
              onSetEventConfirmed={setEventConfirmed}
              reminders={reminders}
              onSetReminders={setReminders}
              profilePublic={profilePublic}
              heatMapOnly={heatMapOnly}
              onOpenFiles={() => setView('files')}
              onOpenPrivacy={openPrivacyModal}
              onSignOut={() => {}}
              onDeleteAccount={handleDeleteAccount}
            />
          </>
        )}
        {view === 'files' && (
          <FileList 
            files={files} 
            onDelete={handleDeleteFile} 
            onClearAll={handleClearAll} 
            onUpload={() => {}} 
          />
        )}
        {view === 'support' && <SupportView />}
        {view === 'privacy-policy' && <PrivacyPolicyView />}
      </ScrollView>

      <PrivacyModal 
        visible={privacyModalVisible}
        activeTab={activePrivacyTab}
        profilePublic={profilePublic}
        heatMapOnly={heatMapOnly}
        onClose={() => setPrivacyModalVisible(false)}
        onSetProfilePublic={setProfilePublic}
        onSetHeatMapOnly={setHeatMapOnly}
      />
    </SafeAreaView>
  );
}
