# El Simulador de Celdas Galvánicas — Guía de Estudio

**Propósito de este documento:** explicar qué hace el simulador, la teoría química que lo sustenta y cómo está construido por dentro. Está pensado para personas que no estudian química ni programación, por lo que el lenguaje es claro y los ejemplos concretos, sin dejar de ser riguroso.

---

## 1. ¿Qué es el simulador?

Es un **laboratorio virtual** de electroquímica. El usuario selecciona dos metales y la aplicación muestra, mediante una animación y cálculos automáticos, cómo reaccionan entre sí para **producir electricidad**, del mismo modo que ocurre en una pila o batería común.

El objetivo es que se entienda, de forma visual y práctica, por qué ciertas combinaciones de metales generan corriente y otras no, así como los cálculos involucrados: voltaje, energía libre y balanceo de la reacción.

---

## 2. Conceptos básicos: los participantes de la reacción

Antes de analizar la celda conviene conocer las partículas y términos involucrados:

| Término | Definición |
|---|---|
| **Átomo** | La unidad mínima de un elemento. Un trozo de metal está formado por una enorme cantidad de átomos iguales. |
| **Electrón (e⁻)** | Partícula de carga **negativa**. Su desplazamiento constituye la corriente eléctrica. |
| **Ion** | Átomo que ha ganado o perdido electrones y, por tanto, posee carga eléctrica. Si pierde electrones queda cargado positivamente (por ejemplo, Zn²⁺). |
| **Reacción redox** | Reacción que combina una **oxi**dación y una **re**ducción, es decir, la transferencia de electrones entre dos especies. |

> **Idea central:** la electricidad de una pila no es un fenómeno mágico. Consiste únicamente en el **movimiento de electrones** desde un metal hacia otro.

---

## 3. Oxidación y reducción

Cuando dos metales se conectan, se produce una transferencia de electrones:

- **Oxidación:** pérdida de electrones. Ejemplo: `Zn → Zn²⁺ + 2e⁻`. El metal que se oxida cede electrones.
- **Reducción:** ganancia de electrones. Ejemplo: `Cu²⁺ + 2e⁻ → Cu`. La especie que se reduce los capta.

**Regla mnemotécnica útil:**
- La **oxi**dación se asocia a **perder** electrones.
- La **reducción** se asocia a **ganar** electrones (reduce su carga positiva).

En el simulador, la semirreacción de oxidación se muestra en el lado del ánodo y la de reducción en el lado del cátodo, con sus respectivos rótulos.

---

## 4. Ánodo y cátodo

Cada electrodo cumple una función específica:

| Electrodo | Función | Signo | Representación en el simulador |
|---|---|---|---|
| **Ánodo** | Oxidación (cede electrones) | **(−)** | Lado izquierdo, color turquesa |
| **Cátodo** | Reducción (capta electrones) | **(+)** | Lado derecho, color lavanda |

Los electrones recorren el circuito externo **desde el ánodo hasta el cátodo**. Si los electrodos se invierten, la reacción deja de ser espontánea y el simulador lo advierte.

---

## 5. Potencial estándar de reducción (E°)

Cada metal posee una tendencia distinta a captar electrones. Esa tendencia se cuantifica mediante el **potencial estándar de reducción**, simbolizado como **E°**, medido en condiciones estándar (25 °C, 1 atm, concentración 1 M) y referido al electrodo estándar de hidrógeno (E° = 0.00 V).

Interpretación del valor:

- E° **positivo y alto** (por ejemplo, oro: +1.50 V) indica **gran afinidad por los electrones**; ese metal tenderá a reducirse y, por tanto, a actuar como **cátodo**.
- E° **negativo** (por ejemplo, litio: −3.04 V) indica que el metal cede electrones con facilidad; actuará como **ánodo**.

> **Regla práctica:** el electrodo de mayor E° se reduce (cátodo) y el de menor E° se oxida (ánodo).

---

## 6. Voltaje de la celda: la fórmula principal

