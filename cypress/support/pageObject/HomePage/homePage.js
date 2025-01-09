Cypress.Commands.add("validateHomePageLinkSchedule", () => {
  //Validate Schedule Link
  cy.get(
    ".mls-o-navigation--lg > .mls-o-navigation__primary-list > :nth-child(1) > .mls-o-navigation__item-link"
  ).click();
  cy.get(`h1`)
    .should("be.visible")
    .then(($element) => {
      expect($element).to.exist;
    });

  cy.contains("Schedule").click();
  cy.get(`h1`)
    .should("be.visible")
    .then(($element) => {
      expect($element).to.exist;
    });
});

Cypress.Commands.add("validateHomePageLinkNews", () => {
  //Validate News Link
  cy.contains("News").click();
  cy.get(`h1`)
    .should("be.visible")
    .then(($element) => {
      expect($element).to.exist;
    });
});

Cypress.Commands.add("validateNewsPageEachArticle", () => {
  cy.contains("News").click();
  cy.get('a.fm-card-wrap').each(($el) => {
    const href = $el.attr('href');
    cy.visit(href, { failOnStatusCode: false });
    cy.url().should('include', href);
    });
    cy.go('back');
});

Cypress.Commands.add("validateHomePageLinkWatch", () => {
  //Validate Watch Link
  cy.contains("Watch").click();
  cy.get(`h1`)
    .should("be.visible")
    .then(($element) => {
      expect($element).to.exist;
    });
});

Cypress.Commands.add("validateWatchPageEachVideo", () => {
  cy.contains("Watch").click();
  cy.wait(2000)
  cy.get('section[data-react="brightcove-video-playlist"]').scrollIntoView();
  cy.get('video-js').should('be.visible');
  cy.get('.vjs-big-play-button').click();
  cy.wait(3000)
  cy.get('video').should('have.attr', 'src').then((src) => {
    expect(src).to.include('blob:');
    cy.wait(1000);
    cy.get('video').then(($video) => {
      expect($video[0].paused).to.be.false;
    });
  });
});

Cypress.Commands.add("validateHomePageLinkAbout", () => {
  //Validate Watch Link
  cy.contains("About").click();
  cy.get(`h1`)
    .should("be.visible")
    .then(($element) => {
      expect($element).to.exist;
    });
});

Cypress.Commands.add("validateHomePageLinkStandings", () => {
  // Validate Standings Link
  cy.get('[role="navigation"]')
  .find('a')
  .contains('span', 'Standings')
  .click();
});

Cypress.Commands.add("validateHomePageLinkStandingsLC", () => {
  // Validate Standings Link
  cy.get('[role="navigation"]')
  .find('a')
  .contains('span', 'Bracket')
  .click();
});

Cypress.Commands.add("validateHomePageLinkStats", () => {
  //Validate Stats Link
  cy.contains("Stats").click();
  cy.get(`h1`)
    .should("be.visible")
    .then(($element) => {
      expect($element).to.exist;
    });
});

Cypress.Commands.add("validateHomePageLinkClubs", () => {
  //Validate Clubs Link
  cy.get(
    ".mls-o-navigation--lg > .mls-o-navigation__primary-list > .mls-o-navigation__toggle > .mls-o-navigation__button"
  ).click({ force: true });
  cy.contains("Clubs").click({ force: true });
  cy.get(`h1`)
    .should("be.visible")
    .then(($element) => {
      expect($element).to.exist;
    });
});

Cypress.Commands.add("validateHomePageLinkCompetitions", () => {
  //Validate Competitions link
  cy.get(
    ".mls-o-navigation--lg > .mls-o-navigation__primary-list > .mls-o-navigation__toggle > .mls-o-navigation__button"
  ).click({ force: true });
  cy.contains("Competitions").click({ force: true });
  cy.get(`h1`)
    .should("be.visible")
    .then(($element) => {
      expect($element).to.exist;
    });
});

Cypress.Commands.add("validateHomePageLinkRosters", () => {
  //Validate Rosters link
  cy.get(
    ".mls-o-navigation--lg > .mls-o-navigation__primary-list > .mls-o-navigation__toggle > .mls-o-navigation__button"
  ).click({ force: true });
  cy.contains("Rosters").click({ force: true });
  cy.get(`h1`)
    .should("be.visible")
    .then(($element) => {
      expect($element).to.exist;
    });
});

Cypress.Commands.add("validateHomePageLinkBetting", () => {
  //Validate Betting link
  cy.get(
    ".mls-o-navigation--lg > .mls-o-navigation__primary-list > .mls-o-navigation__toggle > .mls-o-navigation__button"
  ).click({ force: true });
  cy.contains("Betting").click({ force: true });
  cy.get(`h1`)
    .should("be.visible")
    .then(($element) => {
      expect($element).to.exist;
    });
});

