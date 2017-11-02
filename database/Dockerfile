FROM postgres:alpine

MAINTAINER Baka Wang

ENV POSTGRES_DB dnn

COPY schema.sql /docker-entrypoint-initdb.d/

RUN apk add tzdata

RUN cp /usr/share/zoneinfo/Asia/Taipei /etc/localtime

RUN echo "Asia/Taipei" > /etc/timezone

RUN date
