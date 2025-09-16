"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type FavoritesState = {
  slugs: string[];
  toggle: (slug: string) => void;
  has: (slug: string) => boolean;
  clear: () => void;
};

export const useFavorites = create<FavoritesState>()(
  persist(
    (set, get) => ({
      slugs: [],
      toggle: (slug) => {
        const setCurrent = new Set(get().slugs);
        if (setCurrent.has(slug)) setCurrent.delete(slug);
        else setCurrent.add(slug);
        set({ slugs: Array.from(setCurrent) });
      },
      has: (slug) => get().slugs.includes(slug),
      clear: () => set({ slugs: [] }),
    }),
    { name: "stackload-favorites" }
  )
);


