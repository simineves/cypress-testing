const cypress = require('cypress');
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  defaultCommandTimeout: 25000,
  pageLoadTimeout: 600000,
  requestTimeout: 25000,
  watchForFileChanges: false,
  viewportWidth: 1440,
  viewportHeight: 900,
  retries: 0,
  projectId: "dfppxy",
  e2e: {
    grep: 'Works',
    grepFilterTests: true,
    specPattern: 'cypress/E2E',
    fixturesFolder: 'cypress/fixtures',
    supportFile: 'cypress/support/e2e.js',
    viewportHeight: 1080,
    viewportWidth: 1920,
    testIsolation: false,
    retries: {
      runMode: 2,
      openMode: 0,
    },
    excludeSpecPattern: ['*/*/*/*/README.md', '*/*/*/Testing.spec.js'],
    chromeWebSecurity: false,
    env: {
      baseURL: "https://www.mlssoccer.com",
      sportAPIBaseURL: "https://sportapi.mlssoccer.com/api",
      STSAPIBaseURL: "https://httpget.distribution.production.mls-datahub.com/DeliveryPlatform/REST/PullOnce/",
      stsClientID: process.env.STSCLIENTID,
      username: process.env.CYPRESS_TEST_EMAIL,
      password: process.env.CYPRESS_TEST_PASSWORD,
      name: process.env.CYPRESS_TEST_USERNAME,
      statsAPIBaseURL: "https://stats-api.mlsdigital.net/v1",
      statsAPIToken: process.env.statsAPIToken,
      statsDatahubToken: process.env.MLS_DATAHUB_STATS_SECRET,
      competitionOptaId: "98",
      seasonOptaId: "2024",
      portfolio: 6,
      processor: 0
    },

    setupNodeEvents(on, config) {
      // Mocha report
      require('cypress-mochawesome-reporter/plugin')(on);
      // Cypress grep for tagging
      require('@cypress/grep/src/plugin')(config);
      return config;
    },

  }


});
