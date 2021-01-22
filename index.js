require("dotenv").config()
const { pipeline, Writable } = require("stream")
const WebSocket = require("ws")
const server = require("./server")
const {setSearchRules, connectToTwitter, tweetStream} = require("./twitter")
const {getSearchRules, deleteSearchRules, addSearchRules} = require("./search-rules")
const {jsonParser, logger, textExtractor, tweetCounter} = require("./process-tweets")

// server http
server.listen(3000)
const wsServer = new WebSocket.Server({ server })

wsServer.on("connection", (client) => {
  console.log("new connection: ")

  client.on("message", (message) => {
    console.log("message from client: ", message);

    rule = message.split(",");
    if(rule.length = 3){
      const rules = addRules(rule);
    } else {
      console.log('oups')
    }
  })

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
})

async function addRules(rules) {
  // règles de filtrage pour tweets à virer
  const lang = "lang:" + rules[0]
  const valueFirst = rules[1]
  const valueSecond = rules[2]
  return addSearchRules([
    { value: lang + " " + valueFirst, tag: "first" },
    { value: lang + " " + valueSecond, tag: "second" }
  ])
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

  // connexion API Twitter
  connectToTwitter()
}

resetRules()