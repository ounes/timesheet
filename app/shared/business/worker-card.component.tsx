import { View, Text, StyleSheet } from 'react-native';
import { MapPin, Calendar, Phone, Info, Mail } from 'lucide-react-native';
import { Worker } from '../../../shared/types';

export function WorkerCard({ worker }: { worker: Worker }) {
  return (
    <View style={styles.workerCard}>
      <View style={styles.workerContent}>
        <Text style={styles.workerName}>{worker.name}</Text>
        <View style={styles.workerInfo}>
          <Info size={16} color="#666666" />
          <Text style={styles.workerDetail}>{worker.position}</Text>
        </View>
        <View style={styles.workerInfo}>
          <Phone size={16} color="#666666" />
          <Text style={styles.workerDetail}>{worker.contact}</Text>
        </View>
        <View style={styles.workerInfo}>
          <Mail size={16} color="#666666" />
          <Text style={styles.workerDetail}>{worker.email}</Text>
        </View>
        <View style={styles.workerInfo}>
          <MapPin size={16} color="#666666" />
          <Text style={styles.workerDetail}>{worker.address}</Text>
        </View>
        <View style={styles.workerInfo}>
          <Calendar size={16} color="#666666" />
          <Text style={styles.workerDetail}>
            {new Date(worker.joinDate).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </Text>
        </View>
        <View style={styles.notesContainer}>
          <Info size={16} color="#666666" />
          <Text style={styles.workerDetail}>{worker.notes}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  workerCard: {
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
  workerImage: {
    width: '100%',
    height: '100%',
  },
  workerContent: {
    padding: 16,
  },
  workerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  workerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  workerDetail: {
    fontSize: 14,
    color: '#666666',
    flex: 1,
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
    marginTop: 12,
  },
});
