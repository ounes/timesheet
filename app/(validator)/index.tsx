import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  FlatList,
  TextInput,
  Platform,
  Modal,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  CircleAlert as AlertCircle,
  Calendar,
  Pencil,
  Trash,
  Save,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Building2,
  Info,
} from 'lucide-react-native';
import { useState, useMemo } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';

const MOCK_SITES = [
  {
    id: '1',
    name: 'Chantier Paris Centre',
    type: 'Chantier',
    address: '123 Rue de Rivoli, 75001 Paris',
  },
  {
    id: '2',
    name: 'Bureau Lyon',
    type: 'Bureau',
    address: '45 Avenue Jean Jaurès, 69007 Lyon',
  },
  {
    id: '3',
    name: 'Site Marseille Port',
    type: 'Site Industriel',
    address: '88 Quai du Port, 13002 Marseille',
  },
];

const MOCK_WORKERS = [
  { id: 'w1', name: 'Alice Dupont' },
  { id: 'w2', name: 'Bob Martin' },
  { id: 'w3', name: 'Charlie Durand' },
];

// Note: Added workerId field to the timesheets.
const MOCK_TIMESHEETS = [
  {
    id: '1',
    workerId: 'w1',
    date: '2025-03-19',
    siteId: '1',
    hours: 8,
    hoursSup: 1,
    notes: 'Installation des équipements électriques',
    status: 'En attente',
    panier: false,
    trajetId: '',
    transportId: '',
  },
  {
    id: '2',
    workerId: 'w2',
    date: '2025-03-18',
    siteId: '2',
    hours: 7.5,
    hoursSup: 0,
    notes: 'Réunion de coordination',
    status: 'En attente',
    panier: false,
    trajetId: '',
    transportId: '',
  },
  {
    id: '3',
    workerId: 'w1',
    date: '2025-03-17',
    siteId: '3',
    hours: 8.5,
    hoursSup: 2,
    notes: 'Maintenance préventive',
    status: 'Validé',
    panier: false,
    trajetId: '',
    transportId: '',
  },
];

const MOCK_TRAJETS = Array.from({ length: 8 }, (_, i) => ({
  id: (i + 1).toString(),
  label: `Trajet ${i + 1}`,
}));

const MOCK_TRANSPORTS = Array.from({ length: 8 }, (_, i) => ({
  id: (i + 1).toString(),
  label: `Transport ${i + 1}`,
}));

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

interface TimesheetFormData {
  id?: string;
  date: Date;
  siteId: string;
  hours: string;
  hoursSup: string;
  notes: string;
  panier: boolean;
  trajetId: string;
  transportId: string;
  status?: string;
  workerId?: string;
}

