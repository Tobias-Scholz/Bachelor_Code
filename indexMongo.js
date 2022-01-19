const { MongoClient } = require('mongodb')
var crypto = require('crypto')
var CronJob = require('cron').CronJob

const url = 'mongodb://localhost:27019,localhost:27020/test'
const client = new MongoClient(url, { w: 0 })
const client2 = new MongoClient(url, { w: 0 })
const dbName = 'test'

let messages
let messages2
;(async () => {
  await client.connect()
  await client2.connect()
  console.log('Connected successfully to server')
  const db = client.db(dbName)
  const db2 = client2.db(dbName)
  messages = db.collection('messages')
  messages2 = db2.collection('messages')

  await messages.deleteMany({})
  console.log((await messages.find().toArray()).length)

  //   let workers = []
  //   for (let i = 0; i < 100; i++) {
  //     workers.push(new Worker('./worker.js'))
  //   }

  //   workers.forEach((worker) =>
  //     worker.on('message', (result) => {
  //       console.log(result)
  //     })
  //   )

  //   workers.forEach((worker) => worker.postMessage('message'))

  benchmark()
})()

// new CronJob('*/1 * * * *', benchmark).start()

async function benchmark() {
  console.log('start')
  let counter = 0
  let time = Date.now()

  while (Date.now() - time < 30000) {
    messages.insertOne(generateData())
    counter++
    console.log(Date.now() - time)
  }

  console.log(await messages2.count())

  console.log('finished', counter)
}

function generateData() {
  return {
    deviceId: crypto.randomBytes(20).toString('hex'),
    payload: crypto.randomBytes(100).toString('hex'),
    timestamp: new Date()
  }
}

/*
  3 Nodes: 47749
  2 Nodes: 48752
  1 Node : 46740
*/
