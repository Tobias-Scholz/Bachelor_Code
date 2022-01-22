var crypto = require('crypto')
const Pool = require('pg-pool')

const pool = new Pool({
  connectionString: 'postgres://timescaledb:password@3.64.47.95:5432'
})

const query1 = 'SELECT COUNT(*) FROM messages;'
const query2 = 'INSERT INTO messages (device, payload, timestamp) VALUES ($1::text, $2::text, $3::timestamp);'
const query3 = 'DELETE FROM messages;'

;(async () => {
  await pool.query(query3)
  //const rows = await pool.query(query1)
  console.log(rows.rows.length)

  benchmark2()
})()

async function benchmark2() {
  console.log('start')

  let results = []
  let batch_size = 100

  for (let i = 0; i < 100; i++) {
    let start = performance.now()
    let count = 1000

    let inserts = []
    for (let i = 0; i < count; i++) {
      inserts.push(
        pool.query(query2, [
          crypto.randomBytes(20).toString('hex'),
          crypto.randomBytes(100).toString('hex'),
          new Date()
        ])
      )
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
}

// 3 Clients
// 1 Node:    4.543
// 2 Nodes:
// 3 Nodes:
