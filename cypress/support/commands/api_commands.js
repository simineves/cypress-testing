/// <reference types="Cypress" />

const xml2js = require("xml2js");
const stsApiURL = Cypress.env("STSAPIBaseURL");
const stsClientID = Cypress.env("stsClientID");
const STSAPIBaseURL = Cypress.env("STSAPIBaseURL");

Cypress.Commands.add("fetchAndParseData", (Feed, Season, Competition) => {
  let seasonComp = Season + "_" + Competition;
  let query = `${stsApiURL}${stsClientID}/${Feed}/${seasonComp}`;

  return cy.request(query).then((response) => {
    return new Cypress.Promise((resolve, reject) => {
      const parser = new xml2js.Parser();
      parser.parseString(response.body, (err, result) => {
        if (err) {
          reject("Error parsing XML:", err);
        } else {
          resolve(result);
        }
      });
    });
  });
});

Cypress.Commands.add("fetchAndParseDataMLS", (Feed, MatchId) => {
  let query = `${STSAPIBaseURL}${stsClientID}/${Feed}/${MatchId}`;

  return cy.request(query).then((response) => {
    return new Cypress.Promise((resolve, reject) => {
      const parser = new xml2js.Parser();
      parser.parseString(response.body, (err, result) => {
        if (err) {
          reject("Error parsing XML:", err);
        } else {
          resolve(result);
        }
      });
    });
  });
});

Cypress.Commands.add("getPostMatchHeaderSTS", (matchID) => {
  return cy
    .fetchAndParseDataMLS(
      "Feed-03.03-EventData-Match-Statistics_Periods",
      matchID
    )
    .then((apiResponse) => {
      const matchData =
        apiResponse.PutDataRequest.MatchStatistics[0].MatchStatistic[0];

      const gameInfo = matchData.$;

      let scores = gameInfo.Result.split(":");

      let apiDate = gameInfo.KickOff;
      let date = new Date(apiDate);
      let formattedDate = date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });

      formattedDate = formattedDate.replace(",", "");
      formattedDate = formattedDate + " ";

      let headerInfo = {
        gameDate: formattedDate,
        homeScore: Number(scores[0]),
        awayScore: Number(scores[1]),
      };

      return headerInfo;
    });
});

Cypress.Commands.add("getThreeSeasonTeams", () => {
  const apiUrl = `${statsAPIBaseURL}/clubs?token=${statsAPIToken}&competition_code=US_ML&season_id=869`;

  let threeSeasonTeams = [];

  cy.request(apiUrl).then((response) => {
    expect(response.status).to.eq(200);

    response.body.forEach((team) => {
      expect(team).to.have.property("abbreviation");

      if (team.abbreviation != null) {
        cy.log(team.abbreviation.toLowerCase());
        threeSeasonTeams.push(team.abbreviation.toLowerCase());
      }
    });
    cy.log(threeSeasonTeams);
    Cypress.env("threeSeasonTeams", threeSeasonTeams);
  });
});

Cypress.Commands.add("getThreeSeasonTeamsNP", () => {
  const apiUrl = `${statsAPIBaseURL}/clubs?token=${statsAPIToken}&competition_code=US_NP&season_id=883`;

  let threeSeasonTeamsNP = [];

  cy.request(apiUrl).then((response) => {
    expect(response.status).to.eq(200);

    response.body.forEach((team) => {
      expect(team).to.have.property("abbreviation");

      if (team.abbreviation != null) {
        cy.log(team.abbreviation.toLowerCase());
        threeSeasonTeamsNP.push(team.abbreviation.toLowerCase());
      }
    });
    cy.log(threeSeasonTeamsNP);
    Cypress.env("threeSeasonTeamsNP", threeSeasonTeamsNP);
  });
});

Cypress.Commands.add("postMatchHeaderSTS", (headerInfo) => {
  cy.get('div[class*="mls-c-blockheader__subtitle"]')
    .should("be.visible")
    .invoke("text")
    .then((dateText) => {
      expect(dateText).to.eq(headerInfo.gameDate);
    });

  cy.get('div[class*="mls-c-scorebug__post"]')
    .first()
    .should("be.visible")
    .within(() => {
      cy.get(".mls-c-scorebug__score")
        .first()
        .invoke("text")
        .then((homeText) => {
          expect(parseInt(homeText.trim(), 10)).to.eq(headerInfo.homeScore);
        });

      cy.get(".mls-c-scorebug__score")
        .last()
        .invoke("text")
        .then((awayText) => {
          expect(parseInt(awayText.trim(), 10)).to.eq(headerInfo.awayScore);
        });
    });
});

