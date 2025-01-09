const webAppBaseURL = Cypress.env("baseURL");

describe("Playoffs page test MLS:", () => {
    beforeEach(() => {
        cy.visit(`${webAppBaseURL}/competitions/mls-cup-playoffs`);
    });
  
    it("Test Latest tab on Playoffs page", () => {
        cy.playoffsLatestCheck();
    });

    it("Testing news tab on MLS playoffs page", () => {
        cy.playoffsNewsCheck();
    })

    it("Testing Navbar on Playoffs page", () => {
        cy.playoffsNavbarCheck();
    })

    it("MLS CUP - Bracket check", () => {
        // P1
        cy.mlsBracketComponentCheck();
        // P4
        // cy.mlsBracketContentCheck();
      })
});
