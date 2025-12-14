import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(''); // Mantenemos el estado visual aunque la pass sea fija internamente
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { login, isLoading } = useUser();

  if (isLoading) {
    return (
      <View style={[styles.container, { alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  const handleLogin = async () => {
    setErrorMessage('');

    if (username.trim() === '') {
      setErrorMessage('Por favor ingresa tu usuario');
      return;
    }

    // Aunque la contraseña es fija en el backend, es buena práctica pedirla o validarla
    // En este caso, como el requerimiento dice que la pass es "password123", 
    // podríamos validarla aquí o simplemente dejar que el contexto use la correcta.
    // Para efectos de UX, validaremos que no esté vacía.
    if (password.trim() === '') {
      setErrorMessage('Por favor ingresa la contraseña');
      return;
    }

    setIsSubmitting(true);
    try {
      // Llamamos al login del contexto. 
      // Nota: El contexto ya maneja la contraseña 'password123' internamente según lo configuramos,
      // o podríamos pasarla aquí si cambiáramos el contexto. 
      // Dado que en el contexto pusimos api.login(username, 'password123'), aquí solo pasamos username.
      await login(username, password);
      // La redirección la maneja el contexto o podemos hacerla aquí si login no redirige.
      // En nuestro contexto actual, login hace router.replace('/(tabs)').
    } catch (error: any) {
      setErrorMessage(error.message || 'Error al iniciar sesión');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>

      {errorMessage ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : null}

      <TextInput
        style={styles.input}
        placeholder="Escribe tu correo (email)"
        placeholderTextColor="#666"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Escribe tu contraseña"
        placeholderTextColor="#666"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.button, isSubmitting && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/register')} style={styles.linkButton}>
        <Text style={styles.linkText}>¿No tienes cuenta? Regístrate aquí</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#FFE5E5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#A0C4FF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#007AFF',
    fontSize: 16,
  },
});
