# Media Pack Checklist (Vocabulaire)

This app expects one image and one audio file for each vocabulary entry.

## Base Paths

- Images: `/resources/images/vocabulaire/`
- Audio: `/resources/audio/vocabulaire/`

## Naming Convention

- Image: `<categorie>-<index>.webp`
- Audio: `<categorie>-<index>.mp3`
- Example: `couleurs-1.webp`, `couleurs-1.mp3`

## Required Files

### couleurs (8)

`couleurs-1` ... `couleurs-8`

### nombres (10)

`nombres-1` ... `nombres-10`

### salutations (8)

`salutations-1` ... `salutations-8`

### classe (10)

`classe-1` ... `classe-10`

### animaux (6)

`animaux-1` ... `animaux-6`

### famille (6)

`famille-1` ... `famille-6`

### emotions (3)

`emotions-1` ... `emotions-3`

### corps (5)

`corps-1` ... `corps-5`

### nourriture (8)

`nourriture-1` ... `nourriture-8`

### consignes (5)

`consignes-1` ... `consignes-5`

### religieux (3)

`religieux-1` ... `religieux-3`

### outils (10)

`outils-1` ... `outils-10`

Total expected vocabulary media pairs: 82 image files + 82 audio files.

## Quick Fill Workflow

1. Export/prepare all images as `webp`.
2. Export/prepare all audios as `mp3`.
3. Drop files into the two `vocabulaire` folders using exact names above.
4. Open Flashcards page and verify:
   - image loads,
   - audio plays,
   - fallback placeholder/voice appears only when a file is missing.
