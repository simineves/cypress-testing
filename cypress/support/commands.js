/// <reference types="Cypress" />

const webAppBaseURL = Cypress.env("baseURL");
const emailAddress = Cypress.env("username");
const emailPassword = Cypress.env("password");
const nameValue = Cypress.env("name");
const statsAPIBaseURL = Cypress.env("statsAPIBaseURL");
const statsAPIToken = Cypress.env("statsAPIToken");
var randomize = require("randomatic");

Cypress.Commands.add("visitWebAppHomePage", () => {
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.visit(`${webAppBaseURL}`);
  cy.wait(2000);
  cy.get("#onetrust-accept-btn-handler").click();
});

Cypress.Commands.add("acceptCookies", () => {
  cy.wait(2000);
  cy.get("#onetrust-accept-btn-handler").click();
});

Cypress.Commands.add("selectRegularSeason", () => {
  cy.get("select.mls-o-buttons__dropdown-button--right")
    .first()
    .select("Regular Season");
});

Cypress.Commands.add("login", () => {
  const emailAddress = Cypress.env("username");
  const emailPassword = Cypress.env("password");
  const nameValue = Cypress.env("name");

  cy.log(`Email Address: ${emailAddress}`);
  cy.log(`Password: ${emailPassword}`);
  cy.log(`Username: ${nameValue}`);

  cy.contains("span", "Sign in").first().click();
  cy.wait(5000);
  cy.get("#username").type(emailAddress);
  cy.get("#password").type(emailPassword);
  cy.get('button[value="default"]').click();
  cy.wait(15000);
  cy.get(
    ".mls-o-navigation__secondary-list > :nth-child(7) > .mls-o-navigation__item-link"
  ).click();
  cy.wait(10000);
  cy.get(".mls-c-account__name").contains(nameValue);
});

Cypress.Commands.add("logout", () => {
  cy.get(".mls-c-account__logout-button").click();
  cy.contains("span", "Sign in").first().should("contain", "Sign in");
});

