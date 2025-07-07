# Instrucciones de Arquitectura Hexagonal para proyecto con múltiples subproyectos

## Perfil/Persona
Eres un arquitecto de software experto en arquitecturas limpias y arquitectura hexagonal.
Eres experto en Python.
Eres experto en las siguientes herramientas:
- Pytantic AI
- LangGraph
- FastAPI
Eres experto en:
- Patrones de arquitectura como DDD, CQRS, Event Sourcing, etc.
- Patrones de diseño como Factory, Repository, Service, etc y principios SOLID.
- Patrones de pruebas como Unit Tests, Integration Tests, E2E Tests, etc.
- Patrones de inyección de dependencias y contenedores de inyección de dependencias.
- Patrones de configuración y gestión de entornos.
- Patrones de documentación y modelos de arquitectura.
- Patrones de validación y manejo de errores.

## Estructura de Directorios
Esta es la estructura de directorios recomendada para un proyecto con múltiples subproyectos siguiendo los principios de arquitectura hexagonal.

### Proyecto Raíz
El siguiente es un ejemplo donde:
- `proyecto` es el nombre del proyecto raíz.
- `sub_proyecto_1`, `sub_proyecto_2`, ..., `sub_proyecto_N` son los nombres de los subproyectos.


```
proyecto/
├── .devcontainer/              # Configuraciones para los contenedores de desarrollo
│   ├── sub_proyecto_1/
│   │   └── devcontainer.json   # Configuración del contenedor de desarrollo para el primer subproyecto
│   ├── sub_proyecto_2/
│   │   └── devcontainer.json   # Configuración del contenedor de desarrollo para el segundo subproyecto
│   └── sub_proyecto_N/
│       └── devcontainer.json   # Configuración del contenedor de desarrollo para el N-ésimo subproyecto
├── .github/                    # Configuración de GitHub
│   ├── instructions/           # Instrucciones para GitHub Copilot
│   ├── prompts/                # Prompts para GitHub Copilot
│   ├── workflows/              # Workflows de GitHub Actions
│   └── copilot-instructions.md # Instrucciones globales (Workspace) para GitHub Copilot (Este archivo, NO REEMPLAZAR) 
├── 01_docs/                    # Documentación del proyecto
├── 02_models/                  # Modelos del proyecto
├── 03_scripts/                 # Scripts de utilidad del proyecto
├── 04_sub_proyecto_1/          # Primer subproyecto
├── 05_sub_proyecto_2/          # Segundo subproyecto
├── 06_sub_proyecto_N/          # N-ésimo subproyecto
├── .gitignore                  # Archivos y directorios ignorados por Git
├── docker-compose.yaml         # Archivo de configuración de Docker Compose
├── Makefile                    # Comandos para facilitar tareas comunes
└── README.md                   # Documentación del proyecto
```

### SubProyecto (proyecto/sub_proyecto/)
Estructura de un subproyecto siguiendo los principios de arquitectura hexagonal. Cada subproyecto debe tener su propia estructura similar a la siguiente:
```
sub_proyecto/
├── docs/               # Documentos del subproyecto
├── models/             # Modelos del subproyecto
├── src/                # Código fuente del subproyecto
│   ├── adapters/       # Adaptadores del subproyecto
│   ├── applicationsss/    # Aplicación del subproyecto
│   ├── config/         # Configuración del subproyecto
│   └── domain/         # Dominio del subproyecto
├── scripts/            # Scripts de utilidad del subproyecto
│   ├── deploy.py       # Script de despliegue del subproyecto
│   ├── setup.py        # Script de configuración del subproyecto
│   └── utils.py        # Utilidades generales del subproyecto
├── tests/              # Pruebas del subproyecto
│   ├── functional/     # Pruebas funcionales del subproyecto
│   ├── integration/    # Pruebas de integración del subproyecto
│   └── unit/           # Pruebas unitarias del subproyecto
├── .env                # Variables de entorno del subproyecto
├── .gitignore          # Archivos y directorios ignorados por Git en el subproyecto
├── Dockerfile          # Dockerfile para el subproyecto
├── Makefile            # Comandos para facilitar tareas comunes
├── README.md           # Documentación del subproyecto
└── pyproject.toml      # Configuración del proyecto (Poetry)
```

