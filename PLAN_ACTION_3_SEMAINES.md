# 📅 PLAN D'ACTION - 3 SEMAINES MVP

## **SEMAINE 1 (7 jours) : INFRASTRUCTURE & RESSOURCES**

### Jour 1 - Lundi | Setup Techniques

**Matin (1h30)**
- [ ] Créer compte Bubble.io (gratuit) → https://bubble.io
- [ ] Explorer UI Bubble (familiarisation)
- [ ] Créer un nouveau "App"
- [ ] Nommer l'app: "LearnHub Kids" ou "Al-Alef" (اللعبة)

**Après-midi (1h30)**
- [ ] Créer compte Airtable (gratuit) → https://airtable.com
- [ ] Créer une Base nommée "Données Enfants"
- [ ] Créer 4 tables (voir structure en SPECS)
- [ ] Inviter les maîtresses à l'espace Airtable

**Validation** ✅ : Deux plateformes prêtes + accès confirmé

---

### Jour 2 - Mardi | Audio Recording (⭐ PRIORITAIRE)

**Matin (2h)**
- [ ] **Enregistrer les 28 LETTRES**
  - Utiliser: Téléphone (dictaphone) ou GarageBand
  - Format: MP3, 44kHz, mono
  - Nommage: `lettre_01_alif.mp3`, `lettre_02_haa.mp3`, etc.
  - Prononciation lente et claire
  
**Après-midi (2h)**
- [ ] **Enregistrer les 6 PAIRES PHONÈMES** (distinction)
  - Exemple: `phoneme_haa_vs_ha.mp3` (les 2 sons consécutifs)
  - Répéter 3x chaque paire
  
**Soir (1h)**
- [ ] **Enregistrer les 20 MOTS** (vocabulaire initial)
  - Prononciation + traduction française après
  - Format: "أحمر... rouge" (pause 2s entre)

**Stockage** 📁 : Créer dossier `Audio_Raw/` dans le projet

**Validation** ✅ : 54 fichiers MP3 + bon débit

---

### Jour 3 - Mercredi | Images & Illustrations

**Matin (2h)**
- [ ] Télécharger/Créer images des **12 lettres**
  - Source: Canva (free tier) ou Pixabay
  - Format: PNG 300x300px, transparent background
  - Style: Coloré, simple, enfantin
  - Nommage: `lettre_alif.png`, `lettre_haa.png`, etc.

**Après-midi (2h)**
- [ ] **8 couleurs** (images objets):
  - Exemple: Apple rouge, sky bleu, grass vert, etc.
  
**Soir (1h)**
- [ ] **4 objets classe**: Livre, Crayon, Table, Chaise
  - Images claires + iconiques

**Bonus (si temps)** :
- [ ] Créer/télécharger mascotte simple (emoji ou cartoon)
- [ ] Background ludique (pattern coloré)

**Stockage** 📁 : `Images/` → sous-dossiers par catégorie

**Validation** ✅ : 32 images en HD, style cohérent

---

### Jour 4 - Jeudi | Airtable Peuplement

**Matin (1h30)**
- [ ] Remplir Table ENFANTS:
  ```
  Nom | Prénom | Date_Inscription | Points_Total
  [4 enfants] | TODAY | 0
  ```

**Midi (30 min)**
- [ ] Remplir Table MODULES:
  - 12 Lettres (Colonne: Contenu_Arabe, Translittération, Difficulté: 1)
  - 6 Phonèmes (Difficulté: 2-3)
  - 20 Vocabulaire (Difficulté: 1-2)

**Après-midi (1h)**
- [ ] Remplir Table EXERCICES:
  - 5 lignes pour les 5 exercices
  - Lier aux modules requis
  
**Soir (30 min)**
- [ ] Tester les liens entre tables
- [ ] Vérifier pas d'erreurs

**Validation** ✅ : Airtable rempli, liens OK

---

### Jour 5 - Vendredi | Upload Assets Bubble

**Matin (1h)**
- [ ] Compresser les 32 images (TinyPNG)
- [ ] Compresser les 54 audios (si nécessaire)
- [ ] Créer dossier `/assets` dans Bubble

**Après-midi (2h)**
- [ ] Upload images dans Bubble
- [ ] Upload audios dans Bubble
- [ ] Créer URLs publiques (ou URLs directes depuis Bubble)

**Soir (30 min)**
- [ ] Tester accès aux fichiers depuis Bubble
- [ ] Vérifier qualité audio/image

**Validation** ✅ : Assets accessible, pas d'erreurs 404

---

### Jour 6-7 | BUFFER + Révisions

- [ ] Réviser tous les enregistrements (qualité)
- [ ] Vérifier images cohérence style
- [ ] Documenter chemins d'accès assets
- [ ] Backup Airtable + Bubble

**Checkpoint Fin SEMAINE 1** ✅
```
✅ Bubble setup + assets importés
✅ Airtable peuplé + liens fonctionnels
✅ 54 audios MP3 (28 lettres + 6 paires + 20 mots)
✅ 32 images HD (12 lettres + 8 couleurs + 4 objets + extras)
✅ Prêt pour développement Phase 2
```

