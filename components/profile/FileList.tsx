import React from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import { FileText, Trash, MagicWand, Plus } from 'phosphor-react-native';
import { colors, spacing } from '@/constants/theme';
import { Button } from '@/components/Button';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';
import { styles } from '@/app/(tabs)/_profile.styles';

interface UploadedFile {
  id: string;
  name: string;
  date: string;
  type: 'image' | 'pdf';
}

interface FileListProps {
  files: UploadedFile[];
  onDelete: (id: string) => void;
  onClearAll: () => void;
  onUpload: () => void;
}

export const FileList = ({ files, onDelete, onClearAll, onUpload }: FileListProps) => {
  const renderItem = React.useCallback(({ item: file }: { item: UploadedFile }) => (
    <Animated.View 
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
      <Pressable 
        onPress={() => onDelete(file.id)}
        style={({ pressed }) => [styles.deleteBtn, pressed && { opacity: 0.6 }]}
      >
        <Trash size={20} color={colors.textTertiary} />
      </Pressable>
    </Animated.View>
  ), [onDelete]);

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.sectionContainer}>
      <View style={styles.filesHeader}>
        <Text style={styles.filesTitle}>Schedules</Text>
        <Text style={styles.filesSubtitle}>
          The AI combines these files to find gaps that work for your whole squad.
        </Text>
      </View>

      <FlatList
        data={files}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.fileList}
        ListEmptyComponent={
          <View style={styles.emptyFileCard}>
            <MagicWand size={48} color={colors.indigoPunch} weight="duotone" />
            <Text style={styles.emptyFileText}>
              No schedules yet. Upload one to start syncing with your squad!
            </Text>
          </View>
        }
        renderItem={renderItem}
      />

      {files.length > 0 && (
        <Pressable 
          onPress={onClearAll} 
          style={({ pressed }) => [styles.clearAllBtn, pressed && { opacity: 0.6 }]}
        >
          <Text style={styles.clearAllText}>Clear All Schedules</Text>
        </Pressable>
      )}

      <Button 
        title="Upload New Schedule" 
        variant="indigo"
        icon={<Plus size={24} color={colors.white} weight="bold" />}
        onPress={onUpload}
        style={styles.uploadBtn}
      />
    </Animated.View>
  );
};