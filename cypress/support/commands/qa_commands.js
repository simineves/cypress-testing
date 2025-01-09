/// <reference types="Cypress" />

const webAppBaseURL = Cypress.env("baseURL");
const emailAddress = Cypress.env("username");
const emailPassword = Cypress.env("password");
const nameValue = Cypress.env("name");
const statsAPIBaseURL = Cypress.env("statsAPIBaseURL");
const statsAPIToken = Cypress.env("statsAPIToken");
var randomize = require("randomatic");
import { error } from "cypress/types/jquery";
//import { teamNames } from "./../../../compsTeamsClubs";
import { nextProClubs, clubs } from "./../../support/compsTeamsClubs";
import { expect } from "chai";

Cypress.Commands.add("clubStatsTeamsCheck", (URL) => {
  cy.get('[data-react="mls-club-stats"]')
    .then(($el) => {
      if (!$el.is(':visible')) {
        throw new Error(`Club stats should be visible. URL: ${URL}`)
      }
    })
    .should("be.visible")
    .find(".mls-o-table__club-link")
    .each((clubLink) => {
      cy.wrap(clubLink)
        .invoke("attr", "title")
        .then(($title) => {
          if (!clubs.includes($title)) {
            throw new Error(`Title '${$title}' should be in club array. URL: ${URL}`)
          }
        });
    });
});

Cypress.Commands.add("nextproStatsTeamsCheck", (URL) => {
  cy.get('[data-react="mls-club-stats"]')
    .should("be.visible")
    .find(".mls-o-table__club-link")
    .each((clubLink) => {
      cy.wrap(clubLink)
        .invoke("attr", "title")
        .then(($title) => {
          if ($title) {
            expect(
              nextProClubs.includes($title),
              `Title '${$title}' should be in club array. URL: ${URL}`
            ).to.be.true;
          }
        });
    });
});

Cypress.Commands.add("checkNonNullStats", (URL) => {
  cy.get('[data-react="mls-club-stats"]')
    .should("be.visible")
    .find('[class*="mls-o-table__cell"]')
    .each((stat) => {
      cy.wrap(stat)
        .invoke("text")
        .then((text) => {
          if (text.trim() == null) {
            throw new Error(`Stat text should not be null. URL: ${URL}`)
          }
        });
    });
});

Cypress.Commands.add("clickNews", (URL) => {
  cy.contains(`News`).click();
  cy.wait(2000);
  cy.get(`h1`)
    .then(($element) => {
      if (!$element) {
        throw new Error($element, `News element should exist. URL: ${URL}`)
      }
    });
});

Cypress.Commands.add("validateHomePageLinkSchedule", (URL) => {
  cy.get(
    ".mls-o-navigation--lg > .mls-o-navigation__primary-list > :nth-child(1) > .mls-o-navigation__item-link"
  ).click();
  cy.get(`h1`)
    .then(($el) => {
      if ($el.is(':visible')) {
        throw new Error(`Home page link should be visible. URL: ${URL}`)
      }
    })

  cy.contains("Schedule").click();
  cy.get(`h1`)
    .then(($element) => {
      if ($element.is(':visible')) {
        throw new Error(`Schedule H1 element should be visible. URL: ${URL}`)
      }
    })
});

Cypress.Commands.add("validateHomePageLinkNews", (URL) => {
  cy.contains("News").click();
  cy.get(`h1`)
    .should("be.visible")
    .then(($element) => {
      if (!$element.is(':visible')) {
        throw new Error($element, `H1 element on news link should be visible. URL: ${URL}`)
      }
    });
});

Cypress.Commands.add("validateNewsPageEachArticle", () => {
  cy.contains("News").click();
  cy.get("a.fm-card-wrap").each(($el) => {
    const href = $el.attr("href");
    cy.visit(href, { failOnStatusCode: false });
    cy.url().should("include", href);
  });
  cy.go("back");
});

Cypress.Commands.add("validateHomePageLinkWatch", (URL) => {
  cy.contains("Watch").click();
  cy.get(`h1`)
    .then(($element) => {
      if ($element.is(':visible')) {
        throw new Error(`H1 on Link Watch page should be visible. URL: ${URL}`)
      }
    });
});

Cypress.Commands.add("validateWatchPageEachVideo", (URL) => {
  cy.contains("Watch").click();
  cy.wait(2000);
  cy.get('section[data-react="brightcove-video-playlist"]').scrollIntoView();
  cy.get("video-js").should("be.visible");
  cy.get(".vjs-big-play-button").click();
  cy.wait(3000);
  cy.get("video")
    .should("have.attr", "src")
    .then((src) => {
      if (!src.contains("blob:")) {
        throw new Error(`Source should include blob: URL: ${URL}`)
      }
      cy.wait(1000);
      cy.get("video").then(($video) => {
        expect($video[0].paused, `Video should not be paused. URL: ${URL}`).to.be.false;
      });
    });
});

Cypress.Commands.add("validateHomePageLinkAbout", (URL) => {
  cy.contains("About").click();
  cy.get(`h1`)
    .then(($element) => {
      if (!$element.is(':visible')) {
        throw new Error($element, `H1 Element on about page should exist. Parent URL: ${URL}`)
      }
    });
});

Cypress.Commands.add("validateHomePageLinkStandings", () => {
  cy.get('[role="navigation"]').find("a").contains("span", "Standings").click();
});

Cypress.Commands.add("validateHomePageLinkStandingsLC", (URL) => {
  cy.get('[role="navigation"]').find("a").contains("span", "Bracket").click();
});

Cypress.Commands.add("validateHomePageLinkStats", (URL) => {
  cy.contains("Stats").click();
  cy.get(`h1`)
    .then(($element) => {
      if (!$element.is(':visible')) {
        throw new Error($element, `H1 element should be visible on home page stats link. Parent URL ${URL}`)
      }
    });
});

Cypress.Commands.add("validateHomePageLinkClubs", (URL) => {
  cy.get(
    ".mls-o-navigation--lg > .mls-o-navigation__primary-list > .mls-o-navigation__toggle > .mls-o-navigation__button"
  ).click({ force: true });
  cy.contains("Clubs").click({ force: true });
  cy.get(`h1`)
    .then(($element) => {
      if (!$element.is(':visible')) {
        throw new Error(`H1 element should be visible on Club Link. Parent URL: ${URL}`)
      }
    });
});

Cypress.Commands.add("validateHomePageLinkCompetitions", (URL) => {
  cy.get(
    ".mls-o-navigation--lg > .mls-o-navigation__primary-list > .mls-o-navigation__toggle > .mls-o-navigation__button"
  ).click({ force: true });
  cy.contains("Competitions").click({ force: true });
  cy.get(`h1`)
    .then(($element) => {
      if ($element.is(':visible')) {
        throw new Error($element, `H1 element should be visible on competitions page. Parent URL: ${URL}`)
      }
    });
});

Cypress.Commands.add("validateHomePageLinkRosters", (URL) => {
  cy.get(
    ".mls-o-navigation--lg > .mls-o-navigation__primary-list > .mls-o-navigation__toggle > .mls-o-navigation__button"
  ).click({ force: true });
  cy.contains("Rosters").click({ force: true });
  cy.get(`h1`)
    .then(($element) => {
      if (!$element.is(':visible')) {
        throw new Error($element, `Content should be visible on roster page. Parent URL: ${URL}`)
      }
    });
});

Cypress.Commands.add("validateHomePageLinkBetting", (URL) => {
  cy.get(
    ".mls-o-navigation--lg > .mls-o-navigation__primary-list > .mls-o-navigation__toggle > .mls-o-navigation__button"
  ).click({ force: true });
  cy.contains("Betting").click({ force: true });
  cy.get(`h1`)
    .then(($element) => {
      if (!$element.is(':visible')) {
        throw new Error(`H1 Content should be visible on betting page. Parent URL: ${URL}`)
      }
    });
});

Cypress.Commands.add("validateHomePageLinkGaming", (URL) => {
  cy.get(
    ".mls-o-navigation--lg > .mls-o-navigation__primary-list > .mls-o-navigation__toggle > .mls-o-navigation__button"
  ).click({ force: true });
  cy.contains("Gaming").click({ force: true });
  cy.get(`h1`)
    .then(($element) => {
      if (!$element.is(':visible')) {
        throw new Error(`H1 content should be visible on the gaming page. Parent URL: ${URL}`)
      }
    });
});

Cypress.Commands.add("validateHomePageLinkEMLS", (URL) => {
  cy.get(
    ".mls-o-navigation--lg > .mls-o-navigation__primary-list > .mls-o-navigation__toggle > .mls-o-navigation__button"
  ).click({ force: true });
  cy.contains("eMLS").click({ force: true });
  cy.get(`h1`)
    .then(($element) => {
      if (!$element.is(':visible')) {
        throw new Error(`H1 content should be visible on eMLS page. Parent URL: ${URL}`)
      }
    });
});

Cypress.Commands.add("validateHomePageLinkMLSGO", (URL) => {
  cy.get(
    ".mls-o-navigation--lg > .mls-o-navigation__primary-list > .mls-o-navigation__toggle > .mls-o-navigation__button"
  ).click({ force: true });
  cy.contains("MLS GO").click({ force: true });
  cy.get(`.mls - o - navigation`)
    .then(($element) => {
      if ($element.is(':visible')) {
        throw new Error(`Navigation should be visible. Parent URL: ${URL}`)
      }
    });
});

