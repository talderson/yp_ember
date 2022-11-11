#!/bin/sh

docker build --no-cache -t gdp_ember_dev .
#docker tag gdp_ember_dev updates.yieldpoint.com:5000/gdp_ember_dev
#docker push updates.yieldpoint.com:5000/gdp_ember_dev
docker tag gdp_ember_dev yieldpointadmin/gdp_ember_dev
docker push yieldpointadmin/gdp_ember_dev
