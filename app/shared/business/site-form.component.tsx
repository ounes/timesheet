import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  TextInput,
  Alert,
  StyleSheet,
} from 'react-native';
import { Site } from '../../types';

export function SiteForm({
  visible,
  onClose,
  onSubmit,
  initialData,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: Site;
}) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setAddress(initialData.address);
      setNotes(initialData.notes);
    }
  }, [initialData]);

  const handleSave = () => {
    if (!name || !address) {
      Alert.alert('Validation', 'Veuillez renseigner le nom, et l\'adresse');
      return;
    }
    onSubmit({
      id: initialData ? initialData.id : Math.floor(Math.random() * 1000000),
      name,
      address,
      notes,
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
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
            placeholder="Adresse"
            value={address}
            onChangeText={setAddress}
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
              style={[styles.actionButton, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={[styles.actionButtonText, { color: '#666666' }]}>
                Annuler
              </Text>
            </Pressable>
            <Pressable
              style={[styles.actionButton, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={[styles.actionButtonText, { color: '#FFFFFF' }]}>
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
