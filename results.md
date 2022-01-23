Memory
-> docker stats

| Mongodb             | Cassandra | TimescaleDB |
| ------------------- | --------- | ----------- |
| Mongos: 22.95 MiB   | 2.265 GiB | 1.288 GiB   |
| Mongocfg: 93.95 MiB | 2.299 GiB | 1.721 GiB   |
| Mongod1: 1.464 GiB  |           | 1.777 GiB   |
| Mongod2: 2.46 GiB   |           |             |
|                     |           |             |
| Total: 4,0409 GiB   |           |             |

Latency

| Mongodb  | Cassandra | TimescaleDB |
| -------- | --------- | ----------- |
| 1.547 ms | 10.25 ms  | 24.297 ms   |

Storage
-> docker system df -v

|                      | Mongodb               | Cassandra     | TimescaleDB           |
| -------------------- | --------------------- | ------------- | --------------------- |
| 0 Dokumente          | 315.3 MB \* 3         | 67.2 + 67.23  | 73.2 + 73.11 + 73.11  |
| 100.000 Dokumente    | 316.2 + 346.9 + 350.1 | 67.22 + 67.23 | 169.4 + 149.7 + 148.1 |
| 1.000.000 Dokumente  | 318.3 + 714.3 + 719.9 | 216.6 + 251.4 | 871.6 + 794.6 + 822.5 |
| 5.000.000 Dokumente  | 319.4 + 1985 + 2553   | 878 + 964.4   | 2332 + 1853 + 1906    |
| 10.000.000 Dokumente | 320.1 + 4590 + 3125   | 2357 + 2537   |                       |
