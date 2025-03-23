import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { User, Phone, Mail, Info, Edit2, Trash2 } from 'lucide-react-native';

export function PersonCard({
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
