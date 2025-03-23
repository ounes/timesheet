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
  CircleAlert as AlertCircle,
  ChevronRight,
} from 'lucide-react-native';
import { useState, useMemo } from 'react';
import {
  getEndOfMonth,
  getStartOfMonth,
  getStartOfWeek,
} from '../shared/utils';
import { KPICard } from '../shared/business/kpi-card.componenet';
import { TimesheetForm } from '../shared/business/timesheet-form.component';
import { TimesheetItem } from '../shared/business/timesheet-item.component';
import { StateActionWorker, TimesheetFormData } from '../shared/ui/types';
import {
  MOCK_SITES,
  MOCK_TIMESHEETS,
  MOCK_TRAJETS,
  MOCK_TRANSPORTS,
  MOCK_WORKERS,
} from '../../store/mock_data';
import CustomCalendar from '../shared/business/calendar.component';

export default function DashboardScreen() {
  const [showForm, setShowForm] = useState(false);
  const [editingTimesheet, setEditingTimesheet] = useState<TimesheetFormData>();
  const [timesheets, setTimesheets] = useState(MOCK_TIMESHEETS);
  const [selectedWorker, setSelectedWorker] = useState<StateActionWorker>();
  const [timesheetToDecline, setTimesheetToDecline] =
    useState<TimesheetFormData>();
  const [declineNote, setDeclineNote] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');

  // Determine period boundaries based on the view mode.
  const selectedStart = useMemo(
    () =>
      viewMode === 'week'
        ? getStartOfWeek(selectedDate)
        : getStartOfMonth(selectedDate),
    [viewMode, selectedDate]
  );

  const selectedEnd = useMemo(
    () =>
      viewMode === 'week'
        ? new Date(selectedStart.getTime() + 7 * 24 * 60 * 60 * 1000)
        : getEndOfMonth(selectedStart),
    [viewMode, selectedStart]
  );

  // Use the same periodTimesheets for both worker list and details.
  const periodTimesheets = useMemo(
    () =>
      timesheets.filter((ts) => {
        const tsDate = new Date(ts.date);
        return tsDate >= selectedStart && tsDate < selectedEnd;
      }),
    [timesheets, selectedStart, selectedEnd]
  );

  // When a worker is selected, show only his timesheets for the current period.
  const workerPeriodTimesheets = useMemo(() => {
    if (!selectedWorker) return [];
    return periodTimesheets.filter((ts) => ts.workerId === selectedWorker.id);
  }, [periodTimesheets, selectedWorker]);

  const pendingCount = useMemo(() => {
    return periodTimesheets.filter((ts) => ts.status === 'En attente').length;
  }, [periodTimesheets]);

  // Update pending counts per worker based on the current period.
  const workersWithPending = useMemo(() => {
    return MOCK_WORKERS.map((worker) => {
      const count = periodTimesheets.filter(
        (ts) => ts.workerId === worker.id && ts.status === 'En attente'
      ).length;
      return { ...worker, pending: count };
    });
  }, [periodTimesheets]);

  const displayedTimesheets = workerPeriodTimesheets.filter(
    (ts) => !editingTimesheet || ts.id !== editingTimesheet.id
  );

  const handleSubmit = (data: TimesheetFormData) => {
    if (editingTimesheet) {
      setTimesheets((prev) =>
        prev.map((ts) =>
          ts.id === editingTimesheet.id
            ? {
                ...ts,
                date:
                  data.date instanceof Date
                    ? data.date.toISOString().split('T')[0]
                    : data.date,
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
      setEditingTimesheet(undefined);
    } else {
      setTimesheets((prev) => [
        {
          id: Date.now().toString(),
          workerId: selectedWorker?.id || 'w1',
          date:
            data.date instanceof Date
              ? data.date.toISOString().split('T')[0]
              : data.date,
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
      setTimesheetToDecline(undefined);
    }
  };

  const cancelDecline = () => {
    setTimesheetToDecline(undefined);
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
            <Pressable onPress={() => setSelectedWorker(undefined)}>
              <Text style={styles.backButton}>Retour</Text>
            </Pressable>
          </View>
        )}

        {!selectedWorker && (
          <CustomCalendar
            initialDate={selectedDate}
            initialViewMode="week"
            onDateChange={(date) => setSelectedDate(date)}
            onViewModeChange={(mode) => setViewMode(mode)}
          />
        )}

        {!selectedWorker && (
          <View style={styles.kpiContainer}>
            <KPICard
              icon={<AlertCircle size={24} color="#F57C00" />}
              title="En attente de validation"
              value={pendingCount.toString()}
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
                  setEditingTimesheet(undefined);
                }}
                initialData={editingTimesheet}
                sites={MOCK_SITES}
                trajets={MOCK_TRAJETS}
                transports={MOCK_TRANSPORTS}
              />
            )}
            <FlatList
              data={displayedTimesheets.sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
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
                <Pressable
                  style={styles.workerItem}
                  onPress={() => setSelectedWorker(item)}
                >
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
