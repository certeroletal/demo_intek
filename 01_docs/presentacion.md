
# Presentación: Plataforma "PyroProof"

---

### **Diapositiva 1: Título**

*   **Título:** PyroProof - Plataforma de Monitoreo de Bombas
*   **Subtítulo:** Presentación de Prototipo Funcional
*   **Fecha:** 27 de Agosto de 2025

---

### **Diapositiva 2: Agenda**

1.  **Introducción y Objetivos:** ¿Qué problema resolvemos?
2.  **Arquitectura del Sistema:** ¿Cómo está construido?
3.  **Funcionalidades Implementadas:** ¿Qué hace la plataforma hoy?
4.  **Demostración en Vivo:** Un recorrido por la aplicación.
5.  **Próximos Pasos:** ¿Hacia dónde vamos?

---

### **Diapositiva 3: Introducción y Objetivos**

*   **El Reto:** La necesidad de supervisar equipos industriales, como las bombas, de manera eficiente y remota. La falta de un sistema centralizado dificulta el mantenimiento proactivo y la respuesta rápida a fallos.

*   **La Solución:** "PyroProof", una plataforma web que centraliza la adquisición y visualización de datos de bombas. Ofrece una interfaz clara para el monitoreo en tiempo real, el análisis de datos históricos y la gestión de alarmas.

*   **Objetivos Clave del Prototipo:**
    *   **Visualización de Datos:** Proveer una interfaz web intuitiva y fácil de usar.
    *   **Acceso Seguro:** Garantizar que solo personal autorizado acceda a la información, con diferentes niveles de permiso.
    *   **Análisis Histórico:** Permitir la consulta y exportación de datos para análisis de tendencias y diagnóstico de fallos.
    *   **Alertas Proactivas:** Implementar un sistema que notifique sobre condiciones anómalas para una respuesta inmediata.

---

### **Diapositiva 4: Arquitectura del Sistema**

*   **Backend:** Utilizamos **Python** con el micro-framework **Flask**. Esta elección nos da flexibilidad y un desarrollo rápido, ideal para prototipos y sistemas escalables.

*   **Frontend:** La interfaz de usuario está construida con **HTML, CSS y JavaScript**, utilizando el motor de plantillas **Jinja2** de Flask para renderizar las páginas dinámicamente desde el servidor.

*   **Base de Datos:** Para el almacenamiento de datos históricos, la aplicación está preparada para conectarse a una base de datos **PostgreSQL**, un sistema de gestión de bases de datos robusto y de código abierto.

*   **Patrón de Diseño: Arquitectura Limpia (Clean Architecture)**
    *   Hemos estructurado el código en capas (Dominio, Aplicación, Adaptadores) para separar la lógica de negocio de los detalles técnicos.
    *   **Beneficios:** Esto hace que el sistema sea más fácil de mantener, probar y escalar a futuro.

    ```
    +---------------------------------------------------+
    |                   Adaptadores                     |
    |  (Flask, Base de Datos, APIs externas)            |
    +---------------------------------------------------+
    |               Lógica de Aplicación                |
    |  (Casos de Uso: ej. ObtenerDatosHistoricos)       |
    +---------------------------------------------------+
    |                  Dominio                          |
    |  (Entidades del Negocio: ej. Bomba, Alarma)       |
    +---------------------------------------------------+
    ```

---

### **Diapositiva 5: Funcionalidades Implementadas**

*   **Dashboard Principal:** Una vista consolidada que muestra los eventos más recientes registrados por el sistema, permitiendo una supervisión rápida del estado general.

*   **Dashboard Histórico:** Una herramienta de análisis que permite a los usuarios avanzados consultar el histórico de datos, con filtros por rango de fechas y paginación para manejar grandes volúmenes de información.

*   **Sistema de Autenticación y Roles:**
    *   Login seguro para proteger el acceso a la plataforma.
    *   **5 roles predefinidos:** Administrador, Avanzado, Intermedio, Básico y Mantenimiento, cada uno con permisos específicos.

*   **Sistema de Alarmas:**
    *   El sistema identifica condiciones de alarma basadas en los datos recibidos.
    *   Actualmente, simula el **envío de una notificación por correo electrónico** con los detalles de la alarma para una acción inmediata.

*   **Exportación de Datos:**
    *   Los usuarios pueden descargar los datos históricos seleccionados en formato **CSV**, para su análisis en herramientas externas como Excel.

---

### **Diapositiva 6: Próximos Pasos**

*   **Desarrollo a Corto Plazo:**
    *   **Gráficos Interactivos:** Integrar librerías como Chart.js o Plotly para visualizar las tendencias de los datos históricos de forma más dinámica.
    *   **Notificaciones Reales:** Configurar un servicio de envío de correos real (ej. SendGrid) y explorar otros canales como SMS o Telegram.

*   **Operaciones y Despliegue:**
    *   **Contenerización:** Finalizar y optimizar el `Dockerfile` para el despliegue en un entorno de producción.
    *   **Pruebas de Rendimiento:** Ejecutar pruebas de carga y estrés para asegurar que la aplicación pueda manejar la carga de trabajo esperada.
    *   **CI/CD:** Implementar un pipeline de integración y despliegue continuo para automatizar las futuras actualizaciones.

---

### **Diapositiva 7: ¡Gracias! ¿Preguntas?**

