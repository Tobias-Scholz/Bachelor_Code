var crypto = require('crypto')
const Pool = require('pg-pool')

const query1 = 'SELECT COUNT(*) FROM messages;'
const query2 = 'INSERT INTO messages (device, payload, timestamp) VALUES ($1::text, $2::text, $3::timestamp);'
const query3 = 'DELETE FROM messages;'
const query4 = 'SELECT DISTINCT device FROM messages;'
const query5 = 'SELECT * FROM messages WHERE device = $1::text;'
const query6 = 'SELECT * FROM messages WHERE device = $1::text AND timestamp > $2::timestamp;'
const query7 = 'SELECT * FROM messages WHERE device = $1::text ORDER BY timestamp DESC LIMIT $2::integer;'

module.exports.connect = (ip) => {
  return new Pool({
    connectionString: `postgres://timescaledb:password@${ip}:5432`
  })
}

module.exports.clear = async (client) => {
  await client.query(query3)
}

module.exports.insert = async (client, deviceId) => {
  return client.query(query2, [deviceId, crypto.randomBytes(100).toString('hex'), new Date()])
}

module.exports.readTest1 = async (client, deviceId) => {
  return client.query(query5, [deviceId])
}

module.exports.readTest2 = async (client, deviceId, date) => {
  return client.query(query6, [deviceId, date])
}

module.exports.readTest3 = async (client, deviceId, limit) => {
  return client.query(query7, [deviceId, limit])
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
// 2 Nodes:   1.593
// 3 Nodes:
