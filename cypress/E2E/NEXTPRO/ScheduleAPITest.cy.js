import { nextProClubsMapping } from "../../support/compsTeamsClubs.js";
import URLS from "../../../NEXTPRO_URLS.json";
import liveURLS from "../../../NEXTPRO_LIVE_URLS.json";

// describe("Testing MLS Next Pro Competition Schedules", () => {
//     it("Testing MLS Next Pro - Regular Season Schedule", () => {
//         cy.checkCompetitionSchedule("Feed-01.06-BaseData-Schedule", "MLS-SEA-0001K8", "MLS-COM-000003", nextProClubsMapping, URLS, liveURLS);
//     })
// });

describe("Testing MLS Next Pro Competition Schedules", () => {
    it("Testing MLS Next Pro - Playoff Schedule", () => {
        cy.checkCompetitionSchedule("Feed-01.06-BaseData-Schedule", "MLS-SEA-0001K8", "MLS-COM-000004", nextProClubsMapping, URLS, liveURLS);
    })
});