---

## **SEMAINE 2 (7 jours) : DÉVELOPPEMENT EXERCICES**

### Jour 1-2 | Exercice 1: ÉCOUTE & RECONNAISSANCE

**Jour 1 - Lundi**
- [ ] Créer page "Écoute" dans Bubble
- [ ] Design UI simple:
  - Titre: "Quelle lettre?" (Français petit)
  - 4 boutons avec images (12 lettres aléatoires)
  - Bouton ÉCOUTE (icon speaker)

**Jour 2 - Mardi**
- [ ] Logique Bubble:
  - Bouton ÉCOUTE → Play audio random lettre
  - Enfant clique réponse → Vérifier si correct
  - ✅ Correct → +25 pts, animation, passage suivant
  - ❌ Incorrect → "Essaie encore" (pas pénalité, juste rejeu)
- [ ] Lier à Airtable (écrire score dans Results)
- [ ] Tester 10x

**Tests** ✅
- [ ] Boutons clickables
- [ ] Audio joue correctement
- [ ] Feedback OK
- [ ] Enregistrement scores OK

---

### Jour 3 | Exercice 2: MEMORY LETTRES

**Matin (1h30)**
- [ ] Créer page "Memory" dans Bubble
- [ ] UI: Grille 3x4 (12 cartes) - flip on click
- [ ] Contenu: 6 pairs (lettre + illustration)

**Après-midi (1h30)**
- [ ] Logique flip/match:
  - Retourner 2 cartes
  - Si match → rester retournées + son victoire
  - Si pas match → retourner face cachée
  - Count pairs trouvées
- [ ] Timer (bonus si réussi < 3 min)
- [ ] Enregistrer score

**Tests** ✅
- [ ] Flip animation smooth
- [ ] Match detection OK
- [ ] Score recording OK

---

### Jour 4 | Exercice 3: DISTINCTION PHONÈMES

**Matin (1h)**
- [ ] Créer page "Quel Son?" dans Bubble
- [ ] UI simple:
  - Bouton ÉCOUTE (audio: 2 sons successifs)
  - 2 boutons réponse (images lettres)
  - Afficher quelle paire (ex: "ح ou هـ ?")

**Après-midi (1h)**
- [ ] Logique:
  - Random selection: une des 6 paires
  - Play audio distinction
  - Validér réponse (tester dans Airtable)
  - +30 pts si correct (difficulté = +5 vs exo 1)

**Tests** ✅
- [ ] Audio distinction clair
- [ ] Logique correction OK
- [ ] UI responsive

---

### Jour 5 | Exercice 4: TRAÇAGE SIMPLE

**Matin (1h30)**
- [ ] Créer page "Trace la Lettre" dans Bubble
- [ ] Ajouter canvas HTML5 (Bubble plugin ou custom)
- [ ] Afficher lettre fantôme en gris
- [ ] Enfant trace au doigt → ligne bleue

**Après-midi (1h30)**
- [ ] Logique:
  - Détecter si trace suffisant (simple: area > 50%)
  - Validation trace → +20 pts
  - Reset button
- [ ] Cycle les 12 lettres

**Tests** ✅
- [ ] Canvas responsive
- [ ] Traçage fluide
- [ ] Validation OK

---

### Jour 6 | Exercice 5: FLASHCARDS VOCABULAIRE

**Matin (1h)**
- [ ] Créer page "Le Mot" dans Bubble
- [ ] UI:
  - Grande image (couleur/objet)
  - Bouton ÉCOUTE (audio du mot)
  - Bouton RÉVÉLER (show arabe + français)
  - Boutons Previous/Next (swipe ou click)

**Après-midi (1h)**
- [ ] Logique:
  - Cycle 20 mots
  - Track "vu" vs "non vu"
  - Points pour viewing (5 pts par mot)
  - Enregistrer engagement

**Tests** ✅
- [ ] Navigation OK
- [ ] Audio play OK
- [ ] Reveal animation smooth

---

### Jour 7 | INTÉGRATION & TESTS

**Matin (1h30)**
- [ ] Vérifier les 5 exercices fonctionnent ensemble
- [ ] Test sur Tablet/Phone (responsive)
- [ ] Vérifier scoring cohérent

**Après-midi (1h30)**
- [ ] Bugfixes critiques
- [ ] Optimiser images (chargement rapide)
- [ ] Créer page d'accueil simple (menu 5 exercices)

**Soir (1h)**
- [ ] Documentation code
- [ ] Backup Bubble

**Checkpoint Fin SEMAINE 2** ✅
```
✅ 5 Exercices fonctionnels
✅ Scoring Airtable linké
✅ Responsive design OK
✅ Assets (audio/images) optimisés
✅ Prêt pour Phase 3 (Polish + Tests enfants)
```

---

## **SEMAINE 3 (7 jours) : POLISH, GAMIFICATION & TESTS**

### Jour 1-2 | Dashboard Maîtresse

