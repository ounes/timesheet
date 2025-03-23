import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MOCK_DOCUMENTS, MOCK_WORKERS } from '@/store/mock_data';
import { Upload } from 'lucide-react-native';
import { DocumentGrid } from '../shared/business/document-grid.component';

export default function DocBoxScreen() {
  const workers = MOCK_WORKERS;
  const documents = MOCK_DOCUMENTS;
  const [selectedWorker, setSelectedWorker] = useState<string | null>(null);
  // const { width } = useWindowDimensions();
  // const isDesktop = width >= 1024;

  const workerDocuments = MOCK_DOCUMENTS.filter(
    (doc) => doc.workerId === selectedWorker
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.mainArea}>
          {!selectedWorker ? (
            <>
              <View style={styles.header}>
                <Text style={styles.title}>Documents</Text>
              </View>
              <ScrollView style={styles.documentsWrapper}>
                {workers.map((worker) => (
                  <Pressable
                    key={worker.id}
                    style={styles.workerItem}
                    onPress={() => setSelectedWorker(worker.id)}
                  >
                    <Text style={styles.workerName}>{worker.name}</Text>
                    <Text style={styles.workerPosition}>{worker.position}</Text>
                    <Text style={styles.docCount}>
                      {documents.filter((d) => d.workerId === worker.id).length}{' '}
                      documents
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </>
          ) : (
            <DocumentGrid
              documents={workerDocuments}
              selectedWorker={
                workers.find((wk) => wk.id == selectedWorker)?.name as string
              }
              onBack={() => setSelectedWorker(null)}
            />
          )}
          {selectedWorker && (
            <View style={styles.toolbar}>
              <Pressable style={styles.uploadButton}>
                <Upload size={25} color="#FFFFFF" />
                <Text style={styles.uploadButtonText}>
                  Ajouter des documents
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
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

export { };
