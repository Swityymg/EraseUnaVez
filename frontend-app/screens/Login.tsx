import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function Login({ onSignIn, onNavigate }: { onSignIn: (email: string) => void; onNavigate?: (r: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function submit() {
    if (!email) return;
    // inicio simulado
    onSignIn(email);
    // volver a Inicio o pantalla anterior
    onNavigate && onNavigate('home');
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Iniciar sesión</Text>
      <TextInput placeholder="Email" keyboardType="email-address" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <TouchableOpacity style={styles.btn} onPress={submit}>
        <Text style={styles.btnText}>Entrar</Text>
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
  btn: { backgroundColor: '#CFF6F0', padding: 14, borderRadius: 12, alignItems: 'center' },
  btnText: { color: '#074B47', fontWeight: '700' },
});
