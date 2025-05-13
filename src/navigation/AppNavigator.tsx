import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import UserDetailScreen from '../screens/UserDetailScreen';
import UserFormScreen from '../screens/UserFormScreen';
import TabNavigator from './TabNavigator';


export type RootStackParamList = {
  Login: undefined;
  UserList: undefined;
  UserDetail: { userId: number };
  UserForm: { userId?: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { token } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {token ? (
          <>
            <Stack.Screen name="UserList" component={TabNavigator} />
            <Stack.Screen name="UserDetail" component={UserDetailScreen} />
            <Stack.Screen name="UserForm" component={UserFormScreen} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}