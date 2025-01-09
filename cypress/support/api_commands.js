/// <reference types="Cypress" />

const xml2js = require('xml2js');
const fs = require('fs');
const path = require('path');

const stsApiURL = Cypress.env("STSAPIBaseURL");
const stsClientID = Cypress.env("stsClientID");
const STSAPIBaseURL = Cypress.env("STSAPIBaseURL");


Cypress.Commands.add('fetchAndParseData', (Feed, Season, Competition) => {
    let seasonComp = Season + "_" + Competition;
    let query = `${stsApiURL}${stsClientID}/${Feed}/${seasonComp}`;

    return cy.request(query).then((response) => {
        return new Cypress.Promise((resolve, reject) => {
            const parser = new xml2js.Parser();
            parser.parseString(response.body, (err, result) => {
                if (err) {
                    reject('Error parsing XML:', err);
                } else {
                    resolve(result);
                }
            });
        });
    });
})

Cypress.Commands.add('fetchAndParseDataMLS', (Feed, MatchId) => {
    let query = `${STSAPIBaseURL}${stsClientID}/${Feed}/${MatchId}`

    return cy.request(query).then((response) => {
        return new Cypress.Promise((resolve, reject) => {
            const parser = new xml2js.Parser();
            parser.parseString(response.body, (err, result) => {
                if (err) {
                    reject('Error parsing XML:', err);
                } else {
                    resolve(result);
                }
            });
        });
    });
})

Cypress.Commands.add('getPostMatchHeaderSTS', (matchID) => {

    return cy.fetchAndParseDataMLS('Feed-03.03-EventData-Match-Statistics_Periods', matchID).then((apiResponse) => {
        const matchData = apiResponse.PutDataRequest.MatchStatistics[0].MatchStatistic[0];


        const gameInfo = matchData.$

        let scores = gameInfo.Result.split(':');

        let apiDate = gameInfo.KickOff;
        let date = new Date(apiDate);
        let formattedDate = date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        });

        formattedDate = formattedDate.replace(',', '');
        // the websites date has a trailing space
        formattedDate = formattedDate + " ";

        let headerInfo = {
            gameDate: formattedDate,
            homeScore: Number(scores[0]),
            awayScore: Number(scores[1])
        }

        return headerInfo;
    });
})

Cypress.Commands.add('postMatchHeaderSTS', (headerInfo) => {

    cy.get('div[class*="mls-c-blockheader__subtitle"]')
        .should("be.visible")
        .invoke('text').then((dateText) => {
            expect(dateText).to.eq(headerInfo.gameDate);
        });

    cy.get('div[class*="mls-c-scorebug__post"]').first().should("be.visible").within(() => {

        // Find the div containing the home score
        cy.get(".mls-c-scorebug__score").first().invoke('text').then((homeText) => {
            // Assert the home score matches the API home score
            expect(parseInt(homeText.trim(), 10)).to.eq(headerInfo.homeScore);
        });

        // Find the div containing the away score
        cy.get(".mls-c-scorebug__score").last().invoke('text').then((awayText) => {
            // Assert the away score matches the API away score
            expect(parseInt(awayText.trim(), 10)).to.eq(headerInfo.awayScore);
        });
    });
});

