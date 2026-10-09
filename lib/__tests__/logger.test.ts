// Tests de lib/logger.ts : le journaliseur singleton.
//
// Deux proprietes meritent un test : le singleton (une seule instance partagee) et
// le silence de `debug` en production, qui est une decision deliberee et non un
// oubli.

import { logger } from "@/lib/logger";

const infoSpy = jest.spyOn(console, "info").mockImplementation(() => {});
const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
const debugSpy = jest.spyOn(console, "debug").mockImplementation(() => {});

const originalEnv = process.env.NODE_ENV;

/** `NODE_ENV` est type en lecture seule ; on le force pour tester les deux cas. */
function setNodeEnv(value: string): void {
  Object.defineProperty(process.env, "NODE_ENV", { value, configurable: true, writable: true });
}

beforeEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  setNodeEnv(originalEnv ?? "test");
  infoSpy.mockRestore();
  warnSpy.mockRestore();
  errorSpy.mockRestore();
  debugSpy.mockRestore();
});

describe("logger", () => {
  it("prefixe le message par un horodatage ISO et le niveau en majuscules", () => {
    logger.info("demarrage");
    expect(infoSpy).toHaveBeenCalledTimes(1);
    const line = infoSpy.mock.calls[0]?.[0] as string;
    expect(line).toMatch(/^\[\d{4}-\d{2}-\d{2}T[\d:.]+Z\] \[INFO\] demarrage$/);
  });

  it("dirige chaque niveau vers la console correspondante", () => {
    logger.warn("attention");
    logger.error("echec");
    expect(warnSpy.mock.calls[0]?.[0]).toContain("[WARN] attention");
    expect(errorSpy.mock.calls[0]?.[0]).toContain("[ERROR] echec");
  });

  it("transmet les arguments supplementaires sans les perdre", () => {
    const detail = { id: 42 };
    logger.error("echec", detail);
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining("[ERROR] echec"), detail);
  });

  it("n'emet pas de debug hors production quand NODE_ENV vaut production", () => {
    setNodeEnv("production");
    logger.debug("trace interne");
    expect(debugSpy).not.toHaveBeenCalled();
  });

  it("emet le debug hors production", () => {
    setNodeEnv("test");
    logger.debug("trace interne");
    expect(debugSpy).toHaveBeenCalledTimes(1);
    expect(debugSpy.mock.calls[0]?.[0]).toContain("[DEBUG] trace interne");
  });

  it("reste joignable apres un changement d'environnement (singleton stable)", () => {
    setNodeEnv("production");
    logger.info("toujours vivant");
    expect(infoSpy.mock.calls[0]?.[0]).toContain("[INFO] toujours vivant");
  });
});
