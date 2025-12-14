import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { UserProvider, useUser } from '@/contexts/UserContext';
import { ActivityIndicator, View } from 'react-native';

export {
  // Captura errores lanzados por el Layout
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  // Asegura que al recargar en `/modal` se mantenga el botón de atrás
  initialRouteName: 'index',
};

// Previene que la pantalla de carga se oculte antes de cargar los recursos
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router usa Error Boundaries para capturar errores en la navegación
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <UserProvider>
      <AuthGate />
    </UserProvider>
  );
}

function AuthGate() {
  const { user, isLoading } = useUser();
  const segments = useSegments();
  const router = useRouter();

  // Nota: En Expo Router, la ruta raíz '/' (index) puede venir como [] en useSegments().
  const currentSegment = segments[0] as string | undefined;
  const isPublicRoute = !currentSegment || currentSegment === 'index' || currentSegment === 'register';
  const segmentsKey = segments.join('/');

  useEffect(() => {
    // Navegación centralizada (evita loops por redirects múltiples en screens/layouts)
    if (isLoading) return;
    if (!user && !isPublicRoute) {
      router.replace('/');
      return;
    }
    if (user && isPublicRoute) {
      router.replace('/(tabs)');
    }
  }, [user, isLoading, isPublicRoute, segmentsKey]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
