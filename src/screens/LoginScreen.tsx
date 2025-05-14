import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useContext, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import ScreenScrollContainer from '../components/ScreenScrollContainer';
import ThemeSelector from '../components/ThemeSelector';
import { AuthContext } from '../context/AuthContext';
import { useThemeSettings } from '../context/ThemeContext';
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
  const { theme } = useThemeSettings();
  const insets = useSafeAreaInsets();

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const inputBg = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'icon');

  const handleLogin = async () => {
    try {
      const response = await api.post('/login', { email, password });
      const token = response.data.token;

      const apiResponse = await api.get('/users?page=1');
      const allApiUsers = apiResponse.data.data;

      let matchedUser = null;

      for (const user of allApiUsers) {
        if (user.email === email) matchedUser = user;

        const exists = await getUserByEmail(user.email);
        if (!exists) {
          await insertUser({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            dni: '00000000',
            active: true,
            avatar: user.avatar || '',
          });
        }
      }

      if (!matchedUser) {
        Toast.show({ type: 'error', text1: 'Error', text2: 'No se encontró el usuario en la API.' });
        return;
      }

      const localUser = await getUserByEmail(email);
      if (!localUser) {
        Toast.show({ type: 'error', text1: 'Error', text2: 'No se encontró el usuario local.' });
        return;
      }

      await login(token, email, {
        id: localUser.id ?? 0,
        name: `${localUser.first_name ?? ''} ${localUser.last_name ?? ''}`,
        avatar: localUser.avatar ?? '',
      });

      Toast.show({ type: 'success', text1: 'Bienvenido', text2: `${localUser.first_name} ${localUser.last_name}` });

    } catch (error: any) {
      const localUser = await getUserByEmail(email);

      if (localUser) {
        await login('offline-token', email, {
          id: localUser.id ?? 0,
          name: `${localUser.first_name ?? ''} ${localUser.last_name ?? ''}`,
          avatar: localUser.avatar ?? '',
        });

        Toast.show({ type: 'success', text1: 'Modo sin conexión', text2: `Sesión iniciada como ${localUser.first_name}` });
      } else {
        const message = error.response?.data?.error || 'No se pudo iniciar sesión';
        Toast.show({ type: 'error', text1: 'Error de autenticación', text2: message });
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      {/* Selector fijo arriba a la derecha */}
      <ThemedView style={[styles.themeSelectorWrapper, { top: insets.top + 8 }]}>
        <ThemeSelector />
      </ThemedView>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScreenScrollContainer>
            <View style={styles.contentCenter}>
              <ThemedText type="title" style={styles.title}>Iniciar Sesión</ThemedText>

              <ThemedText style={styles.subtitle}>
                Nos alegra verte de vuelta. Ingresa con tu cuenta para continuar tu experiencia.
              </ThemedText>

              <ThemedView style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, { backgroundColor: inputBg, color: textColor, borderColor }]}
                  placeholder="Correo"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
                <Ionicons name="mail-outline" size={20} color="#999" style={styles.iconRight} />
              </ThemedView>

              <ThemedView style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, { backgroundColor: inputBg, color: textColor, borderColor }]}
                  placeholder="Contraseña"
                  placeholderTextColor="#999"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.iconRight}>
                  <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#999" />
                </TouchableOpacity>
              </ThemedView>

              <TouchableOpacity style={styles.forgotContainer}>
                <ThemedText type="link">¿Olvidé mi contraseña?</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <ThemedText style={styles.loginButtonText}>Ingresar</ThemedText>
              </TouchableOpacity>

              <ThemedText style={styles.registerText}>
                ¿Aún no tienes una cuenta?{' '}
                <ThemedText style={styles.registerLink} onPress={() => navigation.navigate('Register')}>
                  Regístrate
                </ThemedText>
              </ThemedText>
            </View>
          </ScreenScrollContainer>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  themeSelectorWrapper: {
    position: 'absolute',
    right: 16,
    zIndex: 10,
  },
  contentCenter: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    marginBottom: 8,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 24,
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
  forgotContainer: {
    alignItems: 'flex-end',
    marginBottom: 24,
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
  },
  registerLink: {
    color: '#5E17EB',
    fontWeight: '600',
  },
});