const redis = require('redis');

async function getLocations() {
  const responseObj = await fetch('http://localhost:3000/api/v1/locations')
  const responsePromise = await responseObj.json()
  return responsePromise
  }

  module.exports = {getLocations};