Cypress.Commands.add("getThreeSeasonTeams", () => {
  const apiUrl = `${statsAPIBaseURL}/clubs?token=${statsAPIToken}&competition_code=US_ML&season_id=869`;

  let threeSeasonTeams = [];

  cy.request(apiUrl).then((response) => {
    expect(response.status).to.eq(200);

    // Iterate through the array and extract the 'abbreviation' property
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

    // Iterate through the array and extract the 'abbreviation' property
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

Cypress.Commands.add("signUp", () => {
  cy.contains("span", "Sign in").first().click();
  cy.contains("a", "Create one here").click();
  cy.get("#email").type(`test@${randomize("a", 5)}.com`);
  cy.get("#password").type(`${randomize("a", 5)}@231`);
  cy.get('label[for="terms-of-service"]').click();
  cy.contains("button", "Continue").click();
  cy.contains("button", "Close").click();
  cy.wait(4000);
  cy.reload();
  cy.get(".mls-o-navigation--lg .mls-o-navigation__item-text")
    .contains("Standings")
    .should("be.visible");
});

// Live Match Lineups Page Element Validation
Cypress.Commands.add("verifyLineupsElementsExistAndVisible", () => {
  //Verify if pitch is available
  cy.get('div[class*="mls-o-pitch"]').should("exist").should("be.visible");

  // Verify team logos are available in the pitch
  cy.get('div[class*="mls-o-pitch__club-logo-wrapper--home"]')
    .should("exist")
    .should("be.visible");
  cy.get('div[class*="mls-o-pitch__club-logo-wrapper--away"]')
    .should("exist")
    .should("be.visible");

  // Verify home team formation on the pitch
  cy.get(
    ".mls-o-pitch__club-logo-wrapper--home .mls-o-pitch__formation-numbers"
  )
    .invoke("text")
    .then((homeFormation) => {
      const formationArray = homeFormation.trim().split("");
      let expectedRows = [];
      let validFormation = true;

      for (let i = 0; i < 3; i++) {
        if (isNaN(formationArray[i])) {
          validFormation = false;
          break;
        }
        expectedRows.push(parseInt(formationArray[i]));
      }

      if (validFormation) {
        const formationSuffix = formationArray.slice(3).join("");

        formationArray.forEach((char, index) => {
          if (index < 3 && !isNaN(char)) {
            expectedRows.push(parseInt(char));
          }
        });

        expectedRows.forEach((row, index) => {
          cy.get(
            `.mls-o-pitch__club-formation--home .mls-o-pitch__row--${row}:nth-child(${
              index + 1
            })`
          ).should("exist");
        });
      } else {
        cy.log("Invalid formation:", homeFormation);
      }
    });

  // Verify away team formation on the pitch
  cy.get(
    ".mls-o-pitch__club-logo-wrapper--away .mls-o-pitch__formation-numbers"
  )
    .invoke("text")
    .then((awayFormation) => {
      const formationArray = awayFormation.trim().split("");
      let expectedRows = [];
      let validFormation = true;

      for (let i = 0; i < 3; i++) {
        if (isNaN(formationArray[i])) {
          validFormation = false;
          break;
        }
        expectedRows.push(parseInt(formationArray[i]));
      }

      if (validFormation) {
        const formationSuffix = formationArray.slice(3).join("");

        formationArray.forEach((char, index) => {
          if (index < 3 && !isNaN(char)) {
            expectedRows.push(parseInt(char));
          }
        });

        expectedRows.forEach((row, index) => {
          cy.get(
            `.mls-o-pitch__club-formation--away .mls-o-pitch__row--${row}:nth-child(${
              index + 1
            })`
          ).should("exist");
        });
      } else {
        cy.log("Invalid formation:", awayFormation);
      }
    });

  // Verify team players are available on the pitch
  cy.get('div[class*="mls-o-pitch__club-formation--home"]')
    .should("exist")
    .should("be.visible");
  cy.get('div[class*="mls-o-pitch__club-formation--away"]')
    .should("exist")
    .should("be.visible");

  // Verify if home team substitutes player list available
  cy.get('div[class*="mls-o-substitutions--home"]')
    .should("exist")
    .should("be.visible");

  // Verify if away team substitutes player list available
  cy.get('div[class*="mls-o-substitutions--away"]')
    .should("exist")
    .should("be.visible");

  // Verify if home team manager available
  cy.get('div[class*="mls-o-managers--home"]')
    .should("exist")
    .should("be.visible");

  // Verify if away team manager available
  cy.get('div[class*="mls-o-managers--away"]')
    .should("exist")
    .should("be.visible");
});

// Buy Ticket button exists on the page - Regular Season / General
Cypress.Commands.add("buyTicketBtnCheck", () => {
  let ticketProviderURL = [
    "https://www.ticketmaster.com",
    "https://www.ticketmaster.ca",
  ];
  cy.get('[data-react="mls-ticketing-block"]').should("be.visible");

  // Check if the ticket link matches any of the domains in the array
  cy.get('[data-react="mls-ticketing-block"] a').should(($links) => {
    expect($links.length).to.be.greaterThan(0); // Ensure there is at least one link
    $links.each((_, link) => {
      const isMatchingDomain = ticketProviderURL.some((domain) =>
        link.href.includes(domain)
      );
      expect(isMatchingDomain).to.be.true;
    });
  });
});

// Buy Ticketing model exists on the page - Regular Season / Pre Match
Cypress.Commands.add("ticketModelCheck", () => {
  // Check that ticket info is visible on the ticketmaster component
  cy.get(".mls-o-ticketing-block__ticket-info").should("be.visible");
  // Check that both team badges are displayed
  cy.get(".mls-o-ticketing-block__club-logo")
    .should("be.visible")
    .should("have.length", 2);
  // Team VS Team is visible
  cy.get(".mls-o-ticketing-block__versus").should("be.visible");
  // Date and Time are visible
  cy.get(".mls-o-ticketing-block__date-time").should("be.visible");
  // Stadium / Venue is visible
  cy.get(".mls-o-ticketing-block__venue").should("be.visible");
  // Ticket link is visible and has a valid href
  cy.get(".mls-o-ticketing-block__cta")
    .invoke("addClass", "--third")
    .should("be.visible")
    .should("have.attr", "href")
    .and(
      "match",
      /^(https?:\/\/)?[\w\.-]+(\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
    );
});

// Check if Pre Match Header is visible - Regular Seasons / Pre Match
Cypress.Commands.add("preMatchHeader", () => {
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
      cy.get(".mls-c-venue-broadcaster-bar").should("be.visible");
      // Home team WDL is visible
      cy.get(".mls-c-matchhub__resume")
        .invoke("addClass", "--home")
        .should("be.visible");
      // Away team WDL is visible
      cy.get(".mls-c-matchhub__resume")
        .invoke("addClass", "--away")
        .should("be.visible");
      // Date is visible
      cy.get(".mls-c-blockheader__subtitle").should("be.visible");
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

// Check if Pre Match Header is visible - Regular Seasons / Pre Match
Cypress.Commands.add("preMatchHeaderLC", (URL) => {
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
      cy.get(".mls-c-venue-broadcaster-bar").should("be.visible");
      cy.get(".mls-c-blockheader__subtitle").should("be.visible");

      if (!URL.includes("tbc")) {
        // Date is visible
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
      }
    });
});

// Check if Pre Match Header is visible - Other Pre Match
Cypress.Commands.add("otherPreMatchHeader", () => {
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
      cy.get(".mls-c-venue-broadcaster-bar").should("be.visible");
      // Date is visible
      cy.get(".mls-c-blockheader__subtitle").should("be.visible");
    });
});

// Check if Pre Match Header is visible - CC
Cypress.Commands.add("preMatchHeaderCC", () => {
  cy.get('section[class*="mls-l-module--match-hub-header-container"]')
    .should("be.visible")
    .within(() => {
      // Home team name is visible
      cy.get(".mls-c-club").invoke("addClass", "--home").should("be.visible");
      // Away team name is visible
      cy.get(".mls-c-club").invoke("addClass", "--away").should("be.visible");
      // Stadium is visible
      cy.get(".mls-c-venue-broadcaster-bar").should("be.visible");
      // Home team WDL is visible
      cy.get(".mls-c-matchhub__resume")
        .invoke("addClass", "--home")
        .should("be.visible");
      // Away team WDL is visible
      cy.get(".mls-c-matchhub__resume")
        .invoke("addClass", "--away")
        .should("be.visible");
      // Date is visible
      cy.get(".mls-c-blockheader__subtitle").should("be.visible");

      cy.get('div[class*="mls-c-venue-broadcaster-bar"]')
        .should("be.visible")
        .then(($element) => {
          const text = $element.text().trim();

          if (text.includes("Apple TV")) {
            cy.get('button[class*="mls-c-matchbutton__apple"]').should(
              "be.visible"
            );
          } else if (text.includes("MLSNEXTPro.com")) {
            cy.get(
              'div[class*="mls-c-venue-broadcaster-bar --single-broadcaster"]'
            )
              .should("be.visible")
              .should("contain", "MLSNEXTPro.com");
          } else {
            throw new Error(
              `Neither "Apple TV" or "MLSNEXTPro.com" found in the broadcaster section: "${text}"`
            );
          }
        });
    });
});

// Check if Pre Match Header is visible - NextPro
Cypress.Commands.add("nextProPreMatchHeader", () => {
  cy.get('section[class*="mls-l-module--match-hub-header-container"]')
    .should("be.visible")
    .within(() => {
      // Home team name is visible
      cy.get(".mls-c-club").invoke("addClass", "--home").should("be.visible");
      // Away team name is visible
      cy.get(".mls-c-club").invoke("addClass", "--away").should("be.visible");
      // Stadium is visible
      cy.get(".mls-c-venue-broadcaster-bar").should("be.visible");
      // Home team WDL is visible
      cy.get(".mls-c-matchhub__resume")
        .invoke("addClass", "--home")
        .should("be.visible");
      // Away team WDL is visible
      cy.get(".mls-c-matchhub__resume")
        .invoke("addClass", "--away")
        .should("be.visible");
      // Date is visible
      cy.get(".mls-c-blockheader__subtitle").should("be.visible");

      cy.get('div[class*="mls-c-venue-broadcaster-bar --single-broadcaster"]')
        .should("be.visible")
        .then(($element) => {
          const text = $element.text().trim();

          if (text.includes("Apple TV")) {
            cy.get('button[class*="mls-c-matchbutton__apple"]').should(
              "be.visible"
            );
          } else if (text.includes("MLSNEXTPro.com")) {
            cy.get(
              'div[class*="mls-c-venue-broadcaster-bar --single-broadcaster"]'
            )
              .should("be.visible")
              .should("contain", "MLSNEXTPro.com");
          } else {
            throw new Error(
              `Neither "Apple TV" or "MLSNEXTPro.com" found in the broadcaster section: "${text}"`
            );
          }
        });
    });
});

// Check if Pre Match Header is visible - NextPro That is not on Apple TV
Cypress.Commands.add("nextProPreMatchHeaderNull", () => {
  cy.get('section[class*="mls-l-module--match-hub-header-container"]')
    .should("be.visible")
    .within(() => {
      // Home team name is visible
      cy.get(".mls-c-club").invoke("addClass", "--home").should("be.visible");
      // Away team name is visible
      cy.get(".mls-c-club").invoke("addClass", "--away").should("be.visible");
      // Stadium is visible
      cy.get(".mls-c-venue-broadcaster-bar").should("be.visible");
      // Home team WDL is visible
      cy.get(".mls-c-matchhub__resume")
        .invoke("addClass", "--home")
        .should("be.visible");
      // Away team WDL is visible
      cy.get(".mls-c-matchhub__resume")
        .invoke("addClass", "--away")
        .should("be.visible");
      // Date is visible
      cy.get(".mls-c-blockheader__subtitle").should("be.visible");
    });
});

// Check if Post Match Header is visible - Regular Seasons / Post Match
Cypress.Commands.add("postMatchHeader", (URL) => {
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
      // Home team commentary is visible
      cy.get(".mls-c-matchhub__resume")
        .invoke("addClass", "--home")
        .should("be.visible");
      // Away team commentary is visible
      cy.get(".mls-c-matchhub__resume")
        .invoke("addClass", "--away")
        .should("be.visible");
      // Match Scorebug is visible
      cy.get(".mls-c-scorebug__post").should("be.visible");
      // Match Status is Final
      cy.get('div[class*="mls-c-status-stamp__status -post"]')
        .should("be.visible")
        .contains("Final");
      // Date is visible
      cy.get(".mls-c-blockheader__subtitle").should("be.visible");
      // Highlights is visible
      cy.get(".mls-c-matchbutton").should("be.visible");
    });
});

// Check if Post Match Header is visible - Copa America
Cypress.Commands.add("otherPostMatchHeader", () => {
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
      // Match Scorebug is visible
      cy.get(".mls-c-scorebug__post").should("be.visible");
      // Match Status is Final
      cy.get('div[class*="mls-c-status-stamp__status -post"]')
        .should("be.visible")
        .contains("Final");
      // Date is visible
      cy.get(".mls-c-blockheader__subtitle").should("be.visible");
    });
});

