# Le voyage de la bière

**La blockchain expliquée en 3D, du champ au verre** — projet R507, BUT MMI 3e année (2026).

Une expérience web interactive réalisée avec Three.js pour faire comprendre le
fonctionnement d'une blockchain à une personne qui n'en a jamais entendu parler.
Ce n'est pas une vraie blockchain : c'est un outil de médiation scientifique, qui
traduit des notions abstraites en objets 3D que l'on peut manipuler.

**Démo en ligne : https://yoyolartichaud.github.io/R507---Dispositif-intercactif---blockchain/**

> **État du projet : version rendue et soutenue le 19 novembre 2026.** Le parcours
> complet compte 18 étapes, du champ au paiement. Les corrections demandées après
> la soutenance sont faites sur la branche `post-soutenance` (voir plus bas).

## Équipe

| Membre | Compte GitHub | Rôle principal |
|---|---|---|
| Floryen Duflot | [@Flow7L](https://github.com/Flow7L) | Binôme : histoire, style, application, tests ; commits depuis son compte |
| Yoan Malaure | [@Yoyolartichaud](https://github.com/Yoyolartichaud) | Binôme : histoire, style, application, tests ; propriétaire du dépôt, mise en ligne sur GitHub Pages |

Nous avons travaillé en binôme, sur le même poste : choix, demandes à l'IA,
vérification et tests faits à deux. C'est pourquoi les commits viennent
presque tous du compte de Floryen.

## L'idée en une phrase

On suit une bière, de la moisson de l'orge jusqu'au verre. À chaque étape (ferme,
brasserie, transport, bar), des informations sont écrites dans une blockchain de
traçabilité. Puis la cliente, Léa, paie sa bière en satoshis, la monnaie du réseau Bitcoin : on découvre ses
clés, sa signature, les mineurs et les confirmations.

Le public visé, le fil rouge et le parcours sont détaillés dans
[docs/CADRAGE.md](docs/CADRAGE.md).

## Lancer le projet

Il faut Node.js et une connexion Internet (Three.js est chargé depuis un CDN).
Il n'y a rien à installer : pas besoin de `npm install`.

```bash
npm start
```

(`npm run dev` et `node serveur.mjs` font exactement la même chose.)

Puis ouvrir `http://localhost:5183` dans un navigateur récent.

## Le parcours

On avance avec le bouton principal du panneau de gauche. La boîte « Ce qui se
passe » explique chaque étape en quelques phrases.

| Moment | Ce qui se passe | Ce qu'on apprend |
|---|---|---|
| Le réseau | Quatre ordinateurs apparaissent, reliés par des câbles | Où est rangée une blockchain : nœud, réseau, copie |
| La moisson | Le tracteur récolte l'orge ; trois enregistrements entrent dans un bloc | Bloc, plusieurs données par bloc |
| L'empreinte | Une machine à empreintes : on tape un texte, son code change | Empreinte (hash) |
| La brasserie | Un deuxième bloc s'accroche au premier | Chaîne de blocs |
| Le transport | Panne de climatisation, écrite automatiquement ; on peut tenter de l'effacer | Falsification détectée, immutabilité |
| Le bar | Quatrième bloc | Blockchain privée et blockchain publique |
| Le paiement | Léa ouvre son portefeuille, prépare et signe une transaction | Clé privée, clé publique, adresse, signature |
| Le réseau Bitcoin | La transaction est vérifiée, attend, puis les mineurs font la course | Nœuds, mempool, mineurs, preuve de travail |
| Les confirmations | D'autres blocs s'ajoutent, le bar sert la bière | Confirmation |

À tout moment :

- **cliquer sur un bloc** l'ouvre en vue éclatée, avec ses quatre parties expliquées ;
- **cliquer sur un ordinateur** (un nœud ou un mineur) affiche sa fiche : son rôle,
  sa copie de la blockchain bloc par bloc, et s'il est d'accord avec les autres ;
- le bouton **« Lire la blockchain »** affiche les chaînes sous forme de tableau,
  comme le fait un explorateur de blocs.

## Notions obligatoires : où les trouver

| Notion du sujet | Dans l'expérience | État |
|---|---|---|
| 1. Structure d'un bloc | Vue éclatée d'un bloc : données, empreinte du parent, nonce, empreinte du bloc | Fait |
| 2. Chaînage cryptographique | Machine à empreintes ; chaque bloc recopie l'empreinte du précédent (lien visible, couleurs dans l'explorateur) | Fait |
| 3. Immutabilité et détection de falsification | Modifier les données d'un bloc : l'empreinte change, le lien se rompt, les autres ordinateurs refusent, la copie est réparée | Fait |
| 4. Réseau et décentralisation | Des ordinateurs reliés, une copie chacun ; blocs et transactions diffusés à tous, sans centre | Fait, sans démonstration de panne d'un nœud |
| 5. Validation et minage | Les nœuds vérifient la signature ; les mineurs font la course pour trouver le nonce | Fait, difficulté non réglable |
| 6. Comparaison d'au moins deux mécanismes de consensus | Pas d'interaction dans l'application. Comparaison preuve de travail, preuve d'enjeu et preuve d'autorité présentée à l'oral et rédigée dans le document de choix de modélisation (section 4.6) | **Non représentée dans l'application** |
| 7. Cycle de vie d'une transaction et scénario d'attaque illustré | Création, signature, diffusion, vérification, mempool, inclusion dans un bloc, confirmations ; attaques : montant modifié après signature, bloc altéré | Fait, double dépense non illustrée |

Les sept notions, dans leur formulation complète, figurent dans le sujet et dans
[docs/CADRAGE.md](docs/CADRAGE.md).

## Ce qui est réel, ce qui est simplifié

- **Réel :** les empreintes sont de vrais SHA-256 ; la recherche du nonce essaie
  réellement les nombres un par un ; les signatures sont calculées par la
  cryptographie du navigateur (ECDSA, la même famille que Bitcoin).
- **Simplifié :** la difficulté du minage est très faible (une empreinte qui
  commence par « 00 ») ; le format des adresses est simplifié ; les numéros de
  blocs Bitcoin et les transactions sont inventés ; une blockchain de
  traçabilité n'utilise en général pas le minage ; le réseau ne compte que
  quelques ordinateurs.

## Organisation du code

| Fichier | Rôle |
|---|---|
| `index.html`, `style.css` | La page : panneau d'explications à gauche, scène 3D à droite |
| `js/main.js` | Le chef d'orchestre : scène, histoire étape par étape, vue éclatée, paiement |
| `js/blockchain.js` | La logique, sans 3D : empreinte d'un bloc, preuve de travail, contenu de l'histoire |
| `js/sha256.js` | Le calcul des empreintes |
| `js/cles.js` | Les clés du portefeuille et la signature d'une transaction |
| `js/objets3d.js` | Les objets liés à la blockchain : bloc, lien, ordinateur, carte de transaction |
| `js/decor.js` | Le décor : champ, tracteur, brasserie, camion, bar, terrasse |
| `js/anim.js` | Les petites animations |
| `serveur.mjs` | Un serveur local pour afficher le projet |

## Tests utilisateurs

Les comptes rendus sont dans [docs/tests-utilisateurs/](docs/tests-utilisateurs/README.md).
Un test a été mené avec une étudiante de MMI 2e année : ses quatre remarques ont
donné lieu à quatre corrections. Le sujet en demande deux : le second test n'a
pas été fait.

## Documentation

| Fichier | Rôle | État |
|---|---|---|
| [docs/CADRAGE.md](docs/CADRAGE.md) | Document de cadrage : public, fil rouge, parcours, organisation | Fait |
| [docs/MMI-R507-projet-blockchain-CHOIX-MODELISATION.md](docs/MMI-R507-projet-blockchain-CHOIX-MODELISATION.md) | Livrable officiel des choix de modélisation, une fiche par notion | Fait |
| [docs/suivi/](docs/suivi/) | Fiches de suivi hebdomadaire, semaines 1 à 6 | Faites (rédigées le 20 novembre 2026) |
| [docs/MMI-R507-projet-blockchain-GRILLE-AUTOEVAL.md](docs/MMI-R507-projet-blockchain-GRILLE-AUTOEVAL.md) | Auto-évaluation du binôme | Faite |
| [docs/tests-utilisateurs/](docs/tests-utilisateurs/README.md) | Comptes rendus des tests utilisateurs | 1 test sur 2 |

## Calendrier

| Jalon | Date (2026) | Attendu |
|---|---|---|
| Cadrage | 9 octobre, 17h | Groupe, dépôt, GitHub Projects et premières issues |
| Livraison du projet | 15 novembre, 23h59 | Dépôt GitHub, GitHub Projects et démo en ligne |
| Répétition finale | 19 novembre, 9h30-11h | Répétition entre les groupes |
| Soutenance | 19 novembre, 11h-12h30 | 20 minutes par groupe |

Ces jalons existent aussi sous forme de milestones GitHub.

## Organisation du travail

- **Board GitHub Projects, issues et milestones** : ils n'ont pas été créés
  pendant le projet. C'est la principale lacune de notre gestion de projet.
- **Commits** : messages en français, préfixés par le type de changement.
- **Branches** : `main` contient la version rendue ; `post-soutenance` contient
  les corrections demandées après la soutenance.
- **Suivi** : une fiche par semaine dans `docs/suivi/`.

## Démo en ligne

https://yoyolartichaud.github.io/R507---Dispositif-intercactif---blockchain/

Publiée avec GitHub Pages depuis la branche `main`. L'application ne demande
aucune étape de construction.

## Corrections après la soutenance

Faites sur la branche `post-soutenance`, à la demande de l'enseignant :

- **Fiche d'un nœud** : un clic sur un ordinateur (nœud de la traçabilité, nœud
  ou mineur Bitcoin) ouvre sa fiche : son rôle, ce qu'il vérifie, sa copie de la
  blockchain bloc par bloc, s'il est d'accord avec les autres et, pour Bitcoin, les
  transactions en attente dans sa mempool. Si sa copie a été modifiée, la fiche
  l'indique.
