const baseURLCC = Cypress.env("baseURLCC");

describe("Watch Page Checks:", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit(baseURLCC);
    cy.acceptCookies();
  });

  it("Ensure that Video Plays and video scroll works", () => {
    cy.validateWatchPageEachVideo();
  });
});
