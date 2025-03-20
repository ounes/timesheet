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
import {
  Grid2x2 as Grid,
  List,
  Download,
  FileText,
  File,
  Upload,
} from 'lucide-react-native';
import { useState } from 'react';
import Animated from 'react-native-reanimated';

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
  },
  {
    id: '2',
    name: 'Plan Stratégique 2025.docx',
    type: 'docx',
    size: '1.2 MB',
    modified: '2025-01-15T14:30:00',
    preview: '',
  },
  {
    id: '3',
    name: 'Rapport Mensuel - Janvier 2024.pdf',
    type: 'pdf',
    size: '2.4 MB',
    modified: '2024-02-19T10:30:00',
    preview:
      'https://images.unsplash.com/photo-1626445877884-999529b1c51a?fit=crop&w=400&h=250',
  },
  {
    id: '4',
    name: 'Planning Équipe Q1 2024.xlsx',
    type: 'excel',
    size: '1.8 MB',
    modified: '2024-02-18T15:45:00',
    preview: '',
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

interface DocumentGridProps {
  documents: typeof MOCK_DOCUMENTS;
  viewMode: 'list' | 'grid';
  selectedDocument: string | null;
  onSelectDocument: (id: string) => void;
}

function DocumentGrid({
  documents,
  viewMode,
  selectedDocument,
  onSelectDocument,
}: DocumentGridProps) {
  const groups = groupDocumentsByYear(documents);

  // Rendu d'un document en mode grid avec boutons si sélectionné
  const renderGridItem = (document: (typeof MOCK_DOCUMENTS)[0]) => (
    <Pressable
      key={document.id}
      style={[
        styles.gridItem,
        selectedDocument === document.id && styles.gridItemSelected,
      ]}
      onPress={() => onSelectDocument(document.id)}
    >
      {document.preview ? (
        <Image
          source={{ uri: document.preview }}
          style={styles.documentPreview}
        />
      ) : (
        <View style={styles.documentIcon}>
          <FileText size={32} color="#1A73E8" />
        </View>
      )}
      <Text style={styles.documentName} numberOfLines={2}>
        {document.name}
      </Text>
      <Text style={styles.documentInfo}>
        {document.size} • Modifié le{' '}
        {new Date(document.modified).toLocaleDateString()}
      </Text>
      {selectedDocument === document.id && (
        <View style={styles.gridActions}>
          <Pressable style={styles.actionButton}>
            <Download size={20} color="#1A73E8" />
            <Text style={styles.actionButtonText}>Télécharger</Text>
          </Pressable>
          <Pressable style={styles.actionButton}>
            <File size={20} color="#1A73E8" />
            <Text style={styles.actionButtonText}>Ouvrir</Text>
          </Pressable>
        </View>
      )}
    </Pressable>
  );

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
            <View
              style={[
                viewMode === 'grid'
                  ? styles.documentsContainer
                  : styles.documentsContainerList,
              ]}
            >
              {groups[year].map((doc) =>
                viewMode === 'grid' ? renderGridItem(doc) : renderListItem(doc)
              )}
            </View>
          </View>
        ))}
    </ScrollView>
  );
}

export default function DocBoxScreen() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
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
              <Pressable
                style={[
                  styles.viewModeButton,
                  viewMode === 'grid' && styles.viewModeButtonActive,
                ]}
                onPress={() => setViewMode('grid')}
              >
                <Grid
                  size={20}
                  color={viewMode === 'grid' ? '#1A73E8' : '#666666'}
                />
              </Pressable>
              <Pressable
                style={[
                  styles.viewModeButton,
                  viewMode === 'list' && styles.viewModeButtonActive,
                ]}
                onPress={() => setViewMode('list')}
              >
                <List
                  size={20}
                  color={viewMode === 'list' ? '#1A73E8' : '#666666'}
                />
              </Pressable>
            </View>
          </View>

          <DocumentGrid
            documents={MOCK_DOCUMENTS}
            viewMode={viewMode}
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
  documentsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  documentsContainerList: {
    flexDirection: 'column',
    gap: 16,
    marginBottom: 24,
  },
  gridItem: {
    width: Platform.select({
      web: 200,
      default: '48%',
    }),
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E8EAED',
    paddingBottom: 8,
  },
  gridItemSelected: {
    borderColor: '#1A73E8',
    backgroundColor: '#F0F9FF',
  },
  documentPreview: {
    width: '100%',
    height: 120,
    backgroundColor: '#F1F3F4',
  },
  documentIcon: {
    width: '100%',
    height: 120,
    backgroundColor: '#F1F3F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  documentName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#202124',
    padding: 12,
  },
  documentInfo: {
    fontSize: 12,
    color: '#5F6368',
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  gridActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E8EAED',
    paddingTop: 8,
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
  actionButtonText: {
    fontSize: 12,
    color: '#1A73E8',
  },
});
