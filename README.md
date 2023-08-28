# Raspadita YPF

### Correr localmente

Para correr el proyecto con un servidor local, ejecutar `npm run dev`. Luego, ir a [localhost:8080]().

En este entorno todas las llamadas al servidor se harán al servidor local, también [localhost:8080]().

Dentro de `./src/devServer/setup.ts` existe la opción de procesar localmente los requests o hacer un bypass al servidor real. Esta opción (en vez de hacer la llamada directamente desde el browser, sin un bypass) permite evadir problemas de CORS (que no son pocos)

#### Actualizar index.html

Para hacer pruebas locales hace falta actualizar el `index.html` que en producción se genera server-side y ya contiene información necesaria de inicialización.

Para simular este flujo se implementó el script `npm run fetch-tokens <code>` que reemplaza el contenido que el servidor generaría dinámicamente. El nuevo contenido es de hecho información verdadera del propio servidor (de prueba), así que la simulación es, a efectos prácticos, equivalente.
