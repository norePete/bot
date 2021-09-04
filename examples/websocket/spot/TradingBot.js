const executer = require('./Executer')

console.log(process.argv);
var pairs = process.argv.slice(2)
//executer expects a list with at least 2 elements
if (pairs.length < 2) {
  pairs.push('btcusdt')
  pairs.push('ethusdt')
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const exec = new executer(pairs)

async function run(){
    await sleep(2000)
    exec.run()
}

run()
