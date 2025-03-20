import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Download, X, CheckSquare, Square } from 'lucide-react-native';
import { useAuthStore } from '@/store/auth';
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
} from 'date-fns';
import { fr } from 'date-fns/locale';
import * as FileSystem from 'expo-file-system';

// MOCK DATA
const MOCK_WORKERS = [
  { id: 'w1', name: 'Alice Dupont', agencie: 'societe1' },
  { id: 'w2', name: 'Bob Martin', agencie: 'societe1' },
  { id: 'w3', name: 'Charlie Durand', agencie: 'societe2' },
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

// Utility functions
const getDateRange = (filter: 'all' | 'week' | 'month') => {
  const now = new Date();
  switch (filter) {
    case 'week':
      return { start: startOfWeek(now), end: endOfWeek(now) };
    case 'month':
      return { start: startOfMonth(now), end: endOfMonth(now) };
    default:
      return null;
  }
};

const groupByDate = (timesheets: typeof MOCK_TIMESHEETS & { user: any }[]) => {
  return [...timesheets].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

type TimesheetWithUser = (typeof MOCK_TIMESHEETS)[0] & {
  user: { id: string; name: string };
};

const TimesheetList = ({ timesheets }: { timesheets: TimesheetWithUser[] }) => {
  const sortedTimesheets = groupByDate(timesheets);

  const renderListItem = (timesheet: TimesheetWithUser) => (
    <View key={timesheet.id} style={styles.listItem}>
      <View style={styles.listContent}>
        <Text style={styles.listUserName}>
          {timesheet.user ? timesheet.user.name : 'Inconnu'}
        </Text>
        <Text style={styles.listSite}>Chantier {timesheet.siteId}</Text>
        <Text style={styles.listDate}>
          {format(new Date(timesheet.date), 'dd MMM yyyy', { locale: fr })}
        </Text>
      </View>
      <View style={styles.listRight}>
        <Text style={styles.listHours}>{timesheet.hours}h</Text>
        <View
          style={[
            styles.statusBadge,
            timesheet.status === 'Validé' && styles.validStatus,
            timesheet.status === 'Rejeté' && styles.rejectedStatus,
          ]}
        >
          <Text style={styles.statusText}>{timesheet.status}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.documentsWrapper}>
      <View style={styles.listContainer}>
        {sortedTimesheets.map(renderListItem)}
      </View>
    </ScrollView>
  );
};

export default function TimesheetScreen() {
  const agencie = useAuthStore((state) => state.agencie);
  const workers = MOCK_WORKERS.filter((wk) => wk.agencie === agencie);
  const timesheets = MOCK_TIMESHEETS.filter((ts) =>
    workers.some((worker) => worker.id === ts.idWorker)
  );

  // Merge each timesheet with its corresponding worker
  const timesheetsWithUser: TimesheetWithUser[] = timesheets.map((ts) => ({
    ...ts,
    user: workers.find((worker) => worker.id === ts.idWorker) || {
      id: '',
      name: 'Inconnu',
    },
  }));

  const [dateFilter, setDateFilter] = useState<'all' | 'week' | 'month'>('all');
  const [selectedSites, setSelectedSites] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showSiteSelector, setShowSiteSelector] = useState(false);
  const [showUserSelector, setShowUserSelector] = useState(false);

  // Using siteId instead of non-existent "site" property
  const sites = Array.from(new Set(timesheets.map((ts) => ts.siteId)));
  const users = Array.from(new Set(workers.map((wk) => wk.name)));

  const filteredTimesheets = timesheetsWithUser.filter((ts) => {
    const dateRange = getDateRange(dateFilter);
    const inDateRange = dateRange
      ? isWithinInterval(new Date(ts.date), {
          start: dateRange.start,
          end: dateRange.end,
        })
      : true;

    const siteMatch =
      selectedSites.length === 0 || selectedSites.includes(ts.siteId);
    const userMatch =
      selectedUsers.length === 0 || selectedUsers.includes(ts.user.name);

    return inDateRange && siteMatch && userMatch;
  });

  const handleCSVExport = async () => {
    const csvHeader = 'Utilisateur,Poste,Chantier,Date,Heures,Statut\n';
    const csvContent = filteredTimesheets
      .map(
        (ts) =>
          `"${ts.user.name}","N/A","${ts.siteId}",${format(
            new Date(ts.date),
            'dd/MM/yyyy'
          )},${ts.hours},"${ts.status}"`
      )
      .join('\n');

    const csv = csvHeader + csvContent;
    const fileUri = FileSystem.documentDirectory + 'export_timesheets.csv';

    if (Platform.OS !== 'web') {
      await FileSystem.writeAsStringAsync(fileUri, csv, {
        encoding: FileSystem.EncodingType.UTF8,
      });
    }

    // For web download
    if (Platform.OS === 'web') {
      const link = document.createElement('a');
      link.href = fileUri;
      link.download = 'export_timesheets.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const toggleSelection = (
    items: string[],
    setItems: (items: string[]) => void,
    value: string
  ) => {
    if (items.includes(value)) {
      setItems(items.filter((item) => item !== value));
    } else {
      setItems([...items, value]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.mainArea}>
          <View style={styles.header}>
            <Text style={styles.title}>Feuilles de temps</Text>
            <Pressable style={styles.csvButton} onPress={handleCSVExport}>
              <Download size={20} color="#FFF" />
              <Text style={styles.csvButtonText}>Export CSV</Text>
            </Pressable>
          </View>

          {/* Filters */}
          <View style={styles.filterContainer}>
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Période :</Text>
              {(['all', 'week', 'month'] as const).map((f) => (
                <Pressable
                  key={f}
                  style={[
                    styles.filterButton,
                    dateFilter === f && styles.activeFilter,
                  ]}
                  onPress={() => setDateFilter(f)}
                >
                  <Text style={styles.filterText}>
                    {f === 'all' && 'Tous'}
                    {f === 'week' && 'Cette semaine'}
                    {f === 'month' && 'Ce mois'}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.filterGroup}>
              <Pressable
                style={styles.selectorButton}
                onPress={() => setShowSiteSelector(!showSiteSelector)}
              >
                <Text style={styles.filterLabel}>Chantiers :</Text>
                <Text style={styles.selectorCount}>{selectedSites.length}</Text>
              </Pressable>

              <View style={styles.chipsContainer}>
                {selectedSites.map((site) => (
                  <View key={site} style={styles.chip}>
                    <Text style={styles.chipText}>Chantier {site}</Text>
                    <Pressable
                      onPress={() =>
                        toggleSelection(selectedSites, setSelectedSites, site)
                      }
                    >
                      <X size={14} color="#666" />
                    </Pressable>
                  </View>
                ))}
              </View>

              {showSiteSelector && (
                <View style={styles.selectorContainer}>
                  {sites.map((site) => (
                    <Pressable
                      key={site}
                      style={styles.checkboxItem}
                      onPress={() =>
                        toggleSelection(selectedSites, setSelectedSites, site)
                      }
                    >
                      {selectedSites.includes(site) ? (
                        <CheckSquare size={18} color="#3B82F6" />
                      ) : (
                        <Square size={18} color="#666" />
                      )}
                      <Text style={styles.checkboxLabel}>Chantier {site}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.filterGroup}>
              <Pressable
                style={styles.selectorButton}
                onPress={() => setShowUserSelector(!showUserSelector)}
              >
                <Text style={styles.filterLabel}>Utilisateurs :</Text>
                <Text style={styles.selectorCount}>{selectedUsers.length}</Text>
              </Pressable>

              <View style={styles.chipsContainer}>
                {selectedUsers.map((user) => (
                  <View key={user} style={styles.chip}>
                    <Text style={styles.chipText}>{user}</Text>
                    <Pressable
                      onPress={() =>
                        toggleSelection(selectedUsers, setSelectedUsers, user)
                      }
                    >
                      <X size={14} color="#666" />
                    </Pressable>
                  </View>
                ))}
              </View>

              {showUserSelector && (
                <View style={styles.selectorContainer}>
                  {users.map((user) => (
                    <Pressable
                      key={user}
                      style={styles.checkboxItem}
                      onPress={() =>
                        toggleSelection(selectedUsers, setSelectedUsers, user)
                      }
                    >
                      {selectedUsers.includes(user) ? (
                        <CheckSquare size={18} color="#3B82F6" />
                      ) : (
                        <Square size={18} color="#666" />
                      )}
                      <Text style={styles.checkboxLabel}>{user}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          </View>

          <TimesheetList timesheets={filteredTimesheets} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  content: {
    flex: 1,
  },
  mainArea: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  csvButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#3B82F6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  csvButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  selectorCount: {
    backgroundColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  chipText: {
    color: '#374151',
  },
  selectorContainer: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  checkboxLabel: {
    color: '#374151',
  },
  filterContainer: {
    marginBottom: 16,
    gap: 12,
  },
  filterGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
  },
  filterLabel: {
    fontSize: 14,
    color: '#4B5563',
    marginRight: 8,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
  },
  activeFilter: {
    backgroundColor: '#3B82F6',
  },
  filterText: {
    color: '#374151',
  },
  documentsWrapper: {
    flex: 1,
  },
  listContainer: {
    gap: 12,
  },
  listItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listContent: {
    gap: 4,
  },
  listUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  listSite: {
    fontSize: 14,
    color: '#4B5563',
  },
  listDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  listRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  listHours: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
  },
  validStatus: {
    backgroundColor: '#D1FAE5',
  },
  rejectedStatus: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export { TimesheetScreen };
