# Cypress Web App Automation
This project contains end-to-end tests for the MLS Web Application using Cypress.

# Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

# Prerequisites
You need Node.js installed on your machine to run this project. You can download Node.js from here.

### Installing

1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Run `npm i` to install the project dependencies.

## Running the tests

You can run the tests in two ways:
1. **Headless mode**: This will run the tests in the command line. You can run the tests in headless mode using the following command:
```bash
test:prod-report-headless
```
2. **Interactive (Headed) mode without IDE**: This will open the Cypress Test Runner, which allows you to see the tests running in a browser. You can run the tests in interactive mode using the following command:
```bash
test:prod-report
```

3. **Interactive (Headed) mode with IDE**: This will open the Cypress Test Runner, which allows you to see the tests running in a browser. You can run the tests in interactive mode using the following command:
```bash
npm run test:prod
```

# How to run in different env
- To run test in prod : "npm run test:prod"
- To run test in stage : "npm run test:stage"

# Standard Cypress Syntax
Cypress best practices recommend not using XPATH to get HTML elements where possible.
We want our code to be as readable as possible. Below are some useful tips to get HTML elements on the MLS website: 
- Data Attributes - Some elements on the MLS website use a "data-react" attribute. This can be used to uniquely identify the component, these attribute's values are rarely ever changed and should be unique. 
```javascript
    cy.get('[data-react="mls-match-hub-content-carousel"]').should('be.visible')
```

- Classname Substring - The MLS website has class names like this : "sc-jrcTuL fxOnsn mls-c-matchhub__header md". In this case it is a div and it is the only element with "mls-c-matchhub__header md" in its class name. "sc-jrcTuL fxOnsn" is likely to have been generated automatically. So the best way to get an element like this is to look for a div that contains the unique substring and omit the generated strings from the class name. 
```javascript
    cy.get('div[class*="mls-c-matchhub__header md"]').should('be.visible');
```

- Parent Elements - If a HTML element that you are looking for does not have a unique class name or helpful attributes, check for a parent element that does. You can find the parent div using the options above and then use the .find() or .within() commands in cypress to search for the child element.
Example: This div only contains one anchor element, but it didn't have a unique class name or attribute so, the code gets the parent div and then finds the correct anchor element and clicks it.
```javascript
    cy.get('div[class*="mls-c-match-list__match-container"]').should('be.visible').find('a').click();
```

# Plugins to add
- Install Cypress Helper and add `/// <reference types="Cypress" />` in top command.js file under support folder.

- ES6 Mocha snippets
- Material Icon Theame 