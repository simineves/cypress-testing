const webAppBaseURL = Cypress.env("baseURL");

describe("Stats Page", () => {
  beforeEach(() => {

    // Clear cookies
    cy.clearCookies();
    cy.clearLocalStorage();
    
    cy.visit(`${webAppBaseURL}/stats/clubs`);
    
    // Accept cookies
    cy.acceptCookies();
  });

  it("Club Name Check", () => {
    cy.clubStatsTeamsCheck();
  });

  it("No null stats Check", () => {
    cy.wait(1000);
    cy.checkNonNullStats();
  });
});
