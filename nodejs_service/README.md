# Account service

## Description

Account service for management of:

* accounts
* transactions

Commands processed from the REST API and a message queue.

## Installation

```bash
$ npm i
```

### Tune pure REST API service (producer and consumer)

Environment variables (or via .enb) should be set up in the following way:

```bash
MQ_PRODUCER=false
MQ_CONSUMER=false
```

### Tune hybrid REST API/MQ service (producer and consumer)

Environment variables (or via .enb) should be set up in the following way:

```bash
MQ_PRODUCER=true
MQ_CONSUMER=true
```

### Tune pure MQ service (consumer)

Environment variables (or via .enb) should be set up in the following way:

```bash
MQ_PRODUCER=false
MQ_CONSUMER=true
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

...

## Author

- Author - [Vadzim Tashlikovich](http://tashlikovich.info)

## License

TBD.
