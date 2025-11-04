import React, { useState, useEffect } from 'react'; // Importamos hooks
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ActivityIndicator, // Para el "spinner" de carga
} from 'react-native';

// Importamos la función de la API
import { obtenerCuentos } from '../src/api';

const { width } = Dimensions.get('window');

// Definimos un tipo simple para los datos que esperamos de la API
type CuentoSimple = {
  id: string; // Ya lo convertimos a string en el backend
  titulo: string;
  urlPortada?: string; // Hacemos la url opcional
};

// --- COMPONENTE 'BOOKCARD' MEJORADO ---
// Ahora se llama BookCard y acepta un cuento real
function BookCard({ cuento }: { cuento: CuentoSimple }) {
  return (
    <View style={styles.bookCard}>
      {/* Usamos <Image> para mostrar la portada.
        source={{ uri: ... }} es cómo React Native carga imágenes desde una URL
      */}
      <Image
        source={{ uri: cuento.urlPortada }}
        style={styles.bookCover}
        resizeMode="cover" // Asegura que la imagen cubra el espacio
      />
      <Text style={styles.bookTitle} numberOfLines={2}>
        {cuento.titulo}
      </Text>
    </View>
  );
}

export default function Inicio({ onNavigate, activeRoute }: { onNavigate?: (route: string) => void; activeRoute?: string }) {
  // Estados para guardar los cuentos, la carga y el error
  const [cuentos, setCuentos] = useState<CuentoSimple[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect para cargar los datos cuando la pantalla se monta
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
  }, []); // El array vacío [] asegura que se ejecute solo 1 vez

  // --- FUNCIÓN PARA RENDERIZAR EL CONTENIDO ---
  const renderContenido = () => {
    if (cargando) {
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
          <Text style={{ color: 'red' }}>Error al cargar:</Text>
          <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>
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
        {/* Por ahora, las 3 secciones muestran la *misma* lista.
          Más adelante, puedes crear lógica para separarlas.
        */}
        <Text style={styles.sectionTitleLarge}>Tus Cuentos</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.hScroll}
          contentContainerStyle={styles.hContent}
        >
          {cuentos.map(cuento => (
            <BookCard key={cuento.id} cuento={cuento} />
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Anteriores</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.hScroll}
          contentContainerStyle={styles.hContent}
        >
          {cuentos.slice().reverse().map(cuento => ( // Muestra la lista al revés
            <BookCard key={cuento.id} cuento={cuento} />
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Los más leídos</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.hScroll}
          contentContainerStyle={styles.hContent}
        >
          {cuentos.map(cuento => (
            <BookCard key={cuento.id} cuento={cuento} />
          ))}
        </ScrollView>
      </>
    );
  };


  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.wrapper} showsHorizontalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Image source={require('../assets/logominimal.png')} style={styles.smallLogo} />
          <Text style={styles.headerTitle}>Inicio</Text>
        </View>

        {/* Aquí llamamos a la función de renderizado */}
        {renderContenido()}

        {/* espaciador: evita que el contenido quede oculto por la barra inferior */}
        <View style={{ height: 72 }} />
      </ScrollView>

      {/* --- BARRA DE NAVEGACIÓN INFERIOR (Sin cambios) --- */}
      <View style={styles.bottomNavWrap}>
        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={styles.navItem}
            activeOpacity={0.7}
            onPress={() => onNavigate && onNavigate('home')}
          >
            <MaterialCommunityIcons
              name={activeRoute === 'home' ? 'home' : 'home-outline'}
              size={26}
              color={activeRoute === 'home' ? '#074B47' : '#6b6b6b'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navItem}
            activeOpacity={0.7}
            onPress={() => onNavigate && onNavigate('catalogo')}
          >
            <MaterialCommunityIcons
              name={activeRoute === 'catalogo' ? 'magnify' : 'magnify'}
              size={26}
              color={activeRoute === 'catalogo' ? '#074B47' : '#6b6b6b'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navItem}
            activeOpacity={0.7}
            onPress={() => onNavigate && onNavigate('biblioteca')}
          >
            <MaterialCommunityIcons
              name={activeRoute === 'biblioteca' ? 'folder' : 'folder-outline'}
              size={26}
              color={activeRoute === 'biblioteca' ? '#074B47' : '#6b6b6b'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navItem}
            activeOpacity={0.7}
            onPress={() => onNavigate && onNavigate('perfil')}
          >
            <MaterialCommunityIcons
              name={activeRoute === 'perfil' ? 'account' : 'account-outline'}
              size={26}
              color={activeRoute === 'perfil' ? '#074B47' : '#6b6b6b'}
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
  screen: { flex: 1, backgroundColor: '#FBF6F1', overflow: 'hidden' },
  wrapper: { paddingTop: 36, paddingHorizontal: 18, paddingBottom: 20, minWidth: '100%' },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 18 },
  smallLogo: { width: 28, height: 28, resizeMode: 'contain', marginRight: 8 },
  headerTitle: { fontSize: 26, fontWeight: '600', color: '#111' },
  sectionTitleLarge: { fontSize: 20, fontWeight: '700', marginBottom: 10, marginTop: 6 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 10, marginTop: 18 },
  hScroll: { paddingBottom: 6 },
  hContent: { paddingRight: 18 },
  bookCard: { width: CARD_WIDTH, marginRight: 12 },
  bookCover: {
    width: '100%',
    height: CARD_WIDTH * 1.1,
    borderRadius: 8,
    backgroundColor: '#E6F8F5', // Color de fondo mientras carga la imagen
  },
  bookTitle: { marginTop: 8, fontSize: 13, fontWeight: '600', color: '#222' },

  // Estilo para el contenedor de carga/error
  contenedorCentrado: {
    minHeight: 200, // Le da algo de espacio
    justifyContent: 'center',
    alignItems: 'center',
  },

  bottomNavWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 12,
    alignItems: 'center',
  },
  bottomNav: {
    width: width - 36,
    maxWidth: width - 36,
    height: 56, // altura reducida para compactar espacio vertical
    backgroundColor: '#CFF6F0',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 4,
    overflow: 'hidden',
  },
  navItem: { alignItems: 'center', justifyContent: 'center', flex: 1 },
});
