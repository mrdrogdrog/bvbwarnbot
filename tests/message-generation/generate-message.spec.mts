import { DateTime, Settings, Zone } from "luxon";
import { generateMessage } from "../../src/message-generation/generate-message.mjs";
import { MatchData } from "../../src/message-generation/types.mjs";

describe("message template", () => {
  beforeEach(() => {
    Settings.now = () => 0;
    Settings.defaultZone = "Europe/Berlin";
  });

  it("generates a bvb homecoming message", async () => {
    const match: MatchData = {
      time: DateTime.fromSeconds(0),
      awayTeam: "AWAY",
      homeTeam: "HOME",
      reason: "bvbHomecoming"
    };
    const message = await generateMessage(123, match);
    expect(message).toBe(`⚠️123h-Warnung!⚠️

Heute, 01.01.1970 - 01:00

🏠BVB-Heimspiel (HOME vs AWAY)
Vermeide Innenstadt / U42 / U46 / Kreuzviertel / Borsigplatz / Uni-Parkplatz
`);
  });

  it("generates a bvb away message", async () => {
    const match: MatchData = {
      time: DateTime.fromSeconds(0),
      awayTeam: "HOME",
      homeTeam: "AWAY",
      reason: "bvbAway"
    };
    const message = await generateMessage(123, match);
    expect(message).toBe(`⚠️123h-Warnung!⚠️

Heute, 01.01.1970 - 01:00

🏕BVB-Auswärtsspiel (AWAY vs HOME)
Vermeide Kneipen mit TV
`);
  });

  it("generates an EM german team message", async () => {
    const match: MatchData = {
      time: DateTime.fromSeconds(0),
      awayTeam: "HOME",
      homeTeam: "AWAY",
      reason: "emGermanTeam"
    };
    const message = await generateMessage(123, match);
    expect(message).toBe(`⚠️123h-Warnung!⚠️

Heute, 01.01.1970 - 01:00

🇪🇺EM-Spiel (AWAY vs HOME)

EM-Spiel des deutschen Team!
Vermeide Innenstadt und Kneipen mit TV!
`);
  });

  it("generates an EM Dortmund Location message", async () => {
    const match: MatchData = {
      time: DateTime.fromSeconds(0),
      awayTeam: "HOME",
      homeTeam: "AWAY",
      reason: "emLocationDortmund"
    };
    const message = await generateMessage(123, match);
    expect(message).toBe(`⚠️123h-Warnung!⚠️

Heute, 01.01.1970 - 01:00

🇪🇺EM-Spiel (AWAY vs HOME)

Das Spiel findet im Dortmunder Stadium statt!
Vermeide Innenstadt / U42 / U46 / Kreuzviertel / Borsigplatz / Uni-Parkplatz
`);
  });

  it("generates a message for tomorrow", async () => {
    const match: MatchData = {
      time: DateTime.fromSeconds(100000),
      awayTeam: "HOME",
      homeTeam: "AWAY",
      reason: "bvbAway"
    };

    const message = await generateMessage(123, match);
    expect(message).toBe(`⚠️123h-Warnung!⚠️

Morgen, 02.01.1970 - 04:46

🏕BVB-Auswärtsspiel (AWAY vs HOME)
Vermeide Kneipen mit TV
`);
  });


  it("generates a message for more than tomorrow", async () => {
    const match: MatchData = {
      time: DateTime.fromSeconds(100000000),
      awayTeam: "HOME",
      homeTeam: "AWAY",
      reason: "bvbAway"
    };

    const message = await generateMessage(123, match);
    expect(message).toBe(`⚠️123h-Warnung!⚠️

03.03.1973 - 10:46

🏕BVB-Auswärtsspiel (AWAY vs HOME)
Vermeide Kneipen mit TV
`);
  });
});