- **Paiement en satoshis** : tous les textes du paiement parlent en satoshis, la
  plus petite unité du bitcoin (prix, frais, solde, récompense des mineurs).
- **README** mis à jour.

## Usage de l'IA générative

Le sujet autorise l'IA générative à condition de la déclarer. Le groupe choisit
le style, l'histoire et le contenu, teste, et demande les corrections. Chaque
membre relit le code généré pour pouvoir l'expliquer en soutenance.

| Date | Outil | Usage |
|---|---|---|
| 12 octobre 2026 | Claude (Anthropic) | Structure du dépôt, première version du README et du document de cadrage, liste initiale des issues et des milestones |
| 13 octobre 2026 | Claude (Anthropic) | Maquette comparant trois styles visuels ; prototype de blockchain manipulable ; code, décors 3D et textes de l'application ; corrections après le test utilisateur n°1 ; mise à jour du README et du cadrage ; mise en forme du compte rendu de test |
| 14 octobre 2026 | Claude (Anthropic) | Lancement avec `npm start` |
| 4 novembre 2026 | Claude (Anthropic) | Prototype du fork (plusieurs brasseries, camions et bars), non intégré : rendu jugé pas assez clair |
| 18 novembre 2026 | Claude (Anthropic) | Fiche de préparation de la soutenance |
| 20 novembre 2026 | Claude (Anthropic) | Rédaction du document de choix de modélisation, des fiches de suivi et de la grille d'auto-évaluation, relus et complétés par le binôme ; fiche d'un nœud et paiement en satoshis ; mise à jour du README |

L'abus d'alcool est dangereux pour la santé, à consommer avec modération.
