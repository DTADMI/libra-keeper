// Tests de lib/pg-listener.ts : le listener qui vide les caches quand un drapeau
// de fonctionnalite change.
//
// Deux proprietes comptent, et aucune des deux ne se voit a l'oeil nu :
//   1. demarrer deux fois ne doit pas creer deux abonnements (sinon chaque
//      changement de drapeau viderait le cache plusieurs fois, et le canal ne
//      serait plus jamais libere proprement) ;
//   2. arreter doit rendre l'etat inactif, et un echec d'abonnement ne doit pas
//      faire planter l'appelant.

const unsubscribeMock = jest.fn();
const removeChannelMock = jest.fn();
let capturedChangeHandler: (() => void) | null = null;

// L'API Supabase est CHAINABLE : channel().on().subscribe() retourne le canal
// lui-meme, pas un objet vide. Un simulacre qui renvoie {} produirait un
// channel.unsubscribe is not a function a l'arret, exactement le faux positif qui
// fait perdre une heure.
const channelObj: {
  on: jest.Mock;
  subscribe: jest.Mock;
  unsubscribe: jest.Mock;
} = {
  on: jest.fn(),
  subscribe: jest.fn(),
  unsubscribe: unsubscribeMock,
};
channelObj.on.mockImplementation((_event: string, _opts: unknown, handler: () => void) => {
  capturedChangeHandler = handler;
  return channelObj;
});
channelObj.subscribe.mockImplementation(() => channelObj);

const channelMock = jest.fn(() => channelObj);

const createServerClientMock = jest.fn();

jest.mock("@/lib/supabase/server", () => ({
  createServerClient: (...args: unknown[]) => createServerClientMock(...args),
}));

import {
  isListenerActive,
  registerFlushCallback,
  startFlagListener,
  stopFlagListener,
} from "@/lib/pg-listener";

beforeEach(() => {
  stopFlagListener();
  jest.clearAllMocks();
  capturedChangeHandler = null;
  createServerClientMock.mockResolvedValue({ channel: channelMock, removeChannel: removeChannelMock });
});

afterAll(() => {
  stopFlagListener();
});

describe("pg-listener", () => {
  it("est inactif au depart", () => {
    expect(isListenerActive()).toBe(false);
  });

  it("devient actif au demarrage et souscrit une fois", async () => {
    await startFlagListener();
    expect(isListenerActive()).toBe(true);
    expect(channelMock).toHaveBeenCalledTimes(1);
    expect(channelObj.on).toHaveBeenCalledTimes(1);
    expect(channelObj.subscribe).toHaveBeenCalledTimes(1);
  });

  it("ne cree pas un second abonnement si on demarre deux fois", async () => {
    await startFlagListener();
    await startFlagListener();
    expect(channelMock).toHaveBeenCalledTimes(1);
  });

  it("libere le canal et redevient inactif a l'arret", async () => {
    await startFlagListener();
    stopFlagListener();
    expect(unsubscribeMock).toHaveBeenCalledTimes(1);
    expect(removeChannelMock).toHaveBeenCalledTimes(1);
    expect(isListenerActive()).toBe(false);
  });

  it("un arret sans demarrage ne fait rien et ne plante pas", () => {
    expect(() => stopFlagListener()).not.toThrow();
    expect(unsubscribeMock).not.toHaveBeenCalled();
  });

  it("un echec d'abonnement n'empeche pas l'appelant de continuer", async () => {
    createServerClientMock.mockRejectedValue(new Error("supabase indisponible"));
    await expect(startFlagListener()).resolves.toBeUndefined();
    expect(isListenerActive()).toBe(false);
  });

  it("appelle les rappels enregistres quand un changement survient", async () => {
    const onFlush = jest.fn();
    const off = registerFlushCallback(onFlush);
    await startFlagListener();
    expect(capturedChangeHandler).not.toBeNull();
    capturedChangeHandler?.();
    // flushAllCaches est asynchrone et avale les erreurs : on laisse une boucle
    // d'evenements passer avant d'observer l'effet.
    await new Promise((r) => setTimeout(r, 0));
    expect(onFlush).toHaveBeenCalledTimes(1);
    off();
  });

  it("un rappel desinscrit n'est plus appele", async () => {
    const onFlush = jest.fn();
    const off = registerFlushCallback(onFlush);
    off();
    await startFlagListener();
    capturedChangeHandler?.();
    await new Promise((r) => setTimeout(r, 0));
    expect(onFlush).not.toHaveBeenCalled();
  });

  it("un rappel qui leve n'empeche pas les autres d'etre appeles", async () => {
    const bad = jest.fn(() => {
      throw new Error("boom");
    });
    const good = jest.fn();
    const offBad = registerFlushCallback(bad);
    const offGood = registerFlushCallback(good);
    await startFlagListener();
    capturedChangeHandler?.();
    await new Promise((r) => setTimeout(r, 0));
    expect(bad).toHaveBeenCalledTimes(1);
    expect(good).toHaveBeenCalledTimes(1);
    offBad();
    offGood();
  });
});
