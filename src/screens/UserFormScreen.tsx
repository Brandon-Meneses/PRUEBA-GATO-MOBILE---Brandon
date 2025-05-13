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
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import ScreenScrollContainer from '../components/ScreenScrollContainer';
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
  const isEdit = !!route.params?.userId;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [secureEntry, setSecureEntry] = useState(true);
  const [secureRepeat, setSecureRepeat] = useState(true);

  useEffect(() => {
    if (isEdit) {
      setName('Daniela Carrasco Nolazco');
      setEmail('desarrollo2@gmail.com');
      setDni('73798984');
      setPhoto('https://randomuser.me/api/portraits/women/44.jpg');
    }
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      mediaTypes: ['images']
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (!name || !email || !dni) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }
    if (password && password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    Alert.alert('Éxito', isEdit ? 'Usuario actualizado' : 'Usuario creado');
    navigation.goBack();
  };

  return (
    <ScreenScrollContainer>
      <View style={styles.avatarContainer}>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={{ uri: photo || 'https://via.placeholder.com/100' }}
            style={styles.avatar}
          />
          <View style={styles.iconOverlay}>
            <Ionicons name="image" size={20} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>

      <CustomInput
        label="Nombre"
        icon="person"
        value={name}
        onChangeText={setName}
      />
      <CustomInput
        label="Correo"
        icon="mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <CustomInput
        label="DNI"
        icon="card"
        value={dni}
        onChangeText={setDni}
        keyboardType="numeric"
      />
      <CustomInput
        label="Contraseña"
        icon="eye"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={secureEntry}
        toggleSecure={() => setSecureEntry(!secureEntry)}
      />
      <CustomInput
        label="Repetir Contraseña"
        icon="eye"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={secureRepeat}
        toggleSecure={() => setSecureRepeat(!secureRepeat)}
      />

      <View style={{ marginTop: 16 }}>
        <Button title="Guardar" onPress={handleSave} color="#5E17EB" />
      </View>
    </ScreenScrollContainer>
  );
}

function CustomInput({
  label,
  icon,
  secureTextEntry,
  toggleSecure,
  ...props
}: any) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={label}
          secureTextEntry={secureTextEntry}
          {...props}
        />
        {toggleSecure ? (
          <TouchableOpacity onPress={toggleSecure}>
            <Ionicons
              name={secureTextEntry ? 'eye-off' : 'eye'}
              size={20}
              color="#999"
            />
          </TouchableOpacity>
        ) : (
          <Ionicons name={icon} size={20} color="#999" />
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
    color: '#333',
  },
  inputContainer: {
    backgroundColor: '#F1F4FA',
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
});