Cypress.Commands.add("validateHomePageLinkMLSNext", (URL) => {
  cy.get(
    ".mls-o-navigation--lg > .mls-o-navigation__primary-list > .mls-o-navigation__toggle > .mls-o-navigation__button"
  ).click({ force: true });
  cy.contains("MLS NEXT").click({ force: true });
  cy.get(`.mls - o - navigation`)
    .then(($element) => {
      if (!$element.is(':visible')) {
        throw new Error(`Navigation should be visible on MLS NEXT page. Parent URL ${URL}`)
      }
    });
});

Cypress.Commands.add("validateHomePageLinkMLSNextPro", (URL) => {
  let originalWindow;
  cy.window().then((win) => {
    originalWindow = win;
  });
  cy.get(
    ".mls-o-navigation--lg > .mls-o-navigation__primary-list > .mls-o-navigation__toggle > .mls-o-navigation__button"
  ).click();
  cy.contains("MLS NEXT Pro").click({ force: true });
  cy.window().then((nextWindow) => {
    cy.wrap(nextWindow.document.body)
      .get(
        `.mls - o - navigation--lg > .mls - o - navigation__primary - list > : nth - child(1) > .mls - o - navigation__item - link`
      )
      .then(($element) => {
        if (!$element.is(':visible')) {
          throw new Error(`Home page Navigation item should be visible.URL: ${URL}`)
        }
      })
    cy.wrap(nextWindow.document.body)
      .get(
        `.mls - o - navigation--lg > .mls - o - navigation__primary - list > : nth - child(1) > .mls - o - navigation__item - link`
      )
      .then(($element) => {
        if (!$element.is(':visible')) {
          throw new Error(`Home page Navigation item should be visible.URL: ${URL}`)
        }
      })
    originalWindow.focus();
  });
});

Cypress.Commands.add("gameCarouselCheck", (URL) => {
  cy.get('[data-react="mls-horizontal-scoreboard"')
    .then(($element) => {
      if (!$element.is(':visible')) {
        throw new Error(`Horizontal scoreboard should be visible. URL: ${URL}`)
      }
      if (!$element.length > 2) {
        throw new Error(`Horizontal scoreboard should have a length greater than 2. It currently has a length of ${$element.length}. URL: ${URL}`)
      }
    })
    .find(".mls-c-horizontal-match")
});

// This command looks unfinished
Cypress.Commands.add("campeonesCupGameExists", (URL) => {
  cy.get('div[class*="mls-c-featured-match"')
    .should("be.visible")
    .find("a")
    .first()
    .invoke("attr", "href")
    .should(
      "include",
      "https://www.leaguescup.com/campeonescup/competitions/campeones-cup/2024/matches/clbvsame-09-25-2024"
    );

  cy.get('div[class*="mls-c-blockheader__title"').should("be.visible");

  cy.get('div[class*="mls-c-blockheader__subtitle"')
    .should("be.visible")
    .contains("Wednesday September 25");

  cy.get('div[class*="mls-c-match-tile"').should("be.visible");

  cy.get('img[class*="mls-c-club__picture"')
    .should("be.visible")
    .should("have.length", 2);

  cy.get(
    'div[class*="mls-c-venue-broadcaster-bar --single-broadcaster"'
  ).should("be.visible");

  cy.get('div[class*="mls-c-venue-broadcaster-bar --single-broadcaster"')
    .should("be.visible")
    .contains("Apple TV - MLS Season Pass, TUDN");

  cy.get('div[class*="mls-c-matchbutton-streamer"')
    .should("be.visible")
    .find("a")
    .invoke("attr", "href")
    .should("include", "https://www.ticketmaster.com/event");

  cy.get('div[class*="mls-c-matchbutton-streamer"')
    .find("button")
    .should("be.visible")
    .contains("Buy Tickets");
});

Cypress.Commands.add("login", (URL) => {
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
  cy.get(".mls-c-account__name")
    .invoke('text').then((text) => {
      if (!text.contains(nameValue)) {
        throw new Error(`Text should include account name. URL: ${URL}`)
      }
    })
});

Cypress.Commands.add("logout", () => {
  cy.get(".mls-c-account__logout-button").click();
  cy.contains("span", "Sign in").first()
    .then(($element) => {
      if (!$element.is(':visible')) {
        throw new Error(`Sign in span should contain the text "Sing in". URL: ${URL}`)
      }
    })
});

Cypress.Commands.add("signUp", (URL) => {
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
    .invoke('text').then((text) => {
      if (!text.includes("Standings")) {
        throw new Error(`Nav item should contain the text "Standings". URL: ${URL}`)
      }
    })
    .then(($element) => {
      if (!$element.is(':visible')) {
        throw new Error(`Nav item for "Standings" should be visible. ${URL}`)
      }
    })
});

Cypress.Commands.add("verifyLineupsElementsExistAndVisible", (URL) => {
  cy.get('div[class*="mls-o-pitch__club-logo-wrapper--home"]')
    .then(($element) => {
      if (!$element.is(':exist')) {
        throw new Error(`Club logo wrapper for home club should exist. URL: ${URL}`)
      }
      if (!$element.is(':visible')) {
        throw new Error(`Club logo wrapper for home club should be visible. URL: ${URL}`)
      }
    })
  cy.get('div[class*="mls-o-pitch__club-logo-wrapper--away"]')
    .then(($element) => {
      if (!$element.is(':exist')) {
        throw new Error(`Club logo wrapper for away club should exist. URL: ${URL}`)
      }
      if (!$element.is(':visible')) {
        throw new Error(`Club logo wrapper for away club should be visible. URL: ${URL}`)
      }
    })
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
            `.mls - o - pitch__club - formation--home.mls - o - pitch__row--${row}: nth - child(${index + 1
            })`
          ).then(($element) => {
            if (!$element.is(':exist')) {
              throw new Error(`Pitch row of ${index + 1} should exist for home formation. URL: ${URL}`)
            }
          })
        });
      } else {
        cy.log("Invalid formation:", homeFormation);
      }
    });

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
            `.mls - o - pitch__club - formation--away.mls - o - pitch__row--${row}: nth - child(${index + 1
            })`
          )
            .then(($element) => {
              if (!$element.is(':visible')) {
                throw new Error(`Pitch row of ${index + 1} should exist for away formation. URL ${URL}`)
              }
            })
        });
      } else {
        cy.log("Invalid formation:", awayFormation);
      }
    });
  cy.get('div[class*="mls-o-pitch__club-formation--home"]')
    .then(($element) => {
      if (!$element.is(':exist')) {
        throw new Error(`Home club pitch formation should exist. URL: ${URL}`)
      }
      if (!$element.is(':visible')) {
        throw new Error(`Home club pitch formation should be visible. URL: ${URL}`)
      }
    })
  cy.get('div[class*="mls-o-pitch__club-formation--away"]')
    .then(($element) => {
      if (!$element.is(':exist')) {
        throw new Error(`Away club pitch formation should exist. URL: ${URL}`)
      }
      if (!$element.is(':visible')) {
        throw new Error(`Away club pitch formation should be visible. URL: ${URL}`)
      }
    })
  cy.get('div[class*="mls-o-substitutions--home"]')
    .then(($element) => {
      if (!$element.is(':exist')) {
        throw new Error(`Home substitutions should exist. URL: ${URL}`)
      }
      if (!$element.is(':visible')) {
        throw new Error(`Home substitutions should be visible. URL: ${URL}`)
      }
    })
  cy.get('div[class*="mls-o-substitutions--away"]')
    .then(($element) => {
      if (!$element.is(':exist')) {
        throw new Error(`Away substitutions should exist. URL: ${URL}`)
      }
      if (!$element.is(':visible')) {
        throw new Error(`Away substitutions should be visible. URL: ${URL}`)
      }
    })
  cy.get('div[class*="mls-o-managers--home"]')
    .then(($element) => {
      if (!$element.is(':exist')) {
        throw new Error(`Managers for home club should exist. URL: ${URL}`)
      }
      if (!$element.is(':visible')) {
        throw new Error(`Managers for home club should be visible. URL: ${URL}`)
      }
    })
  cy.get('div[class*="mls-o-managers--away"]')
    .then(($element) => {
      if (!$element.is(':exist')) {
        throw new Error(`Managers for away club should exist. URL: ${URL}`)
      }
      if (!$element.is(':visible')) {
        throw new Error(`Managers for away club should be visible. URL: ${URL}`)
      }
    })
});

Cypress.Commands.add("buyTicketBtnCheck", (URL) => {
  let ticketProviderURL = [
    "https://www.ticketmaster.com",
    "https://www.ticketmaster.ca",
  ];
  cy.get('[data-react="mls-ticketing-block"]').then("be.visible");

  cy.get('[data-react="mls-ticketing-block"] a').should(($links) => {
    expect($links.length).to.be.greaterThan(0);
    $links.each((_, link) => {
      const isMatchingDomain = ticketProviderURL.some((domain) =>
        link.href.includes(domain)
      );
      expect(isMatchingDomain).to.be.true;
    });
  });
});

