import {
  View,
  Text,
  Pressable,
  StyleSheet
} from 'react-native';
import { useAuthStore } from '@/store/auth';
import { MOCK_SITES, MOCK_TIMESHEETS } from '@/store/mock_data';
import { Pencil, Trash } from 'lucide-react-native';

export function TimesheetItem({
  item,
  onEdit,
  onRemove,
}: {
  item: (typeof MOCK_TIMESHEETS)[0];
  onEdit: (timesheet: (typeof MOCK_TIMESHEETS)[0]) => void;
  onRemove: (timesheet: (typeof MOCK_TIMESHEETS)[0]) => void;
}) {
  const agencyId = useAuthStore((state) => state.agencyId);
  const filteredSites = MOCK_SITES.filter((site) => agencyId === site.agencyId);
  const site = filteredSites.find((s) => s.id === item.siteId);

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
            {item.status === 'En attente' && (
              <View style={styles.timesheetHeader}>
                <Pressable
                  style={styles.editButton}
                  onPress={() => onEdit(item)}
                >
                  <Pencil size={16} color="#007AFF" />
                </Pressable>
                <Pressable
                  style={styles.editButton}
                  onPress={() => onRemove(item)}
                >
                  <Trash size={16} color="#007AFF" />
                </Pressable>
              </View>
            )}
          </View>
          <Text style={styles.timesheetSite}>{site?.name}</Text>
          {item.notes && (
            <Text style={styles.timesheetNotes}>{item.notes}</Text>
          )}
        </View>
        <View style={styles.timesheetRight}>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  item.status === 'Validé' ? '#E8F5E9' : '#FFF3E0',
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                {
                  color: item.status === 'Validé' ? '#2E7D32' : '#F57C00',
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
        </View>
      </View>
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
});
