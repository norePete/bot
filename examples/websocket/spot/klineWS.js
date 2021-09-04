const Indicators = require('../../../indicators/indicators')
const Spot = require('../../../src/spot')

const client = new Spot('7t6tdy9xIPLBRciEkSmuxgGkUMweCI0pfPNaGBPs9esnqhZuw8OgHX0ZPdC5aA8w', '7vsU62YQKP2zIYrVSSerSavvEk5DC17AqsV9yAVLfRMZtPKNWBIAXFRQJADJRWMZ', {})

const farmIndic = new Indicators('farmusdt', ['PROC', 'VROC'])

const callbacks = {
  open: () => farmIndic.open(),
  close: () => farmIndic.close(),
  message: data => { farmIndic.pipe(data) }
}

const ws1min = client.klineWS('farmusdt', '1m', callbacks)

setTimeout(() => client.unsubscribe(ws1min), 50000)