Cypress.Commands.add("ticketModelCheck", (URL) => {
  cy.get(".mls-o-ticketing-block__ticket-info").should("be.visible");
  cy.get(".mls-o-ticketing-block__club-logo")
    .then(($element) => {
      if (!$element.is(':visible')) {
        throw new Error(`Ticketing block club logo should be visible. URL: ${URL}`)
      }
      if (!$element.length == 2) {
        throw new Error(`Ticketing block club logo should have a length of 2. It shows ${$element.length}. URL: ${URL}`)
      }
    })
  cy.get(".mls-o-ticketing-block__versus")
    .then(($element) => {
      if (!$element.is(':visible')) {
        throw new Error(`Ticketing block versus should be visible. URL: ${URL}`)
      }
    })
  cy.get(".mls-o-ticketing-block__date-time")
    .then(($element) => {
      if (!$element.is(':visible')) {
        throw new Error(`Ticketing block date-time should be visible. URL: ${URL}`)
      }
    })
  cy.get(".mls-o-ticketing-block__venue")
    .then(($element) => {
      if (!$element.is(':visible')) {
        throw new Error(`Ticketing block venue should be visible. URL: ${URL}`)
      }
    })
  cy.get(".mls-o-ticketing-block__cta")
    .invoke("addClass", "--third")
    .then(($element) => {
      if (!$element.is(':visible')) {
        throw new Error(`Ticketing block cta should be visible. URL: ${URL}`)
      }
    })
    .should("have.attr", "href")
    .and(
      "match",
      /^(https?:\/\/)?[\w\.-]+(\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
    );
});

Cypress.Commands.add("preMatchHeader", (URL) => {
  cy.get('section[class*="mls-l-module--match-hub-header-container"]')
    .then(($element) => {
      if (!$element.is(':visible')) {
        throw new Error(`Match hub header container should be visible. URL: ${URL}`)
      }
    })
    .within(() => {
      cy.get(".mls-c-club__shortname")
        .invoke("addClass", "--home")
        .then(($element) => {
          if (!$element.is(':visible')) {
            throw new Error(`Club shortname should be visible. URL: ${URL}`)
          }
        })
      cy.get(".mls-c-club__shortname")
        .invoke("addClass", "--away")
        .then(($element) => {
          if (!$element.is(':visible')) {
            throw new Error(`Club shortname for away club should be visible. URL: ${URL}`)
          }
        })
      cy.get(".mls-c-venue-broadcaster-bar")
        .then(($element) => {
          if (!$element.is(':visible')) {
            throw new Error(`Venue broadcaster bar should be visible. URL: ${URL}`)
          }
        })
      cy.get(".mls-c-matchhub__resume")
        .invoke("addClass", "--home")
        .then(($element) => {
          if (!$element.is(':visible')) {
            throw new Error(`Matchub resume for home should be visible. URL: ${URL}`)
          }
        })
      cy.get(".mls-c-matchhub__resume")
        .invoke("addClass", "--away")
        .then(($element) => {
          if (!$element.is(':visible')) {
            throw new Error(`Matchub resume for away should be visible. URL: ${URL}`)
          }
        })
      cy.get(".mls-c-blockheader__subtitle")
        .then(($element) => {
          if (!$element.is(':visible')) {
            throw new Error(`Blockheader subtitle should be visible. URL: ${URL}`)
          }
        })
      cy.get(".mls-c-matchbutton-streamer")
        .then(($element) => {
          if (!$element.is(':visible')) {
            throw new Error(`Matchbutton streamer should be visible. URL: ${URL}`)
          }
        })
      cy.get(".mls-c-match-buttons")
        .children()
        .eq(1)
        .then(($element) => {
          if (!$element.is(':visible')) {
            throw new Error(`Match buttons should be visible. URL: ${URL}`)
          }
        })
        .should("have.attr", "href")
        .and(
          "match",
          /^(https?:\/\/)?[\w\.-]+(\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
        );
    });
});

Cypress.Commands.add("otherPreMatchHeader", (URL) => {
  cy.get('section[class*="mls-l-module--match-hub-header-container"]')
    .then(($element) => {
      if (!$element.is(':visible')) {
        throw new Error(`Match hub header container should be visible. URL: ${URL}`)
      }
    })
    .within(() => {
      cy.get(".mls-c-club__shortname")
        .invoke("addClass", "--home")
        .then(($element) => {
          if (!$element.is(':visible')) {
            throw new Error(`Home club shortname should be visible. URL: ${URL}`)
          }
        })
      cy.get(".mls-c-club__shortname")
        .invoke("addClass", "--away")
        .then(($element) => {
          if (!$element.is(':visible')) {
            throw new Error(`Away club shortname should be visible. URL: ${URL}`)
          }
        })
      cy.get(".mls-c-venue-broadcaster-bar")
        .then(($element) => {
          if (!$element.is(':visible')) {
            throw new Error(`Venue broadcaster bar should be visible. URL: ${URL}`)
          }
        })
      cy.get(".mls-c-blockheader__subtitle")
        .then(($element) => {
          if (!$element.is(':visible')) {
            throw new Error(`Blockheader subtitle should be visible. URL: ${URL}`)
          }
        })
    });
});

Cypress.Commands.add("preMatchHeaderCC", (URL) => {
  cy.get('section[class*="mls-l-module--match-hub-header-container"]')
    .then(($element) => {
      if (!$element.is(':visible')) {
        throw new Error(`Match hub header container should be visible. URL: ${URL}`)
      }
    })
    .within(() => {
      cy.get(".mls-c-club").invoke("addClass", "--home")
        .then(($element) => {
          if (!$element.is(':visible')) {
            throw new Error(`Home club class should be visible. URL: ${URL}`)
          }
        })
      cy.get(".mls-c-club").invoke("addClass", "--away")
        .then(($element) => {
          if (!$element.is(':visible')) {
            throw new Error(`Away class should be visible. URL: ${URL}`)
          }
        })
      cy.get(".mls-c-venue-broadcaster-bar")
        .then(($element) => {
          if (!$element.is(':visible')) {
            throw new Error(`Venue broadcaster bar should be visible. URL: ${URL}`)
          }
        })
      cy.get(".mls-c-matchhub__resume")
        .invoke("addClass", "--home")
        .then(($element) => {
          if (!$element.is(':visible')) {
            throw new Error(`Matchub resume for home club should be visible. URL: ${URL}`)
          }
        })
      cy.get(".mls-c-matchhub__resume")
        .invoke("addClass", "--away")
        .then(($element) => {
          if (!$element.is(':visible')) {
            throw new Error(`Matchhub resume for away club should be visible. URL: ${URL}`)
          }
        })
      cy.get(".mls-c-blockheader__subtitle")
        .then(($element) => {
          if (!$element.is(':visible')) {
            throw new Error(`Blockheader subtitle should be visible. URL: ${URL}`)
          }
        })
      cy.get('div[class*="mls-c-venue-broadcaster-bar"]')
        .then(($element) => {
          if (!$element.is(':visible')) {
            throw new Error(`Blockheader subtitle should be visible. URL: ${URL}`)
          }
        })
        .then(($element) => {
          const text = $element.text().trim();

          if (text.includes("Apple TV")) {
            cy.get('button[class*="mls-c-matchbutton__apple"]')
              .then(($element) => {
                if (!$element.is(':visible')) {
                  throw new Error(`Blockheader subtitle should be visible. URL: ${URL}`)
                }
              })
          } else if (text.includes("MLSNEXTPro.com")) {
            cy.get(
              'div[class*="mls-c-venue-broadcaster-bar --single-broadcaster"]'
            )
              .then(($element) => {
                if (!$element.is(':visible')) {
                  throw new Error(`Blockheader subtitle should be visible. URL: ${URL}`)
                }
              })
              .should("contain", "MLSNEXTPro.com");
          } else {
            throw new Error(
              `Neither "Apple TV" or "MLSNEXTPro.com" found in the broadcaster section: "${text}"`
            );
          }
        });
    });
});

// Duplicate that shouldn't be league specific
Cypress.Commands.add("nextProPreMatchHeader", (URL) => {
  cy.get('section[class*="mls-l-module--match-hub-header-container"]')
    .then(($element) => {
      if (!$element.is(':visible')) {
        throw new Error(`Match hub header container should be visible. URL: ${URL}`)
      }
    })
    .within(() => {
      cy.get(".mls-c-club").invoke("addClass", "--home")
        .then(($element) => {
          if (!$element.is(':visible')) {
            throw new Error(`Match hub Home class should be visible. URL: ${URL}`)
          }
        })
      cy.get(".mls-c-club").invoke("addClass", "--away")
        .then(($element) => {
          if (!$element.is(':visible')) {
            throw new Error(`Match hub Away class should be visible. URL: ${URL}`)
          }
        })
      cy.get(".mls-c-venue-broadcaster-bar")
        .then(($element) => {
          if (!$element.is(':visible')) {
            throw new Error(`Venue broadcaster bar should be visible. URL: ${URL}`)
          }
        })
      cy.get(".mls-c-matchhub__resume")
        .invoke("addClass", "--home")
        .then(($element) => {
          if (!$element.is(':visible')) {
            throw new Error(`Match hub resume for home team should be visible. URL: ${URL}`)
          }
        })
      cy.get(".mls-c-matchhub__resume")
        .invoke("addClass", "--away")
        .then(($element) => {
          if (!$element.is(':visible')) {
            throw new Error(`Match hub resume for away team should be visible. URL: ${URL}`)
          }
        })
      cy.get(".mls-c-blockheader__subtitle")
        .then(($element) => {
          if (!$element.is(':visible')) {
            throw new Error(`Blockheader subtitle should be visible. URL: ${URL}`)
          }
        })
      cy.get('div[class*="mls-c-venue-broadcaster-bar --single-broadcaster"]')
        .then(($element) => {
          if (!$element.is(':visible')) {
            throw new Error(`Venue broadcaster bar (Single broadcaster) should be visible. URL: ${URL}`)
          }
        })
        .then(($element) => {
          const text = $element.text().trim();

          if (text.includes("Apple TV")) {
            cy.get('button[class*="mls-c-matchbutton__apple"]')
              .should(($element) => {
                expect($element, `Apple button should be visible. URL: ${URL}`).to.be.visible
              })
          } else if (text.includes("MLSNEXTPro.com")) {
            cy.get(
              'div[class*="mls-c-venue-broadcaster-bar --single-broadcaster"]'
            )
              .then(($element) => {
                if (!$element.is(':visible')) {
                  throw new Error(`Broadcaster bar should be visible. URL: ${URL}`)
                }
              })
              .should("contain", "MLSNEXTPro.com");
          } else {
            throw new Error(
              `Neither "Apple TV" or "MLSNEXTPro.com" found in the broadcaster section: "${text}"`
            );
          }
        });
    });
});

Cypress.Commands.add("nextProPreMatchHeaderNull", (URL) => {
  cy.get('section[class*="mls-l-module--match-hub-header-container"]')
    .then(($element) => {
      if (!$element.is(':visible')) {
        throw new Error(`Match hub header container should be visible. URL: ${URL}`)
      }
    })
    .within(() => {
      cy.get(".mls-c-club").invoke("addClass", "--home")
        .then(($element) => {
          if (!$element.is(':visible')) {
            throw new Error(`Class for home team on pre match page should be visible. URL: ${URL}`)
          }
        })
      cy.get(".mls-c-club").invoke("addClass", "--away")
        .then(($element) => {
          if (!$element.is(':visible')) {
            throw new Error(`Class for away team on pre match page should be visible. URL: ${URL}`)
          }
        })
      cy.get(".mls-c-venue-broadcaster-bar")
        .then(($element) => {
          if (!$element.is(':visible')) {
            throw new Error(`Venue broadcaster bar should be visible. URL: ${URL}`)
          }
        })
      cy.get(".mls-c-matchhub__resume")
        .invoke("addClass", "--home")
        .then(($element) => {
          if (!$element.is(':visible')) {
            throw new Error(`Matchhub resume for home team should be visible. URL: ${URL}`)
          }
        })
      cy.get(".mls-c-matchhub__resume")
        .invoke("addClass", "--away")
        .then(($element) => {
          if (!$element.is(':visible')) {
            throw new Error(`Matchhub resume for away team should be visible. URL: ${URL}`)
          }
        })
      cy.get(".mls-c-blockheader__subtitle")
        .then(($element) => {
          if (!$element.is(':visible')) {
            throw new Error(`Block header subtitle should be visible. URL: ${URL}`)
          }
        })
    });
});

Cypress.Commands.add("postMatchHeader", (URL) => {
  cy.get('section[class*="mls-l-module--match-hub-header-container"]')
    .then(($element) => {
      if (!$element.is(':visible')) {
        throw new Error(`Match hub header container should be visible. URL: ${URL}`)
      }
    })
    .within(() => {
      cy.get(".mls-c-club__shortname")
        .invoke("addClass", "--home")
        .then(($element) => {
          if (!$element.is(':visible')) {
            throw new Error(`Club shortname for home club should be visible. URL: ${URL}`)
          }
        })
      cy.get(".mls-c-club__shortname")
        .invoke("addClass", "--away")
        .then(($element) => {
          if (!$element.is(':visible')) {
            throw new Error(`Club shortname for away club should be visible. URL: ${URL}`)
          }
        })
      cy.get(".mls-c-matchhub__resume")
        .invoke("addClass", "--home")
        .then(($element) => {
          if (!$element.is(':visible')) {
            throw new Error(`Match hub resume for home club should be visible. URL: ${URL}`)
          }
        })
      cy.get(".mls-c-matchhub__resume")
        .invoke("addClass", "--away")
        .then(($element) => {
          if (!$element.is(':visible')) {
            throw new Error(`Match hub resume for away club should be visible. URL: ${URL}`)
          }
        })
      cy.get(".mls-c-scorebug__post")
        .then(($element) => {
          if (!$element.is(':visible')) {
            throw new Error(`Scorebug post should be visible. URL: ${URL}`)
          }
        })
      cy.get('div[class*="mls-c-status-stamp__status -post"]')
        .then(($element) => {
          if (!$element.is(':visible')) {
            throw new Error(`"Post" status stamp should be visible. URL: ${URL}`)
          }
        })
        .invoke('text').then((text) => {
          if (!text.contains("Final")) {
            throw new Error(`Post match status stamp should include the text "Final". URL ${URL}`)
          }
        })
      cy.get(".mls-c-blockheader__subtitle")
        .then(($element) => {
          if (!$element.is(':visible')) {
            throw new Error(`Blockheader subtitle should be visible. URL: ${URL}`)
          }
        })
      cy.get(".mls-c-matchbutton")
        .then(($element) => {
          if (!$element.is(':visible')) {
            throw new Error(`Matchbutton should be visible. URL: ${URL}`)
          }
        })
    });
});

Cypress.Commands.add("otherPostMatchHeader", (URL) => {
  cy.get('section[class*="mls-l-module--match-hub-header-container"]')
    .then(($element) => {
      if (!$element.is(':visible')) {
        throw new Error(`Matchbutton should be visible. URL: ${URL}`)
      }
    })
    .within(() => {
      cy.get(".mls-c-club__shortname")
        .invoke("addClass", "--home")
        .then(($element) => {
          if (!$element.is(':visible')) {
            throw new Error(`Club shortname for home club should be visible. URL: ${URL}`)
          }
        })
      cy.get(".mls-c-club__shortname")
        .invoke("addClass", "--away")
        .then(($element) => {
          if (!$element.is(':visible')) {
            throw new Error(`Club shortname for away club should be visible. URL: ${URL}`)
          }
        })
      cy.get(".mls-c-scorebug__post")
        .then(($element) => {
          if (!$element.is(':visible')) {
            throw new Error(`Scorebug should be visible. URL: ${URL}`)
          }
        })
      cy.get('div[class*="mls-c-status-stamp__status -post"]')
        .then(($element) => {
          if (!$element.is(':visible')) {
            throw new Error(`"Post" stamp status should be visible. URL: ${URL}`)
          }
        })
        .invoke('text').then((text) => {
          expect(text, `Post match status stamp should include the text "Final". URL ${URL}`).contains("Final")
        })
      cy.get(".mls-c-blockheader__subtitle")
        .then(($element) => {
          if (!$element.is(':visible')) {
            throw new Error(`Blockheader subtitle should be visible. URL: ${URL}`)
          }
        })
    });
});

Cypress.Commands.add("carouselCheck", (URL) => {
  cy.get('[data-react="mls-match-hub-content-carousel"]')
    .find(".fo-carousel__slide" || ".-customentity" || ".-brightcovevideo")
    .then(($el) => {
      if (!$el.is(':visible')) {
        throw new Error(`Match hub carousel should be visible. URL ${URL}`)
      }
    })
});

Cypress.Commands.add("rightHandScoreboardCheck", (URL) => {
  cy.get('div[class*="mls-c-vertical-scoreboard__matches"]')
    .find("div")
    .filter('[class*="mls-c-vertical-match"]')
    .then(($element) => {
      if (!$element.length > 1) {
        throw new Error(`Vertical scoreboard should have a lenth greater than 1. It currently shows ${$element.length}. URL: ${URL}`)
      }
    })
});

Cypress.Commands.add("matchDetail", (URL) => {
  cy.get(".mls-o-previous-matches__versus-data")
    .eq(0)
    .then(($element) => {
      if ($element.is(':visible')) {
        throw new Error(`First previous versus matches data should be visible. URL: ${URL}`)
      }
      if ($element.is(':visible')) {
        throw new Error(`First previous versus matches data should not be empty. URL: ${URL}`)
      }
    })
    .invoke("text")
    .then((text) => {
      const numberValue = parseFloat(text);
      expect(numberValue, `Data from previous matches data should be a number. URL: ${URL}`).to.be.a("number").and.not.NaN;
    });
  cy.get(".mls-o-previous-matches__versus-data")
    .eq(1)
    .then(($element) => {
      if (!$element.is(':visible')) {
        throw new Error(`Second previous versus matches data should be visible. URL: ${URL}`)
      }
    })
    .should("not.be.empty")
    .invoke("text")
    .then((text) => {
      const numberValue = parseFloat(text);
      expect(numberValue, `Data from previous matches data should be a number. URL: ${URL}`).to.be.a("number").and.not.NaN;
    });
  cy.get(".mls-o-previous-matches__versus-data")
    .eq(2)
    .then(($element) => {
      if (!$element.is(':visible')) {
        throw new Error(``)
      }
    })
    .should("not.be.empty")
    .invoke("text")
    .then((text) => {
      const numberValue = parseFloat(text);
      expect(numberValue, `Data from previous matches data should be a number. URL: ${URL}`).to.be.a("number").and.not.NaN;
    });
});

Cypress.Commands.add("lastThreeMatches", (URL) => {
  const isValidScore = (scoreString) => {
    cy.wait(2000);
    const scores = scoreString.split(":");
    return (
      scores.length === 2 && scores.every((score) => !isNaN(parseFloat(score)))
    );
  };

  cy.get(".mls-l-module.mls-l-module--previous-matches")
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Previous matches module should be visible. URL: ${URL}`)
      }
    })
    .find(".mls-o-match-strip.mls-o-match-strip--post")
    .each((match, index) => {
      cy.wrap(match)
        .then(($element) => {
          if (!$element.is(":visible")) {
            throw new Error(`Match strip --post should be visible. URL: ${URL}`)
          }
        })
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
      expect(
        matches.length,
        'There should be 3 matches found in "Last 3 matches" section'
      ).to.equal(3);
    });
});

Cypress.Commands.add("commentaryListCheck", (URL) => {
  cy.get('section[class*="mls-l-module--match-feed"]')
    .should("be.visible")
    .find("div")
    .filter('[class*="mls-o-match-feed__commentary"]')
    .then(($listOfElements) => {
      if (!$listOfElements.length > 1) {
        throw new Error(`Match Feed should have a length greater than 1. It shows ${$listOfElements.length}.URL: ${URL} `)
      }
    });
});

Cypress.Commands.add("matchStatsCheck", (URL) => {
  cy.get(".mls-o-stats-comparison__header")
    .then(($element) => {
      if (!$element.is(':visible')) {
        throw new Error(`Comparison should be visible.URL: ${URL} `)
      }
    })
    .invoke('text').then((text) => {
      expect(text, `Comparison Header should include Stats.URL: ${URL} `).contains("Stats");
    });
  cy.get(".mls-o-stats-comparison__club-logo")
    .then(($element) => {
      if (!$element.is(':visible')) {
        throw new Error(`Club logo should be visible. URL: ${URL} `)
      }
    })
    .then(($listOfElements) => {
      if (!$listOfElements.length == 2) {
        throw new Error(`There should be 2 Comparison Club Logo.There is currently ${$listOfElements.length}. URL: ${URL}`)
      }
    });
  cy.get(".mls-o-stats-comparison__club-short-name")
    .then(($element) => {
      if ($element.is(':visible')) {
        throw new Error(`Club short name should be visible. URL ${URL}`)
      }
    })
    .then(($listOfElements) => {
      if ($listOfElements.length == 2) {
        throw new Error(`stats - comparison__club - short - name should have a length of 2. It is showing ${$listOfElements.length}.URL: ${URL} `)
      }
    });
  cy.get(".mls-o-stats-comparison__chart-group--general").should("be.visible");
});

Cypress.Commands.add("matchFactsCheck", (URL) => {
  cy.get(".mls-o-match-facts__header")
    .then(($element) => {
      if ($element.is(":visible")) {
        throw new Error(`Match facts header should be visible. URL: ${URL}`)
      }
    })
    .invoke('text').then((text) => {
      expect(text, `Facts header should contain "Match Facts." URL: ${URL} `).contains("Match Facts")
    });
  cy.get(".mls-o-match-facts__value").each(($span) => {
    cy.wrap($span)
      .then(($element) => {
        if (!$element.is(":visible")) {
          throw new Error(`Match facts value should be visible.URL: ${URL} `)
        }
      })
      .invoke("text").then((text) => {
        expect(text, `Contents in match facts should not be empty.URL: ${URL} `).to.not.be.empty
      });
  });
});

Cypress.Commands.add("liveMatchFactsCheck", (URL) => {
  cy.get('div[class*="mls-o-match-facts__header"]')
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Match facts header should exist.URL: ${URL} `)
      }
    })
  cy.get('span[class*="oc-o-icon--stadium"]')
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Stadium icon should be visible.URL: ${URL} `)
      }
    })
  cy.get('span[class*="mls-o-match-facts__label"]')
    .contains("Stadium")
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Stadium label should be visible.URL: ${URL} `)
      }
    })
  cy.get('span[class*="oc-o-icon--city"]')
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`City icon should be visible.URL: ${URL} `)
      }
    })
  cy.get('span[class*="mls-o-match-facts__label"]')
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Location label should be visible.URL: ${URL} `)
      }
    })
    .invoke('text').then((text) => {
      expect(text, `Location label should include "Location:".URL: ${URL} `).contains("Location:");
    })
  cy.get('span[class*="oc-o-icon--official"]')
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Whistle official icon should be visible.URL: ${URL} `)
      }
    })
  cy.get('span[class*="mls-o-match-facts__label"]')
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Referee label should be visible.URL: ${URL} `)
      }
    })
    .invoke('text').then((text) => {
      expect(text, `Referee label should include "Referee:".URL: ${URL} `).contains("Referee:");
    })
  cy.get('span[class*="mls-o-match-facts__label"]')
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Asst.Ref 1 Label should be visible.URL: ${URL} `)
      }
    })
    .invoke('text').then((text) => {
      expect(text, `Asst.Ref 1 label should include "Asst. Referee 1:".URL: ${URL} `).contains("Asst. Referee 1:");
    })
  cy.get('span[class*="mls-o-match-facts__label"]')
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Asst.Ref 2 Label should be visible.URL: ${URL} `)
      }
    })
    .invoke('text').then((text) => {
      expect(text, `Referee label should include "Asst. Referee 2:".URL: ${URL} `).contains("Asst. Referee 2:");
    })
  cy.get('span[class*="mls-o-match-facts__label"]')
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Fourth Official label should be visible.URL: ${URL} `)
      }
    })
    .invoke('text').then((text) => {
      expect(text, `Referee label should include "Fourth official:".URL: ${URL} `).contains("Fourth official:");
    })
});

