// Définition des 5 badges à débloquer

export const badges = [
  {
    id: 'lettres',
    nom: 'أتعرف على حروفي',
    nomAr: 'أَعْرِفُ حُرُوفِي',
    emoji: '🎯',
    description: 'أنجز 12 تمرينًا في الاستماع والتمييز',
    condition: (stats) => (stats.ecoute?.correct || 0) >= 12,
    color: 'from-blue-400 to-blue-600',
  },
  {
    id: 'sons',
    nom: 'معلّم الأصوات',
    nomAr: 'سَيِّدُ الأَصْوَات',
    emoji: '👂',
    description: 'ميّز بنجاح 6 أزواج من الأصوات',
    condition: (stats) => (stats.phonemes?.correct || 0) >= 6,
    color: 'from-purple-400 to-purple-600',
  },
  {
    id: 'vocabulaire',
    nom: 'قوة المفردات',
    nomAr: 'مُفْرَدَاتِي قَوِيَّة',
    emoji: '📚',
    description: 'اكتشف 20 كلمة عبر البطاقات',
    condition: (stats) => (stats.flashcards?.vus || 0) >= 20,
    color: 'from-emerald-400 to-emerald-600',
  },
  {
    id: 'traceur',
    nom: 'متتبع ماهر',
    nomAr: 'خَطَّاطٌ مَاهِر',
    emoji: '✏️',
    description: 'اكتب 12 حرفًا بنجاح',
    condition: (stats) => (stats.tracage?.completed || 0) >= 12,
    color: 'from-amber-400 to-amber-600',
  },
  {
    id: 'semaine',
    nom: 'بطل الأسبوع',
    nomAr: 'بَطَلُ الأُسْبُوع',
    emoji: '🌟',
    description: 'العب 5 أيام متتالية',
    condition: (stats) => (stats.streak || 0) >= 5,
    color: 'from-rose-400 to-rose-600',
  },
]
