import { teamNames } from "./../../compsTeamsClubs";

Cypress.Commands.add(
  "assertContain",
  { prevSubject: "element" },
  ($el, expectedValue, message, clubName, pointName) => {
    let actualValue;
    if (message.includes("Name in API is")) {
      if (
        $el.text().includes("New England") ||
        $el.text().includes("LALA") ||
        $el.text().includes("San Jose")
      ) {
        actualValue = $el.text().slice(0, -2);
      } else if (
        $el.text().includes("RBNY") ||
        $el.text().includes("LAFCLAFC")
      ) {
        actualValue = $el.text().slice(0, -4);
      } else {
        actualValue = $el.text().slice(0, -3);
      }
    } else {
      if (
        message.includes("Home in API is") ||
        message.includes("Away in API is")
      ) {
        actualValue = $el.text().trim();
      } else {
        actualValue = Number($el.text().trim());
      }
    }
    try {
      expect(actualValue).to.be.equal(
        expectedValue,
        `${expectedValue} ${pointName} Value for ${clubName} club`
      );
    } catch (error) {
      throw new Error(
        `${message}'${expectedValue}', and GUI has'${actualValue}'`
      );
    }
  }
);

Cypress.Commands.add(
  "checkCell",
  (
    row,
    column,
    tableIndex,
    expectedValue,
    errorMessage,
    clubName,
    pointName
  ) => {
    cy.get(`table tr:nth-child(${row}) td:nth-child(${column})`)
      .eq(tableIndex)
      .assertContain(expectedValue, errorMessage, clubName, pointName);
  }
);

Cypress.Commands.add("checkTeam", (team, index, tableIndex) => {
  const abbreviation = team.club.abbreviation;
  const name = teamNames[abbreviation];
  if (name) {
    cy.checkCell(
      index + 1,
      2,
      tableIndex,
      name,
      `Error for ${name}. Name in API is`,
      name,
      ""
    );
    cy.checkCell(
      index + 1,
      3,
      tableIndex,
      team.statistics.total_points,
      `Error for ${name}. Points value in API is`,
      name,
      "Points"
    );
    cy.checkCell(
      index + 1,
      4,
      tableIndex,
      team.statistics.total_points_pg,
      `Error for ${name}. Total Points Per game value in API is`,
      name,
      "PPG"
    );
    cy.checkCell(
      index + 1,
      5,
      tableIndex,
      team.statistics.total_matches,
      `Error for ${name}. Games Played in API is`,
      name,
      "Games Played"
    );
    cy.checkCell(
      index + 1,
      6,
      tableIndex,
      team.statistics.total_wins,
      `Error for ${name}. Total wins in API is`,
      name,
      "Total wins"
    );
    cy.checkCell(
      index + 1,
      7,
      tableIndex,
      team.statistics.total_losses,
      `Error for ${name}. Total losses in API is`,
      name,
      "Total losses"
    );
    cy.checkCell(
      index + 1,
      8,
      tableIndex,
      team.statistics.total_draws,
      `Error for ${name}. Total draws in API is`,
      name,
      "Total draws"
    );
    cy.checkCell(
      index + 1,
      9,
      tableIndex,
      team.statistics.total_goals,
      `Error for ${name}. Goals in API is`,
      name,
      "Goals"
    );
    cy.checkCell(
      index + 1,
      10,
      tableIndex,
      team.statistics.total_goals_conceded,
      `Error for ${name}. Goals Consided in API is`,
      name,
      "Goals Consided"
    );
    cy.checkCell(
      index + 1,
      11,
      tableIndex,
      team.statistics.total_goal_differential,
      `Error for ${name}. Goals Difference in API is`,
      name,
      "Goals Difference"
    );
    cy.checkCell(
      index + 1,
      12,
      tableIndex,
      `${team.statistics.home_wins}-${team.statistics.home_losses}-${team.statistics.home_draws}`,
      `Error for ${name}. Home in API is`,
      name,
      "home_draws"
    );
    cy.checkCell(
      index + 1,
      13,
      tableIndex,
      `${team.statistics.away_wins}-${team.statistics.away_losses}-${team.statistics.away_draws}`,
      `Error for ${name}. Away in API is`,
      name,
      "away_draws"
    );
  }
});
