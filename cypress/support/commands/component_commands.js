Cypress.Commands.add("lineupsComponent", (URL) => {
  cy.get('section[class*="mls-l-module--lineups"]').should("exist").then($el => {
    expect($el).to.be.visible;
  }).catch(() => {
    throw new Error("Lineups component is not visible");
  });
});

// Player Stat Leaderboard
Cypress.Commands.add("playerStatsLeaderboardComponent", (URL) => {
  cy.get('button[aria-label="Toggle Submenu Options"]').click();
  cy.contains("All Player Stat Leaders").click();
  cy.get(".first-row-parent").should(($element) => {
    expect(
      $element,
      `Player Stat Leaders component should be visible. URL: ${URL}`
    ).to.be.visible;
  });
});

// Club Stats Table
Cypress.Commands.add("clubStatsTableComponent", (URL) => {
  const buttons = [
    { value: "CLUB_STATS_GENERAL", label: "General" },
    { value: "CLUB_STATS_PASSING", label: "Passing" },
    { value: "CLUB_STATS_ATTACKING", label: "Attacking" },
    { value: "CLUB_STATS_DEFENDING", label: "Defending" },
  ];

  buttons.forEach((button) => {
    cy.get(`button[value="${button.value}"]`)
      .click()
      .wait(1000)
      .should(($element) => {
        expect(
          $element,
          `Club stats table for ${button.label} should be visible. URL: ${URL}`
        ).to.be.visible;
      })
      .then(() => {
        cy.get(".mls-l-module--club-stats").should(($element) => {
          expect(
            $element,
            `Club stats component should be visible after clicking ${button.label}. URL: ${URL}`
          ).to.be.visible;
        });
      });
  });
});

// Player Stats Table
Cypress.Commands.add("playerStatsTableComponent", (URL) => {
  const buttons = [
    { value: "STATS_GENERAL", label: "General" },
    { value: "STATS_PASSING", label: "Passing" },
    { value: "STATS_ATTACKING", label: "Attacking" },
    { value: "STATS_DEFENDING", label: "Defending" },
    { value: "STATS_GOALKEEPING", label: "Goalkeeping" },
  ];

  buttons.forEach((button) => {
    cy.get(`button[value="${button.value}"]`)
      .click()
      .should(($element) => {
        expect(
          $element,
          `Player stats table for ${button.label} should be visible. URL: ${URL}`
        ).to.be.visible;
      })
      .then(() => {
        cy.get(".mls-l-module--player-stats").should(($element) => {
          expect(
            $element,
            `Player stats component should be visible after clicking ${button.label}. URL: ${URL}`
          ).to.be.visible;
        });

        const dropdowns = [
          { index: 0, description: "year" },
          { index: 1, description: "competition" },
          { index: 2, description: "club" },
        ];

        dropdowns.forEach((dropdown) => {
          cy.get("select")
            .eq(dropdown.index)
            .find("option")
            .each((option) => {
              const value = option.val();
              if (value) {
                cy.get("select")
                  .eq(dropdown.index)
                  .select(value)
                  .then(() => {
                    cy.get(".mls-l-module--player-stats").should(($element) => {
                      expect(
                        $element,
                        `Player stats component should be visible after selecting ${value} in ${dropdown.description}. URL: ${URL}`
                      ).to.be.visible;
                    });
                  });
              }
            });
        });
      });
  });
});

// Standings Page

