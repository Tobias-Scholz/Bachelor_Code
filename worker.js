const { parentPort } = require('worker_threads')

const { MongoClient } = require('mongodb')
var crypto = require('crypto')
const { Worker } = require('worker_threads')

const url = 'mongodb://localhost:27019,localhost:27020/test'
const client = new MongoClient(url)
const dbName = 'test'
let messages

parentPort.on('message', async (data) => {
  await client.connect()
  console.log('Connected successfully to server')
  const db = client.db(dbName)
  messages = db.collection('messages')

  const counter = await insertMany()

  parentPort.postMessage({ counter })
})

async function insertMany() {
  let counter = 0
  let time = Date.now()

  while (Date.now() - time < 5000) {
    await messages.insertOne(generateData())
    counter++
  }

  return counter
}

function generateData() {
  return {
    deviceId: crypto.randomBytes(20).toString('hex'),
    payload: crypto.randomBytes(100).toString('hex'),
    timestamp: new Date()
  }
}
