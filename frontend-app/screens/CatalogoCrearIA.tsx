import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const CATEGORIES = [
  { title: '+3 años', desc: 'Aprendiendo a leer', emoji: '🧒' },
  { title: '+5 años', desc: 'Historias cortas', emoji: '📚' },
  { title: '+7 años', desc: 'Cuentos con valores', emoji: '🌟' },
];

export default function CatalogoCrearIA({ onBack, onNavigate, activeRoute, isAuthenticated }: { onBack?: () => void; onNavigate?: (route: string) => void; activeRoute?: string; isAuthenticated?: boolean }) {
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.wrapper}>
        <View style={styles.headerRow}>
          <Image source={require('../assets/logominimal.png')} style={styles.smallLogo} />
          <Text style={styles.headerTitle}>Catálogo</Text>
        </View>

        <View style={styles.searchBox}>
          <TouchableOpacity style={styles.menuIcon}>
            <Text>☰</Text>
          </TouchableOpacity>
          <TextInput placeholder="Buscar cuentos, personajes..." style={styles.searchInput} />
          <TouchableOpacity style={styles.searchBtn}>
            <Text>🔍</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Novedades</Text>
        <View style={styles.hero} />

        <Text style={styles.sectionTitle}>Categorías</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
          {CATEGORIES.map((c, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.categoryTile, c.title === 'Crear con IA' ? styles.categoryTileHighlight : undefined]}
              activeOpacity={0.85}
              onPress={() => onNavigate && onNavigate('catalogo')}
            >
              <View style={styles.tileIcon}>
                <Text style={styles.tileEmoji}>{c.emoji}</Text>
              </View>
              <Text style={styles.tileTitle}>{c.title}</Text>
              <Text style={styles.tileDesc}>{c.desc}</Text>
              <View style={styles.tileFooter}>
                <MaterialCommunityIcons name="chevron-right" size={18} color="rgba(0,0,0,0.6)" />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={[styles.sectionTitle, { marginTop: 18 }]}>Crear con IA</Text>
        <View style={styles.iaWrap}>
          <Image source={require('../assets/creaconIA.jpg')} style={styles.iaImg} />
          <Text style={styles.iaDesc}>
            Con una frase puedes crear un libro infantil en segundos. Describe brevemente los
            personajes y el contexto.
          </Text>
          <TouchableOpacity
            style={styles.createBtn}
            onPress={() => {
              if (!isAuthenticated) {
                onNavigate && onNavigate('perfil');
                return;
              }
              // abrir creación (pendiente)
            }}
          >
            <Text style={styles.createBtnText}>Describe tu cuento para crear con IA</Text>
          </TouchableOpacity>
        </View>

  {/* espaciado manejado por paddingBottom para evitar que el contenido quede oculto por la barra inferior */}
      </ScrollView>

      <View style={styles.bottomNavWrap}>
        <View style={styles.bottomNav}>
          {/* indicador eliminado (solicitado) */}
          <TouchableOpacity style={styles.navItem} onPress={() => onBack && onBack()}>
            <MaterialCommunityIcons name={activeRoute === 'home' ? 'home' : 'home-outline'} size={26} color={activeRoute === 'home' ? '#074B47' : '#6b6b6b'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => onNavigate && onNavigate('catalogo')}>
            <MaterialCommunityIcons name={activeRoute === 'catalogo' ? 'magnify' : 'magnify'} size={26} color={activeRoute === 'catalogo' ? '#074B47' : '#6b6b6b'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => onNavigate && onNavigate('biblioteca')}>
            <MaterialCommunityIcons name={activeRoute === 'biblioteca' ? 'folder' : 'folder-outline'} size={26} color={activeRoute === 'biblioteca' ? '#074B47' : '#6b6b6b'} />
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
  screen: { flex: 1, backgroundColor: '#FBF6F1' },
  wrapper: { paddingTop: 36, paddingHorizontal: 18, paddingBottom: 110 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 18 },
  smallLogo: { width: 28, height: 28, resizeMode: 'contain', marginRight: 8 },
  headerTitle: { fontSize: 26, fontWeight: '600', color: '#111' },
  searchBox: {
    marginTop: 12,
    backgroundColor: '#CFF6F0',
    borderRadius: 28,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  }, 
  menuIcon: { marginRight: 8 },
  searchInput: { flex: 1, paddingHorizontal: 8 },
  searchBtn: { marginLeft: 8 },
  sectionTitle: { fontSize: 20, fontWeight: '700', marginTop: 18, marginBottom: 10 },
  hero: { height: 140, backgroundColor: '#fff', borderRadius: 6 },
  /* tarjeta vertical antigua (reemplazada) */
  categoryCard: { flexDirection: 'row', backgroundColor: '#F3E6FF', borderRadius: 8, marginTop: 12, overflow: 'hidden' },
  catLeft: { flex: 1, padding: 12 },
  catTitle: { fontWeight: '700', marginBottom: 6 },
  catDesc: { color: '#444' },
  catImgPlaceholder: { width: 72, backgroundColor: '#fff' },

  /* nuevas fichas de categoría */
  categoriesScroll: { paddingVertical: 6 },
  categoryTile: {
    width: 160,
    height: 120,
    borderRadius: 16,
    backgroundColor: '#E8DAFF', // moradito suave
    marginRight: 12,
    padding: 12,
    justifyContent: 'flex-start',
    alignItems: 'center',
    overflow: 'hidden',
    // sombra (iOS)
    shadowColor: '#8B6BFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    // elevación (Android)
    elevation: 3,
  },
  tileIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  tileEmoji: { fontSize: 24 },
  tileTitle: { color: '#111', fontWeight: '700', fontSize: 16, textAlign: 'center' },
  tileDesc: { color: '#333', fontSize: 12, marginTop: 6, textAlign: 'center' },
  tileFooter: { position: 'absolute', right: 8, bottom: 8 },
  categoryTileHighlight: {
    backgroundColor: '#D6C2FF',
    shadowColor: '#6A4BFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 4,
  },
  iaWrap: { marginTop: 10, alignItems: 'center', paddingHorizontal: 12 },
  iaImg: { width: 160, height: 120, resizeMode: 'contain', marginVertical: 12 },
  iaDesc: { textAlign: 'left', marginBottom: 12 },
  createBtn: { backgroundColor: '#CFF6F0', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 22, width: '100%', alignItems: 'center' },
  createBtnText: { color: '#074B47', fontWeight: '600' },
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
  indicator: {
    position: 'absolute',
    top: -12,
    height: 28,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
});
