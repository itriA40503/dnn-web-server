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

RUN apk update

RUN apk add tzdata

RUN cp /usr/share/zoneinfo/Asia/Taipei /etc/localtime

RUN echo "Asia/Taipei" > /etc/timezone

RUN date

RUN apk del tzdata
# execute after running on container
CMD pm2-docker ecosystem.json
