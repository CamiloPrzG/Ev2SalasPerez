# Ev2_Salas_Perez (Evaluación 3)

Aplicación móvil desarrollada con React Native y Expo para la **Evaluación 3** de Aplicaciones Móviles.

Objetivo: migrar la app (antes local) a una app conectada **100% a backend real**, con **autenticación JWT**, persistencia del **token** y **CRUD completo** de tareas en servidor.

## 👥 Integrantes

- **Daniela Salas**
- **Camilo Pérez**

## 📱 Descripción del Proyecto

Esta aplicación es una evolución del proyecto de la **Evaluación 2**, migrada a **Evaluación 3** para conectarse a un backend real (REST) con autenticación y CRUD remoto.

### 🎥 Video Demostrativo

Puede revisar una demostración breve del funcionamiento en el siguiente enlace:
https://youtube.com/shorts/PW59lMXb0tk?feature=share

## 🚀 Tecnologías Utilizadas

- **Framework**: React Native con Expo
- **Lenguaje**: TypeScript
- **Navegación**: Expo Router
- **Autenticación**: JWT + persistencia del token con AsyncStorage
- **Consumo API**: fetch (sin axios)
- **Backend**: https://todo-list.dobleb.cl (Swagger/OpenAPI)
- **Hardware**:
  - Cámara y Galería (Expo Image Picker & Media Library)
  - Geolocalización (Expo Location)

## 🔗 Backend / Documentación

- Docs: https://todo-list.dobleb.cl/docs
- Base URL: `https://todo-list.dobleb.cl`

## 📋 Funcionalidades Implementadas

### 1. Autenticación (Login + Registro)

- Login contra el backend.
- Registro de usuarios desde la pantalla de login.
- Persistencia del token en AsyncStorage (la sesión se mantiene al cerrar/abrir la app).
- Rutas protegidas: si no hay sesión, la app vuelve al login.

Nota del backend: en este servidor, la contraseña de pruebas suele ser `password123` (según indicación del docente).

### 2. Gestión de Tareas (CRUD 100% Backend)

Restricción clave de la Evaluación 3: **las tareas NO se guardan localmente**.

- **Listar tareas**: se obtienen desde el backend.
- **Crear tarea**: se envía título + ubicación, y opcionalmente imagen.
- **Completar / descompletar**: se actualiza en backend.
- **Eliminar**: se elimina en backend.

Imágenes:
- La app captura/selecciona imagen en el dispositivo.
- Luego sube la imagen a `/images` y usa la `url` devuelta para asociarla a la tarea.

### 3. Perfil y Sesión
- Visualización del usuario conectado.
- Botón de **Cerrar Sesión** que elimina token y vuelve al login.

## 🌱 Variables de entorno

Existe configuración para la URL base del backend:

- Archivo: .env
- Variable: `EXPO_PUBLIC_API_URL=https://todo-list.dobleb.cl`

## 🛠️ Instalación y Ejecución

1.  **Clonar el repositorio**:
    ```bash
    git clone https://github.com/CamiloPrzG/Ev2SalasPerez
    cd Ev2_Salas_Perez
    ```

2.  **Instalar dependencias**:
    ```bash
    npm install
    ```

3.  **Iniciar la aplicación**:
    ```bash
    npx expo start
    ```

  Recomendado si cambiaste variables de entorno o quedó caché:
  ```bash
  npx expo start -c
  ```

4.  **Probar**:
    - Escanear el código QR con la app **Expo Go** (Android/iOS).

Atajos:

- iOS: `npm run ios`
- Web: `npm run web`

## 🧩 Estructura relevante

- Servicio API: services/api.ts
- Sesión / token: contexts/UserContext.tsx
- Protección de rutas: app/_layout.tsx
- Pantallas: app/index.tsx (login), app/register.tsx (registro), app/(tabs)/tasks.tsx (tareas)

## 🤖 Uso de IA

Se utilizó asistencia de IA (GitHub Copilot, modelo GPT-5.2 (Preview)) para refactorizar servicios, contexto de autenticación, navegación con Expo Router y manejo de errores.
```

---

**Estudiantes**: Daniela Salas y Camilo Pérez
**Fecha**: Diciembre 2025
