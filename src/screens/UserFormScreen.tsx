import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ScreenScrollContainer from '../components/ScreenScrollContainer';
import { getUserById, insertUser, updateUser } from '../database/dbService';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'UserForm'>;

type RouteProp = {
  key: string;
  name: string;
  params: { userId?: number };
};

export default function UserFormScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp>();
  const userId = route.params?.userId;
  const isEdit = !!userId;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [secureEntry, setSecureEntry] = useState(true);
  const [secureRepeat, setSecureRepeat] = useState(true);

  const backgroundColor = useThemeColor({}, 'background');
  const inputBackground = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const labelColor = useThemeColor({}, 'icon');

  useEffect(() => {
    if (isEdit && userId) {
      getUserById(userId).then(user => {
        if (user) {
          setFirstName(user.first_name);
          setLastName(user.last_name);
          setEmail(user.email);
          setDni(user.dni);
          setPhoto(user.avatar ?? 'https://via.placeholder.com/100');
        }
      });
    }
  }, [isEdit]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      mediaTypes: ['images'],
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!firstName || !lastName || !email || !dni) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }
    if (password && password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    const newUser = {
      first_name: firstName,
      last_name: lastName,
      email,
      dni,
      avatar: photo || 'https://via.placeholder.com/100',
      active: true,
    };

    try {
      if (isEdit && userId) {
        await updateUser({ ...newUser, id: userId });
        Alert.alert('Actualizado', 'Usuario actualizado correctamente');
      } else {
        await insertUser(newUser);
        Alert.alert('Creado', 'Usuario creado correctamente');
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      Alert.alert('Error', 'Ocurrió un error al guardar.');
    }
  };

  return (
    <ScreenScrollContainer>
      <View style={styles.avatarContainer}>
        <TouchableOpacity onPress={pickImage}>
          {photo ? (
            <>
              <Image source={{ uri: photo }} style={styles.avatar} />
            </>
          ) : (
            <View style={styles.placeholderAvatar}>
              <Ionicons name="camera" size={24} color="#999" style={{ marginBottom: 6 }} />
              <ThemedText style={styles.placeholderText}>Subir imagen</ThemedText>
            </View>
          )}
          {/* Ícono morado siempre visible */}
          <View style={styles.iconOverlay}>
            <Ionicons name="image" size={20} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>

      <CustomInput
        label="Nombres"
        icon="person"
        value={firstName}
        onChangeText={setFirstName}
        backgroundColor={inputBackground}
        labelColor={labelColor}
        textColor={textColor}
      />
      <CustomInput
        label="Apellidos"
        icon="person"
        value={lastName}
        onChangeText={setLastName}
        backgroundColor={inputBackground}
        labelColor={labelColor}
        textColor={textColor}
      />
      <CustomInput
        label="Correo"
        icon="mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        backgroundColor={inputBackground}
        labelColor={labelColor}
        textColor={textColor}
      />
      <CustomInput
        label="DNI"
        icon="card"
        value={dni}
        onChangeText={setDni}
        keyboardType="numeric"
        backgroundColor={inputBackground}
        labelColor={labelColor}
        textColor={textColor}
      />
      <CustomInput
        label="Contraseña"
        icon="eye"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={secureEntry}
        toggleSecure={() => setSecureEntry(!secureEntry)}
        backgroundColor={inputBackground}
        labelColor={labelColor}
        textColor={textColor}
      />
      <CustomInput
        label="Repetir Contraseña"
        icon="eye"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={secureRepeat}
        toggleSecure={() => setSecureRepeat(!secureRepeat)}
        backgroundColor={inputBackground}
        labelColor={labelColor}
        textColor={textColor}
      />

      <View style={{ marginTop: 16 }}>
        <Button title="Guardar" onPress={handleSave} color="#5E17EB" />
      </View>
    </ScreenScrollContainer>
  );
}

type CustomInputProps = {
  label: string;
  icon: any;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  toggleSecure?: () => void;
  keyboardType?: 'default' | 'email-address' | 'numeric';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  backgroundColor: string;
  labelColor: string;
  textColor: string;
};

function CustomInput({
  label,
  icon,
  secureTextEntry,
  toggleSecure,
  backgroundColor,
  labelColor,
  textColor,
  ...props
}: CustomInputProps) {
  const placeholderColor = useThemeColor({}, 'icon'); // gris adaptativo

  return (
    <View style={{ marginBottom: 12 }}>
      <ThemedText style={[styles.label, { color: labelColor }]}>{label}</ThemedText>
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor,
            borderColor: placeholderColor,
            borderWidth: 1, // Borde sutil
          },
        ]}
      >
        <TextInput
          style={[styles.input, { color: textColor }]}
          placeholder={label}
          placeholderTextColor={placeholderColor}
          secureTextEntry={secureTextEntry}
          {...props}
        />
        {toggleSecure ? (
          <TouchableOpacity onPress={toggleSecure}>
            <Ionicons name={secureTextEntry ? 'eye-off' : 'eye'} size={20} color={placeholderColor} />
          </TouchableOpacity>
        ) : (
          <Ionicons name={icon} size={20} color={placeholderColor} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  iconOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#5E17EB',
    borderRadius: 12,
    padding: 4,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
  },
  placeholderAvatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  placeholderText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  

});