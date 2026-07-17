/**
 * Word Database - Palabras Vivas 2.0
 * Migrated from legacy script.js with real Cloudinary images and audio
 */

const BASE_AUDIO_URL = import.meta.env.PROD 
  ? '/palabras-vivas-2.0/audio' 
  : '/audio';

const CLOUDINARY_BASE = 'https://res.cloudinary.com/dfn5g9ve3/image/upload';

export const categories = {
  animales: {
    name: 'Animales',
    icon: 'fa-solid fa-paw',
    color: '#22c55e',
    words: [
      { id: 'a1', word: 'PERRO', syllables: 'Pe-rro', img: `${CLOUDINARY_BASE}/v1769318203/c9f1a4a9-3c85-42b7-8e9b-c50b2c8bbf5d_mqnncc.jpg`, audio: 'perro.mp3', syllableAudio: 'si_perro.mp3', sound: 'ladrido.mp3' },
      { id: 'a2', word: 'GATO', syllables: 'Ga-to', img: `${CLOUDINARY_BASE}/v1769356145/Ga_to_s4sk6q.png`, audio: 'gato.mp3', syllableAudio: 'si_gato.mp3', sound: 'maullido.mp3' },
      { id: 'a3', word: 'LEÓN', syllables: 'Le-ón', img: `${CLOUDINARY_BASE}/v1769357944/leon_gaoqlw.png`, audio: 'leon.mp3', syllableAudio: 'si_leon.mp3', sound: 'rugido.mp3' },
      { id: 'a4', word: 'VACA', syllables: 'Va-ca', img: `${CLOUDINARY_BASE}/v1769358689/vaca_ou1qrc.png`, audio: 'vaca.mp3', syllableAudio: 'si_vaca.mp3', sound: 'mugido.mp3' },
      { id: 'a5', word: 'ELEFANTE', syllables: 'E-le-fan-te', img: `${CLOUDINARY_BASE}/v1769359512/elefante_xn89db.png`, audio: 'elefante.mp3', syllableAudio: 'si_elefante.mp3', sound: 'trompeta.mp3' },
      { id: 'a6', word: 'CABALLO', syllables: 'Ca-ba-llo', img: `${CLOUDINARY_BASE}/v1769477981/caballo_ncu73d.png`, audio: 'caballo.mp3', syllableAudio: 'si_caballo.mp3', sound: 'relinchido.mp3' },
      { id: 'a7', word: 'OSO', syllables: 'O-so', img: `${CLOUDINARY_BASE}/v1769477978/oso_jwd0ps.png`, audio: 'oso.mp3', syllableAudio: 'si_oso.mp3', sound: 'gruñido.mp3' },
      { id: 'a8', word: 'PATO', syllables: 'Pa-to', img: `${CLOUDINARY_BASE}/v1769477975/pato_cqsqt9.png`, audio: 'pato.mp3', syllableAudio: 'si_pato.mp3', sound: 'graznido.mp3' },
      { id: 'a9', word: 'CONEJO', syllables: 'Co-ne-jo', img: `${CLOUDINARY_BASE}/v1769477972/conejo_m9628k.png`, audio: 'conejo.mp3', syllableAudio: 'si_conejo.mp3', sound: 'saltar.mp3' },
      { id: 'a10', word: 'OVEJA', syllables: 'O-ve-ja', img: `${CLOUDINARY_BASE}/v1769477969/oveja_tqnvtu.png`, audio: 'oveja.mp3', syllableAudio: 'si_oveja.mp3', sound: 'balido.mp3' },
      { id: 'a11', word: 'CERDO', syllables: 'Cer-do', img: `${CLOUDINARY_BASE}/v1769477966/cerdo_cipw8n.png`, audio: 'cerdo.mp3', syllableAudio: 'si_cerdo.mp3', sound: 'gruñido_1.mp3' },
      { id: 'a12', word: 'GALLINA', syllables: 'Ga-lli-na', img: `${CLOUDINARY_BASE}/v1769477964/gallina_bfu2lg.png`, audio: 'gallina.mp3', syllableAudio: 'si_gallina.mp3', sound: 'cacareo.mp3' },
      { id: 'a13', word: 'TIGRE', syllables: 'Ti-gre', img: `${CLOUDINARY_BASE}/v1769477960/tigre_gj6emn.png`, audio: 'tigre.mp3', syllableAudio: 'si_tigre.mp3', sound: 'rugido_1.mp3' },
      { id: 'a14', word: 'MONO', syllables: 'Mo-no', img: `${CLOUDINARY_BASE}/v1769477957/mono_hkhmjz.png`, audio: 'mono.mp3', syllableAudio: 'si_mono.mp3', sound: 'grito.mp3' },
      { id: 'a15', word: 'PEZ', syllables: 'Pez', img: `${CLOUDINARY_BASE}/v1769477955/pez_strc2v.png`, audio: 'pez.mp3', syllableAudio: 'si_pez.mp3', sound: 'burbujas.mp3' }
    ]
  },
  frutas: {
    name: 'Frutas',
    icon: 'fa-solid fa-apple-whole',
    color: '#ef4444',
    words: [
      { id: 'f1', word: 'MANZANA', syllables: 'Man-za-na', img: `${CLOUDINARY_BASE}/v1769360863/manzana_rfmuy6.png`, audio: 'manzana.mp3', syllableAudio: 'si_manzana.mp3', sound: 'mordisco.mp3' },
      { id: 'f2', word: 'UVAS', syllables: 'U-vas', img: `${CLOUDINARY_BASE}/v1769361083/uvas_rkjqqv.png`, audio: 'uva.mp3', syllableAudio: 'si_uva.mp3', sound: 'pop.mp3' },
      { id: 'f3', word: 'BANANA', syllables: 'Ba-na-na', img: `${CLOUDINARY_BASE}/v1769361277/Banana_k6w6vd.png`, audio: 'banana.mp3', syllableAudio: 'si_banana.mp3', sound: 'corte.mp3' },
      { id: 'f4', word: 'NARANJA', syllables: 'Na-ran-ja', img: `${CLOUDINARY_BASE}/v1769477952/naranja_ljwmzc.png`, audio: 'naranja.mp3', syllableAudio: 'si_naranja.mp3', sound: 'exprimir.mp3' },
      { id: 'f5', word: 'FRESA', syllables: 'Fre-sa', img: `${CLOUDINARY_BASE}/v1769477949/fresa_yte9gt.png`, audio: 'fresa.mp3', syllableAudio: 'si_fresa.mp3', sound: 'mordisco.mp3' },
      { id: 'f6', word: 'SANDÍA', syllables: 'San-dí-a', img: `${CLOUDINARY_BASE}/v1769477946/sandia_q3c4vp.png`, audio: 'sandia.mp3', syllableAudio: 'si_sandia.mp3', sound: 'corte.mp3' },
      { id: 'f7', word: 'PIÑA', syllables: 'Pi-ña', img: `${CLOUDINARY_BASE}/v1769477943/pi%C3%B1a_tlvg6v.png`, audio: 'piña.mp3', syllableAudio: 'si_piña.mp3', sound: 'corte.mp3' },
      { id: 'f8', word: 'MELÓN', syllables: 'Me-lón', img: `${CLOUDINARY_BASE}/v1769477940/melon_gj4ix3.png`, audio: 'melon.mp3', syllableAudio: 'si_melon.mp3', sound: 'corte.mp3' },
      { id: 'f9', word: 'PERA', syllables: 'Pe-ra', img: `${CLOUDINARY_BASE}/v1769477936/pera_zbabi1.png`, audio: 'pera.mp3', syllableAudio: 'si_pera.mp3', sound: 'mordisco.mp3' },
      { id: 'f10', word: 'CEREZA', syllables: 'Ce-re-za', img: `${CLOUDINARY_BASE}/v1769477934/cereza_ofoth8.png`, audio: 'cereza.mp3', syllableAudio: 'si_cereza.mp3', sound: 'pop.mp3' },
      { id: 'f11', word: 'LIMÓN', syllables: 'Li-món', img: `${CLOUDINARY_BASE}/v1769477931/limon_rgkfgc.png`, audio: 'limon.mp3', syllableAudio: 'si_limon.mp3', sound: 'exprimir.mp3' },
      { id: 'f12', word: 'KIWI', syllables: 'Ki-wi', img: `${CLOUDINARY_BASE}/v1769477928/kiwi_zvzyfr.png`, audio: 'kiwi.mp3', syllableAudio: 'si_kiwi.mp3', sound: 'corte.mp3' }
    ]
  },
  objetos: {
    name: 'Objetos',
    icon: 'fa-solid fa-cube',
    color: '#3b82f6',
    words: [
      { id: 'o1', word: 'AUTO', syllables: 'Au-to', img: `${CLOUDINARY_BASE}/v1769361888/auto_dzz4x1.png`, audio: 'auto.mp3', syllableAudio: 'si_auto.mp3', sound: 'motor.mp3' },
      { id: 'o2', word: 'PELOTA', syllables: 'Pe-lo-ta', img: `${CLOUDINARY_BASE}/v1769362147/pelota_kbtwce.png`, audio: 'pelota.mp3', syllableAudio: 'si_pelota.mp3', sound: 'rebote.mp3' },
      { id: 'o3', word: 'LIBRO', syllables: 'Li-bro', img: `${CLOUDINARY_BASE}/v1769362424/libro_bpjbuz.png`, audio: 'libro.mp3', syllableAudio: 'si_libro.mp3', sound: 'hojas.mp3' },
      { id: 'o4', word: 'CASA', syllables: 'Ca-sa', img: `${CLOUDINARY_BASE}/v1769477925/casa_bwsbmb.png`, audio: 'casa.mp3', syllableAudio: 'si_casa.mp3', sound: 'puerta.mp3' },
      { id: 'o5', word: 'MESA', syllables: 'Me-sa', img: `${CLOUDINARY_BASE}/v1769477922/mesa_poxqyk.png`, audio: 'mesa.mp3', syllableAudio: 'si_mesa.mp3', sound: 'golpe.mp3' },
      { id: 'o6', word: 'SILLA', syllables: 'Si-lla', img: `${CLOUDINARY_BASE}/v1769477919/silla_mzfbwb.png`, audio: 'silla.mp3', syllableAudio: 'si_silla.mp3', sound: 'arrastrar.mp3' },
      { id: 'o7', word: 'JUGUETE', syllables: 'Ju-gue-te', img: `${CLOUDINARY_BASE}/v1769477917/juguete_nxuqrx.png`, audio: 'juguete.mp3', syllableAudio: 'si_juguete.mp3', sound: 'sonido.mp3' },
      { id: 'o8', word: 'BICICLETA', syllables: 'Bi-ci-cle-ta', img: `${CLOUDINARY_BASE}/v1769477914/bicicleta_odl55e.png`, audio: 'bicicleta.mp3', syllableAudio: 'si_bicicleta.mp3', sound: 'pedal.mp3' },
      { id: 'o9', word: 'AVIÓN', syllables: 'A-vi-ón', img: `${CLOUDINARY_BASE}/v1769477911/avion_l9xtmb.png`, audio: 'avion.mp3', syllableAudio: 'si_avion.mp3', sound: 'motor.mp3' },
      { id: 'o10', word: 'BARCO', syllables: 'Bar-co', img: `${CLOUDINARY_BASE}/v1769479054/barco_bxpuri.jpg`, audio: 'barco.mp3', syllableAudio: 'si_barco.mp3', sound: 'silbato.mp3' },
      { id: 'o11', word: 'TREN', syllables: 'Tren', img: `${CLOUDINARY_BASE}/v1769477908/tren_mqropj.png`, audio: 'tren.mp3', syllableAudio: 'si_tren.mp3', sound: 'silbato.mp3' },
      { id: 'o12', word: 'GLOBO', syllables: 'Glo-bo', img: `${CLOUDINARY_BASE}/v1769477906/globo_eqmlat.png`, audio: 'globo.mp3', syllableAudio: 'si_globo.mp3', sound: 'pop_1.mp3' }
    ]
  },
  familia: {
    name: 'Familia',
    icon: 'fa-solid fa-people-roof',
    color: '#a855f7',
    words: [
      { id: 'fa1', word: 'MAMÁ', syllables: 'Ma-má', img: `${CLOUDINARY_BASE}/v1769363978/ma_zw56t4.png`, audio: 'mama.mp3', syllableAudio: 'si_mama.mp3', sound: 'beso.mp3' },
      { id: 'fa2', word: 'PAPÁ', syllables: 'Pa-pá', img: `${CLOUDINARY_BASE}/v1769364425/papa_lqlps6.png`, audio: 'papa.mp3', syllableAudio: 'si_papa.mp3', sound: 'risa.mp3' },
      { id: 'fa3', word: 'ABUELO', syllables: 'A-bue-lo', img: `${CLOUDINARY_BASE}/v1769477887/abuelo_yt8abn.png`, audio: 'abuelo.mp3', syllableAudio: 'si_abuelo.mp3', sound: 'risa.mp3' },
      { id: 'fa4', word: 'ABUELA', syllables: 'A-bue-la', img: `${CLOUDINARY_BASE}/v1769477890/abuela_vltv2i.png`, audio: 'abuela.mp3', syllableAudio: 'si_abuela.mp3', sound: 'beso.mp3' },
      { id: 'fa5', word: 'HERMANO', syllables: 'Her-ma-no', img: `${CLOUDINARY_BASE}/v1769477884/hermano_mmxmmt.png`, audio: 'hermano.mp3', syllableAudio: 'si_hermano.mp3', sound: 'risa_1.mp3' },
      { id: 'fa6', word: 'HERMANA', syllables: 'Her-ma-na', img: `${CLOUDINARY_BASE}/v1769477881/hermana_e3gt1u.png`, audio: 'hermana.mp3', syllableAudio: 'si_hermana.mp3', sound: 'risa_1.mp3' },
      { id: 'fa7', word: 'BEBÉ', syllables: 'Be-bé', img: `${CLOUDINARY_BASE}/v1769477892/bebe_jvigde.png`, audio: 'bebe.mp3', syllableAudio: 'si_bebe.mp3', sound: 'llanto.mp3' },
      { id: 'fa8', word: 'TÍO', syllables: 'Tí-o', img: `${CLOUDINARY_BASE}/v1769477895/tio_majuyv.png`, audio: 'tio.mp3', syllableAudio: 'si_tio.mp3', sound: 'risa_1.mp3' },
      { id: 'fa9', word: 'TÍA', syllables: 'Tí-a', img: `${CLOUDINARY_BASE}/v1769477898/tia_hdzmbq.png`, audio: 'tia.mp3', syllableAudio: 'si_tia.mp3', sound: 'beso.mp3' },
      { id: 'fa10', word: 'PRIMO', syllables: 'Pri-mo', img: `${CLOUDINARY_BASE}/v1769477900/primo_d8fvg9.png`, audio: 'primo.mp3', syllableAudio: 'si_primo.mp3', sound: 'risa_1.mp3' },
      { id: 'fa11', word: 'PRIMA', syllables: 'Pri-ma', img: `${CLOUDINARY_BASE}/v1769477903/prima_buunhd.png`, audio: 'prima.mp3', syllableAudio: 'si_prima.mp3', sound: 'risa_1.mp3' }
    ]
  },
  cuerpo: {
    name: 'Cuerpo',
    icon: 'fa-solid fa-person',
    color: '#f97316',
    words: [
      { id: 'c1', word: 'MANO', syllables: 'Ma-no', img: `${CLOUDINARY_BASE}/v1769364688/mano_t2t5b3.png`, audio: 'mano.mp3', syllableAudio: 'si_mano.mp3', sound: 'aplausos.mp3' },
      { id: 'c2', word: 'PIE', syllables: 'Pie', img: `${CLOUDINARY_BASE}/v1769365013/pie_neeumh.png`, audio: 'pie.mp3', syllableAudio: 'si_pie.mp3', sound: 'pisada.mp3' },
      { id: 'c3', word: 'CABEZA', syllables: 'Ca-be-za', img: `${CLOUDINARY_BASE}/v1769477858/cabeza_akkoxo.png`, audio: 'cabeza.mp3', syllableAudio: 'si_cabeza.mp3', sound: 'golpe.mp3' },
      { id: 'c4', word: 'OJO', syllables: 'O-jo', img: `${CLOUDINARY_BASE}/v1769477856/ojo_nfztem.png`, audio: 'ojo.mp3', syllableAudio: 'si_ojo.mp3', sound: 'parpadeo.mp3' },
      { id: 'c5', word: 'NARIZ', syllables: 'Na-riz', img: `${CLOUDINARY_BASE}/v1769477879/nariz_ynhbca.png`, audio: 'nariz.mp3', syllableAudio: 'si_nariz.mp3', sound: 'respirar.mp3' },
      { id: 'c6', word: 'BOCA', syllables: 'Bo-ca', img: `${CLOUDINARY_BASE}/v1769477876/boca_sgfjab.png`, audio: 'boca.mp3', syllableAudio: 'si_boca.mp3', sound: 'beso.mp3' },
      { id: 'c7', word: 'OREJA', syllables: 'O-re-ja', img: `${CLOUDINARY_BASE}/v1769477873/oreja_cfs2vs.png`, audio: 'oreja.mp3', syllableAudio: 'si_oreja.mp3', sound: 'sonido.mp3' },
      { id: 'c8', word: 'BRAZO', syllables: 'Bra-zo', img: `${CLOUDINARY_BASE}/v1769477871/brazo_ybqijm.png`, audio: 'brazo.mp3', syllableAudio: 'si_brazo.mp3', sound: 'movimiento.mp3' },
      { id: 'c9', word: 'PIERNA', syllables: 'Pier-na', img: `${CLOUDINARY_BASE}/v1769477867/pierna_hncgkn.png`, audio: 'pierna.mp3', syllableAudio: 'si_pierna.mp3', sound: 'pisada.mp3' },
      { id: 'c10', word: 'DEDO', syllables: 'De-do', img: `${CLOUDINARY_BASE}/v1769477866/dedo_g2kijs.png`, audio: 'dedo.mp3', syllableAudio: 'si_dedo.mp3', sound: 'toque.mp3' },
      { id: 'c11', word: 'RODILLA', syllables: 'Ro-di-lla', img: `${CLOUDINARY_BASE}/v1769477860/rodilla_itb8lj.png`, audio: 'rodilla.mp3', syllableAudio: 'si_rodilla.mp3', sound: 'golpe.mp3' },
      { id: 'c12', word: 'HOMBRO', syllables: 'Hom-bro', img: `${CLOUDINARY_BASE}/v1769477863/hombro_iin1ul.png`, audio: 'hombro.mp3', syllableAudio: 'si_hombro.mp3', sound: 'movimiento.mp3' }
    ]
  }
};

export const audioBaseUrl = BASE_AUDIO_URL;

export function getWordsForCategory(categoryKey) {
  const category = categories[categoryKey];
  return category ? category.words : [];
}

export function getAudioPath(filename) {
  return `${BASE_AUDIO_URL}/${filename}`;
}
