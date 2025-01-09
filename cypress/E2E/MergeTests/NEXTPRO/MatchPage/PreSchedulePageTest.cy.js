const webAppBaseURL = Cypress.env("baseURL");

describe("Individual Pre Match Page", () => {
  cy.on("uncaught:exception", () => false);

  beforeEach(() => {
    cy.visit(`https://www.mlsnextpro.com/schedule/`);
    cy.wait(3000);

    cy.get(".mls-c-schedule__matches").then((schedule) => {
      if (schedule.find('div[class*="mls-c-match-tile --pre"]').length > 0) {
        cy.get('div[class*="mls-c-match-tile --pre"]')
          .should("be.visible")
          .first()
          .parent("a")
          .click();
      } else {
        cy.get(`button[aria-label='Next results']`).click();
        cy.wait(3000);
        cy.get('div[class*="mls-c-match-tile --pre"]')
          .should("be.visible")
          .first()
          .parent("a")
          .click();
      }
    });
  });

  it("Pre Match merge tests check", () => {
    // Preview tab
    cy.rightHandScoreboardCheck();
    // cy.matchDetail();
    cy.matchFactsCheck();
    //cy.nextProPreMatchHeader();
  });
});
