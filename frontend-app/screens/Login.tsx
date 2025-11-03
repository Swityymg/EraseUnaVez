import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator, // Importar "spinner"
} from 'react-native';

// Importar la función de la API real
import { iniciarSesion } from '../src/api';

export default function Login({
  onSignIn,
  onNavigate,
}: {
  onSignIn: (email: string) => void; // Esta prop es la que recibe App.tsx
  onNavigate?: (r: string) => void;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false); // Estado de carga

  // Convertimos 'submit' en una función asíncrona
  async function submit() {
    if (!email) {
      Alert.alert('Error', 'El email es obligatorio');
      return;
    }
    if (!password) {
      Alert.alert('Error', 'La contraseña es obligatoria');
      return;
    }
    if (cargando) return;

    setCargando(true);
    try {
      // 1. Llamar a la API real
      const data = await iniciarSesion(email, password);

      // 2. ¡Éxito! Llamamos a 'onSignIn' (en App.tsx)
      //    y le pasamos el email real del usuario que logueó.
      //    Aquí es donde App.tsx recibirá el email y dejará de fallar.
      onSignIn(data.usuario.email);

      // 3. Navegar a 'home'
      onNavigate && onNavigate('home');
      
    } catch (error: any) {
      // Si el backend da un error (ej: "Credenciales inválidas" de nuevo)
      Alert.alert('Error de Login', error.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Iniciar sesión</Text>
      <TextInput
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        editable={!cargando} // Deshabilitar mientras carga
      />
      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        editable={!cargando} // Deshabilitar mientras carga
      />
      <TouchableOpacity
        style={[styles.btn, cargando && styles.btnDisabled]} // Estilo deshabilitado
        onPress={submit}
        disabled={cargando} // Deshabilitar botón
      >
        {cargando ? (
          <ActivityIndicator size="small" color="#074B47" />
        ) : (
          <Text style={styles.btnText}>Entrar</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onNavigate && onNavigate('home')} style={{ marginTop: 12 }}>
        <Text style={{ color: '#666' }}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FBF6F1', padding: 18, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 18 },
  input: { backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 12 },
  btn: {
    backgroundColor: '#CFF6F0',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 48, // Altura fija
    justifyContent: 'center', // Centrar spinner
  },
  btnDisabled: {
    backgroundColor: '#E0F8F5', // Color más claro
  },
  btnText: { color: '#074B47', fontWeight: '700' },
});

