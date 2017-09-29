FROM node:8.5-alpine

MAINTAINER Baka Wang
# expose ports
EXPOSE 80 443 8080 8443
# change work directory
WORKDIR /dnnserver
# add projecte
ADD ../../itri-dnn-web-portal-server /dnnserver
# install module
RUN npm install
# build app
RUN npm run build
# execute after running on container
CMD pm2-docker ecosystem.json
