**LearnHub LMS**

Plateforme d\'apprentissage en ligne

*Plan de développement complet*

Version 1.0 --- 2026

**1. Résumé du projet**

LearnHub est une plateforme LMS (Learning Management System) destinée à
la mise en œuvre d\'un référentiel de formation existant. Elle regroupe
trois types d\'utilisateurs : les Apprenants, les Formateurs et les
Administrateurs, et s\'articule autour de cours vidéo et de quiz
interactifs.

**Objectifs principaux**

-   Digitaliser et structurer un référentiel de formation existant

-   Permettre aux apprenants de suivre des cours vidéo à leur rythme

-   Évaluer les apprenants via des quiz avec correction automatique

-   Donner aux formateurs les outils pour créer et gérer leur contenu

-   Fournir à l\'administrateur une vue globale sur les utilisateurs et
    la progression

**2. Architecture de la plateforme**

**2.1 Les trois rôles utilisateurs**

**Apprenant**

-   Consulter le catalogue des cours disponibles

-   Visionner les vidéos de formation par module

-   Répondre aux quiz et obtenir une correction immédiate

-   Suivre sa progression module par module

-   Obtenir une attestation en fin de parcours

**Formateur**

-   Créer et organiser des cours associés au référentiel

-   Uploader des vidéos et documents pédagogiques

-   Créer des quiz avec questions à choix multiples

-   Consulter les résultats et scores de ses apprenants

-   Modifier ou archiver un cours existant

**Administrateur**

-   Gérer les comptes utilisateurs (création, rôles, activation)

-   Importer et structurer le référentiel de formation

-   Accéder au tableau de bord global (statistiques, taux de complétion)

-   Configurer les paramètres de la plateforme

-   Exporter des rapports de progression

**2.2 Structure des données**

La base de données de la plateforme est organisée autour des entités
suivantes :

  ------------------ ------------------ ---------------------------------
  **Composant**      **Outil            **Rôle**
                     recommandé**       

  Utilisateurs       Table Users        Stocke nom, email, rôle, statut
                                        de chaque utilisateur

  Référentiel        Table Modules      Structure du référentiel :
                                        domaines, modules, objectifs

  Cours              Table Courses      Titre, vidéo, description, module
                                        associé, formateur

  Quiz               Table Quizzes      Questions, options de réponse,
                                        bonne réponse

  Progression        Table Progress     Avancement de chaque apprenant
                                        par cours et par quiz

  Résultats          Table Results      Score, date, tentatives pour
                                        chaque quiz passé
  ------------------ ------------------ ---------------------------------

**3. Plan de développement**

Le projet est découpé en 5 phases progressives, conçues pour un débutant
utilisant des outils no-code/low-code. Durée totale estimée : 4 à 6
mois.

  ------------- --------------- ---------------------- -------------------
  **Phase**     **Durée**       **Objectif**           **Livrables**

  Phase 1       2 semaines      Cadrage et conception  Maquettes validées,
                                                       référentiel
                                                       structuré

  Phase 2       3 semaines      Mise en place          Base de données,
                                technique              authentification

  Phase 3       4 semaines      Développement          Cours vidéo, quiz,
                                apprenant              progression

  Phase 4       3 semaines      Développement          Création de cours,
                                formateur              gestion quiz

  Phase 5       2 semaines      Administration &       Dashboard,
                                lancement              rapports, mise en
                                                       ligne
  ------------- --------------- ---------------------- -------------------

**Phase 1 --- Cadrage et conception (2 semaines)**

-   Lister tous les modules du référentiel existant et les hiérarchiser

-   Définir les parcours d\'apprentissage pour chaque profil
    d\'apprenant

-   Valider les maquettes de l\'interface (apprenant, formateur, admin)

-   Choisir les outils techniques (voir section 4)

-   Créer les comptes sur les plateformes choisies

**Phase 2 --- Mise en place technique (3 semaines)**

-   Créer la base de données avec toutes les tables nécessaires

-   Configurer le système d\'authentification (connexion / inscription)

-   Mettre en place les 3 rôles utilisateurs avec leurs droits d\'accès

-   Importer la structure du référentiel dans la base de données

-   Tester la connexion entre l\'interface et la base de données

**Phase 3 --- Espace Apprenant (4 semaines)**

-   Créer le catalogue des cours avec filtres par module

-   Intégrer le lecteur vidéo pour chaque leçon

-   Développer le système de quiz avec correction automatique

-   Construire le tableau de progression (barres, pourcentages)

-   Envoyer une attestation automatique en fin de parcours

**Phase 4 --- Espace Formateur (3 semaines)**

-   Créer le formulaire de création de cours (titre, vidéo, module)

-   Développer l\'éditeur de quiz (questions, choix, bonne réponse)

-   Permettre la publication / mise en brouillon d\'un cours

-   Afficher les résultats détaillés des apprenants par quiz

