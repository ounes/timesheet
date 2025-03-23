import React, { useState, useMemo } from 'react';
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
import { Clock, CircleAlert as AlertCircle } from 'lucide-react-native';
import {
  MOCK_SITES,
  MOCK_TIMESHEETS,
  MOCK_TRAJETS,
  MOCK_TRANSPORTS,
} from '@/store/mock_data';
import {
  getEndOfMonth,
  getStartOfMonth,
  getStartOfWeek,
} from '../shared/utils';
import { TimesheetFormData } from '../shared/ui/types';
import { KPICard } from '../shared/business/kpi-card.componenet';
import { TimesheetForm } from '../shared/business/timesheet-form.component';
import { TimesheetItem } from '../shared/business/timesheet-item.component';
import theme from '../shared/ui/theme';
import CustomCalendar from '../shared/business/calendar.component';

export default function DashboardScreen() {
  const userId = useAuthStore((state) => state.id);
  const filteredTimesheet = MOCK_TIMESHEETS.filter(
    (ts) => userId === ts.workerId
  );
  const [showForm, setShowForm] = useState(false);
  const [editingTimesheet, setEditingTimesheet] = useState<TimesheetFormData>();
  const [timesheets, setTimesheets] = useState<TimesheetFormData[]>(filteredTimesheet);
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

  const periodTimesheets = useMemo(
    () =>
      timesheets.filter((ts) => {
        const tsDate = new Date(ts.date);
        return tsDate >= selectedStart && tsDate < selectedEnd;
      }),
    [timesheets, selectedStart, selectedEnd]
  );

  const periodHours = useMemo(() => {
    return periodTimesheets.reduce((acc, curr) => acc + curr.hours, 0);
  }, [periodTimesheets]);

  const periodHoursSup = useMemo(() => {
    return periodTimesheets.reduce((acc, curr) => acc + curr.hoursSup, 0);
  }, [periodTimesheets]);

  const pendingCount = useMemo(() => {
    return periodTimesheets.filter((ts) => ts.status === 'En attente').length;
  }, [periodTimesheets]);

  const sortedTimesheets = useMemo(() => {
    return [...periodTimesheets].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [periodTimesheets]);

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
                notes: data.notes || '',
                panier: data.panier || false,
                trajetId: data.trajetId || '',
                transportId: data.transportId || '',
                workerId: data.workerId || '',
              }
            : ts
        )
      );
      setEditingTimesheet(undefined);
    } else {
      setTimesheets((prev) => [
        {
          id: Date.now().toString(),
          date:
            data.date instanceof Date
              ? data.date.toISOString().split('T')[0]
              : data.date,
          siteId: data.siteId,
          hours: data.hours || 0,
          hoursSup: data.hoursSup || 0,
          notes: data.notes || '',
          status: 'En attente',
          panier: data.panier || false,
          trajetId: data.trajetId || '',
          transportId: data.transportId || '',
          workerId: data.workerId || '',
        },
        ...prev,
      ]);
    }
    setShowForm(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Tableau de Bord</Text>
          <Text style={styles.subtitle}>Aperçu de vos activités</Text>
        </View>

        <CustomCalendar
          initialDate={selectedDate}
          initialViewMode="week"
          onDateChange={(date) => setSelectedDate(date)}
          onViewModeChange={(mode) => setViewMode(mode)}
        />

        {/* KPI Cards */}
        <View style={styles.kpiContainer}>
          <KPICard
            icon={<Clock size={24} color={theme.colors.primary} />}
            title="Heures"
            value={`${periodHours + periodHoursSup}h`}
            subtitle={`dont ${periodHoursSup}h de nuit`}
            accentColor={theme.colors.primary}
          />
          <KPICard
            icon={<AlertCircle size={24} color={theme.colors.accent} />}
            title="En attente"
            value={pendingCount.toString()}
            subtitle="Relevé d'heure"
            accentColor={theme.colors.accent}
          />
        </View>

        {/* Timesheet History Section */}
        <View style={styles.timesheetSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Historique</Text>
            <View style={styles.filterContainer}>
              <Pressable
                style={styles.addButton}
                onPress={() => {
                  setEditingTimesheet(undefined);
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
                setEditingTimesheet(undefined);
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
                sites={MOCK_SITES}
              />
            )}
            keyExtractor={(item) => item.id as string}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scrollView: { flex: 1 },
  header: {
    padding: theme.spacing.large,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: theme.fontSizes.title,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: theme.fontSizes.subtitle,
    color: theme.colors.textSecondary,
  },
  kpiContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: theme.spacing.large,
    marginBottom: theme.spacing.medium,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.large,
    marginBottom: theme.spacing.small,
  },
  navButton: { padding: theme.spacing.small },
  periodLabel: {
    fontSize: theme.fontSizes.periodLabel,
    fontWeight: '600',
    textAlign: 'center',
    color: theme.colors.textPrimary,
  },
  calendarControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.large,
    marginBottom: theme.spacing.small,
  },
  toggleContainer: { flexDirection: 'row' },
  toggleButton: {
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: theme.spacing.small,
    borderRadius: theme.borderRadius,
    backgroundColor: theme.colors.cardBackground,
    marginRight: theme.spacing.small,
  },
  toggleButtonActive: { backgroundColor: theme.colors.primary },
  toggleButtonText: {
    fontSize: theme.fontSizes.button,
    color: theme.colors.textPrimary,
  },
  toggleButtonTextActive: { color: theme.colors.background, fontWeight: '600' },
  resetButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: theme.spacing.small,
    borderRadius: theme.borderRadius,
  },
  resetButtonText: {
    color: theme.colors.background,
    fontSize: theme.fontSizes.button,
    fontWeight: '600',
  },
  calendarContainer: {
    marginHorizontal: theme.spacing.large,
    marginBottom: theme.spacing.medium,
  },
  yearCarouselContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.small,
  },
  yearArrow: { padding: theme.spacing.small },
  yearText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  monthPickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  monthItem: {
    width: '30%',
    padding: theme.spacing.medium,
    marginVertical: theme.spacing.small,
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius,
    alignItems: 'center',
  },
  monthItemSelected: { backgroundColor: theme.colors.primary },
  monthItemText: {
    fontSize: theme.fontSizes.button,
    color: theme.colors.textPrimary,
  },
  monthItemTextSelected: { color: theme.colors.background, fontWeight: '600' },
  timesheetSection: { padding: theme.spacing.large },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.medium,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.sectionTitle,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  filterContainer: { flexDirection: 'row' },
  addButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: theme.spacing.small,
    borderRadius: theme.borderRadius,
  },
  addButtonText: {
    color: theme.colors.background,
    fontSize: theme.fontSizes.button,
    fontWeight: '600',
  },
});

export {};
