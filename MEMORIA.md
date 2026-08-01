# MEMORIA DEL PROYECTO — Simulador de Celdas Galvánicas

Mejoras planificadas (guardadas para futuras iteraciones).

## Ideas diferidas (no implementadas aún)

### 1. Ecuación de Nernst + concentraciones (PRIORIDAD ALTA)
- Sliders de concentración `[M]` para cada semicelda (especie oxidada y reducida).
- Control de temperatura (°C).
- Voltaje real dinámico: `E = E° − (RT/nF)·ln Q` en lugar del E° fijo.
- La solución cambiaría de color/intensidad según la concentración.
- Implicaría añadir concentraciones al modelo de datos de cada metal.

### 2. Evolución de la celda en el tiempo (Ley de Faraday)
- Simular la descarga: el ánodo se disuelve (pierde masa), el cátodo se recubre.
- Cambio de color de las disoluciones conforme avanza la reacción.
- El potencial cae hasta llegar al equilibrio (Q → K), mostrando agotamiento.
- m = (M · I · t) / (n · F) para mostrar masa depositada/disuelta.

### 3. Circuito y corriente
- Añadir resistencia/carga, amperímetro y voltímetro reales.
- Flujo de corriente visible por el circuito externo.
- Potencia entregada: P = V · I.
- Ley de Ohm con una carga variable.

## Notas de diseño
- El resto de la app está en `index.html`, `styles.css`, `app.js`.
- Preferir no romper la API actual de `METALS` (índices usados por presets).
aaa