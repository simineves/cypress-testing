import { expectedClubsFullNames } from "./../../../support/compsTeamsClubs";

describe("Homepage Menu:", () => {
  beforeEach(() => {
    cy.visitWebAppHomePage();
  });

  it("Check that the game carousel is visible on home page and that it contains matches", () => {
    cy.gameCarouselCheck();
  });

  it("Testing Club Details", () => {
    cy.validateClubsDetails(expectedClubsFullNames);
  });

  it("Ensure the Schedule link works on the homepage", () => {
    cy.validateHomePageLinkSchedule();
  });

  it("Ensure the News link works on the homepage", () => {
    cy.validateHomePageLinkNews();
  });

  it("Ensure the Watch link works on the homepage", () => {
    cy.validateHomePageLinkWatch();
  });

  it("Ensure the Standings link works on the homepage", () => {
    cy.validateHomePageLinkStandings();
  });

  it("Ensure the Stats link works on the homepage", () => {
    cy.validateHomePageLinkStats();
  });

  it("Ensure the Clubs link works on the homepage", () => {
    cy.validateHomePageLinkClubs();
  });

  it("Ensure the Competitions link works on the homepage", () => {
    cy.validateHomePageLinkCompetitions();
  });

  it("Ensure the Rosters link works on the homepage", () => {
    cy.validateHomePageLinkRosters();
  });

  it("Ensure the Gaming link works on the homepage", () => {
    cy.validateHomePageLinkGaming();
  });

  it("Ensure that eMLS link works on the homepage", () => {
    cy.validateHomePageLinkEMLS();
  });

  it("Ensure that the MLSGO link works on the homepage", () => {
    cy.validateHomePageLinkMLSGO();
  });

  it("Ensure that the MLSNext link works on the homepage", () => {
    cy.validateHomePageLinkMLSNext();
  });

  it("Ensure that the MLSNextPro link works on the homepage", () => {
    cy.validateHomePageLinkMLSNextPro();
  });
});
