import { Drawer } from 'expo-router/drawer';
import {
  LayoutDashboard,
  MapPin,
  Users,
  Settings,
  FolderOpen,
  FileSpreadsheet,
} from 'lucide-react-native';

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerType: "permanent",
        drawerPosition: "left",
        drawerActiveTintColor: '#000',
        drawerInactiveTintColor: '#666',
        drawerStyle: {
          width: 300,
        },
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: 'Accueil',
          drawerIcon: ({ color, size }) => (
            <LayoutDashboard size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="users"
        options={{
          title: 'Utilisateurs',
          drawerIcon: ({ color, size }) => (
            <Users size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="sites"
        options={{
          title: 'Sites',
          drawerIcon: ({ color, size }) => (
            <MapPin size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="timesheets"
        options={{
          title: 'Relevés',
          drawerIcon: ({ color, size }) => (
            <FileSpreadsheet size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="docbox"
        options={{
          title: 'Documents',
          drawerIcon: ({ color, size }) => (
            <FolderOpen size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          title: 'Paramètres',
          drawerIcon: ({ color, size }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}