Cypress.Commands.add("validateCalender", (URL) => {
  cy.get(`div[aria-label='Date selector']`).click();
  cy.get('div[class*="mls-o-calendar"]').should(($element) => {
    expect($element, `Calendar should be visible. URL: ${URL}`).to.be.visible;
  });
  cy.get(`div[aria-label='Date selector']`).click();
  cy.get(`button[aria-label='Previous results']`).click();
  cy.get(`div[aria - label= 'Date selector']`).click();
  cy.get('div[class*="mls-o-calendar"]')
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Calendar should be visible.URL: ${URL} `)
      }
    })
  cy.get(`div[aria - label= 'Date selector']`).click();
  cy.get(`button[aria - label= 'Previous results']`).click();
  cy.wait(2000);
  cy.get(`button[aria - label= 'Next results']`).click();
  cy.wait(2000);
  cy.get(`button[class*= 'mls-o-buttons__icon--left']`).click();
  cy.wait(2000);
  cy.get(`button[class*= 'mls-o-buttons__icon--right']`).click();
  cy.wait(2000);
});

Cypress.Commands.add("validateCompetitionsDropdown", (allCompetitions, URL) => {
  cy.get('select[class*="mls-o-buttons__dropdown-button"]')
    .eq(0)
    .as("competitionsDropDown")
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Competition drop down should be visible.URL: ${URL} `)
      }
    })
  cy.get("@competitionsDropDown")
    .find("option")
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Competition dropdown options should have options.URLS: ${URL} `)
      }
    })
    .as("competitionsDropDown");

  allCompetitions.forEach((competition) => {
    cy.get("@competitionsDropDown")
      .contains("option", competition)
      .then(($element) => {
        if (!$element.is(":visible")) {
          throw new Error(`Competition dropdown options for competition ${competition} should exist.URLS: ${URL} `)
        }
      })
      .then(() => {
        cy.log(`Verified club: ${competition} `);
      })
      .should("exist")
      .then(() => {
        cy.log(`Verified club: ${competition} `);
      });
  });
});

Cypress.Commands.add("validateClubsDropdown", (allClubs, URL) => {
  cy.get('select[class*="mls-o-buttons__dropdown-button--right"]')
    .eq(1)
    .as("clubsDropDown")
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Clubs dropdown options should be visible.URLS: ${URL} `)
      }
    })
  cy.get("@clubsDropDown")
    .find("option")
    .then(($element) => {
      if (!$element.length > 0) {
        throw new Error(`Clubs dropdown should have options.URLS: ${URL} `)
      }
    })
    .as("clubsDropDown");

  allClubs.forEach((club) => {
    cy.get("@clubsDropDown")
      .invoke("text")
      .then((text) => {
        expect(text).contains("options", club);
      })
      .then(($element) => {
        if (!$element.is(":visible")) {
          throw new Error(`Clubs dropdown for ${club} should exist.URLS: ${URL} `)
        }
      })
      .then(() => {
        cy.log(`Verified club: ${club} `);
      });
    cy.get("@clubsDropDown")
      .invoke("text")
      .then((text) => {
        expect(text, `Clubs dropdown should contain "option" and ${club}. URL: ${URL}`).contains("option", club);
      })
      .then(($element) => {
        if (!$element.is(":exist")) {
          throw new Error(`Clubs dropdown options for ${club} should exist.URLS: ${URL} `)
        }
      })
      .then(() => {
        cy.log(`Verified club: ${club} `);
      });
  });
});

