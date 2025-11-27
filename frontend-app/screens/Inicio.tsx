import React, { useState, useEffect } from "react"; // Importamos hooks
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ActivityIndicator, // Para el "spinner" de carga
  ImageSourcePropType,
} from "react-native";
import { obtenerCuentos } from "../src/api"; // Importamos la función de la API

const { width } = Dimensions.get("window");

// Definimos un tipo simple para los datos que esperamos de la API
type CuentoSimple = {
  id: string;
  titulo: string;
  urlPortada?: string;
};

function BookCard({
  cuento,
  onSelect,
}: {
  cuento: CuentoSimple;
  onSelect: (id: string) => void;
}) {
  const defaultCover = require("../assets/ImagenPorDefecto.png");

  const imageUrlSource: ImageSourcePropType = cuento.urlPortada
    ? { uri: cuento.urlPortada }
    : defaultCover;

  return (
    <TouchableOpacity
      style={styles.bookCard}
      activeOpacity={0.7}
      onPress={() => {
        console.log("1. Click en tarjeta, ID:", cuento.id);
        onSelect(cuento.id);
      }}
    >
      <Image
        source={imageUrlSource}
        style={styles.bookCover}
        resizeMode="cover"
      />
      <Text style={styles.bookTitle} numberOfLines={2}>
        {cuento.titulo}
      </Text>
    </TouchableOpacity>
  );
}

