const Queue = require('./queueObj.js')

// example of intended use case:
//
// const btcusdt_view = new View(client, 'btcusdt', '1m', [1,5,10,15,20,30,40,50,60,120,240])
//
// var current = btcusdt_view.get[1]
// var prev = btcusdt_view.get[120]
//
// if ( some_function_returns_true_if_good_trade(current, prev) ){
//	//do the trade
// }


// TODO make view a parent class
class View {
  // example: new View(client, 'btcusdt', '1m', [1,5,30,60])
  // will create a view with queues that store 1 min, 5 min, 30 min, 1 hour of data.
  // data cascades through the queues from smallest to largest, so the 5 min queue will
  // be empty for the first 5 min
  constructor (client, symbol, increment, queue_sizes = []) {
    this.queue_sizes = queue_sizes
    this.active_queues = {}
    this.on_ramp = this._init(client, symbol, increment)
  }

  _init (client, symbol, increment) {
    const smallest_queue = this._init_queues()
    const callback = {
      // TODO open: () => //do something
      // TODO close: () => //do something
      message: data => {
        this.update(data)
        client.logger.log(data)
      }
    }
    // TODO modularize the kind of stream a view is subscribed to
    const stream = client.klineWS(symbol, increment, callback)
    return smallest_queue
  }

  _init_queues () {
    // TODO sort queue_sizes from largest to smallest
    // this.queue_sizes.sort((a,b) => b - a );
    this.active_queues[(this.queue_sizes[0]).toString()] = new Queue(
      (this.queue_sizes[0]).toString(),
      null
    )
    for (let i = 1; i < this.queue_sizes.length; i++) {
      this.active_queues[(this.queue_sizes[i]).toString()] = new Queue(
        (this.queue_sizes[i]).toString(),
        this.active_queues[(this.queue_sizes[i - 1]).toString()] // pass in reference to the previous queue
      )
    }
    // the on ramp is the smallest queue, this is where new data is pushed,
    // data flows into larger queues after the smallest queue is filled up
    return this.active_queues[this.queue_sizes[this.queue_sizes.length - 1]]
  }

  update (data) {
    this.on_ramp.push(data)
  }

  get (period) {
    var key = (period).toString()
    return this.active_queues[key]
    // calling get(60) will return active_queues["60"] which is a reference
    // to the queue holding 60 minutes of data, i.e. the queue whose
    // instantiation looks like the following: new Queue(60, null)
  }
}



module.exports = View
