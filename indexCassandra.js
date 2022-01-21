const cassandra = require('cassandra-driver')
var crypto = require('crypto')
var CronJob = require('cron').CronJob

const client = new cassandra.Client({
  contactPoints: ['18.197.189.193:9042', '3.64.8.152:9042'],
  localDataCenter: 'datacenter1',
  keyspace: 'messages',
  pooling: {
    maxRequestsPerConnection: 32768
  },
  socketOptions: {
    readTimeout: 40000
  }
})

const query1 = 'SELECT * FROM messages.messages;'
const query2 = 'INSERT INTO messages.messages (deviceId, payload, timestamp) VALUES (?, ?, ?);'
const query3 = 'TRUNCATE messages.messages;'

;(async () => {
  await client.execute(query3)
  const rows = await client.execute(query1)
  console.log(rows.rows.length)

  // benchmark2()

  // console.log('start')
  // let counter = 0
  // let time = Date.now()

  // while (Date.now() - time < 10000) {
  //   await client.execute(query2, [
  //     crypto.randomBytes(20).toString('hex'),
  //     crypto.randomBytes(100).toString('hex'),
  //     new Date()
  //   ])
  //   counter++
  // }

  // console.log('finished', counter)
})()

new CronJob('*/2 * * * *', benchmark2).start()

async function benchmark2() {
  console.log('start')

  let start = performance.now()

  let count = 15000

  let inserts = []
  for (let i = 0; i < count; i++) {
    inserts.push(
      client.execute(query2, [
        crypto.randomBytes(20).toString('hex'),
        crypto.randomBytes(100).toString('hex'),
        new Date()
      ])
    )
  }

  await Promise.all(inserts)

  console.log(count / ((performance.now() - start) / 1000))
}

console.log(
  761.9900002834884 +
    727.008046995138 +
    712.4091607079303 +
    704.8732133271732 +
    700.9668370158086 +
    694.7120887093008 +
    680.8140028263206 +
    678.1727781056711 +
    664.8381254347931 +
    664.027179287532
)
