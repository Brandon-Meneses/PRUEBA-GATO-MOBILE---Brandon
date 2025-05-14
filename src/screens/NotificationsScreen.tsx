import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Animated,
  FlatList,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import ScreenContainer from '../components/ScreenContainer';

const initialNotifications = [
  {
    id: '1',
    title: 'Documento firmado correctamente',
    date: '13 mayo 2025',
    icon: 'checkmark-circle-outline',
    read: false,
  },
  {
    id: '2',
    title: 'Nueva política de privacidad disponible',
    date: '12 mayo 2025',
    icon: 'document-text-outline',
    read: false,
  },
  {
    id: '3',
    title: 'Tu cuenta fue actualizada',
    date: '11 mayo 2025',
    icon: 'person-outline',
    read: false,
  },
];

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const textColor = useThemeColor({}, 'text');
  const cardColor = useThemeColor({}, 'background');
  const subtitleColor = useThemeColor({}, 'icon');
  const tint = useThemeColor({}, 'tint');

  const toggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, read: !n.read } : n
      )
    );

    const item = notifications.find((n) => n.id === id);
    if (item) {
      Toast.show({
        type: 'info',
        text1: item.title,
        text2: item.read ? 'Marcado como no leído' : 'Marcado como leído',
      });
    }
  };

  const renderItem = ({ item }: any) => {
    const scale = new Animated.Value(1);

    const onPressIn = () => {
      Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start();
    };

    const onPressOut = () => {
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
    };

    return (
      <TouchableWithoutFeedback
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={() => toggleRead(item.id)}
      >
        <Animated.View
          style={[
            styles.card,
            { backgroundColor: cardColor, transform: [{ scale }] },
            item.read ? styles.readCard : styles.unreadCard,
          ]}
        >
          <Ionicons name={item.icon} size={24} color={tint} style={{ marginRight: 12 }} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: textColor }]}>{item.title}</Text>
            <Text style={[styles.date, { color: subtitleColor }]}>{item.date}</Text>
          </View>
          {!item.read && <View style={styles.unreadDot} />}
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  };

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
    position: 'relative',
  },
  readCard: {
    opacity: 0.6,
  },
  unreadCard: {
    opacity: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  date: {
    fontSize: 13,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#5E17EB',
    marginLeft: 8,
  },
});