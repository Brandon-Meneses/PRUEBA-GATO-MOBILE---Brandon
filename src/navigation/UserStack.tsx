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
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UserList" component={UserListScreen} />
      <Stack.Screen name="UserDetail" component={UserDetailScreen} />
      <Stack.Screen name="UserForm" component={UserFormScreen} />
    </Stack.Navigator>
  );
}