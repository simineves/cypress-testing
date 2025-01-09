const baseURLCC = Cypress.env("baseURLCC");

describe("Schedule and Scores Page", () => {
  beforeEach(() => {
    // Clear cookies before accepting
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit(`${baseURLCC}/schedule-tickets/`);
    cy.acceptCookies();
  });

  it("Ensure the Schedule link works on the homepage", () => {
    cy.campeonesCupGameExists();
  });
});
