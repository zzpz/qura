#!/bin/bash
echo "S3=s3://${S3}" >> /etc/environment
echo "DB=${DB}" >> /etc/environment
echo "DB2=${DB2}" >> /etc/environment
echo "CFRONT=${CFRONT}" >> /etc/environment

sudo yum update -y
sudo yum install -y docker

sudo usermod -a -G docker ec2-user

sudo service docker start
sudo systemctl enable docker

sudo docker login ghcr.io -u USER -p PERSONAL_ACCESS_TOKEN
sudo docker pull ghcr.io/USER/IMAGE
#run docker, sudo shouldn't be necessary for any of these commands 

