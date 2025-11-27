import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;

// --- Tipos ---

type User = {
  id: string;
  name: string;
  email: string;
  // Campos opcionales por si en el futuro los pasas desde el backend
  nombreInfante?: string;
  fechaRegistro?: string;
} | null;

type PerfilProps = {
  user: User;
  onSignOut: () => void;
  onNavigate: (route: string) => void;
};

// --- Componentes Reutilizables ---

const StatsCard = ({
  user,
  onSignOut,
}: {
  user: NonNullable<User>;
  onSignOut: () => void;
}) => {
  // Obtenemos el año actual o el de registro si existiera
  const joinedYear = user.fechaRegistro
    ? new Date(user.fechaRegistro).getFullYear()
    : new Date().getFullYear();

  return (
    <View style={styles.statsContainer}>
      {/* Avatar y Usuario */}
      <View style={styles.userInfo}>
        <Image
          // Placeholder con la inicial del usuario
          source={{
            uri: `https://ui-avatars.com/api/?name=${user.name}&background=FFD700&color=000&size=128`,
          }}
          style={styles.avatar}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.username}>{user.name}</Text>
          <Text style={styles.emailText}>{user.email}</Text>
          <Text style={styles.joinedText}>Se unió en {joinedYear}</Text>
        </View>

        {/* Botón de Salir pequeño al lado */}
        <TouchableOpacity onPress={onSignOut} style={styles.logoutIconBtn}>
          <MaterialCommunityIcons name="logout" size={24} color="#D9534F" />
        </TouchableOpacity>
      </View>

      {/* Fila de Estadísticas (Datos simulados por ahora) */}
      <View style={styles.statsRow}>
        <StatItem icon="⏳" label="Minutos" value="0" />
        <StatItem icon="🗓️" label="Semanas" value="0" />
        <StatItem icon="📓" label="Cuentos" value="0" />
      </View>
    </View>
  );
};

const StatItem = ({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) => (
  <View style={styles.statItem}>
    <Text style={styles.statIcon}>{icon}</Text>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

const AwardBadge = ({
  awarded = false,
  focused = false,
}: {
  awarded?: boolean;
  focused?: boolean;
}) => (
  <View
    style={[
      styles.awardBadge,
      awarded ? styles.awardBadgeAwarded : styles.awardBadgeLocked,
      focused && styles.awardBadgeFocused,
    ]}
  >
    <Text style={{ fontSize: 24 }}>{awarded ? "🏆" : "🔒"}</Text>
  </View>
);

// --- Componente Principal Perfil ---

export default function Perfil({ user, onSignOut, onNavigate }: PerfilProps) {
  // Barra de navegación interna
  const BottomNavBar = () => (
    // Usamos un contenedor 'wrapper' para centrar la barra flotante
    <View style={styles.navBarWrapper}>
      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.navBarItem}
          onPress={() => onNavigate("home")}
        >
          <MaterialCommunityIcons
            name="home-outline"
            size={28}
            color="#6b6b6b"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navBarItem}
          onPress={() => onNavigate("catalogo")}
        >
          <MaterialCommunityIcons name="magnify" size={28} color="#6b6b6b" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navBarItem}
          onPress={() => onNavigate("biblioteca")}
        >
          <MaterialCommunityIcons
            name="folder-outline"
            size={28}
            color="#6b6b6b"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navBarItem}>
          {/* Ícono activo: Color verde oscuro (#074B47) */}
          <MaterialCommunityIcons name="account" size={28} color="#074B47" />
        </TouchableOpacity>
      </View>
    </View>
  );

  // --- MODO NO AUTENTICADO ---
  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.fallbackContent}>
          <MaterialCommunityIcons
            name="account-circle-outline"
            size={80}
            color="#ccc"
            style={{ marginBottom: 20 }}
          />
          <Text style={styles.headerTitle}>Perfil</Text>
          <Text style={styles.fallbackText}>
            Inicia sesión para ver tu progreso y tus cuentos.
          </Text>

          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => onNavigate("login")}
          >
            <Text style={styles.btnTextPrimary}>Iniciar sesión</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onNavigate("home")}
            style={{ marginTop: 20 }}
          >
            <Text style={{ color: "#666" }}>Volver al inicio</Text>
          </TouchableOpacity>
        </View>
        <BottomNavBar />
      </View>
    );
  }

  // --- MODO AUTENTICADO ---
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Mi Perfil</Text>
        </View>
        {/* Botón de configuración (Visual) */}
        <TouchableOpacity onPress={() => onNavigate('settings')}>
          <MaterialCommunityIcons
            name="cog-outline"
            size={26}
            color="#303030"
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Pasamos los datos del usuario real */}
        <StatsCard user={user} onSignOut={onSignOut} />

        {/* <Text style={styles.sectionTitle}>Logros y Premios</Text>
        <View style={styles.awardsGrid}>
          <AwardBadge awarded={true} /> 
          <AwardBadge awarded={true} />
          <AwardBadge />
          <AwardBadge />
          <AwardBadge focused={true} /> 
          <AwardBadge />
        </View> */}

        {/* Botón Grande de Cerrar Sesión (Opcional, por si no ven el icono) */}
        <TouchableOpacity style={styles.btnLogoutBig} onPress={onSignOut}>
          <Text style={styles.btnLogoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>

        <View style={{ height: 80 }} />
      </ScrollView>

      <BottomNavBar />
    </View>
  );
}

