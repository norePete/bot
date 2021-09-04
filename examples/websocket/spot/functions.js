function getAverageVolume (data_set = []) {
  if (typeof data_set === undefined) { return }
  var valid_entries = new Array(data_set.length)
  for (let i = 0; i < data_set.length; i++) {
    if (typeof data_set[i] === 'undefined') {
      valid_entries[i] = false
    } else { valid_entries[i] = true }
  }
  var sum = 0
  var denominator = data_set.length
  for (let i = 0; i < data_set.length; i++) {
    if (valid_entries[i]) {
      try {
        sum += parseInt(JSON.parse(data_set[i]).k.v)
      } catch (err) {
        denominator--
        // console.log(err)
        break
      }
    }
  }
  return sum / denominator
}

function volume_spike (current, previous) {
  return current > (previous * 2)
}

module.exports = getAverageVolume
