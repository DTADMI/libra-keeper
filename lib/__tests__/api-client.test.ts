// Tests de lib/api-client.ts : l'enveloppe de fetch partagee.
//
// Ce module est petit mais critique : huit fichiers de hooks en dependent, et son
// contrat est precis. Un fetch non-ok DOIT lever, sinon un appelant traiterait une
// page d'erreur HTML comme des donnees.

import { apiClient } from "@/lib/api-client";

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
  jest.clearAllMocks();
});

function mockFetch(impl: jest.Mock) {
  global.fetch = impl as unknown as typeof fetch;
}

describe("apiClient", () => {
  it("retourne le JSON quand la reponse est ok", async () => {
    const json = jest.fn().mockResolvedValue({ id: 1 });
    mockFetch(jest.fn().mockResolvedValue({ ok: true, status: 200, json }));
    await expect(apiClient<{ id: number }>("/api/items")).resolves.toEqual({ id: 1 });
    expect(json).toHaveBeenCalledTimes(1);
  });

  it("transmet l'URL et l'init a fetch", async () => {
    const fetchMock = jest.fn().mockResolvedValue({ ok: true, status: 200, json: jest.fn().mockResolvedValue({}) });
    mockFetch(fetchMock);
    const init = { method: "POST", headers: { "content-type": "application/json" } };
    await apiClient("/api/items", init);
    expect(fetchMock).toHaveBeenCalledWith("/api/items", init);
  });

  it("leve une erreur portant le statut quand la reponse n'est pas ok", async () => {
    mockFetch(jest.fn().mockResolvedValue({ ok: false, status: 404, json: jest.fn() }));
    await expect(apiClient("/api/missing")).rejects.toThrow("Request failed: 404");
  });

  it("leve aussi sur une erreur serveur, sans tenter de lire le corps", async () => {
    const json = jest.fn();
    mockFetch(jest.fn().mockResolvedValue({ ok: false, status: 500, json }));
    await expect(apiClient("/api/boom")).rejects.toThrow("Request failed: 500");
    expect(json).not.toHaveBeenCalled();
  });

  it("laisse remonter une erreur reseau", async () => {
    mockFetch(jest.fn().mockRejectedValue(new Error("network down")));
    await expect(apiClient("/api/items")).rejects.toThrow("network down");
  });
});
