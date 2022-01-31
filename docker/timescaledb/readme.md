    docker exec -it timescale_access_node_1 bash

    psql postgres://timescaledb:password@localhost:5432

    vi /var/lib/postgresql/data/postgresql.conf

    // data-nodes
    max_prepared_transactions=150
    wal_level=logical

    // access-nodes
    enable_partitionwise_aggregate=true
    jit=false

    SELECT add_data_node('dn1', host => '10.0.0.58');
    SELECT add_data_node('dn2', host => '10.0.0.110');

    CREATE TABLE IF NOT EXISTS messages (
        device TEXT,
        payload TEXT,
        timestamp TIMESTAMP,
        PRIMARY KEY(device, timestamp)
    );

    SELECT create_hypertable('messages','timestamp');
    SELECT create_distributed_hypertable('messages','timestamp', 'device');

    INSERT INTO messages (device, payload, timestamp) VALUES ('abc', 'def', '2018-04-01')
    CREATE INDEX ON messages (timestamp DESC, device);
