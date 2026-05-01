export const conversations = [
  {
    id: 1,
    title: 'Salutations',
    titleAr: 'التَّحِيَّات',
    emoji: '👋',
    rounds: [
      {
        question: 'السَّلَامُ عَلَيْكُمْ!',
        questionAudio: 'resources/audio/conversations/salut_1.mp3',
        options: [
          { text: 'وَعَلَيْكُمُ السَّلَام', correct: true, feedback: 'برافو!' },
          { text: 'شُكْرًا', correct: false, feedback: 'لا، قل: وعليكم السلام' },
        ]
      },
      {
        question: 'كَيْفَ حَالُكَ؟',
        questionAudio: 'resources/audio/conversations/salut_2.mp3',
        options: [
          { text: 'بِخَيْر، الحَمْدُ لِله', correct: true },
          { text: 'اِسْمِي مُحَمَّد', correct: false },
        ]
      }
    ]
  },
  {
    id: 2,
    title: 'Présentation',
    titleAr: 'التَّعَارُف',
    emoji: '🤝',
    rounds: [
      {
        question: 'مَا اسْمُكَ؟',
        questionAudio: 'resources/audio/conversations/nom_1.mp3',
        options: [
          { text: 'اِسْمِي...', correct: true },
          { text: 'أَنَا بِخَيْر', correct: false },
        ]
      },
      {
        question: 'كَمْ عُمْرُكَ؟',
        questionAudio: 'resources/audio/conversations/age_1.mp3',
        options: [
          { text: 'عُمْرِي 7 سَنَوَات', correct: true },
          { text: 'لَا شُكْرًا', correct: false },
        ]
      }
    ]
  }
]
