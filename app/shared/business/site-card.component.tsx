import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MapPin, Info, Edit2, Trash2 } from 'lucide-react-native';
import { Site } from '../ui/types';

export function SiteCard({
  site,
  onEdit,
  onRemove,
}: {
  site: Site;
  onEdit?: (site: Site) => void;
  onRemove?: (site: Site) => void;
}) {
  return (
    <View style={styles.siteCard}>
      <View style={styles.siteContent}>
        <Text style={styles.siteName}>{site.name}</Text>
        <View style={styles.siteInfo}>
          <MapPin size={16} color="#666666" />
          <Text style={styles.siteAddress}>{site.address}</Text>
        </View>
        <View style={styles.dateContainer}>
          <View style={styles.siteInfo}>
            <Info size={16} color="#666666" />
            <Text style={styles.siteAddress}>{site.notes}</Text>
          </View>
        </View>
        {/* CRUD Buttons: Only icons now */}
        {onEdit && onRemove && (
          <View style={styles.iconButtons}>
            <Pressable style={styles.iconButton} onPress={() => onEdit(site)}>
              <Edit2 size={16} color="#007AFF" />
            </Pressable>
            <Pressable
              style={[styles.iconButton, styles.deleteIconButton]}
              onPress={() => onRemove(site)}
            >
              <Trash2 size={16} color="#FFFFFF" />
            </Pressable>
          </View>
        )}
      </View>
    </View>
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
