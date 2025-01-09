describe("Schedule and Scores Page", () => {
  beforeEach(() => {
    
    // Clear cookies before running
    cy.clearCookies();
    cy.clearLocalStorage();

    cy.visit(`https://www.mlsnextpro.com/schedule`);

    // Accept cookies before running tests
    cy.acceptCookies();
  });

  it("Ensure Date Picker is working as expected", () => {
    cy.validateCalender();
  });
});
