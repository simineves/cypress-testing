
describe("Playoffs page test MLS:", () => {
    beforeEach(() => {

        // Clear cookies before running
        cy.clearCookies();
        cy.clearLocalStorage();

        cy.visit(`https://www.mlsnextpro.com/`);
        cy.wait(2000)

        // Accept cookies before running tests
        cy.acceptCookies();

        
        cy.get(".mls-o-navigation__item-text")
        .contains('Playoffs')
        .click();
    });

    it("Testing news on NP playoffs page", () => {
        cy.playoffsNewsCheckNP();
    })

    it("Testing video on NP playoffs page", () => {
        cy.playoffsVideoCheckNP();
    })

    it("MNP CUP - Bracket check", () => {
        // P1
        cy.mnpBracketComponentCheck();
        // P4
        cy.mnpBracketContentCheck();
    })
});
