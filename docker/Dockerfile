FROM node:8.6-alpine

MAINTAINER Baka Wang
# change work directory
WORKDIR /dnnserver

RUN apk update

RUN apk add tzdata

RUN cp /usr/share/zoneinfo/Asia/Taipei /etc/localtime

RUN echo "Asia/Taipei" > /etc/timezone

RUN date

RUN apk del tzdata

RUN npm install pm2 -g
# add projecte
ADD ./itri-dnn-web-portal-server /dnnserver
# install module
RUN npm install
# build app
RUN npm run build
# set log rotate
RUN pm2 set pm2-logrotate:rotateInterval '0 0 1 * * *'

RUN pm2 set pm2-logrotate:retain 6

#RUN apk --update add redis

#RUN /etc/init.d/redis-server status

# expose ports
EXPOSE 80 443 8080 8443
# execute after running on container
CMD npm run start_pm2_docker
