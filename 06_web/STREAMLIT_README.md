# 🛍️ Adaptador de Streamlit - Sistema de Gestión de Productos

Este es un ejemplo completo de un **adaptador de Streamlit** implementado siguiendo la **Arquitectura Hexagonal (Ports & Adapters)**.

## 🏗️ Arquitectura

El proyecto sigue los principios de la **Arquitectura Hexagonal**:

```
src/
├── domain/                    # 🔵 Núcleo del dominio
│   ├── entities/             # Entidades de negocio
│   └── repositories/         # Interfaces de repositorios
├── application/              # 🟢 Capa de aplicación
│   ├── dtos/                # Data Transfer Objects
│   └── use_cases/           # Casos de uso
├── adapters/                # 🟡 Adaptadores
│   ├── primary/             # Adaptadores primarios (entrada)
│   │   └── web/            # Adaptador de Streamlit
│   └── secondary/          # Adaptadores secundarios (salida)
│       └── persistence/    # Repositorios concretos
└── config/                 # ⚙️ Configuración
    └── di_config.py       # Inyección de dependencias
```

## 🚀 Características del Adaptador

### 📱 Interfaz de Usuario
- **Dashboard interactivo** con métricas en tiempo real
- **Formularios reactivos** para crear y editar productos
- **Navegación por pestañas** con sidebar
- **Filtros dinámicos** por categoría y estado
- **Estadísticas visuales** del inventario

### 🔧 Funcionalidades
- ✅ Crear productos nuevos
- 📝 Editar productos existentes
- 🗑️ Eliminar productos
- 🚫 Activar/desactivar productos
- 📊 Ver métricas y estadísticas
- 🔍 Filtrar y buscar productos
- ⚠️ Alertas de stock bajo

## 🛠️ Instalación y Ejecución

### 1. Instalar dependencias
```bash
# Con Poetry (recomendado)
poetry install

# Con pip
pip install streamlit fastapi sqlalchemy structlog pydantic
```

### 2. Inicializar datos de ejemplo (opcional)
```bash
python init_sample_data.py
```

### 3. Ejecutar la aplicación
```bash
# Desde la raíz del proyecto
streamlit run app.py

# O directamente el adaptador
streamlit run src/adapters/primary/web/streamlit_app.py
```

### 4. Abrir en el navegador
La aplicación estará disponible en: http://localhost:8501

## 📋 Uso de la Aplicación

### 🏠 Dashboard
- Visualiza métricas principales: total de productos, productos activos, stock total y precio promedio
- Muestra los productos más recientes
- Navegación rápida a otras secciones

### ➕ Crear Producto
- Formulario intuitivo con validaciones
- Campos obligatorios claramente marcados
- Confirmación visual al crear exitosamente

### 📝 Gestionar Productos
- Lista completa de productos con acciones rápidas
- Edición inline con formularios expandibles
- Filtros por categoría y estado
- Opciones para activar/desactivar/eliminar

### 📈 Estadísticas
- Distribución de productos por categoría
- Valor total del inventario
- Alertas de stock bajo

## 🔧 Arquitectura del Adaptador

### 📨 Patrón de Adaptador Primario
El adaptador de Streamlit actúa como un **puerto primario** que:

1. **Recibe** interacciones del usuario (clicks, formularios, filtros)
2. **Convierte** los datos del UI a DTOs de aplicación
3. **Invoca** los casos de uso correspondientes
4. **Transforma** las respuestas para mostrar en la UI

### 🔄 Flujo de Datos
```
Usuario → Streamlit UI → Adaptador → Caso de Uso → Dominio → Repositorio
```

### 🎯 Separación de Responsabilidades

#### `StreamlitProductApp`
- **Responsabilidad**: Orquestación de la UI y navegación
- **Funciones**: Configuración de páginas, enrutamiento, estado de sesión

#### Métodos de Página
- `_show_dashboard()`: Dashboard con métricas
- `_show_create_product()`: Formulario de creación
- `_show_manage_products()`: Gestión CRUD
- `_show_statistics()`: Análisis y reportes

### 🏆 Beneficios de esta Arquitectura

1. **🔒 Aislamiento**: El dominio no conoce Streamlit
2. **🔄 Testabilidad**: Fácil mocking de casos de uso
3. **🔧 Mantenibilidad**: Cambios en UI no afectan la lógica de negocio
4. **📈 Escalabilidad**: Fácil agregar nuevos adaptadores (FastAPI, CLI, etc.)
5. **🎛️ Flexibilidad**: Cambio de framework sin afectar el core

## 🧪 Testing

### Estructura de Tests Sugerida
```
tests/
├── unit/
│   ├── domain/
│   ├── application/
│   └── adapters/
├── integration/
│   └── streamlit/
└── functional/
    └── ui/
```

### Ejemplo de Test para el Adaptador
```python
def test_streamlit_app_initialization():
    """Test de inicialización del adaptador."""
    app = StreamlitProductApp()
    assert app.product_service is not None
    assert isinstance(app.product_service, ProductService)
```

## 🔮 Extensiones Futuras

### 🎨 UI/UX
- Temas personalizables
- Graficos con Plotly/Altair
- Exportación de reportes
- Notificaciones push

### 🔧 Funcionalidades
- Búsqueda avanzada
- Categorías dinámicas
- Historial de cambios
- Importación/exportación CSV

### 🏗️ Arquitectura
- Cache con Redis
- Base de datos real
- Autenticación
- API REST adicional

## 📚 Conceptos Clave

### 🔵 Arquitectura Hexagonal
- **Puerto**: Interfaz que define un contrato
- **Adaptador**: Implementación concreta de un puerto
- **Primario**: Adaptadores que inician acciones (UI, API, CLI)
- **Secundario**: Adaptadores que responden a acciones (DB, Email, etc.)

### 🎭 Inversión de Dependencias
```python
# ❌ Dependencia directa
class StreamlitApp:
    def __init__(self):
        self.repo = MySQLRepository()  # Acoplado a MySQL

# ✅ Inversión de dependencias
class StreamlitApp:
    def __init__(self, product_service: ProductService):
        self.service = product_service  # Depende de abstracción
```

## 🤝 Contribuir

1. Fork del repositorio
2. Crear rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -am 'Agregar nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Pull Request

---

**¡Este adaptador demuestra cómo integrar Streamlit en una arquitectura limpia y escalable!** 🚀