-   Permettre la modification et l\'archivage des cours

**Phase 5 --- Administration et lancement (2 semaines)**

-   Construire le tableau de bord avec statistiques globales

-   Créer les outils de gestion des utilisateurs (invitations, rôles)

-   Générer des rapports d\'activité exportables (CSV, PDF)

-   Tester la plateforme avec un groupe pilote d\'utilisateurs

-   Mettre en ligne et former les premiers formateurs

**4. Outils recommandés (sans code)**

Pour un débutant, nous recommandons une approche no-code combinant des
outils spécialisés et fiables.

  ------------------ ------------------ ---------------------------------
  **Composant**      **Outil            **Rôle**
                     recommandé**       

  Interface          Bubble.io          Créer toutes les pages et
  (front-end)                           l\'interface utilisateur sans
                                        code

  Base de données    Airtable           Stocker et organiser toutes les
                                        données de la plateforme

  Vidéos             Vimeo / Cloudflare Héberger et diffuser les vidéos
                     Stream             de cours de façon sécurisée

  Authentification   Bubble (natif)     Gérer la connexion et les rôles
                                        directement dans Bubble

  Quiz               Bubble + plugins   Construire des quiz interactifs
                                        avec correction automatique

  Emails             SendGrid           Envoyer des notifications,
                                        confirmations et attestations

  Stockage fichiers  AWS S3 ou          Stocker les vidéos, PDF et
                     Uploadcare         documents des cours

  Analytics          Google Analytics   Suivre le comportement des
                                        utilisateurs sur la plateforme
  ------------------ ------------------ ---------------------------------

**Alternative pour développeurs**

Si vous décidez plus tard de faire appel à un développeur, la stack
technique recommandée est :

-   Front-end : React.js ou Next.js

-   Back-end : Node.js avec Express ou Python avec Django

-   Base de données : PostgreSQL

-   Vidéos : Cloudflare Stream ou Mux

-   Authentification : Auth0 ou Supabase Auth

-   Hébergement : Vercel (front) + Railway ou Supabase (back)

**5. Détail des fonctionnalités clés**

**5.1 Module Quiz**

Le module quiz est central à la plateforme. Chaque leçon se termine par
un quiz automatique.

-   Questions à choix multiple (QCM) avec 4 options de réponse

-   Correction instantanée après validation

-   Score affiché en pourcentage avec seuil de réussite configurable

-   Possibilité de recommencer le quiz un nombre de fois défini

-   Historique des tentatives consultable par l\'apprenant et le
    formateur

-   Déclenchement de la leçon suivante seulement après réussite du quiz

**5.2 Gestion des utilisateurs**

-   Inscription par invitation uniquement (lien envoyé par email)

-   Attribution des rôles par l\'administrateur (Apprenant / Formateur)

-   Possibilité de désactiver un compte sans le supprimer

-   Réinitialisation du mot de passe par email

-   Profil utilisateur avec photo, nom et historique de formation

**5.3 Structure du référentiel**

-   Le référentiel est organisé en Domaines \> Modules \> Leçons

-   Chaque leçon est associée à une vidéo et un quiz

-   L\'administrateur peut ajouter, modifier ou archiver des éléments

-   L\'ordre des leçons est configurable par le formateur

-   Des prérequis peuvent être définis entre modules

**6. Budget estimatif mensuel**

  ---------------------- ------------------ -----------------------------
  **Outil**              **Coût mensuel**   **Notes**

  Bubble.io (Starter)    \~29 €/mois        Interface complète,
                                            authentification

  Airtable (Team)        \~20 €/mois        Base de données jusqu\'à 50
                                            000 enregistrements

  Vimeo (Standard)       \~20 €/mois        Hébergement vidéo sécurisé, 5
                                            To

  SendGrid (Essentials)  \~15 €/mois        Jusqu\'à 50 000 emails/mois

  Nom de domaine         \~10 €/an          Achat unique renouvelable
                                            chaque année

  **Total estimé**       **\~85 €/mois**    **Pour une équipe de 50
                                            utilisateurs environ**
  ---------------------- ------------------ -----------------------------

**7. Prochaines étapes immédiates**

Pour démarrer le projet dès maintenant, voici les 5 actions à mener
cette semaine :

**Étape 1 ---** Créer un compte gratuit sur Bubble.io et explorer les
templates LMS disponibles

**Étape 2 ---** Créer un compte Airtable et modéliser la structure du
référentiel (Domaines, Modules, Leçons)

**Étape 3 ---** Lister les 10 premiers cours à intégrer en priorité avec
leur contenu vidéo

**Étape 4 ---** Définir la liste des premiers utilisateurs (apprenants +
formateurs) à inviter

**Étape 5 ---** Planifier une session de travail hebdomadaire pour
avancer phase par phase

*Document généré par LearnHub --- Plan de développement v1.0*