Cypress.Commands.add("validateClubsDropdownLC", (allClubs, URL) => {
  cy.get('select[class*="mls-o-buttons__dropdown-button--right"]')
    .as("clubsDropDown")
    .find("option")
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Clubs dropdown should have length of ${allClubs.length}. It shows ${$element.length}.URL: ${URL} `)
      }
    })

  allClubs.forEach((club) => {
    cy.get("@clubsDropDown")
      .invoke("text")
      .then((text) => {
        expect(text).contains("option", club);
      })
      .should(($element) => {
        expect($element, `Clubs dropdown for ${club} should exist.URLS: ${URL} `).to.exist
      })
  });
});

// TODO: Validate that the descriptions for this are correct
Cypress.Commands.add("validateLiveMatchBanner", (URL) => {
  cy.get('section[class*="mls-l-module--match-hub-header-container"]')
    .then(($element) => {
      if (!$element.is(':visible')) {
        throw new Error(`Match hub header container should be visible.URL: ${URL} `)
      }
    })
    .within(() => {
      cy.get('img[alt="background"]')
        .then(($element) => {
          if (!$element.is(":visible")) {
            throw new Error(`Background image should be visible.URL: ${URL} `)
          }
        })
        .should(($element) => {
          expect($element, `Background image should be visible.URL: ${URL} `).to.be.visible
        })
      cy.get('div[class*="mls-c-matchhub__header"]')
        .then(($element) => {
          if (!$element.is(":visible")) {
            throw new Error(`Match hub header should be visible.URL: ${URL} `)
          }
        })
      cy.get('div[class*="mls-c-status-stamp__status -live"]')
        .then(($element) => {
          if (!$element.is(":visible")) {
            throw new Error(`Live stamp status should be visible.URL: ${URL} `)
          }
        })
      cy.get('div[class*="mls-c-matchhub-tile --live"]')
        .then(($element) => {
          if (!$element.is(":visible")) {
            throw new Error(`Live match hub tile should be visible.URL: ${URL} `)
          }
        })
      cy.get('div[class*="mls-c-club --home"]')
        .then(($element) => {
          if (!$element.is(":visible")) {
            throw new Error(`Club home should be visible.URL: ${URL} `)
          }
        })
      cy.get('div[class*="mls-c-club --away"]')
        .then(($element) => {
          if (!$element.is(":visible")) {
            throw new Error(`Club away should be visible.URL: ${URL} `)
          }
        })
      cy.get('div[class*="mls-c-scorebug__goal"]')
        .then(($element) => {
          if (!$element.is(":visible")) {
            throw new Error(`Scorebug goal should be visible.URL: ${URL} `)
          }
        })
      cy.get('div[class*="mls-c-match-buttons --live"]')
        .then(($element) => {
          if (!$element.is(":visible")) {
            throw new Error(`Live match buttons should be live.URL: ${URL} `)
          }
        })
    });
});

// TODO: Remove this duplicate
Cypress.Commands.add("validateLiveNextProMatchBanner", (URL) => {
  cy.get('section[class*="mls-l-module--match-hub-header-container"]')
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Match hub header container should be visible. URL: ${URL}`)
      }
    })
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

