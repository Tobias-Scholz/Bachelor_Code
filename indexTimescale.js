const pg = require('pg')
var crypto = require('crypto')

const { Client } = require('pg')
const client = new Client({
  connectionString: 'postgres://timescaledb:password@localhost:5432'
})

const query1 = 'SELECT * FROM messages;'
const query2 = 'INSERT INTO messages (device, payload, timestamp) VALUES ($1::text, $2::text, $3::timestamp);'
const query3 = 'DELETE FROM messages;'

const devices = []

for (let i = 0; i < 10000; i++) {
  devices.push(crypto.randomBytes(20).toString('hex'))
}

;(async () => {
  await client.connect()

  await client.query(query3)
  const rows = await client.query(query1)
  console.log(rows.rows.length)

  console.log('start')
  let counter = 0
  let time = Date.now()

  while (Date.now() - time < 10000) {
    await client.query(query2, [
      devices[Math.floor(Math.random() * devices.length)],
      crypto.randomBytes(100).toString('hex'),
      new Date()
    ])
    counter++
  }

  console.log('finished', counter)
  await client.end()
})()
