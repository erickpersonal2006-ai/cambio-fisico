# Cambio Físico

App personal (PWA) para seguir un plan de 12 semanas: ejercicio, running y alimentación.

- Funciona sin conexión y se instala en el iPhone desde Safari (Compartir → Añadir a pantalla de inicio).
- Los datos se guardan solo en el dispositivo. Exporta una copia desde Administración → Copia de seguridad.
- Coste: 0 €. Sin dependencias, sin cuentas, sin rastreo.

## Desarrollo

El código fuente está en `src/`. Para regenerar `index.html`, `sw.js` y `manifest.webmanifest`:

```bash
python3 build.py
```

`dist/artifact.html` es la misma app empaquetada para Claude.
