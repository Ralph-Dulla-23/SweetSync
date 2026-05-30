import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  Switch,
  Platform,
  Share
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts, spacing, radius } from '@/constants/theme';
import { Avatar } from '@/components/Avatar';
import { 
  CaretRight, 
  FileText, 
  Trash, 
  Plus, 
  SignOut, 
  Bell, 
  Shield,
  ClockCounterClockwise,
  MagicWand,
  ShareNetwork,
  Camera
} from 'phosphor-react-native';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import Animated, { FadeInUp, Layout, FadeOut, FadeIn } from 'react-native-reanimated';
import { styles } from './_profile.styles';

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

import { ProfileSkeleton } from '@/components/ProfileSkeleton';

export default function ProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<UploadedFile[]>(mockFiles);
  const [view, setView] = useState<'main' | 'files'>('main');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

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
        { text: "Start Scanning", onPress: () => console.log("Start OCR Flow") }
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

  const renderMain = () => (
    <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.sectionContainer}>
      <View style={styles.userCard}>
        <Avatar name="Raphael" size={64} color={colors.peachPunch} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>Raphael</Text>
          <Text style={styles.userEmail}>raphael@email.com</Text>
        </View>
        <TouchableOpacity style={styles.editProfileBtn}>
          <Text style={styles.editProfileText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Availability Engine</Text>
        <View style={styles.sectionCard}>
          <TouchableOpacity 
            style={styles.row}
            onPress={() => setView('files')}
            activeOpacity={0.7}
          >
            <View style={styles.rowLeft}>
              <FileText size={22} color={colors.indigoPunch} weight="duotone" />
              <Text style={styles.rowText}>Uploaded schedules</Text>
            </View>
            <View style={styles.rowRight}>
              <Text style={styles.rowValue}>{files.length} {files.length === 1 ? 'file' : 'files'}</Text>
              <CaretRight size={16} color={colors.textTertiary} />
            </View>
          </TouchableOpacity>
          
          <View style={styles.rowDivider} />

          <TouchableOpacity style={styles.row} activeOpacity={0.7}>
            <View style={styles.rowLeft}>
              <ClockCounterClockwise size={22} color={colors.indigoPunch} weight="duotone" />
              <Text style={styles.rowText}>Quiet Hours</Text>
            </View>
            <View style={styles.rowRight}>
              <Text style={styles.rowValue}>11pm - 8am</Text>
              <CaretRight size={16} color={colors.textTertiary} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Settings</Text>
        <View style={styles.sectionCard}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Bell size={22} color={colors.peachPunch} weight="duotone" />
              <Text style={styles.rowText}>Push Notifications</Text>
            </View>
            <Switch 
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: colors.borderDefault, true: colors.peachPunch }}
              thumbColor={Platform.OS === 'ios' ? undefined : colors.white}
            />
          </View>
          
          <View style={styles.rowDivider} />

          <TouchableOpacity style={styles.row} activeOpacity={0.7}>
            <View style={styles.rowLeft}>
              <Shield size={22} color={colors.peachPunch} weight="duotone" />
              <Text style={styles.rowText}>Privacy & Security</Text>
            </View>
            <CaretRight size={16} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={[styles.row, styles.signOutRow]} activeOpacity={0.6}>
        <View style={styles.rowLeft}>
          <SignOut size={22} color={colors.textTertiary} weight="bold" />
          <Text style={[styles.rowText, { color: colors.peachPunch }]}>Sign out</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderFiles = () => (
    <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.sectionContainer}>
      <View style={styles.filesHeader}>
        <Text style={styles.filesTitle}>Schedules</Text>
        <Text style={styles.filesSubtitle}>
          The AI combines these files to find gaps that work for your whole squad.
        </Text>
      </View>

      <View style={styles.fileList}>
        {files.length > 0 ? (
          files.map((file) => (
            <Animated.View 
              key={file.id} 
              layout={Layout.springify()}
              style={styles.fileCard}
            >
              <View style={styles.fileIcon}>
                <FileText size={24} color={colors.indigoPunch} weight="fill" />
              </View>
              <View style={styles.fileInfo}>
                <Text style={styles.fileName}>{file.name}</Text>
                <Text style={styles.fileDate}>{file.date}</Text>
              </View>
              <TouchableOpacity 
                onPress={() => handleDeleteFile(file.id)}
                style={styles.deleteBtn}
                activeOpacity={0.6}
              >
                <Trash size={20} color={colors.textTertiary} />
              </TouchableOpacity>
            </Animated.View>
          ))
        ) : (
          <View style={styles.emptyFileCard}>
            <MagicWand size={48} color={colors.indigoPunch} weight="duotone" />
            <Text style={styles.emptyFileText}>
              No schedules yet. Upload one to start syncing with your squad!
            </Text>
          </View>
        )}
      </View>

      {files.length > 0 && (
        <TouchableOpacity onPress={handleClearAll} style={styles.clearAllBtn} activeOpacity={0.6}>
          <Text style={styles.clearAllText}>Clear All Schedules</Text>
        </TouchableOpacity>
      )}

      <Button 
        title="Upload New Schedule" 
        variant="indigo"
        icon={<Plus size={24} color={colors.white} weight="bold" />}
        onPress={() => {}}
        style={styles.uploadBtn}
      />
    </Animated.View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title="Profile" />
        <ProfileSkeleton />
      </SafeAreaView>
    );
  }

  const headerRight = (
    <TouchableOpacity 
      onPress={view === 'main' ? handleShare : handleScan}
      style={{ padding: 4 }}
      activeOpacity={0.7}
    >
      {view === 'main' ? (
        <ShareNetwork size={24} color={colors.peachPunch} weight="duotone" />
      ) : (
        <Camera size={24} color={colors.indigoPunch} weight="duotone" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header 
        title={view === 'main' ? "Profile" : "Manage"} 
        showBack={view === 'files'}
        backLabel="Profile"
        onBackPress={() => setView('main')}
        rightElement={headerRight}
      />
      
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {view === 'main' ? renderMain() : renderFiles()}
      </ScrollView>
    </SafeAreaView>
  );
}

