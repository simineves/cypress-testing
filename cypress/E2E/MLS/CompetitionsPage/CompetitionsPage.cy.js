const webAppBaseURL = Cypress.env("baseURL");

describe("Competition Page:", () => {
  beforeEach(() => {

    // Clear cookies before visiting
    cy.clearCookies();
    cy.clearLocalStorage();

    cy.visit(`${webAppBaseURL}/competitions`);

    // Accept cookies
    cy.acceptCookies();

  });

  it("Competition Name Check", () => {
    cy.commpetitionsNameCheck();
  });
  it("Competition Links Check", () => {
    cy.commpetitionsLinkCheck();
  });

  it("Competition Nav/Dropdown Check", () => {
    cy.competitionNavLinkCheck();
  });
});