export default function Inicio({
  onNavigate,
  activeRoute,
}: {
  onNavigate?: (route: string, params?: { idCuento: string }) => void;
  activeRoute?: string;
}) {
  const [cuentos, setCuentos] = useState<CuentoSimple[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargando(true);
        setError(null);

        // Llamamos a la API (que ya trae las URLs de imagen completas)
        const data = await obtenerCuentos();

        // Mapeamos los datos para asegurarnos que coincidan con CuentoSimple
        const cuentosMapeados: CuentoSimple[] = data
          .filter((c: any) => c.id && c.titulo) // Filtro de seguridad
          .map((c: any) => ({
            id: c.id.toString(),
            titulo: c.titulo,
            urlPortada: c.urlPortada, // Esta ya es la URL completa
          }));

        setCuentos(cuentosMapeados);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  // Función para manejar el clic en la tarjeta del cuento
  const handleCuentoPress = (idCuento: string) => {
    console.log("2. Inicio recibió el click, enviando a App con ID:", idCuento); // <--- AGREGA ESTO
    console.log("¿Existe onNavigate?", !!onNavigate); // <--- Verifica si la función existe
    if (onNavigate) {
      onNavigate("paginaCuento", { idCuento });
    }
  };

  const renderContenido = () => {
    if (cargando || error || cuentos.length === 0) {
      return (
        <View style={styles.contenedorCentrado}>
          <ActivityIndicator size="large" color="#074B47" />
          <Text style={{ marginTop: 10 }}>Cargando cuentos...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.contenedorCentrado}>
          <Text style={{ color: "red" }}>Error al cargar:</Text>
          <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>
        </View>
      );
    }

    if (cuentos.length === 0) {
      return (
        <View style={styles.contenedorCentrado}>
          <Text>No se encontraron cuentos.</Text>
        </View>
      );
    }

    // Si todo sale bien, muestra los carruseles
    return (
      <>
        {/* Tus cuentos */}
        <Text style={styles.sectionTitleLarge}>Tus Cuentos</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.hScroll}
          contentContainerStyle={styles.hContent}
        >
          {cuentos.map((cuento) => (
            <BookCard
              key={cuento.id}
              cuento={cuento}
              onSelect={handleCuentoPress}
            />
          ))}
        </ScrollView>

        {/* Anteriores */}
        <Text style={styles.sectionTitle}>Anteriores</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.hScroll}
          contentContainerStyle={styles.hContent}
        >
          {cuentos
            .slice()
            .reverse()
            .map(
              (
                cuento // Muestra la lista al revés
              ) => (
                <BookCard
                  key={cuento.id}
                  cuento={cuento}
                  onSelect={handleCuentoPress}
                />
              )
            )}
        </ScrollView>

        {/* Más Leidos */}
        <Text style={styles.sectionTitle}>Los más leídos</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.hScroll}
          contentContainerStyle={styles.hContent}
        >
          {cuentos.map((cuento) => (
            <BookCard
              key={cuento.id}
              cuento={cuento}
              onSelect={handleCuentoPress}
            />
          ))}
        </ScrollView>
      </>
    );
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.wrapper}
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <Image
            source={require("../assets/logominimal.png")}
            style={styles.smallLogo}
          />
          <Text style={styles.headerTitle}>Inicio</Text>
        </View>

        {/* Aquí llamamos a la función de renderizado */}
        {renderContenido()}

        {/* espaciador: evita que el contenido quede oculto por la barra inferior */}
        <View style={{ height: 72 }} />
      </ScrollView>

      {/* --- BARRA DE NAVEGACIÓN INFERIOR --- */}
      <View style={styles.bottomNavWrap}>
        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={styles.navItem}
            activeOpacity={0.7}
            onPress={() => onNavigate && onNavigate("home")}
          >
            <MaterialCommunityIcons
              name={activeRoute === "home" ? "home" : "home-outline"}
              size={26}
              color={activeRoute === "home" ? "#074B47" : "#6b6b6b"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navItem}
            activeOpacity={0.7}
            onPress={() => onNavigate && onNavigate("catalogo")}
          >
            <MaterialCommunityIcons
              name={activeRoute === "catalogo" ? "magnify" : "magnify"}
              size={26}
              color={activeRoute === "catalogo" ? "#074B47" : "#6b6b6b"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navItem}
            activeOpacity={0.7}
            onPress={() => onNavigate && onNavigate("biblioteca")}
          >
            <MaterialCommunityIcons
              name={activeRoute === "biblioteca" ? "folder" : "folder-outline"}
              size={26}
              color={activeRoute === "biblioteca" ? "#074B47" : "#6b6b6b"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navItem}
            activeOpacity={0.7}
            onPress={() => onNavigate && onNavigate("perfil")}
          >
            <MaterialCommunityIcons
              name={activeRoute === "perfil" ? "account" : "account-outline"}
              size={26}
              color={activeRoute === "perfil" ? "#074B47" : "#6b6b6b"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ancho fijo de tarjeta para evitar overflow horizontal
const CARD_WIDTH = 120;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FBF6F1", overflow: "hidden" },
  wrapper: {
    paddingTop: 36,
    paddingHorizontal: 18,
    paddingBottom: 20,
    minWidth: "100%",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 18,
  },
  smallLogo: { width: 28, height: 28, resizeMode: "contain", marginRight: 8 },
  headerTitle: { fontSize: 26, fontWeight: "600", color: "#111" },
  sectionTitleLarge: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    marginTop: 18,
  },
  hScroll: { paddingBottom: 6 },
  hContent: { paddingRight: 18 },
  bookCard: { width: CARD_WIDTH, marginRight: 12 },
  bookCover: {
    width: "100%",
    height: CARD_WIDTH * 1.1,
    borderRadius: 8,
    backgroundColor: "#E6F8F5",
  },
  bookTitle: { marginTop: 8, fontSize: 13, fontWeight: "600", color: "#222" },

  // Estilo para el contenedor de carga/error
  contenedorCentrado: {
    minHeight: 200,
    justifyContent: "center",
    alignItems: "center",
  },

  bottomNavWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 12,
    alignItems: "center",
  },
  bottomNav: {
    width: width - 36,
    maxWidth: width - 36,
    height: 56,
    backgroundColor: "#CFF6F0",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 8,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 4,
    overflow: "hidden",
  },
  navItem: { alignItems: "center", justifyContent: "center", flex: 1 },
});
