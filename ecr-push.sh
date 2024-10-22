#!/bin/bash
# avoid using this script in favour of GA
TAG=$(git rev-parse --short HEAD)
aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin 891377379277.dkr.ecr.ap-southeast-1.amazonaws.com

docker build -t argus:$TAG .

docker tag argus:$TAG 891377379277.dkr.ecr.ap-southeast-1.amazonaws.com/argus:$TAG

docker push 891377379277.dkr.ecr.ap-southeast-1.amazonaws.com/argus:$TAG