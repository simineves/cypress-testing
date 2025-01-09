const baseURLCC = Cypress.env("baseURLCC");

describe("News Page Checks:", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit(baseURLCC);
    cy.acceptCookies();
  });

  it("Ensure that the news page loads and checks each article as required.", () => {
    cy.validateNewsPageEachArticle();
  });
});
