#!/bin/bash
npm i 
npm ci --cache .npm --prefer-offline

while getopts ":t:" flag;
do
    case "${flag}" in
        t) type=${OPTARG};;
        :)
        echo "Option -${OPTARG} requires an argument." >&2
        exit 1
        ;;
    esac
done

# Execute commands based on the type value
if [ "$type" == "MLS" ]; then
    echo "Running Cypress for MLS Scheduled Web-Test"
    npx cypress run --spec 'cypress/E2E/MLS/01-test-prep.cy.js' --config-file ./cypress.mls.config.js
    npx cypress run --spec 'cypress/E2E/MLS/LiveTests/01-live-test-prep.cy.js' --config-file ./cypress.mls-live.config.js
    npx cypress run --spec 'cypress/E2E/MLS/ScheduleAPITest.cy.js' --config-file ./cypress.mls.config.js
    npx cypress run --record --key $CYPRESS_MLS_KEY --browser firefox --tag 'mls-scheduled-firefox' --spec 'cypress/E2E/MLS/ScheduledTests/' --config-file './cypress.mls.config.js'
elif [ "$type" == "MLSNextPro" ]; then
    echo "Running Cypress for MLSNextPro Scheduled Web-Test"
    npx cypress run --spec 'cypress/E2E/NEXTPRO/01-test-prep.cy.js' --config-file ./cypress.nextpro.config.js
    npx cypress run --spec 'cypress/E2E/NEXTPRO/LiveTests/01-live-test-prep.cy.js' --config-file ./cypress.nextpro-live.config.js
    npx cypress run --spec 'cypress/E2E/NEXTPRO/ScheduleAPITest.cy.js' --config-file ./cypress.nextpro.config.js
    npx cypress run --record --key $CYPRESS_NEXTPRO_KEY --browser firefox --tag 'mlsnp-scheduled-firefox' --spec 'cypress/E2E/NEXTPRO/ScheduledTests/' --config-file './cypress.nextpro.config.js'
else
  echo "Invalid type value. Please use MLS or MLSNextPro."
fi
