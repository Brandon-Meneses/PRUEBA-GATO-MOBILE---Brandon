import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';

const documents = [
  {
    id: '1',
    title: 'Contrato de Trabajo',
    date: '2025-04-30',
    status: 'Firmado',
  },
  {
    id: '2',
    title: 'Reglamento Interno',
    date: '2025-05-01',
    status: 'Pendiente',
  },
];

export default function DocumentsScreen() {
  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
      <Text style={[styles.status, getStatusStyle(item.status)]}>
        {item.status}
      </Text>
      <Ionicons name="document-text-outline" size={24} color="#5E17EB" />
    </View>
  );

  return (
    <ScreenContainer>
      <Text style={styles.header}>Mis Documentos</Text>
      <FlatList
        data={documents}
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
  status: {
    marginRight: 12,
    fontWeight: '600',
  },
});

const getStatusStyle = (status: string) => ({
  color: status === 'Firmado' ? 'green' : status === 'Pendiente' ? '#F59E0B' : 'red',
});