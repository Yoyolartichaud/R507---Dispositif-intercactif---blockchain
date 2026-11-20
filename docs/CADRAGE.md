# Document de cadrage

Projet R507 — Visualisation pédagogique de la blockchain avec Three.js.

> Document validé par le binôme. Les choix de représentation sont argumentés en
> détail dans le livrable officiel
> [MMI-R507-projet-blockchain-CHOIX-MODELISATION.md](MMI-R507-projet-blockchain-CHOIX-MODELISATION.md).

## 1. Objectif

Faire comprendre le fonctionnement d'une blockchain à une personne non initiée,
grâce à une expérience web en 3D que l'on manipule soi-même. Le projet relève de
la médiation scientifique : il ne s'agit pas de coder une blockchain réelle, mais
de traduire des notions abstraites en représentations spatiales, animées et
interactives.

Réussite visée : après le parcours, l'utilisateur sait expliquer avec ses mots
pourquoi il est très difficile de falsifier une blockchain.

## 2. Public cible

Un **utilisateur non initié**, au sens du sujet : une personne extérieure au
groupe, qui n'a pas suivi le cours R507 et qui ne reçoit aucune explication orale
avant de commencer.

Conséquences pour la conception :

- aucun prérequis technique, vocabulaire introduit au fur et à mesure ;
- un glossaire toujours accessible (hash, empreinte cryptographique,
  immutabilité, nonce, consensus) ;
- des consignes courtes, visibles à l'écran, qui disent quoi faire ;
- une expérience qui se parcourt seule, sans accompagnement.

## 3. Fil rouge narratif

**Le voyage de la bière, du champ au verre.** On suit une bière de la moisson de
l'orge jusqu'au verre de la cliente. L'histoire se déroule en deux temps.

1. **La traçabilité.** À chaque étape (ferme, brasserie, transport, bar), des
   informations sont écrites dans une blockchain que les quatre acteurs
   possèdent chacun en copie. Pendant le transport, une panne de climatisation
   est enregistrée automatiquement : le transporteur aimerait l'effacer, et
   l'utilisateur peut essayer à sa place.
2. **Le paiement.** La cliente, Léa, paie sa bière en bitcoin. On découvre son
   portefeuille et ses clés, la signature de la transaction, sa diffusion sur le
   réseau, la course des mineurs et les confirmations.

Ce fil rouge a été choisi parce qu'il est concret : la traçabilité d'un aliment
est un usage réel des blockchains, et la panne du camion donne une raison
évidente de vouloir tricher. Le paiement en bitcoin permet ensuite d'introduire
le vocabulaire le plus courant. Deux pistes antérieures ont été écartées : un
simple paiement entre deux personnes (trop abstrait) et le voyage d'un saumon
(même idée, remplacée par la bière).

## 4. Parcours

Le parcours suit l'histoire, et non l'ordre des notions du sujet. Chaque notion y
est traitée par au moins une interaction dont l'effet se voit dans la scène 3D.

| Notion obligatoire | Dans le récit | Interaction |
|---|---|---|
| 1. Structure d'un bloc | Chaque étape du voyage écrit un bloc | Cliquer sur un bloc pour l'ouvrir en vue éclatée : données, empreinte du parent, nonce, empreinte du bloc |
| 2. Chaînage cryptographique | Le bloc de la brasserie s'accroche à celui de la ferme | Taper un texte dans la machine à empreintes et voir le code changer ; voir chaque bloc recopier l'empreinte du précédent |
| 3. Immutabilité et détection de falsification | Le transporteur veut effacer la panne de climatisation | Modifier les données d'un bloc, puis faire vérifier : les autres ordinateurs détectent l'écart et refusent la copie |
| 4. Réseau et décentralisation | Ferme, brasserie, transporteur et bar ont chacun un ordinateur | Voir les ordinateurs reliés et leurs copies se mettre à jour ; voir la transaction diffusée à tous les nœuds |
| 5. Validation et minage | Le paiement de Léa doit être inscrit | Voir les nœuds vérifier la signature, puis les mineurs faire la course pour trouver le nonce |
| 6. Comparaison d'au moins deux mécanismes de consensus | Une blockchain privée entre entreprises, une blockchain publique | **À concevoir** : comparer la preuve de travail de Bitcoin à un mécanisme adapté à quelques acteurs connus |
| 7. Cycle de vie d'une transaction et scénario d'attaque illustré | Léa paie sa bière en bitcoin | Dérouler création, signature, diffusion, vérification, mempool, inclusion, confirmations ; jouer le pirate en changeant le montant après signature |

