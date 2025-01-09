const baseURLCC = Cypress.env("baseURLCC");

describe("Pre Match Page Tests", () => {
  cy.on("uncaught:exception", () => false);

  let isPreGame = false;

  before(() => {
    // Clear cookies before accepting
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit(`${baseURLCC}/schedule-tickets/`);
    cy.acceptCookies();

    // Check if the game is Pre match without failing if not found
    cy.get('body').then(($body) => {
      if ($body.find('div[class*="mls-c-match-tile --pre"]').length > 0) {
        cy.get('div[class*="mls-c-match-tile --pre"]').then(($el) => {
          if ($el.is(":visible")) {
            isPreGame = true;
            cy.wrap($el).click();
          }
        });
      } else {
        cy.log("No pre game found.");
      }
    });
  });

  it(`Testing Pre Match Page CC`, function () {
      cy.wait(3000);

      if (!isPreGame) {
        this.skip();
      }

      cy.preMatchHeaderCC();
      cy.matchDetail();
      // cy.carouselCheck();
      cy.rightHandScoreboardCheck();
      cy.liveMatchStatsCheckNP();
      cy.matchFactsCheck();
  });
});
