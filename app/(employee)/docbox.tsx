import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { List, Download, FileText, File, Upload } from 'lucide-react-native';
import { useState } from 'react';
import { useAuthStore } from '@/store/auth';

// MOCKED DATA – ajout de documents pour 2025 et 2024
const MOCK_DOCUMENTS = [
  {
    id: '1',
    name: 'Rapport Mensuel - Février 2025.pdf',
    type: 'pdf',
    size: '2.7 MB',
    modified: '2025-02-20T09:00:00',
    preview:
      'https://images.unsplash.com/photo-1626445877884-999529b1c51a?fit=crop&w=400&h=250',
    workerId: '2'
  },
  {
    id: '2',
    name: 'Plan Stratégique 2025.docx',
    type: 'docx',
    size: '1.2 MB',
    modified: '2025-01-15T14:30:00',
    preview: '',
    workerId: '2'
  },
  {
    id: '3',
    name: 'Rapport Mensuel - Janvier 2024.pdf',
    type: 'pdf',
    size: '2.4 MB',
    modified: '2024-02-19T10:30:00',
    preview:
      'https://images.unsplash.com/photo-1626445877884-999529b1c51a?fit=crop&w=400&h=250',
    workerId: '2'
  },
  {
    id: '4',
    name: 'Planning Équipe Q1 2024.xlsx',
    type: 'excel',
    size: '1.8 MB',
    modified: '2024-02-18T15:45:00',
    preview: '',
    workerId: '3'
  },
];

// Fonction utilitaire pour trier et grouper les documents par année
function groupDocumentsByYear(documents: typeof MOCK_DOCUMENTS) {
  // Tri décroissant par date de modification
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

interface DocumentListProps {
  documents: typeof MOCK_DOCUMENTS;
  selectedDocument: string | null;
  onSelectDocument: (id: string) => void;
}

function DocumentList({
  documents,
  selectedDocument,
  onSelectDocument,
}: DocumentListProps) {
  const groups = groupDocumentsByYear(documents);

  // Rendu d'un document en mode liste avec boutons à droite si sélectionné
  const renderListItem = (document: (typeof MOCK_DOCUMENTS)[0]) => (
    <Pressable
      key={document.id}
      style={[
        styles.listItem,
        selectedDocument === document.id && styles.listItemSelected,
      ]}
      onPress={() => onSelectDocument(document.id)}
    >
      <View style={styles.listItemIcon}>
        {document.preview ? (
          <Image
            source={{ uri: document.preview }}
            style={styles.listItemPreview}
          />
        ) : (
          <File size={24} color="#1A73E8" />
        )}
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
          <Pressable style={styles.actionButton}>
            <File size={20} color="#1A73E8" />
          </Pressable>
        </View>
      )}
    </Pressable>
  );

  return (
    <ScrollView style={styles.documentsWrapper}>
      {Object.keys(groups)
        .sort((a, b) => Number(b) - Number(a))
        .map((year) => (
          <View key={year}>
            <Text style={styles.yearTitle}>{year}</Text>
            <View style={styles.documentsContainerList}>
              {groups[year].map((doc) => renderListItem(doc))}
            </View>
          </View>
        ))}
    </ScrollView>
  );
}

export default function DocBoxScreen() {
  const userId = useAuthStore((state) => state.id);
  const filteredDocuments = MOCK_DOCUMENTS.filter((doc) => userId === doc.workerId);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.mainArea}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.title}>Mes documents</Text>
            </View>
            <View style={styles.headerRight}>
              {/* Grid mode removed – list mode is now the default view */}
              <Pressable style={[styles.viewModeButton, styles.viewModeButtonActive]}>
                <List size={20} color="#1A73E8" />
              </Pressable>
            </View>
          </View>

          <DocumentList
            documents={filteredDocuments}
            selectedDocument={selectedDocument}
            onSelectDocument={(id) => setSelectedDocument(id)}
          />

          <View style={styles.toolbar}>
            <View style={styles.toolbarCenter}>
              <Pressable style={styles.uploadButton}>
                <Upload size={25} color="#FFFFFF" />
                <Text style={styles.uploadButtonText}>
                  Envoyer des documents
                </Text>
              </Pressable>
            </View>
          </View>
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
    flexDirection: 'row',
  },
  mainArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EAED',
  },
  headerLeft: {
    gap: 16,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#202124',
  },
  viewModeButton: {
    padding: 8,
    borderRadius: 4,
  },
  viewModeButtonActive: {
    backgroundColor: '#F0F9FF',
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E8EAED',
  },
  toolbarCenter: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
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
    fontSize: 20,
  },
  documentsWrapper: {
    padding: 16,
  },
  yearTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    color: '#202124',
  },
  documentsContainerList: {
    flexDirection: 'column',
    gap: 16,
    marginBottom: 24,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E8EAED',
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
  listItemPreview: {
    width: 40,
    height: 40,
    borderRadius: 4,
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
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#F1F3F4',
    borderRadius: 4,
  },
});
