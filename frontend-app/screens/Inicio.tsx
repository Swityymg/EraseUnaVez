import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

function BookPlaceholder({ title }: { title: string }) {
  return (
    <View style={styles.bookCard}>
      <View style={styles.bookCover} />
      <Text style={styles.bookTitle} numberOfLines={2}>
        {title}
      </Text>
    </View>
  );
}

export default function Inicio({ onNavigate, activeRoute }: { onNavigate?: (route: string) => void; activeRoute?: string }) {
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.wrapper} showsHorizontalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Image source={require('../assets/logominimal.png')} style={styles.smallLogo} />
          <Text style={styles.headerTitle}>Inicio</Text>
        </View>

        <Text style={styles.sectionTitleLarge}>Continuar leyendo</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.hScroll}
          contentContainerStyle={styles.hContent}
        >
          <BookPlaceholder title="Emma y el dragón que quería ser azul" />
          <BookPlaceholder title="Pumpkin Bear y su Nuevo Amigo" />
          <BookPlaceholder title="La ardilla y el conejo" />
        </ScrollView>

        <Text style={styles.sectionTitle}>Anteriores</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.hScroll}
          contentContainerStyle={styles.hContent}
        >
          <BookPlaceholder title="Emma y la semilla mágica" />
          <BookPlaceholder title="Caperucita Roja" />
          <BookPlaceholder title="La Ardilla y El Conejo" />
        </ScrollView>

        <Text style={styles.sectionTitle}>Los más leídos</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.hScroll}
          contentContainerStyle={styles.hContent}
        >
          <BookPlaceholder title="Let's Taco 'Bout It" />
          <BookPlaceholder title="La Ardilla y El Conejo" />
          <BookPlaceholder title="La galleta y el gato" />
        </ScrollView>

  {/* espaciador: evita que el contenido quede oculto por la barra inferior */}
  <View style={{ height: 72 }} />
      </ScrollView>

      <View style={styles.bottomNavWrap}>
        <View style={styles.bottomNav}>
          {/* indicador eliminado (solicitado) */}
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
    backgroundColor: '#E6F8F5',
  },
  bookTitle: { marginTop: 8, fontSize: 13, fontWeight: '600', color: '#222' },

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
  navIcon: { fontSize: 22 },
  /* estilos de indicador eliminados */
});
