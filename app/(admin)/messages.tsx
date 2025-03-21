import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  Image,
  Platform,
  useWindowDimensions,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Send,
  Search,
  Check,
  CheckCheck,
  Bell,
  ChevronRight,
  ChevronLeft,
  Info,
  X,
  MessageSquare,
  Phone,
  Mail,
  AlertTriangle,
} from 'lucide-react-native';
import { useState, useRef, useEffect } from 'react';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutRight,
  withSpring,
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';

const MOCK_MESSAGES = {
  // Conversation for Marie Lambert with id '1'
  '1': [
    {
      id: '1',
      sender: 'Marie Lambert',
      message: 'Bonjour, voici les dernières informations.',
      timestamp: '11:00',
      status: 'read',
    },
    {
      id: '2',
      sender: 'Moi',
      message: "Merci Marie, c'est bien noté.",
      timestamp: '11:05',
      status: 'read',
      isOwn: true,
    },
  ],
};

const REFERENT_INFO = {
  name: 'Marie Lambert',
  title: 'Chef de chantier',
  id: '1',
  avatar:
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fit=crop&w=100&h=100',
};

const CONTACT_INFO = {
  phone: '+1-555-123-4567',
  email: 'contact@organization.com',
};

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

function ContactSection() {
  const [showContact, setShowContact] = useState(false);
  const animation = useSharedValue(0);

  const handlePress = () => {
    setShowContact(!showContact);
    animation.value = withSpring(showContact ? 0 : 1);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    height: withSpring(animation.value * 80),
    opacity: animation.value,
  }));

  const handlePhonePress = () => {
    Linking.openURL(`tel:${CONTACT_INFO.phone}`);
  };

  const handleEmailPress = () => {
    Linking.openURL(`mailto:${CONTACT_INFO.email}`);
  };

  return (
    <View style={styles.contactSection}>
      <Text style={styles.headerContactInfo}>POUR TOUTE QUESTION</Text>
      <Pressable style={styles.contactButton} onPress={handlePress}>
        <Text style={styles.contactButtonText}>Contactez-nous</Text>
        <ChevronRight
          size={20}
          color="#666666"
          style={{ transform: [{ rotate: showContact ? '90deg' : '0deg' }] }}
        />
      </Pressable>
      <Animated.View style={[styles.contactDetails, animatedStyle]}>
        <Pressable style={styles.contactItem} onPress={handlePhonePress}>
          <Phone size={20} color="#1A73E8" />
          <Text style={styles.contactItemText}>{CONTACT_INFO.phone}</Text>
        </Pressable>
        <Pressable style={styles.contactItem} onPress={handleEmailPress}>
          <Mail size={20} color="#1A73E8" />
          <Text style={styles.contactItemText}>{CONTACT_INFO.email}</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

function MessageStatus({ status }: { status: string }) {
  switch (status) {
    case 'sent':
      return <Check size={16} color="#9AA0A6" />;
    case 'delivered':
      return <CheckCheck size={16} color="#9AA0A6" />;
    case 'read':
      return <CheckCheck size={16} color="#34A853" />;
    default:
      return null;
  }
}

interface ChatAreaProps {
  messages: (typeof MOCK_MESSAGES)[keyof typeof MOCK_MESSAGES];
  onBack?: () => void;
}

function ChatArea({ messages, onBack }: ChatAreaProps) {
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  if (!messages || messages.length === 0) {
    // On desktop show empty state if no messages; on mobile this is not rendered.
    return isDesktop ? (
      <View style={styles.emptyChatContainer}>
        <MessageSquare size={48} color="#9AA0A6" />
        <Text style={styles.emptyChatText}>
          Sélectionnez votre contact pour voir la conversation
        </Text>
      </View>
    ) : null;
  }

  const renderMessage = ({ item }: { item: (typeof messages)[0] }) => (
    <View
      style={[
        styles.messageContainer,
        item.isOwn ? styles.ownMessage : styles.otherMessage,
      ]}
    >
      {!item.isOwn && (
        <Image
          source={{ uri: REFERENT_INFO.avatar }}
          style={styles.messageAvatar}
        />
      )}
      <View
        style={[
          styles.messageBubble,
          item.isOwn ? styles.ownBubble : styles.otherBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            item.isOwn ? styles.ownMessageText : styles.otherMessageText,
          ]}
        >
          {item.message}
        </Text>
        <View style={styles.messageFooter}>
          <Text
            style={[
              styles.messageTimestamp,
              item.isOwn ? styles.ownTimestamp : styles.otherTimestamp,
            ]}
          >
            {item.timestamp}
          </Text>
          {item.isOwn && <MessageStatus status={item.status} />}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.chatArea}>
      <View style={styles.chatHeader}>
        {!isDesktop && onBack && (
          <Pressable style={styles.backButton} onPress={onBack}>
            {/* <Text style={styles.backButtonText}>Retour</Text> */}
            <ChevronLeft size={20} color="#666666" />
          </Pressable>
        )}
        <Text style={styles.chatHeaderTitle}>{REFERENT_INFO.name}</Text>
      </View>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Écrivez votre message..."
          multiline
        />
        <Pressable
          style={[styles.sendButton, !newMessage && styles.sendButtonDisabled]}
          disabled={!newMessage}
        >
          <Send size={20} color={newMessage ? '#FFFFFF' : '#9AA0A6'} />
        </Pressable>
      </View>
    </View>
  );
}

