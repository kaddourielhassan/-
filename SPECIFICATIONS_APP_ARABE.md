# 🎯 SPÉCIFICATIONS - App Arabe Enfants 6-8 ans

## **Projet LearnHub Kids - MVP**
- **Client** : 2 maîtresses + 4 enfants (France)
- **Durée MVP** : 3 semaines (mai-juin 2026)
- **Lancement** : Septembre 2026
- **Budget** : ~10€/an (gratuit en MVP)

---

## **1. OBJECTIFS PÉDAGOGIQUES**

### Alignement avec le Référentiel Année 1

**Objectif Principal** : Renforcer l'apprentissage en classe par des exercices ludiques à domicile

**Compétences ciblées (MVP)** :
- ✅ Reconnaître les **12 lettres prioritaires** (sans points)
- ✅ Distinguer les **6 paires phonèmes** spécifiques
- ✅ Acquérir **20 mots de vocabulaire** courants
- ✅ Prononciation correcte (avec modèle audio)
- ✅ Reconnaissance écrite des lettres

**Compétences futures (V2)** :
- 28 lettres complètes + points
- Traçage avancé
- Lecture de syllabes simples

---

## **2. PUBLIC & CONTEXTE**

| Aspect | Détail |
|--------|--------|
| **Âge** | 6-8 ans (Cycle 1) |
| **Nombre** | 4 enfants |
| **Niveau** | Débutants totaux |
| **Lieu** | Classe (occasionnel) + Maison (révision) |
| **Devices** | Tablettes iPad/Android + Smartphones |
| **Langue** | Bilingue (Arabe GROS, Français petit) |
| **Durée/session** | 15 min max par module |

---

## **3. ARCHITECTURE TECHNIQUE**

### Frontend
```
Bubble.io (No-code)
├─ Pages enfant (accueil + 5 exercices)
├─ Page maîtresse (dashboard simple)
└─ Design responsive (tablet + phone)
```

### Backend
```
Airtable (Base de données)
├─ Table Enfants
├─ Table Modules (12 lettres + 6 phonèmes + 20 mots)
├─ Table Exercices (5 types)
└─ Table Résultats (scores)
```

### Assets Statiques
```
Stockage local Bubble
├─ 📁 Audio (28 fichiers MP3)
├─ 📁 Images (60 illustrations)
└─ 📁 Styles (CSS custom)
```

---

## **4. LES 5 EXERCICES LUDIQUES**

### **Exercice 1 : ÉCOUTE & RECONNAISSANCE** ⭐ Prioritaire
- **Nom** : "Quelle lettre ?"
- **Mécanique** : Enfant écoute une lettre → clique sur la bonne image
- **Contenu** : 12 lettres prioritaires
- **Durée** : 3-5 min
- **Feedback** : ✅ Bip de victoire + animation

### **Exercice 2 : MEMORY DES LETTRES**
- **Nom** : "Memory Arabe"
- **Mécanique** : Matching pairs (12 lettres = 6 pairs)
- **Contenu** : Lettres isolées vs lettres en contexte
- **Durée** : 5-7 min
- **Feedback** : Compteur de pairs trouvées

### **Exercice 3 : DISTINCTION PHONÈMES** ⭐ Critique
- **Nom** : "Quel son ?"
- **Mécanique** : Écoute deux sons différents → choisir le bon (QCM)
- **Contenu** : 6 paires (ح/هـ, ع/أ, ص/س, ض/د, ط/ت, ق/ك)
- **Durée** : 5 min
- **Difficulty** : Progressive (paires faciles → difficiles)

### **Exercice 4 : TRAÇAGE SIMPLE**
- **Nom** : "Trace la lettre"
- **Mécanique** : Enfant trace au doigt (canvas HTML5)
- **Contenu** : 12 lettres
- **Durée** : 5 min
- **Feedback** : Points de repère, couleur change après trace

### **Exercice 5 : FLASHCARDS VOCABULAIRE**
- **Nom** : "Le mot arabe"
- **Mécanique** : Image + son → appui pour révéler le mot arabe
- **Contenu** : 20 mots courants
- **Durée** : 5 min
- **Format** : Swipe left/right pour naviguer

---

## **5. CONTENU DÉTAILLÉ**

### **12 Lettres Prioritaires (sans points)**
```
1. ا (Alif)
2. ح (Haa)
3. د (Daal)
4. ر (Raa)
5. س (Siin)
6. ص (Saad)
7. ط (Taa)
8. ع ('Ayn)
9. ل (Laam)
10. م (Miim)
11. و (Waaw)
12. ه (Haa - final)
```

### **6 Paires Phonèmes**
```
1. ح (pharyngal) vs هـ (glottal)
2. ع ('Ayn) vs أ (Alif)
3. ص (emphatique) vs س (simple)
4. ض (emphatique) vs د (simple)
5. ط (emphatique) vs ت (simple)
6. ق (uvulaire) vs ك (vélaire)
```

### **20 Mots Vocabulaire Initial**
```
Couleurs (8):
- أحمر (rouge)
- أزرق (bleu)
- أخضر (vert)
- أصفر (jaune)
- أبيض (blanc)
- أسود (noir)
- برتقالي (orange)
- وردي (rose)

Nombres (1-10) - à intégrer progressivement
Objets classe (4) :
- كتاب (livre)
- قلم (crayon)
- طاولة (table)
- كرسي (chaise)
```

---

## **6. INTERFACE UTILISATEUR**

### **ÉCRAN ENFANT**