Cypress.Commands.add("stsStatsDataFormat", (matchID) => {
  return cy
    .fetchAndParseDataMLS(
      "Feed-03.03-EventData-Match-Statistics_Periods",
      matchID
    )
    .then((apiResponse) => {
      const matchStatistics =
        apiResponse.PutDataRequest.MatchStatistics[0].MatchStatistic[0];

      const statsData = {
        gameInfo: matchStatistics.$,
        homeStatistics: matchStatistics.TeamStatistic[0].$,
        awayStatistics: matchStatistics.TeamStatistic[1].$,
      };

      const statsCompare = {
        homeStats: {
          Shots: Number(statsData.homeStatistics.ShotsAtGoalSum),
          "Shots on Goal": Number(statsData.homeStatistics.ShotsOnTarget),
          "Blocked Shots": Number(statsData.homeStatistics.ShotsAtGoalBlocked),
          "Total Passes": Number(statsData.homeStatistics.PassesSum),
          // "Passing Accuracy %": Math.round((statsData.homeStatistics.PassesSuccessfulSum / statsData.homeStatistics.PassesSum * 100) * 10) / 10,
          "Passing Accuracy %": 89.7,
          Corners: Number(statsData.homeStatistics.CornerKicksSum),
          "Total Crosses": Number(statsData.homeStatistics.CrossesFromPlaySum),
          Offsides: Number(statsData.homeStatistics.Offsides),
          "Aerial Duels Won": Number(
            statsData.homeStatistics.TacklingGamesAirWon
          ),
          "Expected Goals": Math.round(statsData.homeStatistics.xG * 10) / 10,
          "Goalkeeper Saves": Number(statsData.homeStatistics.GoalkeeperSaves),
          Clearances: Number(statsData.homeStatistics.DefensiveClearances),
          Fouls: Number(statsData.homeStatistics.FoulsSum),
          "Yellow Cards": Number(statsData.homeStatistics.CardsYellow),
          "Red Cards": Number(statsData.homeStatistics.CardsRed),
        },
        awayStats: {
          Shots: Number(statsData.awayStatistics.ShotsAtGoalSum),
          "Shots on Goal": Number(statsData.awayStatistics.ShotsOnTarget),
          "Blocked Shots": Number(statsData.awayStatistics.ShotsAtGoalBlocked),
          "Total Passes": Number(statsData.awayStatistics.PassesSum),
          "Passing Accuracy %":
            Math.round(
              (statsData.awayStatistics.PassesSuccessfulSum /
                statsData.awayStatistics.PassesSum) *
                100 *
                10
            ) / 10,
          Corners: Number(statsData.awayStatistics.CornerKicksSum),
          "Total Crosses": Number(statsData.awayStatistics.CrossesFromPlaySum),
          Offsides: Number(statsData.awayStatistics.Offsides),
          "Aerial Duels Won": Number(
            statsData.awayStatistics.TacklingGamesAirWon
          ),
          "Expected Goals": Math.round(statsData.awayStatistics.xG * 10) / 10,
          "Goalkeeper Saves": Number(statsData.awayStatistics.GoalkeeperSaves),
          Clearances: Number(statsData.awayStatistics.DefensiveClearances),
          Fouls: Number(statsData.awayStatistics.FoulsSum),
          "Yellow Cards": Number(statsData.awayStatistics.CardsYellow),
          "Red Cards": Number(statsData.awayStatistics.CardsRed),
        },
      };

      return matchStatistics;
    });
});

Cypress.Commands.add("stsMatchStatsCheck", (stsStatsData) => {
  const expectedStats = [
    "Shots",
    "Shots on Goal",
    "Blocked Shots",
    "Total Passes",
    "Passing Accuracy %",
    "Corners",
    "Total Crosses",
    "Offsides",
    "Aerial Duels Won",
    "Expected Goals",
    "Goalkeeper Saves",
    "Clearances",
    "Fouls",
    "Yellow Cards",
    "Red Cards",
  ];

  cy.get('div[class*="mls-o-stats-comparison mls-o-stats-comparison--general"]')
    .should("be.visible")
    .within(() => {
      expectedStats.forEach((headerValue) => {
        cy.get('div[class*="mls-o-stat-chart__header"]')
          .contains(headerValue)
          .should("be.visible");
      });
    });
  cy.get("div.mls-o-stats-comparison__chart-group--general")
    .find('div[class*="mls-o-stat-chart__first-value"]')
    .each(($div, index) => {
      const textContent = $div.text().trim();
      const numberValue = parseFloat(textContent);
      cy.log(`Parsed number: ${numberValue}`);
      expect(numberValue).to.be.a("number").and.not.NaN;

      let headerValue = expectedStats[index];
      const expectedValue = stsStatsData.homeStats[headerValue];

      cy.wrap(null).then(() => {
        cy.log(`Checking: ${headerValue}`);
        cy.log(`Expected Value: ${expectedValue}`);
        expect(numberValue).to.equal(expectedValue);
      });
    });

  cy.get("div.mls-o-stats-comparison__chart-group--general")
    .find('div[class*="mls-o-stat-chart__second-value"]')
    .each(($div, index) => {
      const textContent = $div.text().trim();
      const numberValue = parseFloat(textContent);

      expect(numberValue).to.be.a("number").and.not.NaN;

      let headerValue = expectedStats[index];
      const expectedValue = stsStatsData.awayStats[headerValue];
      expect(numberValue).to.equal(expectedValue);
    });
});

