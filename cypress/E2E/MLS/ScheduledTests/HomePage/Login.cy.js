describe("Login Feature:", () => {
  beforeEach(() => {
    cy.visitWebAppHomePage();
  });

  it.skip("Login with valid credentials", () => {
    cy.login();
  });

  it("Logout after successfully login", () => {
    cy.login();
    cy.logout();
  });
});
