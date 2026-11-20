# BUT MMI 3e année — R507

## Projet Three.js — Visualisation pédagogique de la blockchain

### `MMI-R507-projet-blockchain-GRILLE-AUTOEVAL.md`

À remplir en groupe puis individuellement avant la soutenance, dans le dépôt. Elle sert à repérer les lacunes et préparer la soutenance ; elle n'est pas notée en elle-même. Toute note cochée doit être justifiée par une phrase ou une preuve.

> Grille remplie par le binôme le 20 novembre 2026.

## Échelle

| Niveau | Signification |
|:---:|:---|
| 0 | Non fait / absent |
| 1 | Ébauché, insuffisant |
| 2 | Fait mais partiel |
| 3 | Fait et satisfaisant |
| 4 | Très abouti et défendable |

## Partie 1 — Pertinence pédagogique (25 %)

| # | Critère | Score 0-4 | Justification / preuve |
|:---|:---|:---:|:---|
| 1.1 | Les 7 notions obligatoires sont toutes représentées conformément à la liste commune. | 2 | Six notions sur sept sont dans l'application. La notion 6 (comparaison de deux mécanismes de consensus) n'y est pas : elle a seulement été expliquée à l'oral. |
| 1.2 | Chaque notion possède une animation ou interaction observable. | 2 | Interactions pour les notions 1 à 5 et 7 : vue éclatée d'un bloc, machine à empreintes, triche sur le bloc n°3 puis vérification, cubes envoyés à chaque ordinateur, course des mineurs, signature à modifier. Aucune pour la notion 6. |
| 1.3 | Un utilisateur non initié comprend sans explication orale préalable. | 2 | Le test n°1 a montré quatre incompréhensions (`docs/tests-utilisateurs/TEST-01-etudiante-MMI2.md`). Elles ont été corrigées, mais les corrections n'ont pas été revérifiées par un testeur. |
| 1.4 | L'ordre est pédagogique et progressif. | 3 | Réseau, puis bloc, empreinte, chaîne, triche, puis transaction, signature, diffusion, minage et confirmations : chaque étape s'appuie sur la précédente. |
| 1.5 | Le fil rouge est cohérent. | 3 | Une même histoire du champ au verre ; la cliente lit la blockchain de traçabilité par un QR code avant de payer en bitcoin. |
| 1.6 | Les métaphores ne créent pas de fausse compréhension. | 2 | Ce qui est réel et ce qui est simplifié est écrit dans le README. Mais la blockchain de traçabilité utilise le minage, ce qu'une vraie blockchain d'entreprise ne ferait pas en général. |
| 1.7 | Au moins 2 testeurs extérieurs ont été sollicités et leurs retours intégrés. | 1 | Un seul testeur sur les deux demandés. |

**P1 = 15 / 28**

## Partie 2 — Argumentation des choix (25 %)

| # | Critère | Score 0-4 | Justification / preuve |
|:---|:---|:---:|:---|
| 2.1 | `MMI-R507-projet-blockchain-CHOIX-MODELISATION.md` est complet et couvre les 7 notions. | 3 | Document complet, avec une fiche par notion. La fiche de la notion 6 indique qu'elle n'a pas d'interaction dans l'application. |
| 2.2 | Formes et échelles sont justifiées. | 3 | Charte visuelle (section 2.5) et tableau « Représentation choisie » de chaque fiche de notion dans CHOIX-MODELISATION. |
| 2.3 | Couleurs et codes sont cohérents et accessibles. | 3 | Une couleur fixe par partie d'un bloc, un code vert / jaune / rouge pour les états, toujours accompagné d'un symbole et d'un mot (CHOIX-MODELISATION, section 2.5). |
| 2.4 | Animations et interactions servent la compréhension. | 3 | Chaque animation montre une action réelle : fabrication du bloc en 4 temps, empreinte du parent recopiée, copies envoyées, essais de nonce affichés. |
| 2.5 | Une alternative écartée est documentée par notion. | 3 | Une alternative écartée dans chacune des 7 fiches de CHOIX-MODELISATION, plus les métaphores écartées (section 2.4). |
| 2.6 | Les risques de mauvaise interprétation sont traités. | 3 | Chaque fiche de CHOIX-MODELISATION précise le risque de mauvaise compréhension et la fidélité de chaque élément (exacte, simplifiée, approximative). |
| 2.7 | Les décisions s'appuient sur les tests utilisateurs. | 3 | Quatre remarques du test n°1, quatre corrections décrites dans le compte rendu. |

**P2 = 21 / 28**

## Partie 3 — GitHub Projects (20 %)

| # | Critère | Score 0-4 | Justification / preuve |
|:---|:---|:---:|:---|
| 3.1 | Le board existe depuis la semaine 1 et utilise les 5 colonnes communes. | 0 | Aucun board GitHub Projects n'a été créé. |
| 3.2 | Issues granulaires et assignées. | 0 | Aucune issue. |
| 3.3 | Labels cohérents. | 0 | Aucune issue, donc aucun label. |
| 3.4 | Milestones obligatoires correspondant au calendrier. | 0 | Aucun milestone. |
| 3.5 | Commits réguliers et liés aux issues. | 1 | 6 commits, tous entre le 12 et le 14 octobre, aux messages clairs, mais non liés à des issues. |
| 3.6 | Le board reflète l'état réel. | 0 | Pas de board. |
| 3.7 | Répartition visible et expliquée. | 1 | Travail en binôme sur un même poste : choix, demandes à l'IA, vérification et tests faits à deux. Les commits sont partis du compte de Floryen, ce qui est expliqué dans les fiches de suivi ; la répartition n'est pas visible sur un board. |
| 3.8 | Retours transformés en issues puis traités. | 1 | Les retours du test n°1 ont été traités, mais sans issues. |
| 3.9 | Usage de l'IA déclaré. | 3 | Tableau « Usage de l'IA générative » dans le README. Il s'arrête au 13 octobre. |
| 3.10 | README complet. | 2 | Lancement, parcours, notions, code, tests et IA sont décrits ; il manque le lien du board, le lien de la démo et les rôles. |