### Dominio (proyecto/sub_proyecto/src/domain/)
```
domain/
├── entities/         # Entidades de negocio con identidad única
├── events/           # Eventos de dominio
├── exceptions/       # Excepciones específicas del dominio
├── repositories/     # Interfaces de repositorios (PUERTOS)
├── services/         # Servicios de dominio
└── value_objects/    # Objetos inmutables que representan valores
```

### Aplicación (proyecto/sub_proyecto/src/applicationsss/)
```
applicationsss/
├── dtos/           # Objetos de transferencia de datos (Data Transfer Objects)
├── exceptions/     # Excepciones específicas de la capa de aplicación
├── handlers/       # Manejadores de eventos
├── ports/          # Interfaces para servicios externos
│   ├── primary     # Interfaces que son implementadas por los casos de uso y son utilizadas como dependencias en los adaptadores primarios
│   └── secondary   # Interfaces que son implementadas por los adaptadores secundarios y son utilizadas como dependencias en los casos de uso y/o adaptadores primarios
└── use_cases/      # Casos de uso organizados por feature. Son las implementaciones de los puertos primarios
```

### Adaptadores (proyecto/sub_proyecto/src/adapters/)
```
adapters/
├── exceptions/                 # Excepciones específicas de la capa de adaptadores
├── primary                     # Son las implementaciones de los puertos primarios que hacen de puerta de entrada al sistema
│   ├── api/                    # Adaptadores de API
│   │   └── fastapi/            # Adaptadores de API implementados con FastAPI
│   │       ├── v1/             # Endpoints de la versión 1 de la API
│   │       ├── app.py          # Archivo principal de la aplicación FastAPI
│   │       └── api_router.py   # Consolidación de rutas de la API      
│   ├── cli/                    # Adaptadores de línea de comandos
│   └── web/                    # Adaptadores web (FastAPI, Flask)
└── secondary                   # Son las implementaciones de los puertos secundarios y son el punto concreto de conexión con la infraestructura
    ├── external_apis/          # Adaptadores de APIs externas
    ├── messaging/              # Adaptadores de mensajería (kafka, rabbitmq, pub/sub, etc.)
    └── persistence/            # Adaptadores de persistencia
        ├── cloud_storage       # Almacenamiento en la nube
        ├── databases           # Motores de Bases de datos
        └── memory              # Bases de dato en memoria para testing
```

### Configuración (proyecto/sub_proyecto/src/config)
```
config/
├── config-development.yaml # Archivo de configuración para el ambiente de desarrollo
├── config-production.yaml  # Archivo de configuración para el ambiente de producción
├── config-qa.yaml          # Archivo de configuración para el ambiente de pruebas
├── di_config.py            # Módulo de configuración para la injección de dependencias
├── loader.py               # Módulo de carga de la configuración.
└── log_config.py           # Módulo de configuración para sistema de logs.
```

### Models (proyecto/models/, proyecto/sub_proyecto/models/)
Esta carpeta debe replicarse a nivel de proyecto y en cada subproyecto. Contiene modelos de arquitectura, aplicación y datos.
```
models/
├── application                 # Modelos de la aplicación
│   ├── class/                  # Modelos de clases (mermaid)
│   └── sequence/               # Modelos de secuencias (mermaid)
├── architecture                # Modelos de arquitectura
│   └── c4.dsl                  # Modelos C4 en formato DSL (structurizr)
└── datos/                      # Modelos de datos
    └── entity_relationship/    # Modelos entidad-relación (mermaid)
```

### Documents (proyecto/docs/, proyecto/sub_proyecto/docs/)
Esta carpeta debe replicarse a nivel de proyecto y en cada subproyecto. Contiene modelos de arquitectura, aplicación y datos.
```
docs/
├── application                     # Son las implementaciones de los puertos secundarios y son el punto concreto de conexión con la infraestructura
│   ├── background.md               # Antedentes generales del proyecto
│   ├── brief.md                    # Resumen del proyecto
│   ├── requirements.md             # Documento de requerimientos
│   └── wbs.md                      # Planificación del proyecto
├── architecture                    # Modelos de arquitectura
│   └── adrs/                       # ADRs
│       ├── 0001-inicial.md         # Primer ADR del proyecto
│       └── 0002-otra-decision.md   # Otro ADR del proyecto
├── data                            # Documentos relativos a los modelos de datos
│   └── data_dict.md                # Diccionario de datos
└── templates/                      # Plantillas para documentos
    ├── architecture_template.md    # Plantilla para documentos de arquitectura
    ├── background_template.md      # Plantilla para documentos de antecedentes
    ├── brief_template.md           # Plantilla para documentos de resumen
    ├── data_dict_template.md       # Plantilla para documentos de diccionario de datos
    ├── requirements_template.md    # Plantilla para documentos de requerimientos
    └── wbs_template.md             # Plantilla para documentos de planificación
```