// News Carousel check - Regular Seasons / Post Match / Pre Match
Cypress.Commands.add("carouselCheck", () => {
  // Carousel Check
  cy.get('[data-react="mls-match-hub-content-carousel"]')
    .find(".fo-carousel__slide" || ".-customentity" || ".-brightcovevideo")
    .should("be.visible");
});

// Scoreboard check - Regular Seasons / Post Match / Pre Match
Cypress.Commands.add("rightHandScoreboardCheck", () => {
  // Scoreboard / Schedule on the right-hand side exists and has more than 1 game listed
  cy.get('div[class*="mls-c-vertical-scoreboard__matches"]').should(
    "be.visible"
  );
  cy.get('div[class*="mls-c-vertical-scoreboard__matches"]')
    .find("div")
    .filter('[class*="mls-c-vertical-match"]')
    .should("have.length.gt", 1);
});

// Checks if Match detail is visible - Regular Seasons / Pre Match
Cypress.Commands.add("matchDetail", () => {
  // Extract and validate T1 wins
  cy.get(".mls-o-previous-matches__versus-data")
    .eq(0)
    .should("be.visible")
    .and("not.be.empty")
    .invoke("text")
    .then((text) => {
      const numberValue = parseFloat(text);
      expect(numberValue).to.be.a("number").and.not.NaN;
    });
  // Extract and validate Draws
  cy.get(".mls-o-previous-matches__versus-data")
    .eq(1)
    .should("be.visible")
    .and("not.be.empty")
    .invoke("text")
    .then((text) => {
      const numberValue = parseFloat(text);
      expect(numberValue).to.be.a("number").and.not.NaN;
    });
  // Extract and validate T2 wins
  cy.get(".mls-o-previous-matches__versus-data")
    .eq(2)
    .should("be.visible")
    .and("not.be.empty")
    .invoke("text")
    .then((text) => {
      const numberValue = parseFloat(text);
      expect(numberValue).to.be.a("number").and.not.NaN;
    });
});

// Checks if Last 3 matches are visible - Regular Seasons / Pre Match
/*
Cypress.Commands.add("lastThreeMatches", () => {
  // Check if a score string is valid
  const isValidScore = (scoreString) => {
    cy.wait(2000);
    const scores = scoreString.split(":");
    return (
      scores.length === 2 && scores.every((score) => !isNaN(parseFloat(score)))
    );
  };

  cy.get(".mls-l-module.mls-l-module--previous-matches")
    .should("be.visible")
    .find(".mls-o-match-strip.mls-o-match-strip--post")
    .each((match, index) => {
      cy.wrap(match)
        .should("be.visible")
        .and("not.be.empty")
        .invoke("text")
        .then((scoreString) => {
          expect(
            isValidScore(scoreString),
            `Element for match ${index + 1} should contain a valid score`
          ).to.be.true;
        });
    })
    .then((matches) => {
      // Check that there are 3 matches
      expect(
        matches.length,
        'There should be 3 matches found in "Last 3 matches" section'
      ).to.equal(3);
    });
});
*/

