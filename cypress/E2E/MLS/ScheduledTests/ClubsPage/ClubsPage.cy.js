import { expectedClubsFullNames } from "./../../../../support/compsTeamsClubs";

describe("Homepage Menu:", () => {
  beforeEach(() => {
    cy.visitWebAppHomePage();
    cy.wait(2000);
  });

  it("Testing Club Details", () => {
    cy.validateClubsDetails(expectedClubsFullNames);
  });
});
