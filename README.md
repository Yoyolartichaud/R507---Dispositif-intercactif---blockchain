# Le voyage d'une transaction

**La blockchain expliquée en 3D** — projet R507, BUT MMI 3e année (2026).

Une expérience web interactive réalisée avec Three.js pour faire comprendre le
fonctionnement d'une blockchain à une personne qui n'en a jamais entendu parler.
Ce n'est pas une vraie blockchain : c'est un outil de médiation scientifique, qui
traduit des notions abstraites en objets 3D que l'on peut manipuler.

> **État du projet : cadrage.** Le dépôt, le board et les premières issues sont en
> place ; le développement n'a pas commencé.

## Équipe

| Membre | Compte GitHub | Rôle principal |
|---|---|---|
| Floryen Duflot | _à compléter_ | _à définir_ |
| _à compléter_ | | |
| _à compléter_ | | |

## L'idée en une phrase

Alice veut envoyer 5 jetons à Bob sans passer par une banque. On suit ce paiement
de sa création à sa confirmation, et chaque étape du trajet fait découvrir une
notion.

Le public visé, le fil rouge et le parcours sont détaillés dans
[docs/CADRAGE.md](docs/CADRAGE.md).

## Notions obligatoires

1. **Structure d'un bloc** : données, hash du bloc, hash du bloc parent et, si pertinent, nonce.
2. **Chaînage cryptographique** : hash/empreinte cryptographique, lien avec le bloc parent et effet de la moindre modification.
3. **Immutabilité et détection de falsification** : une modification rend les empreintes incohérentes et doit être détectable par les autres nœuds.
4. **Réseau et décentralisation** : nœuds, copies distribuées et propagation des transactions/blocs, sans centre unique.
5. **Validation et minage** : vérification d'une transaction ou d'un bloc et, dans le cas du proof of work (PoW), recherche d'un nonce sous contrainte de difficulté.
6. **Comparaison d'au moins deux mécanismes de consensus** : par exemple proof of work (PoW) et proof of stake (PoS), ou proof of authority (PoA), en expliquant leurs différences, avantages et limites.
7. **Cycle de vie d'une transaction et scénario d'attaque illustré** : création, propagation, validation, inclusion dans un bloc, confirmation, puis illustration d'une attaque (par exemple double dépense ou altération d'un bloc) et de sa détection/limitation.

Chaque notion donnera lieu à une animation ou à une interaction observable, pas
seulement à un texte.

## Documentation

| Fichier | Rôle | État |
|---|---|---|
| [docs/CADRAGE.md](docs/CADRAGE.md) | Document de cadrage : public, fil rouge, parcours, organisation | Première version, à valider par le groupe |
| `docs/MMI-R507-projet-blockchain-CHOIX-MODELISATION.md` | Livrable officiel des choix de modélisation | Modèle à déposer puis à compléter |
| `docs/suivi/SEMAINE-01.md` à `SEMAINE-08.md` | Fiches de suivi hebdomadaire | Modèle à déposer, une fiche par semaine |
| `docs/MMI-R507-projet-blockchain-GRILLE-AUTOEVAL.md` | Auto-évaluation, à déposer avant la soutenance | À faire en fin de projet |

## Calendrier

| Jalon | Date (2026) | Attendu |
|---|---|---|
| Cadrage | 9 octobre, 17h | Groupe, dépôt, GitHub Projects et premières issues |
| Livraison du projet | 15 novembre, 23h59 | Dépôt GitHub, GitHub Projects et démo en ligne |
| Répétition finale | 19 novembre, 9h30-11h | Répétition entre les groupes |
| Soutenance | 19 novembre, 11h-12h30 | 20 minutes par groupe |

Ces jalons existent aussi sous forme de milestones GitHub.

## Organisation du travail

- **Board GitHub Projects** : _lien à ajouter_. Colonnes : Backlog, À faire,
  En cours, À vérifier, Terminé.
- **Issues** : une issue par tâche précise, assignée à un membre et rattachée à
  un milestone.
- **Commits et pull requests** : ils citent l'issue concernée (`#12`), et une PR
  qui termine une tâche la ferme avec `Closes #12`.
- **Suivi** : une fiche par semaine dans `docs/suivi/`.

## Démo en ligne

_À venir_ : déploiement prévu sur GitHub Pages.

## Usage de l'IA générative

Le sujet autorise l'IA générative à condition de la déclarer. Le groupe relit,
corrige et valide tout contenu généré avant de l'intégrer.

| Date | Outil | Usage |
|---|---|---|
| 12 octobre 2026 | Claude (Anthropic) | Structure du dépôt, première version du README et du document de cadrage, liste initiale des issues et des milestones |
