    docker container prune

    // Setup 1

    docker exec -it mongocfg1 bash -c "echo 'rs.initiate({_id:      \"mongors1conf\",configsvr: true, members: [{ _id : 0, host : \"10.0.0.69:27020\" }]})' | mongo 10.0.0.69:27020"

    docker exec -it mongors1n1 bash -c "echo 'rs.initiate({_id : \"mongors_1\", members: [{ _id : 0, host : \"10.0.0.58:27017\" }]})' | mongo 10.0.0.58:27017"
    docker exec -it mongors2n1 bash -c "echo 'rs.initiate({_id : \"mongors_2\", members: [{ _id : 0, host : \"10.0.0.110:27017\" }]})' | mongo 10.0.0.110:27017"
    docker exec -it mongors3n1 bash -c "echo 'rs.initiate({_id : \"mongors_3\", members: [{ _id : 0, host : \"10.0.0.160:27017\" }]})' | mongo 10.0.0.160:27017"

    docker exec -it mongos1 bash -c "echo 'sh.addShard(\"mongors_1/10.0.0.58:27017\")' | mongo 10.0.0.69:27019"
    docker exec -it mongos1 bash -c "echo 'sh.addShard(\"mongors_2/10.0.0.110:27017\")' | mongo 10.0.0.69:27019"
    docker exec -it mongos1 bash -c "echo 'sh.addShard(\"mongors_3/10.0.0.160:27017\")' | mongo 10.0.0.69:27019"

    docker exec -it mongos1 bash -c "echo 'sh.enableSharding(\"test\")' | mongo 10.0.0.69:27019 "
    docker exec -it mongos1 bash -c "echo 'sh.shardCollection(\"test.messages\", {\"deviceId\" : \"hashed\"})' | mongo 10.0.0.69:27019 "

    // Compact

    docker exec -it mongors1n1 bash -c "echo 'db.runCommand( { compact : \"messages\", force: true } )' | mongo 10.0.0.58:27017"
    docker exec -it mongors2n1 bash -c "echo 'db.runCommand( { compact : \"messages\", force: true } )' | mongo 10.0.0.110:27017"


    docker exec -it mongors1n1 bash -c "echo 'db.repairDatabase()' | mongo 10.0.0.58:27017"
