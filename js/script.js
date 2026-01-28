/**
 * ============================================================================
 * GUÍA DE REFERENCIA: SISTEMA DE SONIDOS
 * ============================================================================
 * 
 * CÓMO FUNCIONA:
 * ---------------
 * 1. Cada palabra tiene dos tipos de audio:
 *    - audio: Pronunciación de la palabra (ej: 'perro.mp3')
 *    - syllableAudio: Pronunciación de sílabas (ej: 'perro_silabas.mp3') [OPCIONAL]
 *    - sound: Sonido asociado/ambiental (ej: 'ladrido.mp3')
 * 
 * 2. Los archivos se buscan en la carpeta: /audio/
 *    Ejemplo: 'ladrido.mp3' → se busca en '/audio/ladrido.mp3'
 * 
 * 3. Si el archivo no existe, se usa TTS (Text-to-Speech) como fallback
 * 
 * EJEMPLO REAL - PERRO CON LADRIDO:
 * -----------------------------------
 * En la base de datos:
 *   { word: 'PERRO', audio: 'perro.mp3', sound: 'ladrido.mp3' }
 *   O con audio de sílabas personalizado:
 *   { word: 'GATO', audio: 'gato.mp3', syllableAudio: 'gato_silabas.mp3', sound: 'maullido.mp3' }

 * 
 * Archivos necesarios en /audio/:
 *   - perro.mp3 (pronunciación de "PERRO")
 *   - ladrido.mp3 (sonido del ladrido) ✅ YA EXISTE
 * 
 * Flujo de reproducción:
 *   1. Reproduce 'audio/perro.mp3' (o dice "PERRO" con TTS si no existe)
 *   2. Después de 1.5s:
 *      - Si existe 'syllableAudio': reproduce 'audio/perro_silabas.mp3'
 *      - Si NO existe: dice "Pe, rro" con TTS
 *   3. Después de 3s: reproduce 'audio/ladrido.mp3' (o dice "Sonido de PERRO")
 * 
 * CÓMO AGREGAR NUEVOS SONIDOS:
 * -----------------------------
 * 1. Coloca el archivo MP3 en la carpeta /audio/
 *    Ejemplo: /audio/beso.mp3
 * 
 * 2. En la base de datos, agrega el nombre del archivo en 'sound':
 *    { word: 'MAMÁ', sound: 'beso.mp3' }
 * 
 * 3. El código automáticamente intentará reproducirlo
 *    Si no existe, usará TTS como fallback
 * 
 * NOTA: El archivo 'ladrido.mp3' ya está incorporado y funcionando.
 *       Se reproduce automáticamente cuando se muestra la tarjeta de PERRO.
 * 
 * ============================================================================
 */

/**
 * BASE DE DATOS LOCAL
 * Objeto que contiene todas las categorías y sus palabras.
 * 
 * ESTRUCTURA DE CADA ELEMENTO:
 * - id: Identificador único (ej: 'a1', 'f1')
 * - word: Palabra en mayúsculas (ej: 'PERRO')
 * - syllables: Sílabas separadas por guiones (ej: 'Pe-rro')
 *              IMPORTANTE: Usar guiones, NO espacios
 *              ✅ Correcto: 'Pe-rro', 'Ma-má', 'E-le-fan-te'
 *              ❌ Incorrecto: 'Pe rro', 'Ma má', 'E le fan te'
 * - img: URL de la imagen (Cloudinary o local)
 * - audio: Nombre del archivo MP3 para pronunciación (ej: 'perro.mp3')
 *          Se busca en la carpeta 'audio/'
 * - syllableAudio: (OPCIONAL) Nombre del archivo MP3 para las sílabas (ej: 'gato_silabas.mp3')
 *                  Si se define, REEMPLAZA al TTS automático para las sílabas.
 *                  Ideal para corregir pronunciaciones como "Ga-tu" -> "Ga-to".
 * - sound: Nombre del archivo MP3 para sonido asociado (ej: 'ladrido.mp3')
 *          Se busca en la carpeta 'audio/'
 * 
 * EJEMPLO DE USO CON SONIDOS REALES:
 * Para PERRO:
 *   - audio: 'perro.mp3' → Se reproduce desde 'audio/perro.mp3' (pronunciación)
 *   - sound: 'ladrido.mp3' → Se reproduce desde 'audio/ladrido.mp3' (sonido del animal)
 * 
 * NOTA: Si los archivos MP3 no existen, el código usará Síntesis de Voz (TTS) como fallback.
 * 
 * UBICACIÓN DE ARCHIVOS:
 * Todos los archivos de audio deben estar en: /audio/
 * Ejemplo: /audio/ladrido.mp3, /audio/beso.mp3, etc.
 */
/**
 * ============================================================================
 * BASE DE DATOS DE CARTAS - GUÍA COMPLETA PARA AGREGAR MÁS CARTAS
 * ============================================================================
 * 
 * ESTRUCTURA DE UNA CARTA:
 * ------------------------
 * {
 *   id: 'a1',                    // ID único (formato: prefijo + número)
 *   word: 'PERRO',               // Palabra en MAYÚSCULAS
 *   syllables: 'Pe-rro',         // Sílabas separadas por guiones
 *   img: 'url-de-imagen.jpg',   // URL de la imagen (Cloudinary o local)
 *   audio: 'perro.mp3',          // Audio de pronunciación (opcional)
 *   syllableAudio: 'silabas.mp3', // Audio de sílabas personalizado (opcional)
 *   sound: 'ladrido.mp3'         // Sonido asociado (opcional)
 * }
 * 
 * CÓMO AGREGAR UNA NUEVA CARTA:
 * ------------------------------
 * 1. Elige la categoría (animales, frutas, objetos, familia, cuerpo)
 * 2. Agrega un nuevo objeto con el formato de arriba
 * 3. Usa un ID único (ej: 'a6' para animales, 'f4' para frutas)
 * 4. Asegúrate de que las sílabas estén separadas por guiones
 * 
 * EJEMPLO - Agregar un nuevo animal (CABALLO):
 * ---------------------------------------------
 * animales: [
 *   ...cartas existentes...,
 *   { 
 *     id: 'a6', 
 *     word: 'CABALLO', 
 *     syllables: 'Ca-ba-llo', 
 *     img: 'https://ejemplo.com/caballo.jpg', 
 *     audio: 'caballo.mp3', 
 *     sound: 'relincho.mp3' 
 *   }
 * ]
 * 
 * PREFIJOS DE ID POR CATEGORÍA:
 * ------------------------------
 * - animales: 'a1', 'a2', 'a3'...
 * - frutas: 'f1', 'f2', 'f3'...
 * - objetos: 'o1', 'o2', 'o3'...
 * - familia: 'fa1', 'fa2', 'fa3'...
 * - cuerpo: 'c1', 'c2', 'c3'...
 * 
 * IMPORTANTE:
 * -----------
 * - Los juegos funcionan automáticamente con cualquier cantidad de cartas
 * - No necesitas modificar el código de los juegos
 * - Solo agrega más objetos al array de la categoría
 * - El sistema selecciona automáticamente las opciones correctas
 * 
 * ============================================================================
 */

