const { MongoClient } = require('mongodb')
var crypto = require('crypto')
var CronJob = require('cron').CronJob

const url = 'mongodb://3.64.47.95:27019/test'
const client = new MongoClient(url, { w: 0 })
const dbName = 'test'

module.exports.connect = (ip) => {
  let client = new MongoClient(`mongodb://${ip}:27019/test`, { w: 0 })
  client.connect()
  console.log('Connected successfully to server')
  const db = client.db(dbName)
  messages = db.collection('messages')
  return client
}

module.exports.clear = async (client) => {
  await messages.deleteMany({})
  console.log((await messages.find().toArray()).length)
}

module.exports.insert = async (client, deviceId) => {
  return messages.insertOne({
    deviceId,
    payload: crypto.randomBytes(100).toString('hex'),
    timestamp: new Date()
  })
}

module.exports.insertMany = async (client, batch) => {
  return messages.insertMany(batch)
}

module.exports.readRandom = async (client, deviceId, date) => {
  return messages
    .find({ deviceId, timestamp: { $lt: date } })
    .limit(100)
    .toArray()
}

module.exports.distinctDeviceIds = async () => {
  return messages.distinct('deviceId')
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
