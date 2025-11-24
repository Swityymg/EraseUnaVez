// Perfil.tsx - Componente de React Native para la pantalla de perfil.
// Usa 'View' simple para evitar el error de '<SafeAreaProvider>'.

import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  Dimensions 
} from 'react-native';

// La importación de SafeAreaView ha sido removida para evitar el error de "No safe area value available".
// Si puedes, la mejor solución es envolver tu app en <SafeAreaProvider>.

const screenWidth = Dimensions.get('window').width;

// --- Tipos para las props ---
type UserProfile = { 
  id: string;
  username: string; // @camacho22
  joinedYear: number; // 2020
  readTimeMin: number; // 0 min
  readWeeks: number; // 0
  readStories: number; // 0
  isLoggedIn: boolean; // Para decidir qué renderizar
};

type PerfilProps = { 
  user: UserProfile | null; 
  onSignOut: () => void;
  onNavigate: (route: string) => void; 
};

// --- Componentes Reutilizables ---

/**
 * Muestra las estadísticas clave del usuario en la tarjeta lila.
 */
const StatsCard = ({ user }: { user: UserProfile }) => (
  <View style={styles.statsContainer}>
    {/* Avatar y Usuario */}
    <View style={styles.userInfo}>
      <Image 
        source={{ uri: 'https://via.placeholder.com/60/FFD700/000000?text=A' }} 
        style={styles.avatar}
      />
      <View>
        <Text style={styles.username}>@{user.username}</Text>
        <Text style={styles.joinedText}>Se unió en {user.joinedYear}</Text>
      </View>
    </View>
    
    {/* Fila de Estadísticas */}
    <View style={styles.statsRow}>
      <StatItem icon="⏳" label="Tiempo de lectura" value={`${user.readTimeMin} min`} />
      <StatItem icon="🗓️" label="Semanas lectoras" value={user.readWeeks.toString()} />
      <StatItem icon="📓" label="Cuentos leídos" value={user.readStories.toString()} />
    </View>
  </View>
);

const StatItem = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <View style={styles.statItem}>
    <Text style={styles.statIcon}>{icon}</Text>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

/**
 * Simulación de una medalla de premio.
 */
const AwardBadge = ({ awarded = false, focused = false }: { awarded?: boolean, focused?: boolean }) => (
  <View style={[
    styles.awardBadge,
    awarded ? styles.awardBadgeAwarded : styles.awardBadgeLocked,
    focused && styles.awardBadgeFocused
  ]}>
    {/* Placeholder para la medalla */}
  </View>
);

/**
 * Barra de navegación inferior (simulación).
 */
const BottomNavBar = () => (
  <View style={styles.navBar}>
    <TouchableOpacity style={styles.navBarItem}>
      <Text style={styles.navIcon}>🏠</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.navBarItem}>
      <Text style={styles.navIcon}>🔍</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.navBarItem}>
      <Text style={styles.navIcon}>📂</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.navBarItem}>
      <Text style={styles.navIconSelected}>👤</Text> {/* Perfil seleccionado */}
    </TouchableOpacity>
  </View>
);

// --- Componente Principal Perfil ---