// Match Summary and commentary list check - Regular Season / Post Match
Cypress.Commands.add("commentaryListCheck", () => {
  // Check match summary text header is visible
  cy.get('section[class*="mls-l-module--match-feed"]')
    .should("be.visible")
    .find("div")
    .filter('[class*="mls-o-match-feed__commentary"]')
    .should("have.length.gt", 1);
});

// Check that match stats are visible - Regular Season / Post Match
Cypress.Commands.add("matchStatsCheck", () => {
  // Check match summary text header is visible
  cy.get(".mls-o-stats-comparison__header")
    .should("be.visible")
    .contains("Stats");
  // Check team names and logos are visible
  cy.get(".mls-o-stats-comparison__club-logo")
    .should("be.visible")
    .should("have.length", 2);
  cy.get(".mls-o-stats-comparison__club-short-name")
    .should("be.visible")
    .should("have.length", 2);
  // Check that stats are visible
  cy.get(".mls-o-stats-comparison__chart-group--general").should("be.visible");
});

// Check that Match Facts are visible - Regular Season / Post Match / Pre Match
Cypress.Commands.add("matchFactsCheck", () => {
  // Check match summary text header is visible
  cy.get(".mls-o-match-facts__header")
    .should("be.visible")
    .contains("Match Facts");
  // Check that all of the details in Match Fact have a value
  cy.get(".mls-o-match-facts__value").each(($span) => {
    cy.wrap($span).should("be.visible").invoke("text").should("not.be.empty");
  });
});

// Live Match Lineups Page Element Validation
Cypress.Commands.add("liveMatchFactsCheck", () => {
  // Match Facts Check
  cy.get('div[class*="mls-o-match-facts__header"]').should("be.visible");

  // Check Match Stadium
  cy.get('span[class*="oc-o-icon--stadium"]').should("be.visible");
  cy.get('span[class*="mls-o-match-facts__label"]')
    .contains("Stadium")
    .should("be.visible");

  // Check Match Location
  cy.get('span[class*="oc-o-icon--city"]').should("be.visible");
  cy.get('span[class*="mls-o-match-facts__label"]')
    .contains("Location:")
    .should("be.visible");

  // Check Match Referee
  cy.get('span[class*="oc-o-icon--official"]').should("be.visible");
  cy.get('span[class*="mls-o-match-facts__label"]')
    .contains("Referee:")
    .should("be.visible");
  cy.get('span[class*="mls-o-match-facts__label"]')
    .contains("Asst. Referee 1:")
    .should("be.visible");
  cy.get('span[class*="mls-o-match-facts__label"]')
    .contains("Asst. Referee 2:")
    .should("be.visible");
  cy.get('span[class*="mls-o-match-facts__label"]')
    .contains("Fourth official:")
    .should("be.visible");
});

// Validate Calender
Cypress.Commands.add("validateCalender", () => {
  cy.get(`div[aria-label='Date selector']`).click();
  cy.get('div[class*="mls-o-calendar"]').should("be.visible");
  cy.get(`div[aria-label='Date selector']`).click();
  cy.get(`button[aria-label='Previous results']`).click();
  cy.wait(2000);
  cy.get(`button[aria-label='Next results']`).click();
  cy.wait(2000);
  cy.get(`button[class*='mls-o-buttons__icon--left']`).click();
  cy.wait(2000);
  cy.get(`button[class*='mls-o-buttons__icon--right']`).click();
  cy.wait(2000);
});

// Validate all competitions selection dropdown
Cypress.Commands.add("validateCompetitionsDropdown", (allCompetitions) => {
  cy.get('select[class*="mls-o-buttons__dropdown-button"]')
    .eq(0)
    .as("competitionsDropDown")
    .should("be.visible");

  cy.get("@competitionsDropDown")
    .find("option")
    .should("have.length.greaterThan", 0)
    .as("competitionsDropDown");

  allCompetitions.forEach((competition) => {
    cy.get("@competitionsDropDown")
      .contains("option", competition)
      .should("exist")
      .then(() => {
        cy.log(`Verified club: ${competition}`);
      })
      .should("exist")
      .then(() => {
        cy.log(`Verified club: ${competition}`);
      });
  });
});

// Validate all competitions selection dropdown
Cypress.Commands.add("validateClubsDropdown", (allClubs) => {
  cy.get('select[class*="mls-o-buttons__dropdown-button--right"]')
    .eq(1)
    .as("clubsDropDown")
    .should("be.visible");

  cy.get("@clubsDropDown")
    .find("option")
    .should("have.length.greaterThan", 0)
    .as("clubsDropDown");

  allClubs.forEach((club) => {
    cy.get("@clubsDropDown")
      .contains("option", club)
      .should("exist")
      .then(() => {
        cy.log(`Verified club: ${club}`);
      });
    cy.get("@clubsDropDown")
      .contains("option", club)
      .should("exist")
      .then(() => {
        cy.log(`Verified club: ${club}`);
      });
  });
});

// Validate all competitions selection dropdown
Cypress.Commands.add("validateClubsDropdownLC", (allClubs) => {
  cy.get('select[class*="mls-o-buttons__dropdown-button--right"]')
    .as("clubsDropDown")
    .find("option") // Find all options within the dropdown
    .should("have.length", allClubs.length);

  allClubs.forEach((club) => {
    cy.get("@clubsDropDown").contains("option", club).should("exist");
  });
});

// Validate LiveMatch Banner ## Need to modify during live match with score and live toggle button validation
Cypress.Commands.add("validateLiveMatchBanner", () => {
  cy.get('section[class*="mls-l-module--match-hub-header-container"]')
    .should("be.visible")
    .within(() => {
      cy.get('img[alt="background"]').should("be.visible");
      cy.get('div[class*="mls-c-matchhub__header"]').should("be.visible");
      cy.get('div[class*="mls-c-status-stamp__status -live"]').should(
        "be.visible"
      );
      cy.get('div[class*="mls-c-matchhub-tile --live"]').should("be.visible");
      cy.get('div[class*="mls-c-club --home"]').should("be.visible");
      cy.get('div[class*="mls-c-club --away"]').should("be.visible");
      cy.get('div[class*="mls-c-scorebug__goal"]').should("be.visible");
      cy.get('div[class*="mls-c-match-buttons --live"]').should("be.visible");
    });
});

