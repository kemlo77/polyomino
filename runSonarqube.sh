#!/bin/bash
docker run\
 -d\
 --rm\
 --name sonarqube\
 -p 9000:9000\
 sonarqube:8.9-community

# this will start a docker container with SonarQube locally
# anv: admin
# pwd: admin
# access it on localhost:9000

# https://blog.setapp.pl/sonarqube_introduction
echo "access it on localhost:9000 (user: admin, initial-pwd: admin, new-pwd: test1234)"