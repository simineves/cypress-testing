const webAppBaseURL = Cypress.env("baseURL");

describe("Individual Post Match Page", () => {
  beforeEach(() => {
    cy.visit(`${webAppBaseURL}/schedule/scores`);
    cy.wait(6000);

    cy.get(".mls-c-schedule__matches").then((schedule) => {
      if (schedule.find('div[class*="mls-c-match-tile --post"]').length > 0) {
        cy.get('div[class*="mls-c-match-tile --post"]')
          .should("be.visible")
          .first()
          .parent("a")
          .click();
      } else {
        cy.get(`button[aria-label='Previous results']`).click();
        // cy.selectRegularSeason();
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
      // cy.postMatchHeader();
      // Summary tab
      cy.carouselCheck();
      cy.rightHandScoreboardCheck();
      // cy.commentaryListCheck();
      cy.matchStatsCheck();
      // cy.buyTicketBtnCheck();
      cy.matchFactsCheck();

      // Lineups tab
      cy.get('a[href="lineups"]').click();
      cy.verifyLineupsElementsExistAndVisible();

      // Stats tab
      cy.get('a[href="stats"]').click();
      // cy.liveMatchStatsCheck();

      // Video tab
      // cy.get('a[href="video"]').click()
    });
  });
