import React, { useMemo, useState } from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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

const SAMPLE_BOOKS: Book[] = [
  { id: 'b1', title: 'El primer picnic de Jane', desc: 'Descripción descripción', timeMin: 7, pages: 5 },
  { id: 'b2', title: 'Javier el dinosaurio', desc: 'Descripción descripción', timeMin: 7, pages: 5 },
  { id: 'b3', title: 'Lina y sus nuevos amigos', desc: 'Descripción descripción', timeMin: 7, pages: 5, createdWithAI: true },
  { id: 'b4', title: 'Caperucita roja', desc: 'Descripción descripción', timeMin: 7, pages: 5 },
  { id: 'b5', title: 'Mi cuento creado', desc: 'Creado con IA', timeMin: 5, pages: 3, createdWithAI: true },
];

export default function Biblioteca({ onNavigate, activeRoute, isAuthenticated }: { onNavigate?: (r: string) => void; activeRoute?: string; isAuthenticated?: boolean }) {
  const [books, setBooks] = useState<Book[]>(SAMPLE_BOOKS);
  const [tab, setTab] = useState<'todo' | 'guardados' | 'favoritos' | 'creados'>('todo');
  const [query, setQuery] = useState('');

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
    if (!isAuthenticated) { onNavigate && onNavigate('perfil'); return; }
    setBooks(prev => prev.map(b => (b.id === id ? { ...b, favorite: !b.favorite } : b)));
  }

  function toggleSaved(id: string) {
    if (!isAuthenticated) { onNavigate && onNavigate('perfil'); return; }
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
            <TouchableOpacity onPress={() => { if (!isAuthenticated) { onNavigate && onNavigate('perfil'); return; } confirmDelete(item.id); }} style={styles.actionBtn}>
              <MaterialCommunityIcons name="delete-outline" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

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
        <TouchableOpacity style={styles.pill} onPress={() => setTab('guardados')}>
          <Text style={styles.pillText}>Guardados</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.pill} onPress={() => setTab('favoritos')}>
          <Text style={styles.pillText}>Favoritos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.pill} onPress={() => setTab('creados')}>
          <Text style={styles.pillText}>Creados</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchBox}>
        <TouchableOpacity style={styles.menuIcon}><Text>☰</Text></TouchableOpacity>
        <TextInput placeholder="Hinted search text" value={query} onChangeText={setQuery} style={styles.searchInput} />
        <TouchableOpacity style={styles.searchBtn}><MaterialCommunityIcons name="magnify" size={20} color="#333"/></TouchableOpacity>
      </View>

      <FlatList data={filtered} renderItem={renderItem} keyExtractor={b => b.id} contentContainerStyle={styles.list} />

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
  screen: { flex: 1, backgroundColor: '#FBF6F1', paddingHorizontal: 18, paddingTop: 36 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 18 },
  smallLogo: { width: 28, height: 28, resizeMode: 'contain', marginRight: 8 },
  headerTitle: { fontSize: 32, fontWeight: '700', color: '#111' },
  pillsRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  pill: { paddingVertical: 8, paddingHorizontal: 14, backgroundColor: 'transparent', borderRadius: 20, marginRight: 8 },
  pillActive: { backgroundColor: '#CFF6F0' },
  pillText: { color: '#777' },
  pillTextActive: { color: '#074B47', fontWeight: '700' },
  searchBox: { marginTop: 12, backgroundColor: '#CFF6F0', borderRadius: 28, height: 52, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, marginBottom: 14 },
  menuIcon: { marginRight: 8 },
  searchInput: { flex: 1, paddingHorizontal: 8 },
  searchBtn: { marginLeft: 8 },
  list: { paddingBottom: 20 },
  itemRow: { flexDirection: 'row', backgroundColor: '#F3E6FF', borderRadius: 12, padding: 12, marginBottom: 12, alignItems: 'center' },
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
});