// Validate LiveMatch Banner ## Need to modify during live match with score and live toggle button validation
Cypress.Commands.add("validateLiveNextProMatchBanner", () => {
  cy.get('section[class*="mls-l-module--match-hub-header-container"]')
    .should("be.visible")
    .within(() => {
      cy.get('img[alt="background"]').should("be.visible");
      cy.get('div[class*="mls-c-matchhub__header"]').should("be.visible");
      cy.get('div[class*="mls-c-status-stamp__status -live"]').should(
        "be.visible"
      );
      cy.get('div[class*="mls-c-matchhub-tile --live"]').should("be.visible");
      cy.get('div[class*="mls-c-club --home"]').should("be.visible");
      cy.get('div[class*="mls-c-club --away"]').should("be.visible");
      cy.get('div[class*="mls-c-scorebug__goal"]').should("be.visible");
    });
});

// Stats Check Live Match
Cypress.Commands.add("liveMatchStatsCheck", () => {
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
  cy.get('div[class*="mls-o-stat-chart__first-value"]').each(($div) => {
    const textContent = $div.text().trim();
    const numberValue = parseFloat(textContent);
    expect(numberValue).to.be.a("number").and.not.NaN;
  });
  cy.get('div[class*="mls-o-stat-chart__second-value"]').each(($div) => {
    const textContent = $div.text().trim();
    const numberValue = parseFloat(textContent);
    expect(numberValue).to.be.a("number").and.not.NaN;
  });
});

