const Spot = require('../../../src/spot')

const apiKey = ''
const apiSecret = ''
const client = new Spot(apiKey, apiSecret)

client.assetDevidendRecord()
  .then(response => client.logger.log(response.data))
  .catch(error => client.logger.error(error))