// Tests de lib/pg-cache.ts : le cache a deux niveaux (Redis puis PostgreSQL).
//
// Le comportement important n'est pas le chemin nominal, mais les REPLIS :
//   - quand Redis n'est pas active, il ne doit pas etre interroge ;
//   - quand PostgreSQL echoue, la fonction retourne null au lieu de propager ;
//   - quand Redis repond, PostgreSQL ne doit pas etre interroge.

// Ce fichier n'a aucun import de premier niveau (tout est simule et importe
// dynamiquement). Sans `export {}`, TypeScript le traite comme un SCRIPT et sa
// portee devient globale, ce qui entre en collision avec un autre fichier de test.
export {};

const redisGet = jest.fn();
const redisSet = jest.fn();
const redisDel = jest.fn();
const createServerClientMock = jest.fn();

jest.mock("@/lib/redis", () => ({
  redis: {
    get: (...a: unknown[]) => redisGet(...a),
    set: (...a: unknown[]) => redisSet(...a),
    del: (...a: unknown[]) => redisDel(...a),
  },
}));

jest.mock("@/lib/supabase/server", () => ({
  createServerClient: (...a: unknown[]) => createServerClientMock(...a),
}));

/** Construit un client Supabase minimal, avec une trace des appels. */
function makeClient(options: {
  flagEnabled?: boolean;
  cacheValue?: unknown;
  fail?: boolean;
}) {
  const calls: string[] = [];
  const chain = <T,>() => {
    const q = {
      select: () => q,
      eq: () => q,
      gt: () => q,
      like: () => q,
      delete: () => {
        calls.push("delete");
        return q;
      },
      upsert: () => {
        calls.push("upsert");
        return Promise.resolve();
      },
      maybeSingle: () => {
        if (options.fail) return Promise.reject(new Error("db down"));
        return Promise.resolve({ data: null });
      },
    };
    return q as unknown as T;
  };
  const client = {
    from: (table: string) => {
      calls.push(table);
      if (table === "feature_flags") {
        return {
          select: () => ({
            eq: () => ({
              maybeSingle: () =>
                options.fail
                  ? Promise.reject(new Error("db down"))
                  : Promise.resolve({ data: { enabled: options.flagEnabled ?? false } }),
            }),
          }),
        };
      }
      if (table === "app_cache") {
        return {
          select: () => ({
            eq: () => ({
              gt: () => ({
                maybeSingle: () =>
                  options.fail
                    ? Promise.reject(new Error("db down"))
                    : Promise.resolve({ data: options.cacheValue === undefined ? null : { value: options.cacheValue } }),
              }),
            }),
          }),
          upsert: () => {
            calls.push("upsert");
            return Promise.resolve();
          },
          delete: () => ({
            eq: () => {
              calls.push("delete-eq");
              return Promise.resolve();
            },
            like: () => {
              calls.push("delete-like");
              return Promise.resolve();
            },
          }),
        };
      }
      return chain();
    },
  };
  return { client, calls };
}

const originalRedisCache = process.env.REDIS_CACHE;

beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
  delete process.env.REDIS_CACHE;
  redisGet.mockResolvedValue(null);
  redisSet.mockResolvedValue("OK");
  redisDel.mockResolvedValue(1);
});

afterAll(() => {
  if (originalRedisCache === undefined) delete process.env.REDIS_CACHE;
  else process.env.REDIS_CACHE = originalRedisCache;
});

async function loadCache() {
  return import("@/lib/pg-cache");
}

describe("pgGetCached", () => {
  it("retourne la valeur de PostgreSQL quand le cache est vide", async () => {
    const { client } = makeClient({ cacheValue: { hello: "world" } });
    createServerClientMock.mockResolvedValue(client);
    const { pgGetCached } = await loadCache();
    await expect(pgGetCached<{ hello: string }>("k")).resolves.toEqual({ hello: "world" });
  });

  it("retourne null quand la cle est absente", async () => {
    const { client } = makeClient({ cacheValue: undefined });
    createServerClientMock.mockResolvedValue(client);
    const { pgGetCached } = await loadCache();
    await expect(pgGetCached("k")).resolves.toBeNull();
  });

  it("retourne null au lieu de propager une erreur de base", async () => {
    const { client } = makeClient({ fail: true });
    createServerClientMock.mockResolvedValue(client);
    const { pgGetCached } = await loadCache();
    await expect(pgGetCached("k")).resolves.toBeNull();
  });

  it("n'interroge pas Redis quand il n'est pas active", async () => {
    const { client } = makeClient({ cacheValue: { a: 1 } });
    createServerClientMock.mockResolvedValue(client);
    const { pgGetCached } = await loadCache();
    await pgGetCached("k");
    expect(redisGet).not.toHaveBeenCalled();
  });

  it("lit Redis en premier quand REDIS_CACHE vaut true, sans toucher a PostgreSQL", async () => {
    process.env.REDIS_CACHE = "true";
    redisGet.mockResolvedValue(JSON.stringify({ from: "redis" }));
    const { client, calls } = makeClient({ cacheValue: { from: "pg" } });
    createServerClientMock.mockResolvedValue(client);
    const { pgGetCached } = await loadCache();
    await expect(pgGetCached("k")).resolves.toEqual({ from: "redis" });
    expect(calls).not.toContain("app_cache");
  });

  it("rechauffe Redis apres une lecture PostgreSQL quand Redis est active", async () => {
    process.env.REDIS_CACHE = "true";
    redisGet.mockResolvedValue(null);
    const { client } = makeClient({ cacheValue: { a: 1 } });
    createServerClientMock.mockResolvedValue(client);
    const { pgGetCached } = await loadCache();
    await pgGetCached("k");
    expect(redisSet).toHaveBeenCalledWith("cache:k", JSON.stringify({ a: 1 }), { ex: 30 });
  });
});

describe("pgSetCached et les ecritures", () => {
  it("ecrit la valeur avec une expiration", async () => {
    const { client, calls } = makeClient({});
    createServerClientMock.mockResolvedValue(client);
    const { pgSetCached } = await loadCache();
    await pgSetCached("k", { a: 1 }, 60);
    expect(calls).toContain("upsert");
  });

  it("n'echoue pas si la base est indisponible", async () => {
    createServerClientMock.mockRejectedValue(new Error("db down"));
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const { pgSetCached, pgDeleteCached, pgInvalidatePattern } = await loadCache();
    await expect(pgSetCached("k", { a: 1 })).resolves.toBeUndefined();
    await expect(pgDeleteCached("k")).resolves.toBeUndefined();
    await expect(pgInvalidatePattern("k")).resolves.toBeUndefined();
    errorSpy.mockRestore();
  });

  it("supprime une cle et invalide un motif", async () => {
    const { client, calls } = makeClient({});
    createServerClientMock.mockResolvedValue(client);
    const { pgDeleteCached, pgInvalidatePattern } = await loadCache();
    await pgDeleteCached("k");
    await pgInvalidatePattern("items:");
    expect(calls).toContain("delete-eq");
    expect(calls).toContain("delete-like");
  });
});
