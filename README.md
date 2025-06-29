# Email Generator Pro 📧

Un generador profesional de emails copywriter con diseño refinado inspirado en emprendimiento y escritura, usando IA para crear contenido persuasivo.

## 🚀 Características

- **Generación de emails con IA**: Utiliza Gemini AI para crear contenido persuasivo
- **Múltiples estilos de copywriting**: Dan Kennedy, Gary Halbert, David Ogilvy, Joe Sugarman, Russell Brunson
- **Gestión completa**: Sistema para manejar clientes, productos y copywriters
- **Interfaz profesional**: Diseño refinado con Tailwind CSS y componentes Shadcn/ui
- **Base de datos robusta**: PostgreSQL con Drizzle ORM

## 🛠️ Tecnologías

### Frontend
- React 18 con TypeScript
- Tailwind CSS + Shadcn/ui
- React Query para estado del servidor
- Wouter para enrutamiento
- React Hook Form con validación Zod

### Backend
- Node.js + Express
- TypeScript con ES modules
- PostgreSQL con Drizzle ORM
- Integración con Gemini AI
- APIs RESTful

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/email-generator-pro.git
cd email-generator-pro
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
```bash
cp .env.example .env
```

4. Edita el archivo `.env` con tus credenciales:
- `DATABASE_URL`: Tu cadena de conexión PostgreSQL
- `GEMINI_API_KEY`: Tu clave API de Google Gemini

5. Configura la base de datos:
```bash
npm run db:push
```

6. Inicia el servidor de desarrollo:
```bash
npm run dev
```

## 🌟 Uso

1. **Generador de Emails**: Completa el formulario con detalles del producto, audiencia objetivo y estilo de copywriter
2. **Gestión de Clientes**: Administra perfiles de clientes con información de contacto y preferencias
3. **Gestión de Productos**: Organiza productos/servicios con descripciones y características
4. **Copywriters**: Utiliza estilos de copywriting de expertos reconocidos mundialmente

## 📊 Copywriters Incluidos

- **Dan Kennedy**: Copywriting agresivo y directo
- **Gary Halbert**: Storytelling emocional y conversacional  
- **David Ogilvy**: Elegancia y sofisticación publicitaria
- **Joe Sugarman**: Psicología del consumidor y triggers mentales
- **Russell Brunson**: Marketing digital moderno y funnels

## 🔧 Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm run start`: Inicia el servidor de producción
- `npm run db:push`: Actualiza el esquema de la base de datos

## 📁 Estructura del Proyecto

```
├── client/          # Frontend React
│   ├── src/
│   │   ├── components/  # Componentes UI
│   │   ├── pages/       # Páginas de la aplicación
│   │   └── lib/         # Utilidades y configuración
├── server/          # Backend Express
│   ├── routes.ts    # Rutas de la API
│   ├── storage.ts   # Capa de datos
│   └── services/    # Servicios de IA
├── shared/          # Tipos y esquemas compartidos
└── README.md
```

## 🌐 Variables de Entorno

Ver `.env.example` para la lista completa de variables necesarias.

## 📝 Licencia

Este proyecto está bajo la Licencia MIT.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Si tienes alguna pregunta o necesitas ayuda, no dudes en abrir un issue en el repositorio.

---

Desarrollado con ❤️ para copywriters y emprendedores