Al conectar los dos electrodos se genera una diferencia de potencial, denominada **E°celda**, calculada con la expresión:

```
E°celda = E°cátodo − E°ánodo
```

### Ejemplo resuelto: celda de Daniell (zinc y cobre)

1. Potencial del cobre (cátodo): **+0.34 V**
2. Potencial del zinc (ánodo): **−0.76 V**
3. Sustitución en la fórmula:

```
E°celda = 0.34 − (−0.76)
        = 0.34 + 0.76
        = 1.10 V
```

**Interpretación del resultado:**

- **E°celda positivo** → la reacción es **espontánea** (ocurren por sí sola) y la celda genera corriente. El voltímetro del simulador lo marca en verde.
- **E°celda negativo** → la reacción **no es espontánea**; requiere energía externa. La solución es invertir los electrodos.

**Sobre la unidad:** el voltio (V) mide la intensidad del "empuje" eléctrico. Una pila alcalina AA proporciona 1.5 V; esta celda de zinc–cobre alcanza 1.10 V, un valor comparable.

---

## 7. Número de electrones transferidos (n)

Los metales ceden o captan un número distinto de electrones según su valencia:

- El zinc transfiere **2** electrones (Zn²⁺).
- La plata transfiere **1** (Ag⁺).
- El aluminio transfiere **3** (Al³⁺).

Para que la reacción esté balanceada, la cantidad de electrones cedidos debe ser igual a la cantidad captada. El número de electrones transferidos (n) se obtiene con el **mínimo común múltiplo (mcm)** de ambas valencias:

```
n = mcm (valencia del ánodo, valencia del cátodo)
```

### Ejemplo 1: zinc y cobre

Zinc cede 2 y cobre capta 2 → mcm(2, 2) = **2**. Se transfieren 2 electrones y los coeficientes ya están equilibrados.

### Ejemplo 2: aluminio y plata

Aluminio cede **3** y plata capta **1** → mcm(3, 1) = **3**. Se transfieren 3 electrones, pero la plata necesita **3 átomos** para captarlos (cada uno recibe 1). La reacción balanceada es:

```
1 Al  +  3 Ag⁺  →  1 Al³⁺  +  3 Ag
```

Es decir: un átomo de aluminio cede sus tres electrones a tres iones de plata, produciendo un ion de aluminio y tres átomos de plata.

---

## 8. Energía libre de Gibbs (ΔG°)

El voltaje indica si la reacción ocurre; la **energía libre de Gibbs** indica cuánta energía se libera o se requiere. Se calcula como:

```
ΔG° = −n · F · E°celda
```

| Símbolo | Significado | Valor |
|---|---|---|
| **n** | Número de electrones transferidos | Se calcula como se indicó |
| **F** | Constante de Faraday (carga de un mol de electrones) | 96 485 C/mol |
| **E°celda** | Potencial de la celda | Se calcula con la fórmula de la sección 6 |

### Ejemplo resuelto: zinc y cobre

```
ΔG° = −(2) × (96 485) × (1.10)
    = −212 267 J
    = −212.3 kJ/mol
```

**Interpretación del signo:**

- **ΔG° negativo** → la celda **libera energía**; la reacción es espontánea.
- **ΔG° positivo** → la reacción necesita energía del exterior; no es espontánea.

En resumen, E°celda positivo y ΔG° negativo son dos formas equivalentes de expresar que la reacción transcurre espontáneamente.

---

## 9. Componentes de la celda

El esquema animado del simulador reproduce una celda real. Sus componentes son:

| Componente | Descripción | Función |
|---|---|---|
| **Semiceldas (vasos)** | Recipientes con la disolución del metal | Contienen el metal y sus iones disueltos |
| **Electrodos** | Barras metálicas sumergidas | El ánodo cede electrones; el cátodo los capta |
| **Circuito externo (alambre)** | Conductor que une los electrodos | Por él circulan los electrones |
| **Puente salino** | Tubo que conecta las dos disoluciones | Permite el paso de iones y mantiene el balance de cargas |
| **Voltímetro** | Instrumento de medición | Indica el valor del potencial generado |

