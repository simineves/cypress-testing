describe("News Page Checks:", () => {
  beforeEach(() => {
    // Clear cookies before accepting
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit('https://www.leaguescup.com/');
    cy.acceptCookies();
  });

  it("Ensure that the news page has images for each article as required.", () => {
    cy.clickNews();
    cy.get(".d3-o-media-object__picture")
      .find("img")
      .should("have.attr", "src");
  });
});