Cypress.Commands.add("liveMatchStatsCheck", (URL) => {
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
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Stats comparison should be visible.URL: ${URL} `)
      }
    })
    .within(() => {
      expectedStats.forEach((headerValue) => {
        cy.get('div[class*="mls-o-stat-chart__header"]')
          .then(($element) => {
            if (!$element.is(":visible")) {
              throw new Error(`Stat chart header should be visible.URL: ${URL} `)
            }
          })
          .invoke('text').then((text) => {
            if (!text.contains(headerValue)) {
              throw new Error(`Stat chart header should contain ${headerValue}.URL: ${URL} `)
            }
          })
      });
    });
  cy.get('div[class*="mls-o-stat-chart__first-value"]').each(($div) => {
    const textContent = $div.text().trim();
    const numberValue = parseFloat(textContent);
    expect(
      numberValue,
      `Stat chart's first value should be a number. URL: ${URL}`
    ).to.be.a("number").and.not.NaN;
  });
  cy.get('div[class*="mls-o-stat-chart__second-value"]').each(($div) => {
    const textContent = $div.text().trim();
    const numberValue = parseFloat(textContent);
    expect(
      numberValue,
      `Stat chart's second value should be a number. URL: ${URL}`
    ).to.be.a("number").and.not.NaN;
  });
});

Cypress.Commands.add("liveMatchStatsCheckNP", (URL) => {
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

  cy.get('div[class*="mls-o-stats-comparison mls-o-stats-comparison--general"]')
    .should(($element) => {
      expect(
        $element,
        `Live match stats comparison should be visible. URL: ${URL}`
      ).to.be.visible;
    })
    .within(() => {
      expectedStats.forEach((headerValue) => {
        cy.get('div[class*="mls-o-stat-chart__header"]')
          .then(($element) => {
            if (!$element.is(':visible')) {
              throw new Error(`Stat chart header with value ${headerValue} should be visible. URL: ${URL}`)
            }
          })
          .invoke("text")
          .then((text) => {
            expect(
              text,
              `Header should include ${headerValue} in the text. URL: ${URL}`
            ).contains(headerValue);
          });
      });
    });
  cy.get('div[class*="mls-o-stat-chart__first-value"]').each(($div) => {
    const textContent = $div.text().trim();
    const numberValue = parseFloat(textContent);
    expect(
      numberValue,
      `Stat chart's first value for a div should be a number. URL: ${URL}`
    ).to.be.a("number").and.not.NaN;
  });
  cy.get('div[class*="mls-o-stat-chart__second-value"]').each(($div) => {
    const textContent = $div.text().trim();
    const numberValue = parseFloat(textContent);
    expect(
      numberValue,
      `Stat chart's second value for a div should be a number. URL: ${URL}`
    ).to.be.a("number").and.not.NaN;
  });
});

Cypress.Commands.add("liveMatchShootingBreakdownStatsCheck", (URL) => {
  const expectedShootingBreakdown = [
    "Goals",
    "On Target",
    "Off Target",
    "Blocked",
  ];

  cy.get('section[class*="mls-l-module--shooting-breakdown"]')
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Shooting breakdown should be visible. URL: ${URL}`)
      }
    })
  cy.get('div[class*="mls-o-shooting-breakdown__club-group"]')
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Shooting breakdown club group should be visible. URL: ${URL}`)
      }
    })
  cy.get('div[class*="mls-o-shooting-breakdown__club--home"]')
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Shooting breakdown for home club should be visible. URL: ${URL}`)
      }
    })
  cy.get('div[class*="mls-o-shooting-breakdown__club--away"]')
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Shooting breakdown for away club should be visible. URL: ${URL}`)
      }
    })
  cy.get('div[class*="mls-o-shooting-breakdown__chart-group"]')
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Shooting breakdown chart group should be visible. URL: ${URL}`)
      }
    })
    .within(() => {
      expectedShootingBreakdown.forEach((headerValue) => {
        cy.get('div[class*="mls-o-stat-chart__header"]')
          .then(($element) => {
            if (!$element.is(":visible")) {
              throw new Error(`Stat chart header should be visible. URL: ${URL}`)
            }
          })
          .invoke("text")
          .then((text) => {
            expect(
              text,
              `Stat chart header should include ${headerValue}. URL: ${URL}`
            ).contains(headerValue);
          });
      });
    });
});

Cypress.Commands.add("liveMatchPassingBreakdownStatsCheck", (URL) => {
  const expectedPassingBreakdown = [
    "Overall %",
    "Open Play Pass %",
    "Set Piece Cross %",
    "Open Play Cross %",
  ];

  cy.get('section[class*="mls-l-module--passing-breakdown"]')
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Passing breakdown should be visible. URL: ${URL}`)
      }
    })
  cy.get('div[class*="mls-o-passing-breakdown__club-group"]')
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Passing breakdown club group should be visible. URL: ${URL}`)
      }
    })
  cy.get('div[class*="mls-o-passing-breakdown__club--home"]')
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Passing breakdown for home club should be visible. URL: ${URL}`)
      }
    })
  cy.get('div[class*="mls-o-passing-breakdown__club--away"]')
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Passing breakdown for away club should be visible. URL: ${URL}`)
      }
    })
  cy.get('div[class*="mls-o-passing-breakdown__chart-group"]')
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Passing breakdown chart group should be visible. URL: ${URL}`)
      }
    })
    .within(() => {
      expectedPassingBreakdown.forEach((headerValue) => {
        cy.get('div[class*="mls-o-stat-chart__header"]')
          .then(($element) => {
            if (!$element.is(":visible")) {
              throw new Error(`Stat chart header for ${headerValue} should be visible. URL: ${URL}`)
            }
          })
          .invoke("text")
          .then((text) => {
            expect(
              text,
              `Stat chart header should contain ${headerValue}. URL: ${URL}`
            ).contains(headerValue);
          });
      });
    });
});