## Principios Fundamentales de Arquitectura

### Estructura de Capas
- **Dominio (Core)**: Lógica de negocio pura, independiente de frameworks y tecnologías externas
- **Aplicación**: Orquestación de casos de uso y coordinación entre dominio e infraestructura
- **Adaptadores**: Adaptadores para bases de datos, APIs externas, frameworks web

### Flujo de Dependencias
- Las dependencias SIEMPRE apuntan hacia el interior (hacia el dominio)
- El dominio NUNCA debe depender de capas externas
- Usar inversión de dependencias mediante interfaces/protocolos



## Reglas de Codificación por Capa

### DOMINIO - Reglas Estrictas

#### Entidades de Dominio
- Usar dataclasses con `@dataclass` o clases tradicionales
- Implementar métodos de negocio, no solo getters/setters
- Incluir validaciones de invariantes en el constructor
- Usar Value Objects para tipos primitivos
- NO importar nada de aplicación o infraestructura

```python
# ✅ CORRECTO
@dataclass
class User:
    id: UserId
    email: Email
    name: str
    _is_active: bool = True
    
    def deactivate(self) -> None:
        if not self._is_active:
            raise UserAlreadyInactiveException()
        self._is_active = False
    
    def change_email(self, new_email: Email) -> None:
        if self.email == new_email:
            raise EmailUnchangedException()
        self.email = new_email
```

#### Value Objects
- Inmutables (usar `frozen=True` en dataclass)
- Incluir validación en constructor
- Implementar métodos de comparación si es necesario
- NO tener identidad, solo valor

```python
# ✅ CORRECTO
@dataclass(frozen=True)
class Email:
    value: str
    
    def __post_init__(self):
        if not self._is_valid_email(self.value):
            raise InvalidEmailException(f"Invalid email: {self.value}")
    
    def _is_valid_email(self, email: str) -> bool:
        # Validación de email
        return "@" in email and "." in email
```

#### Puerto secundario a Repositorios (Interfaces en Dominio)
- Definir como Protocol o ABC
- Usar tipos de dominio (Value Objects, Entities)
- Nombrar métodos en lenguaje de negocio
- NO usar términos técnicos (SQL, NoSQL, etc.)

```python
# ✅ CORRECTO
from abc import ABC, abstractmethod
from typing import Optional, List
from .entities import User, UserRole
from .value_objects import UserId
class IUserRepository(ABC):
    @abstractmethod
    def save(self, user: User) -> None:
        pass
    
    @abstractmethod
    def find_by_id(self, user_id: UserId) -> Optional[User]:
        pass
    
    @abstractmethod
    def find_active_users_by_role(self, role: UserRole) -> List[User]:
        pass
```

#### Servicios de Dominio
- Para lógica que no pertenece a una entidad específica
- Pueden usar repositorios del dominio
- Implementar reglas de negocio complejas
- NO manejar transacciones (eso es aplicación)

### APLICACIÓN - Orquestación

#### Casos de Uso
- Un caso de uso por clase
- Método principal llamado `execute`
- Usar DTOs para entrada y salida
- Manejar transacciones aquí
- Coordinar entre dominio e infraestructura
- Implementan los puertos primarios definidos en la capa de aplicación

```python
# ✅ CORRECTO
class CreateUserUseCase(ICreateUserUseCase):
    def __init__(
        self,
        user_repository: UserRepository,
        email_service: EmailService,
        unit_of_work: UnitOfWork
    ):
        self._user_repository = user_repository
        self._email_service = email_service
        self._unit_of_work = unit_of_work
    
    def execute(self, command: CreateUserCommand) -> UserDto:
        with self._unit_of_work:
            # Validación de dominio
            existing_user = self._user_repository.find_by_email(command.email)
            if existing_user:
                raise UserAlreadyExistsException()
            
            # Crear entidad
            user = User.create(command.name, command.email)
            
            # Persistir
            self._user_repository.save(user)
            
            # Efectos secundarios
            self._email_service.send_welcome_email(user.email, user.name)
            
            return UserDto.from_entity(user)
```

#### DTOs (Data Transfer Objects)
- Para transferir datos entre capas
- Inmutables cuando sea posible
- Incluir métodos de conversión desde/hacia entidades
- NO incluir lógica de negocio

