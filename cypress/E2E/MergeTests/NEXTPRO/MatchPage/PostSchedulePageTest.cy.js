const webAppBaseURL = Cypress.env("baseURL");

describe("Individual Post Match Page", () => {
  beforeEach(() => {
    cy.visit(`https://www.mlsnextpro.com/schedule/`);
    cy.wait(3000);

    cy.get(".mls-c-schedule__matches").then((schedule) => {
      if (schedule.find('div[class*="mls-c-match-tile --post"]').length > 0) {
        cy.get('div[class*="mls-c-match-tile --post"]')
          .should("be.visible")
          .first()
          .parent("a")
          .click();
      } else {
        cy.get(`button[aria-label='Previous results']`).click();
        cy.wait(3000);
        cy.get('div[class*="mls-c-match-tile --post"]')
          .should("be.visible")
          .first()
          .parent("a")
          .click();
      }
    });
  });

  it("Post match merge tests check", () => {
    // Add cypress commands here for different checks
    cy.postMatchHeader();
    // Summary tab
    cy.carouselCheck();
    cy.rightHandScoreboardCheck();
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
    cy.get('a[href="video"]').click();
    cy.postMatchVideoCheck();
  });
});
