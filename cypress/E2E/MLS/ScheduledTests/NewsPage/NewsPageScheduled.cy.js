describe("News Page Checks:", () => {
  beforeEach(() => {
    cy.visitWebAppHomePage();
  });

  it("Ensure that the news page has images for each article as required.", () => {
    cy.clickNews();
    cy.get(".d3-o-media-object__picture")
      .find("img")
      .should("have.attr", "src");
  });
});