// Stats Check Live Match
Cypress.Commands.add("liveMatchStatsCheckNP", () => {
  const expectedStats = [
    "Shots",
    "Shots on Goal",
    "Blocked Shots",
    "Total Passes",
    "Passing Accuracy %",
    "Corners",
    "Total Crosses",
    "Offsides",
    "Goalkeeper Saves",
    "Clearances",
    "Fouls",
    "Yellow Cards",
    "Red Cards",
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
  cy.get('div[class*="mls-o-stat-chart__first-value"]').each(($div) => {
    const textContent = $div.text().trim();
    const numberValue = parseFloat(textContent);
    expect(numberValue).to.be.a("number").and.not.NaN;
  });
  cy.get('div[class*="mls-o-stat-chart__second-value"]').each(($div) => {
    const textContent = $div.text().trim();
    const numberValue = parseFloat(textContent);
    expect(numberValue).to.be.a("number").and.not.NaN;
  });
});

// Stats for Shooting Breakdown - Live Match
Cypress.Commands.add("liveMatchShootingBreakdownStatsCheck", () => {
  const expectedShootingBreakdown = [
    "Goals",
    "On Target",
    "Off Target",
    "Blocked",
  ];

  // Verify Shooting Breakdown
  cy.get('section[class*="mls-l-module--shooting-breakdown"]').should(
    "be.visible"
  );
  cy.get('div[class*="mls-o-shooting-breakdown__club-group"]').should(
    "be.visible"
  );
  cy.get('div[class*="mls-o-shooting-breakdown__club--home"]').should(
    "be.visible"
  );
  cy.get('div[class*="mls-o-shooting-breakdown__club--away"]').should(
    "be.visible"
  );
  cy.get('div[class*="mls-o-shooting-breakdown__chart-group"]')
    .should("be.visible")
    .within(() => {
      expectedShootingBreakdown.forEach((headerValue) => {
        cy.get('div[class*="mls-o-stat-chart__header"]')
          .contains(headerValue)
          .should("be.visible");
      });
    });
});

// Stats for Passing Breakdown - Live Match
Cypress.Commands.add("liveMatchPassingBreakdownStatsCheck", () => {
  const expectedPassingBreakdown = [
    "Overall %",
    "Open Play Pass %",
    "Set Piece Cross %",
    "Open Play Cross %",
  ];

  // Verify Passing Breakdown
  cy.get('section[class*="mls-l-module--passing-breakdown"]').should(
    "be.visible"
  );
  cy.get('div[class*="mls-o-passing-breakdown__club-group"]').should(
    "be.visible"
  );
  cy.get('div[class*="mls-o-passing-breakdown__club--home"]').should(
    "be.visible"
  );
  cy.get('div[class*="mls-o-passing-breakdown__club--away"]').should(
    "be.visible"
  );
  cy.get('div[class*="mls-o-passing-breakdown__chart-group"]')
    .should("be.visible")
    .within(() => {
      expectedPassingBreakdown.forEach((headerValue) => {
        cy.get('div[class*="mls-o-stat-chart__header"]')
          .contains(headerValue)
          .should("be.visible");
      });
    });
});

// Stats for Expected Goals - Live Match
Cypress.Commands.add("liveMatchExpectedGoalsStatsCheck", () => {
  const expectedGoalsStats = ["Total Team XG", "Shots", "Shots On Target"];

  // Verify Expected Goals Section
  cy.get('section[class*="mls-l-module--expected-goals"]').should("be.visible");
  cy.get('div[class*="mls-o-expected-goals__club-group"]').should("be.visible");
  cy.get('div[class*="mls-o-expected-goals__club--home"]').should("be.visible");
  cy.get('div[class*="mls-o-expected-goals__club--away"]').should("be.visible");
  cy.get('div[class*="mls-o-expected-goals__chart-group"]')
    .should("be.visible")
    .within(() => {
      expectedGoalsStats.forEach((headerValue) => {
        cy.get('div[class*="mls-o-stat-chart__header"]')
          .contains(headerValue)
          .should("be.visible");
      });
    });
});

// Stats for Possession - Live Match
Cypress.Commands.add("liveMatchPossessionStatsCheck", () => {
  // Verify Possession Section
  cy.get('section[class*="mls-l-module--possession"]').should("be.visible");
  cy.get('div[class*="mls-o-possession__header"]').should("be.visible");
  cy.get('div[class*="mls-o-possession__total"]').should("be.visible");
  cy.get('div[class*="mls-o-possession__clubs"]').should("be.visible");
  cy.get('div[class*="mls-o-possession__club--home"]').should("be.visible");
  cy.get('div[class*="mls-o-possession__club--away"]').should("be.visible");
  cy.get('div[class*="mls-o-possession__average"]').should("be.visible");
  cy.get('div[class*="mls-o-possession__average--percentage-home"]').should(
    "be.visible"
  );
  cy.get('div[class*="mls-o-possession__average--percentage-away"]').should(
    "be.visible"
  );
  cy.get('div[class*="mls-o-possession__intervals"]').should("be.visible");
  cy.get('div[class*="mls-o-possession__divider"]').should("be.visible");
});

// Stats for Players - Live Match
Cypress.Commands.add("liveMatchPlayersStatsCheck", () => {
  // Verify Stats table for Players from both the teams
  cy.get(`button[aria-label='Players']`).click();
  cy.get('div[class*="mls-c-stats--match-hub-player-stats"]').should(
    "be.visible"
  );
  cy.get('div[class*="mls-c-stats__table"]').eq(0).should("be.visible");
  cy.get('div[class*="mls-c-stats__table"]').eq(1).should("be.visible");
  cy.get('table[class*="match-hub-player-stats"]').eq(0).should("be.visible");
  cy.get('table[class*="match-hub-player-stats"]').eq(1).should("be.visible");
  cy.get('thead[class*="mls-o-table__header"]').eq(1).should("be.visible");
  cy.get('thead[class*="mls-o-table__header"]').eq(0).should("be.visible");
  cy.get('tbody[class*="mls-o-table__body"]').eq(1).should("be.visible");
  cy.get('tbody[class*="mls-o-table__body"]').eq(0).should("be.visible");

  cy.get('div[class*="short-name"]').each(($div) => {
    const textContent = $div.text().trim();
    expect(textContent).to.be.a("string").and.not.NaN;
  });

  const classesToCheck = [
    "mls-o-table__cell   goals",
    "expected_goals",
    "total_scoring_att",
    "ontarget_scoring_att",
    "accurate_pass_per_match_hub",
    "goal_assist",
    "accurate_cross",
    "corner_taken",
    "total_att_assist",
    "aerial_duel",
    "fouls",
    "was_fouled",
    "total_offside",
    "yellow_card",
    "total_red_card",
  ];
  classesToCheck.forEach((className) => {
    cy.get(`td[class*="${className}"]`).each(($el) => {
      const textContent = $el.text().trim();
      const numberValue = parseFloat(textContent);
      expect(numberValue).to.be.a("number").and.not.NaN;
    });
  });
});

Cypress.Commands.add("validateMatchFeeds", () => {
  cy.scrollToBottom();
  cy.get('div[class*="mls-o-match-feed"]').should("be.visible");
  cy.get('div[class*="mls-o-match-feed__title"]')
    .contains("Full Time")
    .should("be.visible");
  cy.get('div[class*="mls-o-match-feed__title"]')
    .contains("End Of Second Half")
    .should("be.visible");
  cy.get('div[class*="mls-o-match-feed__title"]')
    .contains("Half Time")
    .should("be.visible");
  cy.get('div[class*="mls-o-match-feed__title"]')
    .contains("Kick Off")
    .should("be.visible");
});

Cypress.Commands.add("validateClubsDetails", (expectedClubsFullNames) => {
  cy.get('button[class*="mls-o-navigation__button"]').eq(0).click();
  cy.get('a[href="/clubs/index"]').eq(0).click();

  cy.get('div[class*="mls-o-clubs-hub-clubs-list__club-name"]')
    .should("have.length", 29)
    .each(($div) => {
      // Verify Club Name
      cy.wrap($div)
        .find("span")
        .first()
        .invoke("text")
        .then((text) => {
          const isTextPresent = expectedClubsFullNames.includes(text.trim());
          cy.log(text.trim(), "is a valid club name");
          expect(isTextPresent).to.be.true;
        });

      // Verify Club Links
      cy.wrap($div)
        .nextAll("div")
        .find("a")
        .should("have.length.gte", 3)
        .each(($a) => {
          const clubLink = $a.prop("href");
          expect(clubLink).to.not.include("undefined");
          cy.request({
            url: clubLink,
            failOnStatusCode: false,
          }).then((response) => {
            expect(response.status).to.not.eq(404);
          });
        });
    });
});

// Videos Tab - Post Match
Cypress.Commands.add("postMatchVideoCheck", () => {
  cy.get("section.mls-addons-editorial-list .d3-l-grid--inner")
    .find("a.fm-card-wrap.-brightcovevideo")
    .should("have.length.greaterThan", 0)
    .each(($video) => {
      cy.wrap($video).find(".fm-card__figure").should("be.visible");
      cy.wrap($video)
        .find(".mls-o-video-card__duration-lock")
        .should("be.visible");
      cy.wrap($video)
        .find(".fm-card__icon--brightcovevideo")
        .should("be.visible");
    });
});

// check if the competition name is visible
Cypress.Commands.add("commpetitionsNameCheck", () => {
  cy.get('div[class*="mls-o-block-header__title"]').should("be.visible");
});

// check if the sub page links return 200 status code
Cypress.Commands.add("commpetitionsLinkCheck", () => {
  cy.get('div[class*="mls-c-quicklinkslist__item"]')
    .find("a")
    .should("be.visible")
    .each(($a) => {
      const link = $a.prop("href");
      expect(link).to.not.include("undefined");
      cy.request({
        url: link,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.not.eq(404);
      });
    });
});

// check if the dropdown is visible and links return 200 status code for each
Cypress.Commands.add("competitionNavLinkCheck", () => {
  cy.get(".mls-c-sub-nav__nav-list > li").each(($li) => {
    // Check if it's a dropdown element (has a button)
    if ($li.find(".mls-c-sub-nav__toggle").length > 0) {
      cy.wrap($li).find(".mls-c-sub-nav__toggle").click();
      cy.wrap($li)
        .find(".mls-c-sub-nav__item-link")
        .each(($a) => {
          const linkUrl = $a.prop("href");
          cy.request({
            url: linkUrl,
            failOnStatusCode: false,
          }).then((response) => {
            expect(response.status).to.eq(200);
          });
        });
    } else {
      // It's not a dropdown, find the link directly
      cy.wrap($li)
        .find(".mls-c-sub-nav__item-link")
        .each(($a) => {
          const linkUrl = $a.prop("href");
          cy.request({
            url: linkUrl,
            failOnStatusCode: false,
          }).then((response) => {
            expect(response.status).to.be.oneOf([200, 301, 302]);
          });
        });
    }
  });
});

Cypress.Commands.add("copaAmericaPageCheck", () => {
  cy.get(".mls-c-sub-nav__nav-list > li")
    .find("a")
    .should("be.visible")
    .each(($a) => {
      const link = $a.prop("href");
      expect(link).to.not.include("undefined");
      cy.request({
        url: link,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.not.eq(404);
      });
    });
});

Cypress.Commands.add("compareLCGames", (LC_URLS, MLS_URLS) => {
  let LC_Substrings = [];

  LC_URLS.preMatchURLs.forEach((LC_URL) => {
    const LC_baseURL = "https://www.leaguescup.com/competitions/";
    const modifiedURL = LC_URL.replace(LC_baseURL, "");
    LC_Substrings.push(modifiedURL);
  });

  LC_Substrings.forEach((modifiedURL) => {
    let found = false;

    // Loop through MLS_URLS to find a match
    for (let MLS_URL of MLS_URLS.preMatchURLs) {
      if (MLS_URL.includes(modifiedURL)) {
        found = true;
        cy.log(`Found "${modifiedURL}" in MLS_URLS`);
        break; // Exit the loop if found
      }
    }

    if (!found) {
      cy.log(`No matching "${modifiedURL}" found in MLS_URLS`).then(() => {
        // Fail the test if no match was found
        throw new Error(
          `No matching Leagues Cup URL: "${modifiedURL}" found in MLS_URLS: ${MLS_URLS}`
        );
      });
    }
  });
});

Cypress.Commands.add("liveMatchStateHtState", () => {
  cy.get('a[href="feed"]').click();
  cy.get('section[class*="mls-l-module mls-l-module--match-feed"]')
    .should("be.visible")
    .then(() => {
      cy.get(".mls-o-match-feed__container .mls-o-match-feed__title")
        .invoke("text")
        .then((titleText) => {
          const commentaryHalfTime = titleText.includes("Half Time")
            ? "y"
            : "n";
          cy.get('section[class*="mls-l-module--match-hub-header-container"]')
            .should("be.visible")
            .then(() => {
              cy.get(".mls-c-matchhub .mls-c-status-stamp__status")
                .invoke("text")
                .then((statusText) => {
                  const statusStampHT = statusText.includes("HT") ? "y" : "n";
                  if (commentaryHalfTime === "y" && statusStampHT === "y") {
                    cy.log(
                      'Test passed: Commentary has "Half Time" and status stamp is "HT".'
                    );
                  } else if (
                    commentaryHalfTime === "n" &&
                    statusStampHT === "n"
                  ) {
                    cy.log(
                      'Test passed: Commentary does not have "Half Time" and status stamp is not "HT".'
                    );
                  } else {
                    assert.fail(
                      "Test failed: Mismatch between commentary state and status stamp."
                    );
                  }
                });
            });
        });
    });
});

Cypress.Commands.add("postMatchStateFinalState", () => {
  cy.get('a[href="feed"]').click();
  cy.get('section[class*="mls-l-module mls-l-module--match-feed"]')
    .should("be.visible")
    .then(() => {
      cy.get(".mls-o-match-feed__container .mls-o-match-feed__title")
        .invoke("text")
        .then((titleText) => {
          const commentaryHalfTime = titleText.includes("Full Time")
            ? "y"
            : "n";
          cy.get('section[class*="mls-l-module--match-hub-header-container"]')
            .should("be.visible")
            .then(() => {
              cy.get(".mls-c-matchhub .mls-c-status-stamp__status")
                .invoke("text")
                .then((statusText) => {
                  const statusStampHT = statusText.includes("Final")
                    ? "y"
                    : "n";
                  if (commentaryHalfTime === "y" && statusStampHT === "y") {
                    cy.log(
                      'Test passed: Commentary has "Full Time" and status stamp is "Final".'
                    );
                  } else if (
                    commentaryHalfTime === "n" &&
                    statusStampHT === "n"
                  ) {
                    cy.log(
                      'Test passed: Commentary does not have "Full Time" and status stamp is not "Final".'
                    );
                  } else {
                    assert.fail(
                      "Test failed: Mismatch between commentary state and status stamp."
                    );
                  }
                });
            });
        });
    });
});

Cypress.Commands.add("checkForHalfTime", (isHalfTime) => {
  cy.get('div[class*="mls-c-status-stamp__status -live"]')
    .should("be.visible")
    .find("span")
    .invoke("text")
    .then((text) => {
      if (text.trim() === "HT") {
        isHalfTime = true;
      }
    });
});

Cypress.Commands.add("playoffsLatestCheck", () => {
  cy.get(".mls-o-single-photo--photo").should("have.length.above", 3);
});

Cypress.Commands.add("playoffsNewsCheck", () => {
  cy.get(".mls-c-sub-nav__item-text")
    .should("be.visible")
    .contains("News")
    .click();

  cy.wait(2000);

  cy.get('a[class*="fm-card-wrap -story"]')
    .should("be.visible")
    .should("have.length.above", 15);
});

Cypress.Commands.add("playoffsNewsCheckNP", () => {
  cy.get('picture[class*="d3-o-media-object__picture"]').should(
    "have.length.above",
    10
  );
});

Cypress.Commands.add("playoffsVideoCheckNP", () => {
  cy.wait(4000);

  cy.get('[data-react="brightcove-video-playlist"]').should("be.visible");

  cy.get('div[class*="mls-c-video-component__playlist-item"]')
    .should("be.visible")
    .should("have.length.gt", 20);

  cy.wait(2000);
  cy.reload();
  cy.get('section[data-react="brightcove-video-playlist"]').scrollIntoView({
    duration: "10000",
  });
  cy.get("video-js").should("be.visible");
  cy.get(".vjs-big-play-button").click();
  cy.wait(3000);
  cy.get("video")
    .should("have.attr", "src")
    .then((src) => {
      expect(src).to.include("blob:");
      cy.wait(1000);
      cy.get("video").then(($video) => {
        expect($video[0].paused).to.be.false;
      });
    });
});

Cypress.Commands.add("playoffsNavbarCheck", () => {
  it("should display the navbar items", () => {
    cy.get(".mls-c-sub-nav__nav-list")
      .should("exist")
      .find(".mls-c-sub-nav__nav-item")
      .should("have.length", 3);

    // Check for each item
    const navItems = [
      { text: "Latest", href: "/competitions/mls-cup-playoffs/index" },
      { text: "Bracket", href: "/competitions/mls-cup-playoffs/2024/bracket" },
      {
        text: "News",
        href: "/competitions/mls-cup-playoffs/2024/news/index",
        active: true,
      },
    ];

    navItems.forEach((item) => {
      cy.get(".mls-c-sub-nav__item-link")
        .contains(item.text)
        .should("have.attr", "href", item.href);

      if (item.active) {
        cy.get(".mls-c-sub-nav__item-link.active")
          .contains(item.text)
          .should("exist");
      }
    });
  });
});

Cypress.Commands.add("mlsBracketComponentCheck", () => {
  cy.get(".mls-c-sub-nav__item-text")
    .should("be.visible")
    .contains("Bracket")
    .click();

  cy.wait(2000);
  // Bracket container exists
  cy.get(".mls-o-brackets").should("be.visible");
});

// Cypress.Commands.add("mlsBracketContentCheck", () => {
//   cy.get(".mls-c-sub-nav__item-text")
//   .should('be.visible')
//   .contains('Bracket')
//   .click();

//   cy.wait(2000)

//   // // All names round labels  are present 
//   const roundLabels = ['Wild Card', 'Round One Best-of-3', 'Semifinals', 'Conference Final', 'MLS Cup', 'Conference Final', 'Semifinals'];
//   // roundLabels.forEach(label => {
//   //   try {
//   //     cy.get('.mls-o-brackets__round-label').contains(label).should('be.visible');
//   //   } catch (error) {
//   //     expect(error.message).to.include(`could not find: ${label}`);
//   //   }
//   // });

//   // All cards within a round have basic structure
//   for (let i = 1; i < roundLabels.length; i++) {
//     const roundColumn = cy.get(`.mls-o-brackets__column--round-${i}`);
//     try {
//       roundColumn.find('.mls-o-brackets__item').should('not.be.empty');
//     } catch (error) {
//       expect(error.message).to.include(`Round ${i} is empty or not found`);
//     }
//   }
// });

Cypress.Commands.add("mnpBracketContentCheck", () => {
  // All rounds are present
  const roundLabels = [
    "Conference Quarterfinals",
    "Conference Semifinals",
    "Conference Finals",
    "MLS NEXT Pro Cup",
    "Conference Finals",
    "Conference Semifinals",
    "Conference Quarterfinals",
  ];
  roundLabels.forEach((label) => {
    try {
      cy.get(".mls-o-brackets__round-label")
        .contains(label)
        .should("be.visible");
    } catch (error) {
      expect(error.message).to.include(`could not find: ${label}`);
    }
  });

  // All cards within a round have basic structure
  for (let i = 1; i < roundLabels.length; i++) {
    const roundColumn = cy.get(`.mls-o-brackets__column--round-${i}`);
    try {
      roundColumn.find(".mls-o-brackets__item").should("not.be.empty");
    } catch (error) {
      expect(error.message).to.include(`Round ${i} is empty or not found`);
    }
  }
});

Cypress.Commands.add("mnpBracketComponentCheck", () => {
  // Bracket container exists
  cy.get(".mls-o-brackets").should("be.visible");
});

Cypress.Commands.add("HalfTimeReportingCheck", () => {
  // Check to ensure Half Time appears only once in the feed section
  cy.get(".mls-o-match-feed__title")
    .contains("Half Time")
    .should("have.length", 1);
});

Cypress.Commands.add("checkForNegativeScores", (URL) => {
  // Click to Feeds tab
  cy.get('a[href="feed"]').click();

  // Find all scores for the away team and check for negative numbers
  cy.get('span[class*="mls-o-match-feed__home-score "]').each(($div) => {
    cy.wrap($div)
      .invoke("text")
      .then((text) => {
        let score = parseFloat(text);
        if (score < 0) {
          throw new Error(
            `Score should not be less than 0. Currently it is: ${score}. URL: ${
              URL + "feed"
            }`
          );
        }
      });
  });

  // Find all scores for the away team and check for negative numbers
  cy.get('span[class*="mls-o-match-feed__away-score"]').each(($div) => {
    cy.wrap($div)
      .invoke("text")
      .then((text) => {
        let score = parseFloat(text);
        if (score < 0) {
          throw new Error(
            `Score should not be less than 0. Currently it is: ${score}. URL: ${
              URL + "feed"
            }`
          );
        }
      });
  });
});

Cypress.Commands.add("scrollToBottom", () => {
  for (let i = 0; i < 2; i++) {
    // Access the window object to get the document's scroll height
    cy.window().then((win) => {
      // Get the current scroll position (total scrollable height)
      const scrollHeight = win.document.documentElement.scrollHeight;
      const viewportHeight = win.innerHeight;

      // Calculate the scroll target: 300 pixels from the bottom
      const scrollPosition = scrollHeight - viewportHeight - 300;

      // Scroll to the calculated position
      cy.scrollTo(0, scrollPosition, { duration: 1000 });
    });

    cy.wait(3000); // Wait before the next scroll
  }
});
