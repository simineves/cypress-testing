describe("Homepage Menu:", () => {
  beforeEach(() => {
    // Clear cookies before accepting
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit('https://www.leaguescup.com/');
    cy.acceptCookies();

  });

  it("Check that the game carousel is visible on home page and that it contains matches", () => {
    cy.gameCarouselCheck();
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

  it("Ensure the Standings link works on the homepage", () => {
    cy.validateHomePageLinkStandingsLC();
  });

  it("Ensure the Stats link works on the homepage", () => {
    cy.validateHomePageLinkStats();
  });

  it("Ensure the Clubs link works on the homepage", () => {
    cy.validateHomePageLinkClubs();
  });
});
