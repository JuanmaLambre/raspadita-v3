# Raspadita YPF

### Correr localmente

Para correr el proyecto con un servidor local, ejecutar `npm run dev`. Luego, ir a [localhost:8080]().

En este entorno todas las llamadas al servidor se harán al servidor local, también [localhost:8080]().

Dentro de `./src/devServer/setup.ts` existe la opción de procesar localmente los requests o hacer un bypass al servidor real. Esta opción (en vez de hacer la llamada directamente desde el browser, sin un bypass) permite evadir problemas de CORS (que no son pocos)
