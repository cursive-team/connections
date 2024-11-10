#!/bin/bash
apt-get update
apt-get install -y redis-server
cd /home/ubuntu
./arx_n424_validator server --validator-listen-host 0.0.0.0