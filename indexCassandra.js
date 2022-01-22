const cassandra = require('cassandra-driver')
var crypto = require('crypto')

const query1 = 'SELECT * FROM messages.messages;'
const query2 = 'INSERT INTO messages.messages (deviceId, payload, timestamp) VALUES (?, ?, ?);'
const query3 = 'TRUNCATE messages.messages;'

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

module.exports.insert = async (client) => {
  return client.execute(query2, [
    crypto.randomBytes(20).toString('hex'),
    crypto.randomBytes(100).toString('hex'),
    new Date()
  ])
}

// 2 Clients
// 1 Node:  20.030
// 2 Nodes: 21.839
// 3 Nodes: 21.466

// 3 Clients
// 1 Node:  20.893
// 2 Nodes: 22.311
// 3 Nodes: 24.924
