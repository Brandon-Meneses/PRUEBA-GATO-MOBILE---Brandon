import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CalendarScreen from '../screens/CalendarScreen';
import DocumentsScreen from '../screens/DocumentsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import UserStack from './UserStack';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: styles.tabBarStyle,
          tabBarLabelStyle: { fontSize: 12 },
          tabBarIcon: ({ color, size }) => {
            let iconName = 'ellipse';
            switch (route.name) {
              case 'Inicio': iconName = 'home'; break;
              case 'Calendario': iconName = 'calendar'; break;
              case 'Documentos': iconName = 'document-text'; break;
              case 'Notificaciones': iconName = 'notifications'; break;
            }

            if (route.name === 'Notificaciones') {
              return (
                <View>
                  <Ionicons name={iconName} size={size} color={color} />
                  <View style={styles.notificationDot} />
                </View>
              );
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#5E17EB',
          tabBarInactiveTintColor: '#CBD2E0',
        })}
      >
        <Tab.Screen name="Inicio" component={UserStack} />
        <Tab.Screen name="Calendario" component={CalendarScreen} />
        <Tab.Screen
          name="Marcar"
          component={UserStack}
          initialParams={{ screen: 'UserForm' }}
          options={{
            tabBarLabel: 'Registrar',
            tabBarIcon: () => (
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
    </SafeAreaView>
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
  },

  tabBarStyle: {
    height: 70,
    paddingBottom: 8,
    paddingTop: 8,
  },
});