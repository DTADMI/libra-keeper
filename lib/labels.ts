// lib/labels.ts — Shared item type labels (eliminates 4x duplication)
// Used by: items/new, items/[id]/edit, items/[id], dashboard

export const TYPE_LABELS: Record<string, string> = {
  BOOK: "Book",
  MUSIC: "Music",
  MOVIE: "Movie",
  GAME: "Game",
  TOY: "Toy",
  CLOTHES: "Clothing",
  OTHER: "Other",
};

export const TYPE_SUBTITLE: Record<string, string> = {
  BOOK: "by",
  MUSIC: "by",
  MOVIE: "dir.",
  GAME: "Brand:",
  TOY: "Brand:",
  CLOTHES: "Brand:",
  OTHER: "By",
};

export const CREATOR_LABELS: Record<string, string> = {
  BOOK: "Author",
  MUSIC: "Artist",
  MOVIE: "Director",
  GAME: "Developer",
  TOY: "Brand",
  CLOTHES: "Creator",
  OTHER: "Creator",
};

export const IDENTIFIER_LABELS: Record<string, string> = {
  BOOK: "ISBN",
  MUSIC: "UPC",
  MOVIE: "Barcode/EAN",
  GAME: "SKU/EAN",
  TOY: "Identifier",
  CLOTHES: "Identifier",
  OTHER: "Identifier",
};

export const MAKER_LABELS: Record<string, string> = {
  BOOK: "Publisher",
  MUSIC: "Label",
  MOVIE: "Studio",
  GAME: "Manufacturer",
  TOY: "Maker",
  CLOTHES: "Maker",
  OTHER: "Maker",
};
