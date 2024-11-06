<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
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

## Settings

These values are set in env, if not set there are default values

|           variable           |             env              | type    |       default value       |                    description                    |
| :--------------------------: | :--------------------------: | ------- | :-----------------------: | :-----------------------------------------------: |
|         BACKEND_URL          |           APP_URL            | string  |   http://localhost:3001   |                    Backed URL                     |
|         FRONTEND_URL         |         FRONTEND_URL         | string  |   http://localhost:3000   |                   Frontend URL                    |
|     INITIAL_TOKEN_AMOUNT     |     INITIAL_TOKEN_AMOUNT     | number  |            100            | Amount of tokens user recieves after registration |
|           DB_HOST            |           DB_HOST            | string  |         127.0.0.1         |                   Database Host                   |
|           DB_PORT            |           DB_PORT            | string  |           27017           |                   Database Port                   |
|           DB_NAME            |           DB_NAME            | string  |            H2H            |                   Database Name                   |
|         MONGO_SERVER         |         MONGO_SERVER         | string  |         database          |                  Database Server                  |
|        MAILER_API_URL        |        MAILER_API_URL        | string  | http://127.0.1:3002/email |                Mailer API Endpoint                |
|          MAIL_HOST           |          MAIL_HOST           | string  |      smtp.gmail.com       |                    Mailer Host                    |
|         MAIL_POLLED          |         MAIL_POLLED          | boolean |           true            |                   Email Polling                   |
|          MAIL_PORT           |          MAIL_PORT           | string  |            465            |                    Mailer Port                    |
|         MAIL_SECURED         |         MAIL_SECURED         | boolean |           true            |                  Mailer Secured                   |
|        MAIL_USERNAME         |        MAIL_USERNAME         | string  |   mailer@neti-soft.com    |                  Mailer Username                  |
|            TOKEN             |            TOKEN             | string  |   DMxdIHIEDOTQQ2aRikFf    |                   Mailer Token                    |
|            SECRET            |            SECRET            | string  |           shush           |              Secret for Auth Cookie               |
|      INACTIVITY_TIMEOUT      |      INACTIVITY_TIMEOUT      | number  |          600000           |          Time after user becomes offline          |
| INTERACTION_TOKEN_INIT_COUNT | INTERACTION_TOKEN_INIT_COUNT | number  |            25             |       Amount of tokens needed to start chat       |
|   INTERACTION_MINUTE_COST    |   INTERACTION_MINUTE_COST    | number  |             1             |           Cost for 1 minute of chatting           |

#####################################

Events to be captured by the client.

"MessageRequest" - Event within the chat system to capture messages sent by the other user during the course of the interaction (should be capture at the chat view),
"MessageOnErrorRequest" - Event within the chat system to capture errors during message delivery(should be capture at the chat view).
