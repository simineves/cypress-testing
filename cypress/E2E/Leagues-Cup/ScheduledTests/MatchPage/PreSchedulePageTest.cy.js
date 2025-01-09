const webAppBaseURL = Cypress.env("baseURL");
import URLS from "../../../../../LeaguesCup.json";

describe("Pre Match Page Tests", () => {
  cy.on("uncaught:exception", () => false);

  before(() => {
    // Clear cookies before accepting
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit(`https://www.leaguescup.com/schedule`);
    cy.acceptCookies();
  });

  URLS.preMatchURLs.forEach((URL) => {
    it(`Testing Pre Match Page : ${URL}`, () => {
      cy.visit(URL);
        // Print current URL to cypress log
        cy.log(`Leagues Cup : ${URL}`);
        cy.wait(3000);

        // Add cypress commands here for different checks
        // Preview tab
        cy.preMatchHeaderLC(URL);
        // cy.carouselCheck();
        cy.rightHandScoreboardCheck();
        cy.liveMatchStatsCheck();
        cy.matchFactsCheck();
    });
  });
});
