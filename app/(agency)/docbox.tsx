import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/auth';
import { ArrowLeft, Download, File, Upload } from 'lucide-react-native';

// MOCKED DATA (using only idWorker for document-worker relation)
const MOCK_WORKERS = [
  { id: 'w1', name: 'Jean Dupont', position: 'Ouvrier', agency: 'societe1' },
  {
    id: 'w2',
    name: 'Marie Curie',
    position: 'Chef de chantier',
    agency: 'societe1',
  },
  {
    id: 'w3',
    name: 'Pierre Martin',
    position: 'Électricien',
    agency: 'societe2',
  },
];

const MOCK_DOCUMENTS = [
  {
    id: '1',
    name: 'Contrat de travail.pdf',
    type: 'pdf',
    size: '2.7 MB',
    modified: '2024-02-20T09:00:00',
    idWorker: 'w1',
  },
  {
    id: '2',
    name: 'Certificat formation.docx',
    type: 'docx',
    size: '1.2 MB',
    modified: '2024-01-15T14:30:00',
    idWorker: 'w2',
  },
  {
    id: '3',
    name: 'Attestation employeur.pdf',
    type: 'pdf',
    size: '2.4 MB',
    modified: '2024-02-19T10:30:00',
    idWorker: 'w3',
  },
];

function groupDocumentsByYear(documents: typeof MOCK_DOCUMENTS) {
  const sorted = [...documents].sort(
    (a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime()
  );
  const groups: { [year: string]: typeof MOCK_DOCUMENTS } = {};
  sorted.forEach((doc) => {
    const year = new Date(doc.modified).getFullYear().toString();
    if (!groups[year]) groups[year] = [];
    groups[year].push(doc);
  });
  return groups;
}

interface DocumentGridProps {
  documents: typeof MOCK_DOCUMENTS;
  selectedWorker: string;
  onBack: () => void;
}

function DocumentGrid({
  documents,
  selectedWorker,
  onBack,
}: DocumentGridProps) {
  const groups = groupDocumentsByYear(documents);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  const renderListItem = (document: (typeof MOCK_DOCUMENTS)[0]) => (
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

export default function DocBoxScreen() {
  const agency = useAuthStore((state) => state.agency);
  const workers = MOCK_WORKERS.filter((wk) => wk.agency === agency);
  // Filter documents by matching idWorker
  const documents = MOCK_DOCUMENTS.filter((doc) =>
    workers.some((worker) => worker.id === doc.idWorker)
  );
  const [selectedWorker, setSelectedWorker] = useState<string | null>(null);
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const workerDocuments = MOCK_DOCUMENTS.filter(
    (doc) => doc.idWorker === selectedWorker
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
                      {documents.filter((d) => d.idWorker === worker.id).length}{' '}
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
                workers.find((wk) => wk.id == selectedWorker).name
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

export { DocBoxScreen };
