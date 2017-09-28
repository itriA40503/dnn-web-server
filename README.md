
## What's this? ##

It's a project for managing the reservation schedule of deep-learning cluster.

## Requirement ##

* node.js: 8.0.0+
* npm: 5.0.0+

## Installation

```bash
$ npm install
$ npm run build
$ npm run start_pm2
```

## API doc ##

```bash
$ npm run apidoc
```

## Docker Tutorial ##

### Import SSL ###

```bash
$ cp ca.crt /usr/local/share/ca-certificates/
$ sudo update-ca-certificates
$ sudo service docker restart
```

### Build image ###

```bash
$ cd docker
$ docker build -t <imagename:tag> .
```

### Pull image ###

```bash
$ docker pull 100.86.2.10:32190/<imagename:tag>
```

### Run image ###

```bash
$ docker run -d -p <target port>:80 --name <container name> <imagename:tag>
```

### Push image ###

```bash
$ docker tag <source imagename:tag> 100.86.2.10:32190/<target imagename:tag>
$ docker push 100.86.2.10:32190/<target imagename:tag>
```

### Build  image from container ###

```bash
$ docker commit <container name> <imagename:tag>
```

