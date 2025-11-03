import React, { useMemo, useState, useEffect } from 'react';
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  ActivityIndicator, // Importa el "spinner" de carga
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// 1. Importa la función de tu API
import { obtenerCuentos } from '../src/api'; 

type Book = {
  id: string;
  title: string;
  desc: string;
  timeMin: number;
  pages: number;
  createdWithAI?: boolean;
  favorite?: boolean;
  saved?: boolean;
};

// 2. ELIMINAMOS 'SAMPLE_BOOKS'
// const SAMPLE_BOOKS: Book[] = [ ... ];

export default function Biblioteca({
  onNavigate,
  activeRoute,
  isAuthenticated,
}: {
  onNavigate?: (r: string) => void;
  activeRoute?: string;
  isAuthenticated?: boolean;
}) {
  // 3. 'books' inicia como un array vacío
  const [books, setBooks] = useState<Book[]>([]);
  const [tab, setTab] = useState<'todo' | 'guardados' | 'favoritos' | 'creados'>('todo');
  const [query, setQuery] = useState('');

  // 4. Añadimos estados de carga y error
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 5. useEffect: Se ejecuta 1 vez cuando la pantalla carga
  useEffect(() => {
    const cargarCuentosDeAPI = async () => {
      try {
        setError(null);
        setCargando(true);
        const data = await obtenerCuentos(); // Llama a la API

        // 6. Validamos que la respuesta sea un array
        if (!Array.isArray(data)) {
          throw new Error('La respuesta de la API no es un array como se esperaba.');
        }

        // 7. FILTRAMOS para evitar el error 'toString of undefined'
        //    Solo procesamos cuentos que existan (no sean null) y tengan un 'id'
        const dataFiltrada = data.filter(cuento => cuento && cuento.id);

        // 8. Mapeo de Datos: Traduce la respuesta del backend al tipo 'Book'
        const cuentosMapeados: Book[] = dataFiltrada.map((cuento: any) => ({
          id: cuento.id.toString(), // Convertir ID numérico a string
          title: cuento.titulo, // Mapear 'titulo' a 'title'
          desc: cuento.descripcion, // Mapear 'descripcion' a 'desc'
          // --- Valores por defecto (ya que la API no los provee) ---
          timeMin: 5, // Puedes ajustar esto
          pages: 3, // Puedes ajustar esto
          createdWithAI: false, // En el futuro, esto vendrá de tu API
          favorite: false,
          saved: false,
        }));

        setBooks(cuentosMapeados); // Guarda los cuentos reales en el estado
      } catch (err: any) {
        setError(err.message); // Guarda el mensaje de error
      } finally {
        setCargando(false); // Deja de cargar (sea éxito o error)
      }
    };

    cargarCuentosDeAPI(); // Llama a la función
  }, []); // El array vacío [] asegura que se ejecute solo 1 vez

  // --- El resto de tu lógica no cambia ---

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = books.slice();
    if (tab === 'guardados') list = list.filter(b => b.saved);
    if (tab === 'favoritos') list = list.filter(b => b.favorite);
    if (tab === 'creados') list = list.filter(b => b.createdWithAI);
    if (q) list = list.filter(b => b.title.toLowerCase().includes(q) || b.desc.toLowerCase().includes(q));
    return list;
  }, [books, tab, query]);

  function toggleFavorite(id: string) {
    if (!isAuthenticated) {
      onNavigate && onNavigate('perfil');
      return;
    }
    setBooks(prev => prev.map(b => (b.id === id ? { ...b, favorite: !b.favorite } : b)));
  }

  function toggleSaved(id: string) {
    if (!isAuthenticated) {
      onNavigate && onNavigate('perfil');
      return;
    }
    setBooks(prev => prev.map(b => (b.id === id ? { ...b, saved: !b.saved } : b)));
  }

  function confirmDelete(id: string) {
    const book = books.find(b => b.id === id);
    if (!book) return;
    Alert.alert('Eliminar', `¿Eliminar "${book.title}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => setBooks(prev => prev.filter(p => p.id !== id)) },
    ]);
  }

  function renderItem({ item }: { item: Book }) {
    return (
      <View style={styles.itemRow}>
        <View style={styles.itemLeft}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemDesc}>{item.desc}</Text>
          <View style={styles.itemMeta}>
            <Text style={styles.metaText}>⏱ {item.timeMin} min</Text>
            <Text style={[styles.metaText, { marginLeft: 12 }]}>📎 {item.pages}</Text>
            {item.createdWithAI ? <Text style={[styles.metaText, { marginLeft: 12 }]}>🤖 IA</Text> : null}
          </View>
        </View>

        <View style={styles.itemRight}>
          <View style={styles.coverPlaceholder} />
          <View style={styles.itemActions}>
            <TouchableOpacity onPress={() => toggleSaved(item.id)} style={styles.actionBtn}>
              <MaterialCommunityIcons name={item.saved ? 'bookmark' : 'bookmark-outline'} size={20} color={item.saved ? '#074B47' : '#666'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toggleFavorite(item.id)} style={styles.actionBtn}>
              <MaterialCommunityIcons name={item.favorite ? 'heart' : 'heart-outline'} size={20} color={item.favorite ? '#e63946' : '#666'} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (!isAuthenticated) {
                  onNavigate && onNavigate('perfil');
                  return;
                }
                confirmDelete(item.id);
              }}
              style={styles.actionBtn}
            >
              <MaterialCommunityIcons name="delete-outline" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // 9. Función helper para renderizar el contenido principal
  const renderContenido = () => {
    // Muestra el indicador de "Cargando..."
    if (cargando) {
      return (
        <View style={styles.contenedorCentrado}>
          <ActivityIndicator size="large" color="#074B47" />
          <Text>Cargando biblioteca...</Text>
        </View>
      );
    }

    // Muestra el error si algo falló
    if (error) {
      return (
        <View style={styles.contenedorCentrado}>
          <Text style={styles.textoError}>Error al cargar:</Text>
          <Text style={styles.textoError}>{error}</Text>
        </View>
      );
    }

    // Muestra la lista de cuentos (o un mensaje si está vacía)
    return (
      <FlatList
        data={filtered} // 'filtered' ya usa 'books', así que esto funciona
        renderItem={renderItem}
        keyExtractor={b => b.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.contenedorCentrado}>
            <Text>No se encontraron cuentos.</Text>
            {tab !== 'todo' && <Text>Prueba en otra pestaña.</Text>}
          </View>
        }
      />
    );
  };

  return (
    <View style={styles.screen}>
      <View style={styles.headerRow}>
        <Image source={require('../assets/logominimal.png')} style={styles.smallLogo} />
        <Text style={styles.headerTitle}>Biblioteca</Text>
      </View>

      <View style={styles.pillsRow}>
        <TouchableOpacity style={[styles.pill, tab === 'todo' && styles.pillActive]} onPress={() => setTab('todo')}>
          <Text style={[styles.pillText, tab === 'todo' && styles.pillTextActive]}>Todo</Text>
        </TouchableOpacity>
        {/* Hice clicables las otras pestañas también */}
        <TouchableOpacity style={[styles.pill, tab === 'guardados' && styles.pillActive]} onPress={() => setTab('guardados')}>
          <Text style={[styles.pillText, tab === 'guardados' && styles.pillTextActive]}>Guardados</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.pill, tab === 'favoritos' && styles.pillActive]} onPress={() => setTab('favoritos')}>
          <Text style={[styles.pillText, tab === 'favoritos' && styles.pillTextActive]}>Favoritos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.pill, tab === 'creados' && styles.pillActive]} onPress={() => setTab('creados')}>
          <Text style={[styles.pillText, tab === 'creados' && styles.pillTextActive]}>Creados</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchBox}>
        <TouchableOpacity style={styles.menuIcon}>
          <Text>☰</Text>
        </TouchableOpacity>
        <TextInput placeholder="Hinted search text" value={query} onChangeText={setQuery} style={styles.searchInput} />
        <TouchableOpacity style={styles.searchBtn}>
          <MaterialCommunityIcons name="magnify" size={20} color="#333" />
        </TouchableOpacity>
      </View>

      {/* 10. Llama a la función de renderizado condicional */}
      {renderContenido()}

      {/* espaciador: último elemento visible sobre la barra inferior */}
      <View style={{ height: 84 }} />

      {/* barra inferior */}
      <View style={styles.bottomNavWrap} pointerEvents="box-none">
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} onPress={() => onNavigate && onNavigate('home')}>
            <MaterialCommunityIcons name={activeRoute === 'home' ? 'home' : 'home-outline'} size={26} color={activeRoute === 'home' ? '#074B47' : '#6b6b6b'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => onNavigate && onNavigate('catalogo')}>
            <MaterialCommunityIcons name={'magnify'} size={26} color={activeRoute === 'catalogo' ? '#074B47' : '#6b6b6b'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => onNavigate && onNavigate('biblioteca')}>
            <MaterialCommunityIcons name={activeRoute === 'biblioteca' ? 'folder' : 'folder-outline'} size={26} color={activeRoute === 'biblioteca' ? '#074B4T' : '#6b6b6b'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => onNavigate && onNavigate('perfil')}>
            <MaterialCommunityIcons name={activeRoute === 'perfil' ? 'account' : 'account-outline'} size={26} color={activeRoute === 'perfil' ? '#074B47' : '#6b6b6b'} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FBF6F1', paddingHorizontal: 18, paddingTop: 36 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 18 },
  smallLogo: { width: 28, height: 28, resizeMode: 'contain', marginRight: 8 },
  headerTitle: { fontSize: 32, fontWeight: '700', color: '#111' },
  pillsRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  pill: { paddingVertical: 8, paddingHorizontal: 14, backgroundColor: 'transparent', borderRadius: 20, marginRight: 8 },
  pillActive: { backgroundColor: '#CFF6F0' },
  pillText: { color: '#777' },
  pillTextActive: { color: '#074B47', fontWeight: '700' },
  searchBox: {
    marginTop: 12,
    backgroundColor: '#CFF6F0',
    borderRadius: 28,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  menuIcon: { marginRight: 8 },
  searchInput: { flex: 1, paddingHorizontal: 8 },
  searchBtn: { marginLeft: 8 },
  list: { paddingBottom: 20 },
  itemRow: {
    flexDirection: 'row',
    backgroundColor: '#F3E6FF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  itemLeft: { flex: 1, paddingRight: 8 },
  itemTitle: { fontSize: 18, fontWeight: '700', marginBottom: 6 },
  itemDesc: { color: '#444' },
  itemMeta: { flexDirection: 'row', marginTop: 8, alignItems: 'center' },
  metaText: { color: '#444', fontSize: 12 },
  itemRight: { alignItems: 'center' },
  coverPlaceholder: { width: 64, height: 92, backgroundColor: '#fff', borderRadius: 6, marginBottom: 8 },
  itemActions: { flexDirection: 'row' },
  actionBtn: { marginLeft: 8 },
  bottomNavWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 14,
    alignItems: 'center',
  },
  bottomNav: {
    width: '90%',
    height: 66,
    backgroundColor: '#CFF6F0',
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
    overflow: 'hidden',
  },
  navItem: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  navIcon: { fontSize: 22 },

  // --- 11. Estilos para Carga y Error ---
  contenedorCentrado: {
    flex: 1, // Para que ocupe el espacio de la lista
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    height: 300, // Le damos una altura fija para que no colapse
  },
  textoError: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});

