const { MongoClient } = require('mongodb')
var crypto = require('crypto')
var CronJob = require('cron').CronJob
const mongoose = require('mongoose')

const url = 'mongodb://3.64.47.95:27019/test'
const dbName = 'test'
let messages

const messagesSchema = new mongoose.Schema({
  deviceId: String,
  payload: String,
  timestamp: Date
})

module.exports.connect = (ip) => {
  let client = mongoose.connect(`mongodb://${ip}:27019/test`, { w: 0 })
  console.log('Connected successfully to server')
  messages = mongoose.model('messages', messagesSchema)

  return client
}

module.exports.clear = async (client) => {
  await messages.deleteMany({})
  console.log((await messages.find().lean()).length)
}

module.exports.insert = async (client, deviceId) => {
  return mongoose.connection.db.collection('messages').insertOne({
    deviceId,
    payload: crypto.randomBytes(100).toString('hex'),
    timestamp: new Date()
  })
}

module.exports.insertMany = async (client, batch) => {
  return mongoose.connection.db.collection('messages').insertMany(batch)
}

module.exports.readTest1 = async (client, deviceId) => {
  return messages.find({ deviceId }).lean()
}

module.exports.readTest2 = async (client, deviceId, date) => {
  return messages.find({ deviceId, timestamp: { $gt: date } }).lean()
}

module.exports.readTest3 = async (client, deviceId, limit) => {
  return messages.find({ deviceId }).sort({ timestamp: -1 }).limit(limit).lean()
}

module.exports.distinctDeviceIds = async () => {
  return messages.distinct('deviceId')
}

// 3 Clients
// 1 Node:   6.381
// 2 Nodes:  6.474
// 3 Nodes:  6.435

// Setup 2
// 1 Node 1 mongos: 4783
// 1 Node 2 mongos:
