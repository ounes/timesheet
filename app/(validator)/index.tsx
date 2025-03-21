import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CircleAlert as AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useState, useMemo } from 'react';
import { formatWeekLabel, getStartOfWeek } from '../shared/utils';
import { KPICard } from '../shared/business/kpi-card/kpi-card.componenet';
import { TimesheetForm } from '../shared/business/timesheet-form/timesheet-form.component';
import { TimesheetItem } from '../shared/business/timesheet-item/timesheet-item.component';
import { StateActionWorker, TimesheetFormData } from '../shared/types';
import { MOCK_SITES, MOCK_TIMESHEETS, MOCK_TRAJETS, MOCK_TRANSPORTS, MOCK_WORKERS } from '../../store/mock_data';

export default function DashboardScreen() {
  const [showForm, setShowForm] = useState(false);
  const [editingTimesheet, setEditingTimesheet] = useState<TimesheetFormData | null>(null);
  const [timesheets, setTimesheets] = useState(MOCK_TIMESHEETS);
  const [selectedWeek, setSelectedWeek] = useState(getStartOfWeek(new Date()));
  const [selectedWorker, setSelectedWorker] = useState<StateActionWorker | null>(null);
  const [timesheetToDecline, setTimesheetToDecline] = useState<TimesheetFormData | null>(null);
  const [declineNote, setDeclineNote] = useState('');

  const weekEnd = new Date(selectedWeek.getTime() + 7 * 24 * 60 * 60 * 1000);

  const globalPendingCount = useMemo(() => {
    return timesheets.filter((ts) => ts.status === 'En attente').length;
  }, [timesheets]);

  const weeklyTimesheets = useMemo(() => {
    return timesheets.filter((ts) => {
      const tsDate = new Date(ts.date);
      return tsDate >= selectedWeek && tsDate < weekEnd;
    });
  }, [timesheets, selectedWeek, weekEnd]);

  const workerWeeklyTimesheets = useMemo(() => {
    if (!selectedWorker) return [];
    return weeklyTimesheets.filter((ts) => ts.workerId === selectedWorker.id);
  }, [weeklyTimesheets, selectedWorker]);

  const workersWithPending = useMemo(() => {
    return MOCK_WORKERS.map((worker) => {
      const count = weeklyTimesheets.filter(
        (ts) => ts.workerId === worker.id && ts.status === 'En attente'
      ).length;
      return { ...worker, pending: count };
    });
  }, [weeklyTimesheets]);

  const displayedTimesheets = workerWeeklyTimesheets.filter(
    (ts) => !editingTimesheet || ts.id !== editingTimesheet.id
  );

  const handlePreviousWeek = () => {
    setSelectedWeek(new Date(selectedWeek.getTime() - 7 * 24 * 60 * 60 * 1000));
  };

  const handleNextWeek = () => {
    setSelectedWeek(new Date(selectedWeek.getTime() + 7 * 24 * 60 * 60 * 1000));
  };

  const handleThisWeek = () => {
    setSelectedWeek(getStartOfWeek(new Date()));
  };

  const handleSubmit = (data: TimesheetFormData) => {
    if (editingTimesheet) {
      setTimesheets((prev) =>
        prev.map((ts) =>
          ts.id === editingTimesheet.id
            ? {
                ...ts,
                date: data.date instanceof Date ? data.date.toISOString().split('T')[0] : data.date,
                siteId: data.siteId,
                hours: data.hours || 0,
                hoursSup: data.hoursSup || 0,
                notes: data.notes,
                status: data.status,
                panier: data.panier || false,
                trajetId: data.trajetId,
                transportId: data.transportId,
              }
            : ts
        )
      );
      setEditingTimesheet(null);
    } else {
      setTimesheets((prev) => [
        {
          id: Date.now().toString(),
          workerId: selectedWorker?.id || 'w1',
          date: data.date instanceof Date ? data.date.toISOString().split('T')[0] : data.date,
          siteId: data.siteId,
          hours: data.hours || 0,
          hoursSup: data.hoursSup || 0,
          notes: data.notes,
          status: 'En attente',
          panier: data.panier || false,
          trajetId: data.trajetId,
          transportId: data.transportId,
        },
        ...prev,
      ]);
    }
    setShowForm(false);
  };

  const startDecline = (timesheet: TimesheetFormData) => {
    setTimesheetToDecline(timesheet);
    setDeclineNote('');
  };

  const confirmDecline = () => {
    if (timesheetToDecline) {
      setTimesheets((prev) =>
        prev.map((ts) =>
          ts.id === timesheetToDecline.id
            ? {
                ...ts,
                status: 'Refusé',
                notes: `${ts.notes}\nNotes de refus : ${declineNote}`,
              }
            : ts
        )
      );
      setTimesheetToDecline(null);
    }
  };

  const cancelDecline = () => {
    setTimesheetToDecline(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Tableau de Bord</Text>
          <Text style={styles.subtitle}>
            {selectedWorker
              ? `Activités de ${selectedWorker.name}`
              : 'Activités des salariés'}
          </Text>
        </View>

        {selectedWorker && (
          <View style={styles.sectionHeader}>
            <Pressable onPress={() => setSelectedWorker(null)}>
              <Text style={styles.backButton}>Retour</Text>
            </Pressable>
          </View>
        )}

        {!selectedWorker && (
          <View style={styles.weekNavigation}>
            <Pressable onPress={handlePreviousWeek} style={styles.weekNavButton}>
              <ChevronLeft size={24} color="#007AFF" />
            </Pressable>
            <Text style={styles.weekLabel}>
              {formatWeekLabel(selectedWeek)}
            </Text>
            <Pressable onPress={handleNextWeek} style={styles.weekNavButton}>
              <ChevronRight size={24} color="#007AFF" />
            </Pressable>
            <Pressable onPress={handleThisWeek} style={styles.thisWeekButton}>
              <Text style={styles.thisWeekText}>Cette semaine</Text>
            </Pressable>
          </View>
        )}

        {!selectedWorker && (
          <View style={styles.kpiContainer}>
            <KPICard
              icon={<AlertCircle size={24} color="#F57C00" />}
              title="En attente de validation"
              value={globalPendingCount.toString()}
              subtitle="Relevé d'heure"
              accentColor="#F57C00"
            />
          </View>
        )}

        {selectedWorker ? (
          <View style={styles.timesheetSection}>
            {(showForm || editingTimesheet) && (
              <TimesheetForm
                onSubmit={handleSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setEditingTimesheet(null);
                }}
                initialData={editingTimesheet}
                sites={MOCK_SITES}
                trajets={MOCK_TRAJETS}
                transports={MOCK_TRANSPORTS}
              />
            )}
            <FlatList
              data={displayedTimesheets.sort(
                (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
              )}
              renderItem={({ item }) => (
                <TimesheetItem
                  item={item}
                  onEdit={(ts) => {
                    setEditingTimesheet(ts);
                    setShowForm(true);
                  }}
                  onRemove={(ts) => {
                    setTimesheets((prev) => prev.filter((t) => t.id !== ts.id));
                  }}
                  onRequestStatusChange={(ts, newStatus) =>
                    setTimesheets((prev) =>
                      prev.map((t) =>
                        t.id === ts.id ? { ...t, status: newStatus } : t
                      )
                    )
                  }
                  onStartDecline={startDecline}
                  isDeclining={timesheetToDecline?.id === item.id}
                  declineNote={declineNote}
                  setDeclineNote={setDeclineNote}
                  confirmDecline={confirmDecline}
                  cancelDecline={cancelDecline}
                  sites={MOCK_SITES}
                />
              )}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        ) : (
          <View style={styles.timesheetSection}>
            <FlatList
              data={workersWithPending}
              renderItem={({ item }) => (
                <Pressable style={styles.workerItem} onPress={() => setSelectedWorker(item)}>
                  <View style={styles.workerItemContent}>
                    <Text style={styles.workerName}>{item.name}</Text>
                  </View>
                  <View style={styles.badgeContainer}>
                    {item.pending > 0 && (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{item.pending}</Text>
                      </View>
                    )}
                    <ChevronRight size={20} color="#666666" />
                  </View>
                </Pressable>
              )}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        )}
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
  sectionHeader: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginLeft: 20,
    padding: 10,
    backgroundColor: '#F1F3F4',
    borderRadius: 4,
  },
  weekNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  weekNavButton: {
    padding: 8,
  },
  weekLabel: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    color: '#333333',
  },
  thisWeekButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  thisWeekText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  kpiContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  timesheetSection: {
    padding: 20,
  },
  workerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  workerItemContent: {
    flex: 1,
  },
  workerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export {};
