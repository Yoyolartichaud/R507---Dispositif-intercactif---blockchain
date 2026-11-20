# BUT MMI 3e année — R507

## Projet Three.js — Visualisation pédagogique de la blockchain

### Fiche de suivi hebdomadaire — semaine 6

> Fiche complétée le 20 novembre 2026 à partir de l'historique du dépôt et de nos notes.

## 0. Informations générales

| Champ | Contenu |
|:---|:---|
| Groupe | « Le voyage de la bière » — Floryen Duflot, Yoan Malaure |
| Semaine | 6 |
| Dates couvertes | Du lundi 2 au dimanche 8 novembre 2026 |
| Membres présents | Floryen Duflot, Yoan Malaure |
| Lien dépôt / GitHub Projects | https://github.com/Yoyolartichaud/R507---Dispositif-intercactif---blockchain / GitHub Projects : aucun board à cette date |
| Lien démo (si disponible) | Pas encore disponible. |

## 1. Avancement

### 1.1 Réalisé
| Issue / tâche | Notion concernée | Statut | Preuve |
|:---|:---|:---|:---|
| Présentation du projet à l'enseignant (4 novembre). Retours : histoire trop linéaire ; ajouter un fork, plusieurs brasseries, plusieurs camions, plusieurs bars, pour montrer ce qui se passe en cas de triche. | 4, 5, 7 | — | Retours rapportés par Floryen |
| Prototype « distribution en réseau et forks » : trois brasseries, trois camions, trois bars sur une carte ; une tour de blocs qui se divise lors d'un fork ; la chaîne la plus longue gagne ; attaque d'un tricheur | 4, 5, 7 | En cours | 3 commits locaux du 4 novembre (577595c, 111a307, 8c55fc9), jamais envoyés sur GitHub |

### 1.2 Prévu mais non réalisé
| Tâche | Cause | Report |
|:---|:---|:---|
| Intégrer le fork à l'application rendue | Rendu visuel jugé pas assez clair (camions, routes, panneaux) | Abandonné pour la version rendue |
| Notion 6 : comparaison de deux mécanismes de consensus | Priorité donnée au fork demandé par l'enseignant | Semaine 7 |
| Second test utilisateur | Non réalisé cette semaine | Semaine 7 |
| Board GitHub Projects, issues et milestones | Non réalisé cette semaine | Semaine 7 |
| Déploiement en ligne | Dépôt privé | Semaine 7 |

### 1.3 État des 7 notions

| Notion obligatoire | État | Remarque / preuve |
|:---|:---|:---|
| Structure d'un bloc | Fonctionnel | Pas d'évolution dans la version rendue |
| Chaînage cryptographique | Fonctionnel | Pas d'évolution dans la version rendue |
| Immutabilité et détection de falsification | Fonctionnel | Pas d'évolution dans la version rendue |
| Réseau et décentralisation | Fonctionnel | Prototype local : plusieurs acteurs sur une carte, non intégré |
| Validation et minage | Fonctionnel | Prototype local : fork et règle de la chaîne la plus longue, non intégré |
| Comparaison d'au moins deux mécanismes de consensus | Non commencé | Le prototype du fork montre la règle de la chaîne la plus longue, mais ne compare pas deux mécanismes de consensus |
| Cycle de vie d'une transaction et scénario d'attaque illustré | En cours | Prototype local : attaque d'un tricheur sur une branche, non intégré ; double dépense non illustrée |

**Définitions des états :**

- `En cours` = une partie est implémentée mais incomplète ou non vérifiée ;
- `Fonctionnel` = le parcours prévu fonctionne localement au moins une fois ;
- `Testé` = il a été vérifié par au moins un test documenté (et, pour les tests externes, par une personne extérieure au groupe).
- `Non commencé` et `Bloqué` peuvent aussi être utilisés.

## 2. Répartition du travail

