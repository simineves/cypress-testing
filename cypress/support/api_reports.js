// WAIT!
//
// This command is not to be used in E2E testing! 
//
// This command is going to be used to compare what is on the STS feed vs. what is found in alakazam to ensure consistency.
//
// For the command to work currently, Cypress must have the feed page in focus for the match you're testing against
//
// Then, feed the Match ID into the validateMatchFeedContent command. It will return all feeds found on the site, that have 
// been retroactively deleted from STS's 06-16 feed. 

Cypress.Commands.add("validateMatchFeedContent", (matchId) => {
    cy.cleanseCommentaryFeed(matchId).then(
        (parsedFeed) => {
            const scrollDown = (i) => {
                if (i < 2) {
                    // Access the window object to get the document's scroll height, scroll to bottom
                    cy.window().then((win) => {
                        const scrollHeight = win.document.documentElement.scrollHeight;
                        const viewportHeight = win.innerHeight;
                        const scrollPosition = scrollHeight - viewportHeight - 300;
                        cy.scrollTo(0, scrollPosition, { duration: 1000 }).then(() => {
                            cy.wait(3000).then(() => {
                                scrollDown(i + 1);
                            });
                        });
                    });
                }
            };

            // Start the scrolling process
            scrollDown(0);

            //This will log into the console the total feed (Minus deleted items)
            console.log(parsedFeed);

            let apiSubstitutions = [];
            let feedElements = [];
            let matchedFeeds = [];

            // Find all commentary items on the page
            cy.get('[class*="mls-o-match-feed__commentary mls-o-match-feed__commentary--"]').each(($el) => {
                cy.wrap($el).invoke('text').then((text) => {
                    feedElements.push(text);
                });
            }).then(() => {
                if (parsedFeed.length == feedElements.length) {
                    cy.log("API and Webpage feeds match");
                } else {
                    // Search through both api and site feeds and see if the contents match
                    for (let i = parsedFeed.length - 1; i >= 0; i--) {
                        if ((parsedFeed[i].$.Commentary).includes("Substitution")) {
                            apiSubstitutions.push(parsedFeed[i].$.Commentary);
                        };
                        for (let i2 = 0; i2 < feedElements.length; i2++) {
                            if (feedElements[i2].includes(parsedFeed[i].$.Commentary)) {
                                matchedFeeds.push(feedElements[i2]);
                                feedElements.splice(i2, 1);
                                break;
                            };
                        };
                    };
                };

                let newFeedElements = compareSubstitutions(apiSubstitutions, feedElements);

                if (newFeedElements.length > 0) {
                    return newFeedElements;
                } else {
                    cy.log("Feeds should all be accounted for")
                };
            });
        });
});

function compareSubstitutions(apiSubstitutions, feedSubstitutions) {
    // The front end doesn't contain enough easily parsable data to do a substitution comapare. 
    // This checks to make sure the letters of the names of the players in the subsitution are 
    // all present on both feeds. This may lead to inconsistent results.
    for (let i = 0; i < apiSubstitutions.length; i++) {
        for (let i2 = feedSubstitutions.length - 1; i2 >= 0; i2--) {
            if (containsAllLettersOnce(apiSubstitutions[i], feedSubstitutions[i2])) {
                feedSubstitutions.splice(i2, 1);
            };
        };
    };
    return feedSubstitutions;
};

function containsAllLettersOnce(str1, str2) {
    // Remove punctuation and numbers, and convert to lowercase
    const cleanStr1 = str1.replace(/[^a-zA-Z]/g, '').toLowerCase();
    const cleanStr2 = str2.replace(/[^a-zA-Z]/g, '').toLowerCase();

    //Create an array of letters from string 1 to check against 
    let letterArray = [...cleanStr1];

    // Check if char is in the array of characters
    for (const char of cleanStr2) {
        let alwaysMatched = false;
        if (letterArray.includes(char)) {
            alwaysMatched = true;
        } else {
            return false;
        }
    }
    return true;
}

Cypress.Commands.add("cleanseCommentaryFeed", (matchId) => {
    let cleansedFeed = [];

    cy.fetchAndParseDataMLS("Feed-06.16-Commentary", matchId).then(
        (parsedData) => {
            console.log(parsedData);
            const parsedCommentary = parsedData.PutDataRequest.MatchCommentary[0].Commentary;
            for (let i = 0; i < parsedCommentary.length; i++) {
                if (parsedCommentary[i].$.Type != "Delete") {
                    cleansedFeed.push(parsedCommentary[i])
                };
            }
            return cleansedFeed;
        })
});
