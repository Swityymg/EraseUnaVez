// Settings.tsx - Pantalla de configuración del usuario
// Implementa el diseño de la imagen con opciones de toggles y botones de acción.

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Switch, 
  ScrollView 
} from 'react-native';

// --- Tipos de Props ---
type SettingsProps = {
  // Función para volver atrás (llamada al hacer clic en la flecha)
  onNavigate: (route: string) => void;
  // Función para cerrar la sesión
  onSignOut: () => void;
};

// --- Componentes Reutilizables ---

/**
 * Componente para una fila de opción con un interruptor (switch)
 */
const SettingToggle = ({ label, initialValue }: { label: string; initialValue: boolean }) => {
  const [isEnabled, setIsEnabled] = useState(initialValue);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  return (
    <View style={styles.settingRow}>
      <Text style={styles.settingLabel}>{label}</Text>
      {/* Switch de React Native */}
      <Switch
        trackColor={{ false: "#E0E0E0", true: "#9DC8B6" }} // Verde agua claro
        thumbColor={isEnabled ? "#074B47" : "#f4f3f4"} // Verde oscuro o gris claro
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    </View>
  );
};


// --- Componente Principal Settings ---

export default function Settings({ onNavigate, onSignOut }: SettingsProps) {
  
  // Función segura para cerrar sesión
  const handleSignOut = () => {
    // Aquí puedes añadir lógica de confirmación si es necesario
    onSignOut();
  };

  return (
    // View principal con estilo similar al fondo del perfil
    <View style={styles.container}>
      
      {/* Header Fijo */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onNavigate('back')} style={styles.backButton}>
          <Text style={styles.backIcon}>⬅️</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configuración</Text>
        {/* Placeholder para centrar el título si fuera necesario */}
        <View style={styles.backButton} /> 
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Opciones de Toggles Sencillos */}
        <SettingToggle label="Modo Oscuro" initialValue={false} />
        <SettingToggle label="Música de Fondo" initialValue={true} />

        {/* Botón CERRAR SESIÓN */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutButtonText}>⭐ CERRAR SESIÓN</Text>
        </TouchableOpacity>

        {/* Botón Ayuda */}
        <TouchableOpacity style={styles.helpButton} onPress={() => onNavigate('help')}>
          <Text style={styles.helpButtonText}>❓ Ayuda</Text>
        </TouchableOpacity>

      </ScrollView>
      
      {/* Aquí no se incluye BottomNavBar ya que el Settings overlay/page es generalmente modal y ocupa toda la pantalla. */}

    </View>
  );
}

// --- Estilos ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBF6F1', // Fondo crema/beige claro
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 50,
  },
  // --- Header y Navegación ---
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingTop: 40, // Espacio para la barra de estado
    backgroundColor: '#FBF6F1',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#303030',
  },
  backButton: {
    padding: 10, // Área táctil
  },
  backIcon: {
    fontSize: 24,
    color: '#303030',
  },
  // --- Filas de Configuración (Toggles) ---
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0', // Separador sutil
  },
  settingLabel: {
    fontSize: 18,
    color: '#303030',
  },
  // --- Botones de Acción ---
  signOutButton: {
    backgroundColor: '#8A56E2', // Púrpura
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  signOutButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  helpButton: {
    backgroundColor: '#EBE0F4', // Lila suave
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D4C1F0',
    marginTop: 10,
  },
  helpButtonText: {
    color: '#303030',
    fontSize: 16,
    fontWeight: '600',
  },
});