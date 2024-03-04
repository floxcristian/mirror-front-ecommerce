- Para migrar a ruteo sin utilizar app.routing.module.ts debemos pasar los
  componentes a standalone components.

## Migración ESBuild

- La carpeta server queda fuera de front-ecommerce.

```json
  "server": "src/main.server.ts",
  "prerender": true,
  "ssr": {
    "entry": "server.ts"
  }
```