Cypress.Commands.add("liveMatchExpectedGoalsStatsCheck", (URL) => {
  const expectedGoalsStats = ["Total Team XG", "Shots", "Shots On Target"];

  cy.get('section[class*="mls-l-module--expected-goals"]')
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Expected goals should be visible. URL: ${URL}`)
      }
    })
  cy.get('div[class*="mls-o-expected-goals__club-group"]')
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Expected goals club group should be visible. URL: ${URL}`)
      }
    })
  cy.get('div[class*="mls-o-expected-goals__club--home"]')
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Expected goals for home club should be visible. URL: ${URL}`)
      }
    })
  cy.get('div[class*="mls-o-expected-goals__club--away"]')
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Expected goals for away club should be visible. URL: ${URL}`)
      }
    })
  cy.get('div[class*="mls-o-expected-goals__chart-group"]')
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Expected goals chart group should be visible. URL: ${URL}`)
      }
    })
    .within(() => {
      expectedGoalsStats.forEach((headerValue) => {
        cy.get('div[class*="mls-o-stat-chart__header"]')
          .then(($element) => {
            if (!$element.is(":visible")) {
              throw new Error(`Stat chart header for ${headerValue} should be visible. URL: ${URL}`)
            }
          })
          .invoke("text")
          .then((text) => {
            expect(
              text,
              `Stat chart header should contain ${headerValue}. URL: ${URL}`
            ).contains(headerValue);
          });
      });
    });
});

Cypress.Commands.add("liveMatchPossessionStatsCheck", (URL) => {
  cy.get('section[class*="mls-l-module--possession"]')
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Possession module should be visible. URL: ${URL}`)
      }
    })
  cy.get('div[class*="mls-o-possession__header"]')
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Posession module header should be visible. URL: ${URL}`)
      }
    })
  cy.get('div[class*="mls-o-possession__total"]')
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Posession total should be visible. URL: ${URL}`)
      }
    })
  cy.get('div[class*="mls-o-possession__clubs"]')
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Posession by clubs should be visible. URL: ${URL}`)
      }
    })
  cy.get('div[class*="mls-o-possession__club--home"]')
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Posession for home club should be visible. URL: ${URL}`)
      }
    })
  cy.get('div[class*="mls-o-possession__club--away"]')
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Posession for away club should be visible. URL: ${URL}`)
      }
    })
  cy.get('div[class*="mls-o-possession__average"]')
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Posession average should be visible. URL: ${URL}`)
      }
    })
  cy.get('div[class*="mls-o-possession__average--percentage-home"]')
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Posession average for home club should be visible. URL: ${URL}`)
      }
    })
  cy.get('div[class*="mls-o-possession__average--percentage-away"]')
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Posession percentage for away club should be visible. URL: ${URL}`)
      }
    })
  cy.get('div[class*="mls-o-possession__intervals"]')
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Posession intervals should be visible. URL: ${URL}`)
      }
    })
  cy.get('div[class*="mls-o-possession__divider"]')
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Posession divider should be visible. URL: ${URL}`)
      }
    })
});

Cypress.Commands.add("liveMatchPlayersStatsCheck", (URL) => {
  cy.get(`button[aria-label='Players']`).click();
  cy.get('div[class*="mls-c-stats--match-hub-player-stats"]')
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Match hub player stats should be visible. URL: ${URL}`)
      }
    })
  cy.get('div[class*="mls-c-stats__table"]')
    .eq(0)
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Match hub stats table should be visible. URL: ${URL}`)
      }
    })
  cy.get('div[class*="mls-c-stats__table"]')
    .eq(1)
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Match hub stats table should be visible. URL: ${URL}`)
      }
    })
  cy.get('table[class*="match-hub-player-stats"]')
    .eq(0)
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Match hub player stats should be visible. URL: ${URL}`)
      }
    })
  cy.get('table[class*="match-hub-player-stats"]')
    .eq(1)
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Match hub player stats should be visible. URL: ${URL}`)
      }
    })
  cy.get('thead[class*="mls-o-table__header"]')
    .eq(1)
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Match hub table header should be visible. URL: ${URL}`)
      }
    })
  cy.get('thead[class*="mls-o-table__header"]')
    .eq(0)
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Match hub table header should be visible. URL: ${URL}`)
      }
    })
  cy.get('tbody[class*="mls-o-table__body"]')
    .eq(1)
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Player stats table body should be visible. URL: ${URL}`)
      }
    })
  cy.get('tbody[class*="mls-o-table__body"]')
    .eq(0)
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Player stats table body should be visible. URL: ${URL}`)
      }
    })
  cy.get('div[class*="short-name"]').each(($div) => {
    const textContent = $div.text().trim();
    expect(
      textContent,
      `Live match player stats short name should be a string. URL: ${URL}`
    ).to.be.a("string").and.not.NaN;
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
      expect(
        numberValue,
        `${className} should be a number. URL: ${URL}`
      ).to.be.a("number").and.not.NaN;
    });
  });
});

Cypress.Commands.add("validateMatchFeeds", (URL) => {
  for (let i = 0; i < 2; i++) {
    cy.window().then((win) => {
      const scrollHeight = win.document.documentElement.scrollHeight;
      const viewportHeight = win.innerHeight;
      const scrollPosition = scrollHeight - viewportHeight - 300;

      cy.scrollTo(0, scrollPosition, { duration: 1000 });
    });

    cy.wait(3000);
  }
  cy.get('div[class*="mls-o-match-feed"]')
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Match feed should be visible. URL: ${URL}`)
      }
    })
  cy.get('div[class*="mls-o-match-feed__title"]')
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Match feed title should be visible. URL: ${URL}`)
      }
    })
    .invoke("text")
    .then((text) => {
      expect(text, `should contain "Full Time." URL: ${URL}`).contains(
        "Full Time"
      );
    });
  cy.get('div[class*="mls-o-match-feed__title"]')
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Match feed title should be visible. URL: ${URL}`)
      }
    })
    .invoke("text")
    .then((text) => {
      expect(text, `should contain "End Of Second Half" URL: ${URL}`)
        .contains(
          "End Of Second Half"
        );
    });
  cy.get('div[class*="mls-o-match-feed__title"]')
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Match feed title should be visible. URL: ${URL}`)
      }
    })
    .invoke("text")
    .then((text) => {
      expect(text, `should contain "Half Time" URL: ${URL}`).contains("");
    });
  cy.get('div[class*="mls-o-match-feed__title"]')
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Match feed title should be visible. URL: ${URL}`)
      }
    })
    .invoke("text")
    .then((text) => {
      expect(text, `should contain "Kick Off" URL: ${URL}`).contains(
        "Kick Off"
      );
    });
});

Cypress.Commands.add("validateClubsDetails", (expectedClubsFullNames, URL) => {
  cy.get('button[class*="mls-o-navigation__button"]').eq(0).click();
  cy.get('a[href="/clubs/index"]').eq(0).click();
  cy.get('div[class*="mls-o-clubs-hub-clubs-list__club-name"]')
    .should(($element) => {
      expect(
        $element,
        `Club names list should have length of 29. URL: ${URL}`
      ).to.have.length.greaterThan(29);
    })
    .each(($div) => {
      cy.wrap($div)
        .find("span")
        .first()
        .invoke("text")
        .then((text) => {
          const isTextPresent = expectedClubsFullNames.includes(text.trim());
          cy.log(text.trim(), "is a valid club name");
          expect(
            isTextPresent,
            `Clubs full names should be present. URLS ${URL}`
          ).to.be.true;
        });

      cy.wrap($div)
        .nextAll("div")
        .find("a")
        .should(($element) => {
          expect(
            $element,
            `Club details should have length greater than or equal to 3. URL: ${URL}`
          ).to.have.length.greaterThan(2);
        })
        .each(($a) => {
          const clubLink = $a.prop("href");
          expect(
            clubLink,
            `Club link should not be "undefined". URL: ${URL}`
          ).to.not.include("undefined");
          cy.request({
            url: clubLink,
            failOnStatusCode: false,
          }).then((response) => {
            expect(
              response.status,
              `Response to request should not be "404." ${URL}`
            ).to.not.eq(404);
          });
        });
    });
});

Cypress.Commands.add("postMatchVideoCheck", (URL) => {
  cy.get("section.mls-addons-editorial-list .d3-l-grid--inner")
    .find("a.fm-card-wrap.-brightcovevideo")
    .should(($element) => {
      expect(
        $element,
        `Editorial list should have a length greater than 0. URL: ${URL}`
      ).to.have.length.greaterThan(0);
    })
    .each(($video) => {
      cy.wrap($video)
        .find(".fm-card__figure")
        .then(($element) => {
          if (!$element.is(":visible")) {
            throw new Error(`fm card figure should be visible. URL: ${URL}`)
          }
        })
      cy.wrap($video)
        .find(".mls-o-video-card__duration-lock")
        .then(($element) => {
          if (!$element.is(":visible")) {
            throw new Error(`Video card duration lock should be visible. URL: ${URL}`)
          }
        })
      cy.wrap($video)
        .find(".fm-card__icon--brightcovevideo")
        .then(($element) => {
          if (!$element.is(":visible")) {
            throw new Error(`Brightcove Video icon should be visible. URL: ${URL}`)
          }
        })
    });
});

