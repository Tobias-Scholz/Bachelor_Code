const { MongoClient } = require('mongodb')
var crypto = require('crypto')
var CronJob = require('cron').CronJob

const url = 'mongodb://3.67.113.239:27019/test'
const client = new MongoClient(url, { w: 0 })
const dbName = 'test'

let messages
;(async () => {
  await client.connect()
  console.log('Connected successfully to server')
  const db = client.db(dbName)
  messages = db.collection('messages')

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

  benchmark2()
})()

//new CronJob('*/2 * * * *', benchmark2).start()

async function benchmark2() {
  console.log('start')

  let start = performance.now()

  let count = 15000

  let inserts = []
  for (let i = 0; i < count; i++) {
    inserts.push(messages.insertOne(generateData()))
  }

  await Promise.all(inserts)

  console.log(count / ((performance.now() - start) / 1000))
}

async function benchmark() {
  console.log('start')
  let counter = 0
  let time = Date.now()

  while (Date.now() - time < 10000) {
    await messages.insertOne(generateData())
    counter++
  }

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
