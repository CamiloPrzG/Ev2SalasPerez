import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const { user, logout } = useUser();
  const router = useRouter();
  const displayEmail = user || 'No usuario disponible';

  const handleLogout = async () => {
    await logout();
    // El contexto ya maneja la redirección, pero por seguridad:
    // router.replace('/'); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      <Text style={styles.label}>Usuario:</Text>
      <Text style={styles.email}>{displayEmail}</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  email: {
    fontSize: 20,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 40,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
