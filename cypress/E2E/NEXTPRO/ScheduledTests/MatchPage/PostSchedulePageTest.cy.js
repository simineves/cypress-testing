import URLS from "../../../../../NEXTPRO_URLS.json";
import Games from "../../../../../GameSchedule_MLS NEXT Pro - Playoffs.json";
import { nextProClubsMapping } from "../../../../support/compsTeamsClubs";

describe("Post Match Page Tests", () => {
  cy.on("uncaught:exception", () => false);

  before(() => {

    // Clear cookies before running
    cy.clearCookies();
    cy.clearLocalStorage();

    cy.visit(`https://www.mlsnextpro.com/schedule`);

    // Accept cookies before running tests
    cy.acceptCookies();

    cy.log("postMatchURLs : " + URLS.postMatchURLs);
  });

  Games.forEach((game) => {
    if(game.matchState == 'post') {
      it(`Testing Post Match Page : ${game.Url}`, () => {
        cy.visit(game.Url);
        
        // Print current URL to cypress log
        if (game.Url.includes("mls-next-pro")) {
          cy.log(`CURRENT URL : ${game.Url}`);
          cy.wait(3000);
  
          // Add cypress commands here for different checks
          cy.postMatchHeader(game.Url);

          cy.rightHandScoreboardCheck();
          // Verify Vertical Scoreboard Match Information
          cy.verticalScoreboardDataCheck("Feed-01.06-BaseData-Schedule", "MLS-SEA-0001K8", game.CompetitionId, game, nextProClubsMapping);

          // Summary tab
          // cy.carouselCheck();
          // cy.commentaryListCheck();
          cy.matchStatsCheck();
          cy.matchFactsCheck();
  
          // Lineups tab
          cy.get('a[href="lineups"]').click();
          cy.verifyLineupsElementsExistAndVisible();
  
          // Stats tab
          cy.get('a[href="stats"]').click();
          cy.liveMatchStatsCheckNP();
  
          // Video tab
          // cy.get('a[href="video"]').click();
          // cy.postMatchVideoCheck();
        }
      });
    }
  });
});
