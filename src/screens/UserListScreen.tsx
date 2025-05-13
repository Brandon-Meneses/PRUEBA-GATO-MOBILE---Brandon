import { useNavigation } from '@react-navigation/native';
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
import { UserStackParamList } from '../navigation/UserStack';
import api from '../services/api';



type NavigationProp = NativeStackNavigationProp<UserStackParamList, 'UserList'>;

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
  active: boolean;
}

export default function UserListScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const navigation = useNavigation<NavigationProp>();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users?page=1');
      const dataWithStatus = response.data.data.map((user: any) => ({
        ...user,
        active: true,
      }));
      setUsers(dataWithStatus);
    } catch (error: any) {
      console.error('Error al obtener usuarios:', error.response?.data || error.message);
    }
  };

  const toggleActive = (id: number) => {
    setUsers(prev =>
      prev.map(user =>
        user.id === id ? { ...user, active: !user.active } : user
      )
    );
  };

  const renderItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('UserDetail', { userId: item.id })}
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.name}>
          {item.first_name} {item.last_name}
        </Text>
        <Text style={styles.email}>{item.email}</Text>
      </View>
      <Switch value={item.active} onValueChange={() => toggleActive(item.id)} />
    </TouchableOpacity>
  );

  return (
    <ScreenContainer>
      <View style={styles.logoutContainer}>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={users}
        keyExtractor={item => item.id.toString()}
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
});