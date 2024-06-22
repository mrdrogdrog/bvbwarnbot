import { parseEnvVar } from "../../src/utils/check-env-vars.mjs";

describe("check env vars" , () => {
  it("can find a var", () => {
    const mockExit = jest.spyOn(process, 'exit').mockImplementation((() => {}) as typeof process.exit );

    process.env["a"] = "1234"
    expect(parseEnvVar("a")).toBe("1234")
    expect(mockExit).toBeCalledTimes(0)
  })
  it("will exit if it can't find a var", () => {
    const mockExit = jest.spyOn(process, 'exit').mockImplementation((() => {}) as typeof process.exit );

    delete process.env["a"]
    parseEnvVar("a")
    expect(mockExit).toBeCalledTimes(1)
  })
})
