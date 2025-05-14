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

const initialDocuments = [
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
  const [documents, setDocuments] = useState(initialDocuments);

  const textColor = useThemeColor({}, 'text');
  const cardColor = useThemeColor({}, 'background');
  const mutedText = useThemeColor({}, 'icon');

  const toggleStatus = (id: string) => {
    setDocuments((prevDocs) =>
      prevDocs.map((doc) =>
        doc.id === id
          ? {
              ...doc,
              status: doc.status === 'Firmado' ? 'Pendiente' : 'Firmado',
            }
          : doc
      )
    );

    const changed = documents.find((doc) => doc.id === id);
    if (changed) {
      const newStatus = changed.status === 'Firmado' ? 'Pendiente' : 'Firmado';
      Toast.show({
        type: newStatus === 'Firmado' ? 'success' : 'info',
        text1: changed.title,
        text2: `Nuevo estado: ${newStatus}`,
      });
    }
  };

  const renderItem = ({ item }: any) => {
    const scale = new Animated.Value(1);

    const onPressIn = () => {
      Animated.spring(scale, {
        toValue: 0.97,
        useNativeDriver: true,
      }).start();
    };

    const onPressOut = () => {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    };

    const iconName = item.status === 'Firmado' ? 'checkmark-done-outline' : 'time-outline';
    const iconColorByStatus = item.status === 'Firmado' ? 'green' : '#F59E0B';

    return (
      <TouchableWithoutFeedback
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={() => toggleStatus(item.id)}
      >
        <Animated.View
          style={[
            styles.card,
            { backgroundColor: cardColor, transform: [{ scale }] },
            styles.shadow,
          ]}
        >
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: textColor }]}>{item.title}</Text>
            <Text style={[styles.date, { color: mutedText }]}>{item.date}</Text>
          </View>
          <Text style={[styles.status, getStatusStyle(item.status)]}>{item.status}</Text>
          <Ionicons name={iconName} size={24} color={iconColorByStatus} />
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <ScreenContainer>
      <Text style={[styles.header, { color: textColor }]}>Mis Documentos</Text>
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
  status: {
    marginRight: 12,
    fontWeight: '600',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
});

const getStatusStyle = (status: string) => ({
  color:
    status === 'Firmado'
      ? 'green'
      : status === 'Pendiente'
      ? '#F59E0B'
      : 'red',
});