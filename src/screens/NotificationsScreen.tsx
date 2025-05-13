import { useThemeColor } from '@/hooks/useThemeColor';
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
  const textColor = useThemeColor({}, 'text');
  const cardColor = useThemeColor({}, 'background');
  const iconColor = useThemeColor({}, 'tint');
  const subtitleColor = useThemeColor({}, 'icon');

  const renderItem = ({ item }: any) => (
    <View style={[styles.card, { backgroundColor: cardColor }]}>
      <Ionicons name={item.icon} size={24} color={iconColor} style={{ marginRight: 12 }} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, { color: textColor }]}>{item.title}</Text>
        <Text style={[styles.date, { color: subtitleColor }]}>{item.date}</Text>
      </View>
    </View>
  );

  return (
    <ScreenContainer>
      <Text style={[styles.header, { color: textColor }]}>Notificaciones</Text>
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
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
});