function TimesheetForm({
  onSubmit,
  onCancel,
  initialData,
}: {
  onSubmit: (data: TimesheetFormData) => void;
  onCancel: () => void;
  initialData?: (typeof MOCK_TIMESHEETS)[0];
}) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showSiteSelector, setShowSiteSelector] = useState(false);
  const [showTrajetSelector, setShowTrajetSelector] = useState(false);
  const [showTransportSelector, setShowTransportSelector] = useState(false);

  const [formData, setFormData] = useState<TimesheetFormData>({
    date: initialData ? new Date(initialData.date) : new Date(),
    siteId: initialData?.siteId || '',
    hours: initialData?.hours.toString() || '',
    hoursSup: initialData?.hoursSup.toString() || '',
    notes: initialData?.notes || '',
    panier: initialData?.panier || false,
    trajetId: initialData?.trajetId || '',
    transportId: initialData?.transportId || '',
    workerId: initialData?.workerId,
  });

  const selectedSite = MOCK_SITES.find((site) => site.id === formData.siteId);
  const selectedTrajet = MOCK_TRAJETS.find(
    (trajet) => trajet.id === formData.trajetId
  );
  const selectedTransport = MOCK_TRANSPORTS.find(
    (transport) => transport.id === formData.transportId
  );

  const handleSubmit = () => {
    if (!formData.hours || !formData.siteId) return;
    onSubmit({
      ...formData,
      id: initialData?.id,
    });
  };

  return (
    <View style={styles.formCard}>
      <Text style={styles.formTitle}>
        {initialData
          ? 'Modifier la Feuille de Temps'
          : 'Nouvelle Feuille de Temps'}
      </Text>

      <Pressable
        style={styles.datePickerButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Calendar size={20} color="#666666" />
        <Text style={styles.datePickerText}>
          {formData.date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </Text>
      </Pressable>

      {showDatePicker && Platform.OS !== 'web' && (
        <DateTimePicker
          value={formData.date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate)
              setFormData((prev) => ({ ...prev, date: selectedDate }));
          }}
        />
      )}

      {Platform.OS === 'web' && showDatePicker && (
        <input
          type="date"
          value={formData.date.toISOString().split('T')[0]}
          onChange={(e) => {
            setFormData((prev) => ({
              ...prev,
              date: new Date(e.target.value),
            }));
            setShowDatePicker(false);
          }}
          style={{
            fontSize: 16,
            padding: 8,
            marginBottom: 16,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#E0E0E0',
          }}
        />
      )}

      <View style={styles.formRow}>
        <View style={styles.formLabelContainer}>
          <Text style={styles.formLabel}>Site de Travail</Text>
          <View style={styles.infoContainer}>
            <Info size={16} color="#666666" />
            <Text style={styles.infoText}>
              Sélectionnez le site où vous avez travaillé
            </Text>
          </View>
        </View>
        <Pressable
          style={[
            styles.siteSelector,
            !formData.siteId && styles.siteSelectorEmpty,
          ]}
          onPress={() => setShowSiteSelector(true)}
        >
          {selectedSite ? (
            <View style={styles.selectedSiteContent}>
              <Building2 size={30} color="#333333" />
              <View style={styles.selectedSiteInfo}>
                <Text style={styles.siteSelectorText}>{selectedSite.name}</Text>
                <Text style={styles.siteAddress}>
                  {selectedSite.type} • {selectedSite.address}
                </Text>
              </View>
            </View>
          ) : (
            <Text style={styles.siteSelectorPlaceholder}>
              Sélectionner votre site de travail
            </Text>
          )}
          <ChevronDown size={20} color="#666666" />
        </Pressable>
      </View>

      {/* Modal for Site selection */}
      <Modal
        visible={showSiteSelector}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSiteSelector(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowSiteSelector(false)}
        >
          <View style={styles.modalContent}>
            {MOCK_SITES.map((site) => (
              <Pressable
                key={site.id}
                style={[
                  styles.siteOption,
                  site.id === formData.siteId && styles.siteOptionActive,
                ]}
                onPress={() => {
                  setFormData((prev) => ({ ...prev, siteId: site.id }));
                  setShowSiteSelector(false);
                }}
              >
                <Building2
                  size={20}
                  color={site.id === formData.siteId ? '#007AFF' : '#666666'}
                />
                <View style={styles.siteOptionContent}>
                  <Text
                    style={[
                      styles.siteOptionText,
                      site.id === formData.siteId && styles.siteOptionSelected,
                    ]}
                  >
                    {site.name}
                  </Text>
                  <Text style={styles.siteOptionAddress}>
                    {site.type} • {site.address}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      <View style={styles.formRow}>
        <Text style={styles.formLabel}>Heures</Text>
        <TextInput
          style={styles.formInput}
          value={formData.hours}
          onChangeText={(value) =>
            setFormData((prev) => ({ ...prev, hours: value }))
          }
          keyboardType="numeric"
          placeholder="0.0"
          maxLength={4}
        />
      </View>

      <View style={styles.formRow}>
        <Text style={styles.formLabel}>Heures de nuit</Text>
        <TextInput
          style={styles.formInput}
          value={formData.hoursSup}
          onChangeText={(value) =>
            setFormData((prev) => ({ ...prev, hoursSup: value }))
          }
          keyboardType="numeric"
          placeholder="0.0"
          maxLength={4}
        />
      </View>

      {/* Panier Checkbox */}
      <View style={styles.formRow}>
        <Text style={styles.formLabel}>Panier</Text>
        <Switch
          value={formData.panier}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, panier: value }))
          }
        />
      </View>

      {/* Trajet Selector */}
      <View style={styles.formRow}>
        <Text style={styles.formLabel}>Trajet</Text>
        <Pressable
          style={[
            styles.siteSelector,
            !formData.trajetId && styles.siteSelectorEmpty,
          ]}
          onPress={() => setShowTrajetSelector(true)}
        >
          {selectedTrajet ? (
            <Text style={styles.siteSelectorText}>{selectedTrajet.label}</Text>
          ) : (
            <Text style={styles.siteSelectorPlaceholder}>
              Sélectionner un trajet (optionnel)
            </Text>
          )}
          <ChevronDown size={20} color="#666666" />
        </Pressable>
      </View>

      <Modal
        visible={showTrajetSelector}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTrajetSelector(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowTrajetSelector(false)}
        >
          <View style={styles.modalContent}>
            {MOCK_TRAJETS.map((trajet) => (
              <Pressable
                key={trajet.id}
                style={[
                  styles.siteOption,
                  trajet.id === formData.trajetId && styles.siteOptionActive,
                ]}
                onPress={() => {
                  setFormData((prev) => ({
                    ...prev,
                    trajetId: trajet.id,
                  }));
                  setShowTrajetSelector(false);
                }}
              >
                <Text
                  style={[
                    styles.siteOptionText,
                    trajet.id === formData.trajetId &&
                      styles.siteOptionSelected,
                  ]}
                >
                  {trajet.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* Transport Selector */}
      <View style={styles.formRow}>
        <Text style={styles.formLabel}>Transport</Text>
        <Pressable
          style={[
            styles.siteSelector,
            !formData.transportId && styles.siteSelectorEmpty,
          ]}
          onPress={() => setShowTransportSelector(true)}
        >
          {selectedTransport ? (
            <Text style={styles.siteSelectorText}>
              {selectedTransport.label}
            </Text>
          ) : (
            <Text style={styles.siteSelectorPlaceholder}>
              Sélectionner un transport (optionnel)
            </Text>
          )}
          <ChevronDown size={20} color="#666666" />
        </Pressable>
      </View>

      <Modal
        visible={showTransportSelector}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTransportSelector(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowTransportSelector(false)}
        >
          <View style={styles.modalContent}>
            {MOCK_TRANSPORTS.map((transport) => (
              <Pressable
                key={transport.id}
                style={[
                  styles.siteOption,
                  transport.id === formData.transportId &&
                    styles.siteOptionActive,
                ]}
                onPress={() => {
                  setFormData((prev) => ({
                    ...prev,
                    transportId: transport.id,
                  }));
                  setShowTransportSelector(false);
                }}
              >
                <Text
                  style={[
                    styles.siteOptionText,
                    transport.id === formData.transportId &&
                      styles.siteOptionSelected,
                  ]}
                >
                  {transport.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      <View style={styles.formRow}>
        <Text style={styles.formLabel}>Notes</Text>
        <TextInput
          style={[styles.formInput, styles.formTextArea]}
          value={formData.notes}
          onChangeText={(value) =>
            setFormData((prev) => ({ ...prev, notes: value }))
          }
          placeholder="Ajouter des notes (optionnel)"
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.formActions}>
        <Pressable
          style={[styles.formButton, styles.cancelButton]}
          onPress={onCancel}
        >
          <X size={20} color="#666666" />
          <Text style={styles.cancelButtonText}>Annuler</Text>
        </Pressable>
        <Pressable
          style={[
            styles.formButton,
            styles.submitButton,
            (!formData.hours || !formData.siteId) &&
              styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!formData.hours || !formData.siteId}
        >
          <Save size={20} color="#FFFFFF" />
          <Text style={styles.submitButtonText}>
            {initialData ? 'Enregistrer' : 'Ajouter'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function TimesheetItem({
  item,
  onEdit,
  onRemove,
  onRequestStatusChange,
}: {
  item: (typeof MOCK_TIMESHEETS)[0];
  onEdit: (timesheet: (typeof MOCK_TIMESHEETS)[0]) => void;
  onRemove: (timesheet: (typeof MOCK_TIMESHEETS)[0]) => void;
  onRequestStatusChange: (
    timesheet: (typeof MOCK_TIMESHEETS)[0],
    newStatus: string
  ) => void;
}) {
  const site = MOCK_SITES.find((s) => s.id === item.siteId);

  return (
    <View style={styles.timesheetItem}>
      <View style={styles.timesheetMain}>
        <View style={styles.timesheetContent}>
          <View style={styles.timesheetHeader}>
            <Text style={styles.timesheetDate}>
              {new Date(item.date).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
              })}
            </Text>
            <View style={styles.timesheetHeader}>
              <Pressable style={styles.editButton} onPress={() => onEdit(item)}>
                <Pencil size={16} color="#007AFF" />
              </Pressable>
            </View>
          </View>
          <Text style={styles.timesheetSite}>{site?.name}</Text>
          {item.notes ? (
            <Text style={styles.timesheetNotes}>{item.notes}</Text>
          ) : null}
        </View>
        <View style={styles.timesheetRight}>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  item.status === 'Validé'
                    ? '#E8F5E9'
                    : item.status === 'Refusé'
                    ? '#FFEBEE'
                    : '#FFF3E0',
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                {
                  color:
                    item.status === 'Validé'
                      ? '#2E7D32'
                      : item.status === 'Refusé'
                      ? '#C62828'
                      : '#F57C00',
                },
              ]}
            >
              {item.status}
            </Text>
          </View>
          <Text style={styles.timesheetHours}>
            {item.hours + item.hoursSup}h
          </Text>
          <View style={styles.actionButtons}>
            <Pressable
              style={[styles.statusButton, { backgroundColor: '#2E7D32' }]}
              onPress={() =>
                onRequestStatusChange(
                  item,
                  item.status === 'Validé' ? 'En attente' : 'Validé'
                )
              }
            >
              <Text style={styles.statusButtonText}>
                {item.status === 'Validé' ? 'Dévalider' : 'Valider'}
              </Text>
            </Pressable>
            <Pressable
              style={[styles.statusButton, { backgroundColor: '#C62828' }]}
              onPress={() =>
                onRequestStatusChange(
                  item,
                  item.status === 'Refusé' ? 'En attente' : 'Refusé'
                )
              }
            >
              <Text style={styles.statusButtonText}>
                {item.status === 'Refusé' ? 'Annuler refus' : 'Refuser'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

// Helper functions for week navigation
function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  // In France, the week starts on Monday. If Sunday (0), go back 6 days.
  const diff = d.getDate() - (day === 0 ? 6 : day - 1);
  return new Date(d.setDate(diff));
}

function formatWeekLabel(weekStart: Date): string {
  const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000);
  return `Semaine du ${weekStart.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
  })} au ${weekEnd.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
  })}`;
}

export default function DashboardScreen() {
  const [showForm, setShowForm] = useState(false);
  const [editingTimesheet, setEditingTimesheet] = useState<
    (typeof MOCK_TIMESHEETS)[0] | null
  >(null);
  const [timesheets, setTimesheets] = useState(MOCK_TIMESHEETS);
  const [selectedWeek, setSelectedWeek] = useState(getStartOfWeek(new Date()));
  // Selected worker; when null, show the list of workers like a conversation thread
  const [selectedWorker, setSelectedWorker] = useState<
    (typeof MOCK_WORKERS)[0] | null
  >(null);
  // Modal state for entering decline note.
  const [declineModalVisible, setDeclineModalVisible] = useState(false);
  const [declineNote, setDeclineNote] = useState('');
  const [timesheetToDecline, setTimesheetToDecline] = useState<
    (typeof MOCK_TIMESHEETS)[0] | null
  >(null);

  // Compute week boundaries
  const weekEnd = new Date(selectedWeek.getTime() + 7 * 24 * 60 * 60 * 1000);

  // Global timesheets pending (for KPI) using all workers.
  const globalPendingCount = useMemo(() => {
    return timesheets.filter((ts) => ts.status === 'En attente').length;
  }, [timesheets]);

  // Filter timesheets based on the selected week
  const weeklyTimesheets = useMemo(() => {
    return timesheets.filter((ts) => {
      const tsDate = new Date(ts.date);
      return tsDate >= selectedWeek && tsDate < weekEnd;
    });
  }, [timesheets, selectedWeek, weekEnd]);

  // When a worker is selected, filter timesheets for that worker.
  const workerWeeklyTimesheets = useMemo(() => {
    if (!selectedWorker) return [];
    return weeklyTimesheets.filter((ts) => ts.workerId === selectedWorker.id);
  }, [weeklyTimesheets, selectedWorker]);

  const weeklyHours = useMemo(() => {
    return workerWeeklyTimesheets.reduce((acc, curr) => acc + curr.hours, 0);
  }, [workerWeeklyTimesheets]);

  const weeklyHoursSup = useMemo(() => {
    return workerWeeklyTimesheets.reduce((acc, curr) => acc + curr.hoursSup, 0);
  }, [workerWeeklyTimesheets]);

  // For the worker list, compute pending counts per worker for the selected week.
  const workersWithPending = useMemo(() => {
    return MOCK_WORKERS.map((worker) => {
      const count = weeklyTimesheets.filter(
        (ts) => ts.workerId === worker.id && ts.status === 'En attente'
      ).length;
      return { ...worker, pending: count };
    });
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
      // Update existing timesheet
      setTimesheets((prev) =>
        prev.map((ts) =>
          ts.id === editingTimesheet.id
            ? {
                ...ts,
                date: data.date.toISOString().split('T')[0],
                siteId: data.siteId,
                hours: parseFloat(data.hours) || 0,
                hoursSup: parseFloat(data.hoursSup) || 0,
                notes: data.notes,
                panier: data.panier || false,
                trajetId: data.trajetId,
                transportId: data.transportId,
              }
            : ts
        )
      );
      setEditingTimesheet(null);
    } else {
      // Add new timesheet – ensure it is linked to the selected worker (if any)
      setTimesheets((prev) => [
        {
          id: Date.now().toString(),
          workerId: selectedWorker?.id || 'w1',
          date: data.date.toISOString().split('T')[0],
          siteId: data.siteId,
          hours: parseFloat(data.hours) || 0,
          hoursSup: parseFloat(data.hoursSup) || 0,
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

  // This function is triggered when user clicks on Validate or Refuse button.
  // If the new status is "Refusé", we open a modal to let user enter a decline note.
  const requestStatusChange = (
    timesheet: (typeof MOCK_TIMESHEETS)[0],
    newStatus: string
  ) => {
    if (newStatus === 'Refusé' && timesheet.status !== 'Refusé') {
      setTimesheetToDecline(timesheet);
      setDeclineNote('');
      setDeclineModalVisible(true);
    } else {
      // For validation or reverting a declined timesheet.
      setTimesheets((prev) =>
        prev.map((ts) =>
          ts.id === timesheet.id ? { ...ts, status: newStatus } : ts
        )
      );
    }
  };

  const confirmDecline = () => {
    if (timesheetToDecline) {
      // Append the decline note to the timesheet notes.
      setTimesheets((prev) =>
        prev.map((ts) =>
          ts.id === timesheetToDecline.id
            ? {
                ...ts,
                status: 'Refusé',
                notes: `${ts.notes} - Note: ${declineNote}`,
              }
            : ts
        )
      );
      setDeclineModalVisible(false);
      setTimesheetToDecline(null);
    }
  };

  // If no worker is selected, show the list of workers as conversation threads.
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
              <Text style={[styles.backButton]}>Retour</Text>
            </Pressable>
          </View>
        )}

        {/* Week Navigation */}
        {!selectedWorker && (
          <View style={styles.weekNavigation}>
            <Pressable
              onPress={handlePreviousWeek}
              style={styles.weekNavButton}
            >
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

        {/* Global KPI: Pending timesheets count */}
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
          // Worker Detail View: List of Timesheets for the Week
          <View style={styles.timesheetSection}>
            {(showForm || editingTimesheet) && (
              <TimesheetForm
                onSubmit={handleSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setEditingTimesheet(null);
                }}
                initialData={editingTimesheet || undefined}
              />
            )}
            <FlatList
              data={workerWeeklyTimesheets.sort(
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
                  onRequestStatusChange={requestStatusChange}
                />
              )}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        ) : (
          // Worker List View: Conversation-style list.
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

      {/* Modal for entering decline note */}
      <Modal
        visible={declineModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setDeclineModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Ajouter une note pour le refus
            </Text>
            <TextInput
              style={styles.modalInput}
              value={declineNote}
              onChangeText={setDeclineNote}
              placeholder="Saisissez votre note ici..."
              multiline
            />
            <View style={styles.modalActions}>
              <Pressable
                style={[styles.formButton, styles.cancelButton]}
                onPress={() => setDeclineModalVisible(false)}
              >
                <X size={20} color="#666666" />
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </Pressable>
              <Pressable
                style={[styles.formButton, styles.submitButton]}
                onPress={confirmDecline}
              >
                <Save size={20} color="#FFFFFF" />
                <Text style={styles.submitButtonText}>Confirmer</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderLeftWidth: 4,
    marginBottom: 16,
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
  timesheetSection: {
    padding: 20,
  },
  sectionHeader: {
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  workerItem: {
    padding: 16,
    backgroundColor: '#F5F5F5',
    justifyContent: 'space-between',
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  workerName: {
    fontSize: 16,
    color: '#333333',
  },
  workerMessage: {
    fontSize: 14,
    color: '#F57C00',
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
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  statusButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  statusButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    width: '100%',
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333333',
  },
  modalInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333333',
    height: 80,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
});

export {};
