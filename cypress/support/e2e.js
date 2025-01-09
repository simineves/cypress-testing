// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

const registerCypressGrep = require("@cypress/grep");

// Import commands.js using ES2015 syntax:
import "./commands";
import "./api_commands.js"
import "@bahmutov/cy-api";
import "cypress-mochawesome-reporter/register";
import "./pageObject/HomePage/homePage";
import "./pageObject/Standings/standingsUtil";
import "./pageObject/News/newsPage.js";
import "./pageObject/Stats/StatsPage.js";

// Alternatively you can use CommonJS syntax:
// require('./commands')
// Cypress.on('uncaught:exception', () => false);

Cypress.on("uncaught:exception", (err, runnable) => {
  return false;
});

beforeEach(() => {
  cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
});

// Grep for tagging
registerCypressGrep();
