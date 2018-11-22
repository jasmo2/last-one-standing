#!/bin/bash

(cd angular-example && http-server -p 3001) &
(cd angular-example/dist/angular-app && http-server -p 3000 -P http://localhost:3001) &
(cd react-example && http-server -p 4000) &
(cd vue-example && http-server -p 5000) &
wait
