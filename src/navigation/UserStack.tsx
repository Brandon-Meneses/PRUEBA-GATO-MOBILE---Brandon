import { useThemeColor } from '@/hooks/useThemeColor';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import UserDetailScreen from '../screens/UserDetailScreen';
import UserFormScreen from '../screens/UserFormScreen';
import UserListScreen from '../screens/UserListScreen';

export type UserStackParamList = {
  UserList: undefined;
  UserDetail: { userId: number };
  UserForm: { userId?: number };
};

const Stack = createNativeStackNavigator<UserStackParamList>();

export default function UserStack() {
  const headerBg = useThemeColor({}, 'background');
  const headerText = useThemeColor({}, 'tint');

  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: headerText,
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: headerBg,
        },
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
      }}
    >
      <Stack.Screen name="UserList" component={UserListScreen} options={{ headerShown: false }} />
      <Stack.Screen name="UserDetail" component={UserDetailScreen} options={{ title: 'Detalle del usuario' }} />
      <Stack.Screen
        name="UserForm"
        component={UserFormScreen}
        options={({ route }) => ({
          title: route.params?.userId ? 'Editar usuario' : 'Nuevo usuario',
        })}
      />
    </Stack.Navigator>
  );
}