**Sobre el puente salino:** sin él, el vaso del ánodo acumularía exceso de iones positivos y el del cátodo exceso de negativos, lo que detendría la reacción. El puente compensa ese desequilibrio. Por eso, en la notación, se representa con dos barras (`||`).

---

## 10. Notación de celda

Los químicos representan la celda mediante un diagrama abreviado que se lee **de izquierda a derecha** (ánodo primero):

```
Zn(s) | Zn²⁺(aq) || Cu²⁺(aq) | Cu(s)
```

Interpretación:

- `Zn(s)` → zinc en estado **sólido** (el electrodo).
- `|` → **frontera de fase** entre el metal y su disolución.
- `Zn²⁺(aq)` → iones de zinc **disueltos** en agua.
- `||` → **puente salino**.
- `Cu²⁺(aq)` → iones de cobre disueltos.
- `Cu(s)` → cobre sólido (el electrodo).

**Sobre los estados de agregación:** `(s)` indica sólido, `(aq)` disuelto en agua y `(g)` gas. En el caso del hidrógeno la notación es `Pt | H₂(g) | H⁺(aq)`, puesto que el hidrógeno es gaseoso y necesita un electrodo inerte de platino que permita el intercambio de electrones.

---

## 11. Tabla de metales y serie electroquímica

Los 18 electrodos del simulador están ordenados según su E°, formando la **serie electroquímica** (del menor al mayor potencial):

| Metal | Símbolo | Ion | Electrones transferidos | E° (V) |
|---|---|---|---|---|
| Litio | Li | Li⁺ | 1 | −3.04 |
| Potasio | K | K⁺ | 1 | −2.93 |
| Calcio | Ca | Ca²⁺ | 2 | −2.87 |
| Sodio | Na | Na⁺ | 1 | −2.71 |
| Magnesio | Mg | Mg²⁺ | 2 | −2.37 |
| Aluminio | Al | Al³⁺ | 3 | −1.66 |
| Manganeso | Mn | Mn²⁺ | 2 | −1.18 |
| **Zinc** | **Zn** | Zn²⁺ | 2 | −0.76 |
| Cromo | Cr | Cr³⁺ | 3 | −0.74 |
| Hierro | Fe | Fe²⁺ | 2 | −0.44 |
| Níquel | Ni | Ni²⁺ | 2 | −0.26 |
| Estaño | Sn | Sn²⁺ | 2 | −0.14 |
| Plomo | Pb | Pb²⁺ | 2 | −0.13 |
| Hidrógeno | H₂ | 2H⁺ | 2 | 0.00 |
| Cobre | Cu | Cu²⁺ | 2 | +0.34 |
| Plata | Ag | Ag⁺ | 1 | +0.80 |
| Platino | Pt | Pt²⁺ | 2 | +1.20 |
| **Oro** | **Au** | Au³⁺ | 3 | +1.50 |

**Cómo se utiliza:** cualquier metal de la parte superior puede actuar como ánodo (ceder electrones) frente a un metal de la parte inferior, que actuará como cátodo. El simulador realiza la resta `E°cátodo − E°ánodo` automáticamente.

---

## 12. Celdas famosas (presets)

El botón de **celdas famosas** ofrece combinaciones históricamente relevantes:

| Preset | Ánodo | Cátodo | E° (V) | Contexto |
|---|---|---|---|---|
| **Daniell (Zn–Cu)** | Zinc | Cobre | 1.10 V | La celda clásica de referencia en la enseñanza (1836) |
| **Volta (Zn–Ag)** | Zinc | Plata | 1.56 V | La primera pila práctica de la historia (1800) |
| **Sacrificio (Mg–Cu)** | Magnesio | Cobre | 2.71 V | Empleada en protección catódica de estructuras metálicas |
| **Aluminio–Plata (Al–Ag)** | Aluminio | Plata | 2.46 V | Ilustra el fuerte carácter reductor del aluminio |
| **Hierro–Cobre (Fe–Cu)** | Hierro | Cobre | 0.78 V | Explica la oxidación del hierro frente a metales más nobles |
| **Litio–Oro (Li–Au)** | Litio | Oro | 4.54 V | La de mayor voltaje: del metal más reductor al más noble |

