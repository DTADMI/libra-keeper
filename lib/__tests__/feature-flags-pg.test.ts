// Tests de lib/feature-flags-pg.ts : les drapeaux lus en base.
//
// Trois proprietes comptent :
//   1. un drapeau illisible vaut FAUX, pas vrai (le repli sur l'activation serait
//      une prise de risque de securite) ;
//   2. le cache de 2 secondes evite de marteler la base, mais ecrire un drapeau
//      doit l'invalider immediatement (sinon on lit sa propre valeur perimee) ;
//   3. une erreur de base ne propage pas.

// `server-only` est un module virtuel fourni par Next.js, absent de node_modules.
// Ce fichier n'a aucun import de premier niveau (tout est simule et importe
// dynamiquement). Sans `export {}`, TypeScript le traite comme un SCRIPT et sa
// portee devient globale, ce qui entre en collision avec un autre fichier de test.
export {};

jest.mock("server-only", () => ({}));

const createServerClientMock = jest.fn();

jest.mock("@/lib/supabase/server", () => ({
  createServerClient: (...a: unknown[]) => createServerClientMock(...a),
}));

type Row = { name: string; enabled: boolean };

/** Client minimal : une table `feature_flags` avec select/eq/upsert. */
function makeClient(rows: Row[], opts: { fail?: boolean; upsertSpy?: jest.Mock } = {}) {
  const upsertSpy = opts.upsertSpy ?? jest.fn().mockResolvedValue(undefined);
  return {
    upsertSpy,
    client: {
      from: (_table: string) => ({
        select: (_cols: string) => ({
          eq: (_col: string, value: unknown) => ({
            maybeSingle: () =>
              opts.fail
                ? Promise.reject(new Error("db down"))
                : Promise.resolve({ data: rows.find((r) => r.name === value) ?? null }),
          }),
          // select("name,enabled") sans eq : le resultat est thenable
          then: (resolve: (v: { data: Row[] | null }) => unknown) =>
            Promise.resolve({ data: opts.fail ? null : rows }).then(resolve),
        }),
        upsert: upsertSpy,
      }),
    },
  };
}

beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
});

async function load() {
  return import("@/lib/feature-flags-pg");
}

describe("isPgFlagEnabled", () => {
  it("lit la valeur en base", async () => {
    const { client } = makeClient([{ name: "emailClient", enabled: true }]);
    createServerClientMock.mockResolvedValue(client);
    const { isPgFlagEnabled } = await load();
    await expect(isPgFlagEnabled("emailClient")).resolves.toBe(true);
  });

  it("retourne faux quand le drapeau est absent", async () => {
    const { client } = makeClient([]);
    createServerClientMock.mockResolvedValue(client);
    const { isPgFlagEnabled } = await load();
    await expect(isPgFlagEnabled("inconnu")).resolves.toBe(false);
  });

  it("retourne faux, et non vrai, quand la base est indisponible", async () => {
    const { client } = makeClient([], { fail: true });
    createServerClientMock.mockResolvedValue(client);
    const { isPgFlagEnabled } = await load();
    await expect(isPgFlagEnabled("emailClient")).resolves.toBe(false);
  });

  it("met en cache : deux lectures rapprochees ne touchent la base qu'une fois", async () => {
    const { client } = makeClient([{ name: "f", enabled: true }]);
    createServerClientMock.mockResolvedValue(client);
    const { isPgFlagEnabled } = await load();
    await isPgFlagEnabled("f");
    await isPgFlagEnabled("f");
    expect(createServerClientMock).toHaveBeenCalledTimes(1);
  });
});

describe("setPgFeatureFlag", () => {
  it("ecrit le drapeau et invalide le cache immediatement", async () => {
    const upsertSpy = jest.fn().mockResolvedValue(undefined);
    const { client } = makeClient([{ name: "f", enabled: true }]);
    createServerClientMock.mockResolvedValue(client);
    const { isPgFlagEnabled, setPgFeatureFlag } = await load();

    await isPgFlagEnabled("f"); // remplit le cache a true
    expect(createServerClientMock).toHaveBeenCalledTimes(1);

    // La valeur en base change, mais on ecrit d'abord : le cache doit tomber.
    const after = makeClient([{ name: "f", enabled: false }], { upsertSpy });
    createServerClientMock.mockResolvedValue(after.client);
    await setPgFeatureFlag("f", false);

    await expect(isPgFlagEnabled("f")).resolves.toBe(false);
    expect(upsertSpy).toHaveBeenCalledTimes(1);
  });
});

describe("refreshPgFlagsCache", () => {
  it("remplit le cache a partir de la table", async () => {
    const { client } = makeClient([
      { name: "a", enabled: true },
      { name: "b", enabled: false },
    ]);
    createServerClientMock.mockResolvedValue(client);
    const { isPgFlagEnabled, refreshPgFlagsCache } = await load();
    await refreshPgFlagsCache();
    // Les deux lectures utilisent le cache rempli : aucun appel supplementaire.
    await expect(isPgFlagEnabled("a")).resolves.toBe(true);
    await expect(isPgFlagEnabled("b")).resolves.toBe(false);
    expect(createServerClientMock).toHaveBeenCalledTimes(1);
  });

  it("ne casse pas quand la table est indisponible", async () => {
    const { client } = makeClient([], { fail: true });
    createServerClientMock.mockResolvedValue(client);
    const { refreshPgFlagsCache } = await load();
    await expect(refreshPgFlagsCache()).resolves.toBeUndefined();
  });
});
