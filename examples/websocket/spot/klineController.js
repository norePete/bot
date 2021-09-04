const View = require('./view.js')

class KlineController {
  constructor (client, symbols = []) {
    this.symbol_list = symbols
    this.view_map = {}
    this.valid_time_frames = new Array(480, 240)
    this._init_views(client)
  }

  _init_views (client) {
    for (let i = 0; i < this.symbol_list.length; i++) {
      this.view_map[this.symbol_list[i]] = new View(
        client,
        this.symbol_list[i],
        '1m',
        this.valid_time_frames
      )
    }
  }

  // returns view object containing all queues
  get_view (symbol) {
    return this.view_map[symbol]
  }

  // returns only the specified queue
  get_window (symbol, time_frame) {
    return this.view_map[symbol].get(time_frame)
  }

  get_symbol_list () {
    return this.symbol_list
  }

  get_time_frames () {
    return this.valid_time_frames
  }
}

module.exports = KlineController
