const { MongoClient } = require('mongodb')
var crypto = require('crypto')
var CronJob = require('cron').CronJob
const mongoose = require('mongoose')

const dbName = 'test'
let messages

const messagesSchema = new mongoose.Schema({
  deviceId: String,
  payload: String,
  timestamp: Date
})

module.exports.connect = (ip) => {
  // let client = mongoose.connect(`mongodb://${ip}:27019/test`, { w: 1 })
  // console.log('Connected successfully to server')
  // messages = mongoose.model('messages', messagesSchema)

  let client = new MongoClient(`mongodb://${ip}:27019/test`, { w: 1 })
  client.connect()
  const db = client.db(dbName)
  messages = db.collection('messages')

  return client
}

module.exports.clear = async (client) => {
  await messages.deleteMany({})
  console.log((await messages.find().lean()).length)
}

module.exports.insert = async (client, deviceId) => {
  return messages.insertOne({
    deviceId,
    payload: crypto.randomBytes(100).toString('hex'),
    timestamp: new Date()
  })
}

module.exports.insertMany = (client, batch) => {
  return messages.insertMany(batch)
}

module.exports.readTest1 = (client, deviceId) => {
  return messages.find({ deviceId }).toArray()
}

module.exports.readTest2 = (client, deviceId, date) => {
  return messages.find({ deviceId, timestamp: { $gt: date } }).toArray()
}

module.exports.readTest3 = (client, deviceId, limit) => {
  return messages.find({ deviceId }).sort({ timestamp: -1 }).limit(limit).toArray()
}

module.exports.distinctDeviceIds = () => {
  return messages.distinct('deviceId')
}
