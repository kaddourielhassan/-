// 6 paires de phonemes critiques a distinguer
// Source : Referentiel Annee 1

export const phonemes = [
  {
    id: 1,
    lettre1: { caractere: '\u062D', nom: 'حاء', type: 'حلقي' },
    lettre2: { caractere: '\u0647\u0640', nom: 'هاء', type: 'حنجري' },
    difficulte: 2,
    audio: 'audio/phonemes/phoneme_01_haa_vs_ha.mp3',
    astuce: 'صوت عميق في الحلق مقابل زفير خفيف',
    emoji: '\uD83E\uDEC1',
  },
  {
    id: 2,
    lettre1: { caractere: '\u0639', nom: 'عين', type: 'حلقي' },
    lettre2: { caractere: '\u0623', nom: 'ألف', type: 'همزة' },
    difficulte: 3,
    audio: 'audio/phonemes/phoneme_02_ayn_vs_alif.mp3',
    astuce: 'ضغط في الحلق مقابل صوت أ عادي',
    emoji: '\uD83D\uDC42',
  },
  {
    id: 3,
    lettre1: { caractere: '\u0635', nom: 'صاد', type: 'مفخّم' },
    lettre2: { caractere: '\u0633', nom: 'سين', type: 'بسيط' },
    difficulte: 1,
    audio: 'audio/phonemes/phoneme_03_saad_vs_siin.mp3',
    astuce: 'فم مستدير وصوت ثقيل مقابل صوت س عادي',
    emoji: '\uD83D\uDD0A',
  },
  {
    id: 4,
    lettre1: { caractere: '\u0636', nom: 'ضاد', type: 'مفخّم' },
    lettre2: { caractere: '\u062F', nom: 'دال', type: 'بسيط' },
    difficulte: 2,
    audio: 'audio/phonemes/phoneme_04_daad_vs_daal.mp3',
    astuce: 'د ثقيل وعميق مقابل د عادي',
    emoji: '\uD83D\uDCAA',
  },
  {
    id: 5,
    lettre1: { caractere: '\u0637', nom: 'طاء', type: 'مفخّم' },
    lettre2: { caractere: '\u062A', nom: 'تاء', type: 'بسيط' },
    difficulte: 2,
    audio: 'audio/phonemes/phoneme_05_taa_vs_ta.mp3',
    astuce: 'ت عميق مقابل ت عادي',
    emoji: '\uD83C\uDFAF',
  },
  {
    id: 6,
    lettre1: { caractere: '\u0642', nom: 'قاف', type: 'لهوي' },
    lettre2: { caractere: '\u0643', nom: 'كاف', type: 'طبقي' },
    difficulte: 3,
    audio: 'audio/phonemes/phoneme_06_qaf_vs_kaaf.mp3',
    astuce: 'أقصى الحلق بعمق شديد مقابل ك عادي',
    emoji: '\uD83D\uDDE3\uFE0F',
  },
]
