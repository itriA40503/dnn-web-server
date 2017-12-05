FROM postgres:alpine

MAINTAINER Baka Wang

ENV POSTGRES_DB dnn
# Persistent data - for storing data outside the image
VOLUME /var/lib/postgresql/data
# Add intial schema and data
COPY schema.sql /docker-entrypoint-initdb.d/
# For changing time zone
RUN apk add tzdata

RUN cp /usr/share/zoneinfo/Asia/Taipei /etc/localtime

RUN echo "Asia/Taipei" > /etc/timezone

RUN date