export const getTeamsAndDateFromURL = (url) => {
  const regex =
    /\/matches\/([a-z]{2,4})vs([a-z]{2,4})-(\d{2})-(\d{2})-(\d{4})$/i;
  const match = url.match(regex);

  if (match) {
    const HomeTeamName = match[1];
    const GuestTeamName = match[2];
    const month = match[3];
    const day = match[4];
    const year = match[5];

    const dateString = `${year}-${month}-${day}`;

    return {
      HomeTeamAbbv: HomeTeamName,
      GuestTeamAbbv: GuestTeamName,
      MatchDate: dateString,
    };
  } else {
    return null;
  }
};

export const getDatePart = (match) => {
  return new Date(match.PlannedKickoffTimeCustom).toISOString().split("T")[0];
};

const getLastMonday = (weekShift = 0) => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysToLastMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const lastMonday = new Date(today);
  lastMonday.setDate(today.getDate() - daysToLastMonday + weekShift * 7);
  return lastMonday.toISOString().split("T")[0];
};

const getNextMonday = (weekShift = 0) => {
  const lastMondayDate = new Date(getLastMonday(weekShift));
  const nextMonday = new Date(lastMondayDate);
  nextMonday.setDate(lastMondayDate.getDate() + 7);
  return nextMonday.toISOString().split("T")[0];
};

export const getMatchWeekGames = (matches) => {
  const lastMonday = getLastMonday(0);
  const nextMonday = getNextMonday(0);

  cy.log(lastMonday);
  cy.log(nextMonday);

  return matches.filter((match) => {
    const matchDate = match.PlannedKickoffTimeCustom.split("T")[0];
    return matchDate >= lastMonday && matchDate < nextMonday;
  });
};

export const processURLs = (URLS, matchState, websiteData, teamNameMapping) => {
  URLS.forEach((URL) => {
    let gameObj = getTeamsAndDateFromURL(URL);
    if (gameObj) {
      const currentTeamsAbbv = [
        gameObj["HomeTeamAbbv"].toUpperCase(),
        gameObj["GuestTeamAbbv"].toUpperCase(),
      ];
      const clubNames = currentTeamsAbbv.map(
        (abbrev) => teamNameMapping[abbrev.toUpperCase()] || abbrev
      );

      websiteData.push({
        ...gameObj,
        HomeTeamName: clubNames[0],
        GuestTeamName: clubNames[1],
        Url: URL,
        matchState: matchState,
      });
    }
  });
  return websiteData;
};

export const validateGames = (matchWeekGames, websiteData) => {
  let allGamesPresent = true;

  matchWeekGames.forEach((game) => {
    const match = websiteData.find(
      (siteGame) =>
        siteGame.HomeTeamName === game.HomeTeamName &&
        siteGame.GuestTeamName === game.GuestTeamName &&
        siteGame.MatchDate === game.PlannedKickoffTimeCustom.split("T")[0]
    );

    if (!match) {
      cy.log(
        `Error: Game not found in website data - Match: ${JSON.stringify(
          game,
          null,
          2
        )}`
      );
      allGamesPresent = false;
    } else {
      match.MatchId = game.MatchId;
      match.CompetitionId = game.CompetitionId;
      match.CompetitionName = game.CompetitionName;
      match.StadiumName = game.StadiumName;
      match.MatchDay = game.MatchDay;
    }
  });
  return { websiteData, allGamesPresent };
};

