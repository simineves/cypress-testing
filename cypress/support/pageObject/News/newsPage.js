Cypress.Commands.add("clickNews", () => {
  cy.contains(`News`).click();
  cy.wait(2000);
  cy.get(`h1`)
    .should("be.visible")
    .then(($element) => {
      expect($element).to.exist;
    });
});
