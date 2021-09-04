class ROC {
  constructor (value = 0, n = 3) {
    this.value = value
    this.n = n
    this.roc = null
    this.nValues = [0, 0, 0] // Dummy data
  }

  /**
     * @param {Number} val
     * @description pushes nth value in nValueArray
     */
  push (val) {
    this.nValues.push(val)
    if (this.nValues.length >= this.n) {
      this.nValues.shift()
    }
  }

  /**
     * @param {Number} val current value
     * @param {Number} nVal nth value
     * @description stores current value and nth value if defined
     */
  update (val, closed) {
    this.value = val
    if (closed) this.push(val) // If kline is closed, push val to array.
    this.roc = ((this.value - this.nValues[0]) / this.nValues[0]) * 100
  }

  toString () {
    return this.roc
  }
}

class VROC extends ROC {
  constructor (value, n = 3) {
    super(value, n)
  }
}

module.exports = { ROC, VROC }
