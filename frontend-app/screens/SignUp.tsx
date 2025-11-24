import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// --- IMAGEN DE ANIMALES Y AVATARES ---
// Reemplaza estas URLs/rutas con tus assets reales.
const ANIMALS_IMAGE = 'https://via.placeholder.com/300x150/FDF9F0?text=Animales+Tiernos';
const AVATAR_URLS = [
  'https://via.placeholder.com/100/F0C419?text=A1', 
  'https://via.placeholder.com/100/3C90D0?text=A2', 
  'https://via.placeholder.com/100/4CAF50?text=A3', 
  'https://via.placeholder.com/100/E91E63?text=A4', 
  'https://via.placeholder.com/100/FF9800?text=A5', 
  'https://via.placeholder.com/100/9C27B0?text=A6', 
];
// --------------------------------------

interface SignUpProps {
  onSignUp: (email: string, name: string) => void;
  onNavigate: (route: "login" | "home") => void;
}

// Componente auxiliar para el selector de edad (Stepper)
const AgeStepper = ({ age, setAge }: { age: number, setAge: (a: number) => void }) => {
    const minAge = 5;
    const maxAge = 99;

    const increment = () => setAge(Math.min(maxAge, age + 1));
    const decrement = () => setAge(Math.max(minAge, age - 1));
    
    return (
        <View style={stepperStyles.stepperContainer}>
            <TextInput
                style={[styles.input, stepperStyles.ageInput]}
                value={String(age)}
                // Permite la edición manual, pero solo si es un número válido.
                onChangeText={(text) => {
                    const num = parseInt(text, 10);
                    if (!isNaN(num) && num >= minAge && num <= maxAge) {
                        setAge(num);
                    }
                }}
                keyboardType="numeric"
                maxLength={2}
            />
            <View style={stepperStyles.buttonGroup}>
                <TouchableOpacity 
                    style={[stepperStyles.button, stepperStyles.buttonLeft]} 
                    onPress={decrement}
                    disabled={age <= minAge}
                >
                    <Text style={[stepperStyles.buttonText, age <= minAge && { opacity: 0.5 }]}>−</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[stepperStyles.button, stepperStyles.buttonRight]} 
                    onPress={increment}
                    disabled={age >= maxAge}
                >
                    <Text style={[stepperStyles.buttonText, age >= maxAge && { opacity: 0.5 }]}>+</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default function SignUp({ onSignUp, onNavigate }: SignUpProps) {
  const [username, setUsername] = useState('');
  const [tutorEmail, setTutorEmail] = useState(''); // Nuevo campo
  const [password, setPassword] = useState('');
  const [age, setAge] = useState(10); // Edad por defecto
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_URLS[0]); // Avatar seleccionado

  const handleSignUp = () => {
    if (!username.trim() || !password || !tutorEmail || age < 5) {
        Alert.alert('Error', 'Por favor, completa todos los campos requeridos y selecciona una edad válida.');
        return;
    }
    // Lógica simulada de registro. Usamos el email del tutor como el email real
    // y el username como el nombre para onSignUp.
    onSignUp(tutorEmail, username.trim());
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <Text style={styles.headerTitle}>Crear cuenta</Text>
        
        {/* Sección de edad con la imagen de fondo */}
        <View style={styles.section}>
            <Text style={styles.label}>Selecciona tu edad</Text>
            <AgeStepper age={age} setAge={setAge} />
            <Image 
                source={{ uri: ANIMALS_IMAGE }} 
                style={styles.animalsImage}
                resizeMode='contain'
            />
        </View>

        {/* Campos de formulario */}
        <View style={styles.inputSection}>
            <Text style={styles.label}>Nombre de usuario</Text>
            <TextInput
                style={styles.input}
                placeholder="Tu nombre o apodo"
                placeholderTextColor="#A0A0A0"
                value={username}
                onChangeText={setUsername}
            />

            <Text style={styles.label}>Contraseña</Text>
            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor="#A0A0A0"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <Text style={styles.label}>Correo de tu tutor</Text>
            <TextInput
                style={styles.input}
                placeholder="tutor@ejemplo.com"
                placeholderTextColor="#A0A0A0"
                keyboardType="email-address"
                autoCapitalize="none"
                value={tutorEmail}
                onChangeText={setTutorEmail}
            />
        </View>
        
        {/* Sección de avatares */}
        <View style={styles.avatarSection}>
            <Text style={styles.avatarTitle}>Elige un avatar</Text>
            <View style={styles.avatarGrid}>
            {AVATAR_URLS.map((url, index) => (
                <TouchableOpacity
                key={index}
                style={[
                    styles.avatarWrapper,
                    selectedAvatar === url && styles.avatarSelected,
                ]}
                onPress={() => setSelectedAvatar(url)}
                >
                <Image source={{ uri: url }} style={styles.avatarImage} />
                </TouchableOpacity>
            ))}
            </View>
        </View>

        {/* Botón Crear Cuenta */}
        <TouchableOpacity style={styles.createButton} onPress={handleSignUp}>
            <MaterialCommunityIcons name="star-circle" size={20} color="#FFFFFF" style={{marginRight: 6}} />
            <Text style={styles.buttonText}>CREAR CUENTA</Text>
        </TouchableOpacity>

        {/* Enlace para ir a Iniciar Sesión */}
        <TouchableOpacity 
          style={styles.linkButton} 
          onPress={() => onNavigate("login")}
        >
          <Text style={styles.linkText}>¿Ya tienes cuenta? Inicia sesión</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  // Colores y fondo similares a la imagen (tonos morados y beiges)
  container: {
    flex: 1,
    backgroundColor: '#FDF9F0', // Fondo muy claro y cálido
  },
  scrollContent: {
    paddingVertical: 40,
    paddingHorizontal: 25,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  // --- ELEMENTOS DE FORMULARIO ---
  label: {
      fontSize: 16,
      fontWeight: '600',
      color: '#333',
      marginBottom: 8,
      marginTop: 15,
      alignSelf: 'flex-start',
  },
  inputSection: {
    width: '100%',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 15,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    fontSize: 16,
    color: '#333',
  },
  // --- SECCIÓN DE EDAD Y ANIMALES ---
  section: {
    width: '100%',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  animalsImage: {
    width: '100%',
    height: 150, // Ajuste para la imagen
    borderRadius: 15,
    marginTop: 15,
    backgroundColor: '#FDF9F0', 
  },
  // --- SECCIÓN DE AVATARES ---
  avatarSection: {
    width: '100%',
    backgroundColor: '#EFE8FA', // Fondo morado/lila claro
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 4,
  },
  avatarTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  avatarWrapper: {
    margin: 8,
    borderRadius: 50,
    padding: 3,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  avatarSelected: {
    borderColor: '#7D52F7', // Borde morado para el seleccionado
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF',
  },
  // --- BOTONES ---
  createButton: {
    width: '100%',
    height: 55,
    backgroundColor: '#7D52F7', // Morado fuerte
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row', // Para alinear el icono y el texto
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 20,
    alignSelf: 'center',
    marginBottom: 50, // Espacio extra al final de la scroll view
  },
  linkText: {
    color: '#7D52F7',
    fontSize: 14,
    fontWeight: '600',
  },
});

// --- ESTILOS DEL STEPPER (SELECTOR DE EDAD) ---
const stepperStyles = StyleSheet.create({
    stepperContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    ageInput: {
        flex: 1,
        marginRight: 10,
        textAlign: 'left',
        paddingHorizontal: 10, // Menos padding para no desbordar
    },
    buttonGroup: {
        flexDirection: 'row',
        borderRadius: 12,
        overflow: 'hidden',
        borderColor: '#E0E0E0',
        borderWidth: 1,
        height: 50,
    },
    button: {
        width: 50,
        height: '100%',
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonLeft: {
        borderRightWidth: 1, // Separador vertical
        borderColor: '#E0E0E0',
    },
    buttonRight: {
        // No necesita borderLeft ya que buttonLeft lo tiene
    },
    buttonText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#7D52F7',
    },
});