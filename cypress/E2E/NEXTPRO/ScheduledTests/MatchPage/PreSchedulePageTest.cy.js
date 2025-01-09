import URLS from "../../../../../NEXTPRO_URLS.json";
const statsAPIBaseURL = Cypress.env("statsAPIBaseURL");
const statsAPIToken = Cypress.env("statsAPIToken");
import Games from "../../../../../GameSchedule_MLS NEXT Pro - Playoffs.json";
import { nextProClubsMapping } from "../../../../support/compsTeamsClubs";


describe("Pre Match Page Tests", () => {
  cy.on("uncaught:exception", () => false);

  before(() => {
    // Clear cookies before running
    cy.clearCookies();
    cy.clearLocalStorage();

    cy.visit(`https://www.mlsnextpro.com/schedule`);

    // Accept cookies before running tests
    cy.acceptCookies();

    cy.log("preMatchURLs : " + URLS.preMatchURLs);
    cy.getThreeSeasonTeamsNP();
  });

  const getTeamsFromURL = (url) => {
    const regex = /\/matches\/([a-z]{2,4})vs([a-z]{2,4})-/i;
    const match = url.match(regex);

    if (match) {
      return [match[1], match[2]];
    } else {
      return null; // Or handle the case where the URL format doesn't match
    }
  };

  Games.forEach((game) => {
    if (game.matchState == 'pre') {
      it(`Testing Pre Match Page : ${game.Url}`, () => {
        cy.visit(game.Url);
        // Print current URL to cypress log
        cy.log(`CURRENT URL : ${game.Url}`);
        cy.wait(3000);

        const threeSeasonTeamsNP = Cypress.env("threeSeasonTeamsNP");
        // Current games 2 teams
        let currentTeams = getTeamsFromURL(game.Url);


        // Add cypress commands here for different checks
        // Preview tab
        cy.rightHandScoreboardCheck();
        // Verify Vertical Scoreboard Match Information
        cy.verticalScoreboardDataCheck("Feed-01.06-BaseData-Schedule", "MLS-SEA-0001K8", game.CompetitionId, game, nextProClubsMapping);

        if (currentTeams.every((team) => threeSeasonTeamsNP.includes(team))) {
          cy.log("Has participated in last three seasons");
          cy.matchDetail();
        }
        cy.matchFactsCheck();
        //cy.nextProPreMatchHeader();
      });
    }
  });
});