const database = {
    animales: [
        { id: 'a1', word: 'PERRO', syllables: 'Pe-rro', img: "https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769318203/c9f1a4a9-3c85-42b7-8e9b-c50b2c8bbf5d_mqnncc.jpg", audio: 'perro.mp3', syllableAudio: 'si_perro.mp3', sound: 'ladrido.mp3' },
        { id: 'a2', word: 'GATO', syllables: 'Ga-to', img: 'https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769356145/Ga_to_s4sk6q.png', audio: 'gato.mp3', syllableAudio: 'si_gato.mp3', sound: 'maullido.mp3' },
        { id: 'a3', word: 'LEÓN', syllables: 'Le-ón', img: 'https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769357944/leon_gaoqlw.png', audio: 'leon.mp3', syllableAudio: 'si_leon.mp3', sound: 'rugido.mp3' },
        { id: 'a4', word: 'VACA', syllables: 'Va-ca', img: 'https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769358689/vaca_ou1qrc.png', audio: 'vaca.mp3', syllableAudio: 'si_vaca.mp3', sound: 'mugido.mp3' },
        { id: 'a5', word: 'ELEFANTE', syllables: 'E-le-fan-te', img: 'https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769359512/elefante_xn89db.png', audio: 'elefante.mp3', syllableAudio: 'si_elefante.mp3', sound: 'trompeta.mp3' },
        { id: 'a6', word: 'CABALLO', syllables: 'Ca-ba-llo', img: 'https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769477981/caballo_ncu73d.png', audio: 'caballo.mp3', syllableAudio: 'si_caballo.mp3', sound: 'relinchido.mp3' },
        { id: 'a7', word: 'OSO', syllables: 'O-so', img: 'https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769477978/oso_jwd0ps.png', audio: 'oso.mp3', syllableAudio: 'si_oso.mp3', sound: 'gruñido.mp3' },
        { id: 'a8', word: 'PATO', syllables: 'Pa-to', img: 'https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769477975/pato_cqsqt9.png', audio: 'pato.mp3', syllableAudio: 'si_pato.mp3', sound: 'graznido.mp3' },
        { id: 'a9', word: 'CONEJO', syllables: 'Co-ne-jo', img: 'https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769477972/conejo_m9628k.png', audio: 'conejo.mp3', syllableAudio: 'si_conejo.mp3', sound: 'saltar.mp3' },
        { id: 'a10', word: 'OVEJA', syllables: 'O-ve-ja', img: 'https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769477969/oveja_tqnvtu.png', audio: 'oveja.mp3', syllableAudio: 'si_oveja.mp3', sound: 'balido.mp3' },
        { id: 'a11', word: 'CERDO', syllables: 'Cer-do', img: 'https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769477966/cerdo_cipw8n.png', audio: 'cerdo.mp3', syllableAudio: 'si_cerdo.mp3', sound: 'gruñido_1.mp3' },
        { id: 'a12', word: 'GALLINA', syllables: 'Ga-lli-na', img: 'https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769477964/gallina_bfu2lg.png', audio: 'gallina.mp3', syllableAudio: 'si_gallina.mp3', sound: 'cacareo.mp3' },
        { id: 'a13', word: 'TIGRE', syllables: 'Ti-gre', img: 'https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769477960/tigre_gj6emn.png', audio: 'tigre.mp3', syllableAudio: 'si_tigre.mp3', sound: 'rugido_1.mp3' },
        { id: 'a14', word: 'MONO', syllables: 'Mo-no', img: 'https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769477957/mono_hkhmjz.png', audio: 'mono.mp3', syllableAudio: 'si_mono.mp3', sound: 'grito.mp3' },
        { id: 'a15', word: 'PEZ', syllables: 'Pez', img: 'https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769477955/pez_strc2v.png', audio: 'pez.mp3', syllableAudio: 'si_pez.mp3', sound: 'burbujas.mp3' }
    ],
    frutas: [
        { id: 'f1', word: 'MANZANA', syllables: 'Man-za-na', img: 'https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769360863/manzana_rfmuy6.png', audio: 'manzana.mp3', syllableAudio: 'si_manzana.mp3', sound: 'mordisco.mp3' },
        { id: 'f2', word: 'UVAS', syllables: 'U-vas', img: 'https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769361083/uvas_rkjqqv.png', audio: 'uva.mp3', syllableAudio: 'si_uva.mp3', sound: 'pop.mp3' },
        { id: 'f3', word: 'BANANA', syllables: 'Ba-na-na', img: 'https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769361277/Banana_k6w6vd.png', audio: 'banana.mp3', syllableAudio: 'si_banana.mp3', sound: 'corte.mp3' },
        { id: 'f4', word: 'NARANJA', syllables: 'Na-ran-ja', img: 'https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769477952/naranja_ljwmzc.png', audio: 'naranja.mp3', syllableAudio: 'si_naranja.mp3', sound: 'exprimir.mp3' },
        { id: 'f5', word: 'FRESA', syllables: 'Fre-sa', img: 'https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769477949/fresa_yte9gt.png', audio: 'fresa.mp3', syllableAudio: 'si_fresa.mp3', sound: 'mordisco.mp3' },
        { id: 'f6', word: 'SANDÍA', syllables: 'San-dí-a', img: 'https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769477946/sandia_q3c4vp.png', audio: 'sandia.mp3', syllableAudio: 'si_sandia.mp3', sound: 'corte.mp3' },
        { id: 'f7', word: 'PIÑA', syllables: 'Pi-ña', img: 'https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769477943/pi%C3%B1a_tlvg6v.png', audio: 'piña.mp3', syllableAudio: 'si_piña.mp3', sound: 'corte.mp3' },
        { id: 'f8', word: 'MELÓN', syllables: 'Me-lón', img: 'https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769477940/melon_gj4ix3.png', audio: 'melon.mp3', syllableAudio: 'si_melon.mp3', sound: 'corte.mp3' },
        { id: 'f9', word: 'PERA', syllables: 'Pe-ra', img: 'https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769477936/pera_zbabi1.png', audio: 'pera.mp3', syllableAudio: 'si_pera.mp3', sound: 'mordisco.mp3' },
        { id: 'f10', word: 'CEREZA', syllables: 'Ce-re-za', img: 'https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769477934/cereza_ofoth8.png', audio: 'cereza.mp3', syllableAudio: 'si_cereza.mp3', sound: 'pop.mp3' },
        { id: 'f11', word: 'LIMÓN', syllables: 'Li-món', img: 'https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769477931/limon_rgkfgc.png', audio: 'limon.mp3', syllableAudio: 'si_limon.mp3', sound: 'exprimir.mp3' },
        { id: 'f12', word: 'KIWI', syllables: 'Ki-wi', img: 'https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769477928/kiwi_zvzyfr.png', audio: 'kiwi.mp3', syllableAudio: 'si_kiwi.mp3', sound: 'corte.mp3' }
    ],
    objetos: [
        { id: 'o1', word: 'AUTO', syllables: 'Au-to', img: 'https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769361888/auto_dzz4x1.png', audio: 'auto.mp3', syllableAudio: 'si_auto.mp3', sound: 'motor.mp3' },
        { id: 'o2', word: 'PELOTA', syllables: 'Pe-lo-ta', img: 'https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769362147/pelota_kbtwce.png', audio: 'pelota.mp3', syllableAudio: 'si_pelota.mp3', sound: 'rebote.mp3' },
        { id: 'o3', word: 'LIBRO', syllables: 'Li-bro', img: 'https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769362424/libro_bpjbuz.png', audio: 'libro.mp3', syllableAudio: 'si_libro.mp3', sound: 'hojas.mp3' },
        { id: 'o4', word: 'CASA', syllables: 'Ca-sa', img: 'https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769477925/casa_bwsbmb.png', audio: 'casa.mp3', syllableAudio: 'si_casa.mp3', sound: 'puerta.mp3' },
        { id: 'o5', word: 'MESA', syllables: 'Me-sa', img: 'https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769477922/mesa_poxqyk.png', audio: 'mesa.mp3', syllableAudio: 'si_mesa.mp3', sound: 'golpe.mp3' },
        { id: 'o6', word: 'SILLA', syllables: 'Si-lla', img: 'https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769477919/silla_mzfbwb.png', audio: 'silla.mp3', syllableAudio: 'si_silla.mp3', sound: 'arrastrar.mp3' },
        { id: 'o7', word: 'JUGUETE', syllables: 'Ju-gue-te', img: 'https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769477917/juguete_nxuqrx.png', audio: 'juguete.mp3', syllableAudio: 'si_juguete.mp3', sound: 'sonido.mp3' },
        { id: 'o8', word: 'BICICLETA', syllables: 'Bi-ci-cle-ta', img: 'https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769477914/bicicleta_odl55e.png', audio: 'bicicleta.mp3', syllableAudio: 'si_bicicleta.mp3', sound: 'pedal.mp3' },
        { id: 'o9', word: 'AVIÓN', syllables: 'A-vi-ón', img: 'https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769477911/avion_l9xtmb.png', audio: 'avion.mp3', syllableAudio: 'si_avion.mp3', sound: 'motor.mp3' },
        { id: 'o10', word: 'BARCO', syllables: 'Bar-co', img: 'https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769479054/barco_bxpuri.jpg', audio: 'barco.mp3', syllableAudio: 'si_barco.mp3', sound: 'silbato.mp3' },
        { id: 'o11', word: 'TREN', syllables: 'Tren', img: 'https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769477908/tren_mqropj.png', audio: 'tren.mp3', syllableAudio: 'si_tren.mp3', sound: 'silbato.mp3' },
        { id: 'o12', word: 'GLOBO', syllables: 'Glo-bo', img: 'https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769477906/globo_eqmlat.png', audio: 'globo.mp3', syllableAudio: 'si_globo.mp3', sound: 'pop_1.mp3' }
    ],
    familia: [
        { id: 'fa1', word: 'MAMÁ', syllables: 'Ma-má', img: 'https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769363978/ma_zw56t4.png', audio: 'mama.mp3', syllableAudio: 'si_mama.mp3', sound: 'beso.mp3' },
        { id: 'fa2', word: 'PAPÁ', syllables: 'Pa-pá', img: 'https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769364425/papa_lqlps6.png', audio: 'papa.mp3', syllableAudio: 'si_papa.mp3', sound: 'risa.mp3' },
        { id: 'fa3', word: 'ABUELO', syllables: 'A-bue-lo', img: 'https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769477887/abuelo_yt8abn.png', audio: 'abuelo.mp3', syllableAudio: 'si_abuelo.mp3', sound: 'risa.mp3' },
        { id: 'fa4', word: 'ABUELA', syllables: 'A-bue-la', img: 'https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769477890/abuela_vltv2i.png', audio: 'abuela.mp3', syllableAudio: 'si_abuela.mp3', sound: 'beso.mp3' },
        { id: 'fa5', word: 'HERMANO', syllables: 'Her-ma-no', img: 'https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769477884/hermano_mmxmmt.png', audio: 'hermano.mp3', syllableAudio: 'si_hermano.mp3', sound: 'risa_1.mp3' },
        { id: 'fa6', word: 'HERMANA', syllables: 'Her-ma-na', img: 'https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769477881/hermana_e3gt1u.png', audio: 'hermana.mp3', syllableAudio: 'si_hermana.mp3', sound: 'risa_1.mp3' },
        { id: 'fa7', word: 'BEBÉ', syllables: 'Be-bé', img: 'https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769477892/bebe_jvigde.png', audio: 'bebe.mp3', syllableAudio: 'si_bebe.mp3', sound: 'llanto.mp3' },
        { id: 'fa8', word: 'TÍO', syllables: 'Tí-o', img: 'https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769477895/tio_majuyv.png', audio: 'tio.mp3', syllableAudio: 'si_tio.mp3', sound: 'risa_1.mp3' },
        { id: 'fa9', word: 'TÍA', syllables: 'Tí-a', img: 'https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769477898/tia_hdzmbq.png', audio: 'tia.mp3', syllableAudio: 'si_tia.mp3', sound: 'beso.mp3' },
        { id: 'fa10', word: 'PRIMO', syllables: 'Pri-mo', img: 'https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769477900/primo_d8fvg9.png', audio: 'primo.mp3', syllableAudio: 'si_primo.mp3', sound: 'risa_1.mp3' },
        { id: 'fa11', word: 'PRIMA', syllables: 'Pri-ma', img: 'https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769477903/prima_buunhd.png', audio: 'prima.mp3', syllableAudio: 'si_prima.mp3', sound: 'risa_1.mp3' }
    ],
    cuerpo: [
        { id: 'c1', word: 'MANO', syllables: 'Ma-no', img: 'https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769364688/mano_t2t5b3.png', audio: 'mano.mp3', syllableAudio: 'si_mano.mp3', sound: 'aplausos.mp3' },
        { id: 'c2', word: 'PIE', syllables: 'Pie', img: 'https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769365013/pie_neeumh.png', audio: 'pie.mp3', syllableAudio: 'si_pie.mp3', sound: 'pisada.mp3' },
        { id: 'c3', word: 'CABEZA', syllables: 'Ca-be-za', img: 'https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769477858/cabeza_akkoxo.png', audio: 'cabeza.mp3', syllableAudio: 'si_cabeza.mp3', sound: 'golpe.mp3' },
        { id: 'c4', word: 'OJO', syllables: 'O-jo', img: 'https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769477856/ojo_nfztem.png', audio: 'ojo.mp3', syllableAudio: 'si_ojo.mp3', sound: 'parpadeo.mp3' },
        { id: 'c5', word: 'NARIZ', syllables: 'Na-riz', img: 'https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769477879/nariz_ynhbca.png', audio: 'nariz.mp3', syllableAudio: 'si_nariz.mp3', sound: 'respirar.mp3' },
        { id: 'c6', word: 'BOCA', syllables: 'Bo-ca', img: 'https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769477876/boca_sgfjab.png', audio: 'boca.mp3', syllableAudio: 'si_boca.mp3', sound: 'beso.mp3' },
        { id: 'c7', word: 'OREJA', syllables: 'O-re-ja', img: 'https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769477873/oreja_cfs2vs.png', audio: 'oreja.mp3', syllableAudio: 'si_oreja.mp3', sound: 'sonido.mp3' },
        { id: 'c8', word: 'BRAZO', syllables: 'Bra-zo', img: 'https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769477871/brazo_ybqijm.png', audio: 'brazo.mp3', syllableAudio: 'si_brazo.mp3', sound: 'movimiento.mp3' },
        { id: 'c9', word: 'PIERNA', syllables: 'Pier-na', img: 'https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769477867/pierna_hncgkn.png', audio: 'pierna.mp3', syllableAudio: 'si_pierna.mp3', sound: 'pisada.mp3' },
        { id: 'c10', word: 'DEDO', syllables: 'De-do', img: 'https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769477866/dedo_g2kijs.png', audio: 'dedo.mp3', syllableAudio: 'si_dedo.mp3', sound: 'toque.mp3' },
        { id: 'c11', word: 'RODILLA', syllables: 'Ro-di-lla', img: 'https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769477860/rodilla_itb8lj.png', audio: 'rodilla.mp3', syllableAudio: 'si_rodilla.mp3', sound: 'golpe.mp3' },
        { id: 'c12', word: 'HOMBRO', syllables: 'Hom-bro', img: 'https://res.cloudinary.com/dfn5g9ve3/image/upload/v1769477863/hombro_iin1ul.png', audio: 'hombro.mp3', syllableAudio: 'si_hombro.mp3', sound: 'movimiento.mp3' }
    ]
};

