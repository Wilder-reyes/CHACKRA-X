# Guía de uso de CHACKRA X

**Aplicación web:** https://chakrax.vercel.app/

CHACKRA X ayuda a organizar próximas siembras por zonas de cultivo. Trabaja con el terreno y las siembras que declara el usuario y presenta propuestas orientativas que deben revisarse antes de aplicarlas.

## 1. Bienvenida y CHOKLITO

Al ingresar por primera vez, aparece la bienvenida de **CHOKLITO**, la mascota y guía de la aplicación. Selecciona **Comenzar recorrido** para seguir el tutorial o **Explorar por mi cuenta** para usar la web libremente.

Durante el recorrido, CHOKLITO explica qué hacer en cada paso. En el registro de cultivos, una animación ilustra cómo llevar una tarjeta de cultivo al polígono correspondiente. El recorrido puede volver a abrirse desde el control de ayuda.

## 2. Selecciona tu terreno

En **Mi terreno**, utiliza el buscador para encontrar una localidad o desplázate por el mapa.

- Puedes probar el ejemplo disponible o delimitar tu propio terreno.
- Para dibujar, marca los vértices del contorno y confirma la figura.
- Revisa la superficie aproximada que muestra la aplicación.
- Si ya tienes un contorno GeoJSON compatible, puedes utilizar la opción de importación.

El contorno general indica la ubicación de tu terreno. **Todavía no determina qué parte está sembrada.**

## 3. Marca las zonas sembradas

En **Mis cultivos**, cada polígono corresponde a un área que tiene un cultivo registrado.

- Selecciona un polígono en el mapa o en **Mis zonas**.
- Arrastra el punto central para mover el polígono.
- Arrastra sus vértices para ajustar su forma al área sembrada.
- Los polígonos deben permanecer dentro del terreno y no superponerse.
- Puedes añadir o eliminar zonas según lo que tengas sembrado.

El terreno fuera de los polígonos no se cuenta como zona de siembra. Por eso, si delimitas tres polígonos, el registro muestra tres zonas sembradas.

## 4. Registra la siembra actual

Para **cada zona**, elige:

1. El cultivo que está sembrado actualmente.
2. El mes y año en que lo sembraste.
3. La zona concreta donde se encuentra.

Los nueve cultivos disponibles son **maíz amarillo duro, camote, papa, frijol canario, frijol castilla, vainita, pallar, cebolla y zanahoria**.

Puedes registrar el mismo cultivo y la misma fecha en varias zonas. No necesitas reconstruir todas las campañas agrícolas antiguas.

Pulsa **Guardar avance** para conservar el registro en el dispositivo cuando corresponda. Cuando todas las zonas estén registradas, pulsa **Continuar a mi plan**.

## 5. Genera y lee tu plan

En **Mi plan**, selecciona el periodo que deseas organizar y utiliza **Crear mi calendario**.

La aplicación presenta un resultado separado para cada zona:

- **Cultivo actual:** tu registro.
- **Cultivo recomendado:** una próxima opción para evaluar.
- **Siembra orientativa:** mes estimado con base en referencias disponibles.
- **Motivo:** explicación de la alternativa.
- **Preparación paso a paso:** comprobaciones de agua, drenaje, suelo, variedad y manejo del cultivo.

Usa el selector de años y meses para interpretar el calendario. Dos zonas pueden tener cultivos simultáneos o fechas distintas. Los meses **sin siembra programada** se identifican como tales: no se deben interpretar automáticamente como descansos agronómicos recomendados.

El mapa de resultados representa las zonas declaradas; el color del polígono ayuda a distinguir cultivos y no significa que la imagen satelital haya identificado esa especie.

## 6. Guarda el PDF A4

Pulsa **Guardar como PDF** para generar un documento con los resultados del plan. El PDF incluye:

- Croquis vectorial del terreno y sus zonas.
- Superficie y cultivo actual de cada zona.
- Próximo cultivo sugerido y fecha orientativa.
- Explicación y pasos de preparación.
- Calendario por zonas.
- Fuentes y limitaciones.

Es un documento de referencia para revisar, conservar o compartir.

## 7. Comparte el PDF por WhatsApp

Pulsa **Compartir PDF por WhatsApp**.

**En un dispositivo compatible con compartir archivos:** el navegador abre el menú del sistema con el PDF recién generado; selecciona WhatsApp y el destinatario.

**Si el navegador no admite compartir archivos:** la aplicación permite guardar el PDF y abre WhatsApp con un mensaje de referencia. Para enviar el informe, debes **adjuntar manualmente el PDF descargado** desde Descargas.

Abrir WhatsApp no significa que el documento ya se haya enviado.

## 8. Interpretación responsable

Las áreas mostradas son aproximadas y no sustituyen una medición catastral. Las fechas y cultivos sugeridos requieren revisión de la disponibilidad de agua, del estado del suelo, de las variedades disponibles y de la asesoría agraria local.

NASA POWER aporta contexto climatológico; NASA HLS aporta observaciones históricas de vegetación en el ámbito documentado. Estas fuentes no certifican por sí solas qué especie está sembrada en una parcela ni permiten asegurar rendimientos futuros.

Lee [NASA y metodología](NASA.md) y [validación y límites](VALIDATION.md).

## 9. Dudas habituales

**¿Puedo trabajar fuera de Barranca?** Sí. Puedes delimitar otros terrenos; las referencias científicas y el alcance del modelo HLS varían según el lugar.

**¿Puedo registrar el mismo cultivo en varias zonas?** Sí, incluso con el mismo mes de siembra.

**¿Por qué hay meses sin siembra?** Porque no existe una campaña confirmada en el plan para ese mes. No significa necesariamente que se recomiende dejar la tierra sin cultivar.

**¿Debo ingresar mi historial completo?** No. El registro principal solicita la siembra actual y cuándo comenzó.

**¿El PDF se comparte automáticamente?** Solo si completas el flujo de compartir en un dispositivo compatible. Si no, debes adjuntarlo manualmente.
