    cqlsh

    CREATE KEYSPACE messages WITH REPLICATION = {'class': 'SimpleStrategy', 'replication_factor': 1};

    CREATE TABLE IF NOT EXISTS messages.messages (deviceId TEXT, payload TEXT, timestamp TIMESTAMP, PRIMARY KEY(deviceId, timestamp));

    INSERT INTO messages.messages (deviceId, payload, timestamp) VALUES ('abc', 'def', '2018-04-01')