Cypress.Commands.add("validateHomePageLinkGaming", () => {
  //Validate Gaming link
  cy.get(
    ".mls-o-navigation--lg > .mls-o-navigation__primary-list > .mls-o-navigation__toggle > .mls-o-navigation__button"
  ).click({ force: true });
  cy.contains("Gaming").click({ force: true });
  cy.get(`h1`)
    .should("be.visible")
    .then(($element) => {
      expect($element).to.exist;
    });
});

Cypress.Commands.add("validateHomePageLinkEMLS", () => {
  //Validate eMLS link
  cy.get(
    ".mls-o-navigation--lg > .mls-o-navigation__primary-list > .mls-o-navigation__toggle > .mls-o-navigation__button"
  ).click({ force: true });
  cy.contains("eMLS").click({ force: true });
  cy.get(`h1`)
    .should("be.visible")
    .then(($element) => {
      expect($element).to.exist;
    });
});

Cypress.Commands.add("validateHomePageLinkMLSGO", () => {
  //Validate MLS Go
  cy.get(
    ".mls-o-navigation--lg > .mls-o-navigation__primary-list > .mls-o-navigation__toggle > .mls-o-navigation__button"
  ).click({ force: true });
  cy.contains("MLS GO").click({ force: true });
  cy.get(`.mls-o-navigation`)
    .should("be.visible")
    .then(($element) => {
      expect($element).to.exist;
    });
});

Cypress.Commands.add("validateHomePageLinkMLSNext", () => {
  //Validate MLS NEXT
  cy.get(
    ".mls-o-navigation--lg > .mls-o-navigation__primary-list > .mls-o-navigation__toggle > .mls-o-navigation__button"
  ).click({ force: true });
  cy.contains("MLS NEXT").click({ force: true });
  cy.get(`.mls-o-navigation`)
    .should("be.visible")
    .then(($element) => {
      expect($element).to.exist;
    });
});

Cypress.Commands.add("validateHomePageLinkMLSNextPro", () => {
  //validate MLSNextPro
  let originalWindow;
  cy.window().then((win) => {
    originalWindow = win;
  });
  cy.get(
    ".mls-o-navigation--lg > .mls-o-navigation__primary-list > .mls-o-navigation__toggle > .mls-o-navigation__button"
  ).click();
  cy.contains("MLS NEXT Pro").click({ force: true });
  cy.window().then((nextWindow) => {
    // Validate element in the new window
    cy.wrap(nextWindow.document.body)
      .get(
        `.mls-o-navigation--lg > .mls-o-navigation__primary-list > :nth-child(1) > .mls-o-navigation__item-link`
      )
      .should("be.visible");
    cy.wrap(nextWindow.document.body)
      .get(
        `.mls-o-navigation--lg > .mls-o-navigation__primary-list > :nth-child(1) > .mls-o-navigation__item-link`
      )
      .should("be.visible");
    originalWindow.focus();
  });
});

Cypress.Commands.add("gameCarouselCheck", () => {
  cy.get('[data-react="mls-horizontal-scoreboard"')
    .should("be.visible")
    .find(".mls-c-horizontal-match")
    .should("have.length.gt", 2);
});

Cypress.Commands.add("campeonesCupGameExists", () => {

  cy.get('div[class*="mls-c-featured-match"')
    .should("be.visible")
    .find('a').first()
    .invoke('attr', 'href')
    .should('include', 'https://www.leaguescup.com/campeonescup/competitions/campeones-cup/2024/matches/clbvsame-09-25-2024');
  
  cy.get('div[class*="mls-c-blockheader__title"')
    .should('be.visible')

  cy.get('div[class*="mls-c-blockheader__subtitle"')
    .should('be.visible')
    .contains('Wednesday September 25')

  cy.get('div[class*="mls-c-match-tile"')
    .should('be.visible')

  cy.get('img[class*="mls-c-club__picture"')
    .should('be.visible')
    .should('have.length', 2)
    
  cy.get('div[class*="mls-c-venue-broadcaster-bar --single-broadcaster"')
    .should('be.visible')

  cy.get('div[class*="mls-c-venue-broadcaster-bar --single-broadcaster"')
    .should('be.visible')
    .contains('Apple TV - MLS Season Pass, TUDN')

  cy.get('div[class*="mls-c-matchbutton-streamer"')
    .should('be.visible')
    .find('a')
    .invoke('attr', 'href')
    .should('include', 'https://www.ticketmaster.com/event');

  cy.get('div[class*="mls-c-matchbutton-streamer"')
    .find('button')
    .should('be.visible')
    .contains('Buy Tickets')
});