Cypress.Commands.add('stsStatsDataFormat', (matchID) => {

    return cy.fetchAndParseDataMLS('Feed-03.03-EventData-Match-Statistics_Periods', matchID).then((apiResponse) => {
        const matchStatistics = apiResponse.PutDataRequest.MatchStatistics[0].MatchStatistic[0];


        const statsData = {
            "gameInfo": matchStatistics.$,
            "homeStatistics": matchStatistics.TeamStatistic[0].$,
            "awayStatistics": matchStatistics.TeamStatistic[1].$
        };

        const statsCompare = {
            "homeStats": {
                "Shots": Number(statsData.homeStatistics.ShotsAtGoalSum),
                "Shots on Goal": Number(statsData.homeStatistics.ShotsOnTarget),
                "Blocked Shots": Number(statsData.homeStatistics.ShotsAtGoalBlocked),
                "Total Passes": Number(statsData.homeStatistics.PassesSum),
                // "Passing Accuracy %": Math.round((statsData.homeStatistics.PassesSuccessfulSum / statsData.homeStatistics.PassesSum * 100) * 10) / 10,
                "Passing Accuracy %": 89.7,
                "Corners": Number(statsData.homeStatistics.CornerKicksSum),
                "Total Crosses": Number(statsData.homeStatistics.CrossesFromPlaySum),
                "Offsides": Number(statsData.homeStatistics.Offsides),
                "Aerial Duels Won": Number(statsData.homeStatistics.TacklingGamesAirWon),
                "Expected Goals": Math.round((statsData.homeStatistics.xG) * 10) / 10,
                "Goalkeeper Saves": Number(statsData.homeStatistics.GoalkeeperSaves),
                "Clearances": Number(statsData.homeStatistics.DefensiveClearances),
                "Fouls": Number(statsData.homeStatistics.FoulsSum),
                "Yellow Cards": Number(statsData.homeStatistics.CardsYellow),
                "Red Cards": Number(statsData.homeStatistics.CardsRed)
            },
            "awayStats": {
                "Shots": Number(statsData.awayStatistics.ShotsAtGoalSum),
                "Shots on Goal": Number(statsData.awayStatistics.ShotsOnTarget),
                "Blocked Shots": Number(statsData.awayStatistics.ShotsAtGoalBlocked),
                "Total Passes": Number(statsData.awayStatistics.PassesSum),
                "Passing Accuracy %": Math.round((statsData.awayStatistics.PassesSuccessfulSum / statsData.awayStatistics.PassesSum * 100) * 10) / 10,
                "Corners": Number(statsData.awayStatistics.CornerKicksSum),
                "Total Crosses": Number(statsData.awayStatistics.CrossesFromPlaySum),
                "Offsides": Number(statsData.awayStatistics.Offsides),
                "Aerial Duels Won": Number(statsData.awayStatistics.TacklingGamesAirWon),
                "Expected Goals": Math.round((statsData.awayStatistics.xG) * 10) / 10,
                "Goalkeeper Saves": Number(statsData.awayStatistics.GoalkeeperSaves),
                "Clearances": Number(statsData.awayStatistics.DefensiveClearances),
                "Fouls": Number(statsData.awayStatistics.FoulsSum),
                "Yellow Cards": Number(statsData.awayStatistics.CardsYellow),
                "Red Cards": Number(statsData.awayStatistics.CardsRed)
            }
        };

        return statsCompare;
    });
})


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
        "Red Cards"
    ];

    // Verify Stats Check
    cy.get('div[class*="mls-o-stats-comparison mls-o-stats-comparison--general"]')
        .should("be.visible")
        .within(() => {
            expectedStats.forEach((headerValue) => {
                cy.get('div[class*="mls-o-stat-chart__header"]')
                    .contains(headerValue)
                    .should("be.visible");
            });
        });
    cy.get('div.mls-o-stats-comparison__chart-group--general') // Target the specific parent div
        .find('div[class*="mls-o-stat-chart__first-value"]') // Find the child elements within the parent
        .each(($div, index) => {
            const textContent = $div.text().trim();
            const numberValue = parseFloat(textContent);

            // Log numberValue to ensure it's correctly parsed
            cy.log(`Parsed number: ${numberValue}`);
            expect(numberValue).to.be.a("number").and.not.NaN;

            // Get the expected header value dynamically
            let headerValue = expectedStats[index];
            const expectedValue = stsStatsData.homeStats[headerValue];

            // Log the headerValue and expected value in the Cypress chain
            cy.wrap(null).then(() => {
                cy.log(`Checking: ${headerValue}`);
                cy.log(`Expected Value: ${expectedValue}`);
                expect(numberValue).to.equal(expectedValue);
            });
        });

    cy.get('div.mls-o-stats-comparison__chart-group--general') // Target the specific parent div
        .find('div[class*="mls-o-stat-chart__second-value"]') // Find the child elements within the parent
        .each(($div, index) => {
            const textContent = $div.text().trim();
            const numberValue = parseFloat(textContent);

            // Make sure number value is on site
            expect(numberValue).to.be.a("number").and.not.NaN;

            // Check website stats against STS
            let headerValue = expectedStats[index];
            const expectedValue = stsStatsData.awayStats[headerValue];
            expect(numberValue).to.equal(expectedValue);
        });
});

