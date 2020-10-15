#!/usr/bin/env bash
for i in {1..10}
do
  echo "ClientID ClientSecret $i"
  for j in 1 2
  do
    GROUP1=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 8 | head -n 1)
    GROUP2=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 4 | head -n 1)
    GROUP3=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 4 | head -n 1)
    GROUP4=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 4 | head -n 1)
    GROUP5=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 4 | head -n 1)
    GROUP6=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 12 | head -n 1)
    echo "$GROUP1-$GROUP2-$GROUP3-$GROUP4-$GROUP5-$GROUP6"
  done
  echo " "
done
