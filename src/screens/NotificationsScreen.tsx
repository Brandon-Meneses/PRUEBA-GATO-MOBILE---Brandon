import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';

const notifications = [
  {
    id: '1',
    title: 'Documento firmado correctamente',
    date: '13 mayo 2025',
    icon: 'checkmark-circle-outline',
  },
  {
    id: '2',
    title: 'Nueva política de privacidad disponible',
    date: '12 mayo 2025',
    icon: 'document-text-outline',
  },
  {
    id: '3',
    title: 'Tu cuenta fue actualizada',
    date: '11 mayo 2025',
    icon: 'person-outline',
  },
];

export default function NotificationsScreen() {
  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Ionicons name={item.icon} size={24} color="#5E17EB" style={{ marginRight: 12 }} />
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
    </View>
  );

  return (
    <ScreenContainer>
      <Text style={styles.header}>Notificaciones</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    color: '#1E1E1E',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F4FA',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  date: {
    fontSize: 13,
    color: '#888',
  },
});