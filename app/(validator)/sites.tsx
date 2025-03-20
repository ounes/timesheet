import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Calendar, Phone, User, Info, Mail } from 'lucide-react-native';

const MOCK_WORKERS = [
  {
    id: 'w1',
    name: 'Alice Dupont',
    role: 'Chef de chantier',
    position: 'Électricienne',
    contact: '06.12.34.56.78',
    email: 'alice.dupont@example.com',
    address: "12 Rue de l'Industrie, 75010 Paris",
    joinDate: '2023-03-15',
    image:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800&h=400',
    notes: 'Disponible en cas d’urgence',
  },
  {
    id: 'w2',
    name: 'Bob Martin',
    role: 'Technicien',
    position: 'Plombier',
    contact: '07.98.76.54.32',
    email: 'bob.martin@example.com',
    address: '34 Avenue de la République, 69002 Lyon',
    joinDate: '2022-11-01',
    image:
      'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=800&h=400',
    notes: 'Expert en maintenance',
  },
  {
    id: 'w3',
    name: 'Charlie Durand',
    role: 'Ouvrier polyvalent',
    position: 'Maçon',
    contact: '06.55.44.33.22',
    email: 'charlie.durand@example.com',
    address: '78 Boulevard Saint-Germain, 75006 Paris',
    joinDate: '2023-06-20',
    image:
      'https://images.unsplash.com/photo-1502767089025-6572583495b9?auto=format&fit=crop&q=80&w=800&h=400',
    notes: 'Disponible pour missions courts',
  },
];

function WorkerCard({ worker }: { worker: (typeof MOCK_WORKERS)[0] }) {
  return (
    <View style={styles.workerCard}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: worker.image }}
          style={styles.workerImage}
          resizeMode="cover"
        />
      </View>
      <View style={styles.workerContent}>
        <Text style={styles.workerName}>{worker.name}</Text>
        <View style={styles.workerInfo}>
          <User size={16} color="#666666" />
          <Text style={styles.workerDetail}>{worker.role}</Text>
        </View>
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

export default function WorkersScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Salariés</Text>
          <Text style={styles.subtitle}>Liste des collaborateurs</Text>
        </View>
        <View style={styles.workersContainer}>
          {MOCK_WORKERS.map((worker) => (
            <WorkerCard key={worker.id} worker={worker} />
          ))}
        </View>
      </ScrollView>
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
  workersContainer: {
    padding: 20,
    gap: 20,
  },
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

export {};
