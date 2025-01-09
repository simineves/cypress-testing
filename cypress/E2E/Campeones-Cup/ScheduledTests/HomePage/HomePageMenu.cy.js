const baseURLCC = Cypress.env("baseURLCC");

describe("Homepage Menu:", () => {
  beforeEach(() => {
    // Clear cookies before accepting
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit(baseURLCC);
    cy.acceptCookies();

  });

  it("Ensure the Schedule link works on the homepage", () => {
    cy.validateHomePageLinkSchedule();
  });

  it("Ensure the News link works on the homepage", () => {
    cy.validateHomePageLinkNews();
  });

  it("Ensure the Watch link works on the homepage", () => {
    cy.validateHomePageLinkWatch();
  });

  it("Ensure the Watch link works on the homepage", () => {
    cy.validateHomePageLinkAbout();
  });

  it("Check that the Campeones Cup Game is showing on the home page", () => {
    cy.campeonesCupGameExists();
  });
});
