import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { ArrowLeft, Download, File } from 'lucide-react-native';
import { Document } from '../ui/types';

function groupDocumentsByYear(documents: Document[]) {
  const sorted = [...documents].sort(
    (a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime()
  );
  const groups: { [year: string]: Document[] } = {};
  sorted.forEach((doc) => {
    const year = new Date(doc.modified).getFullYear().toString();
    if (!groups[year]) groups[year] = [];
    groups[year].push(doc);
  });
  return groups;
}

interface DocumentGridProps {
  documents: Document[];
  selectedWorker: string;
  onBack: () => void;
}

export function DocumentGrid({
  documents,
  selectedWorker,
  onBack,
}: DocumentGridProps) {
  const groups = groupDocumentsByYear(documents);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  const renderListItem = (document: Document) => (
    <Pressable
      key={document.id}
      style={[
        styles.listItem,
        selectedDocument === document.id && styles.listItemSelected,
      ]}
      onPress={() => setSelectedDocument(document.id)}
    >
      <View style={styles.listItemIcon}>
        <File size={24} color="#1A73E8" />
      </View>
      <View style={styles.listItemContent}>
        <Text style={styles.listItemName}>{document.name}</Text>
        <Text style={styles.listItemInfo}>
          {document.size} • Modifié le{' '}
          {new Date(document.modified).toLocaleDateString()}
        </Text>
      </View>
      {selectedDocument === document.id && (
        <View style={styles.listActions}>
          <Pressable style={styles.actionButton}>
            <Download size={20} color="#1A73E8" />
          </Pressable>
        </View>
      )}
    </Pressable>
  );

  return (
    <ScrollView style={styles.documentsWrapper}>
      <View style={styles.gridHeader}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={20} color="#1A73E8" />
        </Pressable>
        <Text style={styles.gridTitle}>Documents de {selectedWorker}</Text>
      </View>

      {Object.keys(groups)
        .sort((a, b) => Number(b) - Number(a))
        .map((year) => (
          <View key={year} style={styles.yearGroup}>
            <Text style={styles.yearTitle}>{year}</Text>
            <View style={styles.documentsContainerList}>
              {groups[year].map(renderListItem)}
            </View>
          </View>
        ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
  },
  mainArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EAED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#202124',
  },
  documentsWrapper: {
    padding: 16,
  },
  workerItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EAED',
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginBottom: 12,
  },
  workerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202124',
  },
  workerPosition: {
    fontSize: 14,
    color: '#5F6368',
    marginTop: 4,
  },
  docCount: {
    fontSize: 12,
    color: '#1A73E8',
    marginTop: 8,
  },
  gridHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EAED',
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  gridTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#202124',
  },
  yearGroup: {
    marginTop: 24,
  },
  yearTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: '#202124',
  },
  documentsContainerList: {
    flexDirection: 'column',
    gap: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E8EAED',
    marginBottom: 12,
    backgroundColor: '#FFF',
  },
  listItemSelected: {
    borderColor: '#1A73E8',
    backgroundColor: '#F0F9FF',
  },
  listItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: '#F1F3F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  listItemContent: {
    flex: 1,
  },
  listItemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#202124',
    marginBottom: 4,
  },
  listItemInfo: {
    fontSize: 12,
    color: '#5F6368',
  },
  listActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#F1F3F4',
    borderRadius: 4,
  },
  toolbar: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E8EAED',
    alignItems: 'center',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#1A73E8',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 16,
  },
});