---

## 13. Uso del simulador (paso a paso)

1. Seleccione el **ánodo** (metal que cederá electrones) en el selector turquesa.
2. Seleccione el **cátodo** (metal que los captará) en el selector lavanda.
3. Observe la **animación**: si la celda es espontánea, se verá el flujo de electrones por el circuito y el voltímetro en verde.
4. Revise los resultados calculados:
   - **E°celda** → el voltaje generado.
   - **Electrones transferidos** → el número de electrones intercambiados.
   - **ΔG°** → la energía liberada o requerida.
   - **Ecuaciones** → la reacción balanceada.
   - **Notación de celda** → el diagrama abreviado.
5. Utilice el botón `⇄` para intercambiar los electrodos y observar el efecto.
6. Utilice `🎲 Aleatoria` para que la aplicación elija una celda al azar.
7. Utilice `🎓 Modo Práctica` para responder preguntas con retroalimentación inmediata.

---

## 14. Glosario

- **Celda galvánica:** dispositivo que transforma energía química en energía eléctrica mediante una reacción redox espontánea.
- **Reacción espontánea:** reacción que transcurre sin aporte externo de energía.
- **Potencial estándar de reducción (E°):** medida de la tendencia de una especie a captar electrones en condiciones estándar.
- **n:** número de electrones transferidos en la reacción balanceada.
- **F (constante de Faraday):** carga de un mol de electrones, igual a 96 485 C/mol.
- **ΔG:** variación de energía libre; su signo indica si la reacción es espontánea.
- **mcm (mínimo común múltiplo):** el menor número que es múltiplo de dos valores a la vez (por ejemplo, mcm(3, 1) = 3).

---

## 15. Conclusión en tres ideas

1. **Una celda es un intercambio de electrones:** un metal cede electrones (ánodo) y otro los capta (cátodo).
2. **El voltaje lo determina la diferencia de potencial:** si el cátodo tiene mayor E° que el ánodo, el potencial es positivo y la celda es espontánea.
3. **Dos fórmulas resumen los cálculos:** `E°celda = E°cátodo − E°ánodo` y `ΔG° = −n·F·E°`. El simulador ejecuta estos cálculos automáticamente; el usuario solo selecciona los metales y observa el resultado.

---

## 16. Cómo está construido el aplicativo

*Esta sección explica el funcionamiento interno del simulador. No requiere conocimientos previos de programación.*

### 16.1 Una aplicación web compuesta por tres archivos

El simulador es una aplicación web que funciona directamente en el navegador. Está formada por tres archivos con responsabilidades distintas:

| Archivo | Responsabilidad | Equivalencia |
|---|---|---|
| **index.html** | Define la **estructura** de la página: ubicación de botones, textos, títulos y el área de dibujo | El plano de la construcción |
| **styles.css** | Define la **presentación**: colores, tipografía, tema oscuro y adaptación a distintos tamaños de pantalla | El acabado visual |
| **app.js** | Contiene la **lógica**: los datos de los metales, los cálculos químicos, la animación y el modo práctica | El componente que procesa y decide |

### 16.2 La estructura (HTML)

La página se organiza en secciones, cada una con una función:

1. Cabecera (título y versión)
2. Selectores de electrodos
3. Barra de herramientas (celdas famosas y botón de práctica)
4. Área de dibujo (**canvas**)
5. Barra de resultados (E°, n, ΔG)
6. Ecuaciones de la reacción
7. Notación de celda
8. Panel del modo práctica (oculto hasta que se activa)
9. Sección de conceptos y pie de página

El **canvas** es el "lienzo" en el que la aplicación dibuja la celda mediante código: los vasos, los electrodos, el puente salino, el voltímetro y las partículas en movimiento.

