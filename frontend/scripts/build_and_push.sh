#!/bin/bash

docker build --tag alpotapov/ethplz:latest --platform linux/amd64 .

docker tag alpotapov/ethplz registry.heroku.com/ethplz/web

docker push registry.heroku.com/ethplz/web