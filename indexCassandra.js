const cassandra = require('cassandra-driver')
var crypto = require('crypto')

const client = new cassandra.Client({
  contactPoints: ['localhost:9042', 'localhost:9043'],
  localDataCenter: 'datacenter1',
  keyspace: 'messages'
})

const query1 = 'SELECT * FROM messages.messages;'
const query2 = 'INSERT INTO messages.messages (deviceId, payload, timestamp) VALUES (?, ?, ?);'
const query3 = 'TRUNCATE messages.messages;'

;(async () => {
  await client.execute(query3)
  const rows = await client.execute(query1)
  console.log(rows.rows.length)

  console.log('start')
  let counter = 0
  let time = Date.now()

  while (Date.now() - time < 10000) {
    await client.execute(query2, [
      crypto.randomBytes(20).toString('hex'),
      crypto.randomBytes(100).toString('hex'),
      new Date()
    ])
    counter++
  }

  console.log('finished', counter)
})()
