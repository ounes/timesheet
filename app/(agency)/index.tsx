import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Clock,
  CircleAlert as AlertCircle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  User,
  Info,
} from 'lucide-react-native';
import { useAuthStore } from '@/store/auth';
import { useState, useMemo } from 'react';

// MOCK DATA
const MOCK_WORKERS = [
  { id: 'w1', name: 'Alice Dupont', agency: 'societe1' },
  { id: 'w2', name: 'Bob Martin', agency: 'societe1' },
  { id: 'w3', name: 'Charlie Durand', agency: 'societe2' },
];

const MOCK_TIMESHEETS = [
  {
    id: '1',
    date: '2025-03-19',
    siteId: '1',
    hours: 8,
    hoursSup: 1,
    notes: 'Installation des équipements électriques',
    status: 'Validé',
    idWorker: 'w1',
  },
  {
    id: '2',
    date: '2025-03-18',
    siteId: '2',
    hours: 7.5,
    hoursSup: 0,
    notes: 'Réunion de coordination',
    status: 'En attente',
    idWorker: 'w1',
  },
  {
    id: '3',
    date: '2025-03-17',
    siteId: '3',
    hours: 8.5,
    hoursSup: 2,
    notes: 'Maintenance préventive',
    status: 'Validé',
    idWorker: 'w2',
  },
  {
    id: '4',
    date: '2025-03-10',
    siteId: '1',
    hours: 9,
    hoursSup: 0,
    notes: 'Inspection',
    status: 'En attente',
    idWorker: 'w3',
  },
];