/**
 * OBJETO PRINCIPAL DE LA APLICACIÓN
 * Contiene toda la lógica de control (Controlador en MVC).
 */
const app = {
    // Estado de la aplicación
    currentCategory: null, // Array de palabras actual
    currentIndex: 0,       // Índice de la tarjeta actual
    stars: 0,              // Contador de estrellas
    recognition: null,     // Instancia de Web Speech API
    gameMode: 0,           // 1 = Encuentra palabra, 2 = Escucha y elige, 3 = Memoria, 4 = Ordena sílabas
    gameTarget: null,      // Palabra correcta en el juego actual
    gameScore: 0,          // Puntuación del juego actual
    gamePairs: [],         // Pares para el juego de memoria
    gameFlippedCards: [], // Cartas volteadas en memoria
    gameMatchedPairs: 0,  // Pares encontrados en memoria

    // Control de audio - Para detener sonidos anteriores
    currentAudioTimeouts: [], // Array de timeouts activos
    currentAudioObjects: [],  // Array de objetos Audio activos

    // Estado de UI
    isImageHidden: false, // Controla si la imagen está oculta


    /**
     * INICIALIZACIÓN
     * Se ejecuta cuando el DOM está listo.
     */
    init: function () {
        // Cargar estrellas persistentes del localStorage
        const savedStars = localStorage.getItem('palabraVivaStars');
        if (savedStars) {
            this.stars = parseInt(savedStars);
            this.updateStarDisplay();
        }

        // Configurar Reconocimiento de Voz (Web Speech API)
        // Verificamos compatibilidad con Chrome (webkit) y estándar
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            // Español latinoamericano (es-MX para México, es-US para Latinoamérica general)
            this.recognition.lang = 'es-MX';       // Idioma español latino
            this.recognition.interimResults = false; // Solo resultado final
            this.recognition.maxAlternatives = 1;    // Una mejor alternativa

            // Eventos del Reconocimiento de Voz
            this.recognition.onstart = () => {
                const btn = document.getElementById('btn-mic');
                btn.style.background = '#ee5253'; // Rojo cuando escucha
                btn.textContent = '👂 Escuchando...';
            };

            this.recognition.onend = () => {
                const btn = document.getElementById('btn-mic');
                btn.style.background = '#54a0ff'; // Volver a azul
                btn.textContent = '🎤 Ahora dilo tú';
            };

            this.recognition.onresult = (event) => {
                // Obtener lo que dijo el niño
                const speechResult = event.results[0][0].transcript.toUpperCase();
                this.checkVoice(speechResult);
            };

            this.recognition.onerror = (event) => {
                this.showToast('No te escuché bien, inténtalo de nuevo', 'info');
            };
        } else {
            // Ocultar botón de micrófono si no es compatible (ej. Firefox por defecto)
            document.getElementById('btn-mic').style.display = 'none';
            console.warn("Web Speech API no soportada en este navegador.");
        }
    },

    // --- SISTEMA DE NAVEGACIÓN ---

    /**
     * Cambia entre las diferentes pantallas (Home, Learn, Game).
     * Usa clases CSS para animar la transición.
     */
    showScreen: function (screenId) {
        // Ocultar todas las pantallas
        document.querySelectorAll('.screen').forEach(s => {
            s.classList.remove('active');
            s.classList.add('hidden');
        });

        // Mostrar la pantalla deseada con un pequeño delay para animación CSS
        const target = document.getElementById(screenId);
        target.classList.remove('hidden');
        setTimeout(() => {
            target.classList.add('active');
        }, 50);
    },

    goHome: function () {
        this.showScreen('screen-home');
    },

    /**
     * Carga una categoría específica en modo aprendizaje.
     * @param {string} catName - Clave del objeto 'database' (ej: 'animales')
     */
    /**
     * Carga una categoría específica en modo aprendizaje.
     * @param {string} catName - Clave del objeto 'database' (ej: 'animales')
     */
    loadCategory: function (catName) {
        this.currentCategory = database[catName];
        this.currentIndex = 0;

        // Optimización: Pre-cargar recursos para fluidez
        this.preloadCategoryAssets(this.currentCategory);

        this.renderCard();
        this.showScreen('screen-learn');
    },

    /**
     * Pre-carga imágenes y audios de la categoría en segundo plano.
     * Esto hace que la app se sienta más veloz (fluidz).
     */
    preloadCategoryAssets: function (items) {
        items.forEach(item => {
            // Pre-cargar Imagen
            const img = new Image();
            img.src = item.img;

            // Pre-cargar Audio (solo si es archivo local/remoto, no TTS)
            if (item.audio) new Audio(this.resolveAudioPath(item.audio));
            if (item.sound) new Audio(this.resolveAudioPath(item.sound));
        });
    },

    // --- MODO APRENDIZAJE (FLASHCARDS) ---

    /**
     * Renderiza la tarjeta actual en el DOM.
     */
    renderCard: function () {
        // Detener todos los audios y timeouts anteriores antes de cambiar de carta
        this.stopAllAudio();

        const item = this.currentCategory[this.currentIndex];

        // Efecto visual de rebote al cambiar
        const flashcard = document.getElementById('flashcard-element');
        flashcard.classList.remove('anim-pop');
        void flashcard.offsetWidth; // Forzar reflow para reiniciar animación CSS
        flashcard.classList.add('anim-pop');

        // Actualizar contenido
        const imgElement = document.getElementById('card-image');
        imgElement.src = item.img;

        // Aplicar estado oculto si corresponde
        if (this.isImageHidden) {
            imgElement.classList.add('hidden-img');
        } else {
            imgElement.classList.remove('hidden-img');
        }

        document.getElementById('card-word').textContent = item.word;
        document.getElementById('card-syllables').textContent = item.syllables;

        // Reproducir audio automáticamente al cargar tarjeta
        this.playCardAudio(item);
    },

    /**
     * Detiene todos los audios y cancela todos los timeouts activos.
     * Se llama automáticamente al cambiar de carta.
     */
    stopAllAudio: function () {
        // Detener TTS (Text-to-Speech) si está reproduciendo
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }

        // Detener todos los objetos Audio activos
        this.currentAudioObjects.forEach(audio => {
            try {
                audio.pause();
                audio.currentTime = 0;
            } catch (e) {
                console.log('Error al detener audio:', e);
            }
        });
        this.currentAudioObjects = [];

        // Cancelar todos los timeouts activos
        this.currentAudioTimeouts.forEach(timeoutId => {
            clearTimeout(timeoutId);
        });
        this.currentAudioTimeouts = [];
    },

    /**
     * Gestiona la reproducción de audio de una tarjeta.
     * 
     * FLUJO DE REPRODUCCIÓN:
     * 1. Pronunciación de la palabra (item.audio)
     * 2. Sílabas con pausa (después de 1.5 segundos)
     * 3. Sonido asociado (item.sound) después de 3 segundos
     * 
     * EJEMPLO CON PERRO:
     * - Reproduce 'audio/perro.mp3' (si existe) o dice "PERRO" con TTS en español latino
     * - Después de 1.5s: dice "Pe ... rro" (cada sílaba separada con pausa)
     * - Después de 3s: reproduce 'audio/ladrido.mp3' (si existe) o dice "Sonido de PERRO"
     * 
     * SISTEMA DE SÍLABAS:
     * -------------------
     * FORMATO EN BASE DE DATOS:
     * - Las sílabas deben estar separadas por guiones: 'Pe-rro', 'Ma-má', 'E-le-fan-te'
     * - Cada guion se convierte en una pausa clara al pronunciar
     * 
     * CÓMO FUNCIONA:
     * - 'Pe-rro' → se pronuncia como "Pe ... rro" (con pausa entre sílabas)
     * - 'E-le-fan-te' → se pronuncia como "E ... le ... fan ... te"
     * - Usa español latino (es-MX) para pronunciación natural
     * - Velocidad reducida (0.7) para mejor comprensión
     * 
     * CORRECCIÓN DE PROBLEMAS:
     * -------------------------
     * Si las sílabas no se escuchan bien:
     * 1. Verifica que las sílabas estén separadas por guiones: 'Pe-rro' ✅
     * 2. Asegúrate de que no haya espacios extra: 'Pe - rro' ❌
     * 3. Verifica que el formato sea correcto: 'Pe-rro' ✅, 'Pe rro' ❌
     * 
     * EJEMPLOS CORRECTOS:
     * - 'Pe-rro' ✅
     * - 'Ma-má' ✅
     * - 'E-le-fan-te' ✅
     * - 'Ba-na-na' ✅
     * - 'Ga-to' ✅ (se pronuncia correctamente como "ga-to", no "ga-tu")
     * - 'Au-to' ✅ (se pronuncia correctamente como "au-to", no "au-tu")
     * - 'Man-za-na' ✅ (se pronuncia como "man-za-na", no "man-z-a-na")
     * 
     * EJEMPLOS INCORRECTOS:
     * - 'Pe rro' ❌ (espacios en lugar de guiones)
     * - 'Pe-rro ' ❌ (espacios extra)
     * - 'Pe--rro' ❌ (guiones dobles)
     * 
     * NOTA: El código normaliza automáticamente las sílabas para mejor pronunciación:
     * - Primera letra en mayúscula, resto en minúscula
     * - Usa comas para pausas naturales entre sílabas
     * - Esto ayuda a que el TTS pronuncie correctamente "to" en lugar de "tu"
     * 
     * @param {Object} item - Objeto de la palabra desde database (ej: {word: 'PERRO', audio: 'perro.mp3', sound: 'ladrido.mp3'})
     * 
     * UBICACIÓN DE ARCHIVOS:
     * - Los archivos se buscan en: 'audio/[nombre-archivo].mp3'
     * - Ejemplo: 'audio/ladrido.mp3' para el sonido de PERRO
     * - Si el archivo no existe, se usa TTS (Text-to-Speech) como fallback
     */
    /**
     * Gestiona la reproducción de audio SECUENCIAL y FLUIDA.
     * Usa eventos 'ended' en lugar de tiempos fijos para evitar errores.
     */
    playCardAudio: function (item) {
        // Detener cualquier audio previo
        this.stopAllAudio();

        // --- DEFINICIÓN DE LA SECUENCIA ---

        // 1. Audio de la Palabra
        const playWord = () => {
            return new Promise((resolve) => {
                if (item.audio) {
                    const audio = new Audio(this.resolveAudioPath(item.audio));
                    this.currentAudioObjects.push(audio);
                    audio.onended = resolve;
                    audio.onerror = () => {
                        console.warn('Audio palabra error/missing, usando TTS');
                        this.speak(item.word);
                        // TTS no tiene evento 'ended' nativo fácil, simulamos duración
                        setTimeout(resolve, 1000);
                    };
                    audio.play().catch(e => {
                        this.speak(item.word);
                        setTimeout(resolve, 1000);
                    });
                } else {
                    this.speak(item.word);
                    setTimeout(resolve, 1000);
                }
            });
        };

        // 2. Audio de Sílabas
        const playSyllables = () => {
            return new Promise((resolve) => {
                // Pequeña pausa antes de las sílabas
                const pauseId = setTimeout(() => {
                    if (item.syllableAudio) {
                        const audio = new Audio(this.resolveAudioPath(item.syllableAudio));
                        this.currentAudioObjects.push(audio);
                        audio.onended = resolve;
                        audio.onerror = () => {
                            this.speakSyllablesTTS(item.syllables);
                            setTimeout(resolve, 2000); // Estimado para sílabas
                        };
                        audio.play().catch(() => {
                            this.speakSyllablesTTS(item.syllables);
                            setTimeout(resolve, 2000);
                        });
                    } else {
                        this.speakSyllablesTTS(item.syllables);
                        setTimeout(resolve, 2000);
                    }
                }, 500); // Pausa de 0.5s entre palabra y sílabas
                this.currentAudioTimeouts.push(pauseId);
            });
        };

        // 3. Efecto de Sonido
        const playSoundEffect = () => {
            // Pausa antes del efecto
            const pauseId = setTimeout(() => {
                if (item.sound) {
                    const audio = new Audio(this.resolveAudioPath(item.sound));
                    this.currentAudioObjects.push(audio);
                    audio.volume = 0.6; // Un poco más suave
                    audio.play().catch(e => console.log("Sin efecto de sonido"));
                }
            }, 500);
            this.currentAudioTimeouts.push(pauseId);
        };

        // --- EJECUCIÓN EN CADENA (Promesas) ---
        // Esto asegura que NO haya superposición y sea fluido
        playWord()
            .then(() => playSyllables())
            .then(() => playSoundEffect())
            .catch(err => console.error("Error en secuencia de audio:", err));
    },

    replayAudio: function () {
        // Detener todos los audios anteriores antes de repetir
        this.stopAllAudio();
        const item = this.currentCategory[this.currentIndex];
        this.playCardAudio(item);
    },

    nextCard: function () {
        if (this.currentIndex < this.currentCategory.length - 1) {
            this.currentIndex++;
            this.renderCard();
        } else {
            this.showToast("¡Llegaste al final de la categoría!", "success");
        }
    },

    prevCard: function () {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.renderCard();
        }
    },

    // --- AUDIO Y VOZ (SPEECH API) ---

    /**
     * Función wrapper para usar SpeechSynthesisUtterance.
     * 
     * CONFIGURACIÓN DE IDIOMA:
     * - 'es-MX' = Español de México (Latinoamérica)
     * - 'es-ES' = Español de España
     * - 'es-US' = Español de Estados Unidos (Latinoamérica)
     * 
     * @param {string} text - Texto a decir.
     * @param {object} options - Opciones:
     *   - rate: Velocidad (0.1 a 10, default: 0.9)
     *   - lang: Idioma (default: 'es-MX' para español latino)
     *   - pitch: Tono (0 a 2, default: 1)
     */
    speak: function (text, options = {}) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            // Español latino por defecto (México)
            utterance.lang = options.lang || 'es-MX';
            utterance.rate = options.rate || 0.9; // Un poco más lento para niños
            utterance.pitch = options.pitch || 1; // Tono normal

            window.speechSynthesis.speak(utterance);
        }
    },

    startListening: function () {
        if (this.recognition) {
            try {
                this.recognition.start();
            } catch (e) {
                // A veces el API lanza error si ya está iniciado
                console.log("Reiniciando reconocimiento...");
                this.recognition.stop();
            }
        } else {
            this.showToast("Tu navegador no soporta comandos de voz.", "error");
        }
    },

    /**
     * Compara lo que dijo el niño con la palabra objetivo.
     * @param {string} spokenText - Texto reconocido por el navegador.
     */
    checkVoice: function (spokenText) {
        const target = this.currentCategory[this.currentIndex].word;

        // Validación simple: ¿contiene la palabra?
        if (spokenText.includes(target) || target.includes(spokenText)) {
            this.showToast("⭐ ¡Muy bien! ¡Perfecto!", "success");
            this.playVictorySound();
            this.createConfetti();
            this.addStar();
        } else {
            const errorMessages = [
                "💛 Casi, inténtalo otra vez",
                "🤔 Muy cerca, escucha otra vez",
                "💪 Sigue intentando, tú puedes",
                "🌟 Casi lo tienes, otra vez"
            ];
            const randomMessage = errorMessages[Math.floor(Math.random() * errorMessages.length)];
            this.showToast(randomMessage, "error");
            this.playErrorSound();
            this.speak("Oh, no. Inténtalo de nuevo");
            setTimeout(() => {
                this.playCardAudio(this.currentCategory[this.currentIndex]);
            }, 1500);
        }
    },

    // --- AUDIO Y VOZ (SPEECH API) ---

    /**
     * Resuelve la ruta del audio.
     * Soporta archivos locales en carpeta 'audio/' y URLs externas completas.
     * @param {string} path - Nombre de archivo (ej: 'perro.mp3') o URL (ej: 'https://...')
     */
    resolveAudioPath: function (path) {
        if (!path) return '';
        // Si empieza con http:// o https://, es una URL externa
        if (path.startsWith('http://') || path.startsWith('https://')) {
            return path;
        }
        // Si no, asumimos que es un archivo local en la carpeta audio/
        // Aseguramos que no tenga 'audio/' duplicado si el usuario lo pone por error
        if (path.startsWith('audio/')) {
            return path;
        }
        return 'audio/' + path;
    },

    /**
     * Helper para pronunciar sílabas usando TTS (Text-to-Speech).
     * Se usa como fallback cuando no hay audio personalizado o falla al cargar.
     */
    speakSyllablesTTS: function (syllablesString) {
        // Dividir las sílabas y normalizarlas
        const syllablesArray = syllablesString.split('-').map(s => s.trim());

        // Formatear para mejor pronunciación:
        // - Primera letra en mayúscula, resto en minúscula para cada sílaba
        // - Usar comas para pausas naturales
        const normalizedSyllables = syllablesArray.map(syllable => {
            return syllable.charAt(0).toUpperCase() + syllable.slice(1).toLowerCase();
        });

        // Unir con comas y espacios para pausas naturales
        const syllablesText = normalizedSyllables.join(', ');

        // Pronunciar con velocidad moderada y pausas claras
        this.speak(syllablesText, { rate: 0.8, lang: 'es-MX' });
    },

    toggleImage: function () {
        this.isImageHidden = !this.isImageHidden;
        const imgElement = document.getElementById('card-image');
        const btnToggle = document.querySelector('.btn-toggle-img');

        if (this.isImageHidden) {
            imgElement.classList.add('hidden-img');
            btnToggle.textContent = '🙈'; // Icono de "no ver"
            this.showToast('Imagen oculta - ¡Lee la palabra!', 'info');
        } else {
            imgElement.classList.remove('hidden-img');
            btnToggle.textContent = '👁️'; // Icono de ver
        }
    },

    // --- JUEGOS ---

    startGameMenu: function () {
        this.showScreen('screen-game-menu');
    },

    /**
     * Inicia un juego específico.
     * @param {number} mode - 1 para "Encuentra", 2 para "Escucha".
     */
    startGame: function (mode) {
        this.gameMode = mode;
        this.showScreen('screen-game-play');
        this.nextRound();
    },

    /**
     * ============================================================================
     * SISTEMA DE JUEGOS - ESCALABLE PARA CUALQUIER CANTIDAD DE CARTAS
     * ============================================================================
     * 
     * FUNCIONAMIENTO:
     * ---------------
     * Los juegos funcionan automáticamente con cualquier cantidad de cartas.
     * El sistema selecciona automáticamente las opciones correctas sin importar
     * cuántas cartas tenga la categoría.
     * 
     * MODOS DE JUEGO:
     * ---------------
     * 1 = Encuentra la palabra (3 opciones: 1 correcta + 2 distractores)
     * 2 = Escucha y elige (3 opciones: 1 correcta + 2 distractores)
     * 3 = Memoria (encuentra pares de cartas)
     * 4 = Ordena las sílabas (ordena las sílabas de una palabra)
     * 
     * CÓMO FUNCIONA LA SELECCIÓN DE OPCIONES:
     * ----------------------------------------
     * - Si hay 3 o más cartas: Selecciona 2 distractores aleatorios
     * - Si hay 2 cartas: Selecciona 1 distractor
     * - Si hay 1 carta: Solo muestra esa carta (modo aprendizaje)
     * 
     * ============================================================================
     */

    nextRound: function () {
        // SAFETY: Verificar que hay categoría seleccionada (excepto para juego 6 que es global)
        if (!this.currentCategory && this.gameMode !== 6) {
            console.warn("No hay categoría seleccionada, volviendo a Home");
            this.goHome();
            return;
        }

        const optionsContainer = document.getElementById('game-options-container');
        optionsContainer.innerHTML = '';

        // Redirigir según el modo de juego
        if (this.gameMode === 3) {
            this.startMemoryGame();
            return;
        }
        if (this.gameMode === 4) {
            this.startSyllableGame();
            return;
        }
        if (this.gameMode === 5) {
            this.startSpellingGame();
            return;
        }
        if (this.gameMode === 6) {
            this.startClassificationGame();
            return;
        }

        // Juegos 1 y 2: Encuentra palabra / Escucha y elige
        // 1. Seleccionar palabra correcta al azar
        const randomIndex = Math.floor(Math.random() * this.currentCategory.length);
        this.gameTarget = this.currentCategory[randomIndex];

        // 2. Seleccionar distractores (palabras incorrectas)
        // El sistema se adapta automáticamente a la cantidad de cartas disponibles
        let distractors = this.currentCategory.filter(item => item.id !== this.gameTarget.id);
        const numDistractors = Math.min(2, distractors.length); // Máximo 2, o menos si hay pocas cartas
        distractors = distractors.sort(() => 0.5 - Math.random()).slice(0, numDistractors);

        // 3. Mezclar respuestas (Correcta + Distractores)
        let roundOptions = [this.gameTarget, ...distractors];
        roundOptions.sort(() => 0.5 - Math.random());

        // 4. Renderizar botones en el DOM
        roundOptions.forEach(opt => {
            const btn = document.createElement('div');
            btn.className = 'game-option';
            btn.innerHTML = `
                <img src="${opt.img}" alt="${opt.word}">
                <div style="font-weight:bold; font-size:1.2rem;">${opt.word}</div>
            `;
            btn.onclick = () => this.checkGameAnswer(opt);
            optionsContainer.appendChild(btn);
        });

        // 5. Dar instrucciones según el modo de juego
        const instruction = document.getElementById('game-instruction');
        if (this.gameMode === 1) {
            instruction.innerHTML = `🧩 ¿Dónde está <b>${this.gameTarget.word}</b>?`;
            this.speak("¿Dónde está " + this.gameTarget.word + "?");
        } else if (this.gameMode === 2) {
            instruction.innerHTML = `👂 Escucha y toca la imagen correcta`;
            // Retraso para que el niño lea "Escucha"
            setTimeout(() => {
                this.speak("Toca... " + this.gameTarget.word);
            }, 1000);
        }
    },

    checkGameAnswer: function (selectedItem) {
        if (selectedItem.id === this.gameTarget.id) {
            this.showToast("¡Correcto! 🎉", "success");
            this.playVictorySound();
            this.createConfetti();
            this.addStar();
            this.speak("¡Muy bien!");
            // Pausa breve antes de la siguiente ronda
            setTimeout(() => this.nextRound(), 2000);
        } else {
            const errorMessages = [
                "😅 Casi, pero no es esa",
                "🤔 Inténtalo otra vez",
                "💪 Sigue intentando",
                "🌟 Casi lo tienes, otra vez",
                "🎯 Muy cerca, pero no es esa"
            ];
            const randomMessage = errorMessages[Math.floor(Math.random() * errorMessages.length)];
            this.showToast(randomMessage, "error");
            this.playErrorSound();
            this.speak("Oh, no. Inténtalo de nuevo");
        }
    },

    /**
     * ============================================================================
     * JUEGO 3: MEMORIA - Encuentra los pares
     * ============================================================================
     * 
     * FUNCIONAMIENTO:
     * ---------------
     * - Selecciona 6 cartas aleatorias de la categoría (o todas si hay menos)
     * - Crea pares de cada carta (imagen + palabra)
     * - El niño debe encontrar los pares volteando cartas
     * 
     * ESCALABILIDAD:
     * --------------
     * - Funciona con cualquier cantidad de cartas
     * - Si hay menos de 6 cartas, usa todas las disponibles
     * - Si hay más de 6, selecciona 6 al azar
     * 
     * ============================================================================
     */
    startMemoryGame: function () {
        const optionsContainer = document.getElementById('game-options-container');
        optionsContainer.innerHTML = '';
        optionsContainer.className = 'game-options memory-game';

        const instruction = document.getElementById('game-instruction');
        instruction.innerHTML = `🧠 Encuentra los pares de cartas`;
        this.speak("Encuentra los pares");

        // Seleccionar cartas para el juego (máximo 6, o todas si hay menos)
        const numCards = Math.min(6, this.currentCategory.length);
        const selectedCards = [...this.currentCategory]
            .sort(() => 0.5 - Math.random())
            .slice(0, numCards);

        // Crear pares: cada carta aparece 2 veces (imagen y palabra)
        this.gamePairs = [];
        selectedCards.forEach(card => {
            // Par 1: Imagen
            this.gamePairs.push({ ...card, type: 'image', pairId: card.id });
            // Par 2: Palabra
            this.gamePairs.push({ ...card, type: 'word', pairId: card.id });
        });

        // Mezclar los pares
        this.gamePairs.sort(() => 0.5 - Math.random());

        // Resetear estado del juego
        this.gameFlippedCards = [];
        this.gameMatchedPairs = 0;

        // Renderizar cartas
        this.gamePairs.forEach((pair, index) => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.dataset.index = index;
            card.dataset.pairId = pair.pairId;
            card.dataset.type = pair.type;
            card.innerHTML = '<div class="memory-card-back">?</div>';
            card.onclick = () => this.flipMemoryCard(index);
            optionsContainer.appendChild(card);
        });
    },

    flipMemoryCard: function (index) {
        const card = this.gamePairs[index];
        const cardElement = document.querySelector(`[data-index="${index}"]`);

        // Si la carta ya está volteada o emparejada, no hacer nada
        if (cardElement.classList.contains('flipped') || cardElement.classList.contains('matched')) {
            return;
        }

        // Voltear la carta
        cardElement.classList.add('flipped');
        if (card.type === 'image') {
            cardElement.innerHTML = `<img src="${card.img}" alt="${card.word}">`;
        } else {
            cardElement.innerHTML = `<div class="memory-word">${card.word}</div>`;
        }

        // Agregar a cartas volteadas
        this.gameFlippedCards.push({ index, card, element: cardElement });

        // Si hay 2 cartas volteadas, verificar si hacen par
        if (this.gameFlippedCards.length === 2) {
            setTimeout(() => this.checkMemoryPair(), 1000);
        }
    },

    checkMemoryPair: function () {
        const [card1, card2] = this.gameFlippedCards;

        // Verificar si hacen par (mismo pairId y diferente tipo)
        if (card1.card.pairId === card2.card.pairId && card1.card.type !== card2.card.type) {
            // ¡Par encontrado!
            card1.element.classList.add('matched');
            card2.element.classList.add('matched');
            this.gameMatchedPairs++;
            this.addStar();
            this.showToast("¡Par encontrado! 🎉", "success");
            this.playVictorySound();
            this.createConfetti();
            this.speak("¡Muy bien!");

            // Verificar si se completó el juego
            if (this.gameMatchedPairs === this.gamePairs.length / 2) {
                setTimeout(() => {
                    this.showToast("¡Completaste el juego! 🌟", "success");
                    this.playVictorySound();
                    this.createConfetti();
                    this.speak("¡Excelente! Completaste el juego");
                    setTimeout(() => this.nextRound(), 3000);
                }, 1000);
            }
        } else {
            // No hacen par, voltear de nuevo
            card1.element.classList.remove('flipped');
            card2.element.classList.remove('flipped');
            card1.element.innerHTML = '<div class="memory-card-back">?</div>';
            card2.element.innerHTML = '<div class="memory-card-back">?</div>';
            const errorMessages = [
                "😅 No hacen par, inténtalo otra vez",
                "🤔 Casi, pero no es ese par",
                "💪 Sigue intentando"
            ];
            const randomMessage = errorMessages[Math.floor(Math.random() * errorMessages.length)];
            this.showToast(randomMessage, "error");
            this.playErrorSound();
        }

        // Limpiar cartas volteadas
        this.gameFlippedCards = [];
    },

    /**
     * ============================================================================
     * JUEGO 4: ORDENA LAS SÍLABAS
     * ============================================================================
     * 
     * FUNCIONAMIENTO:
     * ---------------
     * - Selecciona una palabra aleatoria
     * - Mezcla las sílabas
     * - El niño debe ordenarlas correctamente
     * 
     * ESCALABILIDAD:
     * --------------
     * - Funciona con cualquier palabra de cualquier categoría
     * - Se adapta automáticamente al número de sílabas
     * 
     * ============================================================================
     */
    startSyllableGame: function () {
        const optionsContainer = document.getElementById('game-options-container');
        optionsContainer.innerHTML = '';
        optionsContainer.className = 'game-options syllable-game';

        // Seleccionar palabra aleatoria
        const randomIndex = Math.floor(Math.random() * this.currentCategory.length);
        this.gameTarget = this.currentCategory[randomIndex];

        const instruction = document.getElementById('game-instruction');
        instruction.innerHTML = `🔤 Ordena las sílabas de <b>${this.gameTarget.word}</b>`;
        this.speak("Ordena las sílabas de " + this.gameTarget.word);

        // Dividir sílabas y mezclarlas
        const syllables = this.gameTarget.syllables.split('-');
        const shuffledSyllables = [...syllables].sort(() => 0.5 - Math.random());

        // Resetear estado
        this.gameSelectedSyllables = [];
        this.gameCorrectOrder = syllables;

        // Renderizar sílabas mezcladas
        const syllablesContainer = document.createElement('div');
        syllablesContainer.className = 'syllables-container';
        syllablesContainer.id = 'syllables-container';

        shuffledSyllables.forEach((syllable, index) => {
            const btn = document.createElement('button');
            btn.className = 'syllable-btn';
            btn.textContent = syllable;
            btn.dataset.syllable = syllable;
            btn.dataset.originalIndex = syllables.indexOf(syllable);
            btn.onclick = () => this.selectSyllable(btn, syllable);
            syllablesContainer.appendChild(btn);
        });

        // Contenedor para sílabas seleccionadas
        const selectedContainer = document.createElement('div');
        selectedContainer.className = 'selected-syllables';
        selectedContainer.id = 'selected-syllables';
        selectedContainer.innerHTML = '<p>Ordena las sílabas aquí:</p>';

        // Botón de verificar
        const checkBtn = document.createElement('button');
        checkBtn.className = 'btn btn-primary';
        checkBtn.textContent = '✅ Verificar';
        checkBtn.onclick = () => this.checkSyllableOrder();

        optionsContainer.appendChild(selectedContainer);
        optionsContainer.appendChild(syllablesContainer);
        optionsContainer.appendChild(checkBtn);
    },

    selectSyllable: function (button, syllable) {
        // Si ya está seleccionada, no hacer nada
        if (button.classList.contains('selected')) {
            return;
        }

        // Marcar como seleccionada
        button.classList.add('selected');
        this.gameSelectedSyllables = this.gameSelectedSyllables || [];
        this.gameSelectedSyllables.push(syllable);

        // Agregar a contenedor de seleccionadas
        const selectedContainer = document.getElementById('selected-syllables');
        const span = document.createElement('span');
        span.className = 'selected-syllable';
        span.textContent = syllable;
        span.dataset.syllable = syllable;
        selectedContainer.appendChild(span);
    },

    checkSyllableOrder: function () {
        const selected = this.gameSelectedSyllables;
        const correct = this.gameCorrectOrder;

        // Verificar si el orden es correcto
        const isCorrect = selected.length === correct.length &&
            selected.every((syl, i) => syl === correct[i]);

        if (isCorrect) {
            this.showToast("¡Correcto! 🎉", "success");
            this.playVictorySound();
            this.createConfetti();
            this.addStar();
            this.speak("¡Muy bien! " + this.gameTarget.word);
            setTimeout(() => this.nextRound(), 2000);
        } else {
            const errorMessages = [
                "😅 Casi, pero no es ese orden",
                "🤔 Inténtalo otra vez",
                "💪 Sigue intentando",
                "🌟 Casi lo tienes, otra vez"
            ];
            const randomMessage = errorMessages[Math.floor(Math.random() * errorMessages.length)];
            this.showToast(randomMessage, "error");
            this.playErrorSound();
            this.speak("Oh, no. Inténtalo de nuevo");
            // Resetear selección
            this.gameSelectedSyllables = [];
            document.querySelectorAll('.syllable-btn').forEach(btn => btn.classList.remove('selected'));
            document.getElementById('selected-syllables').innerHTML = '<p>Ordena las sílabas aquí:</p>';
        }
    },

    // --- SISTEMA DE RECOMPENSAS Y UI ---

    /**
     * ============================================================================
     * JUEGO 5: COMPLETA LA PALABRA (SPELLING)
     * ============================================================================
     */
    startSpellingGame: function () {
        const optionsContainer = document.getElementById('game-options-container');
        optionsContainer.innerHTML = '';
        optionsContainer.className = 'game-options spelling-game';

        // 1. Elegir palabra aleatoria
        const randomIndex = Math.floor(Math.random() * this.currentCategory.length);
        this.gameTarget = this.currentCategory[randomIndex];
        const word = this.gameTarget.word;

        // 2. Instrucción
        const instruction = document.getElementById('game-instruction');
        instruction.innerHTML = `✍️ Completa la palabra: <br><img src="${this.gameTarget.img}" style="width:100px; border-radius:15px; margin-top:10px;">`;
        this.speak("Completa la palabra " + word);

        // 3. Lógica de huecos (ocultar 1 o 2 letras aleatorias)
        const indicesToHide = [];
        const numToHide = word.length > 3 ? 2 : 1;

        while (indicesToHide.length < numToHide) {
            const idx = Math.floor(Math.random() * word.length);
            // Evitar duplicados
            if (!indicesToHide.includes(idx)) indicesToHide.push(idx);
        }

        // 4. Renderizar Slots de la palabra
        const wordContainer = document.createElement('div');
        wordContainer.className = 'spelling-container';

        const slotsDiv = document.createElement('div');
        slotsDiv.className = 'word-slots';

        let correctLetters = [];

        for (let i = 0; i < word.length; i++) {
            const letter = word[i];
            const slot = document.createElement('div');

            if (indicesToHide.includes(i)) {
                slot.className = 'letter-slot empty';
                slot.dataset.correctLetter = letter;
                slot.dataset.index = i;
                slot.innerHTML = '_';
                correctLetters.push(letter);
            } else {
                slot.className = 'letter-slot';
                slot.innerHTML = letter;
            }
            slotsDiv.appendChild(slot);
        }
        wordContainer.appendChild(slotsDiv);

        // 5. Generar opciones
        const alphabet = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
        let options = [...correctLetters];

        // Agregar 3 distractores
        for (let i = 0; i < 3; i++) {
            options.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
        }
        options.sort(() => 0.5 - Math.random());

        const bankDiv = document.createElement('div');
        bankDiv.className = 'letter-bank';

        options.forEach(char => {
            const btn = document.createElement('button');
            btn.className = 'letter-btn';
            btn.textContent = char;
            btn.onclick = () => this.checkSpelling(char, btn);
            bankDiv.appendChild(btn);
        });

        wordContainer.appendChild(bankDiv);
        optionsContainer.appendChild(wordContainer);
    },

    checkSpelling: function (selectedChar, btnElement) {
        const emptySlots = document.querySelectorAll('.letter-slot.empty');
        if (emptySlots.length === 0) return;

        const firstSlot = emptySlots[0];
        const correctChar = firstSlot.dataset.correctLetter;

        if (selectedChar === correctChar) {
            firstSlot.innerHTML = selectedChar;
            firstSlot.classList.remove('empty');
            firstSlot.classList.add('filled');
            this.playVictorySound();
            btnElement.style.visibility = 'hidden';

            if (document.querySelectorAll('.letter-slot.empty').length === 0) {
                this.showToast("¡Palabra Completa! 🌟", "success");
                this.createConfetti();
                this.addStar();
                this.speak(this.gameTarget.word);
                setTimeout(() => this.nextRound(), 3000);
            }
        } else {
            this.playErrorSound();
            this.showToast("Esa no es. ¡Intenta otra!", "error");
            btnElement.style.background = '#e74c3c';
            setTimeout(() => btnElement.style.background = '', 500);
        }
    },

    /**
     * ============================================================================
     * JUEGO 6: CLASIFICACIÓN (CATEGORÍAS)
     * ============================================================================
     */
    startClassificationGame: function () {
        const optionsContainer = document.getElementById('game-options-container');
        optionsContainer.innerHTML = '';
        optionsContainer.className = 'game-options classification-game';

        // 1. Elegir item aleatorio
        const categories = Object.keys(database);
        const randomCatKey = categories[Math.floor(Math.random() * categories.length)];
        const randomCatList = database[randomCatKey];
        const randomItem = randomCatList[Math.floor(Math.random() * randomCatList.length)];

        this.gameTarget = randomItem;
        this.gameTargetCategory = randomCatKey;

        // 2. Instrucción visual
        const instruction = document.getElementById('game-instruction');
        instruction.innerHTML = `📂 ¿A qué grupo pertenece?`;
        this.speak("¿A qué grupo pertenece " + randomItem.word + "?");

        const gameContainer = document.createElement('div');
        gameContainer.className = 'classification-game';

        gameContainer.innerHTML = `
            <img src="${randomItem.img}" class="current-item-img">
        `;

        // 3. Crear las opciones de categoría (Buckets)
        let districtKeys = categories.filter(c => c !== randomCatKey);
        districtKeys.sort(() => 0.5 - Math.random());

        const roundCategories = [randomCatKey, districtKeys[0], districtKeys[1]];
        roundCategories.sort(() => 0.5 - Math.random());

        const bucketsContainer = document.createElement('div');
        bucketsContainer.className = 'category-buckets';

        const catInfo = {
            animales: { icon: '🐶', name: 'Animales' },
            frutas: { icon: '🍎', name: 'Frutas' },
            objetos: { icon: '🚗', name: 'Objetos' },
            familia: { icon: '👨‍👩‍👧', name: 'Familia' },
            cuerpo: { icon: '👕', name: 'Cuerpo' }
        };

        roundCategories.forEach(catKey => {
            const bucket = document.createElement('div');
            bucket.className = `bucket cat-${catKey}`;
            bucket.innerHTML = `
                <div class="bucket-icon">${catInfo[catKey].icon}</div>
                <div class="bucket-label">${catInfo[catKey].name}</div>
            `;
            bucket.onclick = () => this.checkClassification(catKey);
            bucketsContainer.appendChild(bucket);
        });

        gameContainer.appendChild(bucketsContainer);
        optionsContainer.appendChild(gameContainer);
    },

    checkClassification: function (selectedCat) {
        if (selectedCat === this.gameTargetCategory) {
            this.showToast("¡Correcto! Es " + selectedCat, "success");
            this.playVictorySound();
            this.createConfetti();
            this.addStar();
            setTimeout(() => this.nextRound(), 2500);
        } else {
            this.showToast("No pertenece ahí. Intenta de nuevo", "error");
            this.playErrorSound();
        }
    },

    // --- SISTEMA DE RECOMPENSAS Y UI ---

    addStar: function () {
        this.stars++;
        this.updateStarDisplay();
        // Guardar en memoria del navegador
        localStorage.setItem('palabraVivaStars', this.stars);

        // Mostrar modal cada 5 estrellas
        if (this.stars % 5 === 0) {
            document.getElementById('reward-modal').classList.add('show');
        }
    },

    /**
     * Reinicia el contador de estrellas a cero.
     */
    resetStars: function () {
        if (confirm('¿Estás seguro de que quieres reiniciar todas las estrellas?')) {
            this.stars = 0;
            this.updateStarDisplay();
            localStorage.setItem('palabraVivaStars', 0);
            this.showToast("⭐ Estrellas reiniciadas", "info");
        }
    },

    /**
     * Reproduce sonido de victoria (confeti).
     * Si existe el archivo 'victoria.mp3' en /audio/, lo reproduce.
     * Si no, usa un sonido de éxito con TTS.
     */
    playVictorySound: function () {
        // Intentar reproducir sonido de victoria
        try {
            const victorySound = new Audio('audio/victoria.mp3');
            victorySound.volume = 0.7;
            victorySound.play().catch(e => {
                // Si no existe, usar TTS como fallback
                this.speak("¡Excelente!", { rate: 1.2 });
            });
        } catch (e) {
            this.speak("¡Excelente!", { rate: 1.2 });
        }
    },

    /**
     * Reproduce sonido de error.
     * Si existe el archivo 'error.mp3' en /audio/, lo reproduce.
     * Si no, usa TTS.
     */
    playErrorSound: function () {
        // Intentar reproducir sonido de error
        try {
            const errorSound = new Audio('audio/error.mp3');
            errorSound.volume = 0.5;
            errorSound.play().catch(e => {
                // Si no existe, no reproducir nada (ya se habla con TTS)
            });
        } catch (e) {
            // Silencioso si no hay archivo
        }
    },

    /**
     * Crea efecto visual de confeti cuando el niño gana.
     * Genera partículas de colores que caen desde arriba.
     */
    createConfetti: function () {
        const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#AA96DA'];
        const confettiCount = 50;

        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animationDelay = Math.random() * 0.5 + 's';
                confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
                document.body.appendChild(confetti);

                // Remover después de la animación
                setTimeout(() => {
                    confetti.remove();
                }, 3000);
            }, i * 20);
        }
    },

    updateStarDisplay: function () {
        document.getElementById('star-display').textContent = this.stars;
    },

    closeModal: function () {
        document.getElementById('reward-modal').classList.remove('show');
    },

    /**
     * Muestra notificaciones flotantes (Toasts).
     * @param {string} msg - Mensaje a mostrar.
     * @param {string} type - 'success', 'error', 'info'.
     */
    showToast: function (msg, type) {
        const toast = document.getElementById('toast');
        toast.textContent = msg;
        toast.className = 'toast show ' + type;
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
};

