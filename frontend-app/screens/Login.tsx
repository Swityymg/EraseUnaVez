import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator, 
  Image,
  SafeAreaView, // Añadido para mejor manejo en iOS
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Para el icono de estrella

// Importar la función de la API real
import { iniciarSesion } from '../src/api';

// URL de imagen simulada para el grupo de animales
// Reemplaza esta URL/ruta con tu asset real (ej: require('../assets/animals.png'))
const ANIMALS_IMAGE = 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2Foriginals%2F80%2Fd9%2Fe8%2F80d9e8648f61393129110ff372f02580.jpg&f=1&nofb=1&ipt=3495965173e414ce6ddadf283047ec8de555956bf092f7ff5fd43fcdb0274e95'; 

export default function Login({
  onSignIn,
  onNavigate,
}: {
  onSignIn: (email: string) => void;
  onNavigate?: (route: string) => void; /* (r: "signUp" | "home") => void; // Acepta 'signUp' para ir a crear cuenta */
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);

  async function submit() {
    // Para replicar la imagen que pide "Nombre de usuario" en lugar de "Email",
    // asumiremos que el campo `email` se usa para el nombre de usuario o email.
    const emailLimpio = email.trim();
    const passLimpio = password.trim();

    if (!emailLimpio) {
      Alert.alert('Error', 'El nombre de usuario o email es obligatorio');
      return;
    }
    if (!passLimpio) {
      Alert.alert('Error', 'La contraseña es obligatoria');
      return;
    }
    if (cargando) return;

    setCargando(true);
    try {
      console.log("Intentando login con:", emailLimpio, passLimpio);
      // Usando el email como nombre de usuario para el inicio de sesión simulado
      const data = await iniciarSesion(emailLimpio, passLimpio); 

      console.log("Login exitoso, respuesta:", data);

    if (data && data.usuario && data.usuario.email) {
         onSignIn(data.usuario.email);
      } else {
         throw new Error("La API no devolvió los datos del usuario correctamente.");
      }

    } catch (error: any) {
      console.error("Error en Login:", error);
      // Muestra el mensaje exacto que viene del backend o de la red
      Alert.alert('Error de Login', error.message || "No se pudo conectar con el servidor.");
    } finally {
      setCargando(false);
    }}
 

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        <Text style={styles.title}>Iniciar sesión</Text>
        
        {/* Imagen de animales tiernos */}
        <Image 
            source={{ uri: ANIMALS_IMAGE }} 
            style={styles.animalsImage} 
            resizeMode='contain'
        />

        {/* Campo Nombre de Usuario (o Email) */}
        <Text style={styles.label}>Nombre de usuario</Text>
        <TextInput
          placeholder="Value"
          keyboardType="email-address" // Usamos email type para conveniencia
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          editable={!cargando}
        />
        
        {/* Campo Contraseña */}
        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          placeholder="Value"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          editable={!cargando}
        />

        {/* Botón INICIAR SESIÓN (Morado) */}
        <TouchableOpacity
          style={[styles.btnPrimary, cargando && styles.btnDisabled]} 
          onPress={submit}
          disabled={cargando} 
        >
          {cargando ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
                <MaterialCommunityIcons name="star-circle" size={20} color="#FFFFFF" style={{marginRight: 6}} />
                <Text style={styles.btnTextPrimary}>INICIAR SESIÓN</Text>
            </>
          )}
        </TouchableOpacity>
        
        {/* Separador visual y texto "¿No tienes cuenta?" */}
        <View style={styles.separator} />
        <Text style={styles.promptText}>¿No tienes cuenta?</Text>


        {/* Botón CREAR UNA CUENTA (Morado - similar al de la imagen) */}
        <TouchableOpacity 
          style={styles.btnSecondary} 
          onPress={() => onNavigate && onNavigate('signUp')}
        >
            <MaterialCommunityIcons name="star-circle" size={20} color="#FFFFFF" style={{marginRight: 6}} />
            <Text style={styles.btnTextPrimary}>CREAR UNA CUENTA</Text>
        </TouchableOpacity>

        <TouchableOpacity 
            onPress={() => onNavigate && onNavigate('home')} 
            style={{ marginTop: 20 }}
        >
            <Text style={styles.linkText}>Volver a la página principal</Text>
        </TouchableOpacity>
        
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FDF9F0', // Fondo claro/beige
  },
  content: { 
    flex: 1, 
    paddingHorizontal: 25, 
    paddingTop: 50, // Espacio superior
    alignItems: 'center',
  },
  title: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    color: '#333', 
    marginBottom: 20, 
    alignSelf: 'flex-start',
  },
  animalsImage: {
    width: '100%',
    height: 150,
    marginBottom: 30,
    backgroundColor: '#FDF9F0', 
  },
  label: {
      fontSize: 18,
      fontWeight: '600',
      color: '#333',
      marginBottom: 8,
      alignSelf: 'flex-start',
      width: '100%',
      marginTop: 10,
  },
  input: { 
    width: '100%', 
    height: 50, 
    backgroundColor: '#FFFFFF', 
    borderRadius: 12, 
    paddingHorizontal: 15, 
    marginBottom: 15,
    borderColor: '#E0E0E0', 
    borderWidth: 1,
    fontSize: 16,
    color: '#333',
  },
  // Botón principal - INICIAR SESIÓN
  btnPrimary: {
    backgroundColor: '#7D52F7', // Morado fuerte
    padding: 14,
    borderRadius: 30, // Más redondeado
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    minHeight: 55,
    marginTop: 20,
    flexDirection: 'row',
  },
  btnTextPrimary: { 
    color: '#FFFFFF', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  btnDisabled: {
    backgroundColor: '#9A7BDF', // Morado más claro al cargar
  },

  // Separador y prompt de cuenta
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    width: '100%',
    marginVertical: 30,
  },
  promptText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    alignSelf: 'center',
  },

  // Botón secundario - CREAR UNA CUENTA
  btnSecondary: {
    backgroundColor: '#7D52F7', // Mismo color morado fuerte, como en la imagen
    padding: 14,
    borderRadius: 30, 
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    minHeight: 55,
    flexDirection: 'row',
  },
  
  // Enlace para volver a home
  linkText: {
    color: '#7D52F7',
    fontSize: 14,
    fontWeight: '600',
  }
});
