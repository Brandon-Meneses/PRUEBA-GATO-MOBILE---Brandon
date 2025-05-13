import { useIsFocused, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useContext, useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import { AuthContext } from '../context/AuthContext';
import {
  User as DBUser,
  getUsers,
  insertUser,
  toggleUserStatus
} from '../database/dbService';
import { UserStackParamList } from '../navigation/UserStack';
import api from '../services/api';

type NavigationProp = NativeStackNavigationProp<UserStackParamList, 'UserList'>;

export default function UserListScreen() {
  const [users, setUsers] = useState<DBUser[]>([]);
  const [currentUser, setCurrentUser] = useState<DBUser | null>(null);
  const navigation = useNavigation<NavigationProp>();
  const { logout, email: loggedInEmail } = useContext(AuthContext);

  const isFocused = useIsFocused();

    useEffect(() => {
      if (isFocused) {
        loadData(); 
      }
    }, [isFocused]);

  const loadData = async () => {
    const localUsers = await getUsers();

    if (localUsers.length === 0) {
      // Primer inicio, cargar desde API y guardar en BD
      try {
        const response = await api.get('/users?page=1');
        const dataFromAPI = response.data.data;

        for (const user of dataFromAPI) {
          const userToSave: DBUser = {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            avatar: user.avatar,
            dni: '00000000',
            active: true,
          };
          await insertUser(userToSave);
        }

        const savedUsers = await getUsers();
        setUsers(savedUsers);
        const matched = savedUsers.find(u => u.email === loggedInEmail);
        if (matched) setCurrentUser(matched);
      } catch (error: any) {
        console.error('Error al obtener usuarios de la API:', error.message);
      }
    } else {
      // Ya hay datos locales
      setUsers(localUsers);
      const matched = localUsers.find(u => u.email === loggedInEmail);
      if (matched) setCurrentUser(matched);
    }
  };

  const handleToggleActive = async (id: number, currentStatus: boolean) => {
    await toggleUserStatus(id, !currentStatus);
    const updated = await getUsers();
    setUsers(updated);
  };

  const renderItem = ({ item }: { item: DBUser }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('UserDetail', { userId: item.id! })}
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.info}>
              <Text style={styles.name}>{item.first_name} {item.last_name}</Text>
              <Text style={styles.email}>{item.email}</Text>
      </View>
      <Switch value={item.active} onValueChange={() => handleToggleActive(item.id!, item.active)} />
    </TouchableOpacity>
  );

  return (
    <ScreenContainer>
      <View style={styles.logoutContainer}>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>

      {currentUser && (
        <View style={styles.header}>
          <Text style={styles.greeting}>Hola, {currentUser.first_name}!</Text>
          <Image source={{ uri: currentUser.avatar }} style={styles.profileImage} />
        </View>
      )}

      <FlatList
        data={users}
        keyExtractor={item => item.id!.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingVertical: 12 }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  logoutContainer: {
    alignItems: 'flex-end',
    marginTop: 16,
    marginBottom: 8,
  },
  logoutText: {
    color: '#5E17EB',
    fontWeight: '600',
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: { fontSize: 16, fontWeight: '600' },
  email: { fontSize: 14, color: '#666' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E1E1E',
  },
  
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});