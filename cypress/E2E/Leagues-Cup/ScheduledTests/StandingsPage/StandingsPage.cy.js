describe("Homepage Menu:", () => {
    beforeEach(() => {
        // Clear cookies before accepting
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.visit('https://www.leaguescup.com/');
        cy.acceptCookies();
    });
  
    it("Standings for leagues cup", () => {
        cy.validateHomePageLinkStandingsLC();

        cy.get('span[class*="mls-c-sub-nav__item-text"').contains('Group Stage Standings').click();

        cy.get('tr[class*="mls-o-table__row mls-o-table__row"')

        cy.get('tr[class*="mls-o-table__row mls-o-table__row"')
            .should('be.visible')
            .should('have.length', 45);

        cy.get('.mls-o-table__cell')
            .should('exist')
            .and('not.be.null');
        
    });
});
  