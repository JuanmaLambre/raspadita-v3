# Raspadita YPF

### Build del proyecto

Ejecutar `npm run build`. Los archivos generados se encontrarán en la carpeta `./dist` (`app.bundle.js` y  `app.css`).

### Correr localmente

Para correr el proyecto con un servidor local, ejecutar `npm run dev`. Luego, ir a [localhost:8080]().

En este entorno todas las llamadas al servidor se harán al servidor local, también [localhost:8080]().

Por default, el servidor local está configurado para hacer un bypass al servidor de test ([https://test.ypfchances.com]()). Esta opción permite evadir problemas de CORS (que no son pocos)

#### Actualizar index.html

Para hacer pruebas locales hace falta actualizar el `index.html` que en producción se genera server-side y ya contiene información necesaria de inicialización.

Para simular este flujo se implementó el script `npm run fetch-tokens <code>` que reemplaza el contenido que el servidor generaría dinámicamente. El nuevo contenido es de hecho información verdadera del propio servidor (de prueba), así que la simulación es, a efectos prácticos, equivalente.