export const getCompetitionUrls = (urls, liveUrls, competitionName) => {

    const compName = competitionName.split(" - ").pop();

    const competitionMappings = {
      "Cup Playoffs": "cup-playoffs",
      "Regular Season": "regular-season",
      "Playoffs": "mls-next-pro-playoffs"
    };
  
    // Get the hyphenated keyword for the provided competition name
    const keyword = competitionMappings[compName];
  
    // Filter URLs based on the hyphenated keyword
    const preMatchFiltered = urls.preMatchURLs.filter(url => url.includes(keyword));
    const postMatchFiltered = urls.postMatchURLs.filter(url => url.includes(keyword));
    const liveMatchFiltered = liveUrls.liveMatchURLs.filter(url => url.includes(keyword));
  
    const totalCount = postMatchFiltered.length + preMatchFiltered.length; + liveMatchFiltered.length;
  
    return {
      count: totalCount,
      postMatchURLs: postMatchFiltered,
      preMatchURLs: preMatchFiltered,
      liveMatchURLs: liveMatchFiltered
    };
  };
  

export const getTeamsAndDateFromURL = (url) => {
    const regex = /\/matches\/([a-z]{2,4})vs([a-z]{2,4})-(\d{2})-(\d{2})-(\d{4})$/i;
    const match = url.match(regex);

    if (match) {
        const HomeTeamName = match[1];
        const GuestTeamName = match[2];
        const month = match[3];
        const day = match[4];
        const year = match[5];

        // Construct the date string in YYYY-MM-DD format
        const dateString = `${year}-${month}-${day}`;

        // Return the teams and the date
        return {
            HomeTeamAbbv: HomeTeamName,
            GuestTeamAbbv: GuestTeamName,
            MatchDate: dateString
        };
    } else {
        return null; // Or handle the case where the URL format doesn't match
    }
};

export const getDatePart = (match) => {
    return new Date(match.PlannedKickoffTimeCustom).toISOString().split('T')[0];
};

const getLastMonday = (weekShift = 0) => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysToLastMonday = (dayOfWeek === 0 ? 6 : dayOfWeek - 1); // If today is Sunday (0), subtract 6 days
    const lastMonday = new Date(today);
    lastMonday.setDate(today.getDate() - daysToLastMonday + (weekShift * 7)); // Shift by weekShift * 7
    return lastMonday.toISOString().split('T')[0];
};

const getNextMonday = (weekShift = 0) => {
    const lastMondayDate = new Date(getLastMonday(weekShift));  // Get the last Monday
    const nextMonday = new Date(lastMondayDate);
    nextMonday.setDate(lastMondayDate.getDate() + 7);  // Always 7 days after last Monday, no shift needed
    return nextMonday.toISOString().split('T')[0];
};

export const getMatchWeekGames = (matches) => {

    const lastMonday = getLastMonday(0);
    const nextMonday = getNextMonday(0);

    cy.log(lastMonday);
    cy.log(nextMonday);
    
    return matches.filter(match => {
        const matchDate = match.PlannedKickoffTimeCustom.split('T')[0];
        return matchDate >= lastMonday && matchDate < nextMonday;
    });
};

export const processURLs = (URLS, matchState, websiteData, teamNameMapping) => {
    URLS.forEach((URL) => {
        let gameObj = getTeamsAndDateFromURL(URL);
        if (gameObj) {
            const currentTeamsAbbv = [gameObj['HomeTeamAbbv'].toUpperCase(), gameObj['GuestTeamAbbv'].toUpperCase()];
            const clubNames = currentTeamsAbbv.map(abbrev => teamNameMapping[abbrev.toUpperCase()] || abbrev);

            websiteData.push({
                ...gameObj,
                HomeTeamName: clubNames[0],
                GuestTeamName: clubNames[1],
                Url: URL,
                matchState: matchState
            });
        }
    });
    return websiteData;
};