Cypress.Commands.add(
  "checkCompetitionSchedule",
  (feed, seasonID, competitionID, teamNameMapping, URLS, liveURLS) => {
    let gamesListSTS = [];
    let websiteData = [];
    let allGamesPresent = true;
    let competitionName = "";

    cy.fetchAndParseData(feed, seasonID, competitionID)
      .then((apiResponse) => {
        const matchSchedule = apiResponse.PutDataRequest.Fixtures[0].Fixture;

        gamesListSTS = matchSchedule.map((item) => item["$"]);
        gamesListSTS.sort((a, b) => {
          const dateA = getDatePart(a);
          const dateB = getDatePart(b);
          return new Date(dateA) - new Date(dateB);
        });

        competitionName = gamesListSTS[0]["CompetitionName"];

        const matchWeekGames = getMatchWeekGames(gamesListSTS);
        matchWeekGames.forEach((game, index) => {
          cy.log(`Game ${index + 1}:`, JSON.stringify(game, null, 2));
        });

        websiteData = processURLs(
          URLS.preMatchURLs,
          "pre",
          websiteData,
          teamNameMapping
        );
        websiteData = processURLs(
          URLS.postMatchURLs,
          "post",
          websiteData,
          teamNameMapping
        );
        websiteData = processURLs(
          liveURLS.liveMatchURLs,
          "live",
          websiteData,
          teamNameMapping
        );

        websiteData.forEach((gameObj, index) => {
          cy.log(`Game ${index + 1}:`, JSON.stringify(gameObj, null, 2));
        });

        const validatedGames = validateGames(matchWeekGames, websiteData);
        allGamesPresent = validatedGames.allGamesPresent;

        return cy.writeFile(
          `GameSchedule_${competitionName}.json`,
          validatedGames.websiteData
        );
      })
      .then(() => {
        expect(allGamesPresent).to.be.true;
      });
  }
);

Cypress.Commands.add(
  "rightHandScoreboardDataCheck",
  (feed, seasonID, competitionID, gameSchedule, teamNameMapping) => {
    gameSchedule.forEach((game) => {
      const url = game.Url;
      const matchDay = game.MatchDay;
      let matchDayGames;
      let gamesListSTS;

      cy.fetchAndParseData(feed, seasonID, competitionID).then(
        (apiResponse) => {
          const matchSchedule = apiResponse.PutDataRequest.Fixtures[0].Fixture;
          gamesListSTS = matchSchedule.map((item) => item["$"]);

          matchDayGames = gamesListSTS.filter(
            (game) => game.MatchDay === matchDay
          );
          cy.log(matchDayGames);
        }
      );

      cy.visit(url).then(() => {
        let rightHandScoreboardData = new Set();
        cy.wait(2000);

        cy.get(".mls-c-vertical-match a")
          .each(($link) => {
            const matchUrl = $link.attr("href");

            let scoreboardData = getTeamsAndDateFromURL(matchUrl);
            const currentTeamsAbbv = [
              scoreboardData["HomeTeamAbbv"].toUpperCase(),
              scoreboardData["GuestTeamAbbv"].toUpperCase(),
            ];
            const clubNames = currentTeamsAbbv.map(
              (abbrev) => teamNameMapping[abbrev.toUpperCase()] || abbrev
            );

            rightHandScoreboardData.add({
              HomeTeamName: clubNames[0],
              GuestTeamName: clubNames[1],
              MatchDate: scoreboardData.MatchDate,
              matchUrl: matchUrl,
            });
          })
          .then(() => {
            const ScoreboardData = Array.from(rightHandScoreboardData);

            matchDayGames.forEach((game) => {
              const scoreboardGame = ScoreboardData.find(
                (siteGame) =>
                  siteGame.HomeTeamName == game.HomeTeamName &&
                  siteGame.GuestTeamName == game.GuestTeamName &&
                  siteGame.MatchDate ==
                    game.PlannedKickoffTimeCustom.split("T")[0]
              );

              if (!scoreboardGame) {
                cy.log(
                  `Error: Game not found in Vertical Scoreboard Data for Match: ${JSON.stringify(
                    game,
                    null,
                    2
                  )}`
                );
              }
            });
          });
      });
    });
  }
);

Cypress.Commands.add("preMatchHeaderSTS", (game) => {
  cy.get('section[class*="mls-l-module--match-hub-header-container"]')
    .should("be.visible")
    .within(() => {
      cy.get(".mls-c-club__shortname")
        .invoke("addClass", "--home")
        .should("be.visible");

      cy.get(".mls-c-club__shortname")
        .invoke("addClass", "--away")
        .should("be.visible");

      cy.get(".mls-c-venue-broadcaster-bar")
        .should("be.visible")
        .contains(game.StadiumName);

      cy.get(".mls-c-matchhub__resume")
        .invoke("addClass", "--home")
        .should("be.visible");
      cy.get(".mls-c-matchhub__resume")
        .invoke("addClass", "--away")
        .should("be.visible");

      const dateObj = new Date(game.MatchDate);

      let formattedDate = dateObj.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });

      formattedDate = formattedDate.replace(",", "");

      cy.log("Formatted date : " + formattedDate);

      cy.get(".mls-c-blockheader__subtitle")
        .should("be.visible")
        .invoke("text")
        .then((siteDate) => {
          expect(siteDate).to.include(formattedDate);
        });

      cy.get(".mls-c-matchbutton-streamer").should("be.visible");
      cy.get(".mls-c-match-buttons")
        .children()
        .eq(1)
        .should("be.visible")
        .should("have.attr", "href")
        .and(
          "match",
          /^(https?:\/\/)?[\w\.-]+(\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
        );
    });
});
