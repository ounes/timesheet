import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronRight,
  AlertTriangle,
} from 'lucide-react-native';
import { useState } from 'react';
import { MOCK_MESSAGES, REFERENT_INFO, CONTACT_INFO } from '../../store/mock_data';
import { ChatArea } from '../shared/business/chat-area/chat-area.component';
import { useAuthStore } from '@/store/auth';
import { ContactSection } from '../shared/business/contact-section/contact-section.component';

function AdminBanner() {
  return (
    <View style={styles.adminBanner}>
      <AlertTriangle size={20} color="#B45309" />
      <Text style={styles.adminBannerText}>
        Information importante : Le site sera fermé exceptionnellement ce lundi
        pour maintenance
      </Text>
    </View>
  );
}

function ReferentSection({
  onSelectReferent,
}: {
  onSelectReferent: () => void;
}) {
  return (
    <Pressable style={styles.referentSection} onPress={onSelectReferent}>
      <Image
        source={{ uri: REFERENT_INFO.avatar }}
        style={styles.referentAvatar}
      />
      <View style={styles.referentInfo}>
        <Text style={styles.referentName}>{REFERENT_INFO.name}</Text>
        <Text style={styles.referentTitle}>{REFERENT_INFO.title}</Text>
      </View>
      <ChevronRight size={20} color="#666666" />
    </Pressable>
  );
}

export default function MessagesScreen() {
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const { width } = useWindowDimensions();
  const userId = useAuthStore((state) => state.id);
  const isDesktop = width >= 1024;
  const messages = MOCK_MESSAGES;

  // Toggle selection: if already selected, deselect; otherwise, select.
  const handleReferentSelect = () => {
    if (selectedContact === REFERENT_INFO.id) {
      setSelectedContact(null);
    } else {
      setSelectedContact(REFERENT_INFO.id);
    }
  };

  // onBack for mobile chat view.
  const handleBack = () => {
    setSelectedContact(null);
  };

  // On desktop we show a two-column layout.
  // On mobile, if no contact is selected, show the full sidebar view.
  return (
    <SafeAreaView style={styles.container}>
      {isDesktop ? (
        <View style={styles.content}>
          <View style={styles.sidebar}>
            <View style={styles.header}>
              <Text style={styles.title}>Messages</Text>
            </View>
            <AdminBanner />
            <Text style={styles.headerContact}>VOTRE RESPONSABLE SUR SITE</Text>
            <ReferentSection onSelectReferent={handleReferentSelect} />
            <ContactSection contactMail={CONTACT_INFO.email} contactPhone={CONTACT_INFO.phone} />
          </View>
          <View style={styles.mainArea}>
            <ChatArea messages={messages} userId={userId} onBack={handleBack} />
          </View>
        </View>
      ) : (
        // Mobile view
        <>
          {selectedContact ? (
            <View style={styles.content}>
              <View style={styles.mainArea}>
                <ChatArea messages={messages} userId={userId} onBack={handleBack} />
              </View>
            </View>
          ) : (
            <View style={styles.fullScreenSidebar}>
              <View style={styles.header}>
                <Text style={styles.title}>Messages</Text>
              </View>
              <AdminBanner />
              <Text style={styles.headerContact}>
                VOTRE RESPONSABLE SUR SITE
              </Text>
              <ReferentSection onSelectReferent={handleReferentSelect} />
              <ContactSection contactMail={CONTACT_INFO.email} contactPhone={CONTACT_INFO.phone} />
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: Platform.select({
      web: 320,
    }),
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderRightColor: '#E8EAED',
  },
  fullScreenSidebar: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EAED',
  },
  headerContact: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#202124',
  },
  mainArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  adminBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    padding: 16,
    gap: 12,
    borderRadius: 8,
    margin: 16,
  },
  adminBannerText: {
    flex: 1,
    fontSize: 14,
    color: '#92400E',
    fontWeight: '500',
  },
  referentSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F0F9FF',
    marginHorizontal: 16,
    borderRadius: 8,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        ':hover': {
          backgroundColor: '#E1F5FE',
        },
      },
    }),
  },
  referentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  referentInfo: {
    flex: 1,
  },
  referentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A73E8',
    marginBottom: 2,
  },
  referentTitle: {
    fontSize: 14,
    color: '#666666',
  },
});

export {};
