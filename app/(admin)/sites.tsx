import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PlusCircle } from 'lucide-react-native';
import { MOCK_SITES } from '@/store/mock_data';
import { SiteCard } from '../shared/business/site-card.component';
import { SiteForm } from '../shared/business/site-form.component';
import { Site } from '../shared/ui/types';

export default function SitesScreen() {
  const [sites, setSites] = useState(MOCK_SITES);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingSite, setEditingSite] = useState<Site>();

  // Open form for add or edit.
  const openForm = (site?: any) => {
    setEditingSite(site);
    setIsFormVisible(true);
  };

  // Remove site with confirmation.
  const removeSite = (site: any) => {
    Alert.alert(
      'Supprimer',
      `Êtes-vous sûr de vouloir supprimer le site ${site.name} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () =>
            setSites((prev) => prev.filter((s) => s.id !== site.id)),
        },
      ]
    );
    setEditingSite(undefined);
  };

  // Handle form submission.
  const handleFormSubmit = (data: any) => {
    setSites((prev) => {
      const exists = prev.find((s) => s.id === data.id);
      if (exists) {
        return prev.map((s) => (s.id === data.id ? data : s));
      }
      return [data, ...prev];
    });
    setEditingSite(undefined);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Sites</Text>
          <Text style={styles.subtitle}>Gérer vos sites</Text>
        </View>
        <Pressable style={styles.addButtonHeader} onPress={() => openForm() }>
          <PlusCircle size={32} color="#007AFF" />
        </Pressable>
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={styles.sitesContainer}>
          {sites.map((site) => (
            <SiteCard
              key={site.id}
              site={site}
              onEdit={(s) => openForm(s)}
              onRemove={removeSite}
            />
          ))}
        </View>
      </ScrollView>
      {/* Modal Form */}
      <SiteForm
        visible={isFormVisible}
        onClose={() => {
          setEditingSite(undefined);
          setIsFormVisible(false)
        }}
        onSubmit={handleFormSubmit}
        initialData={editingSite}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
  },
  addButtonHeader: {
    padding: 8,
  },
  sitesContainer: {
    padding: 20,
    gap: 20,
  },
  siteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  siteContent: {
    padding: 16,
  },
  siteName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  siteInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  siteAddress: {
    fontSize: 14,
    color: '#666666',
    flex: 1,
  },
  dateContainer: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
  },
  iconButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 12,
  },
  iconButton: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
  },
  deleteIconButton: {
    backgroundColor: '#C62828',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 14,
    color: '#333333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  cancelButton: {
    backgroundColor: '#F0F0F0',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  actionButtonText: {
    fontSize: 14,
  },
});

export {};
