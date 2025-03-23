import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  TextInput,
  Alert,
} from 'react-native';

// Modal Form for creating/editing a person (includes username and password)
export function PersonForm({
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
