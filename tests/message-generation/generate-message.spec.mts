import { DateTime, Settings, Zone } from "luxon";
import { generateMessage } from "../../src/message-generation/generate-message.mjs";
import { MatchData } from "../../src/message-generation/types.mjs";
import { expect, describe, it, vi, beforeEach } from 'vitest'

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
    expect(message).toMatchSnapshot();
  });

  it("generates a bvb away message", async () => {
    const match: MatchData = {
      time: DateTime.fromSeconds(0),
      awayTeam: "HOME",
      homeTeam: "AWAY",
      reason: "bvbAway"
    };
    const message = await generateMessage(123, match);

    expect(message).toMatchSnapshot();
  });

  it("generates an EM german team message", async () => {
    const match: MatchData = {
      time: DateTime.fromSeconds(0),
      awayTeam: "HOME",
      homeTeam: "AWAY",
      reason: "emGermanTeam"
    };
    const message = await generateMessage(123, match);

    expect(message).toMatchSnapshot();
  });

  it("generates an EM Dortmund Location message", async () => {
    const match: MatchData = {
      time: DateTime.fromSeconds(0),
      awayTeam: "HOME",
      homeTeam: "AWAY",
      reason: "emLocationDortmund"
    };
    const message = await generateMessage(123, match);

    expect(message).toMatchSnapshot();
  });

  it("generates an EM German Team in Dortmund Location message", async () => {
    const match: MatchData = {
      time: DateTime.fromSeconds(0),
      awayTeam: "HOME",
      homeTeam: "AWAY",
      reason: "emGermanTeamInDortmund"
    };
    const message = await generateMessage(123, match);

    expect(message).toMatchSnapshot();
  });

  it("generates a message for tomorrow", async () => {
    const match: MatchData = {
      time: DateTime.fromSeconds(100000),
      awayTeam: "HOME",
      homeTeam: "AWAY",
      reason: "bvbAway"
    };

    const message = await generateMessage(123, match);

    expect(message).toMatchSnapshot();
  });


  it("generates a message for more than tomorrow", async () => {
    const match: MatchData = {
      time: DateTime.fromSeconds(100000000),
      awayTeam: "HOME",
      homeTeam: "AWAY",
      reason: "bvbAway"
    };

    const message = await generateMessage(123, match);

    expect(message).toMatchSnapshot();
  });
});

