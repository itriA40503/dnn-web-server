
## What's this? ##

It's a project for managing the reservation schedule of deep-learning cluster.

## Security header ##

| Headers | enable |
|---|:---:|
| Content Security Policy | ✓ |
| Controls browser DNS prefetching | ✓ |
| Prevent clickjacking | ✓ |
| Remove the X-Powered-By header | ✓ |
| HTTP Strict Transport Security | ✓ |
| Sets X-Download-Options for IE8+ | ✓ |
| Keep clients from sniffing the MIME type | ✓ |
| Adds some small XSS protections | ✓ |

## Requirement ##

* node.js: 8.0.0+
* npm: 5.0.0+

## Installation and Running

```bash
$ npm install
$ npm install pm2 -g
$ npm run build
$ mkdir /utils
$ npm run start_pm2
```

## Testing ##

```bash
$ npm test
```

## API doc ##

* Only running on development mode.
* Set testing url on environment

## Environment Variables

Setting environment variables when start container.

| Environment Variables | Description |
|----------|:-------------|
| NODE_ENV |  Set the mode to `development` or `production`. |
| DNNDB_HOST | This environment variable can be used to set the postgreSQL database host. |
| DNNDB_PORT | This environment variable can be used to set the postgreSQL database port. | 
| DNNDB_DBNAME | Database name. Default = `dnn`. |
| DNNDB_USERNAME | Database usesername. |
| DNNDB_PASS | Database password. |
| K8S_API | K8S api url. Ex: `http://100.86.2.12:30554/kubeGpu`. |
| APIDOC_HOST | Set testing url host of api document. Default=`140.96.29.86` |
| APIDOC_PORT | Set testing url port of api document. Default=`6363` |
| MAIL_SERVER_HOST | SMTP server host. Default = `smtpx.itri.org.tw` |
| MAIL_SERVER_PORT | SMTP server port. Default = `25` |
| MAIL_SERVER_USERNAME | SMTP server username.|
| MAIL_SERVER_PASS | SMTP server password. |
| LOGGER_DISABLE | Disable logger. |


## Docker Tutorial ##

### Import SSL ###

```bash
$ cp ca.crt /usr/local/share/ca-certificates/
$ sudo update-ca-certificates
$ sudo service docker restart
```

### Copy Dockerfile to the right situation ###

$ cp docker/server/Dockerfile ../../../Dockerfile

### Build project image ###

```bash
$ cd /<parent directory of project root>
$ docker build -t <imagename:tag> .
```

### Build database image ###

```bash
$ cd database
$ docker build -t <database-imagename:tag> .
```

### Pull image ###

```bash
$ docker pull 100.86.2.10:32190/<imagename:tag>
```

### Run image ###

```bash
$ docker run -d -p <target port>:80 -p <target port>:443 --dns <dns ip> --name <container name> <imagename:tag>
```
* Setting `dns ip` to be available for `smtpx.itri.org.tw`.
* `dns ip` can use `140.96.254.98`.

### Push image ###

```bash
$ docker tag <source imagename:tag> 100.86.2.10:32190/<target imagename:tag>
$ docker push 100.86.2.10:32190/<target imagename:tag>
```

### Build  image from container ###

```bash
$ docker commit <container name> <imagename:tag>
```

## Check Vulnerabilities ##

```bash
$ npm install -g nsp
$ nsp check
```

## Language ##
* ECMAScript 6

## Coding Style ##
* Base on [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)

## Authors ##
* A40503 (0.2.5 - )
* Kevin Huang (0.2.5 - )
* Yenhsuan (0.2.5 - )
* Baka Wang (Creator)(- 0.2.5)

## Change log ##

* `0.2.5` Schedule and machine management complete.
* `0.2.4` Schedule management refactor.
* `0.2.3` Production version release.
