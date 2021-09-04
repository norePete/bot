const { ROC, VROC } = require('./roc')

const indicators = {
  PROC: new ROC(),
  VROC: new VROC()
}

// indicators object class
// pass in a pair ticker symbol or name, and an array of indicators
class Indicators {
  constructor (pair, indicators = []) {
    this.pair = pair
    this.indicatorsList = indicators // validate
    this.instances = {}
    this.isInitialized = false
    this._init()
  }

  _init () {
    this._initIndicators()
  }

  // assigning indicator instance from indicator object instantiated above
  _instantiate (o) {
    if (this.instances[o] !== undefined) throw new Error(`indicator ${o} already instantiated`)
    this.instances[o] = indicators[o]
    console.log('instantiated', o)
  }

  // loop through constructor parameter "indicators" and instantiate the corresponding
  // indicator in "instances", this is done by calling _instantiate
  _initIndicators () {
    if (this.indicatorsList.length <= 0) return
    for (let i = 0; i < this.indicatorsList.length; i++) {
      this._instantiate(this.indicatorsList[i])
    }
    console.log(this.instances)
  }

  //
  _handleIndicators () {
    if (this.data === undefined) throw new Error('data object not defined')
    // console.log(
    //	    "handle indicators triggered by pipe(data) function",
    //	    "\nsymbol: ", this.data.s,
    //	    "\nevent type: ", this.data.e,
    //	    "\ninterval: ", this.data.k.i,
    //	    "\nevent time: ", this.data.E,
    //	    "\nfirst trade ID: ", this.data.k.f,
    //	    "\nlast trade ID: ", this.data.k.L,
    //	    "\nopen price: ", this.data.k.o,
    //	    "\nclose price: ", this.data.k.c,
    //	    "\nhigh price: ", this.data.k.h,
    //	    "\nlow price: ", this.data.k.l,
    //	    "\nbase asset volume: ", this.data.k.v,
    //	    "\nnumber of trades: ", this.data.k.n,
    //	    "\ntaker buy base asset volume: ", this.data.k.V,
    //	    "\ntaker buy quote asset volume: ", this.data.k.Q
    //	    ,"end"
    //    )

    for (const i in this.indicatorsList) { // Handle this.data within each indicator class to avoid iteration like this
      const indicator = this.indicatorsList[i]
      if (indicator === 'PROC') {
        this.instances[indicator].update(this.data.k.c, Boolean(this.data.k.x)) // Change
      } else if (indicator === 'VROC') {
        this.instances[indicator].update(this.data.k.v, Boolean(this.data.k.x)) // Change
      }
      // ...
      // TODO console.log('\t', indicator, this.instances[indicator].toString())
    }
  }

  open () { this.isOpen = true }

  close () { this.isOpen = false }

  pipe (data) {
    // determine what spot module is piping data in. e.g kline, ticker etc.
    this.data = JSON.parse(data)
    // Iterate through indicators and update
    if (this.indicatorsList.length <= 0) return
    this._handleIndicators()
  }

  log () {
    throw new Error('Not implemented')
  }

  // Generalize indicator calls;
  proc () {
    return this.instances.PROC || new Error('No such indicator')
  }

  vroc () {
    return this.instances.VROC || new Error('No such indicator')
  }
}

module.exports = Indicators
