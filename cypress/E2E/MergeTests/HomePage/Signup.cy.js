describe("Signup Feature:", () => {
  beforeEach(() => {
    cy.visitWebAppHomePage();
  });

  it("Ensure user able to signup with valid email and password", () => {
    cy.signUp();
  });
});
