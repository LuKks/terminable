const Terminable = require('./index.js')

const terminable = new Terminable()

const timeoutId = setTimeout(function () {
  terminable.delete(timeoutId)
  console.log('long running task')
}, 5000)

const state = terminable.add(timeoutId, function () {
  clearTimeout(timeoutId)
  setTimeout(() => console.log('clean up async'), 500)
})

process.once('SIGINT', function () {
  state.cleanup()
})

console.log('Press CTRL+C to skip 5s timeout')
