# Document de cadrage

Projet R507 — Visualisation pédagogique de la blockchain avec Three.js.

> Première version, à relire et à valider par tout le groupe. Les choix de
> représentation seront argumentés en détail dans le livrable officiel
> `MMI-R507-projet-blockchain-CHOIX-MODELISATION.md`.

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

**Le voyage d'une transaction.** Alice veut envoyer 5 jetons à Bob, sans banque
pour garantir le paiement. Comment tout le monde peut-il être sûr que ce paiement
est vrai, et qu'il ne sera jamais modifié ?

On suit cette transaction du début à la fin. La même transaction réapparaît à
chaque étape, ce qui donne un repère constant à l'utilisateur et relie les sept
notions entre elles.

## 4. Parcours

Une étape par notion obligatoire, dans l'ordre du sujet. Chaque étape contient au
moins une interaction dont l'effet se voit dans la scène 3D.

| Étape | Notion obligatoire | Dans le récit | Interaction prévue |
|---|---|---|---|
| 1 | Structure d'un bloc | Le paiement d'Alice est rangé dans un bloc | Cliquer sur le bloc pour l'ouvrir et explorer ses parties : données, hash du bloc, hash du bloc parent, nonce |
| 2 | Chaînage cryptographique | Le bloc est accroché aux précédents | Modifier un caractère des données : le hash change entièrement et le lien avec le bloc suivant se rompt |
| 3 | Immutabilité et détection de falsification | Quelqu'un tente de changer « 5 » en « 500 » | Falsifier un bloc sur un nœud, puis lancer la vérification : les autres nœuds détectent l'incohérence et rejettent la copie |
| 4 | Réseau et décentralisation | La transaction circule de nœud en nœud | Faire partir la transaction, éteindre des nœuds et constater qu'elle passe quand même ; comparer avec un système centralisé |
| 5 | Validation et minage | La transaction est vérifiée puis minée | Vérifier des transactions (dont des invalides), puis miner : recherche d'un nonce selon une difficulté réglable |
| 6 | Comparaison d'au moins deux mécanismes de consensus | Qui a le droit d'ajouter le bloc ? | Lancer des tours en PoW et en PoS côte à côte, faire varier sa puissance de calcul ou sa mise, comparer les résultats |
| 7 | Cycle de vie d'une transaction et scénario d'attaque illustré | Le trajet complet, puis : et si Alice trichait ? | Dérouler création, propagation, validation, inclusion, confirmation ; puis tenter une double dépense et voir pourquoi elle échoue |

Ces interactions sont des intentions de départ. Elles seront précisées,
justifiées et éventuellement modifiées dans le livrable de choix de modélisation.

## 5. Choix techniques

| Élément | Choix | Raison |
|---|---|---|
| Rendu 3D | Three.js | Imposé par le sujet |
| Outil de développement | Vite | Serveur local rapide, build statique simple à déployer |
| Hébergement | GitHub Pages | Recommandé par le sujet, gratuit, lié au dépôt |
| Gestion de projet | GitHub Projects, issues, milestones | Imposé par le sujet |

Contraintes mesurables reprises du sujet :

- **Fluidité** : le parcours principal tourne à 30 FPS ou plus sur un poste de TP
  équipé d'un navigateur récent, sans blocage qui empêche de comprendre.
- **Déploiement en ligne** : obligatoire.
- **Tests utilisateurs** : au moins 2 personnes extérieures au groupe ; leurs
  observations sont consignées et donnent lieu, si nécessaire, à des issues.

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
