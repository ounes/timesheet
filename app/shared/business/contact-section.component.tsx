import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  Linking,
  Animated,
} from 'react-native';
import { ChevronRight, Phone, Mail } from 'lucide-react-native';
import { useState } from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

export function ContactSection({
  contactPhone,
  contactMail,
}: {
  contactPhone: string;
  contactMail: string;
}) {
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
    Linking.openURL(`tel:${contactPhone}`);
  };

  const handleEmailPress = () => {
    Linking.openURL(`mailto:${contactMail}`);
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
      {showContact && (
        <Animated.View style={[styles.contactDetails, animatedStyle]}>
          <Pressable style={styles.contactItem} onPress={handlePhonePress}>
            <Phone size={20} color="#1A73E8" />
            <Text style={styles.contactItemText}>{contactPhone}</Text>
          </Pressable>
          <Pressable style={styles.contactItem} onPress={handleEmailPress}>
            <Mail size={20} color="#1A73E8" />
            <Text style={styles.contactItemText}>{contactMail}</Text>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contactSection: {
    margin: 16,
  },
  headerContactInfo: {
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 8,
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
});
