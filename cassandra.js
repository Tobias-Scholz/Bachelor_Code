const cassandra = require('cassandra-driver')
var crypto = require('crypto')

const query1 = 'SELECT * FROM messages.messages;'
const query2 = 'INSERT INTO messages.messages (deviceId, payload, timestamp) VALUES (?, ?, ?);'
const query3 = 'TRUNCATE messages.messages;'
const query4 = 'SELECT DISTINCT deviceId FROM messages.messages;'

const query5 = 'SELECT * FROM messages WHERE deviceId = ?;'
const query6 = 'SELECT * FROM messages.messages WHERE deviceId = ? AND timestamp > ?;'
const query7 = 'SELECT * FROM messages WHERE deviceId = ? ORDER BY timestamp DESC LIMIT ?;'

module.exports.connect = (ips) => {
  return new cassandra.Client({
    contactPoints: ips,
    keyspace: 'messages',
    localDataCenter: 'datacenter1',
    pooling: {
      maxRequestsPerConnection: 32768
    },
    socketOptions: {
      readTimeout: 40000
    },
    policies: {
      loadBalancing: new cassandra.policies.loadBalancing.DefaultLoadBalancingPolicy()
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

module.exports.readTest1 = async (client, deviceId) => {
  return client.execute(query5, [deviceId], { prepare: true })
}

module.exports.readTest2 = async (client, deviceId, date) => {
  return client.execute(query6, [deviceId, date], { prepare: true })
}

module.exports.readTest3 = async (client, deviceId, limit) => {
  return client.execute(query7, [deviceId, limit], { prepare: true })
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
