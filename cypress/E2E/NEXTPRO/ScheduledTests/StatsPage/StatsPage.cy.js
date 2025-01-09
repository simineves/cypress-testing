describe("Stats Page", () => {
  beforeEach(() => {
    
    // Clear cookies before running
    cy.clearCookies();
    cy.clearLocalStorage();

    cy.visit(`https://www.mlsnextpro.com/stats/clubs/`);

    // Accept cookies before running tests
    cy.acceptCookies();
  });

  it("Club Name Check", () => {
    cy.nextproStatsTeamsCheck();
  });

  it("No null stats Check", () => {
    cy.wait(1000);
    cy.checkNonNullStats();
  });
});
