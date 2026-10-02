import fs from "node:fs";
import path from "node:path";

const root = path.join(__dirname, "..", "..");

describe("PWA hors ligne (B9)", () => {
  it("configure un repli document vers /offline dans next-pwa", () => {
    const config = fs.readFileSync(path.join(root, "next.config.ts"), "utf8");
    expect(config).toContain("fallbacks");
    expect(config).toContain('document: "/offline"');
  });

  it("la page offline existe et l enregistrement du SW est monte", () => {
    expect(fs.existsSync(path.join(root, "app", "offline", "page.tsx"))).toBe(true);
    const layout = fs.readFileSync(path.join(root, "app", "layout.tsx"), "utf8");
    expect(layout).toContain("ServiceWorkerRegistration");
  });
});
