import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView,
  Alert
} from 'react-native';
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
  ClockCounterClockwise
} from 'phosphor-react-native';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import Animated, { FadeInUp, Layout } from 'react-native-reanimated';
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

export default function ProfileScreen() {
  const [files, setFiles] = useState<UploadedFile[]>(mockFiles);
  const [view, setView] = useState<'main' | 'files'>('main');

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

  const renderMain = () => (
    <Animated.View entering={FadeInUp} style={styles.sectionContainer}>
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

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>12</Text>
          <Text style={styles.statLabel}>Syncs</Text>
        </View>
        <View style={[styles.statBox, styles.statDivider]}>
          <Text style={styles.statValue}>5</Text>
          <Text style={styles.statLabel}>Rooms</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>3</Text>
          <Text style={styles.statLabel}>Gaps Found</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>MY SCHEDULE</Text>
        <TouchableOpacity 
          style={styles.row}
          onPress={() => setView('files')}
        >
          <View style={styles.rowLeft}>
            <FileText size={22} color={colors.indigoPunch} weight="duotone" />
            <Text style={styles.rowText}>Uploaded schedules</Text>
          </View>
          <View style={styles.rowRight}>
            <Text style={styles.rowValue}>{files.length} files</Text>
            <CaretRight size={16} color={colors.textTertiary} />
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.row}>
          <View style={styles.rowLeft}>
            <ClockCounterClockwise size={22} color={colors.indigoPunch} weight="duotone" />
            <Text style={styles.rowText}>Quiet Hours</Text>
          </View>
          <CaretRight size={16} color={colors.textTertiary} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>PREFERENCES</Text>
        <TouchableOpacity style={styles.row}>
          <View style={styles.rowLeft}>
            <Bell size={22} color={colors.peachPunch} weight="duotone" />
            <Text style={styles.rowText}>Notifications</Text>
          </View>
          <View style={[styles.toggle, styles.toggleOn]} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.row}>
          <View style={styles.rowLeft}>
            <Shield size={22} color={colors.peachPunch} weight="duotone" />
            <Text style={styles.rowText}>Privacy & Security</Text>
          </View>
          <CaretRight size={16} color={colors.textTertiary} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.row}>
          <View style={styles.rowLeft}>
            <SignOut size={22} color={colors.textTertiary} weight="bold" />
            <Text style={[styles.rowText, { color: colors.peachPunch }]}>Sign out</Text>
          </View>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderFiles = () => (
    <Animated.View entering={FadeInUp} style={styles.sectionContainer}>
      <TouchableOpacity 
        onPress={() => setView('main')}
        style={styles.backButton}
      >
        <CaretLeft size={20} color={colors.peachPunch} weight="bold" />
        <Text style={styles.backButtonText}>Back to Profile</Text>
      </TouchableOpacity>

      <View style={styles.filesHeader}>
        <Text style={styles.filesTitle}>Manage Schedules</Text>
        <Text style={styles.filesSubtitle}>
          The AI combines these to calculate your availability across all rooms.
        </Text>
      </View>

      <View style={styles.fileList}>
        {files.map((file) => (
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
            >
              <Trash size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      <Button 
        title="Upload New Schedule" 
        variant="indigo"
        icon={<Plus size={20} color={colors.white} weight="bold" />}
        onPress={() => {}}
        style={styles.uploadBtn}
      />
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Profile" />
      
      <ScrollView contentContainerStyle={styles.content}>
        {view === 'main' ? renderMain() : renderFiles()}
      </ScrollView>
    </SafeAreaView>
  );
}

