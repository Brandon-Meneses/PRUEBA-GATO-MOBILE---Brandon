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
import ScreenContainer from '../components/ScreenContainer';
import { User as DBUser, deleteUser, getUserById } from '../database/dbService';
import { RootStackParamList } from '../navigation/AppNavigator';

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

  const [user, setUser] = useState<DBUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const data = await getUserById(userId);
      setUser(data || null);
    } catch (error: any) {
      console.error('Error al cargar usuario:', error.message);
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
        onPress: async () => {
          try {
            await deleteUser(userId);
            Alert.alert('Eliminado', 'El usuario fue eliminado.');
            navigation.goBack();
          } catch (error: any) {
            Alert.alert('Error', 'No se pudo eliminar el usuario.');
          }
        },
      },
    ]);
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} />;

  if (!user) {
    return (
      <ScreenContainer style={styles.container}>
        <Text style={{ color: '#888' }}>Usuario no encontrado.</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer style={styles.container}>
      <Image source={{ uri: user.avatar }} style={styles.avatar} />
      <Text style={styles.name}>{user.first_name + ' ' + user.last_name}</Text>
      <Text style={styles.label}>Correo:</Text>
      <Text style={styles.info}>{user.email}</Text>
      <Text style={styles.label}>DNI:</Text>
      <Text style={styles.info}>{user.dni}</Text>

      <View style={styles.buttonGroup}>
        <Button title="Editar" onPress={() => navigation.navigate('UserForm', { userId })} />
        <View style={{ height: 12 }} />
        <Button title="Eliminar" color="red" onPress={handleDelete} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 16 },
  name: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  label: { fontSize: 14, marginTop: 8, color: '#888' },
  info: { fontSize: 16 },
  buttonGroup: { marginTop: 24, width: '80%' },
});