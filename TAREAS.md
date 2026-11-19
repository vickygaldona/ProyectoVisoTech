# Tareas de VisoTech

Tildar cada tarea al terminarla. Una tarea por commit; antes de commitear correr `npm run lint` y `npm run build`.
Si falta un dato (precios, fotos, testimonios, etc.), dejar un texto de ejemplo marcado con "COMPLETAR".

## A. Limpieza rápida
- [x] 1. Botones "Consultar presupuesto" (hero y portfolio) llevan al formulario `#consulta`
- [x] 2. Borrar archivos sobrantes (desktop.ini, SVG de ejemplo de Next, wsp.png.png, scripts aplicar-*.cjs)
- [x] 3. README: sacar el `---` suelto y agregar cómo correr el proyecto

## B. Rendimiento
- [x] 4. Convertir public/imagen1..5.png a WebP y actualizar referencias en DEMO_SLIDES
- [x] 5. En celulares/equipos de bajos recursos: sin niebla WebGL, menos estrellas, sin cursor ni botones magnéticos

## C. Formulario
- [x] 6. Plan B por mail (mailto prellenado) y simplificar el anti-spam

## D. Contenido nuevo (datos de ejemplo con COMPLETAR)
- [x] 7. Sección "Cómo trabajamos" (4 pasos, con el texto de sus propios PDFs)
- [x] 8. Preguntas frecuentes (acordeón accesible; contenido en app/data/faq.ts, solo con datos de los PDFs)
- [x] 9. Testimonios: sección lista, se muestra sola cuando carguen testimonios reales en app/data/testimonials.ts
- [x] 10. Fotos en "Quiénes somos": listo para usar; falta subir public/equipo/santiago.webp y victoria.webp y descomentar `photo` en CONTACTS
- [x] 11. Logo de VisoTech en el hero (public/logo.webp, sale del ícono de la pestaña)

## E. Portfolio
- [ ] 12. Video o GIF opcional por demo (campo `video` en DEMO_SLIDES)

## F. Orden del código
- [ ] 13. Precios y planes a app/data/plans.ts, con "Desde" y fecha de referencia
- [ ] 14. Partir app/page.tsx en componentes dentro de app/components/

## G. Revisión final
- [ ] 15. Política de privacidad menciona Google Analytics y fechas al día
- [ ] 16. Lista final de lo que tienen que aportar (fotos, logo, testimonios, datos del FAQ)

## Para hacer ustedes (no es código)
- [ ] Dominio propio (.com.ar)
- [ ] Perfil de Google Business
- [ ] Plan mensual (hosting, dominio, cambios chicos)
- [ ] Reducir los 11 servicios a 3 o 4
- [ ] Juntar testimonios reales (con permiso del cliente) y cargarlos en app/data/testimonials.ts
- [ ] Sacar y subir las fotos de ustedes (public/equipo/)
- [ ] Decidir y escribir las respuestas que faltan del FAQ (hosting y dominio, seña y pagos, rondas de cambios, mantenimiento); están listadas al final de app/data/faq.ts
- [ ] Anotar horas por proyecto y cuánto se cobró
