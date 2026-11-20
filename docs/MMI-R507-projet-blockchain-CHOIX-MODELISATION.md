# BUT MMI 3e année — R507

## Projet Three.js — Visualisation pédagogique de la blockchain

### `MMI-R507-projet-blockchain-CHOIX-MODELISATION.md` — livrable officiel

Ce document détaillé est le **livrable officiel** consacré aux choix de modélisation. Il compte pour 25 % de la note. Il doit être complété au fur et à mesure du projet, avec une section par notion, au format `docs/MMI-R507-projet-blockchain-CHOIX-MODELISATION.md`. Chaque choix doit expliquer sa valeur pédagogique, une alternative écartée et l'effet des tests utilisateurs.

## 1. Informations générales

| Champ | Contenu |
|:---|:---|
| Groupe | « Le voyage de la bière » |
| Membres et rôles | Floryen Duflot et Yoan Malaure, en binôme sur un même poste : choix de l'histoire et du style, rédaction des demandes à l'IA, vérification, tests. Commits depuis le compte de Floryen ; mise en ligne sur GitHub Pages par Yoan. |
| Public cible | Une personne non initiée : extérieure au groupe, n'ayant pas suivi le cours R507, sans explication orale avant de commencer. |
| Lien vers la démo | https://yoyolartichaud.github.io/R507---Dispositif-intercactif---blockchain/ |
| Lien vers GitHub Projects | Aucun board n'a été créé pendant le projet. |
| Version et date de mise à jour | Version rendue (commit 9a3e862). Document rédigé le 20 novembre 2026. |

## 2. Univers visuel et métaphore principale

### 2.1 Public cible et objectif

Le public est un adulte curieux qui n'a jamais entendu expliquer la blockchain, ou seulement à travers le bitcoin. Il ne connaît ni le mot « hash » ni le mot « nœud ». L'expérience se parcourt seule : un bouton principal pour avancer, une boîte « Ce qui se passe » qui explique chaque étape en quelques phrases, un lexique toujours accessible.

À la fin, l'utilisateur doit pouvoir expliquer avec ses mots :

- qu'une blockchain est un registre **copié chez tous les participants**, sans serveur central ;
- que chaque bloc est **scellé par une empreinte** et **attaché au précédent** par l'empreinte de celui-ci ;
- pourquoi il est **très difficile de falsifier** un bloc : la modification se voit, et les autres copies la refusent ;
- ce que sont un **portefeuille**, des **clés**, une **signature**, un **mineur** et une **confirmation**.

### 2.2 Métaphore retenue

**Le voyage de la bière, du champ au verre.** On suit une bière en deux temps.

1. **La traçabilité (blockchain privée).** À chaque étape (ferme, brasserie, transport, bar), l'acteur concerné écrit un bloc de trois enregistrements dans une blockchain que les quatre acteurs possèdent chacun en copie. Pendant le transport, la climatisation du camion tombe en panne (31 °C) : le capteur l'écrit, et le transporteur aurait intérêt à l'effacer. L'utilisateur essaie de tricher à sa place.
2. **Le paiement (blockchain publique).** La cliente, Léa, lit l'histoire de sa bière par un QR code, puis la paie en bitcoin : portefeuille, clés, signature, diffusion, mempool, course des mineurs, confirmations.

L'univers visuel est une **maquette** : un plateau clair, des bâtiments et des véhicules faits de formes arrondies, des couleurs pastel. Les blocs sont posés sur deux étagères au fond de la scène, une par blockchain, comme des objets qu'on peut prendre en main.

**Comment la métaphore porte les 7 notions sans se confondre avec la réalité :**

| Notion | Ce que l'histoire montre | Ce qui est rappelé comme technique |
|:---|:---|:---|
| 1. Structure d'un bloc | Un bloc par étape du voyage, avec ses enregistrements | Les 4 parties sont nommées avec leur vrai nom dans la vue éclatée |
| 2. Chaînage | Chaque étape s'accroche à la précédente | L'empreinte est un vrai SHA-256, calculé en direct |
| 3. Immutabilité | Le transporteur veut effacer la panne | La détection passe par la comparaison des empreintes entre copies |
| 4. Réseau | Chaque acteur a son ordinateur | Les ordinateurs sont appelés « nœuds » et montrent leur copie |
| 5. Validation et minage | Les mineurs font la course pour écrire le bloc de Léa | Le nonce est réellement cherché, essai par essai |
| 6. Consensus | Expliquée à l'oral (voir section 4.6) | — |
| 7. Cycle de vie et attaque | Le paiement de Léa, du téléphone au verre servi | Les signatures sont de vraies signatures ECDSA |

