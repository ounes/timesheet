import { View, Text, StyleSheet, Switch, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Bell,
  Moon,
  Globe,
  Shield,
  ChevronRight,
  LogOut,
} from 'lucide-react-native';
import { useAuthStore } from '@/store/auth';

export default function SettingsScreen() {
  const isDark = false;
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const renderSettingItem = ({
    icon,
    title,
    hasSwitch = false,
    switchValue = false,
    onSwitchChange,
    onPress,
    textColor,
  }: {
    icon: React.ReactNode;
    title: string;
    hasSwitch?: boolean;
    switchValue?: boolean;
    onSwitchChange?: (value: boolean) => void;
    onPress?: () => void;
    textColor?: string;
  }) => (
    <Pressable
      style={[
        styles.settingItem,
        { backgroundColor: isDark ? '#1a1a1a' : '#ffffff' },
      ]}
      onPress={onPress}
    >
      <View style={styles.settingItemLeft}>
        {icon}
        <Text
          style={[
            styles.settingItemText,
            { color: textColor || (isDark ? '#ffffff' : '#000000') },
          ]}
        >
          {title}
        </Text>
      </View>
      {hasSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={switchValue ? '#007AFF' : '#f4f3f4'}
        />
      ) : (
        <ChevronRight size={20} color={isDark ? '#888888' : '#666666'} />
      )}
    </Pressable>
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? '#000000' : '#f0f0f0' },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? '#ffffff' : '#000000' }]}>
          Paramètres
        </Text>
      </View>

      <View style={styles.section}>
        <Text
          style={[
            styles.sectionTitle,
            { color: isDark ? '#888888' : '#666666' },
          ]}
        >
          Préférences
        </Text>
        {renderSettingItem({
          icon: <Bell size={24} color={isDark ? '#ffffff' : '#000000'} />,
          title: 'Notifications',
          hasSwitch: true,
          switchValue: true,
        })}
        {renderSettingItem({
          icon: <Moon size={24} color={isDark ? '#ffffff' : '#000000'} />,
          title: 'Mode Sombre',
          hasSwitch: true,
          switchValue: isDark,
        })}
      </View>

      <View style={styles.section}>
        <Text
          style={[
            styles.sectionTitle,
            { color: isDark ? '#888888' : '#666666' },
          ]}
        >
          Système
        </Text>
        {renderSettingItem({
          icon: <Globe size={24} color={isDark ? '#ffffff' : '#000000'} />,
          title: 'Langue',
        })}
        {renderSettingItem({
          icon: <Shield size={24} color={isDark ? '#ffffff' : '#000000'} />,
          title: 'Sécurité',
        })}
      </View>

      <View style={styles.section}>
        <Text
          style={[
            styles.sectionTitle,
            { color: isDark ? '#888888' : '#666666' },
          ]}
        >
          Compte
        </Text>
        {renderSettingItem({
          icon: <LogOut size={24} color="#FF3B30" />,
          title: 'Déconnexion',
          textColor: '#FF3B30',
          onPress: handleLogout,
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 20,
    marginBottom: 10,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    marginBottom: 1,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingItemText: {
    fontSize: 16,
    marginLeft: 15,
  },
});

export {};