// ============================================================================
// GUÍA PRÁCTICA: CORRECCIÓN DE SÍLABAS Y PRONUNCIACIÓN
// ============================================================================
/**
 * PROBLEMA COMÚN: Las sílabas no se escuchan bien o no están separadas
 * 
 * SOLUCIÓN IMPLEMENTADA:
 * -----------------------
 * 1. ✅ Idioma cambiado a español latino (es-MX) en lugar de es-ES
 * 2. ✅ Reemplazo de TODOS los guiones (no solo el primero)
 * 3. ✅ Pausas claras entre sílabas usando " ... " (tres puntos)
 * 4. ✅ Velocidad reducida (0.7) para mejor comprensión
 * 
 * FORMATO CORRECTO DE SÍLABAS:
 * -----------------------------
 * En la base de datos, las sílabas deben estar así:
 * 
 * ✅ CORRECTO:
 *   syllables: 'Pe-rro'        → Se escucha: "Pe ... rro"
 *   syllables: 'Ma-má'         → Se escucha: "Ma ... má"
 *   syllables: 'E-le-fan-te'  → Se escucha: "E ... le ... fan ... te"
 *   syllables: 'Ba-na-na'     → Se escucha: "Ba ... na ... na"
 * 
 * ❌ INCORRECTO:
 *   syllables: 'Pe rro'        → Error: usa espacios en lugar de guiones
 *   syllables: 'Pe-rro '       → Error: espacio extra al final
 *   syllables: 'Pe--rro'       → Error: guiones dobles
 *   syllables: 'Pe - rro'      → Error: espacios alrededor del guion
 * 
 * CÓMO CORREGIR SÍLABAS EXISTENTES:
 * ----------------------------------
 * 1. Busca la palabra en el objeto 'database'
 * 2. Verifica el campo 'syllables'
 * 3. Asegúrate de que:
 *    - Use guiones (-) para separar, NO espacios
 *    - No tenga espacios extra al inicio o final
 *    - No tenga guiones dobles
 *    - Cada sílaba esté correctamente escrita
 * 
 * EJEMPLO DE CORRECCIÓN:
 * ----------------------
 * ANTES (incorrecto):
 *   { word: 'PERRO', syllables: 'Pe rro' }
 * 
 * DESPUÉS (correcto):
 *   { word: 'PERRO', syllables: 'Pe-rro' }
 * 
 * CONFIGURACIÓN DE IDIOMA:
 * ------------------------
 * - TTS (Text-to-Speech): 'es-MX' (español de México/Latinoamérica)
 * - Reconocimiento de voz: 'es-MX' (español latino)
 * - Si necesitas otro país latino, puedes usar:
 *   - 'es-AR' (Argentina)
 *   - 'es-CO' (Colombia)
 *   - 'es-US' (Estados Unidos - español latino)
 * 
 * PRUEBA Y VERIFICACIÓN:
 * -----------------------
 * 1. Abre la aplicación en el navegador
 * 2. Selecciona una categoría (ej: Animales)
 * 3. Escucha la pronunciación de la palabra completa
 * 4. Después de 1.5 segundos, deberías escuchar las sílabas separadas
 * 5. Cada sílaba debe tener una pausa clara entre ellas
 * 
 * Si aún hay problemas:
 * - Verifica la consola del navegador (F12) para ver errores
 * - Asegúrate de que el formato de sílabas sea correcto
 * - Prueba con diferentes navegadores (Chrome funciona mejor con TTS)
 */

