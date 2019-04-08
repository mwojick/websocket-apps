#!/usr/bin/env bash

# https://stackoverflow.com/questions/14696427/how-can-bash-script-do-the-equivalent-of-ctrl-c-to-a-background-task
# https://stackoverflow.com/questions/4351521/how-do-i-pass-command-line-arguments-to-a-node-js-program

npm run server -- 80 &
pid[0]=$!
npm run server -- 8080 &
pid[1]=$!
npm run server -- 3310 &
pid[2]=$!
npm run server -- 3306 &
pid[3]=$!
trap "kill ${pid[0]} ${pid[1]} ${pid[2]} ${pid[3]}; exit 1" INT
wait