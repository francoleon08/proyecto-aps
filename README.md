# Administración de proyectos de Software

## 🌿 Metodología GitFlow

Este proyecto sigue la metodología **GitFlow** para el control de versiones y gestión de código. Esta metodología garantiza un flujo de trabajo organizado y estable.

### Estructura de Ramas

#### 🏛️ **main** (Producción)
- **Propósito**: Contiene únicamente código estable y funcional
- **Acceso**: Solo integración vía Pull Requests desde `develop`
- **Estado**: Siempre desplegable en producción
- **Protección**: Requiere revisión de código y tests exitosos

#### 🔧 **develop** (Desarrollo)
- **Propósito**: Rama de integración para nuevas funcionalidades
- **Acceso**: Solo integración vía Pull Requests desde ramas de feature
- **Estado**: Código en desarrollo, puede contener features incompletas
- **Protección**: Requiere revisión de código

#### 🌿 **Ramas de Feature** (feature/nombre-descriptivo)
- **Propósito**: Desarrollo de nuevas funcionalidades
- **Origen**: Siempre desde `develop`
- **Destino**: Merge a `develop` vía Pull Request
- **Nomenclatura**: `feature/descripcion-corta`

#### 🐛 **Ramas de Hotfix** (hotfix/nombre-descriptivo)
- **Propósito**: Correcciones urgentes en producción
- **Origen**: Desde `main`
- **Destino**: Merge a `main` y `develop`
- **Nomenclatura**: `hotfix/descripcion-corta`

### 🔄 Flujo de Trabajo

#### Para Integración a Producción

1. **Crear Pull Request de develop a main**
   - Origen: `develop`
   - Destino: `main`
   - Incluir changelog de cambios
   - Asignar revisores senior

2. **Después de merge a main**
   ```bash
   git checkout main
   git pull origin main
   git tag -a v1.0.0 -m "Release version 1.0.0"
   git push origin v1.0.0
   ```

### 📝 Convenciones de Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipo>[scope opcional]: <descripción>

[body opcional]

[footer opcional]
```

**Tipos permitidos:**
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Cambios de formato (espacios, comas, etc.)
- `refactor`: Refactorización de código
- `test`: Agregar o modificar tests
- `chore`: Cambios en herramientas, configuración, etc.

**Ejemplos:**
```bash
git commit -m "feat(auth): agregar autenticación con Google"
git commit -m "fix(dashboard): corregir error en tabla de usuarios"
git commit -m "docs: actualizar README con instrucciones de instalación"
```

### 🏗️ Estructura del Proyecto

```
APS/
├── app/                    # App Router de Next.js 13
│   ├── api/               # API Routes
│   │   ├── auth/          # Endpoints de autenticación
│   │   └── admin/         # Endpoints administrativos
│   ├── dashboard/         # Páginas del dashboard
│   └── globals.css        # Estilos globales
├── components/            # Componentes reutilizables
├── lib/                   # Utilidades y configuración
│   ├── auth.ts           # Lógica de autenticación
│   └── supabase/         # Configuración de Supabase
├── types/                 # Definiciones de TypeScript
└── supabase/             # Schema de base de datos
```

**Recuerda**: Siempre trabajar desde `develop`, nunca directamente en `main`. El código en `main` debe estar siempre listo para producción.
