#!/usr/bin/env bash

# https://stackoverflow.com/questions/14696427/how-can-bash-script-do-the-equivalent-of-ctrl-c-to-a-background-task
# https://stackoverflow.com/questions/4351521/how-do-i-pass-command-line-arguments-to-a-node-js-program

npm run server -- 9080 &
pid[0]=$!
npm run server -- 3320 &
pid[1]=$!
trap "kill ${pid[0]} ${pid[1]}; exit 1" INT
wait