| Membre | Tâches / issues | Issues traitées | Commits |
|:---|:---|:---:|:---:|
| Floryen Duflot | Présentation à l'enseignant, prototype du fork (en binôme) | 0 (aucune issue) | 3 (locaux, non envoyés sur GitHub) |
| Yoan Malaure | Présentation à l'enseignant, prototype du fork (en binôme) | 0 (aucune issue) | 0 |

Nous avons travaillé en binôme, sur le même poste : choix, rédaction des demandes à l'IA, vérification et tests faits à deux. Les commits sont partis du compte GitHub de Floryen, ce qui explique qu'aucun ne soit au nom de Yoan.

## 3. GitHub Projects

| Question | Réponse |
|:---|:---|
| Issues créées | 0 : aucune issue n'existait à cette date. |
| Issues fermées | 0 |
| Nombre dans `Backlog` / `À faire` / `En cours` / `À vérifier` / `Terminé` | Aucun board GitHub Projects n'existait à cette date. |
| Board mis à jour pendant la semaine ? | Non : il n'existait pas. |
| Milestone concerné et état | Aucun milestone n'existait. Jalon du calendrier suivant : livraison du projet (15 novembre, 23h59). |

## 4. Choix de modélisation

| Question | Réponse |
|:---|:---|
| Fiches de `MMI-R507-projet-blockchain-CHOIX-MODELISATION.md` complétées | Aucune : le document n'était pas encore dans le dépôt. |
| Choix important et justification | Montrer le fork par une tour de blocs qui se divise, et colorer chaque participant selon la version qu'il a reçue, pour que le désaccord se voie sur la carte. |
| Choix remis en question | La distribution linéaire (un seul camion, un seul bar), jugée trop linéaire par l'enseignant. |

## 5. Tests utilisateurs

| Question | Réponse |
|:---|:---|
| Nombre de testeurs extérieurs cette semaine | 0 |
| Compréhension ou problème observé | Retour de l'enseignant, qui n'est pas un test utilisateur : histoire trop linéaire, fork absent. |
| Issue corrective | Pas d'issue créée : aucune issue n'existait. |

## 6. IA, difficultés et besoins

| Question | Réponse |
|:---|:---|
| Usage de l'IA et vérifications effectuées | Claude (Anthropic) a produit le prototype de la carte et du fork. Le groupe a jugé le rendu visuel pas assez clair et ne l'a pas intégré. |
| Blocage technique | Rendu de la carte : camions, routes et panneaux peu lisibles. |
| Blocage pédagogique ou organisationnel | Aucun. |
| Besoin d'un point enseignant | Point fait le 4 novembre. |

## 7. Objectifs de la semaine suivante

| Objectif | Responsable | Issue |
|:---|:---|:---|
| Décider d'intégrer ou non le fork | Floryen Duflot et Yoan Malaure | Aucune (pas d'issues) |
| Ajouter la notion 6 | Floryen Duflot et Yoan Malaure | Aucune (pas d'issues) |
| Créer le board, faire le second test, déployer sur GitHub Pages | Floryen Duflot et Yoan Malaure | Aucune (pas d'issues) |

## 8. Signaux d'alerte

- [ ] Le board n'a été mis à jour qu'aujourd'hui.
- [ ] La répartition est fortement déséquilibrée et non expliquée.
- [x] Nous n'avons pas encore atteint les 2 testeurs extérieurs requis.
- [x] Un choix de modélisation important n'est pas justifié.
- [x] Une notion n'a pas avancé depuis 2 semaines.

**Règle vérifiable d'absence d'avancement depuis 2 semaines :** Notion 6 (comparaison des mécanismes de consensus), non commencée depuis la semaine 1. Preuve vérifiée : aucun commit, aucune issue ni aucun test la concernant, dans le dépôt comme dans les commits locaux.

## 9. Validation

| Élément | Réponse |
|:---|:---|
| Fiche relue par tous | Oui |
| Date d'envoi | 20 novembre 2026 |
| Noms des membres | Floryen Duflot, Yoan Malaure |
