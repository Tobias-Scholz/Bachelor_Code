const cassandra = require('cassandra-driver')
var crypto = require('crypto')

const query1 = 'SELECT * FROM messages.messages;'
const query2 = 'INSERT INTO messages.messages (deviceId, payload, timestamp) VALUES (?, ?, ?);'
const query3 = 'TRUNCATE messages.messages;'
const query4 = 'SELECT DISTINCT deviceId FROM messages.messages;'
const query5 = 'SELECT * FROM messages.messages WHERE deviceId = ? AND timestamp > ?;'

module.exports.connect = (ips) => {
  return new cassandra.Client({
    contactPoints: ips,
    localDataCenter: 'datacenter1',
    keyspace: 'messages',
    pooling: {
      maxRequestsPerConnection: 32768
    },
    socketOptions: {
      readTimeout: 40000
    }
  })
}

module.exports.clear = async (client) => {
  await client.execute(query3)
  const rows = await client.execute(query1)
  console.log(rows.rows.length)
}

module.exports.insert = async (client, deviceId) => {
  return client.execute(query2, [deviceId, crypto.randomBytes(100).toString('hex'), new Date()])
}

module.exports.readRandom = async (client, deviceId, date) => {
  return client.execute(query5, [deviceId, date])
}

module.exports.insertMany = async (client, batch) => {
  let requests = []
  for (const element of batch) {
    requests.push(client.execute(query2, [element.deviceId, element.payload, element.timestamp]))
  }

  await Promise.all(requests)
}

module.exports.distinctDeviceIds = async (client) => {
  let result = await client.execute(query4)
  return result.rows.map((row) => row.deviceid)
}

// 2 Clients
// 1 Node:  20.030
// 2 Nodes: 21.839
// 3 Nodes: 21.466

// 3 Clients
// 1 Node:  20.893
// 2 Nodes: 22.311
// 3 Nodes: 24.924