// ============================================================================
// GUÍA PRÁCTICA: CÓMO AGREGAR MÁS SONIDOS Y EFECTOS
// ============================================================================
/**
 * PROCESO PASO A PASO:
 * 
 * 1. COLOCA EL ARCHIVO MP3 EN LA CARPETA /audio/
 *    Ejemplo: Si tienes "maullido.mp3", colócalo en:
 *    d:\palabras-vivas\palabra-viva\audio\maullido.mp3
 * 
 * 2. ACTUALIZA LA BASE DE DATOS (objeto 'database' arriba)
 *    Busca la palabra y agrega/actualiza el campo 'sound'
 * 
 * EJEMPLOS PRÁCTICOS:
 * -------------------
 * 
 * EJEMPLO 1: Agregar maullido para GATO
 * --------------------------------------
 * 1. Coloca: /audio/maullido.mp3
 * 2. En database.animales, busca GATO y verifica que tenga:
 *    { word: 'GATO', sound: 'maullido.mp3' }
 *    ✅ Ya está configurado en la línea 76
 * 
 * EJEMPLO 2: Agregar beso para MAMÁ
 * ----------------------------------
 * 1. Coloca: /audio/beso.mp3
 * 2. En database.familia, busca MAMÁ y verifica que tenga:
 *    { word: 'MAMÁ', sound: 'beso.mp3' }
 *    ✅ Ya está configurado en la línea 92
 * 
 * EJEMPLO 3: Agregar un nuevo sonido (ej: aplausos para MANO)
 * -------------------------------------------------------------
 * 1. Coloca: /audio/aplausos.mp3
 * 2. En database.cuerpo, busca MANO y actualiza:
 *    ANTES: { word: 'MANO', sound: 'aplausos.mp3' }
 *    DESPUÉS: { word: 'MANO', sound: 'aplausos.mp3' } ✅ Ya está
 * 
 * EJEMPLO 4: Agregar sonido a una palabra nueva
 * ----------------------------------------------
 * Si agregas una nueva palabra, incluye ambos campos:
 * {
 *   id: 'a6',
 *   word: 'CABALLO',
 *   syllables: 'Ca-ba-llo',
 *   img: 'url-de-imagen.jpg',
 *   audio: 'caballo.mp3',    // Pronunciación (opcional)
 *   sound: 'relincho.mp3'    // Sonido del animal (opcional)
 * }
 * 
 * IMPORTANTE:
 * -----------
 * - Los nombres de archivo deben coincidir EXACTAMENTE (mayúsculas/minúsculas)
 * - Formato recomendado: MP3
 * - Si el archivo no existe, el código usará TTS automáticamente
 * - No necesitas modificar la función playCardAudio(), ya está lista
 * 
 * VERIFICACIÓN:
 * -------------
 * 1. ¿El archivo está en /audio/? ✅
 * 2. ¿El nombre en 'sound' coincide exactamente? ✅
 * 3. ¿Probaste la tarjeta en el navegador? ✅
 * 
 * Si todo está bien, el sonido se reproducirá automáticamente después de 3 segundos
 * cuando se muestre la tarjeta de la palabra.
 */

