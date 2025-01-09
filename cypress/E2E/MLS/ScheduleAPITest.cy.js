import { MLSClubMapping } from "../../support/compsTeamsClubs.js"
import URLS from "../../../MLS_URLS.json";
import liveURLS from "../../../MLS_LIVE_URLS.json";


describe("Testing MLS Regular Season Schedule", () => {
    it("Testing MLS Regular Season Schedule", () => {
        cy.checkCompetitionSchedule("Feed-01.06-BaseData-Schedule", "MLS-SEA-0001K8", "MLS-COM-000001", MLSClubMapping, URLS, liveURLS);
    });
});

describe("Testing MLS MLS Playoff Season Schedule", () => {
    it("Testing MLS Playoff Season Schedule", () => {
        cy.checkCompetitionSchedule("Feed-01.06-BaseData-Schedule", "MLS-SEA-0001K8", "MLS-COM-000002", MLSClubMapping, URLS, liveURLS);
    });
});