// Tests de lib/auth-utils.ts : le module qui decide qui est connecte et qui est
// administrateur. Il etait le seul module de securite sans test.
//
// Deux dependances sont mockees :
//   - `react.cache`, pour que les helpers memoises redeviennent de simples
//     fonctions (hors rendu serveur, `cache` n'a pas de sens dans un test) ;
//   - `@/lib/supabase/server`, pour injecter une session controlee.

jest.mock("react", () => {
  const actual = jest.requireActual("react") as Record<string, unknown>;
  return { ...actual, cache: (fn: unknown) => fn };
});

const createServerClientMock = jest.fn();
jest.mock("@/lib/supabase/server", () => ({
  createServerClient: (...args: unknown[]) => createServerClientMock(...args),
}));

import { getCurrentUser, getServerAuth, requireAdmin, requireAuth } from "@/lib/auth-utils";

type MockUser =
  | {
      id: string;
      email?: string | null;
      user_metadata?: Record<string, unknown> | null;
    }
  | null;

function makeSupabase(user: MockUser, profileRow: unknown = null) {
  return {
    auth: { getUser: jest.fn().mockResolvedValue({ data: { user } }) },
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn().mockResolvedValue({ data: profileRow }),
    }),
  };
}

beforeEach(() => {
  createServerClientMock.mockReset();
});

describe("getServerAuth", () => {
  it("renvoie user: null quand il n'y a pas de session", async () => {
    createServerClientMock.mockResolvedValue(makeSupabase(null));
    await expect(getServerAuth()).resolves.toEqual({ user: null });
  });

  it("mappe l'utilisateur et lit le role dans la table profiles", async () => {
    createServerClientMock.mockResolvedValue(
      makeSupabase(
        { id: "u1", email: "a@b.ca", user_metadata: { name: "Alice", avatar_url: "http://img" } },
        { role: "ADMIN" },
      ),
    );
    await expect(getServerAuth()).resolves.toEqual({
      user: { id: "u1", email: "a@b.ca", name: "Alice", role: "ADMIN", image: "http://img" },
    });
  });

  it("retombe sur le role USER et sur des valeurs sures quand le profil manque", async () => {
    createServerClientMock.mockResolvedValue(makeSupabase({ id: "u2" }, null));
    const session = await getServerAuth();
    expect(session.user).not.toBeNull();
    expect(session.user?.role).toBe("USER");
    expect(session.user?.email).toBe("");
    expect(session.user?.name).toBeNull();
    expect(session.user?.image).toBeNull();
  });
});

describe("getCurrentUser, requireAuth, requireAdmin", () => {
  it("requireAuth rejette une session anonyme", async () => {
    createServerClientMock.mockResolvedValue(makeSupabase(null));
    await expect(requireAuth()).rejects.toThrow("Not authenticated");
  });

  it("getCurrentUser renvoie null sans session", async () => {
    createServerClientMock.mockResolvedValue(makeSupabase(null));
    await expect(getCurrentUser()).resolves.toBeNull();
  });

  it("requireAuth renvoie l'utilisateur connecte", async () => {
    createServerClientMock.mockResolvedValue(makeSupabase({ id: "u3" }, { role: "USER" }));
    await expect(requireAuth()).resolves.toMatchObject({ id: "u3", role: "USER" });
  });

  it("requireAdmin rejette un utilisateur non administrateur", async () => {
    createServerClientMock.mockResolvedValue(makeSupabase({ id: "u4" }, { role: "USER" }));
    await expect(requireAdmin()).rejects.toThrow("Not authorized");
  });

  it("requireAdmin renvoie l'administrateur", async () => {
    createServerClientMock.mockResolvedValue(makeSupabase({ id: "u5" }, { role: "ADMIN" }));
    await expect(requireAdmin()).resolves.toMatchObject({ id: "u5", role: "ADMIN" });
  });
});
