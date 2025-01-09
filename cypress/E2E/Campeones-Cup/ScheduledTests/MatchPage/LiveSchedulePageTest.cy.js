const baseURLCC = Cypress.env("baseURLCC");

describe("Live Match Page Tests", () => {
  cy.on("uncaught:exception", () => false);

  let isLiveGame = false;

  before(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit(`${baseURLCC}/schedule-tickets/`);
    cy.acceptCookies();

    cy.wait(3000);
    // Check if the game is post match without failing if not found
    cy.get("body").then(($body) => {
      if ($body.find('div[class*="mls-c-match-tile --live"]').length > 0) {
        cy.get('div[class*="mls-c-match-tile --live"]').then(($el) => {
          if ($el.is(":visible")) {
            isLiveGame = true;
            cy.wrap($el).click();
          }
        });
      } else {
        cy.log("No live game found.");
      }
    });
  });

  // Needs to have function instead of "()=>"" so we can use this.skip()
  it(`Testing Live Match Page CC`, function () {
    if (!isLiveGame) {
      this.skip();
    }
    cy.wait(3000);

    // Verify Live Match Banner
    cy.validateLiveMatchBanner();

    // // Verify Match Stats Check
    cy.liveMatchStatsCheck();
    // // STS stats check
    // cy.stsStatsDataFormat('MLS-MAT-0005QW').then((statsData) => {
    //   cy.writeFile('cypress/matchStatistics.json', statsData);
    //   cy.stsMatchStatsCheck(statsData)
    // });

    cy.get('a[href="feed"]').click();
    cy.commentaryListCheck();
    cy.checkForNegativeScores();

    // Click on Lineups
    cy.get('a[href="lineups"]').click();
    cy.wait(2000);

    // Verify if lineups headers are available
    cy.get('div[class*="mls-c-lineups__header"]')
      .should("exist")
      .should("be.visible");

    // Verify Match Starting Lineups
    cy.get(`button[aria-label='Starting']`).click();
    cy.verifyLineupsElementsExistAndVisible();

    // Verify Match Current Lineups
    cy.get(`button[aria-label='Current']`).click();
    cy.verifyLineupsElementsExistAndVisible();

    // Click on Stats
    cy.get('a[href="stats"]').click();
    cy.wait(2000);

    // Verify if headers are available
    cy.get('div[class*="mls-o-stats-toggle__header"]')
      .should("exist")
      .should("be.visible");
    cy.get(`button[aria-label='Clubs']`).click();
    cy.liveMatchStatsCheck();
    cy.liveMatchShootingBreakdownStatsCheck();
    cy.liveMatchPassingBreakdownStatsCheck();
    cy.liveMatchExpectedGoalsStatsCheck();
    cy.liveMatchPossessionStatsCheck();
    cy.liveMatchPlayersStatsCheck();
    cy.wait(3000);

    cy.get('span[class*="mls-c-sub-nav__item-text"')
      .contains("Summary")
      .click();
    cy.wait(2000);
    cy.rightHandScoreboardCheck();
    cy.liveMatchFactsCheck();

    // Verify stamp-status check
    // Look into in more detail *************
    // cy.liveMatchStateHtState();
  });
});
