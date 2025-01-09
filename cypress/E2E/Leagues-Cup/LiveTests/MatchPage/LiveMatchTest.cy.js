const statsAPIToken = Cypress.env("statsAPIToken");
import URLS from "../../../../../LC_LIVE_URLS.json";

describe("Check Live LC Game Details", () => {
  cy.on("uncaught:exception", () => false);

  let apiResponseCount;
  // Initialize an empty array to store href links

  before(() => {
    // Call your API and get the JSON response
    cy.request(
      "GET",
      `https://stats-api.mlsdigital.net/v1/matches?token=${statsAPIToken}&competition_opta_id=1045&match_is_live=true`
    )
      .its("body")
      .then((response) => {
        // Assuming the API response is an array of objects
        apiResponseCount = response.length;
      });

    // Clear cookies before accepting
    cy.clearCookies();
    cy.clearLocalStorage(); 
    cy.visit(`https://www.leaguescup.com/schedule/`);
    cy.acceptCookies();
  });

  it("Check that schedule page has the correct amount of live games showing", () => {
    apiResponseCount == URLS.liveMatchURLs.length;
  });

  URLS.liveMatchURLs.forEach((URL) => {
    it(`Testing Live Game : ${URL}`, () => {
      cy.getCookies().should("not.be.empty");
      cy.clearCookies();
      cy.getCookies().should("be.empty");
      cy.visit(URL).get("body").should("exist");

      cy.wait(2000);

      // Verify Live Match Banner
      cy.validateLiveMatchBanner();

      // Verify stamp-status check
      cy.liveMatchStateHtState();

      // Verify carousel check
      cy.carouselCheck();
      cy.rightHandScoreboardCheck();

      // Verify Match Stats Check
      cy.liveMatchStatsCheck();

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
    });
  });
});
