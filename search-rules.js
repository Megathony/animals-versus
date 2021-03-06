const needle = require("needle")

const TWT_API_URL = 'https://api.twitter.com/2/tweets/search/stream/rules'
const options = {
  headers: {
    "Content-Type": "application/json",
    authorization: `Bearer ${process.env.TWT_BEARER_TOKEN}`
  }
}

// Récupération des filtres existant
async function getSearchRules() {
  const response = await needle('get', TWT_API_URL, options )

  return response.body
}

// Suprime un filtre existant
async function deleteSearchRules(ids) {
  const data = {
    delete: {
      ids
    }
  }

  const response = await needle('post', TWT_API_URL, data, options)

  console.log("delete rules: ", response.body)
}

// Ajoute un filtre
async function addSearchRules(rules) {
  const data = {
    add: rules
  }

  const response = await needle('post', TWT_API_URL, data, options)

  console.log(response.body.data)
  return response.body.data
}

module.exports = {
  getSearchRules,
  deleteSearchRules,
  addSearchRules
}