// Standings
Cypress.Commands.add("standingsComponent", (URL) => {
  const navItems = [
    { text: "Conference Standings", url: "/standings/2024/conference" },
    {
      text: "Supporters' Shield Standings",
      url: "/standings/2024/supporters-shield",
    },
    { text: "Form Guide", url: "/standings/form-guide" },
  ];

  const verifyVisibility = (selector) => {
    cy.get(selector).should(($element) => {
      expect($element, `Element ${selector} should be visible. URL: ${URL}`).to
        .be.visible;
    });
  };

  const clickLiveAndOfficial = () => {
    cy.get('button[aria-label="Live"]').click();
    verifyVisibility('section[class*="mls-l-module--season-stat-leaders"]');
    cy.get('button[aria-label="Official"]').click();
    verifyVisibility('section[class*="mls-l-module--season-stat-leaders"]');
  };

  navItems.forEach((item) => {
    cy.contains(".mls-c-sub-nav__item-text", item.text)
      .parents(".mls-c-sub-nav__nav-item")
      .find(".mls-c-sub-nav__item-link")
      .click();

    switch (item.text) {
      case "Form Guide":
        verifyVisibility(
          'section[class*="mls-l-module--standings-form-guide-wrapper"]'
        );
        break;
      case "Conference Standings":
      case "Supporters' Shield Standings":
        clickLiveAndOfficial();
        break;
      default:
        verifyVisibility('section[class*="mls-l-module--season-stat-leaders"]');
    }

    cy.go("back");
  });
});

// Match Page

// Pre
Cypress.Commands.add("matchUpHistoryComponent", (URL) => {
  cy.get('section[class*="mls-l-module--previous-matches"]').should(
    ($element) => {
      expect(
        $element,
        `Previous matches component should be visible. URL: ${URL}`
      ).to.be.visible;
    }
  );
});

Cypress.Commands.add("preMatchStatsComparisonComponent", (URL) => {
  cy.get('section[class*="mls-l-module--stats-comparison"]').should(
    ($element) => {
      expect(
        $element,
        `Pre-match stats comparison component should be visible. URL: ${URL}`
      ).to.be.visible;
    }
  );
});

// Pre||Live||Post
Cypress.Commands.add("matchFactsComponent", (URL) => {
  cy.get('section[class*="mls-l-module--match-facts"]').should(($element) => {
    expect($element, `Match facts component should be visible. URL: ${URL}`).to
      .be.visible;
  });
});

Cypress.Commands.add("lineupsComponent", (URL) => {
  cy.get('section[class*="mls-l-module--lineups"]').should(($element) => {
    expect($element, `Lineups component should be visible. URL: ${URL}`).to.be
      .visible;
  });
});

Cypress.Commands.add("matchHubHeaderComponent", (URL) => {
  cy.get('section[class*="mls-l-module--match-hub-header-container"]').should(
    ($element) => {
      expect(
        $element,
        `Match hub header component should be visible. URL: ${URL}`
      ).to.be.visible;
    }
  );
});

Cypress.Commands.add("verticalScoreboard", (URL) => {
  cy.get('div[class*="mls-c-vertical-scoreboard__matches-wrapper"]').should(
    ($element) => {
      expect(
        $element,
        `Vertical scoreboard component should be visible. URL: ${URL}`
      ).to.be.visible;
    }
  );
});

Cypress.Commands.add("matchTicketsComponent", (URL) => {
  cy.get('section[class*="mls-l-module--ticketing-block"]').should(
    ($element) => {
      expect($element, `Match tickets component should be visible. URL: ${URL}`)
        .to.be.visible;
    }
  );
});

// Live||Post
Cypress.Commands.add("commentaryFeedComponent", (URL) => {
  cy.get('section[class*="mls-l-module--match-feed"]').should(($element) => {
    expect($element, `Commentary feed component should be visible. URL: ${URL}`)
      .to.be.visible;
  });
});

Cypress.Commands.add("xGShotComparisonBreakdownComponent", (URL) => {
  cy.get('section[class*="mls-l-module--expected-goals"]').should(
    ($element) => {
      expect(
        $element,
        `Expected goals breakdown component should be visible. URL: ${URL}`
      ).to.be.visible;
    }
  );
});

Cypress.Commands.add("matchPossessionBlockComponent", (URL) => {
  cy.get('section[class*="mls-l-module--possession"]').should(($element) => {
    expect(
      $element,
      `Match possession block component should be visible. URL: ${URL}`
    ).to.be.visible;
  });
});

Cypress.Commands.add("matchStatsComparisonComponent", (URL) => {
  cy.get('section[class*="mls-l-module--stats-comparison"]').should(
    ($element) => {
      expect(
        $element,
        `Match stats comparison component should be visible. URL: ${URL}`
      ).to.be.visible;
    }
  );
});

