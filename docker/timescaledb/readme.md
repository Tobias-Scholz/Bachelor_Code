    psql postgres://timescaledb:password@localhost:5432

    vi /var/lib/postgresql/data/postgresql.conf

    // data-nodes
    max_prepared_transactions=150
    wal_level=logical

    // access-nodes
    enable_partitionwise_aggregate=true
    jit=false

    SELECT add_data_node('dn1', host => 'timescale1');

    sudo nano /etc/postgresql/14/main/postgresql.conf
    sudo nano /etc/postgresql/14/main/pg_hba.conf

    psql -h 10.0.0.58 -U postgres

    sudo su -
    /etc/init.d/postgresql restart

    CREATE TABLE IF NOT EXISTS messages (
        device TEXT,
        payload TEXT,
        timestamp TIMESTAMP,
        PRIMARY KEY(device, timestamp)
    );

    SELECT create_hypertable('messages','timestamp');
    SELECT create_distributed_hypertable('messages','timestamp', 'device');

    INSERT INTO messages (device, payload, timestamp) VALUES ('abc', 'def', '2018-04-01')
