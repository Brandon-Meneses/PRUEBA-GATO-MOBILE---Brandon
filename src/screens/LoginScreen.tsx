import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useContext, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { AuthContext } from '../context/AuthContext';
import { getUserByEmail, insertUser } from '../database/dbService';
import { RootStackParamList } from '../navigation/AppNavigator';
import api from '../services/api';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      const response = await api.post('/login', { email, password });
      const token = response.data.token;
  
      let localUser = await getUserByEmail(email);
  
      if (!localUser) {
        const apiResponse = await api.get('/users?page=1');
        const matchedUser = apiResponse.data.data.find((u: any) => u.email === email);
  
        if (!matchedUser) {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'No se encontró el usuario en la API.',
          });
          return;
        }
  
        await insertUser({
          id: matchedUser.id,
          first_name: matchedUser.first_name,
          last_name: matchedUser.last_name,
          email: matchedUser.email,
          dni: matchedUser.dni,
          active: matchedUser.active,
          avatar: matchedUser.avatar || '',
        });
  
        localUser = await getUserByEmail(email);
      }
  
      if (!localUser) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'No se encontró el usuario local.',
        });
        return;
      }
  
      await login(token, email, {
        id: localUser.id ?? 0,
        name: `${localUser.first_name ?? ''} ${localUser.last_name ?? ''}`,
        avatar: localUser.avatar ?? '',
      });
  
      Toast.show({
        type: 'success',
        text1: 'Bienvenido',
        text2: `${localUser.first_name} ${localUser.last_name}`,
      });
  
    } catch (error: any) {
      const localUser = await getUserByEmail(email);
  
      if (localUser) {
        await login('offline-token', email, {
          id: localUser.id ?? 0,
          name: `${localUser.first_name ?? ''} ${localUser.last_name ?? ''}`,
          avatar: localUser.avatar ?? '',
        });
  
        Toast.show({
          type: 'success',
          text1: 'Modo sin conexión',
          text2: `Sesión iniciada como ${localUser.first_name}`,
        });
      } else {
        const message = error.response?.data?.error || 'No se pudo iniciar sesión';
        Toast.show({
          type: 'error',
          text1: 'Error de autenticación',
          text2: message,
        });
      }
    }
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Iniciar Sesión</Text>
          <Text style={styles.subtitle}>
            Nos alegra verte de vuelta. Ingresa con tu cuenta para continuar tu experiencia.
          </Text>

          {/* Input Correo */}
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Correo"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              placeholderTextColor="#999"
            />
            <Ionicons name="mail-outline" size={20} color="#999" style={styles.iconRight} />
          </View>

          {/* Input Contraseña */}
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="#999"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.iconRight}>
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#999" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.forgotContainer}>
            <Text style={styles.forgotText}>¿Olvide mi contraseña?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Ingresar</Text>
          </TouchableOpacity>

          <Text style={styles.registerText}>
            ¿Aún no tienes una cuenta? <Text style={styles.registerLink}>Regístrate</Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'left',
    color: '#1E1E1E',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },
  inputWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 14,
    paddingRight: 40,
    fontSize: 14,
    color: '#000',
  },
  iconRight: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  forgotContainer: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  forgotText: {
    fontSize: 13,
    color: '#5E17EB',
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#5E17EB',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  registerText: {
    textAlign: 'center',
    fontSize: 13,
    color: '#374151',
  },
  registerLink: {
    color: '#5E17EB',
    fontWeight: '600',
  },
});