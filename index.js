require("dotenv").config()
const { pipeline, Writable } = require("stream")
const WebSocket = require("ws")
const { nanoid } = require('nanoid')
const server = require("./server")
const {setSearchRules, connectToTwitter, tweetStream} = require("./twitter")
const {getSearchRules, deleteSearchRules, addSearchRules} = require("./search-rules")
const {jsonParser, logger, textExtractor, tweetCounter} = require("./process-tweets")

// server http
server.listen(3000)
const wsServer = new WebSocket.Server({ server })
const clientRules = {}

// Au moment de la connection d'un nouveau client
wsServer.on("connection", (client) => {
  console.log("new connection: ")
  const clientId = nanoid()

  // Au moment de la réception d'un message du client
  client.on("message", (message) => {
    if(clientRules[clientId] != undefined) {
      deleteRules(clientRules[clientId])
      clientRules[clientId] = undefined
    }
    rule = message.split(",");
    if(rule.length = 3){
      const rulesId = addRules(rule);
      clientRules[clientId] = rulesId;
    } else {
      console.log('oups')
    }
  })

  // quand le client se déconnecte.
  client.on('close', () => {
    if(clientRules[clientId] != undefined) {
      deleteRules(clientRules[clientId])
    }
  });

  // envoyer des données au client via websocket
  const socketStream = WebSocket.createWebSocketStream(client);
  pipeline(
    tweetStream,
    // jsonParser,

    // textExtractor,
    socketStream,
    (err) => {
      if (err) {
        console.error("pipeline error: ", err)
      } else {
        console.log("pipeline success")
      }
    }
  )
  // connexion API Twitter
  connectToTwitter()
})

async function addRules(rules) {
  // règles de filtrage pour tweets à virer
  const lang = "lang:" + rules[0]
  const valueFirst = rules[1]
  const valueSecond = rules[2]
  return addSearchRules([
    { value: lang + " " + valueFirst, tag: valueFirst },
    { value: lang + " " + valueSecond, tag: valueSecond }
  ])
}

async function deleteRules(ids){
  //supprimer les filtres
  if (ids) {
    await  deleteSearchRules(ids)
  }
}

// remplace les filtres existant par les nouveaux
async function resetRules() {
  // récupérer les filtres existants
  const existingRules = await getSearchRules()
  const ids = existingRules?.data?.map(rule => rule.id)
  
  //supprimer tous les filtres
  if (ids) {
    await  deleteSearchRules(ids)
  }
}