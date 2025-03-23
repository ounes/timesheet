import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Platform,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight } from 'lucide-react-native';
import { useAuthStore } from '@/store/auth';
import { Site } from '../shared/ui/types';
import { MOCK_AGENCIES, MOCK_SITES, MOCK_WORKERS, REFERENT_INFO } from '@/store/mock_data';
import { ContactSection } from '../shared/business/contact-section.component';
import { SiteCard } from '../shared/business/site-card.component';

type ReferentSectionProps = {
  onSelectReferent: () => void;
};

function ReferentSection({ onSelectReferent }: ReferentSectionProps): JSX.Element {
  return (
    <Pressable style={styles.referentSection} onPress={onSelectReferent}>
      <View style={styles.referentInfo}>
        <Text style={styles.referentName}>{REFERENT_INFO.name}</Text>
        <Text style={styles.referentTitle}>{REFERENT_INFO.title}</Text>
      </View>
      <ChevronRight size={20} color="#666666" />
    </Pressable>
  );
}

export default function SitesScreen(): JSX.Element {
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const userId = useAuthStore((state) => state.id);
  const agencyId = useAuthStore((state) => state.agencyId);
  const agency = MOCK_AGENCIES.find((ag) => ag.id === agencyId);

  // Récupération des sites de l'utilisateur
  const userSites: string[] = MOCK_WORKERS
    .filter((wk) => wk.id.includes(userId as string))
    .flatMap((wk) => wk.siteIds);
  const filteredSites: Site[] = MOCK_SITES.filter(
    (site) => site.agencyId === agencyId && userSites.includes(site.id)
  );

  // Gestion de la sélection du référent
  const handleReferentSelect = (): void => {
    setSelectedContact(selectedContact === REFERENT_INFO.id ? null : REFERENT_INFO.id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Section Informations du Site */}
        <View style={styles.siteInfoSection}>
          <Text style={styles.sectionTitle}>Informations du Site</Text>
          {filteredSites.map((site) => (
            <SiteCard key={site.id} site={site} />
          ))}
        </View>

        {/* Section Références et Contacts */}
        <View style={styles.referencesSection}>
          <Text style={styles.sectionTitle}>Contact sur Site</Text>
          <ReferentSection onSelectReferent={handleReferentSelect} />
          <ContactSection
            contactMail={agency?.email || ''}
            contactPhone={agency?.phone || ''}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 16,
  },
  siteInfoSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  referencesSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  referentSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  referentAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  referentInfo: {
    flex: 1,
  },
  referentName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1565C0',
    marginBottom: 2,
  },
  referentTitle: {
    fontSize: 14,
    color: '#666666',
  },
});