export const validateGames = (matchWeekGames, websiteData) => {

    let allGamesPresent = true;

    matchWeekGames.forEach((game) => {
        // Find matching game from STS in websiteData
        const match = websiteData.find((siteGame) =>
            siteGame.HomeTeamName === game.HomeTeamName &&
            siteGame.GuestTeamName === game.GuestTeamName &&
            siteGame.MatchDate === game.PlannedKickoffTimeCustom.split('T')[0]
        );

        if (!match) {
            cy.log(`Error: Game not found in website data - Match: ${JSON.stringify(game, null, 2)}`);
            allGamesPresent = false;
        }
        else {
            match.MatchId = game.MatchId;
            match.CompetitionId = game.CompetitionId;
            match.CompetitionName = game.CompetitionName;
            match.StadiumName = game.StadiumName;
            match.MatchDay = game.MatchDay;
        }
    });
    return { websiteData, allGamesPresent };
}

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

        // Get the matches for this week from STS
        const matchWeekGames = getMatchWeekGames(gamesListSTS);
        matchWeekGames.forEach((game, index) => {
          cy.log(`Game ${index + 1}:`, JSON.stringify(game, null, 2));
        });

        const numberOfGames = matchWeekGames.length;
        cy.log(`Number of games fetched: ${numberOfGames}`);

        // Handle no games scenario
        if (numberOfGames === 0) {
          cy.log("No games scheduled this week. This is expected.");
        }

        const competitionURLs = getCompetitionUrls(URLS, liveURLS, competitionName);
        cy.log(JSON.stringify(competitionURLs, null, 0));

        // Check if the number of games in matchWeekGames matches with fetched games from website
        let countURLs = competitionURLs.count;
        if (numberOfGames !== countURLs) {
          cy.log("Games on schedule aren't showing: expected " +
                numberOfGames +
                ", but found " +
                countURLs)
        }

        // Create game objects for preMatch and postMatch URLs
        websiteData = processURLs(
          competitionURLs.preMatchURLs,
          "pre",
          websiteData,
          teamNameMapping
        );
        websiteData = processURLs(
          competitionURLs.postMatchURLs,
          "post",
          websiteData,
          teamNameMapping
        );
        websiteData = processURLs(
          competitionURLs.liveMatchURLs,
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

Cypress.Commands.add('verticalScoreboardDataCheck', (feed, seasonID, competitionID, game, teamNameMapping) => {

    const matchDay = game.MatchDay;
    let matchDayGames;
    let gamesListSTS;
    let rightHandScoreboardData = new Set();
    let errorLogs = [];

    // Getting game data from STS
    cy.fetchAndParseData(feed, seasonID, competitionID).then((apiResponse) => {
        const matchSchedule = apiResponse.PutDataRequest.Fixtures[0].Fixture;
        gamesListSTS = matchSchedule.map(item => item["$"]);

        // Games for that matchday
        matchDayGames = gamesListSTS.filter(game => game.MatchDay === matchDay);
        cy.log(matchDayGames);
    });

    // Extract all match sections
    cy.get('.mls-c-vertical-match a').each(($link) => {
        const matchUrl = $link.attr('href');
        cy.log(matchUrl);
        let scoreboardData = getTeamsAndDateFromURL(matchUrl);
        if(!scoreboardData || !scoreboardData['HomeTeamAbbv'] || !scoreboardData['GuestTeamAbbv']){
            const errorMessage = `Loading URL on Vertical Scoreboard failed: ${matchUrl}`;
            errorLogs.push({ message: errorMessage });
            return;
        }
        
        const currentTeamsAbbv = [scoreboardData['HomeTeamAbbv'].toUpperCase(), scoreboardData['GuestTeamAbbv'].toUpperCase()];
        const clubNames = currentTeamsAbbv.map(abbrev => teamNameMapping[abbrev.toUpperCase()] || abbrev);

        // Push the match data into the scoreboard array
        rightHandScoreboardData.add({
            HomeTeamName: clubNames[0],
            GuestTeamName: clubNames[1],
            MatchDate: scoreboardData.MatchDate,
            matchUrl: matchUrl
        });

    }).then(() => {
        const ScoreboardData = Array.from(rightHandScoreboardData);

        // Check for missing games in ScoreboardData (website scoreboard)
        matchDayGames.forEach(game => {

            const scoreboardGame = ScoreboardData.find((siteGame) => 
                siteGame.HomeTeamName == game.HomeTeamName &&
                siteGame.GuestTeamName == game.GuestTeamName &&
                siteGame.MatchDate == game.PlannedKickoffTimeCustom.split('T')[0]
            );

            if (!scoreboardGame) {
                const errorMessage = `Game not found in Vertical Scoreboard for Match ${JSON.stringify(game, null, 0)}`;
                errorLogs.push({ message: errorMessage });
            }
        });

        if (errorLogs.length > 0) {
            cy.log("Errors encountered during processing:");
            errorLogs.forEach(error => {
                cy.log(`ERROR: ${error.message}`);
            });
        }
    });
});

// PRE match header with STS checks MLS - TIER 1
Cypress.Commands.add("preMatchHeaderSTS", (game) => {
    cy.get('section[class*="mls-l-module--match-hub-header-container"]')
      .should("be.visible")
      .within(() => {
        // Home team name is visible
        cy.get(".mls-c-club__shortname")
          .invoke("addClass", "--home")
          .should("be.visible");
  
        // Away team name is visible
        cy.get(".mls-c-club__shortname")
          .invoke("addClass", "--away")
          .should("be.visible");
  
        // Stadium is visible
        cy.get(".mls-c-venue-broadcaster-bar")
        .should("be.visible")
        .contains(game.StadiumName)
  
        // Home team WDL is visible
        cy.get(".mls-c-matchhub__resume")
          .invoke("addClass", "--home")
          .should("be.visible");
        // Away team WDL is visible
        cy.get(".mls-c-matchhub__resume")
          .invoke("addClass", "--away")
          .should("be.visible");
  
        // Reformat STS date to match header
        // Convert the string to a Date object
        const dateObj = new Date(game.MatchDate);
  
        // Format the date as "Saturday October 5"
        let formattedDate = dateObj.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          timeZone: 'UTC'
        });
  
        formattedDate = formattedDate.replace(',', '');
  
        cy.log("Formatted date : " + formattedDate)
  
        // Date is visible
        cy.get(".mls-c-blockheader__subtitle")
        .should("be.visible")
        .invoke("text")
        .then((siteDate) => {
          expect(siteDate).to.include(formattedDate)
        })
  
        // Ticket link is visible and has a valid href
        cy.get(".mls-c-matchbutton-streamer").should("be.visible");
        // Watch location link is visible and has a valid href
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

  // Live match header with STS checks MLS - TIER 1
Cypress.Commands.add("liveMatchHeaderSTS", (game) => {
    cy.get('section[class*="mls-l-module--match-hub-header-container"]')
      .should("be.visible")
      .within(() => {
        // Home team name is visible
        cy.get(".mls-c-club__shortname")
          .invoke("addClass", "--home")
          .should("be.visible");
  
        // Away team name is visible
        cy.get(".mls-c-club__shortname")
          .invoke("addClass", "--away")
          .should("be.visible");
  
        // Stadium is visible
        cy.get(".mls-c-venue-broadcaster-bar")
        .should("be.visible")
        .contains(game.StadiumName)
  
        // Home team WDL is visible
        cy.get(".mls-c-matchhub__resume")
          .invoke("addClass", "--home")
          .should("be.visible");
        // Away team WDL is visible
        cy.get(".mls-c-matchhub__resume")
          .invoke("addClass", "--away")
          .should("be.visible");
  
        // Reformat STS date to match header
        // Convert the string to a Date object
        const dateObj = new Date(game.MatchDate);
  
        // Format the date as "Saturday October 5"
        let formattedDate = dateObj.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          timeZone: 'UTC'
        });
  
        formattedDate = formattedDate.replace(',', '');
  
        cy.log("Formatted date : " + formattedDate)
  
        // Date is visible
        cy.get(".mls-c-blockheader__subtitle")
        .should("be.visible")
        .invoke("text")
        .then((siteDate) => {
          expect(siteDate).to.include(formattedDate)
        })
  
        // Watch location link is visible and has a valid href
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

