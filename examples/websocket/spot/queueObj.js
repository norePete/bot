class Queue {
  // feedforward is another (similar) object, set to null if not used
  // add "mapping" parameter so user can query data using string keys i.e. "symbol"
  constructor (size, feedforward = {}) {
    this.memory = new Array(size)
    this.headposition = 0
    this.size = size
    this.feedforward = feedforward
    this.default_function = null
  }

  push (data) {
    // push new data onto the queue
    this.memory[this.headposition] = data

    this.headposition++

    // once the memory is full, i.e. headposition reaches the end of the array
    // dump all the data into the feeforward object, and start overwriting data from the
    // beginning of the array
    if (this.headposition >= this.size) {
      this.headposition = 0// reset back to the start
      if (this.feedforward !== null && typeof this.feedforward !== 'undefined') {
        for (let i = 0; i < this.size; i++) {
          // push all data into the next object
          (async () => {
            this.feedforward.push(this.memory[i])
          })()
        }
      }
    }
  }

  calculate (func) {
    return func(this.memory)
  }

  priority(){
	if (typeof this.memory[0] === 'undefined' || typeof this.memory[0].k === 'undefined'){
	    return 1
	} else if (JSON.parse(this.memory[0]).k.v > 20) {
	    return 2
	} else {
	    return 7
	}
  }

  set_default (default_function) {
    this.default_function = default_function
  }

  calc () {
    if (this.default_function === null) { return }
    return calculate(this.default_function)
  }

  data () {
    return this.memory
  }
}

module.exports = Queue
