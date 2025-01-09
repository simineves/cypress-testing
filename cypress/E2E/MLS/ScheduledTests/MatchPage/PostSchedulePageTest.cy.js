const webAppBaseURL = Cypress.env("baseURL");
import Games from "../../../../../GameSchedule_Major League Soccer - Cup Playoffs.json";
import { MLSClubMapping } from "../../../../support/compsTeamsClubs";

describe("Post Match Page Tests", () => {
  cy.on("uncaught:exception", () => false);

  before(() => {
    // Clear cookies
    cy.clearCookies();
    cy.clearLocalStorage();

    cy.visit(`${webAppBaseURL}/schedule/scores`);

    // Accept cookies
    cy.acceptCookies();
  });

  Games.forEach((game) => {
    if (game.matchState == "post") {
      it(`Testing Post Match Page : ${game.Url}`, () => {
        cy.visit(game.Url);
        // Tier 1
        if (
          game.Url.includes("mls-regular-season") ||
          game.Url.includes("leagues-cup") ||
          game.Url.includes("campeones-cup") ||
          game.Url.includes("mls-all-star-game") ||
          game.Url.includes("mls-cup-playoffs-cup-short") ||
          game.Url.includes("u-s-open-cup")
        ){
          // Print current URL to cypress log
          cy.log(`TIER 1 : ${game.Url}`);
          cy.wait(3000);

          // Add cypress commands here for different checks
          // Summary tab
          // cy.carouselCheck();
          cy.rightHandScoreboardCheck();
          cy.matchStatsCheck();
          cy.matchFactsCheck();

          // Add STS data checks in here for summary tab
          if (game.MatchId) {
            cy.getPostMatchHeaderSTS(game.MatchId).then((headerInfo) => {
              cy.postMatchHeaderSTS(headerInfo);
            });

            cy.stsStatsDataFormat(game.MatchId).then((statsData) => {
              cy.stsMatchStatsCheck(statsData);
            });

            // Verify Vertical Scoreboard Match Information
            cy.verticalScoreboardDataCheck(
              "Feed-01.06-BaseData-Schedule",
              "MLS-SEA-0001K8",
              game.CompetitionId,
              game,
              MLSClubMapping
            );
          }

          // Checking FEED tab
          cy.get('a[href="feed"]').click();
          cy.commentaryListCheck();
          // Verify stamp-status check on FEED tab
          cy.postMatchStateFinalState();
          //FEED tab
          cy.validateMatchFeeds();
          cy.checkForNegativeScores();
          cy.HalfTimeReportingCheck();

          // Lineups tab
          cy.get('a[href="lineups"]').click();
          cy.verifyLineupsElementsExistAndVisible();

          // Click on Stats
          cy.get('a[href="stats"]').click();
          cy.wait(2000);

          // Verify if headers are available
          cy.get('div[class*="mls-o-stats-toggle__header"]')
            .should("exist")
            .should("be.visible");
          cy.get(`button[aria-label='Clubs']`).click();
          cy.liveMatchStatsCheck();
          cy.liveMatchShootingBreakdownStatsCheck();
          cy.liveMatchPassingBreakdownStatsCheck();
          cy.liveMatchExpectedGoalsStatsCheck();
          cy.liveMatchPossessionStatsCheck();
          cy.liveMatchPlayersStatsCheck();

          // Video tab
          // cy.get('a[href="video"]').click();
          // cy.postMatchVideoCheck();
        }
        // Tier 2
        if (
          game.Url.includes("canadian-championship") || 
          game.Url.includes("concacaf-champions-league")
        ) {
          // Print current URL to cypress log
          cy.log(`TIER 2 : ${game.Url}`);
          cy.wait(3000);

          // Add cypress commands here for different checks
          // Summary tab
          cy.carouselCheck();
          cy.rightHandScoreboardCheck();
          cy.matchStatsCheck();
          cy.matchFactsCheck();

          // Lineups tab
          cy.get('a[href="lineups"]').click();
          cy.verifyLineupsElementsExistAndVisible();
        }
        // Tier 3
        if (game.Url.includes("copa-america")) {
          // Print current URL to cypress log
          cy.log(`TIER 3 : ${game.Url}`);
          cy.wait(3000);

          cy.otherPostMatchHeader();

          // Add cypress commands here for different checks
          cy.rightHandScoreboardCheck();
          cy.matchStatsCheck();
          cy.matchFactsCheck();

          // Lineups tab
          cy.get('a[href="lineups"]').click();
          cy.verifyLineupsElementsExistAndVisible();
        }
      });
    }
  });
});