export default function Perfil({ user, onSignOut, onNavigate }: PerfilProps) {
  
  const safeNavigate = (route: string) => {
    try {
      if (onNavigate) {
        onNavigate(route);
      } else {
        console.error(`ERROR: onNavigate no está definido para la ruta: ${route}`);
      }
    } catch (e) {
      console.error("Fallo al ejecutar onNavigate:", e);
    }
  };


  // Manejo de usuario no autenticado (Fallback)
  if (!user || !user.isLoggedIn) {
    return (
      <View style={styles.container}>
        
        {/* Botón de Regresar (Back) en la esquina superior izquierda */}
        <View style={styles.backButtonContainer}>
          <TouchableOpacity onPress={() => safeNavigate('back')}>
            <Text style={styles.backIcon}>⬅️</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.fallbackContent}>
          <Text style={styles.headerTitle}>Perfil</Text>
          <Text style={styles.fallbackText}>Inicia sesión para ver tu perfil y estadísticas.</Text>
          
          {/* Botón de Iniciar Sesión (Tamaño reducido) */}
          <TouchableOpacity style={styles.smallBtn} onPress={() => safeNavigate('login')}>
            <Text style={styles.smallBtnText}>Iniciar sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Contenido de la pantalla de perfil (Autenticado)
  return (
    <View style={styles.container}>
      {/* Header Fijo (con padding superior manual para el área segura) */}
      <View style={styles.header}> 
        <View style={styles.headerLeft}>
          <Text style={styles.bookIcon}>📖</Text>
          <Text style={styles.headerTitle}>Perfil</Text>
        </View>
        
        {/* Engrane (Settings/Configuración) */}
        <TouchableOpacity onPress={() => safeNavigate('settings')}> 
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Tarjeta de Estadísticas */}
        <StatsCard user={user} />

        {/* Sección de Premios */}
        <Text style={styles.sectionTitle}>Premios</Text>
        <View style={styles.awardsGrid}>
          {/* Premios: Usando el parámetro 'awarded' y 'focused' para simular los estados */}
          
          {/* Fila 1 */}
          <AwardBadge awarded={true} /> 
          <AwardBadge />
          <AwardBadge />
          
          {/* Fila 2 */}
          <AwardBadge />
          <AwardBadge focused={true} /> 
          <AwardBadge />
          
          {/* Fila 3 */}
          <AwardBadge />
          <AwardBadge />
          <AwardBadge />
        </View>

        {/* Espacio para la barra de navegación */}
        <View style={{ height: 60 }} />

      </ScrollView>

      {/* Barra de Navegación Inferior */}
      <BottomNavBar />
    </View>
  );
}

// --- Estilos ---

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FBF6F1' // Fondo general (crema/beige claro)
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  // --- Header del Perfil Autenticado ---
  // El paddingTop se aplica manualmente en el componente para simular el área segura.
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingTop: 40, // Asume un valor estándar para la barra de estado
    backgroundColor: '#FBF6F1',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookIcon: {
    fontSize: 20,
    marginRight: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#303030', 
  },
  settingsIcon: {
    fontSize: 24,
    color: '#303030', 
  },
  // --- Fallback (No Autenticado) ---
  // Estructura para el botón de regreso y contenido centrado.
  backButtonContainer: {
    paddingHorizontal: 20,
    paddingTop: 40, // Padding superior para la barra de estado
    alignSelf: 'flex-start',
  },
  fallbackContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginBottom: 80, // Compensa el espacio del botón de regreso y el padding
  },
  fallbackText: {
    marginTop: 10,
    marginBottom: 30,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  // Botones más pequeños para el fallback 
  smallBtn: { 
    backgroundColor: '#EBE0F4', 
    paddingVertical: 10, 
    paddingHorizontal: 25,
    borderRadius: 12, 
    alignItems: 'center', 
    marginTop: 20 
  },
  smallBtnText: { 
    color: '#303030', 
    fontWeight: '700',
    fontSize: 16,
  },
  backIcon: {
    fontSize: 24,
    color: '#303030',
  },
  // --- Tarjeta de Estadísticas ---
  statsContainer: {
    backgroundColor: '#EBE0F4', 
    borderRadius: 20,
    padding: 20,
    marginTop: 10,
    marginBottom: 30,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1, 
    borderBottomColor: 'rgba(0,0,0,0.05)',
    paddingBottom: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  username: {
    fontSize: 20,
    fontWeight: '700',
    color: '#303030',
  },
  joinedText: {
    fontSize: 14,
    color: '#666',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    fontSize: 30, 
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#303030',
  },
  // --- Sección de Premios ---
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 15,
    color: '#303030',
    marginLeft: 5,
  },
  awardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  awardBadge: {
    width: (screenWidth - 40 - 40) / 3, 
    height: (screenWidth - 40 - 40) / 3,
    borderRadius: 15,
    margin: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  awardBadgeLocked: {
    backgroundColor: '#F7E0E3',
  },
  awardBadgeAwarded: {
    backgroundColor: '#FFC83D',
  },
  awardBadgeFocused: {
    borderWidth: 3,
    borderColor: '#007AFF',
  },
  // --- Barra de Navegación Inferior ---
  navBar: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  navBarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  navIcon: {
    fontSize: 24,
    color: '#A0A0A0', 
  },
  navIconSelected: {
    fontSize: 24,
    color: '#303030', 
  },
});
