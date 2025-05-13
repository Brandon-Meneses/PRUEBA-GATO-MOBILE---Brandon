import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import TabNavigator from './TabNavigator';


export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { token } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {token ? (
          <>
            <Stack.Screen name="MainTabs" component={TabNavigator} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}