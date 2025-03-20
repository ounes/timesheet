import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Modal,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/auth';
import {
  MapPin,
  Calendar,
  Phone,
  User,
  Info,
  Edit2,
  Trash2,
  PlusCircle,
} from 'lucide-react-native';

const INITIAL_SITES = [
  {
    id: '1',
    name: 'Chantier Paris Centre',
    chef: 'Phillipe Laurent',
    address: '123 Rue de Rivoli, 75001 Paris',
    contact: '01.25.36.98.54',
    startDate: '2024-01-15',
    endDate: '2024-06-30',
    image:
      'https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a?auto=format&fit=crop&q=80&w=800&h=400',
    notes: 'Prendre la A46',
    agencie: 'societe1',
  },
];

// Component to display a site card with Edit and Delete actions.
function SiteCard({
  site,
  onEdit,
  onRemove,
}: {
  site: (typeof INITIAL_SITES)[0];
  onEdit: (site: (typeof INITIAL_SITES)[0]) => void;
  onRemove: (site: (typeof INITIAL_SITES)[0]) => void;
}) {
  return (
    <View style={styles.siteCard}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: site.image }}
          style={styles.siteImage}
          resizeMode="cover"
        />
      </View>
      <View style={styles.siteContent}>
        <Text style={styles.siteName}>{site.name}</Text>
        <View style={styles.siteInfo}>
          <User size={16} color="#666666" />
          <Text style={styles.siteAddress}>{site.chef}</Text>
        </View>
        <View style={styles.siteInfo}>
          <MapPin size={16} color="#666666" />
          <Text style={styles.siteAddress}>{site.address}</Text>
        </View>
        <View style={styles.siteInfo}>
          <Phone size={16} color="#666666" />
          <Text style={styles.siteAddress}>{site.contact}</Text>
        </View>
        <View style={styles.siteInfo}>
          <Calendar size={16} color="#666666" />
          <Text style={styles.dateText}>
            {new Date(site.startDate).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short',
            })}
            {' - '}
            {new Date(site.endDate).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </Text>
        </View>
        <View style={styles.dateContainer}>
          <View style={styles.siteInfo}>
            <Info size={16} color="#666666" />
            <Text style={styles.siteAddress}>{site.notes}</Text>
          </View>
        </View>
        {/* CRUD Buttons */}
        <View style={styles.crudButtons}>
          <Pressable style={styles.crudButton} onPress={() => onEdit(site)}>
            <Edit2 size={16} color="#007AFF" />
            <Text style={styles.crudText}>Editer</Text>
          </Pressable>
          <Pressable
            style={[styles.crudButton, styles.deleteButton]}
            onPress={() => onRemove(site)}
          >
            <Trash2 size={16} color="#FFFFFF" />
            <Text style={[styles.crudText, { color: '#FFFFFF' }]}>
              Supprimer
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

// Modal Form to add/edit a site.
function SiteForm({
  visible,
  onClose,
  onSubmit,
  initialData,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: (typeof INITIAL_SITES)[0];
}) {
  const [name, setName] = useState(initialData ? initialData.name : '');
  const [chef, setChef] = useState(initialData ? initialData.chef : '');
  const [address, setAddress] = useState(
    initialData ? initialData.address : ''
  );
  const [contact, setContact] = useState(
    initialData ? initialData.contact : ''
  );
  const [startDate, setStartDate] = useState(
    initialData ? initialData.startDate : ''
  );
  const [endDate, setEndDate] = useState(
    initialData ? initialData.endDate : ''
  );
  const [image, setImage] = useState(
    initialData
      ? initialData.image
      : 'https://via.placeholder.com/800x400.png?text=Image'
  );
  const [notes, setNotes] = useState(initialData ? initialData.notes : '');

  const handleSave = () => {
    if (!name || !chef || !address) {
      Alert.alert(
        'Validation',
        "Veuillez renseigner le nom, le chef et l'adresse"
      );
      return;
    }
    onSubmit({
      id: initialData ? initialData.id : Date.now().toString(),
      name,
      chef,
      address,
      contact,
      startDate,
      endDate,
      image,
      notes,
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {initialData ? 'Editer le site' : 'Ajouter un site'}
          </Text>
          <TextInput
            placeholder="Nom du site"
            value={name}
            onChangeText={setName}
            style={styles.modalInput}
          />
          <TextInput
            placeholder="Chef de site"
            value={chef}
            onChangeText={setChef}
            style={styles.modalInput}
          />
          <TextInput
            placeholder="Adresse"
            value={address}
            onChangeText={setAddress}
            style={styles.modalInput}
          />
          <TextInput
            placeholder="Contact"
            value={contact}
            onChangeText={setContact}
            style={styles.modalInput}
          />
          <TextInput
            placeholder="Date de début (YYYY-MM-DD)"
            value={startDate}
            onChangeText={setStartDate}
            style={styles.modalInput}
          />
          <TextInput
            placeholder="Date de fin (YYYY-MM-DD)"
            value={endDate}
            onChangeText={setEndDate}
            style={styles.modalInput}
          />
          <TextInput
            placeholder="URL de l'image"
            value={image}
            onChangeText={setImage}
            style={styles.modalInput}
          />
          <TextInput
            placeholder="Notes"
            value={notes}
            onChangeText={setNotes}
            style={styles.modalInput}
          />
          <View style={styles.modalButtons}>
            <Pressable
              style={[styles.crudButton, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={[styles.crudText, { color: '#666666' }]}>
                Annuler
              </Text>
            </Pressable>
            <Pressable
              style={[styles.crudButton, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={[styles.crudText, { color: '#FFFFFF' }]}>
                Sauvegarder
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function SitesScreen() {
  const agencie = useAuthStore((state) => state.agencie);
  const workers = INITIAL_SITES.filter((site) => site.agencie == agencie);
  const [sites, setSites] = useState(INITIAL_SITES);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingSite, setEditingSite] = useState<any>(null);

  // Open form for add or edit.
  const openForm = (site?: any) => {
    setEditingSite(site || null);
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
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Sites</Text>
          <Text style={styles.subtitle}>Gérer vos sites</Text>
        </View>
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
        <Pressable style={styles.addButton} onPress={() => openForm()}>
          <PlusCircle size={32} color="#007AFF" />
        </Pressable>
      </ScrollView>

      {/* Modal Form */}
      <SiteForm
        visible={isFormVisible}
        onClose={() => setIsFormVisible(false)}
        onSubmit={handleFormSubmit}
        initialData={editingSite || undefined}
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
    padding: 20,
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
  imageContainer: {
    height: 200,
    width: '100%',
    backgroundColor: '#F5F5F5',
  },
  siteImage: {
    width: '100%',
    height: '100%',
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
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateText: {
    fontSize: 14,
    color: '#666666',
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