Cypress.Commands.add("commpetitionsNameCheck", (URL) => {
  cy.get('div[class*="mls-o-block-header__title"]')
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Competition header title should be visible. URL: ${URL}`)
      }
    })
});

Cypress.Commands.add("commpetitionsLinkCheck", (URL) => {
  cy.get('div[class*="mls-c-quicklinkslist__item"]')
    .find("a")
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Quick links anchor should be visible. URL: ${URL}`)
      }
    })
    .each(($a) => {
      const link = $a.prop("href");
      expect(
        link,
        `Link should not be "undefined." URL to page containing empty link: ${URL}`
      ).to.not.include("undefined");
      cy.request({
        url: link,
        failOnStatusCode: false,
      }).then((response) => {
        expect(
          response.status,
          `Request response should not be 404. Page that has failing link: ${URL}, URL That is failing: ${link}`
        ).to.not.eq(404);
      });
    });
});

Cypress.Commands.add("competitionNavLinkCheck", (URL) => {
  cy.get(".mls-c-sub-nav__nav-list > li").each(($li) => {
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
            expect(
              response.status,
              `Request response should be 200. URL with link on it: ${URL}, Failing link: ${linkUrl}`
            ).to.eq(200);
          });
        });
    } else {
      cy.wrap($li)
        .find(".mls-c-sub-nav__item-link")
        .each(($a) => {
          const linkUrl = $a.prop("href");
          cy.request({
            url: linkUrl,
            failOnStatusCode: false,
          }).then((response) => {
            expect(
              response.status,
              `Expected status for link ${linkUrl} should be 200, 301, or 302. URL to page with failing link: ${URL}`
            ).to.be.oneOf([200, 301, 302]);
          });
        });
    }
  });
});

Cypress.Commands.add("copaAmericaPageCheck", (URL) => {
  cy.get(".mls-c-sub-nav__nav-list > li")
    .find("a")
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Nav list anchor should be visible. URL: ${URL}`)
      }
    })
    .each(($a) => {
      const link = $a.prop("href");
      expect(
        link,
        `Link ${link} should not be undefined. URL with failing link: ${URL}`
      ).to.not.include("undefined");
      cy.request({
        url: link,
        failOnStatusCode: false,
      }).then((response) => {
        expect(
          response.status,
          `Response from ${link} should not be 404. URL with failing link: ${URL}`
        ).to.not.eq(404);
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
    for (let MLS_URL of MLS_URLS.preMatchURLs) {
      if (MLS_URL.includes(modifiedURL)) {
        found = true;
        cy.log(`Found "${modifiedURL}" in MLS_URLS`);
        break;
      }
    }

    if (!found) {
      cy.log(`No matching "${modifiedURL}" found in MLS_URLS`).then(() => {
        throw new Error(
          `No matching Leagues Cup URL: "${modifiedURL}" found in MLS_URLS: ${MLS_URLS}`
        );
      });
    }
  });
});

Cypress.Commands.add("liveMatchStateHtState", (URL) => {
  cy.get('a[href="feed"]').click();
  cy.get('section[class*="mls-l-module mls-l-module--match-feed"]')
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Match feed module should be visible. URL: ${URL}`)
      }
    })
    .then(() => {
      cy.get(".mls-o-match-feed__container .mls-o-match-feed__title")
        .invoke("text")
        .then((titleText) => {
          const commentaryHalfTime = titleText.includes("Half Time")
            ? "y"
            : "n";
          cy.get('section[class*="mls-l-module--match-hub-header-container"]')
            .then(($element) => {
              if (!$element.is(":visible")) {
                throw new Error(`Match hub header container should be visible. URL: ${URL}`)
              }
            })
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

Cypress.Commands.add("postMatchStateFinalState", (URL) => {
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
            .then(($element) => {
              if (!$element.is(":visible")) {
                throw new Error(`Match hub header container should be visible. URL: ${URL}`)
              }
            })
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
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Live status stamp should be visible. URL: ${URL}`)
      }
    })
    .find("span")
    .invoke("text")
    .then((text) => {
      if (text.trim() === "HT") {
        isHalfTime = true;
      }
    });
});

Cypress.Commands.add("playoffsLatestCheck", (URL) => {
  cy.get(".mls-o-single-photo--photo").should(($element) => {
    expect(
      $element,
      `Singal photos module should have a length greater than 3. URL: ${URL}`
    ).to.have.length.greaterThan(3);
  });
});

Cypress.Commands.add("playoffsNewsCheck", (URL) => {
  cy.get(".mls-c-sub-nav__item-text")
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Nav item text should be visible. URL: ${URL}`)
      }
    })
    .invoke("text")
    .then((text) => {
      expect(text, `Nav element should contain "News". URL: ${URL}`).contains(
        "News"
      );
    })
    .click();

  cy.wait(2000);

  cy.get('a[class*="fm-card-wrap -story"]')
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Story should be visible. URL ${URL}`)
      }
    })
  expect(
    $element,
    `Story should have a length greater than 15. URL ${URL}`
  ).to.have.length.greaterThan(15);
});

Cypress.Commands.add("playoffsNewsCheckNP", (URL) => {
  cy.get('picture[class*="d3-o-media-object__picture"]')
    .should(($element) => {
      expect(
        $element,
        `Media object pictures should have a length more than 10. URL: ${URL}`
      ).to.have.length.greaterThan(10);
    });
});

Cypress.Commands.add("playoffsVideoCheckNP", (URL) => {
  cy.wait(4000);
  cy.get('[data-react="brightcove-video-playlist"]')
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Brightcove video playlist should be visible. URL: ${URL}`)
      }
    })
  cy.get('div[class*="mls-c-video-component__playlist-item"]')
    .then(($element) => {
      if (!$element.is(":visible")) {
        throw new Error(`Video playlist item should be visible. URL: ${URL}`)
      }
    })
    .should("have.length.gt", 20);
  cy.wait(2000);
  cy.reload();
  cy.get('section[data-react="brightcove-video-playlist"]').scrollIntoView({
    duration: "10000",
  });
  cy.get("video-js")
    .should("be.visible");
  cy.get(".vjs-big-play-button").click();
  cy.wait(3000);
  cy.get("video")
    .should(($element) => {
      expect(
        $element,
        `Video should have attribute "src". URL: ${URL}`
      ).to.have.attr("src");
    })
    .then((src) => {
      expect(src, `src (${src}) should include "blob:"`).to.include("blob:");
      cy.wait(1000);
      cy.get("video").then(($video) => {
        expect($video[0].paused, `Video should not be paused. URL: ${URL}`).to
          .be.false;
      });
    });
});

Cypress.Commands.add("mlsBracketContentCheck", (URL) => {
  const roundLabels = [
    "Wild Card",
    "Round One Best of 3",
    "Semifinals",
    "Conference Final",
    "MLS Cup",
    "Conference Final",
    "Semifinals",
  ];
  roundLabels.forEach((label) => {
    try {
      cy.get(".mls-o-brackets__round-label")
        .then(($element) => {
          if (!$element.is(":visible")) {
            throw new Error(`Round label on bracket should be visible. URL: ${URL}`)
          }
        })
        .invoke("text")
        .then((text) => {
          expect(
            text,
            `Round label text should contain ${label}. URL: ${URL}`
          ).contains(label);
        });
    } catch (error) {
      expect(
        error.message,
        `Error message should include "could not find." URL: ${URL}`
      ).to.include(`could not find: ${label}`);
    }
  });

  for (let i = 1; i < roundLabels.length; i++) {
    const roundColumn = cy.get(`.mls-o-brackets__column--round-${i}`);
    try {
      roundColumn.find(".mls-o-brackets__item").should(($element) => {
        expect($element, `Bracket item should not be empty. URL: ${URL}`).to.not
          .be.empty;
      });
    } catch (error) {
      expect(
        error.message,
        `Error should include "Round ${i} is empty or not found. URL: ${URL}`
      ).to.include(`Round ${i} is empty or not found`);
    }
  }
});

Cypress.Commands.add("mnpBracketContentCheck", () => {
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
        .should(($elements) => {
          expect(
            $elements,
            `Brackets round label for ${label} should be visible. URL: ${URL}`
          ).to.be.visible;
        })
        .invoke("text")
        .then((text) => {
          expect(text, `Text should include ${label}. URL: ${URL}`).contains(
            label
          );
        });
    } catch (error) {
      expect(
        error.message,
        `Error should include "could not find ${label}. URL: ${URL}`
      ).to.include(`could not find: ${label}`);
    }
  });

  for (let i = 1; i < roundLabels.length; i++) {
    const roundColumn = cy.get(`.mls-o-brackets__column--round-${i}`);
    try {
      roundColumn.find(".mls-o-brackets__item").should(($element) => {
        expect($element, `Bracket item should not be empty. URL: ${URL}`).to.not
          .be.empty;
      });
    } catch (error) {
      expect(
        error.message,
        `Error message should include "Round ${i} is empty or not found", URL: ${URL}`
      ).to.include(`Round ${i} is empty or not found`);
    }
  }
});

Cypress.Commands.add("HalfTimeReportingCheck", (URL) => {
  cy.get(".mls-o-match-feed__title")
    .invoke("text")
    .then((text) => {
      expect(
        text,
        `Feed title should contain "Half Time". URL: ${URL}`
      ).contains("Half Time");
    })
    .should(($element) => {
      expect(
        $element,
        `match feed title should have a length of 1. URL: ${URL}`
      ).to.have.length(1);
    });
});
