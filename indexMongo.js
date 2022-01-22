const { MongoClient } = require('mongodb')
var crypto = require('crypto')
var CronJob = require('cron').CronJob

const url = 'mongodb://3.64.47.95:27019/test'
const client = new MongoClient(url, { w: 0 })
const dbName = 'test'

module.exports.connect = (ip) => {
  let client = new MongoClient(`mongodb://${ip}:27019/test`, { w: 0 })
  console.log('Connected successfully to server')
  const db = client.db(dbName)
  messages = db.collection('messages')
  return client
}

module.exports.clear = async (client) => {
  await messages.deleteMany({})
  console.log((await messages.find().toArray()).length)
}

let messages
;(async () => {
  await client.connect()
  console.log('Connected successfully to server')
  const db = client.db(dbName)
  messages = db.collection('messages')

  await messages.deleteMany({})
  console.log((await messages.find().toArray()).length)
  // wait 2 seconds
  await new Promise((resolve) => setTimeout(resolve, 2000))

  benchmark2()
})()

//new CronJob('*/2 * * * *', benchmark2).start()

async function benchmark2() {
  console.log('start')

  let results = []

  for (let i = 0; i < 100; i++) {
    let start = performance.now()
    let count = 5000

    let inserts = []
    for (let i = 0; i < count; i++) {
      inserts.push(messages.insertOne(generateData()))
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

function generateData() {
  return {
    device: crypto.randomBytes(20).toString('hex'),
    payload: crypto.randomBytes(100).toString('hex'),
    timestamp: new Date()
  }
}

/*
  3 Nodes: 47749
  2 Nodes: 48752
  1 Node : 46740
*/

// 3 Clients
// 1 Node:   6.381
// 2 Nodes:  6.474
// 3 Nodes:  6.435
