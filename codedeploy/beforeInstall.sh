#!/bin/sh

sudo systemctl stop application_boot.service
echo "start"
pwd 
ls
echo "removing old webserver"
sudo rm -rf /tmp/webserver.zip
cd
echo "home directory"
rm -rf "webserver"
echo "end"
sudo rm /tmp/amazon-cloudwatch-agent.json
