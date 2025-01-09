const webAppBaseURL = Cypress.env("baseURL");
const statsAPIToken = Cypress.env("statsAPIToken");
import URLS from "../../../../../MLS_LIVE_URLS.json";
import Games from "../../../../../GameSchedule_Major League Soccer - Cup Playoffs.json";
import { MLSClubMapping } from "../../../../support/compsTeamsClubs";

describe("Check Live MLS Game Details", () => {
  cy.on("uncaught:exception", () => false);

  let isHalfTime = false;

  let apiResponseCount;
  // Initialize an empty array to store href links

  before(() => {
    // Call your API and get the JSON response
    cy.request(
      "GET",
      `https://stats-api.mlsdigital.net/v1/matches?token=${statsAPIToken}&competition_opta_id=98&match_is_live=true`
    )
      .its("body")
      .then((response) => {
        // Assuming the API response is an array of objects
        apiResponseCount = response.length;
      });
    cy.visit(`${webAppBaseURL}/schedule/scores`);
  });

  it("Check that schedule page has the correct amount of live games showing", () => {
    apiResponseCount == URLS.liveMatchURLs.length;
  });

  Games.forEach((game) => {
    if (game.matchState == "live") {
      it(`Testing Live Game : ${game.Url}`, () => {
        cy.getCookies().should("not.be.empty");
        cy.clearCookies();
        cy.getCookies().should("be.empty");
        cy.visit(game.Url).get("body").should("exist");

        cy.acceptCookies();

        // Tier 1
        if (
          game.Url.includes("mls-regular-season") ||
          game.Url.includes("leagues-cup") ||
          game.Url.includes("campeones-cup") ||
          game.Url.includes("mls-all-star-game") ||
          game.Url.includes("mls-cup-playoffs-cup-short") ||
          game.Url.includes("u-s-open-cup")
        ){
          cy.log(`TIER 1 : ${game.Url}`);
          cy.wait(3000);

          // Verify Live Match Banner
          cy.validateLiveMatchBanner();
          cy.checkForHalfTime(isHalfTime);
          cy.wait(3000);

          if (isHalfTime == true && game.MatchId != null) {
            // Add half time specific checks
            cy.log("Game is in half time");
            cy.stsStatsDataFormat(game.MatchId).then((statsData) => {
              cy.stsMatchStatsCheck(statsData);
            });
          }

          // Verify Match Stats Check
          cy.liveMatchStatsCheck();

          // Verify VerticalScoreboard Match Data
          cy.verticalScoreboardDataCheck(
            "Feed-01.06-BaseData-Schedule",
            "MLS-SEA-0001K8",
            game.CompetitionId,
            game,
            MLSClubMapping
          );

          // STS stats check
          // cy.stsStatsDataFormat('MLS-MAT-0005QW').then((statsData) => {
          //   cy.writeFile('cypress/matchStatistics.json', statsData);
          //   cy.stsMatchStatsCheck(statsData);
          // });

          cy.get('a[href="feed"]').click();
          cy.commentaryListCheck();
          cy.checkForNegativeScores();

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
          cy.liveMatchStatsCheck();
          cy.liveMatchShootingBreakdownStatsCheck();
          cy.liveMatchPassingBreakdownStatsCheck();
          cy.liveMatchExpectedGoalsStatsCheck();
          cy.liveMatchPossessionStatsCheck();
          cy.liveMatchPlayersStatsCheck();
          cy.wait(3000);

          cy.get('span[class*="mls-c-sub-nav__item-text"')
            .contains("Summary")
            .click();
          cy.wait(2000);
          cy.rightHandScoreboardCheck();
          cy.liveMatchFactsCheck();
          cy.liveMatchHeaderSTS(game);
        }

        // Tier 2
        if (
          game.Url.includes("canadian-championship") || 
          game.Url.includes("concacaf-champions-league")
        ) {
          cy.log(`TIER 2 : ${game.Url}`);
          cy.wait(3000);

          cy.liveMatchStatsCheck();
          cy.liveMatchFactsCheck();
          cy.rightHandScoreboardCheck();

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
        }

        // Tier 3
        if (game.Url.includes("copa-america")) {
          cy.log(`TIER 3 : ${game.Url}`);
          cy.wait(3000);

          cy.liveMatchStatsCheck();
          cy.liveMatchFactsCheck();
          cy.rightHandScoreboardCheck();

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
        }
      });
    }
  });
});
