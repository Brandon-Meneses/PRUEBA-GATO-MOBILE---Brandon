# PRUEBA GATO MOBILE - Brandon Meneses

Aplicación desarrollada en React Native con Expo para la gestión de usuarios. Esta app forma parte de la prueba técnica solicitada por la empresa **GATO**.

## 🧩 Funcionalidades Implementadas

### 1. Autenticación
- Inicio de sesión mediante consumo de la API pública: https://reqres.in/.
- Validación de email y contraseña.
- Almacena token y mantiene sesión activa localmente.
- Permite autenticarse incluso si ya se ha creado el usuario en la base de datos local (modo sin conexión funcional).

### 2. Gestión de Usuarios
- Obtención de usuarios autenticados desde la API.
- Listado completo con:
  - Nombre
  - Email
  - DNI
  - Estado (Activo/Inactivo)
- Crear, editar y eliminar usuarios con persistencia en base de datos local.
- Actualización reactiva del listado al crear, editar o eliminar usuarios.

### 3. Navegación entre vistas
- Navegación fluida entre:
  - Login
  - Lista de Usuarios
  - Detalle de Usuario
  - Crear / Editar Usuario
  - Documentos
  - Notificaciones

### 4. Almacenamiento local
- Uso de **SQLite** para almacenar usuarios en el dispositivo.
- Permite la persistencia de datos entre sesiones.

### 5. Modo Claro / Oscuro / Sistema
- Soporte completo para temas:
  - Claro
  - Oscuro
  - Automático (según el tema del sistema)
- El usuario puede cambiar el tema desde la pantalla de login.

### 6. Valor Agregado y Extras
- Icono de la aplicación personalizado (gato negro con fondo morado, en alusión a la marca).
- Animaciones visuales usando `Animated` para interactividad (e.g., tarjetas de documentos).
- Uso de **toasts** para mensajes de éxito, error y acciones clave.
- Interactividad en secciones de Documentos y Notificaciones (cambios visuales al tocar).
- Estilo limpio y consistente basado en el diseño de Figma.
- Validación básica de formularios e indicadores de carga.

---

## 📥 Requisitos para ejecutar el proyecto

### 1. Clonar el repositorio

```bash
git clone git@github.com:Brandon-Meneses/PRUEBA-GATO-MOBILE-Brandon.git
cd PRUEBA-GATO-MOBILE-Brandon
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Ejecutar el proyecto

```bash
npx expo start
```

> Escanea el código QR desde tu dispositivo móvil con **Expo Go** o utiliza un emulador.

---

## 📱 Usuarios de prueba para login

Se pueden usar los siguientes correos junto con cualquier contraseña válida para hacer login exitoso:

- `eve.holt@reqres.in`
- `charles.morris@reqres.in`
- `tracey.ramos@reqres.in`
- `george.bluth@reqres.in`
- `janet.weaver@reqres.in`
- `emma.wong@reqres.in`

---

## ⚙️ Generación del APK

Para generar el APK, ejecuta:

```bash
eas build -p android --profile preview --platform android --output-format apk
```