export default function MessagesScreen() {
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

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

  // Only load messages for Marie Lambert if selected.
  const messages =
    selectedContact === REFERENT_INFO.id ? MOCK_MESSAGES[REFERENT_INFO.id] : [];

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
            <ContactSection />
          </View>
          <View style={styles.mainArea}>
            <ChatArea messages={messages} onBack={handleBack} />
          </View>
        </View>
      ) : (
        // Mobile view
        <>
          {selectedContact ? (
            <View style={styles.content}>
              <View style={styles.mainArea}>
                <ChatArea messages={messages} onBack={handleBack} />
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
              <ContactSection />
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
      default: '100%',
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
  headerContactInfo: {
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
  contactSection: {
    margin: 16,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        ':hover': {
          backgroundColor: '#EEEEEE',
        },
      },
    }),
  },
  contactButtonText: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  contactDetails: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginTop: 8,
    overflow: 'hidden',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        ':hover': {
          backgroundColor: '#F5F5F5',
        },
      },
    }),
  },
  contactItemText: {
    fontSize: 14,
    color: '#1A73E8',
    textDecorationLine: 'underline',
  },
  emptyChatContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  emptyChatText: {
    marginTop: 16,
    fontSize: 16,
    color: '#5F6368',
    textAlign: 'center',
  },
  chatArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EAED',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    marginRight: 12,
    padding: 8,
    backgroundColor: '#F1F3F4',
    borderRadius: 4,
  },
  backButtonText: {
    fontSize: 14,
    color: '#1A73E8',
  },
  chatHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202124',
  },
  messageList: {
    padding: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '80%',
  },
  ownMessage: {
    flexDirection: 'row-reverse',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    alignSelf: 'flex-start',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    maxWidth: '100%',
  },
  ownBubble: {
    backgroundColor: '#1A73E8',
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: '#F1F3F4',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    marginBottom: 4,
  },
  ownMessageText: {
    color: '#FFFFFF',
  },
  otherMessageText: {
    color: '#202124',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  messageTimestamp: {
    fontSize: 12,
  },
  ownTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  otherTimestamp: {
    color: '#5F6368',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E8EAED',
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    marginRight: 12,
    padding: 12,
    backgroundColor: '#F1F3F4',
    borderRadius: 24,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1A73E8',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#F1F3F4',
  },
});