Pour ne pas confondre métaphore et réalité, le README contient une section « Ce qui est réel, ce qui est simplifié », et les textes signalent les simplifications (« Ici, le format de l'adresse est simplifié »).

### 2.3 Justification et limites

| Question | Réponse |
|:---|:---|
| Quelles propriétés deviennent évidentes ? | La copie partagée (quatre ordinateurs avec le même nombre de blocs), le chaînage (une bulle part de l'empreinte d'un bloc vers la case « parent » du suivant), la détection de la triche (les autres ordinateurs refusent la copie modifiée), l'intérêt de tricher (le transporteur paierait si la bière est abîmée). |
| Quelles propriétés sont difficiles à représenter ou risquent d'être déformées ? | L'échelle (quelques ordinateurs au lieu de milliers de nœuds), la difficulté du minage (une empreinte qui commence par « 00 » se trouve en quelques centaines d'essais), le minage dans une blockchain de traçabilité (une vraie blockchain d'entreprise utiliserait plutôt la preuve d'autorité), la durée (un bloc Bitcoin prend environ 10 minutes, ici quelques secondes). |
| Comment ces limites sont-elles compensées ? | Les textes donnent les vrais ordres de grandeur (« des milliers d'ordinateurs », « dans le vrai Bitcoin, un bloc contient plusieurs milliers de transactions ») ; le README liste les simplifications ; la notion 6 explique à l'oral que la traçabilité utiliserait la preuve d'autorité. |

### 2.4 Métaphores écartées

| Métaphore | Points forts | Pourquoi écartée |
|:---|:---|:---|
| « Alice paie Bob » : un simple paiement entre deux personnes | L'exemple classique des cours sur la blockchain ; couvre directement la transaction | Trop abstrait pour un non-initié : deux noms sans histoire, aucune raison concrète de tricher, rien à voir dans une scène 3D. |
| « Le voyage du saumon », de la pêche à l'assiette | Même logique de traçabilité, une chaîne du froid qui donne une raison de tricher | Remplacé par la bière, plus parlante pour notre public et qui se termine naturellement par un paiement au bar. |

### 2.5 Charte visuelle

| Élément | Choix | Justification pédagogique |
|:---|:---|:---|
| Palette et signification des couleurs | Chaque partie d'un bloc a sa couleur, toujours la même : données en bleu (`#8ecae6`), empreinte du parent en violet (`#cdb4db`), nonce en jaune (`#ffd97d`), empreinte du bloc en vert (`#95d5b2`). État d'un bloc sur son socle : vert « ✔ valide », jaune « ✎ modifié », rouge « ✖ lien rompu ». | L'utilisateur reconnaît une partie d'un bloc à sa couleur partout : dans la scène, dans la vue éclatée, dans les étiquettes. Le vert, le jaune et le rouge suivent un code connu de tous, et chaque état a aussi un symbole et un mot, pour ne pas reposer sur la couleur seule. |
| Formes, style et niveau d'abstraction | Style « Maquette » : formes simples aux angles arrondis, sans texture réaliste. Un bloc est une pile de 4 dalles. | Un style clair et rassurant, loin de l'image sombre « crypto » qui intimide. L'abstraction garde l'attention sur ce qui compte (les parties du bloc, les liens) plutôt que sur les détails du décor. |
| Éclairage et ambiance | Fond clair, lumière d'ambiance douce et une lumière directionnelle qui projette des ombres douces. | Les ombres posent les objets sur le plateau et rendent la profondeur lisible, sans contraste agressif. |
| Typographie et lisibilité | Police système en 16 px pour les textes ; police à chasse fixe pour les empreintes et les nonces. | Le texte se lit sans effort. La chasse fixe aligne les 64 caractères d'une empreinte et montre qu'ils changent presque tous quand on modifie une lettre. |
| Échelle et rapport de taille | Les blocs et les ordinateurs sont plus grands que les bâtiments, à l'échelle de la maquette. | Les objets de la blockchain sont le sujet : ils doivent rester lisibles quand la caméra recule pour montrer le décor. |

## 3. Caméra, espace et navigation

| Question | Réponse et justification |
|:---|:---|
| Caméra libre, guidée ou mixte ? | **Mixte.** À chaque étape, la caméra se déplace seule vers l'action. Entre deux étapes, l'utilisateur peut tourner autour de la scène à la souris, dans des limites (jamais sous le sol, pas de déplacement latéral). Deux boutons, « Recentrer » et « Vue d'ensemble », ramènent à une vue connue. Un non-initié ne doit jamais se perdre, mais doit pouvoir regarder par lui-même. |
| Comment l'utilisateur sait-il où regarder ? | La caméra cadre l'action, la boîte « Ce qui se passe » dit ce qui arrive, et un bandeau en bas de la scène décrit chaque temps de la fabrication d'un bloc (« 2 sur 4 · Il recopie l'empreinte du bloc précédent »). Les objets qui comptent bougent, les autres restent immobiles. |
| Organisation spatiale et signification des positions | **Au premier plan**, le voyage, de gauche à droite : champ, brasserie, route, bar, terrasse. **Au milieu**, les ordinateurs, chacun devant le bâtiment de son acteur. **Au fond**, deux étagères : la blockchain de traçabilité à gauche, la blockchain Bitcoin à droite. Le monde réel est devant, les copies du registre au milieu, le registre lui-même au fond. |
| Représentation du temps | Le temps avance de gauche à droite, comme le voyage et comme la chaîne : chaque nouveau bloc se pose à droite du précédent. Une horloge affiche la date de l'étape (du 18 juillet au 29 août 2026). |
| Passage d'une notion à l'autre | Le bouton principal porte le nom de l'étape suivante (« Le camion part ▶ », « Signer avec la clé privée »). Une frise d'étapes en haut du panneau montre où l'on en est. |

## 4. Fiches des 7 notions obligatoires

Aucune issue GitHub n'a été créée pendant le projet : les lignes « Issues liées » l'indiquent. Les séquences sont les étapes du parcours, désignées par le texte du bouton principal.

### 4.1 — Structure d'un bloc : données, hash du bloc, hash du bloc parent et, si pertinent, nonce

**Issues liées :** aucune (pas d'issues pendant le projet).
**Séquence(s) concernée(s) :** « Écrire dans la blockchain » (4 fois) ; clic sur un bloc (vue éclatée) ; « Lire la blockchain » (explorateur).

#### a) Objectif pédagogique
> L'utilisateur doit comprendre qu'un bloc est toujours fait de 4 parties : les données, l'empreinte du bloc parent, le nonce et l'empreinte du bloc, et que cette dernière est calculée à partir des trois autres.

#### b) Risque de mauvaise compréhension
> L'utilisateur ne doit pas comprendre qu'un bloc ne contient qu'une seule information, ni que l'empreinte est une donnée choisie librement.

#### c) Représentation choisie
| Dimension | Choix | Pourquoi ce choix sert la compréhension |
|:---|:---|:---|
| Forme / géométrie | Une pile de 4 dalles arrondies, une par partie, avec le nom de la partie écrit dessus | Les 4 parties se voient avant même d'être expliquées. |
| Taille et échelle | La dalle des données est la plus haute ; le nonce, la plus fine | La taille suit la quantité d'information : plusieurs enregistrements d'un côté, un simple nombre de l'autre. |
| Couleur / matériau / texture | Une couleur par partie (bleu, violet, jaune, vert), reprise partout | On reconnaît chaque partie dans la scène, la vue éclatée et les étiquettes. |
| Position | Les données en haut, l'empreinte du bloc en bas | L'empreinte « résume » ce qui est au-dessus d'elle. |
| Mouvement / animation | À la fabrication, les cartes d'enregistrements volent une à une dans la dalle des données ; dans la vue éclatée, les 4 dalles s'écartent | On voit le bloc se remplir, puis se décomposer. |
| Interaction et retour visuel | Clic sur un bloc : vue éclatée avec 4 étiquettes reliées aux dalles ; clic sur une étiquette : la dalle se soulève et une explication s'affiche | L'utilisateur explore les parties à son rythme. |
| Son, si utilisé | Aucun | — |
| Texte d'accompagnement | « Un bloc est toujours fait de 4 parties. Les voici séparées. » puis une explication par partie | Chaque mot technique est introduit au moment où la partie est montrée. |

#### d) Correspondance avec la réalité technique
| Élément visuel | Élément réel | Fidélité (exacte / simplifiée / approximative) |
|:---|:---|:---|
| Les 4 dalles | Les champs principaux d'un en-tête de bloc | Simplifiée : un vrai bloc Bitcoin contient aussi la date, la version, la difficulté et la racine de Merkle des transactions |
| Trois enregistrements par bloc | Les transactions d'un bloc | Simplifiée : un bloc Bitcoin en contient plusieurs milliers (dit dans le texte) |
| Le tableau « Lire la blockchain » | Un explorateur de blocs | Exacte dans son principe : un bloc par ligne, ses champs en colonnes |

#### e) Alternative écartée
| Alternative | Raison du rejet |
|:---|:---|
| Un cube unique avec une fiche de texte affichée au survol | Les 4 parties n'étaient pas visibles sans lire ; la vue éclatée les montre dans l'espace. |

#### f) Tests utilisateurs
| Observation | Modification | Issue |
|:---|:---|:---|
| Test n°1 : « je n'ai pas compris où sont rangées les blockchains ni sous quelle forme elles sont présentées pour être lisibles » | Ajout du bouton « Lire la blockchain » : un explorateur de blocs en tableau, un bloc par ligne, avec les 4 parties en colonnes | Aucune (corrigé directement) |

Le projet n'a compté qu'un testeur extérieur sur les deux demandés ; la correction n'a pas été revérifiée par un second testeur.

#### g) Limites assumées
Le bloc est réduit à 4 champs. C'est acceptable : ce sont exactement les champs que demande la notion, et ceux qui suffisent à expliquer le chaînage et le minage. Les champs omis n'apportent rien à un non-initié.

### 4.2 — Chaînage cryptographique : hash/empreinte cryptographique, lien avec le bloc parent et effet de la moindre modification

**Issues liées :** aucune (pas d'issues pendant le projet).
**Séquence(s) concernée(s) :** « C'est quoi, une empreinte ? » (machine à empreintes) ; « Écrire dans la blockchain » (blocs 2 à 4) ; « Lire la blockchain ».

#### a) Objectif pédagogique
> L'utilisateur doit comprendre que l'empreinte est un code calculé à partir d'un contenu, qu'une seule lettre modifiée la change entièrement, et que chaque bloc recopie l'empreinte du précédent, ce qui les attache en chaîne.

#### b) Risque de mauvaise compréhension
> L'utilisateur ne doit pas comprendre que l'empreinte chiffre le contenu et permet de le retrouver, ni que les blocs sont reliés par un câble ou une adresse.

#### c) Représentation choisie
| Dimension | Choix | Pourquoi ce choix sert la compréhension |
|:---|:---|:---|
| Forme / géométrie | Un lien courbe entre la dalle « empreinte » d'un bloc et la dalle « parent » du suivant | Le lien part exactement de ce qui est recopié et arrive là où c'est recopié. |
| Taille et échelle | Les 64 caractères de l'empreinte affichés en entier dans la machine à empreintes | La longueur fixe se voit : 64 caractères, que le texte soit court ou long. |
| Couleur / matériau / texture | Bulle violette pour l'empreinte recopiée ; dans l'explorateur, chaque empreinte a une pastille de couleur calculée à partir d'elle-même | La même empreinte a toujours la même couleur : on voit qu'elle se retrouve dans la ligne suivante. |
| Position | Les blocs côte à côte sur l'étagère, de gauche à droite | La chaîne se lit dans le sens du temps. |
| Mouvement / animation | À la fabrication d'un bloc, une bulle violette part de l'empreinte du bloc précédent vers la case « parent » du nouveau bloc | Le chaînage est une action visible, pas une affirmation. |
| Interaction et retour visuel | Machine à empreintes : l'utilisateur tape un texte, les caractères qui ont changé sont mis en évidence, avec un compteur (« 60 caractères sur 64 viennent de changer ») | L'effet de la moindre modification se constate soi-même. |
| Son, si utilisé | Aucun | — |
| Texte d'accompagnement | Les trois règles de l'empreinte : même texte, même empreinte ; une lettre change, toute l'empreinte change ; impossible de retrouver le texte | Trois phrases courtes, testables immédiatement dans la machine. |

#### d) Correspondance avec la réalité technique
| Élément visuel | Élément réel | Fidélité (exacte / simplifiée / approximative) |
|:---|:---|:---|
| L'empreinte de 64 caractères | SHA-256 en hexadécimal | Exacte : vrai calcul SHA-256 (`js/sha256.js`) |
| Le calcul de l'empreinte d'un bloc | Hachage de l'en-tête du bloc | Simplifiée : on hache « numéro, parent, données, nonce » ; Bitcoin hache un en-tête binaire, deux fois |
| Le lien violet | La référence au bloc précédent | Exacte dans son principe |

#### e) Alternative écartée
| Alternative | Raison du rejet |
|:---|:---|
| Relier les blocs par une chaîne métallique décorative | Laisserait croire à un lien physique ; le lien doit venir de l'empreinte recopiée. |

#### f) Tests utilisateurs
| Observation | Modification | Issue |
|:---|:---|:---|
| Test n°1 : « empreinte pas bien expliquée » | Nouvelle étape « C'est quoi, une empreinte ? » avec ses trois règles et la machine à empreintes | Aucune (corrigé directement) |

#### g) Limites assumées
Le format de hachage est simplifié. C'est acceptable : la propriété à comprendre (une petite modification change toute l'empreinte) est réelle, puisque le calcul est un vrai SHA-256.

### 4.3 — Immutabilité et détection de falsification : une modification rend les empreintes incohérentes et doit être détectable par les autres nœuds

**Issues liées :** aucune (pas d'issues pendant le projet).
**Séquence(s) concernée(s) :** « Écrire dans la blockchain » (bloc n°3, la panne) ; clic sur le bloc n°3 ; « Faire vérifier par les autres » ; « Réparer la copie ».

#### a) Objectif pédagogique
> L'utilisateur doit comprendre que modifier un bloc change son empreinte, que la modification est donc visible, et que les autres participants, qui ont chacun leur copie, la refusent.

#### b) Risque de mauvaise compréhension
> L'utilisateur ne doit pas comprendre qu'une blockchain est physiquement impossible à modifier, ni qu'une autorité centrale corrige la triche.

#### c) Représentation choisie
| Dimension | Choix | Pourquoi ce choix sert la compréhension |
|:---|:---|:---|
| Forme / géométrie | L'écran de chaque ordinateur montre sa copie : un petit carré par bloc | On compare les copies d'un coup d'œil. |
| Taille et échelle | — | — |
| Couleur / matériau / texture | Socle du bloc jaune « ✎ modifié » puis rouge « ✖ lien rompu » ; carré rouge sur l'écran d'un ordinateur en désaccord | Le désaccord se voit dans la scène et sur les écrans. |
| Position | La vérification se fait depuis les ordinateurs vers le bloc | Ce sont les autres qui jugent, pas le bloc lui-même. |
| Mouvement / animation | Des bulles jaunes partent de chaque ordinateur vers le bloc modifié | La vérification est un échange entre participants. |
| Interaction et retour visuel | L'utilisateur modifie lui-même les données du bloc n°3 (remplacer 31 °C par 6 °C) ; l'empreinte change dans l'étiquette ; puis il fait vérifier, et peut réparer ou annuler | L'utilisateur fait la triche, et constate qu'elle échoue. |
| Son, si utilisé | Aucun | — |
| Texte d'accompagnement | « On peut modifier sa propre copie, mais pas faire accepter le mensonge aux autres » | Reprend la définition du sujet : difficile et détectable, pas impossible. |

#### d) Correspondance avec la réalité technique
| Élément visuel | Élément réel | Fidélité (exacte / simplifiée / approximative) |
|:---|:---|:---|
| Recalcul de l'empreinte après modification | Recalcul du hash | Exacte |
| Comparaison avec les copies des autres | Validation par les nœuds | Simplifiée : un vrai nœud vérifie la preuve de travail et le chaînage de la chaîne reçue |
| L'auteur du bloc ne participe pas au jugement | Majorité des nœuds honnêtes | Simplifiée |
| « Réparer la copie » | Resynchronisation d'un nœud avec le réseau | Simplifiée |

#### e) Alternative écartée
| Alternative | Raison du rejet |
|:---|:---|
| Un bloc verrouillé par un cadenas qu'on ne peut pas modifier | Ferait croire que l'immutabilité est une interdiction technique ; or on peut modifier sa copie, c'est la détection qui protège. |

#### f) Tests utilisateurs
| Observation | Modification | Issue |
|:---|:---|:---|
| Pas d'observation sur cette séquence lors du test n°1 | — | — |

#### g) Limites assumées
Le tricheur n'essaie pas de recalculer les blocs suivants. C'est acceptable : le texte explique qu'il devrait refaire tout le minage plus vite que le reste du réseau, ce qui est le cœur de la protection.

### 4.4 — Réseau et décentralisation : nœuds, copies distribuées et propagation des transactions/blocs, sans centre unique

**Issues liées :** aucune (pas d'issues pendant le projet).
**Séquence(s) concernée(s) :** « Découvrir le réseau » ; chaque « Écrire dans la blockchain » (4e temps) ; « Envoyer au réseau ».

#### a) Objectif pédagogique
> L'utilisateur doit comprendre que la blockchain est rangée sur les ordinateurs des participants, chacun avec une copie complète, et que chaque nouveau bloc ou transaction est envoyé à tous, sans serveur central.

#### b) Risque de mauvaise compréhension
> L'utilisateur ne doit pas comprendre que la blockchain est stockée dans un endroit unique (un serveur, « le cloud »), ni que l'étagère au fond est un lieu de stockage réel.

#### c) Représentation choisie
| Dimension | Choix | Pourquoi ce choix sert la compréhension |
|:---|:---|:---|
| Forme / géométrie | Un ordinateur par acteur, avec un écran qui affiche « sa copie : n blocs » | Le lieu de stockage est concret : un ordinateur de chaque acteur. |
| Taille et échelle | Tous les ordinateurs ont la même taille | Aucun n'est plus important que les autres : pas de centre. |
| Couleur / matériau / texture | Petits cubes verts envoyés vers chaque ordinateur, de la couleur de l'empreinte du bloc | Chaque copie reçue est le même bloc scellé. |
| Position | Chaque ordinateur devant le bâtiment de son acteur, reliés entre eux par des câbles | Le réseau relie des acteurs réels, pas un centre. |
| Mouvement / animation | Un signal fait le tour du réseau au départ ; à chaque bloc, un cube part vers chaque ordinateur, dont le compteur augmente | La propagation se voit, ordinateur par ordinateur. |
| Interaction et retour visuel | Le compteur de chaque écran augmente à la réception | On vérifie que toutes les copies sont identiques. |
| Son, si utilisé | Aucun | — |
| Texte d'accompagnement | « Ni dans un coffre, ni sur un serveur central. Chaque participant a un ordinateur, appelé nœud » | Répond directement à la question « c'est rangé où ? ». |

#### d) Correspondance avec la réalité technique
| Élément visuel | Élément réel | Fidélité (exacte / simplifiée / approximative) |
|:---|:---|:---|
| Quatre ordinateurs | Les nœuds du réseau | Simplifiée : quelques nœuds au lieu de milliers pour Bitcoin (dit dans le texte) |
| Câbles entre ordinateurs | Connexions par Internet, de pair à pair | Approximative : chaque nœud n'est relié qu'à quelques autres, qui relaient |
| L'étagère des blocs | Représentation agrandie d'une copie | Métaphore : le texte précise qu'elle montre en grand ce que contient chaque copie |

#### e) Alternative écartée
| Alternative | Raison du rejet |
|:---|:---|
| Seulement l'étagère de blocs, sans ordinateurs (première version) | Le test n°1 a montré qu'on ne comprenait pas où était rangée la blockchain. |

#### f) Tests utilisateurs
| Observation | Modification | Issue |
|:---|:---|:---|
| Test n°1 : « je n'ai pas compris où sont rangées les blockchains » et « l'infrastructure des données/blockchains » | Nouvelle étape d'ouverture « Découvrir le réseau » : un ordinateur visible par acteur, relié aux autres, dont l'écran montre sa copie | Aucune (corrigé directement) |

#### g) Limites assumées
La panne d'un nœud n'est pas montrée, et le réseau est très petit. C'est acceptable pour comprendre le principe ; le texte rappelle la vraie échelle.

### 4.5 — Validation et minage : vérification d'une transaction ou d'un bloc et, dans le cas du proof of work (PoW), recherche d'un nonce sous contrainte de difficulté

**Issues liées :** aucune (pas d'issues pendant le projet).
**Séquence(s) concernée(s) :** « Écrire dans la blockchain » (3e temps) ; « Envoyer au réseau » ; « Qui écrit le prochain bloc ? » ; « Lancer la course des mineurs ».

#### a) Objectif pédagogique
> L'utilisateur doit comprendre que les nœuds vérifient chaque transaction (signature, solde), et que, en preuve de travail, des mineurs essaient des nonces jusqu'à trouver une empreinte qui commence par « 00 » : long à trouver, rapide à vérifier.

#### b) Risque de mauvaise compréhension
> L'utilisateur ne doit pas comprendre que le minage « fabrique » des bitcoins à partir de rien sans raison, ni que le mineur résout un calcul intelligent : il essaie au hasard.

#### c) Représentation choisie
| Dimension | Choix | Pourquoi ce choix sert la compréhension |
|:---|:---|:---|
| Forme / géométrie | Trois machines de minage avec des ventilateurs, et un écran chacune | Le mineur est une machine qui calcule, pas un personnage. |
| Taille et échelle | — | — |
| Couleur / matériau / texture | Le compteur d'essais en orange, « ✔ trouvé en premier ! » en vert pour le gagnant, « trop tard… » en gris pour les autres | La course a un gagnant visible. |
| Position | Les mineurs près de la mempool et de l'étagère Bitcoin | Ils prennent les transactions en attente et posent le bloc. |
| Mouvement / animation | Les ventilateurs tournent, les compteurs défilent ; une pièce vole du nouveau bloc vers le gagnant | Le travail et la récompense sont visibles. |
| Interaction et retour visuel | Le bandeau affiche chaque essai et son empreinte (« essai n° 212 → 8f3a… ✖ ») ; « ✔ signature valide » s'affiche sur chaque nœud | On voit que la plupart des essais échouent. |
| Son, si utilisé | Aucun | — |
| Texte d'accompagnement | « Impossible de deviner, il faut essayer des milliers de nombres. On appelle ça la preuve de travail. » | Explique aussi pourquoi : rendre la triche coûteuse. |

#### d) Correspondance avec la réalité technique
| Élément visuel | Élément réel | Fidélité (exacte / simplifiée / approximative) |
|:---|:---|:---|
| Recherche du nonce essai par essai | Preuve de travail | Exacte dans son principe : les essais sont réellement calculés |
| Difficulté « 00 » | Cible de difficulté de Bitcoin | Simplifiée : beaucoup plus facile (dit dans le README) |
| Récompense du mineur | Bitcoins nouveaux et frais des transactions | Exacte dans son principe |
| Minage dans la blockchain de traçabilité | Validation dans une blockchain d'entreprise | Approximative : on utiliserait plutôt la preuve d'autorité (voir 4.6) |

#### e) Alternative écartée
| Alternative | Raison du rejet |
|:---|:---|
| Un minage instantané, sans compteur d'essais | Ne montrait pas que le minage est une recherche longue et au hasard. |

#### f) Tests utilisateurs
| Observation | Modification | Issue |
|:---|:---|:---|
| Test n°1 : « j'ai pas compris qui est le mineur ni l'intérêt de sa présence » | Trois machines de minage visibles ; nouvelle étape « Qui écrit le prochain bloc ? » (pas de chef, donc une course entre volontaires) ; récompense visible | Aucune (corrigé directement) |

#### g) Limites assumées
La difficulté est très faible et n'est pas réglable, pour que la course dure quelques secondes. C'est acceptable : le principe (essayer jusqu'à trouver) est le même, et le texte explique le coût réel en temps et en électricité.

### 4.6 — Comparaison d'au moins deux mécanismes de consensus : par exemple proof of work (PoW) et proof of stake (PoS), ou proof of authority (PoA), en expliquant leurs différences, avantages et limites

**Issues liées :** aucune (pas d'issues pendant le projet).
**Séquence(s) concernée(s) :** aucune dans l'application rendue. La comparaison a été présentée à l'oral pendant la soutenance.

#### a) Objectif pédagogique
> L'utilisateur doit comprendre que le consensus est la règle qui décide qui a le droit d'écrire le prochain bloc et quelle version de la chaîne est la bonne, et qu'il en existe plusieurs, avec des avantages et des limites différents.

#### b) Risque de mauvaise compréhension
> L'utilisateur ne doit pas comprendre que la preuve de travail est la seule manière de faire une blockchain, ni qu'une blockchain privée a besoin de minage.

#### c) Représentation choisie
| Dimension | Choix | Pourquoi ce choix sert la compréhension |
|:---|:---|:---|
| Forme / géométrie | Non réalisée dans l'application | — |
| Taille et échelle | Non réalisée | — |
| Couleur / matériau / texture | Non réalisée | — |
| Position | Non réalisée | — |
| Mouvement / animation | Non réalisée | — |
| Interaction et retour visuel | Non réalisée | — |
| Son, si utilisé | Aucun | — |
| Texte d'accompagnement | Comparaison présentée à l'oral, avec notre histoire (tableau ci-dessous) | Les deux blockchains de l'histoire illustrent deux mécanismes différents. |

**Comparaison présentée à l'oral :**

| | Preuve de travail (PoW) | Preuve d'enjeu (PoS) | Preuve d'autorité (PoA) |
|:---|:---|:---|:---|
| Qui écrit le bloc ? | Le mineur qui gagne la course au calcul | Un validateur tiré au sort selon les jetons qu'il a mis en gage | Quelques validateurs connus et autorisés |
| Ce qui empêche de tricher | Tricher coûterait plus de calcul que tout le réseau | Le tricheur perd sa mise | L'identité et la réputation des validateurs |
| Avantages | Ouvert à tous, très sûr | Très peu d'énergie, plus rapide | Très rapide, presque aucun calcul |
| Limites | Énorme consommation d'énergie, lent | Ceux qui ont le plus de jetons pèsent le plus | Il faut faire confiance aux validateurs : plus centralisé |
| Exemple | Bitcoin | Ethereum depuis 2022 | Blockchains d'entreprise |
| Dans notre histoire | Le paiement de Léa | — | Ce qui conviendrait à la traçabilité : les 4 acteurs seraient les validateurs |

**Représentation prévue :** à la fin du chapitre de traçabilité, faire écrire le même bloc deux fois : par la course des mineurs (preuve de travail), puis par la seule signature des 4 acteurs autorisés (preuve d'autorité), en comparant le temps, le calcul dépensé et qui a le droit d'écrire.

#### d) Correspondance avec la réalité technique
| Élément visuel | Élément réel | Fidélité (exacte / simplifiée / approximative) |
|:---|:---|:---|
| Course des mineurs du paiement de Léa | Preuve de travail de Bitcoin | Simplifiée (voir 4.5) |
| Aucun élément pour la PoS et la PoA | — | — |

#### e) Alternative écartée
| Alternative | Raison du rejet |
|:---|:---|
| Un simple tableau de texte dans le panneau | Le sujet demande une animation ou une interaction observable, pas seulement un texte ; nous avons préféré la présenter à l'oral plutôt que d'ajouter un tableau. |

#### f) Tests utilisateurs
| Observation | Modification | Issue |
|:---|:---|:---|
| Non testée : absente de l'application | — | — |

#### g) Limites assumées
C'est la notion la moins bien représentée : elle n'a pas d'interaction dans l'application rendue. Nous l'assumons comme la principale lacune du projet. La blockchain de traçabilité utilise le minage pour n'expliquer qu'une seule mécanique ; le README et la soutenance précisent qu'une vraie blockchain d'entreprise utiliserait plutôt la preuve d'autorité.

### 4.7 — Cycle de vie d'une transaction et scénario d'attaque illustré : création, propagation, validation, inclusion dans un bloc, confirmation, puis illustration d'une attaque (par exemple double dépense ou altération d'un bloc) et de sa détection/limitation

**Issues liées :** aucune (pas d'issues pendant le projet).
**Séquence(s) concernée(s) :** de « Léa arrive en terrasse ▶ » à « Attendre les confirmations » ; la triche du bloc n°3 (voir 4.3).

#### a) Objectif pédagogique
> L'utilisateur doit comprendre les étapes d'une transaction : création, signature avec la clé privée, envoi aux nœuds, vérification, attente dans la mempool, inclusion dans un bloc par un mineur, puis confirmations. Et qu'une transaction modifiée après la signature est rejetée.

#### b) Risque de mauvaise compréhension
> L'utilisateur ne doit pas comprendre que le portefeuille contient des pièces, que la clé privée est envoyée avec la transaction, ni qu'un paiement est définitif dès qu'il est envoyé.

#### c) Représentation choisie
| Dimension | Choix | Pourquoi ce choix sert la compréhension |
|:---|:---|:---|
| Forme / géométrie | Une carte de transaction (de, à, montant, frais, signature, statut) ; une clé dorée ; un plateau « mempool » | Chaque étape a un objet reconnaissable. |
| Taille et échelle | La carte de transaction est grande, puis devient un petit jeton dans la mempool | On passe de la transaction de Léa à une transaction parmi d'autres. |
| Couleur / matériau / texture | Bulles dorées vers les nœuds ; statut de la signature vert si valide, rouge si refusée ; pastille « n confirmations » en vert | Le statut se lit d'un coup d'œil. |
| Position | Terrasse, puis nœuds, mempool et étagère Bitcoin, de gauche à droite | Le trajet de la transaction se suit dans l'espace. |
| Mouvement / animation | La clé tamponne la carte ; la transaction vole vers chaque nœud ; le jeton saute dans la mempool puis dans le bloc ; deux blocs s'ajoutent ; le verre se remplit | Chaque étape du cycle de vie est une animation distincte. |
| Interaction et retour visuel | Après la signature, l'utilisateur peut changer le montant : « Signature refusée » ; en remettant le montant d'origine, elle redevient valide | L'attaque est faite par l'utilisateur lui-même. |
| Son, si utilisé | Aucun | — |
| Texte d'accompagnement | Le vocabulaire courant introduit étape par étape : portefeuille, clé privée, clé publique, adresse, satoshi, frais, signature, nœud, mempool, mineur, confirmation | Le vocabulaire le plus utilisé est expliqué dans son contexte. |

#### d) Correspondance avec la réalité technique
| Élément visuel | Élément réel | Fidélité (exacte / simplifiée / approximative) |
|:---|:---|:---|
| Signature de la transaction | Signature ECDSA | Exacte dans son principe : vraie signature ECDSA calculée par le navigateur, sur la courbe P-256 (Bitcoin utilise secp256k1) |
| Adresse `bc1q…` | Adresse Bitcoin | Simplifiée : format raccourci (dit dans le lexique) |
| Vérification « sans l'avoir déjà dépensé » | Contrôle de double dépense par les nœuds | Simplifiée : annoncée dans le texte, non animée |
| 3 confirmations | Confirmations Bitcoin | Simplifiée : on en attend souvent 6 en pratique |

#### e) Alternative écartée
| Alternative | Raison du rejet |
|:---|:---|
| Illustrer l'attaque par une double dépense animée | Plus difficile à comprendre pour un non-initié sans notion de solde et de fork ; nous avons choisi deux altérations que l'utilisateur fait lui-même : le bloc n°3 et le montant signé. La double dépense est expliquée à l'oral. |

#### f) Tests utilisateurs
| Observation | Modification | Issue |
|:---|:---|:---|
| Pas d'observation sur cette séquence lors du test n°1 | — | — |

#### g) Limites assumées
La double dépense et le fork ne sont pas animés. Un prototype de fork (plusieurs bars qui écrivent en même temps, règle de la chaîne la plus longue, attaque d'un tricheur) a été réalisé après le retour de l'enseignant du 4 novembre, mais n'a pas été intégré : son rendu visuel n'était pas assez clair.

## 5. Cohérence globale

| Question | Réponse |
|:---|:---|
| Les codes visuels sont-ils constants ? | Oui : les 4 couleurs des parties d'un bloc, le code vert / jaune / rouge des états, les cubes verts pour les copies, la chasse fixe pour les empreintes sont les mêmes dans toute l'expérience. |
| Un même élément est-il représenté de la même façon partout ? | Oui : un bloc a la même forme sur les deux étagères, dans la vue éclatée et dans l'explorateur (mêmes 4 parties, mêmes noms). Les deux blockchains sont représentées de la même façon, seule l'étiquette de l'étagère change. |
| L'ordre des séquences est-il progressif ? | Oui : réseau, bloc, empreinte, chaîne, triche et immutabilité, blockchain privée et publique, puis transaction, signature, diffusion, minage et confirmations. Chaque notion s'appuie sur la précédente. |
| Quelle notion est la moins bien représentée ? | La notion 6 (comparaison des mécanismes de consensus) : elle n'a pas d'interaction dans l'application. |
| Quelle décision reverriez-vous avec une semaine de plus ? | Nous ajouterions la comparaison entre preuve de travail et preuve d'autorité sur la blockchain de traçabilité (voir 4.6), et nous ferions le second test utilisateur pour revérifier les corrections. |

## 6. Rôle de l'IA générative

L'IA générative (Claude, d'Anthropic) a été utilisée pendant tout le projet. Son usage est déclaré dans le README.

- **Ce qu'elle a produit :** la structure du dépôt, le document de cadrage, une maquette comparant trois styles visuels, le code de l'application, les décors 3D, les textes d'explication, le prototype du fork, et la mise en forme des documents.
- **Idées retenues :** la vue éclatée d'un bloc, la machine à empreintes, l'explorateur de blocs, la triche sur la signature.
- **Idées rejetées :** le style « Néon » et le style « Registre » ; les histoires « Alice paie Bob » et « Le voyage du saumon » ; la carte du fork, jugée pas assez claire.
- **Erreurs détectées :** l'application ne se lançait pas avec `npm start` (fichier `package.json` manquant), corrigé le 14 octobre ; dans le prototype du fork, les camions ne roulaient pas, les routes manquaient et des panneaux masquaient la scène.
- **Décisions qui restent celles du groupe :** le style Maquette, l'histoire de la bière et le paiement en bitcoin, le niveau de vulgarisation, le choix de faire tester par une personne extérieure, la prise en compte des retours du test et de l'enseignant, et la décision de ne pas intégrer le fork.

## 7. Sources

- **Cours R507** et sujet du projet (glossaire commun et notions obligatoires).
- **Bitcoin : A Peer-to-Peer Electronic Cash System**, Satoshi Nakamoto, 2008 : chaînage des blocs, preuve de travail, chaîne la plus longue.
- **FIPS 180-4, Secure Hash Standard**, NIST : définition de SHA-256.
- **Documentation de Three.js** (threejs.org) : scène, caméra, OrbitControls, RoundedBoxGeometry, CanvasTexture, Raycaster.
- **Documentation MDN, Web Crypto API** : génération de clés, signature et vérification ECDSA.
- **ethereum.org** : passage d'Ethereum à la preuve d'enjeu (2022).
- **Compte rendu du test utilisateur n°1** : `docs/tests-utilisateurs/TEST-01-etudiante-MMI2.md`.
