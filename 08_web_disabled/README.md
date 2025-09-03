# Dashboard de Monitoreo de Salas de Bombas (Next.js)

Este proyecto es una reimplementación de una aplicación de monitoreo de salas de bombas, utilizando un stack de tecnologías modernas con Next.js, React, y Tailwind CSS.

---

## Estado Actual

El desarrollo se encuentra en una etapa inicial pero funcional, enfocado en la interfaz de usuario (frontend). El estado actual es el siguiente:

1.  **Base del Proyecto:**
    -   Inicializado con Next.js (App Router).
    -   Configurado con TypeScript para un código robusto y Tailwind CSS para el diseño.

2.  **Flujo de Datos (Demo):**
    -   Se ha implementado un flujo de datos dinámico utilizando el `localStorage` del navegador para simular una base de datos.
    -   Esto permite añadir configuraciones de salas de bombas y verlas reflejadas en el dashboard sin necesidad de un backend funcional por el momento.

3.  **Páginas Implementadas:**
    -   **/login:** Una página de inicio de sesión estática (sin lógica de autenticación por ahora).
    -   **/setup:** Una página para configurar nuevas salas de bombas. Contiene un formulario para introducir los datos.
    -   **/:** El dashboard principal, que lee los datos desde `localStorage` y los muestra.

4.  **Formulario de Configuración (`/setup`):**
    -   **Completado:** La sección de "Información del Cliente" y la sección de "Equipos" son funcionales.
    -   **Pendiente:** La sección "Datos de Placa y Motor".

5.  **Componentes Creados:**
    -   `PumpClientInfo`: Tarjeta para mostrar la información del cliente.
    -   `PumpEquipmentInfo`: Tarjeta para mostrar la lista de equipos.

---

## Cómo Ejecutar la Aplicación

Para continuar con el desarrollo o probar la aplicación, sigue estos pasos:

1.  **Navega al directorio del proyecto:**
    ```bash
    cd 08_web
    ```

2.  **Instala las dependencias (si es la primera vez):**
    ```bash
    npm install
    ```

3.  **Inicia el servidor de desarrollo:**
    ```bash
    npm run dev
    ```

4.  Abre tu navegador y visita [http://localhost:3000](http://localhost:3000).

---

## Próximos Pasos (Tareas Pendientes)

Cuando retomemos el trabajo, estos son los siguientes pasos lógicos:

1.  **Completar el Formulario de Configuración:**
    -   [ ] Implementar los campos para "Datos de Placa" en el formulario de `/setup`.
    -   [ ] Implementar los campos para "Datos del Motor en Funcionamiento".

2.  **Completar el Dashboard:**
    -   [ ] Crear los componentes `PumpPlateData` y `PumpMotorData` para mostrar esa información en el dashboard.
    -   [ ] Implementar la interfaz de selección cuando haya más de una sala de bombas configurada.

3.  **Funcionalidades Futuras:**
    -   [ ] Conectar la aplicación a la API real para reemplazar el uso de `localStorage`.
    -   [ ] Implementar la autenticación y proteger la ruta `/setup` según los roles de usuario.