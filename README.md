# Ev2_Salas_Perez

Aplicación móvil desarrollada con React Native y Expo para la Evaluación 2 de Aplicaciones Móviles.

## 👥 Integrantes

- **Daniela Salas**
- **Camilo Pérez**

## 📱 Descripción del Proyecto

Esta aplicación es una evolución del proyecto de la Evaluación 1. Se ha implementado un sistema completo de gestión de tareas (TODO List) con funcionalidades avanzadas de persistencia y uso de hardware del dispositivo.

### 🎥 Video Demostrativo

Puede revisar una demostración breve del funcionamiento en el siguiente enlace:
https://youtube.com/shorts/7sRVjTlarV0?feature=share

## 🚀 Tecnologías Utilizadas

- **Framework**: React Native con Expo
- **Lenguaje**: TypeScript
- **Navegación**: Expo Router
- **Persistencia de Datos**: AsyncStorage
- **Manejo de Archivos**: Expo FileSystem
- **Hardware**:
  - Cámara y Galería (Expo Image Picker & Media Library)
  - Geolocalización (Expo Location)

## 📋 Funcionalidades Implementadas

### 1. Autenticación (Login)
- Sistema de inicio de sesión validado.
- Credenciales de prueba:
  - **Email**: (cualquier email válido con @)
  - **Contraseña**: `1234`
- Gestión de sesión global con `UserContext`, permitiendo controlar el acceso a las pantallas internas.

### 2. Gestión de Tareas (TODO List)
- **Crear Tareas**: Formulario para agregar nuevas tareas con título.
- **Fotos**:
  - Integración con la **Cámara** para tomar fotos en el momento.
  - Integración con la **Galería** para seleccionar imágenes existentes.
  - **Guardado Dual**: Las fotos se guardan en la carpeta privada de la app (persistencia local) Y se guarda una copia automática en la galería del usuario.
- **Geolocalización**:
  - Obtención automática de la ubicación (latitud/longitud) al crear una tarea.
  - Visualización de coordenadas en cada tarjeta de tarea.
- **Persistencia**:
  - Las tareas se guardan en `AsyncStorage` y no se pierden al cerrar la app.
  - Las tareas están asociadas al email del usuario (cada usuario ve solo sus tareas).
- **Gestión**:
  - Marcar tareas como completadas/pendientes.
  - Eliminar tareas (incluyendo borrado seguro de la imagen asociada).

### 3. Perfil y Sesión
- Visualización del usuario conectado.
- Botón funcional de **Cerrar Sesión** que redirige al Login y limpia el historial de navegación.

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

4.  **Probar**:
    - Escanear el código QR con la app **Expo Go** (Android/iOS).

### Comandos adicionales
# iOS
npm run ios

# Web
npm run web
```

---

**Estudiantes**: Daniela Salas y Camilo Pérez
**Fecha**: Noviembre 2025
