const webAppBaseURL = Cypress.env("baseURL");

let postMatchURLs = [];
let preMatchURLs = [];

describe("Pre and Post Match Page Tests", () => {
  it("Adding Pre and Post Matches URL in Json file", () => {
    cy.visit(`${webAppBaseURL}/schedule/scores`);
    cy.wait(60000);

    cy.get(".mls-c-schedule__matches").then((schedule) => {
      if (schedule.find('div[class*="mls-c-match-tile --post"]').length > 0) {
        cy.get('div[class*="mls-c-match-tile --post"]').each(($div) => {
          const postMatchLink = $div.parent("a").prop("href");
          if (postMatchLink) {
            postMatchURLs.push(postMatchLink);
          }
        });
      } else {
        cy.log(
          'No elements with class containing "mls-c-match-tile --post" found.'
        );
      }

      // Write the postMatchURLs array to a JSON file
      const postMatchObj = { postMatchURLs }; // Creating an object with 'postMatchURLs' key
      cy.writeFile("MLS_URLS.json", postMatchObj);
      cy.log(`postMatchURLs array written to: MLS_URLS-urls.json`);
    });

    cy.get(".mls-c-schedule__matches").then((schedule) => {
      if (schedule.find('div[class*="mls-c-match-tile --pre"]').length > 0) {
        cy.get('div[class*="mls-c-match-tile --pre"]').each(($div) => {
          const preMatchLink = $div.parent("a").prop("href");
          if (preMatchLink) {
            preMatchURLs.push(preMatchLink);
          }
        });
      } else {
        cy.log(
          'No elements with class containing "mls-c-match-tile --pre" found.'
        );
      }

      // Write the preMatchURLs array to the same JSON file
      const tempUrlsObj = { postMatchURLs, preMatchURLs }; // Creating an object with both 'postMatchURLs' and 'preMatchURLs' keys
      cy.writeFile("MLS_URLS.json", tempUrlsObj);
      cy.log(`preMatchURLs array written to: MLS_URLS.json`);
    });
  });
});
