# Proyecto de Monitoreo de Bombas de Incendio

Esta es una aplicación web de front-end simple para visualizar el estado y las alarmas de bombas de incendio desde una API simulada.

## Descripción

La aplicación presenta un dashboard responsivo que muestra una "tarjeta" por cada bomba, con su estado actual, presión, fuente de energía y alarmas activas. Los datos se actualizan automáticamente cada 5 segundos.

## Estructura de Archivos

```
/
├── index.html          # Archivo principal HTML
├── css/
│   └── style.css       # Estilos de la aplicación
├── js/
│   └── app.js          # Lógica de la aplicación (llamadas a API, renderizado)
└── api/
    └── data.json       # Simulación de la respuesta de la API
└── README.md           # Este archivo
```

## Cómo Ejecutar

Debido a las políticas de seguridad de los navegadores (CORS), no puedes abrir el archivo `index.html` directamente desde el sistema de archivos (`file:///...`) porque el código JavaScript no podrá cargar el archivo local `api/data.json`.

Para ejecutar el proyecto correctamente, necesitas servir los archivos desde un servidor web local.

### Opción 1: Usando Python (Recomendado si tienes Python instalado)

1.  Abre una terminal en la raíz de este directorio del proyecto.
2.  Ejecuta uno de los siguientes comandos, dependiendo de tu versión de Python:

    ```bash
    # Para Python 3
    python3 -m http.server
    ```
    ```bash
    # Para Python 2
    python -m SimpleHTTPServer
    ```
3.  Abre tu navegador web y ve a la siguiente dirección: `http://localhost:8000`

### Opción 2: Usando la extensión "Live Server" en Visual Studio Code

1.  Instala la extensión [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) desde el marketplace de VS Code.
2.  Abre la carpeta del proyecto en VS Code.
3.  Haz clic derecho en el archivo `index.html` y selecciona "Open with Live Server".
4.  Se abrirá automáticamente una nueva pestaña en tu navegador con la aplicación en funcionamiento.