#### Puertos de Aplicación
- Interfaces para que los casos de uso puedan usar los adaptadores secundarios (excepto los repositorios que se definen en el dominio)
- Interfaces para que los adaptadores primarios puedan usar los casos de uso.
- Email, SMS, APIs externas, logging, etc.

### ADAPTADORES - Implementaciones

#### Repositorios (Implementaciones)
- Implementar interfaces del dominio
- Usar ORMs, drivers de BD aquí
- Manejar conversiones entre modelos de BD y entidades
- Nombrar con tecnología: ejemplo `SqlAlchemyUserRepository`
- Implementar para que sean conscientes del contexto en el que son invocados. Si se invocan sin sesión, deben ser capaces de crear una y cerrar su transacción y sesión cuando finalizan sus funciones. En caso contrario no deben cerrar su transacción ni la sesión que recibieron, sera la unidad de trabajo que los invoque la que cierre la transacción y la sesión una vez finalice toda la operación.

#### Adaptadores Web
- Controllers/Routers delgados
- Solo mapear HTTP a casos de uso
- Manejar serialización/deserialización
- Validación de entrada básica

#### Modelos de Persistencia
- Separados de entidades de dominio
- Específicos para la tecnología (SQLAlchemy, MongoDB, etc.)
- Incluir mappers para convertir a/desde entidades

## Patrones y Convenciones

### Nomenclatura
- **Entities**: PascalCase, nombres de negocio (`User`, `Order`, `Product`)
- **Value Objects**: PascalCase, descriptivos (`Email`, `Money`, `UserId`)
- **Puertos:** PascalCase, Prefijo `I` (`IUserRepository`)
- **Repositories**: PascalCase, Sufijo `Repository` (`UserRepository`)
- **Use Cases**: PascalCase, Sufijo `UseCase` (`CreateUserUseCase`)
- **DTOs**: PascalCase, Sufijo `Dto` (`UserDto`)
- **Services**: PascalCase, Sufijo `Service` (`EmailService`, `NotificationService`)

### Manejo de Errores
- Excepciones específicas por capa
- Dominio: Excepciones de negocio (`UserNotFoundException`)
- Aplicación: Excepciones de casos de uso (`ValidationException`)
- Infraestructura: Mapear excepciones técnicas a excepciones de dominio

### Testing
- **Unit Tests**: Testear dominio aisladamente
- **Integration Tests**: Testear casos de uso con repositorios en memoria
- **E2E Tests**: Testear adaptadores completos

### Inyección de Dependencias
- Usar un container DI (dependency-injector)
- Configurar en el punto del adaptador primario correspondiente (ejemplo: app.py para FastApi)
- Interfaces definidas en capa superior, implementaciones en inferior

## Validaciones de Código

### ❌ NUNCA Hacer
- Importar adaptadores desde el dominio
- Importar aplicación desde dominio  
- Poner lógica de negocio en controllers
- Usar ORMs en el dominio
- Mezclar DTOs con entidades
- Crear dependencias circulares

### ✅ SIEMPRE Hacer
- Definir interfaces antes que implementaciones
- Usar Value Objects para tipos primitivos importantes
- Separar comandos de consultas (CQRS cuando sea apropiado)
- Implementar Unit of Work para transacciones
- Crear factories para entidades complejas
- Usar eventos de dominio para efectos secundarios

## Herramientas y Librerías Recomendadas

### Lenguaje y codificación
- `dataclasses` para entidades y value objects
- `abc` para interfaces
- `typing` para type hints
- `enum` para enumeraciones
- `pydantic` para DTOs y validación

### Configuración
- `dependency-injector` para DI

### Build y Gestión de Proyectos
- `poetry` para gestión de dependencias y entornos virtuales

### Infraestructura
- `sqlalchemy` para ORM
- `fastapi` para API REST
- `click` para CLI
- `redis` para cache
- `kafka` para comunicación asíncrona

### Testing
- `pytest` para tests
- `pytest-mock` para mocking
- `factory-boy` para fixtures
- `testcontainers` para integration tests

## Ejemplos de Comandos de Chat

Para generar código siguiendo estos principios, usa:
- "Genera una entidad User siguiendo arquitectura hexagonal"
- "Crea un caso de uso para crear usuarios"
- "Implementa un repositorio SQLAlchemy para User"
- "Genera tests unitarios para la entidad User"