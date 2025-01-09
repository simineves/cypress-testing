const baseURLCC = Cypress.env("baseURLCC");

describe("Post Match Page Tests", () => {
  cy.on("uncaught:exception", () => false);

  let isPostGame = false;

  before(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit(`${baseURLCC}/schedule-tickets/`);
    cy.acceptCookies();

    // Check if the game is post match without failing if not found
    cy.get("body").then(($body) => {
      if ($body.find('div[class*="mls-c-match-tile --post"]').length > 0) {
        cy.get('div[class*="mls-c-match-tile --post"]').then(($el) => {
          if ($el.is(":visible")) {
            isPostGame = true;
            cy.wrap($el).click();
          }
        });
      } else {
        cy.log("No post game found.");
      }
    });
  });

  // Needs to have function instead of "()=>"" so we can use this.skip()
  it(`Testing Post Match Page CC`, function () {
    if (!isPostGame) {
      this.skip();
    }

    cy.wait(3000);

    // Verify stamp-status check
    // Summary tab
    // cy.carouselCheck();
    cy.rightHandScoreboardCheck();
    cy.matchStatsCheck();
    cy.matchFactsCheck();

    // Checking FEED tab
    cy.get('a[href="feed"]').click();
    cy.commentaryListCheck();
    // Verify stamp-status check on FEED tab
    cy.postMatchStateFinalState();
    //FEED tab
    cy.validateMatchFeeds();
    cy.checkForNegativeScores();

    // Lineups tab
    cy.get('a[href="lineups"]').click();
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
  });
});
