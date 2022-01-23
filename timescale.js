var crypto = require('crypto')
const Pool = require('pg-pool')

const query1 = 'SELECT COUNT(*) FROM messages;'
const query2 = 'INSERT INTO messages (device, payload, timestamp) VALUES ($1::text, $2::text, $3::timestamp);'
const query3 = 'DELETE FROM messages;'
const query4 = 'SELECT DISTINCT device FROM messages;'
const query5 = 'SELECT * FROM messages WHERE device = $1::text AND timestamp > $2::timestamp;'

module.exports.connect = (ip) => {
  return new Pool({
    connectionString: `postgres://timescaledb:password@${ip}:5432`
  })
}

module.exports.clear = async (client) => {
  await client.query(query3)
}

module.exports.inserts = async (client, deviceId) => {
  return client.query(query2, [deviceId, crypto.randomBytes(100).toString('hex'), new Date()])
}

module.exports.readRandom = async (client, deviceId, date) => {
  return client.query(query5, [deviceId, date])
}

module.exports.insertMany = async (client, batch) => {
  let requests = []
  for (const element of batch) {
    requests.push(client.query(query2, [element.deviceId, element.payload, element.timestamp]))
  }

  await Promise.all(requests)
}

module.exports.distinctDeviceIds = async (client) => {
  let result = await client.query(query4)
  return result.rows.map((row) => row.device)
}

// 3 Clients
// 1 Node:    4.543
// 2 Nodes:
// 3 Nodes:
