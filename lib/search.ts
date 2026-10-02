// ─────────────────────────────────────────────────────────
// LibraKeeper - configuration de recherche plein texte (feature B4)
//
// Le vecteur de recherche est construit en francais (migration 008) sauf pour
// l'ISBN, indexe en configuration simple (chiffres). La requete doit donc
// utiliser la MEME configuration que le vecteur, sinon la recherche echoue pour
// des mots francais (bug corrige ici : la requete etait codee en anglais).
// ─────────────────────────────────────────────────────────

export type SearchConfig = "french" | "simple";

/** Vrai si la requete est exactement un ISBN (10/13 chiffres, X final tolere, tirets et espaces ignores). */
export function looksLikeIsbn(query: string): boolean {
  const stripped = query.replace(/[-\s]/g, "");
  return /^\d{13}$/.test(stripped) || /^\d{9}[\dX]$/i.test(stripped);
}

/**
 * Configuration Postgres a utiliser pour la requete :
 * - ISBN -> simple (le vecteur ISBN est indexe en simple) ;
 * - sinon -> francais (le reste du vecteur).
 */
export function searchTsConfig(query: string): SearchConfig {
  return looksLikeIsbn(query.trim()) ? "simple" : "french";
}