function KPICard({
  icon,
  title,
  value,
  subtitle,
  accentColor = '#007AFF',
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle?: string;
  accentColor?: string;
}) {
  return (
    <View style={[styles.kpiCard, { borderLeftColor: accentColor }]}>
      <View style={styles.kpiIconContainer}>{icon}</View>
      <View style={styles.kpiContent}>
        <Text style={styles.kpiTitle}>{title}</Text>
        <Text style={styles.kpiValue}>{value}</Text>
        {subtitle && <Text style={styles.kpiSubtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
}

// Helper functions for date filtering
function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - (day === 0 ? 6 : day - 1);
  return new Date(d.setDate(diff));
}

function getStartOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getEndOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export default function AdminDashboardScreen() {
  const agency = useAuthStore((state) => state.agency);
  const workers = MOCK_WORKERS.filter((wk) => wk.agency === agency);
  const timesheets = MOCK_TIMESHEETS.filter((ts) =>
    workers.some((worker) => worker.id === ts.idWorker)
  );

  // Filter option: "All", "Week", or "Month"
  const [dateFilter, setDateFilter] = useState<'All' | 'Week' | 'Month'>(
    'Week'
  );
  // New status filter option: "All", "Validé", or "En attente"
  const [statusFilter, setStatusFilter] = useState<
    'All' | 'Validé' | 'En attente'
  >('All');

  // Use memo to filter timesheets based on both date and status filters
  const filteredTimesheets = useMemo(() => {
    const now = new Date();
    let filtered = timesheets;
    if (dateFilter === 'Week') {
      const weekStart = getStartOfWeek(now);
      const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter((ts) => {
        const tsDate = new Date(ts.date);
        return tsDate >= weekStart && tsDate < weekEnd;
      });
    }
    if (dateFilter === 'Month') {
      const monthStart = getStartOfMonth(now);
      const monthEnd = getEndOfMonth(now);
      filtered = filtered.filter((ts) => {
        const tsDate = new Date(ts.date);
        return tsDate >= monthStart && tsDate <= monthEnd;
      });
    }
    if (statusFilter !== 'All') {
      filtered = filtered.filter((ts) => ts.status === statusFilter);
    }
    return filtered;
  }, [dateFilter, statusFilter, timesheets]);

  // KPI computations
  const totalWorkers = workers.length;
  const totalTimesheets = filteredTimesheets.length;
  const pendingTimesheets = filteredTimesheets.filter(
    (ts) => ts.status === 'En attente'
  ).length;
  const validatedTimesheets = filteredTimesheets.filter(
    (ts) => ts.status === 'Validé'
  ).length;
  const declinedTimesheets = filteredTimesheets.filter(
    (ts) => ts.status === 'Refusé'
  ).length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Tableau de bord</Text>
          <Text style={styles.subtitle}>Vue d'ensemble des activités</Text>
        </View>

        {/* Date Filter Options */}
        <View style={styles.filterContainer}>
          {(['Week', 'Month', 'All'] as const).map((opt) => (
            <Pressable
              key={opt}
              style={[
                styles.filterButton,
                dateFilter === opt && styles.filterButtonActive,
              ]}
              onPress={() => setDateFilter(opt)}
            >
              <Text
                style={[
                  styles.filterText,
                  dateFilter === opt && styles.filterTextActive,
                ]}
              >
                {opt === 'All'
                  ? 'Tout'
                  : opt === 'Week'
                  ? 'Cette semaine'
                  : 'Ce mois'}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* KPI Section */}
        <View style={styles.kpiContainer}>
          <KPICard
            icon={<User size={24} color="#007AFF" />}
            title="Nombre de salariés"
            value={totalWorkers.toString()}
            accentColor="#007AFF"
          />
          <KPICard
            icon={<Calendar size={24} color="#007AFF" />}
            title="Nombre de relevés"
            value={totalTimesheets.toString()}
            subtitle={`En attente: ${pendingTimesheets} | Validé: ${validatedTimesheets} | Refusé: ${declinedTimesheets}`}
            accentColor="#F57C00"
          />
        </View>

        {/* Timesheets Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Détails des fiches</Text>

          {/* Status Filter Options */}
          <View style={styles.statusFilterContainer}>
            {(['All', 'En attente', 'Validé', 'Refusé'] as const).map((opt) => (
              <Pressable
                key={opt}
                style={[
                  styles.statusFilterButton,
                  statusFilter === opt && styles.statusFilterButtonActive,
                ]}
                onPress={() => setStatusFilter(opt)}
              >
                <Text
                  style={[
                    styles.statusFilterText,
                    statusFilter === opt && styles.statusFilterTextActive,
                  ]}
                >
                  {opt === 'All' ? 'Tout' : opt}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Timesheet List */}
          <FlatList
            data={filteredTimesheets.sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )}
            renderItem={({ item }) => {
              const worker = workers.find((wk) => wk.id === item.idWorker);
              return (
                <View style={styles.timesheetItem}>
                  {/* Header with worker name, date and hours */}
                  <View style={styles.timesheetHeader}>
                    <Text style={styles.timesheetWorker}>
                      {worker ? worker.name : 'Inconnu'}
                    </Text>
                    <Text style={styles.timesheetDate}>
                      {new Date(item.date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                      })}
                    </Text>
                    <Text style={styles.timesheetHours}>
                      {item.hours + item.hoursSup}h
                    </Text>
                  </View>
                  {/* Status moved below hours */}
                  <Text style={styles.timesheetStatus}>{item.status}</Text>
                  {item.notes && (
                    <Text style={styles.timesheetNotes}>{item.notes}</Text>
                  )}
                </View>
              );
            }}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
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
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 16,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    fontSize: 14,
    color: '#666666',
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  kpiContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  kpiCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderLeftWidth: 4,
  },
  kpiIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  kpiContent: {
    flex: 1,
  },
  kpiTitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 2,
  },
  kpiSubtitle: {
    fontSize: 12,
    color: '#666666',
  },
  section: {
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  statusFilterContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  statusFilterButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
  },
  statusFilterButtonActive: {
    backgroundColor: '#007AFF',
  },
  statusFilterText: {
    fontSize: 14,
    color: '#666666',
  },
  statusFilterTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  timesheetItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  timesheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  timesheetWorker: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    flex: 1,
  },
  timesheetDate: {
    fontSize: 14,
    color: '#333333',
    flex: 1,
    textAlign: 'center',
  },
  timesheetHours: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    flex: 1,
    textAlign: 'right',
  },
  timesheetStatus: {
    fontSize: 14,
    color: '#F57C00',
    fontWeight: '600',
    marginBottom: 4,
  },
  timesheetNotes: {
    fontSize: 14,
    color: '#666666',
    fontStyle: 'italic',
  },
});

export {};