### 16.3 La presentación (CSS)

- Los colores se definen una única vez mediante **variables de diseño** (por ejemplo, `--anode` para el turquesa). De este modo, modificar un valor en un solo punto actualiza toda la interfaz, lo que facilita el mantenimiento.
- La página es **adaptable (responsive)**: detecta el tamaño de la pantalla (teléfono, tableta o computadora) y reorganiza el contenido para su correcta visualización.

### 16.4 La lógica (JavaScript)

El comportamiento del simulador se apoya en cuatro conceptos de programación:

1. **Base de datos de metales.** Una lista con los 18 metales; cada elemento almacena símbolo, nombre, ion, valencia y E°. Cada metal tiene además un **índice** (0 = litio, ..., 17 = oro) que permite referenciarlo directamente.

2. **Estado de la aplicación.** Una estructura que **recuerda** la selección actual de ánodo y cátodo. Cada cambio en los selectores actualiza este estado.

3. **Eventos.** Cuando el usuario interactúa (cambia una selección o presiona un botón), la aplicación reacciona invocando la función `update()`, que ejecuta, en orden:
   1. Calcula `E°celda = E°cátodo − E°ánodo`.
   2. Calcula `n = mcm(valencias)` mediante una función de mínimo común múltiplo.
   3. Calcula `ΔG° = −n × 96 485 × E°`.
   4. Balancea las semirreacciones (divide n entre cada valencia para obtener los coeficientes).
   5. Actualiza en pantalla los resultados, las ecuaciones y la notación.

4. **Bucle de animación.** Un mecanismo que se repite **aproximadamente 60 veces por segundo** (de forma análoga a los fotogramas de una película). En cada repetición el lienzo se borra y se redibuja con una variación mínima, lo que produce la ilusión de movimiento de electrones e iones. Este mecanismo recibe el nombre técnico de `requestAnimationFrame`.

### 16.5 Conceptos de programación empleados

| Concepto | Definición | Analogía |
|---|---|---|
| **Función** | Bloque de código con nombre que realiza una tarea y puede invocarse varias veces | Una receta que se reutiliza |
| **Variable** | Espacio que almacena un valor (número o texto) | Un contenedor etiquetado |
| **Lista (array)** | Conjunto ordenado de valores, numerado desde 0 | Un conjunto de contenedores numerados |
| **Evento** | Interacción del usuario que dispara una respuesta | Un aviso que provoca una reacción |
| **Condicional (if)** | Ejecuta una acción u otra según una condición | "Si ocurre X, hacer Y; si no, hacer Z" |

### 16.6 Modo práctica: generación del quiz

Al activar el modo práctica, la aplicación:

1. Selecciona **dos metales al azar** (distintos y sin incluir hidrógeno).
2. Los ordena de modo que el de menor E° sea el ánodo y el otro el cátodo.
3. Genera **cuatro preguntas**: identificar el ánodo, el cátodo, el número de electrones transferidos y el valor de E°.
4. Para la pregunta de E°, elabora **distractores** (respuestas incorrectas plausibles, como la suma de los potenciales o el valor ±0.5 V) y los presenta en orden aleatorio.
5. Al responder, compara la elección con la respuesta correcta e indica si se acertó, acompañando la respuesta con la explicación y la fórmula correspondiente.

### 16.7 Publicación y requisitos

- La aplicación es **100 % estática**: no requiere servidor ni proceso de compilación; basta con abrir `index.html` en un navegador.
- Se publica de forma gratuita mediante **GitHub Pages**: cada cambio enviado al repositorio se convierte automáticamente en una versión actualizada del sitio web.

**Resumen de programación:** estructura (HTML) + presentación (CSS) + lógica (JavaScript). La lógica mantiene la base de datos de metales, registra la selección del usuario, reacciona a sus interacciones con los cálculos, redibuja la celda constantemente y genera preguntas de práctica. En términos sencillos, eso es todo lo que ocurre internamente.
