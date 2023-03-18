# HL Bank test stand

This repository hosts code used to perform tests over banking application sample. The goal is to get performance metrics for a low-budget cloud setup in AWS. Load tests emulate real world high load in a banking application.

The banking application sample is written using Node.js and Java. It's done for a purpose to answer the question: who's more performant in this scenario?

Please find test results in [this article on Medium](https://microsoft.com).

## Folder structure

- "java_service" - Java REST API service source code
- "nodejs_service" - Node.js REST API and Producer service source code
- "loadtests" - Artillery scripts for load testing.

## Requirements

The following software versions should be prepared:
- Node.js: v16.15+
- PostgreSQL: 13.2+
- RabbitMQ: v3.8
- Java: v11 (optional)

## How to run Node.js services

At first, create .env file on the base of env.sample and fill in DB connection details.

If it will be a monolithic REST service that does everything, set these values:
```
REST_SERVER=true
MQ_CONSUMER=false
REST_PRODUCES_MSG=false
```

If it will be a REST service that pre-process transaction and pass it further to a processing Service, use values:
```
REST_SERVER=true
MQ_CONSUMER=false
REST_PRODUCES_MSG=true
```

If it will be a Processing service that consumes messages from queue and process transactions, use these values:
```
REST_SERVER=false
MQ_CONSUMER=true
REST_PRODUCES_MSG=false
```

Setting "DB_SYNCING" should be setup to "true". It will ask Sequelize to sync DB tables on each service run.

Flag "SQL_LOG" helps to monitor SQL-statements constructed by Sequelize.

How to build a service:
```bash
> npm i
> npm run prebuild
> npm run build
```

After that a dist folder will contain the built artifact.

You can run service this way:
```bash
> npm run start:prod
```

You service will start operating on 3000 port by the default.

How to run a service in a cluster using pm2:
```bash
> npm i -g pm2
> pm2 start dist/main.js -i max
```

It will run the number of instances of the service in cluster mode. The number of instances equals the number of your CPU cores.

## How to run Java application

At first please run Node.js service at least one so the DB tables could be created automatically.

Create configuration file "src/main/resources/application.properties" based on the sample (application.properties.sample). Fill in database and rabbitmq connection details.

Build the artifact:
```bash
> mvn clean package
```

Run the service:
```bash
> java -jar hlbank-1.0.0-SNAPSHOT.jar
```

Run with an alternate location to properties file:
```bash
> java -jar -Dspring.config.location=application.properties hlbank-1.0.0-SNAPSHOT.jar
```

## Running load tests

Please install artillery before running tests:
```bash
> npm i -g artillery
```

In folder "loadtests" install dependencies for generation of random data while creating a transaction:
```bash
> npm i
```

Make sure your "scenario.yml" contains the correct URL and port for the REST service:
```bash
...
  target: 'http://localhost:3000'
...
```

Setup the expected arrivalRate (the number of simultaneous users) in "scenario.yml" for a "warm-up" and the "heat" phases.

To run tests use the following command:
```bash
> artillery run scenario.yml --output reports/report-max50-500acc.json
```

This will run the test and write the report into the specific folder/file. Artillery will display statistics of the test session also right after tests are completed.

## Authors

- [Vadzim Tashlikovich](https://github.com/vtashlikovich)
