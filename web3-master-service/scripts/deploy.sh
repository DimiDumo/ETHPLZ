#!/bin/bash

heroku container:login
heroku container:push web --app=plz-master-service
heroku container:release web --app=plz-master-service
