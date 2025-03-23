import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MOCK_WORKERS } from '@/store/mock_data';
import { Worker } from '../shared/ui/types';
import { WorkerCard } from '../shared/business/worker-card.component';

export default function WorkersScreen() {
  const workers = MOCK_WORKERS as Worker[];
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Salariés</Text>
          <Text style={styles.subtitle}>Liste des collaborateurs</Text>
        </View>
        <View style={styles.workersContainer}>
          {workers.map((worker) => (
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
});

export {};
