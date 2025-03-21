import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/auth';
import {
  Clock,
  CircleAlert as AlertCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react-native';
import { useState, useMemo } from 'react';
import { MOCK_SITES, MOCK_TIMESHEETS, MOCK_TRAJETS, MOCK_TRANSPORTS } from '@/store/mock_data';
import { formatWeekLabel, getStartOfWeek } from '../shared/utils';
import { TimesheetFormData } from '../shared/types';
import { KPICard } from '../shared/business/kpi-card/kpi-card.componenet';
import { TimesheetForm } from '../shared/business/timesheet-form/timesheet-form.component';
import { TimesheetItem } from '../shared/business/timesheet-item-employee/timesheet-item-employee.component';

export default function DashboardScreen() {
  const userId = useAuthStore((state) => state.id);
  const filteredTimesheet = MOCK_TIMESHEETS.filter((ts) => userId === ts.workerId);
  const [showForm, setShowForm] = useState(false);
  const [editingTimesheet, setEditingTimesheet] = useState<
    (typeof MOCK_TIMESHEETS)[0] | null
  >(null);
  const [timesheets, setTimesheets] = useState(filteredTimesheet);
  const [selectedWeek, setSelectedWeek] = useState(getStartOfWeek(new Date()));

  const weekEnd = new Date(selectedWeek.getTime() + 7 * 24 * 60 * 60 * 1000);

  const weeklyTimesheets = useMemo(() => {
    return timesheets.filter((ts) => {
      const tsDate = new Date(ts.date);
      return tsDate >= selectedWeek && tsDate < weekEnd;
    });
  }, [timesheets, selectedWeek, weekEnd]);

  const weeklyHours = useMemo(() => {
    return weeklyTimesheets.reduce((acc, curr) => acc + curr.hours, 0);
  }, [weeklyTimesheets]);

  const weeklyHoursSup = useMemo(() => {
    return weeklyTimesheets.reduce((acc, curr) => acc + curr.hoursSup, 0);
  }, [weeklyTimesheets]);

  const pendingCount = useMemo(() => {
    return weeklyTimesheets.filter(
      (timesheet) => timesheet.status === 'En attente'
    ).length;
  }, [weeklyTimesheets]);

  const sortedTimesheets = useMemo(() => {
    return [...weeklyTimesheets].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [weeklyTimesheets]);

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
              notes: data.notes || '',
              panier: data.panier || false,
              trajetId: data.trajetId || '',
              transportId: data.transportId || '',
              workerId: data.workerId || ''
            }
            : ts
        )
      );
      setEditingTimesheet(null);
    } else {
      setTimesheets((prev) => [
        {
          id: Date.now().toString(),
          date: data.date instanceof Date ? data.date.toISOString().split('T')[0] : data.date,
          siteId: data.siteId,
          hours: data.hours || 0,
          hoursSup: data.hoursSup || 0,
          notes: data.notes || '',
          status: 'En attente',
          panier: data.panier || false,
          trajetId: data.trajetId || '',
          transportId: data.transportId || '',
          workerId: data.workerId || ''
        },
        ...prev,
      ]);
    }
    setShowForm(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Tableau de Bord</Text>
          <Text style={styles.subtitle}>Aperçu de vos activités</Text>
        </View>

        <View style={styles.weekNavigation}>
          <Pressable onPress={handlePreviousWeek} style={styles.weekNavButton}>
            <ChevronLeft size={24} color="#007AFF" />
          </Pressable>
          <Text style={styles.weekLabel}>{formatWeekLabel(selectedWeek)}</Text>
          <Pressable onPress={handleNextWeek} style={styles.weekNavButton}>
            <ChevronRight size={24} color="#007AFF" />
          </Pressable>
          <Pressable onPress={handleThisWeek} style={styles.thisWeekButton}>
            <Text style={styles.thisWeekText}>Cette semaine</Text>
          </Pressable>
        </View>

        <View style={styles.kpiContainer}>
          <KPICard
            icon={<Clock size={24} color="#007AFF" />}
            title="Heures cette semaine"
            value={`${weeklyHours + weeklyHoursSup}h`}
            subtitle={`dont ${weeklyHoursSup}h de nuit`}
            accentColor="#007AFF"
          />
          <KPICard
            icon={<AlertCircle size={24} color="#F57C00" />}
            title="En attente de validation"
            value={pendingCount.toString()}
            subtitle="Relevé d'heure"
            accentColor="#F57C00"
          />
        </View>

        <View style={styles.timesheetSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Historique</Text>
            <View style={styles.filterContainer}>
              <Pressable
                style={styles.addButton}
                onPress={() => {
                  setEditingTimesheet(null);
                  setShowForm(true);
                }}
              >
                <Text style={styles.addButtonText}>Nouvelle entrée</Text>
              </Pressable>
            </View>
          </View>

          {(showForm || editingTimesheet) && (
            <TimesheetForm
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingTimesheet(null);
              }}
              initialData={editingTimesheet || undefined}
              sites={MOCK_SITES}
              trajets={MOCK_TRAJETS}
              transports={MOCK_TRANSPORTS}
            />
          )}

          <FlatList
            data={sortedTimesheets}
            renderItem={({ item }) => (
              <TimesheetItem
                item={item}
                onEdit={(timesheet) => {
                  setEditingTimesheet(timesheet);
                  setShowForm(true);
                }}
                onRemove={(timesheet) => {
                  setTimesheets((prevTimesheets) =>
                    prevTimesheets.filter((time) => time.id !== timesheet.id)
                  );
                }}
              />
            )}
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
  timesheetSection: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    marginBottom: 16,
  },
  datePickerText: {
    fontSize: 16,
    color: '#333333',
  },
  webDatePicker: {
    fontSize: 16,
    padding: 8,
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  formRow: {
    marginBottom: 16,
  },
  formLabelContainer: {
    marginBottom: 8,
  },
  formLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#666666',
    flex: 1,
  },
  formInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333333',
  },
  formTextArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  siteSelector: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  siteSelectorEmpty: {
    borderStyle: 'dashed',
    borderColor: '#999999',
  },
  selectedSiteContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  selectedSiteInfo: {
    flex: 1,
  },
  siteSelectorText: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 2,
  },
  siteAddress: {
    fontSize: 12,
    color: '#666666',
  },
  siteSelectorPlaceholder: {
    fontSize: 16,
    color: '#999999',
    flex: 1,
  },
  selectorList: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginTop: 8,
  },
  siteOption: {
    padding: 12,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  siteOptionActive: {
    backgroundColor: '#F0F9FF',
  },
  siteOptionContent: {
    flex: 1,
  },
  siteOptionText: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 2,
  },
  siteOptionAddress: {
    fontSize: 12,
    color: '#666666',
  },
  siteOptionSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 16,
  },
  formButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
  submitButtonDisabled: {
    backgroundColor: '#CCE0FF',
  },
  cancelButtonText: {
    color: '#666666',
    fontSize: 14,
    fontWeight: '600',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  timesheetItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  timesheetMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  timesheetContent: {
    flex: 1,
  },
  timesheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timesheetDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  editButton: {
    padding: 4,
  },
  timesheetSite: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  timesheetNotes: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
    fontStyle: 'italic',
  },
  timesheetRight: {
    alignItems: 'flex-end',
  },
  timesheetHours: {
    paddingTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export { };
