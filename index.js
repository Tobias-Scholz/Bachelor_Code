var argv = require('minimist')(process.argv.slice(2))
const cassandra = require('./indexCassandra')

const databaseSelection = argv.database
const test = argv.test

let client
let database

let ipsCassandra = ['3.68.199.80:9042']
let ipMongo = []
let ipTimescale = []

if (databaseSelection === 'cassandra') {
  client = cassandra.connect()
  database = cassandra
} else if (databaseSelection === 'mongodb') {
} else if (databaseSelection === 'timescale') {
}

;(async () => {
  await database.clear(client)
  // wait 2 seconds
  await new Promise((resolve) => setTimeout(resolve, 2000))

  if (test === 'throughput') {
    console.log('start')

    let results = []

    for (let i = 0; i < 100; i++) {
      let start = performance.now()
      let count = 15000

      let inserts = []
      for (let i = 0; i < count; i++) {
        inserts.push(cassandra.insert(client))
      }

      await Promise.all(inserts)

      let res = count / ((performance.now() - start) / 1000)
      if (i > 10) {
        results.push(res)
        const sum = results.reduce((a, b) => a + b, 0)
        const avg = sum / results.length || 0
        console.log('avg: ', avg)
      }
      console.log(res)
    }
  }
})()
