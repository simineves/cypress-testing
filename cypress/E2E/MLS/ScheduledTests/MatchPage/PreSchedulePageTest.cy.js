const webAppBaseURL = Cypress.env("baseURL");
import Games from "../../../../../GameSchedule_Major League Soccer - Cup Playoffs.json";
import { MLSClubMapping } from "../../../../support/compsTeamsClubs";

describe("Pre Match Page Tests", () => {
  cy.on("uncaught:exception", () => false);

  before(() => {

    cy.visit(`${webAppBaseURL}/schedule/scores`);

    cy.getThreeSeasonTeams();
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
    if (game.matchState == "pre") {
      it(`Testing Pre Match Page : ${game.Url}`, () => {

        // Clear cookies
        cy.clearCookies();
        cy.clearLocalStorage();
        
        cy.visit(game.Url);
  
        // Accept cookies
        cy.wait(2000)
        cy.acceptCookies();

        cy.log(game.Url);
  
        // Tier 1
        if (
          game.Url.includes("mls-regular-season") ||
          game.Url.includes("leagues-cup") ||
          game.Url.includes("campeones-cup") ||
          game.Url.includes("mls-all-star-game") ||
          game.Url.includes("mls-cup-playoffs-cup-short") ||
          game.Url.includes("u-s-open-cup")
        ){
          // Print current URL to cypress log
          cy.log(`Tier 1 : ${game.Url}`);
  
          // Check for "mtlvs" in the URL
          const isCfMontrealHomeGame = game.Url.includes("mtlvs");
  
          const threeSeasonTeams = Cypress.env("threeSeasonTeams");
          // Current games 2 teams
          let currentTeams = getTeamsFromURL(game.Url);
  
          // Add cypress commands here for different checks
          // Preview tab
          cy.preMatchHeaderSTS(game);
          // cy.carouselCheck();

          cy.rightHandScoreboardCheck();
          // Verify Vertical Scoreboard Match Information

          // Add STS data checks in here for summary tab
          if (game.MatchId) {            
            // Verify Vertical Scoreboard Match Information
            cy.verticalScoreboardDataCheck("Feed-01.06-BaseData-Schedule", "MLS-SEA-0001K8", game.CompetitionId, game, MLSClubMapping);
          }
                    
          cy.liveMatchStatsCheck();
          cy.matchFactsCheck();
          if (!isCfMontrealHomeGame) {
            cy.ticketModelCheck();
            cy.buyTicketBtnCheck();
          }
        }
        // Tier 2
        if (
          game.Url.includes("canadian-championship") || 
          game.Url.includes("concacaf-champions-league")
        ) {
          // Print current URL to cypress log
          cy.log(`Tier 2 : ${game.Url}`);
          cy.wait(3000);
          cy.preMatchHeader();
          cy.rightHandScoreboardCheck();
          cy.matchDetail();
          cy.liveMatchStatsCheck();
          cy.matchFactsCheck();
        }
        // Tier 3
        if (game.Url.includes("copa-america")) {
          // Print current URL to cypress log
          cy.log(`Tier 3 : ${game.Url}`);
          cy.wait(3000);
          cy.otherPreMatchHeader();
          cy.rightHandScoreboardCheck();
          cy.liveMatchStatsCheck();
          cy.matchFactsCheck();
        }
      });
    }
  });
});
