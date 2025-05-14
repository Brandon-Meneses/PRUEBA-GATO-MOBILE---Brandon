import { useIsFocused, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useContext, useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Switch,
  TouchableOpacity,
} from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import Toast from 'react-native-toast-message';
import ScreenContainer from '../components/ScreenContainer';
import { AuthContext } from '../context/AuthContext';
import {
  User as DBUser,
  getUsers,
  toggleUserStatus
} from '../database/dbService';
import { UserStackParamList } from '../navigation/UserStack';

type NavigationProp = NativeStackNavigationProp<UserStackParamList, 'UserList'>;

export default function UserListScreen() {
  const [users, setUsers] = useState<DBUser[]>([]);
  const [currentUser, setCurrentUser] = useState<DBUser | null>(null);
  const navigation = useNavigation<NavigationProp>();
  const { logout, email: loggedInEmail } = useContext(AuthContext);

  const isFocused = useIsFocused();
  const cardBg = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const subtitleColor = useThemeColor({}, 'icon');

  useEffect(() => {
    if (isFocused) loadData();
  }, [isFocused]);

  const loadData = async () => {
    const localUsers = await getUsers();
    setUsers(localUsers);
  
    const matched = localUsers.find(u => u.email === loggedInEmail);
    if (matched) setCurrentUser(matched);
  };

  const handleToggleActive = async (id: number, currentStatus: boolean) => {
    await toggleUserStatus(id, !currentStatus);
    const updated = await getUsers();
    setUsers(updated);
  
    Toast.show({
      type: 'success',
      text1: 'Estado actualizado',
      text2: `El usuario fue marcado como ${!currentStatus ? 'activo' : 'inactivo'}`,
    });
  };

  const renderItem = ({ item }: { item: DBUser }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: cardBg }]}
      onPress={() => navigation.navigate('UserDetail', { userId: item.id! })}
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <ThemedView style={styles.info}>
        <ThemedText style={[styles.name, { color: textColor }]}>
          {item.first_name} {item.last_name}
        </ThemedText>
        <ThemedText style={[styles.email, { color: subtitleColor }]}>
          {item.email}
        </ThemedText>
      </ThemedView>
      <Switch
        value={item.active}
        onValueChange={() => handleToggleActive(item.id!, item.active)}
      />
    </TouchableOpacity>
  );

  return (
    <ScreenContainer>
      <ThemedView style={styles.logoutContainer}>
        <TouchableOpacity onPress={logout}>
          <ThemedText style={styles.logoutText}>Cerrar sesión</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {currentUser && (
        <ThemedView style={styles.header}>
          <ThemedText style={[styles.greeting, { color: textColor }]}>
            Hola, {currentUser.first_name}!
          </ThemedText>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('UserDetail', { userId: currentUser.id! })
            }
          >
            <Image source={{ uri: currentUser.avatar }} style={styles.profileImage} />
          </TouchableOpacity>
        </ThemedView>
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
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  email: {
    fontSize: 14,
  },
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
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});