// --- Estilos ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBF6F1",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 50,
    backgroundColor: "#FBF6F1",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#7D52F7",
  },

  // Fallback
  fallbackContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  fallbackText: {
    marginTop: 10,
    marginBottom: 30,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  btnPrimary: {
    backgroundColor: "#7D52F7",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
  },
  btnTextPrimary: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  // Stats Card
  statsContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginTop: 10,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 15,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
    backgroundColor: "#eee",
  },
  username: {
    fontSize: 22,
    fontWeight: "700",
    color: "#303030",
  },
  emailText: {
    fontSize: 14,
    color: "#888",
    marginBottom: 4,
  },
  joinedText: {
    fontSize: 12,
    color: "#074B47",
    fontWeight: "600",
  },
  logoutIconBtn: {
    padding: 10,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 5,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: "#999",
    marginBottom: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#074B47",
  },

  // Awards
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
    color: "#303030",
    marginLeft: 5,
  },
  awardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  awardBadge: {
    width: (screenWidth - 40 - 36) / 3,
    height: (screenWidth - 40 - 36) / 3,
    borderRadius: 15,
    margin: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  awardBadgeLocked: {
    backgroundColor: "#EBEBEB",
    opacity: 0.5,
  },
  awardBadgeAwarded: {
    backgroundColor: "#FFF4CC", // Dorado claro
    borderWidth: 1,
    borderColor: "#FFD700",
  },
  awardBadgeFocused: {
    borderWidth: 2,
    borderColor: "#7D52F7",
  },

  // Logout Button Big
  btnLogoutBig: {
    marginTop: 30,
    backgroundColor: "#FFE5E5",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  btnLogoutText: {
    color: "#D9534F",
    fontWeight: "700",
    fontSize: 16,
  },

  navBarWrapper: {
    position: 'absolute',
    bottom: 20, // Espacio desde el fondo de la pantalla
    left: 0,
    right: 0,
    alignItems: 'center', // Centra la barra horizontalmente
  },
  // NavBar
navBar: {
    flexDirection: 'row',
    width: '90%', // Ocupa el 90% del ancho
    height: 60,   // Altura de la cápsula
    backgroundColor: '#CFF6F0', // COLOR MENTA (Igual a la imagen)
    borderRadius: 30, // Bordes totalmente redondos
    alignItems: 'center',
    justifyContent: 'space-around',
    
    // Sombra suave para que flote
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5, // Sombra en Android
  },
  navBarItem: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    flex: 1,
  },
});
