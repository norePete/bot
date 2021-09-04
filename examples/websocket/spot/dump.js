const Indicators = require('../../../indicators/indicators')
const Spot = require('../../../src/spot')
const Queue = require('./queueObj.js')
const getAverageVolume = require('./functions.js')

const client = new Spot('7t6tdy9xIPLBRciEkSmuxgGkUMweCI0pfPNaGBPs9esnqhZuw8OgHX0ZPdC5aA8w', '7vsU62YQKP2zIYrVSSerSavvEk5DC17AqsV9yAVLfRMZtPKNWBIAXFRQJADJRWMZ', {})

// const minute_queue = new queue(60)

const farmIndic = new Indicators('farmusdt', ['PROC', 'VROC'])
const a = new Indicators('btcusdt', ['PROC', 'VROC'])

const hour_queue = new Queue(60, null)
const half_hour_queue = new Queue(30, hour_queue)
const ten_min_queue = new Queue(10, half_hour_queue)
const five_min_queue = new Queue(5, ten_min_queue)
const one_min_queue = new Queue(1, five_min_queue)

function buy_state () {
  if (typeof buy_state.instance === 'object') {
    return buy_state.instance
  }
  this.flag = true
  this.check = () => { return this.flag }
  this.flip = () => { this.flag = !this.flag }

  buy_state.instance = this

  return this
}

const callbacks = {
  open: () => farmIndic.open(),
  close: () => farmIndic.close(),
  message: data => { farmIndic.pipe(data) }
}

const callbacks_a = {
  open: () => a.open(),
  close: () => a.close(),
  message: data => {
	  a.pipe(data)
	  one_min_queue.push(data)
	  average_volume(buy_state)
  }
}
// const ws1min = client.klineWS('farmusdt', '1m', callbacks)
const test_a = client.klineWS('btcusdt', '1m', callbacks_a)

// setTimeout(() => client.unsubscribe(test_a), 50000)

function average_volume (buy_state) {
  var avgVol = []
  avgVol['1min'] = one_min_queue.calculate(getAverageVolume)
  avgVol['5min'] = five_min_queue.calculate(getAverageVolume)
  avgVol['10min'] = ten_min_queue.calculate(getAverageVolume)
  avgVol['30min'] = half_hour_queue.calculate(getAverageVolume)
  avgVol['60min'] = hour_queue.calculate(getAverageVolume)
  // check if current buy volume is 20% higher than average for the last 30 min
  console.log('check ', buy_state().check())
  if ((avgVol['1min'] > (avgVol['30min'] * 1.2)) && (avgVol['30min'] > 0) && buy_state().check()) {
    console.log('\x1b[31m%s\x1b[0m', 'buy triggered')
    buy_state().flip()
    console.log('average volume over one minute', avgVol['1min'])
    console.log('average volume over 30 minute', avgVol['30min'])
    // trigger a buy order
  } else {
    if (!buy_state().check()) {
      console.log('\x1b[42m%s\x1b[0m', 'sell triggered')
      buy_state().flip()
    }
    console.log('average volume over one minute', avgVol['1min'])
    console.log('average volume over 30 minute', avgVol['30min'])
  }
}