// ============================================================================
// GUÍA COMPLETA: CÓMO AGREGAR MÁS CARTAS Y EXPANDIR EL SISTEMA
// ============================================================================
/**
 * 
 * 📚 GUÍA PASO A PASO PARA AGREGAR NUEVAS CARTAS
 * ================================================
 * 
 * PASO 1: LOCALIZAR LA BASE DE DATOS
 * -----------------------------------
 * Busca el objeto 'database' al inicio del archivo (línea ~76)
 * Contiene todas las categorías: animales, frutas, objetos, familia, cuerpo
 * 
 * PASO 2: ELEGIR LA CATEGORÍA
 * ----------------------------
 * Decide en qué categoría quieres agregar la nueva carta:
 * - animales: Para animales (perro, gato, león, etc.)
 * - frutas: Para frutas (manzana, uva, banana, etc.)
 * - objetos: Para objetos (auto, pelota, libro, etc.)
 * - familia: Para miembros de la familia (mamá, papá, etc.)
 * - cuerpo: Para partes del cuerpo (mano, pie, etc.)
 * 
 * PASO 3: CREAR LA NUEVA CARTA
 * -----------------------------
 * Agrega un nuevo objeto al array de la categoría con este formato:
 * 
 * {
 *   id: 'a6',                    // ID único (ver prefijos abajo)
 *   word: 'CABALLO',            // Palabra en MAYÚSCULAS
 *   syllables: 'Ca-ba-llo',     // Sílabas separadas por guiones
 *   img: 'url-de-imagen.jpg',   // URL de la imagen
 *   audio: 'caballo.mp3',       // Audio de pronunciación (opcional)
 *   sound: 'relincho.mp3'       // Sonido asociado (opcional)
 * }
 * 
 * PREFIJOS DE ID POR CATEGORÍA:
 * ------------------------------
 * - animales: 'a1', 'a2', 'a3', 'a4'... (ya hay hasta a8)
 * - frutas: 'f1', 'f2', 'f3', 'f4'... (ya hay hasta f6)
 * - objetos: 'o1', 'o2', 'o3', 'o4'... (ya hay hasta o6)
 * - familia: 'fa1', 'fa2', 'fa3', 'fa4'... (ya hay hasta fa6)
 * - cuerpo: 'c1', 'c2', 'c3', 'c4'... (ya hay hasta c6)
 * 
 * EJEMPLO COMPLETO - Agregar "CABALLO" a animales:
 * -------------------------------------------------
 * animales: [
 *   ...cartas existentes...,
 *   { 
 *     id: 'a9',                          // Siguiente número disponible
 *     word: 'CABALLO',                  // Palabra en mayúsculas
 *     syllables: 'Ca-ba-llo',           // Sílabas con guiones
 *     img: 'https://ejemplo.com/caballo.jpg',  // URL de imagen
 *     audio: 'caballo.mp3',             // Audio opcional
 *     sound: 'relincho.mp3'             // Sonido opcional
 *   }
 * ]
 * 
 * IMPORTANTE - FORMATO DE SÍLABAS:
 * ---------------------------------
 * ✅ CORRECTO: 'Ca-ba-llo' (guiones separando sílabas)
 * ❌ INCORRECTO: 'Ca ba llo' (espacios)
 * ❌ INCORRECTO: 'Ca-ba-llo ' (espacios extra)
 * 
 * PASO 4: VERIFICAR
 * -----------------
 * 1. Guarda el archivo
 * 2. Abre la aplicación en el navegador
 * 3. Selecciona la categoría donde agregaste la carta
 * 4. Verifica que la carta aparezca correctamente
 * 5. Prueba los juegos para asegurarte de que funciona
 * 
 * 
 * 🎮 CÓMO FUNCIONAN LOS JUEGOS CON NUEVAS CARTAS
 * ===============================================
 * 
 * Los juegos funcionan AUTOMÁTICAMENTE con cualquier cantidad de cartas.
 * NO necesitas modificar el código de los juegos.
 * 
 * JUEGO 1: Encuentra la palabra
 * -----------------------------
 * - Selecciona 1 carta correcta + 2 distractores aleatorios
 * - Si hay menos de 3 cartas, usa todas las disponibles
 * - Funciona con cualquier cantidad de cartas
 * 
 * JUEGO 2: Escucha y elige
 * ------------------------
 * - Igual que el juego 1, pero con audio
 * - Funciona automáticamente con cualquier cantidad de cartas
 * 
 * JUEGO 3: Memoria
 * ----------------
 * - Selecciona 6 cartas aleatorias (o todas si hay menos de 6)
 * - Crea pares de cada carta (imagen + palabra)
 * - Funciona con cualquier cantidad de cartas
 * 
 * JUEGO 4: Ordena las sílabas
 * ----------------------------
 * - Selecciona una palabra aleatoria
 * - Mezcla las sílabas
 * - Funciona con cualquier palabra de cualquier categoría
 * 
 * 
 * 📝 CHECKLIST PARA AGREGAR UNA NUEVA CARTA
 * ==========================================
 * 
 * [ ] Elegí la categoría correcta
 * [ ] Creé un ID único (ej: 'a9' para animales)
 * [ ] Escribí la palabra en MAYÚSCULAS
 * [ ] Separé las sílabas con guiones (ej: 'Ca-ba-llo')
 * [ ] Agregué una URL de imagen válida
 * [ ] (Opcional) Agregué audio de pronunciación
 * [ ] (Opcional) Agregué sonido asociado
 * [ ] Guardé el archivo
 * [ ] Probé la carta en el navegador
 * [ ] Verifiqué que funciona en los juegos
 * 
 * 
 * 💡 CONSEJOS Y MEJORES PRÁCTICAS
 * ===============================
 * 
 * 1. IMÁGENES:
 *    - Usa imágenes de buena calidad (mínimo 300x300px)
 *    - Preferible formato PNG con fondo transparente
 *    - Puedes usar Cloudinary, Imgur, o cualquier servicio de hosting
 * 
 * 2. SÍLABAS:
 *    - Separa correctamente las sílabas
 *    - Usa guiones, NO espacios
 *    - Ejemplo: 'E-le-fan-te' ✅, 'E le fan te' ❌
 * 
 * 3. AUDIOS:
 *    - Los archivos de audio van en la carpeta /audio/
 *    - Si no existe el archivo, el sistema usa TTS automáticamente
 *    - Formato recomendado: MP3
 * 
 * 4. ORGANIZACIÓN:
 *    - Mantén las cartas ordenadas por categoría
 *    - Usa IDs secuenciales (a1, a2, a3...)
 *    - Agrega comentarios si es necesario
 * 
 * 
 * 🔧 SOLUCIÓN DE PROBLEMAS
 * =========================
 * 
 * PROBLEMA: La carta no aparece
 * SOLUCIÓN: Verifica que el ID sea único y que la sintaxis del objeto sea correcta
 * 
 * PROBLEMA: Las sílabas no se pronuncian bien
 * SOLUCIÓN: Verifica que las sílabas estén separadas por guiones, no espacios
 * 
 * PROBLEMA: La imagen no carga
 * SOLUCIÓN: Verifica que la URL de la imagen sea válida y accesible
 * 
 * PROBLEMA: Los juegos no funcionan
 * SOLUCIÓN: Asegúrate de que la categoría tenga al menos 1 carta
 * 
 * 
 * 📚 ESTRUCTURA COMPLETA DEL PROYECTO
 * ====================================
 * 
 * d:\palabras-vivas\palabra-viva\
 *   ├── index.html          (Interfaz de usuario)
 *   ├── estilos.css         (Estilos y diseño)
 *   ├── script.js           (Lógica y base de datos) ← AQUÍ AGREGAS CARTAS
 *   ├── audio\              (Archivos de audio)
 *   │   ├── perro.mp3
 *   │   ├── gato.mp3
 *   │   └── ...
 *   └── ...
 * 
 * 
 * ============================================================================
 */

// Iniciar la aplicación cuando el HTML cargue completamente
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});







