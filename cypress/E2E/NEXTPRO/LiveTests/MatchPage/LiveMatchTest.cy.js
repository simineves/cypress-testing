const webAppBaseURL = Cypress.env("baseURL");
const statsAPIToken = Cypress.env("statsAPIToken");

import URLS from "../../../../../NEXTPRO_LIVE_URLS.json";
import Games from "../../../../../GameSchedule_MLS NEXT Pro - Playoffs.json";
import { nextProClubsMapping } from "../../../../support/compsTeamsClubs";


describe("Check Live MLSNextPro Game Details", () => {
  cy.on("uncaught:exception", () => false);

  let apiResponseCount;
  // Initialize an empty array to store href links
  before(() => {
    // Call your API and get the JSON response
    cy.request(
      "GET",
      `https://stats-api.mlsdigital.net/v1/matches?token=${statsAPIToken}&competition_opta_id=1164&match_is_live=true`
    )
      .its("body")
      .then((response) => {
        // Assuming the API response is an array of objects
        apiResponseCount = response.length;
      });

    // Clear cookies before running
    cy.clearCookies();
    cy.clearLocalStorage();

    cy.visit(`${webAppBaseURL}/schedule`);

    // Accept cookies before running tests
    cy.acceptCookies();
  });

  it("Check that schedule page has the correct amount of live games showing", () => {
    apiResponseCount == URLS.liveMatchURLs.length;
  });

  Games.forEach((game) => {
    if(game.matchState == "live") {
      it(`Testing Live Game : ${game.Url}`, () => {
        cy.getCookies().should("not.be.empty");
        cy.clearCookies();
        cy.getCookies().should("be.empty");
  
        cy.visit(game.url).get("body").should("exist");
  
        cy.wait(2000);
  
        if (game.Url.includes("mls-next-pro")) {
          // Verify Live Match Banner
          cy.validateLiveNextProMatchBanner();
  
          // Verify carousel check
          cy.carouselCheck();
          cy.rightHandScoreboardCheck();

          // Verify Vertical Scoreboard Match Information
          cy.verticalScoreboardDataCheck("Feed-01.06-BaseData-Schedule", "MLS-SEA-0001K8", game.CompetitionId, game, nextProClubsMapping);
  
          // Verify Match Stats Check
          cy.liveMatchStatsCheckNP();
  
          // Verify Match Facts Check
          cy.liveMatchFactsCheck();
  
          // Click on Lineups
          cy.get('a[href="lineups"]').click();
          cy.wait(2000);
  
          // Verify if lineups headers are available
          cy.get('div[class*="mls-c-lineups__header"]')
            .should("exist")
            .should("be.visible");
  
          // Verify Match Starting Lineups
          cy.get(`button[aria-label='Starting']`).click();
          cy.verifyLineupsElementsExistAndVisible();
  
          // Verify Match Current Lineups
          cy.get(`button[aria-label='Current']`).click();
          cy.verifyLineupsElementsExistAndVisible();
  
          // Click on Stats
          cy.get('a[href="stats"]').click();
          cy.wait(2000);
  
          // Verify if headers are available
          cy.get('div[class*="mls-o-stats-toggle__header"]')
            .should("exist")
            .should("be.visible");
          cy.get(`button[aria-label='Clubs']`).click();
          cy.liveMatchStatsCheckNP();
          cy.liveMatchShootingBreakdownStatsCheck();
          cy.liveMatchPassingBreakdownStatsCheck();
          cy.liveMatchPlayersStatsCheck();
          cy.wait(3000);
        }
      });
    }
  });
});
