import {
  View,
  Text,
  Pressable,
  TextInput,
} from 'react-native';
import {
  Pencil,
  Save,
  X,
  CheckCircle,
  XCircle,
  Trash,
} from 'lucide-react-native';
import { StyleSheet } from 'react-native';
import { Site, TimesheetFormData } from '../ui/types';

export function TimesheetItem({
  item,
  sites,
  onEdit,
  onRemove,
  onRequestStatusChange,
  onStartDecline,
  isDeclining,
  declineNote,
  setDeclineNote,
  confirmDecline,
  cancelDecline,
}: {
  item: TimesheetFormData;
  sites: Site[];
  onEdit: (timesheet: TimesheetFormData) => void;
  onRemove: (timesheet: TimesheetFormData) => void;
  onRequestStatusChange?: (
    timesheet: TimesheetFormData,
    newStatus: string
  ) => void;
  onStartDecline?: (timesheet: TimesheetFormData) => void;
  isDeclining?: boolean;
  declineNote?: string;
  setDeclineNote?: (note: string) => void;
  confirmDecline?: () => void;
  cancelDecline?: () => void;
}) {
  const site = sites.find((s) => s.id === item.siteId);

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
            <Pressable
              style={styles.editButton}
              onPress={() => onRemove(item)}
            >
              <Trash size={16} color="#007AFF" />
            </Pressable>
          </View>
          <Text style={styles.timesheetSite}>{site?.name}</Text>
          <View style={styles.infoItem}>
            {item.transportId ? (
              <CheckCircle size={16} color="green" />
            ) : (
              <XCircle size={16} color="red" />
            )}
            <Text style={styles.infoText}>Transport {item.transportId}</Text>
          </View>
          <View style={styles.infoItem}>
            {item.trajetId ? (
              <CheckCircle size={16} color="green" />
            ) : (
              <XCircle size={16} color="red" />
            )}
            <Text style={styles.infoText}>Trajet {item.trajetId}</Text>
          </View>
          <View style={styles.infoItem}>
            {item.panier ? (
              <CheckCircle size={16} color="green" />
            ) : (
              <XCircle size={16} color="red" />
            )}
            <Text style={styles.infoText}>Panier repas</Text>
          </View>
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
          {item.hoursSup ? (
            <Text style={styles.kpiSubtitle}>
              dont {item.hoursSup}h de nuit
            </Text>
          ) : null}
          {!isDeclining && onStartDecline && onRequestStatusChange && (
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
                onPress={() => onStartDecline(item)}
              >
                <Text style={styles.statusButtonText}>Refuser</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
      {isDeclining && (
        <View style={styles.declineContainer}>
          <TextInput
            style={styles.declineInput}
            value={declineNote}
            onChangeText={setDeclineNote}
            placeholder="Ajouter une note pour le refus..."
            multiline
          />
          <View style={styles.declineActions}>
            <Pressable
              style={[styles.declineButton, styles.cancelDeclineButton]}
              onPress={cancelDecline}
            >
              <X size={20} color="#666666" />
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </Pressable>
            <Pressable
              style={[styles.declineButton, styles.confirmDeclineButton]}
              onPress={confirmDecline}
            >
              <Save size={20} color="#FFFFFF" />
              <Text style={styles.submitButtonText}> Confirmer</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#666666',
    flex: 1,
    marginLeft: 4,
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
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  timesheetHours: {
    paddingTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  kpiSubtitle: {
    fontSize: 12,
    color: '#666666',
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
  declineContainer: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 8,
  },
  declineInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
    backgroundColor: '#F9F9F9',
  },
  declineActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  declineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginLeft: 8,
  },
  cancelDeclineButton: {
    backgroundColor: '#E0E0E0',
  },
  confirmDeclineButton: {
    backgroundColor: '#007AFF',
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
});