**Jour 1 - Lundi**
- [ ] Créer page "Tableau de Bord" (protégée par code)
- [ ] Afficher:
  - Liste 4 enfants
  - Points totaux chacun
  - Exercices complétés
  - Dernière session

**Jour 2 - Mardi**
- [ ] Ajouter actions:
  - Bouton "Réinitialiser enfant"
  - Bouton "Export CSV" (scores)
  - Indicateur activité (badges "actif cette semaine")

**Tests** ✅
- [ ] Données refresh OK
- [ ] Export correct

---

### Jour 3 | Gamification & Badges

**Matin (1h)**
- [ ] Créer visual Badges dans app enfant:
  - Badge 1: "🎯 Je reconnais" (12 lettres OK)
  - Badge 2: "👂 Maître des sons" (6 phonèmes OK)
  - Badge 3: "📚 Vocabulaire" (20 mots OK)
  - Badge 4: "✏️ Traceur" (traçage 80%+)
  - Badge 5: "⭐ Semaine" (5 jours consécutifs)

**Après-midi (1h)**
- [ ] Afficher badges gagné dans page accueil
- [ ] Ajouter compteur global "points"
- [ ] Animations victoire (confetti rare, sauf badge)

**Tests** ✅
- [ ] Badges unlock correctement
- [ ] Animations fluides

---

### Jour 4 | Refinement UI/UX

**Matin (1h30)**
- [ ] Vérifier cohérence couleurs/fonts
- [ ] Responsive test complet (iPhone SE + iPad)
- [ ] Vitesse chargement pages (optimiser si besoin)

**Après-midi (1h)**
- [ ] Feedback audio: ajouter "son victoire" (ding simple)
- [ ] Message encouragement varié après exo:
  - "Bravo! 🎉"
  - "Excellent travail!"
  - "Continue comme ça!"

**Tests** ✅
- [ ] UI cohérent
- [ ] Pas lag sur mobile
- [ ] Feedback audio OK

---

### Jour 5 | Beta Test Jour 1 avec Enfants ⭐

**Toute la journée**
- [ ] Inviter 2-4 enfants tester app
- [ ] Regarder sans intervenir (noter frustrations)
- [ ] Tester sur LEURS devices (tablet/phone réels)
- [ ] Enregistrer temps/session
- [ ] Demander feedback simple (☺️ ou ☹️)

**Points à observer:**
- Comprenez-ils interface?
- Les sons sont-ils clairs?
- Exercices intéressants?
- Trop facile/difficile?
- Erreurs/bugs?

**Prendre notes** 📝 pour jour 6

---

### Jour 6 | Bugfixes & Ajustements

**Matin (1h)**
- [ ] Analyser feedback jour 5
- [ ] Corriger bugs critiques
- [ ] Ajuster difficulté si nécessaire

**Après-midi (2h)**
- [ ] Bugfixes de tous les exercices
- [ ] Réoptimiser si lag observé
- [ ] Re-test rapide

**Soir (1h)**
- [ ] Préparer pour test final jour 7

---

### Jour 7 | FINAL TEST + DÉPLOIEMENT MVP

**Matin (1h30)**
- [ ] Test complet avec maîtresses
- [ ] Vérifier dashboard maîtresse OK
- [ ] Vérifier scoring/enregistrement OK

**Après-midi (1h30)**
- [ ] Corriger derniers bugs
- [ ] Documenter tout
- [ ] Créer manuel utilisateur (simple, 1 page)

**Soir (1h)**
- [ ] ✅ MVP DÉPLOYÉ (publié dans Bubble)
- [ ] Envoyer accès aux maîtresses
- [ ] Fêter! 🎉

**Checkpoint Fin SEMAINE 3** ✅
```
✅ Dashboard maîtresse OK
✅ Gamification active
✅ Beta test réussi (feedback positif)
✅ Tous bugs critiques fixes
✅ MVP PUBLIÉ - Prêt utilisation estivale
```

---

## **JUILLET-AOÛT 2026 : AMÉLIORATION & PRÉPARATION LANCEMENT**

### Mises à Jour Légères
- [ ] Ajouter plus de vocabulaire (progressif)
- [ ] Créer skins/thèmes fun (Ramadan, Summer, etc.)
- [ ] Optimiser davantage
- [ ] Préparer V2 (28 lettres complètes)

### Avant Septembre
- [ ] Tester à nouveau avec tous les 4 enfants
- [ ] Former les maîtresses (30 min, tuto simple)
- [ ] Préparer guides parents (pour révision maison)
- [ ] Configurer backup automatique Airtable

---

## **SEPTEMBRE 2026 : GO LIVE! 🚀**

```
✅ App opérationnel
✅ 4 enfants actifs
✅ 2 maîtresses supervisent
✅ Parents encouragent (accès lecture-only possible)
✅ Collecte feedback pour V2
```

---

**À chaque checkpoint, valider avec les maîtresses avant de continuer!**

**Budget temps total**: ~80h (équipe: peut être parallélisé)
