Insert

|         | Mongodb | Cassandra | TimescaleDB |
| ------- | ------- | --------- | ----------- |
| 1 Node  | 6.381   | 20.893    | 4.543       |
| 2 Nodes | 6.474   | 22.311    | 1.593       |
| 3 Nodes | 6.435   | 24.924    |             |

Cassandra Insert 3 Nodes

| Mode                    | Result |
| ----------------------- | ------ |
| RoundRobin              | 25.205 |
| Default                 | 24.983 |
| DCAwareRoundRobinPolicy | 24.310 |
| TokenAwarePolicy        | 24.997 |

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

Latency (inside)

| Mongodb  | Cassandra | TimescaleDB |
| -------- | --------- | ----------- |
| 9.547 ms | 10.25 ms  | 24.297 ms   |

v2

|        | MongoDB | Cassandra | TimescaleDB |
| ------ | ------- | --------- | ----------- |
| Test 1 | 34.93   | 15.71 ms  | 26.12 ms    |
| Test 2 | 22.30   | 8.61 ms   | 15.60 ms    |
| Test 3 | 16.91   | 4.13 ms   | 10.37 ms    |

std

|        | MongoDB | Cassandra | TimescaleDB |
| ------ | ------- | --------- | ----------- |
| Test 1 | 2.36    | 3.12      | 1.37        |
| Test 2 | 7.25    | 4.71      | 6.27        |
| Test 3 | 3.53    | 1.77      | 1.46        |

v2 outside

|        | MongoDB | Cassandra | TimescaleDB |
| ------ | ------- | --------- | ----------- |
| Test 1 |         | 99.79 ms  | 103.86 ms   |
| Test 2 |         | 58.92 ms  | 63.87 ms    |
| Test 3 |         | 35.55 ms  | 40.13 ms    |

Storage
-> docker system df -v

|                      | Mongodb               | Cassandra     | TimescaleDB           |
| -------------------- | --------------------- | ------------- | --------------------- |
| 0 Dokumente          | 315.3 MB \* 3         | 67.2 + 67.23  | 73.2 + 73.11 + 73.11  |
| 100.000 Dokumente    | 316.2 + 346.9 + 350.1 | 67.22 + 67.23 | 169.4 + 149.7 + 148.1 |
| 1.000.000 Dokumente  | 318.3 + 714.3 + 719.9 | 216.6 + 251.4 | 871.6 + 794.6 + 822.5 |
| 5.000.000 Dokumente  | 319.4 + 1985 + 2553   | 878 + 964.4   |                       |
| 10.000.000 Dokumente | 320.1 + 4590 + 3125   | 2357 + 2537   |                       |