Cypress.Commands.add("passingComparisonBreakdownComponent", (URL) => {
  cy.get('section[class*="mls-l-module--passing-breakdown"]').should(
    ($element) => {
      expect(
        $element,
        `Passing comparison breakdown component should be visible. URL: ${URL}`
      ).to.be.visible;
    }
  );
});

Cypress.Commands.add("shootingComparisonBreakdownComponent", (URL) => {
  cy.get('section[class*="mls-l-module--shooting-breakdown"]').should(
    ($element) => {
      expect(
        $element,
        `Shooting comparison breakdown component should be visible. URL: ${URL}`
      ).to.be.visible;
    }
  );
});

// Post
Cypress.Commands.add("postMatchStatsComparisonComponent", (URL) => {
  cy.get('section[class*="mls-l-module--stats-comparison"]').should(
    ($element) => {
      expect(
        $element,
        `Post-match stats comparison component should be visible. URL: ${URL}`
      ).to.be.visible;
    }
  );
});

Cypress.Commands.add("postMatchSummaryComponent", (URL) => {
  cy.get('section[class*="mls-l-module--match-summary"]').should(($element) => {
    expect(
      $element,
      `Post-match summary component should be visible. URL: ${URL}`
    ).to.be.visible;
  });
});

// Playoffs Page
Cypress.Commands.add("bracketComponent", (URL) => {
  cy.get(".mls-o-brackets").should(($element) => {
    expect($element, `Bracket component should be visible. URL: ${URL}`).to.be
      .visible;
  });
});

// Schedule Page
Cypress.Commands.add("matchListComponent", (URL) => {
  cy.get('section[class*="mls-l-module--match-list"]').should(($element) => {
    expect($element, `Match list component should be visible. URL: ${URL}`).to
      .be.visible;
  });
});

// Home Page
Cypress.Commands.add("horizontalScoreboardComponent", (URL) => {
  cy.get('[data-react="mls-horizontal-scoreboard"]').should(($element) => {
    expect(
      $element,
      `Horizontal scoreboard component should be visible. URL: ${URL}`
    ).to.be.visible;
  });
});

// Team Page
Cypress.Commands.add("featuredMatchComponent", (URL) => {
  cy.get(".mls-c-ledeblock__bucket-content").should(($element) => {
    expect($element, `Featured match component should be visible. URL: ${URL}`)
      .to.be.visible;
  });
});

// Super Draft Page
Cypress.Commands.add("superDraftComponent", (URL) => {
  cy.get('section[class*="mls-l-module--superdraft"]').should(($element) => {
    expect($element, `Super Draft component should be visible. URL: ${URL}`).to
      .be.visible;
  });
});

// Audi Page
Cypress.Commands.add("audiGoalsDriveProgressComponent", (URL) => {
  cy.get('section[class*="d3-l-section-row"]').should(($element) => {
    expect(
      $element,
      `Audi Goals Drive Progress component should be visible. URL: ${URL}`
    ).to.be.visible;
  });
});

// Career Stats
Cypress.Commands.add("playerCareerStatsTableComponent", (URL) => {
  const buttons = [
    { label: "General" },
    { label: "Passing" },
    { label: "Attacking" },
    { label: "Defending" },
  ];

  buttons.forEach((button) => {
    cy.get(`button[aria-label="${button.label.toLowerCase()}"]`)
      .first()
      .click()
      .should(($element) => {
        expect(
          $element,
          `Career stats table for ${button.label} should be visible. URL: ${URL}`
        ).to.be.visible;
      });
  });
});

// Match Log
Cypress.Commands.add("playerMatchLogComponent", (URL) => {
  const buttons = [
    { label: "General" },
    { label: "Passing" },
    { label: "Attacking" },
    { label: "Defending" },
  ];

  buttons.forEach((button) => {
    cy.get(`button[aria-label="${button.label.toLowerCase()}"]`)
      .first()
      .click()
      .should(($element) => {
        expect(
          $element,
          `Match log for ${button.label} should be visible. URL: ${URL}`
        ).to.be.visible;
      });
  });
});
