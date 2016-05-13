'use strict';

const host = process.env.appHost || 'localhost';
const port = process.env.appPort || 3000;

module.exports = {
    host: host,
    port: port,
    slackToken: "<slack_token>",
    wbAPI: "<Wallboarder API URL>"
};