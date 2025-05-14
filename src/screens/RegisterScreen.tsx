import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import ScreenScrollContainer from '../components/ScreenScrollContainer';
import { getUserByEmail, insertUser } from '../database/dbService';
import { RootStackParamList } from '../navigation/AppNavigator';
import api from '../services/api';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function RegisterScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const bgColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const inputBg = useThemeColor({}, 'card');

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !dni || !password || !confirmPassword) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Todos los campos son obligatorios' });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Las contraseñas no coinciden' });
      return;
    }

    const exists = await getUserByEmail(email);
    if (exists) {
      Toast.show({ type: 'error', text1: 'Ya existe', text2: 'Este correo ya está registrado.' });
      return;
    }

    try {
      const response = await api.post('/register', { email, password });
      const { token, id } = response.data;

      await insertUser({
        id,
        first_name: firstName,
        last_name: lastName,
        email,
        dni,
        avatar: 'https://via.placeholder.com/100',
        active: true,
      });

      Toast.show({ type: 'success', text1: 'Registro exitoso', text2: 'Tu cuenta fue creada correctamente.' });
      navigation.goBack();
    } catch (e: any) {
      const message = e.response?.data?.error || 'No se pudo registrar.';
      Toast.show({ type: 'error', text1: 'Error', text2: message });
    }
  };

  return (
    <ScreenScrollContainer>
      <ThemedText type="title" style={styles.title}>Registrarse</ThemedText>

      <Input label="Nombres" value={firstName} onChangeText={setFirstName} icon="person" inputBg={inputBg} textColor={textColor} />
      <Input label="Apellidos" value={lastName} onChangeText={setLastName} icon="person" inputBg={inputBg} textColor={textColor} />
      <Input label="Correo" value={email} onChangeText={setEmail} icon="mail" inputBg={inputBg} textColor={textColor} keyboardType="email-address" />
      <Input label="DNI" value={dni} onChangeText={setDni} icon="card" inputBg={inputBg} textColor={textColor} keyboardType="numeric" />
      <Input
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        icon="lock-closed"
        inputBg={inputBg}
        textColor={textColor}
        secureTextEntry={!showPassword}
        toggleSecure={() => setShowPassword(!showPassword)}
        showSecure={showPassword}
        />

        <Input
        label="Repetir Contraseña"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        icon="lock-closed"
        inputBg={inputBg}
        textColor={textColor}
        secureTextEntry={!showConfirmPassword}
        toggleSecure={() => setShowConfirmPassword(!showConfirmPassword)}
        showSecure={showConfirmPassword}
        />
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <ThemedText style={styles.registerButtonText}>Registrar</ThemedText>
      </TouchableOpacity>
    </ScreenScrollContainer>
  );
}

function Input({
    label,
    icon,
    inputBg,
    textColor,
    toggleSecure,
    secureTextEntry,
    showSecure,
    ...props
  }: any) {
    const borderColor = useThemeColor({}, 'icon');
  
    return (
      <ThemedView style={styles.inputWrapper}>
        <TextInput
          placeholder={label}
          placeholderTextColor="#999"
          secureTextEntry={secureTextEntry}
          style={[
            styles.input,
            {
              backgroundColor: inputBg,
              color: textColor,
              borderColor,
            },
          ]}
          {...props}
        />
        {toggleSecure ? (
          <TouchableOpacity onPress={toggleSecure} style={styles.iconRight}>
            <Ionicons
              name={showSecure ? 'eye-off' : 'eye'}
              size={20}
              color="#999"
            />
          </TouchableOpacity>
        ) : (
          <Ionicons name={icon} size={20} color="#999" style={styles.iconRight} />
        )}
      </ThemedView>
    );
  }

const styles = StyleSheet.create({
  title: {
    marginBottom: 16,
  },
  inputWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  input: {
    borderRadius: 12,
    padding: 14,
    paddingRight: 40,
    fontSize: 14,
    borderWidth: 1.5,
  },
  iconRight: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  registerButton: {
    backgroundColor: '#5E17EB',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});