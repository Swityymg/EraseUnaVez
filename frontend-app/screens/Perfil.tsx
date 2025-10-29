import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Perfil({ user, onSignOut, onNavigate }: { user: { id: string; name: string; email: string } | null; onSignOut: () => void; onNavigate?: (r: string) => void }) {
  if (!user) {
    return (
      <View style={styles.screen}>
        <Text style={styles.title}>Perfil</Text>
        <Text style={{ marginBottom: 12 }}>No has iniciado sesión.</Text>
        <TouchableOpacity style={styles.btn} onPress={() => onNavigate && onNavigate('login')}>
          <Text style={styles.btnText}>Iniciar sesión</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Hola, {user.name}</Text>
      <Text style={{ marginTop: 8 }}>{user.email}</Text>
      <TouchableOpacity style={[styles.btn, { marginTop: 20 }]} onPress={onSignOut}>
        <Text style={styles.btnText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FBF6F1', padding: 18, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 18 },
  btn: { backgroundColor: '#CFF6F0', padding: 14, borderRadius: 12, alignItems: 'center' },
  btnText: { color: '#074B47', fontWeight: '700' },
});
