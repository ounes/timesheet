import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Calendar, Phone, User, Info } from 'lucide-react-native';

const MOCK_SITES = [
  {
    id: '1',
    name: 'Chantier Paris Centre',
    chef: 'Phillipe Laurent',
    address: '123 Rue de Rivoli, 75001 Paris',
    contact: '01.25.36.98.54',
    startDate: '2024-01-15',
    endDate: '2024-06-30',
    image:
      'https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a?auto=format&fit=crop&q=80&w=800&h=400',
    notes: 'Prendre la A46',
  },
];

function SiteCard({ site }: { site: (typeof MOCK_SITES)[0] }) {
  return (
    <View style={styles.siteCard}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: site.image }}
          style={styles.siteImage}
          resizeMode="cover"
        />
      </View>
      <View style={styles.siteContent}>
        <Text style={styles.siteName}>{site.name}</Text>
        <View style={styles.siteInfo}>
          <User size={16} color="#666666" />
          <Text style={styles.siteAddress}>{site.chef}</Text>
        </View>
        <View style={styles.siteInfo}>
          <MapPin size={16} color="#666666" />
          <Text style={styles.siteAddress}>{site.address}</Text>
        </View>
        <View style={styles.siteInfo}>
          <Phone size={16} color="#666666" />
          <Text style={styles.siteAddress}>{site.contact}</Text>
        </View>
        <View style={styles.siteInfo}>
          <View style={styles.dateInfo}>
            <Calendar size={16} color="#666666" />
            <Text style={styles.dateText}>
              {new Date(site.startDate).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
              })}
              {' - '}
              {new Date(site.endDate).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </Text>
          </View>
        </View>
        <View style={styles.dateContainer}>
          <View style={styles.siteInfo}>
            <Info size={16} color="#666666" />
            <Text style={styles.siteAddress}>{site.notes}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function SitesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Sites</Text>
          <Text style={styles.subtitle}>Vos sites en cours</Text>
        </View>

        <View style={styles.sitesContainer}>
          {MOCK_SITES.map((site) => (
            <SiteCard key={site.id} site={site} />
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
  sitesContainer: {
    padding: 20,
    gap: 20,
  },
  siteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  imageContainer: {
    height: 200,
    width: '100%',
    backgroundColor: '#F5F5F5',
  },
  siteImage: {
    width: '100%',
    height: '100%',
  },
  siteContent: {
    padding: 16,
  },
  siteName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  siteInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  siteAddress: {
    fontSize: 14,
    color: '#666666',
    flex: 1,
  },
  dateContainer: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
  },
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateText: {
    fontSize: 14,
    color: '#666666',
  },
});