#### Accueil
```
┌─────────────────────┐
│  🎉 مرحبا محمد!      │  ← Arabe GROS
│      Salut Mohamed! │  ← Français petit
├─────────────────────┤
│ ⭐ 150 points       │
├─────────────────────┤
│ [🎧] Écoute         │
│ [🎮] Memory         │
│ [👂] Sons           │
│ [✏️] Trace          │
│ [📷] Mots           │
└─────────────────────┘
```

#### Pendant Exercice
```
┌─────────────────────┐
│  ← Retour | Écoute  │
├─────────────────────┤
│                     │
│   [Contenu exo]     │
│                     │
├─────────────────────┤
│  [Valider] ou [X]   │
└─────────────────────┘
```

#### Feedback Victoire
```
┌─────────────────────┐
│       🎉🎉🎉         │
│   EXCELLENT!        │
│    +25 ⭐ points    │
│                     │
│   [Continuer]       │
└─────────────────────┘
```

### **ÉCRAN MAÎTRESSE**

```
┌──────────────────────────────┐
│ LearnHub - Tableau de Bord   │
├──────────────────────────────┤
│ Enfants:                     │
│ ├─ 👧 Sarah: 150 pts, 5/5 ex│
│ ├─ 👦 Liam: 100 pts, 3/5 ex │
│ ├─ 👧 Nora: 200 pts, 5/5 ex │
│ └─ 👦 Tom: 50 pts, 1/5 ex    │
├──────────────────────────────┤
│ Modules complétés: 2/5       │
│ [Réinitialiser] [Export]    │
└──────────────────────────────┘
```

---

## **7. GAMIFICATION & ENGAGEMENT**

### Points System
- Chaque exercice = points (Easy: 20, Medium: 25, Hard: 30)
- Bonus: Streak (jour après jour) = +5 pts

### Badges (V1)
- 🎯 "Je reconnais mes lettres" (12 lettres)
- 👂 "Maître des sons" (6 phonèmes OK)
- 📚 "Vocabulaire pro" (20 mots)
- ✏️ "Traceur expert" (traçage OK)
- 🌟 "Semaine champion" (5 jours consécutifs)

### Visual Feedback
- ✅ Bip/ding à chaque victoire
- 🎊 Animation confetti (rare, occasionnel)
- 📈 Barre de progression colorée
- ⭐ Compteur de points visible

---

## **8. DONNÉES AIRTABLE**

### Table: ENFANTS
```
Fields:
- ID (auto)
- Nom (text)
- Prénom (text)
- Date_Inscription (date)
- Niveau (select: Débutant/Intermédiaire)
- Points_Total (number)
- Dernière_Session (date)
```

### Table: MODULES
```
Fields:
- ID (auto)
- Type (select: Lettre/Phonème/Mot)
- Contenu_Arabe (text)
- Translittération (text)
- Image_URL (url)
- Audio_URL (url)
- Difficulté (number 1-5)
- Ordre (number)
```

### Table: EXERCICES
```
Fields:
- ID (auto)
- Type_Exercice (select: Écoute/Memory/Distinction/Traçage/Flashcard)
- Titre (text)
- Description (text)
- Modules_Requis (linked records)
- Points_Réussite (number)
- Durée_Estimée (number - minutes)
```

### Table: RÉSULTATS
```
Fields:
- ID (auto)
- Enfant (linked record)
- Exercice (linked record)
- Score (number 0-100)
- Temps (number - secondes)
- Tentatives (number)
- Date_Complété (date)
- Réussi (checkbox)
```

---

## **9. PRÉREQUIS TECHNIQUES**

### Outils à Installer/Créer
- ✅ Compte Bubble.io gratuit
- ✅ Compte Airtable gratuit
- ✅ Fichiers audio (28 MP3)
- ✅ Images illustrations (60 PNG)

### Compétences Requises
- Bubble.io: Interfaçage simple (DRAG & DROP)
- Airtable: Configuration tables (simple)
- Audio/Images: Préparation et upload

---

## **10. TIMELINE & LIVRABLES**

### SEMAINE 1 (Infrastructure)
- [ ] Compte Bubble + Airtable setup
- [ ] Audio enregistré (28 fichiers)
- [ ] Images collectées (60 fichiers)
- [ ] Structure Airtable créée

### SEMAINE 2 (MVP Exercices)
- [ ] Exercice 1: Écoute & Reconnaissance ✅
- [ ] Exercice 2: Memory ✅
- [ ] Exercice 3: Distinction Phonèmes ✅
- [ ] Exercice 4: Traçage ✅
- [ ] Exercice 5: Flashcards ✅

### SEMAINE 3 (Polish + Tests)
- [ ] Dashboard maîtresse
- [ ] Gamification
- [ ] Tests avec enfants
- [ ] Bugfixes

---

## **11. RISQUES & MITIGATIONS**

| Risque | Mitigation |
|--------|-----------|
| Audio qualité faible | Enregistrer dans pièce calme, bon micro |
| App lente sur mobile | Optimiser images (compression) |
| Enfants frustrés | Exercises faciles en priorité, feedback positif |
| Données perdues | Backups hebdomadaires Airtable |
| Maîtresses pas tech | Interface ultra simple (3 clics max) |

---

## **12. MÉTRIQUES DE SUCCÈS (Septembre 2026)**

- ✅ 4 enfants utilisent app régulièrement (3x/semaine)
- ✅ Score moyen > 70% sur exercices
- ✅ Temps/session = 15 min (objectif atteint)
- ✅ 0 bugs critiques
- ✅ Maîtresses satisfaites du suivi (feedback positif)

---

**Version**: 1.0  
**Date**: Avril 2026  
**Statut**: ✅ APPROUVÉ - Démarrage Phase 1
