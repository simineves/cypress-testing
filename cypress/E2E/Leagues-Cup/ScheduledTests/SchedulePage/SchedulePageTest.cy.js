import {
  allClubsExpectedArrLC,
} from "../../../../support/compsTeamsClubs";

describe("Schedule and Scores Page", () => {
  beforeEach(() => {
    // Clear cookies before accepting
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit(`https://www.leaguescup.com/schedule`);
    cy.acceptCookies();
  });

  it("Ensure All Clubs dropdown is working as expected", () => {
    cy.validateClubsDropdownLC(allClubsExpectedArrLC);
  });

  it("Ensure Date Picker is working as expected", () => {
    cy.validateCalender();
  });
});
