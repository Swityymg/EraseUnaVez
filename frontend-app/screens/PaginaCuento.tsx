import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ImageSourcePropType,
  Dimensions
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { obtenerPaginasCuento, PaginaCuento as TipoPaginaCuento } from '../src/api'; 


// Parámetros que recibe el componente - el idCuento
type PaginaCuentoProps = {
  idCuento: string;
  onNavigate: (route: string) => void;
};


export default function PaginaCuento({ idCuento, onNavigate }: PaginaCuentoProps) {
  const [paginas, setPaginas] = useState<TipoPaginaCuento[]>([]);
  const [paginaActualIndex, setPaginaActualIndex] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  
  useEffect(() => {
    const cargarPaginas = async () => {
      try {
        setCargando(true);
        setError(null);
        
        const data = await obtenerPaginasCuento(idCuento); 
        
        const paginasOrdenadas = data.sort((a, b) => a.numeroPagina - b.numeroPagina); 
        
        setPaginas(paginasOrdenadas);
        setPaginaActualIndex(0); 
      } catch (err: any) {
        setError("Error al cargar las páginas: " + err.message);
      } finally {
        setCargando(false);
      }
    };

    cargarPaginas();
  }, [idCuento]);


  const paginaActual = paginas[paginaActualIndex];
  const totalPaginas = paginas.length;
  const puedeAvanzar = paginaActualIndex < totalPaginas - 1;
  const puedeRetroceder = paginaActualIndex > 0;

  const avanzarPagina = () => {
    if (puedeAvanzar) {
      setPaginaActualIndex(prev => prev + 1);
    }
  };

  const retrocederPagina = () => {
    if (puedeRetroceder) {
      setPaginaActualIndex(prev => prev - 1);
    }
  };

  
  const imageUrlSource: ImageSourcePropType = paginaActual && paginaActual.urlImagen
    ? { uri: paginaActual.urlImagen }
    : require('../assets/ImagenPorDefecto.png'); 


  if (cargando) {
    return (
        <View style={styles.contenedorCentrado}>
            <ActivityIndicator size="large" color="#074B47" />
            <Text style={{ marginTop: 10 }}>Cargando páginas...</Text>
        </View>
    );
  }

  if (error || !paginaActual) {
    return (
        <View style={styles.contenedorCentrado}>
            <Text style={{ color: 'red' }}>{error || "No se encontraron páginas para este cuento."}</Text>
            <TouchableOpacity onPress={() => onNavigate('home')} style={styles.botonVolver}>
                 <Text style={{color: '#fff'}}>Volver al Inicio</Text>
            </TouchableOpacity>
        </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        
        <Image
          source={imageUrlSource}
          style={styles.image}
          resizeMode="cover"
        />
        
        <View style={styles.textContainer}>
            <Text style={styles.pageText}>
              {paginaActual.texto}
            </Text>
        </View>

       
        <View style={styles.pageNavOverlay}>
          
          {/* Botón de Cerrar/Volver */}
          <TouchableOpacity onPress={() => onNavigate('home')} style={styles.navButton}>
            <MaterialCommunityIcons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          
          {/* Botón de retroceso */}
          <TouchableOpacity 
            onPress={retrocederPagina} 
            disabled={!puedeRetroceder} 
            style={[styles.navButton, !puedeRetroceder && styles.disabledButton]}
          >
            <MaterialCommunityIcons name="chevron-left" size={24} color="#fff" />
          </TouchableOpacity>

          {/* Contador de Página */}
          <Text style={styles.pageCounter}>
            {`${paginaActualIndex + 1} / ${totalPaginas}`}
          </Text>

          {/* Botón de avance */}
          <TouchableOpacity 
            onPress={avanzarPagina} 
            disabled={!puedeAvanzar} 
            style={[styles.navButton, !puedeAvanzar && styles.disabledButton]}
          >
            <MaterialCommunityIcons name="chevron-right" size={24} color="#fff" />
          </TouchableOpacity>

        </View>
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f0f0f0' },
  container: { flex: 1, position: 'relative' },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%', 
  },
  textContainer: {
    position: 'absolute',
    top: 0, 
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.5)', 
  },
  pageText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#000',
    lineHeight: 30,
    textAlign: 'center',

    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  
  pageNavOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  navButton: {
    padding: 10,

  },
  disabledButton: {
    opacity: 0.3,
  },
  pageCounter: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  
  contenedorCentrado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  botonVolver: {
      marginTop: 20,
      backgroundColor: '#074B47',
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 8,
  }
});
