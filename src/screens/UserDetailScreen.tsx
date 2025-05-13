import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { RootStackParamList } from '../navigation/AppNavigator';
import api from '../services/api';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'UserDetail'>;

type RouteProp = {
  key: string;
  name: string;
  params: { userId: number };
};

export default function UserDetailScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp>();
  const { userId } = route.params;

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get(`/users/${userId}`);
      const simulatedUser = {
        ...response.data.data,
        dni: '75872323', // Dato ficticio
      };
      setUser(simulatedUser);
    } catch (error: any) {
      console.error(error.response?.data || error.message);
      Alert.alert('Error', 'No se pudo cargar el usuario.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('Eliminar', '¿Deseas eliminar este usuario?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => {
          // Simulación de eliminación
          Alert.alert('Eliminado', 'El usuario fue eliminado.');
          navigation.goBack();
        },
      },
    ]);
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} />;

  return (
    <View style={styles.container}>
      <Image source={{ uri: user.avatar }} style={styles.avatar} />
      <Text style={styles.name}>{user.first_name} {user.last_name}</Text>
      <Text style={styles.label}>Correo:</Text>
      <Text style={styles.info}>{user.email}</Text>
      <Text style={styles.label}>DNI:</Text>
      <Text style={styles.info}>{user.dni}</Text>

      <View style={styles.buttonGroup}>
        <Button title="Editar" onPress={() => navigation.navigate('UserForm', { userId })} />
        <View style={{ height: 12 }} />
        <Button title="Eliminar" color="red" onPress={handleDelete} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, alignItems: 'center' },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 16 },
  name: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  label: { fontSize: 14, marginTop: 8, color: '#888' },
  info: { fontSize: 16 },
  buttonGroup: { marginTop: 24, width: '80%' },
});