#!/bin/sh

docker build --no-cache -t yp_ember_dev .
#docker tag gdp_ember_dev updates.yieldpoint.com:5000/gdp_ember_dev
#docker push updates.yieldpoint.com:5000/gdp_ember_dev
docker tag yp_ember_dev yieldpointadmin/yp_ember_dev
docker push yieldpointadmin/yp_ember_dev
