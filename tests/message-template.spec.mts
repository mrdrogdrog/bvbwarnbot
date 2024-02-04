import { generateMessage } from "../src/message-template.mjs";
import { DateTime, Settings } from "luxon";

describe('message template', () => {
  it('generates a homecoming message', () => {
    Settings.now = () => 0
    const message = generateMessage(123, DateTime.fromSeconds(0), "AWAY", "HOME", true)
    expect(message).toBe(`⚠️123h-Warnung!⚠️

Heute, 01.01.1970 - 01:00
HOME vs AWAY

🏠Heimspiel
Vermeide U42 / U46 / Kreuzviertel / Borsigplatz / Uni-Parkplatz`)
  })

  it('generates a away message', () => {
    Settings.now = () => 0
    const message = generateMessage(123, DateTime.fromSeconds(0), "AWAY", "HOME", false)
    expect(message).toBe(`⚠️123h-Warnung!⚠️

Heute, 01.01.1970 - 01:00
HOME vs AWAY

🏕Auswärtsspiel
Vermeide Kneipen mit TV`)
  })

  it('generates a message for tomorrow', () => {
    Settings.now = () => 0
    const message = generateMessage(123, DateTime.fromSeconds(100000), "AWAY", "HOME", false)
    expect(message).toBe(`⚠️123h-Warnung!⚠️

Morgen, 02.01.1970 - 04:46
HOME vs AWAY

🏕Auswärtsspiel
Vermeide Kneipen mit TV`)
  })
})