Les choix de représentation seront justifiés un par un dans le livrable de choix
de modélisation.

## 5. Choix techniques

| Élément | Choix | Raison |
|---|---|---|
| Rendu 3D | Three.js | Imposé par le sujet |
| Outil de développement | Aucune étape de construction : modules JavaScript natifs, Three.js chargé depuis un CDN | Code lisible tel quel, déployable sans transformation |
| Style visuel | « Maquette » : fond clair, blocs pastel arrondis, ombres douces | Rassurant et lisible pour un non-initié ; choisi parmi trois directions comparées en 3D |
| Hébergement | GitHub Pages | Recommandé par le sujet, gratuit, lié au dépôt |
| Gestion de projet | GitHub Projects, issues, milestones | Imposé par le sujet |

Contraintes mesurables reprises du sujet :

- **Fluidité** : le parcours principal tourne à 30 FPS ou plus sur un poste de TP
  équipé d'un navigateur récent, sans blocage qui empêche de comprendre.
- **Déploiement en ligne** : obligatoire.
- **Tests utilisateurs** : au moins 2 personnes extérieures au groupe ; leurs
  observations sont consignées et donnent lieu, si nécessaire, à des issues.
  Les comptes rendus sont dans [tests-utilisateurs/](tests-utilisateurs/README.md).

## 6. Livrables

1. Application Three.js et dépôt GitHub.
2. GitHub Projects actif, avec les colonnes obligatoires et les milestones.
3. Document de cadrage (ce fichier) et README.
4. `MMI-R507-projet-blockchain-CHOIX-MODELISATION.md`, livrable officiel.
5. Fiches hebdomadaires `docs/suivi/SEMAINE-01.md` à `SEMAINE-08.md`.
6. `MMI-R507-projet-blockchain-GRILLE-AUTOEVAL.md`, avant la soutenance.
7. Démonstration fonctionnelle et support de soutenance.

## 7. Calendrier

| Jalon | Date (2026) | Attendu |
|---|---|---|
| Présentation du projet | 1er octobre | — |
| Cadrage | 9 octobre, 17h | Groupe de 2 ou 3, dépôt, GitHub Projects et premières issues |
| Livraison du projet | 15 novembre, 23h59 | Dépôt GitHub, GitHub Projects et démo |
| Répétition finale | 19 novembre, 9h30-11h | Répétition entre les groupes |
| Soutenance | 19 novembre, 11h-12h30 | 20 minutes par groupe |

**Point à confirmer auprès de l'enseignant :** le calendrier commun indique une
livraison le 15 novembre à 23h59, alors que la partie « Cadre et livrables » du
sujet parle d'un rendu final le 18 novembre à 17h. Tant que ce n'est pas tranché,
le groupe vise le 15 novembre.

Étapes de travail prévues entre le cadrage et la livraison, dans l'ordre du
sujet : recherche et scénarisation, prototype, mécaniques, UX et accessibilité,
tests, finalisation.

## 8. Organisation

- **Board GitHub Projects** avec exactement cinq colonnes : Backlog, À faire,
  En cours, À vérifier, Terminé.
- **Milestones** alignés sur les jalons du calendrier.
- **Issues** granulaires (une tâche précise par issue), assignées à un membre,
  rattachées à un milestone, et liées aux commits et aux pull requests.
- **Passage en « À vérifier »** : une tâche terminée est relue par un autre
  membre avant d'aller dans « Terminé ».
- **Fiche de suivi** rédigée chaque fin de semaine et déposée dans `docs/suivi/`.
- **Compréhension partagée** : chaque membre doit pouvoir expliquer tout le
  projet en soutenance, y compris les parties qu'il n'a pas réalisées.

## 9. Usage de l'IA générative

L'IA générative est utilisée et déclarée de façon transparente, comme le demande
le sujet. Règle du groupe : rien de généré n'est intégré sans avoir été compris,
vérifié et, si besoin, corrigé. Les usages sont consignés dans le README et dans
les fiches hebdomadaires.
