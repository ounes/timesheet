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
import {
  PlusCircle,
} from 'lucide-react-native';
import { MOCK_WORKERS } from '@/store/mock_data';
import { PersonCard } from '../shared/business/person-card.component';
import { PersonForm } from '../shared/business/person-form.component';

export default function AdminHomePage() {
  const workersAg = MOCK_WORKERS;
  const validatorsAg = MOCK_WORKERS;
  const [activeTab, setActiveTab] = useState<'Workers' | 'Validators'>(
    'Workers'
  );
  const [workers, setWorkers] = useState(workersAg);
  const [validators, setValidators] = useState(validatorsAg);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingPerson, setEditingPerson] = useState<any>(null);

  // Open form for add or edit; person type depends on active tab.
  const openForm = (person?: any) => {
    setEditingPerson(person || null);
    setIsFormVisible(true);
  };

  // Delete confirmation and removal
  const removePerson = (person: any) => {
    Alert.alert(
      'Supprimer',
      `Êtes-vous sûr de vouloir supprimer ${person.name} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            if (activeTab === 'Workers') {
              setWorkers((prev) => prev.filter((p) => p.id !== person.id));
            } else {
              setValidators((prev) => prev.filter((p) => p.id !== person.id));
            }
          },
        },
      ]
    );
  };

  // Handle form submission for add/edit
  const handleFormSubmit = (data: any) => {
    if (activeTab === 'Workers') {
      setWorkers((prev) => {
        const exists = prev.find((p) => p.id === data.id);
        if (exists) {
          return prev.map((p) => (p.id === data.id ? data : p));
        }
        return [data, ...prev];
      });
    } else {
      setValidators((prev) => {
        const exists = prev.find((p) => p.id === data.id);
        if (exists) {
          return prev.map((p) => (p.id === data.id ? data : p));
        }
        return [data, ...prev];
      });
    }
  };

  // Render list based on active tab
  const renderList = () => {
    const data = activeTab === 'Workers' ? workers : validators;
    return data.map((person) => (
      <PersonCard
        key={person.id}
        person={person}
        onEdit={(p) => openForm(p)}
        onRemove={removePerson}
      />
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.pageTitle}>Utilisateurs</Text>
        <Text style={styles.pageSubtitle}>Gérer vos collaborateurs</Text>

        {/* Tabs */}
        <View style={styles.tabs}>
          <Pressable
            style={[styles.tab, activeTab === 'Workers' && styles.activeTab]}
            onPress={() => setActiveTab('Workers')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'Workers' && styles.activeTabText,
              ]}
            >
              Salariés
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === 'Validators' && styles.activeTab]}
            onPress={() => setActiveTab('Validators')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'Validators' && styles.activeTabText,
              ]}
            >
              Validateurs
            </Text>
          </Pressable>
        </View>

        {/* List */}
        <View style={styles.listContainer}>{renderList()}</View>

        {/* Add Button */}
        <Pressable style={styles.addButton} onPress={() => openForm()}>
          <PlusCircle size={32} color="#007AFF" />
        </Pressable>

        {/* Modal Form */}
        <PersonForm
          visible={isFormVisible}
          onClose={() => setIsFormVisible(false)}
          onSubmit={handleFormSubmit}
          initialData={editingPerson || undefined}
          type={activeTab === 'Workers' ? 'Worker' : 'Validator'}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 20,
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    color: '#666666',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  listContainer: {
    gap: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  imageContainer: {
    height: 200,
    width: '100%',
    backgroundColor: '#F5F5F5',
  },
  personImage: {
    width: '100%',
    height: '100%',
  },
  cardContent: {
    padding: 16,
  },
  personName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  personRole: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666666',
    flex: 1,
  },
  crudButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 12,
  },
  crudButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
  },
  deleteButton: {
    backgroundColor: '#C62828',
  },
  crudText: {
    fontSize: 14,
    color: '#007AFF',
    marginLeft: 4,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
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
  cancelButton: {
    backgroundColor: '#F0F0F0',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
});

export {};
