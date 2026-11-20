# BUT MMI 3e année — R507

## Projet Three.js — Visualisation pédagogique de la blockchain

### Fiche de suivi hebdomadaire — semaine 3

> Fiche complétée le 20 novembre 2026 à partir de l'historique du dépôt et de nos notes.

## 0. Informations générales

| Champ | Contenu |
|:---|:---|
| Groupe | « Le voyage de la bière » — Floryen Duflot, Yoan Malaure |
| Semaine | 3 |
| Dates couvertes | Du lundi 12 au dimanche 18 octobre 2026 |
| Membres présents | Floryen Duflot, Yoan Malaure |
| Lien dépôt / GitHub Projects | https://github.com/Yoyolartichaud/R507---Dispositif-intercactif---blockchain / GitHub Projects : aucun board à cette date |
| Lien démo (si disponible) | Pas encore disponible (lancement local avec `npm start`). |

## 1. Avancement

### 1.1 Réalisé
| Issue / tâche | Notion concernée | Statut | Preuve |
|:---|:---|:---|:---|
| Création du dépôt ; mail d'excuse à l'enseignant pour le retard | — | — | Commit 3037165 (12 octobre) |
| Document de cadrage et README | Toutes | — | `docs/CADRAGE.md`, commit 3037165 |
| Comparaison de trois styles visuels (Néon, Registre, Maquette) : choix du style Maquette | — | — | Prototype local, non versionné |
| Choix du fil rouge : le voyage du saumon, puis le voyage de la bière | Toutes | — | `docs/CADRAGE.md`, section 3 |
| Application jouable « Le voyage de la bière » : 18 étapes, du champ au paiement en bitcoin | 1, 2, 3, 4, 5, 7 | Fonctionnel | Commit eddf837 (13 octobre) |
| Test utilisateur n°1 (étudiante de MMI 2) | 1, 2, 4, 5 | Testé (version d'avant les corrections) | `docs/tests-utilisateurs/TEST-01-etudiante-MMI2.md`, commit 039a0c6 |
| Quatre corrections après le test : étape « réseau », explorateur de blocs, machine à empreintes, étape des mineurs | 2, 4, 5 | Fonctionnel (non revalidé par un testeur) | Commits eddf837 et 039a0c6 |
| Lancement avec `npm start` | — | Fonctionnel | Commit 9a3e862 (14 octobre) |

### 1.2 Prévu mais non réalisé
| Tâche | Cause | Report |
|:---|:---|:---|
| Board GitHub Projects, issues et milestones | Non réalisé cette semaine | Non reporté : jamais créés |
| Notion 6 : comparaison de deux mécanismes de consensus | Priorité donnée au parcours principal | Semaine 4 |
| Second test utilisateur | Pas de second testeur trouvé | Semaine 4 |
| Déploiement en ligne | Le dépôt est privé : GitHub Pages gratuit demande un dépôt public | Semaine 4 |

### 1.3 État des 7 notions

| Notion obligatoire | État | Remarque / preuve |
|:---|:---|:---|
| Structure d'un bloc | Fonctionnel | Vue éclatée d'un bloc en 4 parties ; explorateur de blocs (commit eddf837) |
| Chaînage cryptographique | Fonctionnel | Machine à empreintes, empreinte du parent recopiée, couleurs de l'explorateur. Ajoutée après le test n°1, non revalidée. |
| Immutabilité et détection de falsification | Fonctionnel | Modification du bloc n°3, vérification par les autres acteurs, réparation |
| Réseau et décentralisation | Fonctionnel | Quatre ordinateurs reliés, une copie chacun ; nœuds Bitcoin. Ajouté après le test n°1, non revalidé. |
| Validation et minage | Fonctionnel | Vérification de la signature par les nœuds ; course des mineurs et recherche du nonce |
| Comparaison d'au moins deux mécanismes de consensus | Non commencé | — |
| Cycle de vie d'une transaction et scénario d'attaque illustré | En cours | Création, signature, diffusion, mempool, bloc, confirmations ; attaques : montant modifié, bloc modifié. Double dépense non illustrée. |

**Définitions des états :**

- `En cours` = une partie est implémentée mais incomplète ou non vérifiée ;
- `Fonctionnel` = le parcours prévu fonctionne localement au moins une fois ;
- `Testé` = il a été vérifié par au moins un test documenté (et, pour les tests externes, par une personne extérieure au groupe).
- `Non commencé` et `Bloqué` peuvent aussi être utilisés.

## 2. Répartition du travail

| Membre | Tâches / issues | Issues traitées | Commits |
|:---|:---|:---:|:---:|
| Floryen Duflot | Dépôt, cadrage, README, application, test n°1 et corrections, lancement `npm start` (en binôme) | 0 (aucune issue) | 6 |
| Yoan Malaure | Dépôt, cadrage, README, application, test n°1 et corrections, lancement `npm start` (en binôme) | 0 (aucune issue) | 0 |

Nous avons travaillé en binôme, sur le même poste : choix, rédaction des demandes à l'IA, vérification et tests faits à deux. Les commits sont partis du compte GitHub de Floryen, ce qui explique qu'aucun ne soit au nom de Yoan.

## 3. GitHub Projects

| Question | Réponse |
|:---|:---|
| Issues créées | 0 : aucune issue n'existait à cette date. |
| Issues fermées | 0 |
| Nombre dans `Backlog` / `À faire` / `En cours` / `À vérifier` / `Terminé` | Aucun board GitHub Projects n'existait à cette date. |
| Board mis à jour pendant la semaine ? | Non : il n'existait pas. |
| Milestone concerné et état | Aucun milestone n'existait. Jalon du calendrier : cadrage, rattrapé le 12 octobre sans board ni milestones. |

## 4. Choix de modélisation

| Question | Réponse |
|:---|:---|
| Fiches de `MMI-R507-projet-blockchain-CHOIX-MODELISATION.md` complétées | Aucune : le document n'était pas encore dans le dépôt. |
| Choix important et justification | Le fil rouge « Le voyage de la bière » : une histoire concrète de traçabilité, où plusieurs entreprises doivent se faire confiance, suivie d'un paiement en bitcoin pour le vocabulaire courant. Le style Maquette : clair et rassurant pour un débutant. |
| Choix remis en question | Le voyage du saumon, remplacé par la bière. Un simple paiement d'une personne à une autre, jugé trop abstrait. |

## 5. Tests utilisateurs

| Question | Réponse |
|:---|:---|
| Nombre de testeurs extérieurs cette semaine | 1 |
| Compréhension ou problème observé | Le rôle du mineur, l'endroit où sont rangées les blockchains, leur forme lisible et l'empreinte n'étaient pas compris. |
| Issue corrective | Pas d'issue créée : aucune issue n'existait. Corrections faites directement, voir 1.1. |

## 6. IA, difficultés et besoins

| Question | Réponse |
|:---|:---|
| Usage de l'IA et vérifications effectuées | Claude (Anthropic) a produit la structure du dépôt, le cadrage, le code, les décors et les textes. Le groupe a choisi le style et l'histoire, fait tester l'application et demandé les corrections. Usage déclaré dans le README. |
| Blocage technique | Aucun. |
| Blocage pédagogique ou organisationnel | Démarrage en retard : dépôt créé après l'échéance du 9 octobre. |
| Besoin d'un point enseignant | Non. |

## 7. Objectifs de la semaine suivante

| Objectif | Responsable | Issue |
|:---|:---|:---|
| Ajouter la notion 6 | Floryen Duflot et Yoan Malaure | Aucune (pas d'issues) |
| Faire le second test utilisateur | Floryen Duflot et Yoan Malaure | Aucune (pas d'issues) |
| Créer le board GitHub Projects et les milestones | Floryen Duflot et Yoan Malaure | Aucune (pas d'issues) |

## 8. Signaux d'alerte

- [ ] Le board n'a été mis à jour qu'aujourd'hui.
- [ ] La répartition est fortement déséquilibrée et non expliquée.
- [x] Nous n'avons pas encore atteint les 2 testeurs extérieurs requis.
- [x] Un choix de modélisation important n'est pas justifié.
- [ ] Une notion n'a pas avancé depuis 2 semaines.

**Règle vérifiable d'absence d'avancement depuis 2 semaines :** Aucune notion concernée : les notions 1 à 5 et 7 ont avancé (commits eddf837 et 039a0c6). La notion 6 n'a pas commencé, mais la comparaison porte sur deux fiches seulement.

## 9. Validation

| Élément | Réponse |
|:---|:---|
| Fiche relue par tous | Oui |
| Date d'envoi | 20 novembre 2026 |
| Noms des membres | Floryen Duflot, Yoan Malaure |
