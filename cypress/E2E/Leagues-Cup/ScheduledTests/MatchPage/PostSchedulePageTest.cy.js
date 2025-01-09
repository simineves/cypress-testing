const webAppBaseURL = Cypress.env("baseURL");
import URLS from "../../../../../LeaguesCup.json";

describe("Post Match Page Tests", () => {
  cy.on("uncaught:exception", () => false);

  before(() => {
    // Clear cookies before accepting
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit(`https://www.leaguescup.com/schedule`);
    cy.acceptCookies();
  });

  const lastTenURLs = URLS.postMatchURLs.slice(-10);

  lastTenURLs.forEach((URL) => {
    it(`Testing Post Match Page : ${URL}`, () => {
      cy.visit(URL);
        // Print current URL to cypress log
        cy.log(`Leagues Cup : ${URL}`);
        cy.wait(3000);

        // Verify stamp-status check
        cy.postMatchStateFinalState();

        // Add cypress commands here for different checks
        // Summary tab
        // cy.carouselCheck();
        cy.rightHandScoreboardCheck();
        cy.commentaryListCheck();
        cy.matchStatsCheck();
        cy.matchFactsCheck();

        // Lineups tab
        cy.get('a[href="lineups"]').click();
        cy.verifyLineupsElementsExistAndVisible();
        // Video tab
        // cy.get('a[href="video"]').click();
        // cy.postMatchVideoCheck();
    });
  });
});
