    docker run --name cassandra1 -d -e CASSANDRA_BROADCAST_ADDRESS=10.0.0.69 -p 7000:7000 -p 9042:9042 cassandra:latest
    docker run --name cassandra2 -d -e CASSANDRA_BROADCAST_ADDRESS=10.0.0.58 -e CASSANDRA_SEEDS=10.0.0.69 -p 7000:7000 -p 9042:9042 cassandra:latest
    docker run --name cassandra3 -d -e CASSANDRA_BROADCAST_ADDRESS=10.0.0.110 -e CASSANDRA_SEEDS=10.0.0.69 -p 7000:7000 -p 9042:9042 cassandra:latest

    docker exec -it cassandra1 bash

    cqlsh

    CREATE KEYSPACE messages WITH REPLICATION = {'class': 'SimpleStrategy', 'replication_factor': 1};

    CREATE TABLE IF NOT EXISTS messages.messages (deviceId TEXT, payload TEXT, timestamp TIMESTAMP, PRIMARY KEY(deviceId, timestamp));

    INSERT INTO messages.messages (deviceId, payload, timestamp) VALUES ('abc', 'def', '2018-04-01')
