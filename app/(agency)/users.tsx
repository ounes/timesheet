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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/auth';
import {
  User,
  Phone,
  Mail,
  Info,
  Edit2,
  Trash2,
  PlusCircle,
} from 'lucide-react-native';

// Initial mock data for Workers and Validators with username and password
const INITIAL_WORKERS = [
  {
    id: 'w1',
    name: 'Alice Dupont',
    role: 'Ouvrière',
    position: 'Électricienne',
    contact: '06 12 34 56 78',
    email: 'alice.dupont@example.com',
    credentials: 'Certif. élec. 2022',
    username: 'alice.dupont',
    password: 'pass1234',
    image:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800&h=400',
    agencie: 'societe1',
  },
  {
    id: 'w2',
    name: 'Bob Martin',
    role: 'Technicien',
    position: 'Plombier',
    contact: '07 98 76 54 32',
    email: 'bob.martin@example.com',
    credentials: 'Brevet pro plomberie',
    username: 'bob.martin',
    password: 'secret987',
    image:
      'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=800&h=400',
    agencie: 'societe1',
  },
];

const INITIAL_VALIDATORS = [
  {
    id: 'v1',
    name: 'Charlie Durand',
    role: 'Valideur',
    position: 'Responsable Qualité',
    contact: '06 55 44 33 22',
    email: 'charlie.durand@example.com',
    credentials: 'Manager certifié',
    username: 'charlie.durand',
    password: 'admin123',
    image:
      'https://images.unsplash.com/photo-1502767089025-6572583495b9?auto=format&fit=crop&q=80&w=800&h=400',
    agencie: 'societe1',
  },
  {
    id: 'v2',
    name: 'Diane Leroy',
    role: 'Valideuse',
    position: 'Superviseure',
    contact: '06 33 22 11 00',
    email: 'diane.leroy@example.com',
    credentials: 'MBA & Qualité ISO',
    username: 'diane.leroy',
    password: 'iso2022',
    image:
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=800&h=400',
    agencie: 'societe2',
  },
];

// PersonCard component displays information and provides Edit/Delete buttons.
function PersonCard({
  person,
  onEdit,
  onRemove,
}: {
  person: any;
  onEdit: (person: any) => void;
  onRemove: (person: any) => void;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: person.image }}
          style={styles.personImage}
          resizeMode="cover"
        />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.personName}>{person.name}</Text>
        <Text style={styles.personRole}>
          {person.role} – {person.position}
        </Text>
        <View style={styles.infoRow}>
          <User size={16} color="#666666" />
          <Text style={styles.infoText}>@{person.username}</Text>
        </View>
        <View style={styles.infoRow}>
          <Mail size={16} color="#666666" />
          <Text style={styles.infoText}>{person.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Phone size={16} color="#666666" />
          <Text style={styles.infoText}>{person.contact}</Text>
        </View>
        <View style={styles.infoRow}>
          <Info size={16} color="#666666" />
          <Text style={styles.infoText}>{person.credentials}</Text>
        </View>
        <View style={styles.crudButtons}>
          <Pressable style={styles.crudButton} onPress={() => onEdit(person)}>
            <Edit2 size={16} color="#007AFF" />
            <Text style={styles.crudText}>Editer</Text>
          </Pressable>
          <Pressable
            style={[styles.crudButton, styles.deleteButton]}
            onPress={() => onRemove(person)}
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

// Modal Form for creating/editing a person (includes username and password)
function PersonForm({
  visible,
  onClose,
  onSubmit,
  initialData,
  type,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
  type: 'Worker' | 'Validator';
}) {
  const [name, setName] = useState(initialData ? initialData.name : '');
  const [role, setRole] = useState(initialData ? initialData.role : '');
  const [position, setPosition] = useState(
    initialData ? initialData.position : ''
  );
  const [contact, setContact] = useState(
    initialData ? initialData.contact : ''
  );
  const [email, setEmail] = useState(initialData ? initialData.email : '');
  const [credentials, setCredentials] = useState(
    initialData ? initialData.credentials : ''
  );
  const [username, setUsername] = useState(
    initialData ? initialData.username : ''
  );
  const [password, setPassword] = useState(
    initialData ? initialData.password : ''
  );
  const [image, setImage] = useState(
    initialData
      ? initialData.image
      : 'https://via.placeholder.com/800x400.png?text=Image'
  );

  const handleSave = () => {
    if (!name || !role || !username || !password) {
      Alert.alert(
        'Validation',
        'Veuillez renseigner le nom, le rôle, le username et le password'
      );
      return;
    }
    onSubmit({
      id: initialData ? initialData.id : Date.now().toString(),
      name,
      role,
      position,
      contact,
      email,
      credentials,
      username,
      password,
      image,
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
            {initialData ? 'Editer' : 'Ajouter'}{' '}
            {type === 'Worker' ? 'Travailleur' : 'Validateur'}
          </Text>
          <TextInput
            placeholder="Nom"
            value={name}
            onChangeText={setName}
            style={styles.modalInput}
          />
          <TextInput
            placeholder="Rôle"
            value={role}
            onChangeText={setRole}
            style={styles.modalInput}
          />
          <TextInput
            placeholder="Poste (ex: Électricienne)"
            value={position}
            onChangeText={setPosition}
            style={styles.modalInput}
          />
          <TextInput
            placeholder="Contact"
            value={contact}
            onChangeText={setContact}
            style={styles.modalInput}
          />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.modalInput}
          />
          <TextInput
            placeholder="Identifiants / Credentials"
            value={credentials}
            onChangeText={setCredentials}
            style={styles.modalInput}
          />
          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            style={styles.modalInput}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.modalInput}
          />
          <TextInput
            placeholder="URL de l'image"
            value={image}
            onChangeText={setImage}
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

export default function AdminHomePage() {
  const agencie = useAuthStore((state) => state.agencie);
  const workersAg = INITIAL_WORKERS.filter((wk) => wk.agencie == agencie);
  const validatorsAg = INITIAL_VALIDATORS.filter(
    (val) => val.agencie == agencie
  );
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
