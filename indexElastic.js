const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: 'http://localhost:9200' })
const crypto = require('crypto')

;(async () => {
  await client.index({
    index: 'messages',
    body: {
      mappings: {
        messages: {
          ttl: {
            enabled: true
          }
        }
      }
    }
  })

  await client.deleteByQuery({
    index: 'messages',
    body: {
      query: {
        match_all: {}
      }
    }
  })

  return

  console.log('start')
  let counter = 0
  let time = Date.now()

  while (Date.now() - time < 10000) {
    await client.index({
      index: 'messages',
      body: {
        deviceId: crypto.randomBytes(20).toString('hex'),
        timestamp: Date.now(),
        payload: crypto.randomBytes(100).toString('hex')
      }
    })
    counter++
    //console.log(Date.now() - time)
  }

  console.log('finished', counter)
})()
