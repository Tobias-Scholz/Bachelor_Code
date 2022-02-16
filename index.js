var argv = require('minimist')(process.argv.slice(2))
const cassandra = require('./cassandra')
const mongodb = require('./mongo')
const timescale = require('./timescale')
const crypto = require('crypto')

const databaseSelection = argv.database
const test = argv.test

let client
let database

let ipsCassandra = ['35.159.39.19:9042', '3.70.161.46:9042']
let ipMongo = ['35.159.39.19']
let ipTimescale = ['35.159.39.19']

let deviceIds = []
for (let i = 0; i < 1000; i++) {
  deviceIds.push(crypto.randomBytes(20).toString('hex'))
}

if (databaseSelection === 'cassandra') {
  client = cassandra.connect(ipsCassandra)
  database = cassandra
} else if (databaseSelection === 'mongodb') {
  client = mongodb.connect(ipMongo)
  database = mongodb
} else if (databaseSelection === 'timescale') {
  client = timescale.connect(ipTimescale)
  database = timescale
}

;(async () => {
  if (test === 'throughput') {
    await database.clear(client)
    // wait 2 seconds
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log('start')

    let results = []

    for (let i = 0; i < 200; i++) {
      let start = performance.now()
      let count = 15000

      let inserts = []
      for (let i = 0; i < count; i++) {
        inserts.push(database.insert(client, crypto.randomBytes(20).toString('hex')))
      }

      await Promise.all(inserts)

      let res = count / ((performance.now() - start) / 1000)
      if (i > 10) {
        results.push(res)
        const sum = results.reduce((a, b) => a + b, 0)
        const avg = sum / results.length || 0
        console.log('avg: ', avg)
      }
      console.log(res)
    }

    console.log(calculate(results))
  } else if (test === 'default_scenario') {
    await generateHistory()

    setInterval(() => {
      database.insert(client, deviceIds[Math.floor(Math.random() * deviceIds.length)])
    }, 2)

    setInterval(() => {
      database.readTest2(client, deviceIds[Math.floor(Math.random() * deviceIds.length)], randomDate())
    }, 500)
  } else if (test === 'latency') {
    let results = []
    let deviceIds = await database.distinctDeviceIds(client)

    for (let i = 0; i < 10000; i++) {
      let start = performance.now()

      await database.readTest1(client, deviceIds[Math.floor(Math.random() * deviceIds.length)])

      results.push(performance.now() - start)

      if (i % 100 === 0) console.log(i)
    }

    console.log(calculate(results))

    results = []

    for (let i = 0; i < 10000; i++) {
      let start = performance.now()

      await database.readTest2(client, deviceIds[Math.floor(Math.random() * deviceIds.length)], randomDate())

      results.push(performance.now() - start)

      if (i % 100 === 0) console.log(i)
    }

    console.log(calculate(results))

    results = []

    for (let i = 0; i < 10000; i++) {
      let start = performance.now()

      await database.readTest3(
        client,
        deviceIds[Math.floor(Math.random() * deviceIds.length)],
        randomIntFromInterval(100, 1000)
      )

      results.push(performance.now() - start)

      if (i % 100 === 0) console.log(i)
    }

    console.log(calculate(results))
  } else if (test === 'disk_usage') {
    await new Promise((resolve) => setTimeout(resolve, 2000))

    await generateHistory(argv.document_count)
  } else if (test === 'clear') {
    await database.clear(client)
  }
})()

async function generateHistory(c) {
  await database.clear(client)
  // wait 2 seconds
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const count = c || 3000000
  const startDate = new Date()
  startDate.setMonth(startDate.getMonth() - 1)
  startDate.setHours(0, 0, 0, 0)

  let start = startDate.getTime()
  let end = new Date().getTime()

  let batchSize = 1000
  let batch = []

  for (let i = 0; i < count; i++) {
    let t = i / count

    let interpolatedValue = end * t + start * (1 - t)

    let date = new Date(interpolatedValue)

    batch.push({
      deviceId: deviceIds[Math.floor(Math.random() * deviceIds.length)],
      payload: crypto.randomBytes(100).toString('hex'),
      timestamp: date
    })

    if (batch.length === batchSize) {
      await database.insertMany(client, batch)
      batch = []
      console.log(i)
    }
  }
}

function randomDate() {
  const startDate = new Date()
  startDate.setMonth(startDate.getMonth() - 1)
  startDate.setHours(0, 0, 0, 0)

  return new Date(startDate.getTime() + Math.random() * (new Date().getTime() - startDate.getTime()))
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function calculate(data) {
  const sum = data.reduce((a, b) => a + b, 0)
  const avg = sum / data.length || 0
  return { avg, std: getStandardDeviation(data) }
}

function getStandardDeviation(array) {
  const n = array.length
  const mean = array.reduce((a, b) => a + b) / n
  return Math.sqrt(array.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
}
