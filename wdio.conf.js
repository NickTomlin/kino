const path = require('path')
const extensionPath = path.join(__dirname, './extension')

const { DEBUGGING } = process.env

exports.config = {
  port: '9515',
  path: '/',
  specs: [
    'test/extension/*.test.js'
  ],
  capabilities: [{
    browserName: 'chrome',
    chromeOptions: {
      args: [
        `--load-extension=${extensionPath}`
      ]
    }
  }],
  sync: false,
  logLevel: 'silent',
  coloredLogs: true,
  bail: 0,
  screenshotPath: './test/extension/failure-screenshots/',
  baseUrl: 'http://localhost',
  waitforTimeout: DEBUGGING ? 999999 : 10000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,
  framework: 'mocha',
  services: ['chromedriver'],
  mochaOpts: {
    timeout: DEBUGGING ? 99999 : 2000,
    ui: 'bdd'
  }
}
