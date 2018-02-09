FROM node:8.6-alpine

MAINTAINER Baka Wang
# change work directory
WORKDIR /dnnserver

ARG dnndbhost

ARG dnndbport

ENV DNNDB_HOST=$dnndbhost

ENV DNNDB_PORT=$dnndbport

ENV LOGGER_DISABLE=false

RUN apk update

RUN apk add tzdata

RUN cp /usr/share/zoneinfo/Asia/Taipei /etc/localtime

RUN echo "Asia/Taipei" > /etc/timezone

RUN date

RUN apk del tzdata

RUN npm install pm2 -g
# Add project. Remeber to put the Dockerfile into directory which has our project directory.
ADD ./dnn-web-server /dnnserver
# Install module
RUN npm install
# Build app
RUN npm run build
# Running testing
RUN npm test
# Generate coverage report
RUN npm run report_coverage
# Set log rotate time.
RUN pm2 set pm2-logrotate:rotateInterval '0 0 1 * * *'
# Set max log files' amount
RUN pm2 set pm2-logrotate:retain 6

VOLUME /utils

#RUN apk --update add redis

#RUN /etc/init.d/redis-server status

# expose ports
EXPOSE 80 443 8080 8443
# execute after running on container
CMD npm run start_pm2_docker
