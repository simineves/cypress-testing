const webAppBaseURL = Cypress.env("baseURL");

let liveMatchURLs = [];

describe("Live Match Page Tests", () => {
  it("Adding Live Matches URL in Json file", () => {
    cy.visit(`${webAppBaseURL}/schedule/scores`);
    cy.wait(60000);

    cy.get(".mls-c-schedule__matches").then((schedule) => {
      if (schedule.find('div[class*="mls-c-match-tile --live"]').length > 0) {
        cy.get('div[class*="mls-c-match-tile --live"]').each(($div) => {
          const liveMatchLink = $div.parent("a").prop("href");
          if (liveMatchLink) {
            liveMatchURLs.push(liveMatchLink);
          }
        });
      } else {
        cy.log(
          'No elements with class containing "mls-c-match-tile --live" found.'
        );
      }

      // Write the liveMatchURLs array to a JSON file
      const liveMatchObj = { liveMatchURLs }; // Creating an object with 'liveMatchURLs' key
      cy.writeFile("MLS_LIVE_URLS.json", liveMatchObj);
      cy.log(`liveMatchURLs array written to: MLS_URLS-urls.json`);
    });
  });
});