**P3 = 8 / 40**

## Partie 4 — Interaction, UX et finition (15 %)

| # | Critère | Score 0-4 | Justification / preuve |
|:---|:---|:---:|:---|
| 4.1 | Navigation intuitive et éléments identifiables. | 3 | Un seul bouton principal pour avancer, une frise des étapes, des boutons « Recentrer » et « Vue d'ensemble ». |
| 4.2 | Textes lisibles et contrastés. | 3 | Texte sombre sur fond clair ; une boîte « Ce qui se passe » explique chaque étape. |
| 4.3 | Rythme des animations compréhensible. | 3 | L'utilisateur avance à son rythme ; environ 2 minutes d'animations sur tout le parcours. |
| 4.4 | Au moins 30 FPS sur ordinateur standard type poste de TP. | 0 | Non mesuré. |
| 4.5 | Aucun bug bloquant le parcours principal. | 3 | Parcours complet des 18 étapes vérifié sans erreur le 18 novembre 2026. |
| 4.6 | Déploiement en ligne réalisé. | 3 | En ligne sur GitHub Pages : https://yoyolartichaud.github.io/R507---Dispositif-intercactif---blockchain/ (chargement vérifié sans erreur le 20 novembre 2026). |

**P4 = 15 / 24**

## Partie 5 — Soutenance (15 %)

| # | Critère | Score 0-4 | Justification / preuve |
|:---|:---|:---:|:---|
| 5.1 | Démo répétée et plan B prévu. | 3 | Démo répétée en entier la veille, sans erreur. Plan B préparé : relancer la page, partage de connexion si Internet manque, boutons « Recentrer » et « Vue d'ensemble ». |
| 5.2 | Chaque membre justifie tous les choix. | 3 | Chacun a justifié les choix pendant la soutenance : fil rouge, style, métaphores, simplifications. |
| 5.3 | Chaque membre explique les 7 notions. | 3 | Chacun connaît les 7 notions ; la notion 6, absente de l'application, a été expliquée à l'oral. |
| 5.4 | Bilan du projet appuyé sur des preuves. | 3 | Bilan présenté avec la démo, le test utilisateur n°1 et ses corrections. |
| 5.5 | Temps de parole réparti dans les 20 minutes imparties. | 3 | Temps de parole réparti entre les deux membres. |
| 5.6 | Support dans le temps imparti. | 3 | Présentation et démo en 8 minutes, pour une limite de 10 minutes. |

**P5 = 18 / 24**

## Estimation de votre note

Additionnez les scores obtenus dans chaque partie : `P1 / 28`, `P2 / 28`, `P3 / 40`, `P4 / 24`, `P5 / 24`. La note sur 20 est :

`Note / 20 = (P1/28 × 5) + (P2/28 × 5) + (P3/40 × 4) + (P4/24 × 3) + (P5/24 × 3)`.

(15/28 × 5) + (21/28 × 5) + (8/40 × 4) + (15/24 × 3) + (18/24 × 3) = 2,68 + 3,75 + 0,80 + 1,88 + 2,25 = **11,36**

`Note = 11,36 / 20`

## Bilan individuel et actions

| Nom / prénom | Contribution, apprentissages, usage de l'IA, difficulté pour la soutenance |
|:---|:---|
| Duflot Floryen | Contribution, en binôme avec Yoan : cadrage, choix du style et de l'histoire, application, test utilisateur n°1 et corrections, prototype du fork ; commits depuis mon compte. Apprentissages : le fonctionnement d'une blockchain, que je ne connaissais pas au départ (bloc, empreinte, chaînage, minage, clés et signature). Usage de l'IA : Claude a produit l'essentiel du code, des décors et des textes ; nous avons choisi, fait tester, transmis les retours et demandé les corrections à deux. Difficulté : expliquer le code en détail. |
| Malaure Yoan | Contribution, en binôme avec Floryen : cadrage, choix du style et de l'histoire, application, test utilisateur n°1 et corrections, prototype du fork, mise en ligne sur GitHub Pages. Apprentissages : le fonctionnement d'une blockchain (bloc, empreinte, chaînage, minage, clés et signature). Usage de l'IA : demandes rédigées et vérifiées avec Floryen. Difficulté pour la soutenance : expliquer le code en détail. |

| Les 3 actions prioritaires | Responsable | Échéance |
|:---|:---|:---|
| Envoyer le lien de la démo en ligne à l'enseignant | Yoan Malaure | 20 novembre 2026 |
| Mesurer les images par seconde sur un poste de TP | Floryen Duflot | Dès que possible |
| Créer le board GitHub Projects, les milestones et les issues, puis faire le second test utilisateur | Floryen Duflot et Yoan Malaure | Dès que possible |
