const Spot = require('../../../src/spot')

const apiKey = ''
const apiSecret = ''
const client = new Spot(apiKey, apiSecret)

client.withdraw(
  'BNB', // coin
  'bnb_address', // withdraw address
  1, // amount
  { // optional parameters
    network: 'BNB',
    name: 'address name'
  }
).then(response => client.logger.log(response.data))
  .catch(error => client.logger.error(error))
