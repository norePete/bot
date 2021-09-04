const { Console } = require('console')
const eventEmitter = require('events')
const readline = require('readline')
const fs = require('fs')
const KlineController = require('./klineController.js')
const Spot = require('../../../src/spot')
const getAverageVolume = require('./functions.js')
const { KEY, SECRET, TEST_KEY, TEST_SECRET } = require('../../../key/api.export.js')
const { Market } = require('../../../src/modules/market.js')
const output = fs.createWriteStream('./write.log')
const errorOutput = fs.createWriteStream('./error.log')

class Executer {

  constructor(symbol_list){

    this.logger = new Console({
      stdout: output,
      stderr: errorOutput
    })
    this.symbols = (typeof symbol_list === 'undefined') ? [
      'BTCUSDT',
      'ethusdt',
      'solusdt',
      'aavebnb',
      'adabnb',
      'arbnb',
      'ethusdt',
      'bnbeth',
      'bateth',
      'bnbusdc',
      'adausdc',
      'xrpusdc'
    ] : symbol_list;
    this.client = new Spot(
      KEY,
      SECRET,	
      {}
    )
    //const client = new Spot(
    //   TEST_KEY,
    //   TEST_SECRET,
    //   { baseURL: 'https://testnet.binance.vision' }
    //)
  }

  async run () {

    this.client.newOrder('ethusdt', 'buy', 'LIMIT', {quantity: 1})
      .then(response => this.logger.log(response))
      .catch(e => this.logger.error(e))

    //client.ping()
    //	.then(response => logger.log(response))
    //	.catch(e => logger.error(e))
    //
    //client.coinInfo()
    //	.then(res => logger.log(res))
    //	.catch(e => logger.error(e))
    //
    //async test(client) {
    //	const listenKey = await client.accountSnapshot("SPOT", {})
    //		.catch(e => logger.error(e))
    //	console.log(listenKey)
    //}
    //test(client);
    //
    //client.createMarginListenKey()
    //	.then(response => logger.log(response.data))
    //	.catch( e => logger.error(e))
    //
    try {
      const replResult = await this.streamSampleDemo(this.ping)
    } catch (e) {
      console.log('failed:', e)
    }
  }


  //TODO change client to this.client etc..
  async ping_stream (client, symbols) {
    const cont = new KlineController(client, symbols)
    for (let i = 0; i < symbols.length; i++) {
        const view = cont.get_view(symbols[i])
        const small_queue = view.get(240)
        const med_queue = view.get(480)
        const avg_1min = small_queue.calculate(getAverageVolume)
        const avg_5min = med_queue.calculate(getAverageVolume)
        console.log('\n', symbols[i], 'current average volume: ', avg_1min)
        console.log(symbols[i], ' previous average volume: ', avg_5min)

        try {
          console.log(symbols[i], 'price', JSON.parse(small_queue.data()).k.h, '\n')
          if ( true ) {
          }
        } catch (e) {
          console.log('waiting on price....\n')
        }
    }
  }


  streamSampleDemo () {
    const ref = this
    return new Promise(function (resolve, reject, ping) {
      const emitter = new eventEmitter()
      emitter.on('sample', () => {
        ref.ping_stream(ref.client, ref.symbols).then(() => {
          emitter.emit('reset')
        })
      })
      emitter.emit('sample')
      emitter.on('reset', () => {
        setTimeout(() => { resolve(emitter.emit('sample')) }, 0)

      })
    })// end of Promise callback scope

  }

}

module.exports = Executer
