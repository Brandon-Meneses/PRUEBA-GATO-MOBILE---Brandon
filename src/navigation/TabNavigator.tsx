import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import CalendarScreen from '../screens/CalendarScreen';
import DocumentsScreen from '../screens/DocumentsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import UserFormScreen from '../screens/UserFormScreen';
import UserListScreen from '../screens/UserListScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          height: 70,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName = 'ellipse';
        
          switch (route.name) {
            case 'Inicio':
              iconName = 'home';
              break;
            case 'Calendario':
              iconName = 'calendar';
              break;
            case 'Documentos':
              iconName = 'document-text';
              break;
            case 'Notificaciones':
              iconName = 'notifications';
              break;
          }
        
          // Agregar burbuja solo para Notificaciones
          if (route.name === 'Notificaciones') {
            return (
              <View>
                <Ionicons name={iconName as any} size={size} color={color} />
                <View style={styles.notificationDot} />
              </View>
            );
          }
        
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#5E17EB',
        tabBarInactiveTintColor: '#CBD2E0',
      })}
    >
      <Tab.Screen name="Inicio" component={UserListScreen} />
      <Tab.Screen name="Calendario" component={CalendarScreen} />
      <Tab.Screen
        name="Marcar"
        component={UserFormScreen}
        options={{
          tabBarLabel: 'Registrar',
          tabBarIcon: ({ focused }) => (
            <Ionicons name="add" size={28} color="#fff" />
          ),
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              style={styles.centralButton}
              activeOpacity={0.8}
            >
              <View style={styles.centralButtonInner}>
                <Ionicons name="add" size={28} color="#fff" />
              </View>
            </TouchableOpacity>
          ),
        }}
      />
      <Tab.Screen name="Documentos" component={DocumentsScreen} />
      <Tab.Screen name="Notificaciones" component={NotificationsScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  centralButton: {
    top: -10,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  centralButtonInner: {
    backgroundColor: '#5E17EB',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },

  notificationDot: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: 'red',
    borderRadius: 6,
    width: 12,
    height: 12,
    zIndex: 1,
  }
});