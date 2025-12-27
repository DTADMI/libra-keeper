// src/__tests__/logger.test.ts
import { logger } from "../lib/logger"

describe("Logger", () => {
  let infoSpy: jest.SpyInstance
  let warnSpy: jest.SpyInstance
  let errorSpy: jest.SpyInstance
  let debugSpy: jest.SpyInstance

  beforeEach(() => {
    infoSpy = jest.spyOn(console, "info").mockImplementation()
    warnSpy = jest.spyOn(console, "warn").mockImplementation()
    errorSpy = jest.spyOn(console, "error").mockImplementation()
    debugSpy = jest.spyOn(console, "debug").mockImplementation()
  });

  afterEach(() => {
    jest.restoreAllMocks()
  });

  it("should log info messages", () => {
    logger.info("test info")
    expect(infoSpy).toHaveBeenCalledWith(expect.stringContaining("[INFO] test info"))
  });

  it("should log warn messages", () => {
    logger.warn("test warn")
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("[WARN] test warn"))
  });

  it("should log error messages", () => {
    logger.error("test error")
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining("[ERROR] test error"))
  });

  it("should log debug messages in non-production environment", () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = "development"

    logger.debug("test debug")
    expect(debugSpy).toHaveBeenCalledWith(expect.stringContaining("[DEBUG] test debug"))

    process.env.NODE_ENV = originalEnv
  });

  it("should not log debug messages in production environment", () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = "production"

    logger.debug("test debug")
    expect(debugSpy).not.toHaveBeenCalled()

    process.env.NODE_ENV = originalEnv
  });

  it("should pass extra arguments to console methods", () => {
    const extra = { key: "value" }
    logger.info("test info", extra)
    expect(infoSpy).toHaveBeenCalledWith(expect.stringContaining("[INFO] test info"), extra)
  });
});
