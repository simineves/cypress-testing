const webAppBaseURL = Cypress.env("baseURL");
const statsAPIToken = Cypress.env("statsAPIToken");
import {
  allClubsExpectedArr,
  allCompetitionsExpectedArr,
  nameMapping,
  optionalClubs,
  optionalCompetitions
} from "./../../../../support/compsTeamsClubs";

import MLS_URLS from "./../../../../../MLS_URLS.json";

describe("Schedule and Scores Page", () => {
  beforeEach(() => {
    
    // Clear cookies
    cy.clearCookies();
    cy.clearLocalStorage();

    cy.visit(`${webAppBaseURL}/schedule/scores`);

    // Accept cookies
    cy.acceptCookies();
  });

  it("Ensure All Clubs dropdown is working as expected", () => {
    const apiUrl_Clubs = `https://stats-api.mlsdigital.net/v1/clubs?token=${statsAPIToken}&competition_code=US_ML&season_id=936`;

    cy.request(apiUrl_Clubs).then((response) => {
      expect(response.status).to.eq(200);

      const clubNames = response.body.map((item) => {
        return nameMapping[item.name] || item.name;
      });

      const requiredClubs = clubNames.filter(
        (club) => !optionalClubs.includes(club)
      );
      const optionalClubsInResponse = clubNames.filter((club) =>
        optionalClubs.includes(club)
      );

      cy.validateClubsDropdown(requiredClubs, optionalClubsInResponse);
    });
  });

  it("Ensure All Competitions dropdown is working as expected", () => {
    const apiUrl_Competitions = `https://stats-api.mlsdigital.net/v1/competitions?token=${statsAPIToken}`;

    cy.request(apiUrl_Competitions).then((response) => {
      expect(response.status).to.eq(200);

      // Map the API response to the dropdown names
      const competitionsNames = response.body.map((item) => {
        return allCompetitionsExpectedArr[item.name] || item.name;
      });

      const requiredCompetitions = competitionsNames.filter(
        (competition) => !optionalCompetitions.includes(competition)
      );
      const optionalCompetitionsInResponse = competitionsNames.filter(
        (competition) => optionalCompetitions.includes(competition)
      );

      cy.validateCompetitionsDropdown(
        requiredCompetitions,
        optionalCompetitionsInResponse
      );
    });
  });

  it("Ensure Date Picker is working as expected", () => {
    cy.validateCalender();
  });

  // it("Check that Pre Match LC games are consistent with the MLS website", () => {
  //   cy.compareLCGames(LC_URLS, MLS_URLS);
  // });
});
