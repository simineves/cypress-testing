import { nextProClubs, clubs } from "./../../../support/compsTeamsClubs";

Cypress.Commands.add("clubStatsTeamsCheck", () => {
  cy.get('[data-react="mls-club-stats"]')
    .should("be.visible")
    .find(".mls-o-table__club-link")
    .each((clubLink) => {
      cy.wrap(clubLink)
        .invoke("attr", "title")
        .then(($title) => {
          if ($title) {
            expect(
              clubs.includes($title),
              `Title '${$title}' should be in club array`
            ).to.be.true;
          }
        });
    });
});

Cypress.Commands.add("nextproStatsTeamsCheck", () => {
  cy.get('[data-react="mls-club-stats"]')
    .should("be.visible")
    .find(".mls-o-table__club-link")
    .each((clubLink) => {
      cy.wrap(clubLink)
        .invoke("attr", "title")
        .then(($title) => {
          if ($title) {
            expect(
              nextProClubs.includes($title),
              `Title '${$title}' should be in club array`
            ).to.be.true;
          }
        });
    });
});

Cypress.Commands.add("checkNonNullStats", () => {
  cy.get('[data-react="mls-club-stats"]')
    .should("be.visible")
    .find('[class*="mls-o-table__cell"]')
    .each((stat) => {
      cy.wrap(stat)
        .invoke("text")
        .then((text) => {
          expect(text.trim(), "Stat text should not be null").to.not.equal("");
        });
    });
});
