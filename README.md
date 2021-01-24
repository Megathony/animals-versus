# Twitter workshop: Word Fight
Ce Project à pour but de comparer 2 sujets et de voir la quantité de publication par secondes. Plus un sujet est discuté, plus sa quantité par secondes sera importante.
## Comment ça fonctionne
Pour faire ça, on utilise l'API Twitter V2, qui propose d'afficher un flux de tweet filtrable correspondant à 1% des tweets.
### Les étapes de fonctionnement
#### Comment filtrer
Dans l'onglet, l'utilisateur va pouvoir sélectionner les 2 mots qu'il souhaite comparer dans la langue qu'il souhaite.
Quand l'utilisateur valide, la page se met en loading en attendant que les filtres s'applique et que le flux arrive.
#### Retour des données
Quand l'API renvoie les données, elles passent par plusieur Transform :
- `jsonParser`: Qui permet de convertir les données en JSON et donc au javascript de pouvoir les interpréter
- `socketStream`: Renvoie les données aux clients
#### Le Front
Comme je souhaite comparer la quantité, quand le front commence à recevoir des tweets, les tweets sont filtré en fonction des mots choisi. Un compteur de seconde aussi se met en route pour pouvoir ensuite diviser le nombre total de tweets reçus par le nombre de secondes écoulées. Avec ça nous avons le nombre de tweets par secondes posté. (en bonus nous avons les images des différents utilisateurs qui ont fait les postes qui se place dans des colones correspondant au sujet de leur poste) 
#### Modification des règles de filtrage
Quand un client veut changer de mots, tous les compteur retombent à 0 et le flux est arrêter. Les anciennes règles sont suprimées et les nouvelles sont ajoutées. Quand le flux reviens, le filtre se refait à nouveau.
#### Déconnexion d'un client
Quand un client ferme son onglet, les filtres qu'il avait choisi sont alors supprimés.
### Difficultés rencontrées
La séparation pour les différents utilisateurs a été un gros problème. n'ayant pas réussi à définir à qui renvoyer les différents tweets j'ai décider de faire le filtre par l'utilisateur.
Le changement de filtres fut compliquer a gérer surtout côté front. Le nombre de cas qu'il faut prévoir ma fait avoir pleins de bug d'affichage où les données n'était plus dutout correctement affiché.
Quand le client se déconnecter, j'avais le problème que rien ne se passait alors que j'essayer d'écouter l'évènement. à un moment c'est redevenu fonctionnel mais je n'ai pas compris pourquoi.
La supression de filtres précis aussi ne fonctionne pas. Malgrès que j'envois des données qui semblent correcte, je ne reçois que des erreurs.
______
## Making it work
- Clone this repository
- Create a `.env` file at the root of the folder with the following info:
```bash
TWITTER_BEARER_TOKEN="YourTwitterBearerToken"
```
- Install dependencies: `npm install`
- Run the server: `npm start`
- You can open the client at `localhost:3000`

## Problèmes
## Problèmes connus
Les différents filtres ne se supprimes pas. Ils s'accumulent.
Tous les tweets sont renvoyés aux différents utilisateurs.

