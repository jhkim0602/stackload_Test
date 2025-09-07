"use client";

import { create } from "zustand";

export type TechItem = {
  slug: string;
  name: string;
  category: "frontend" | "backend" | "data";
  tags: string[];
  description: string;
};

type TechState = {
  items: TechItem[];
  setItems: (items: TechItem[]) => void;
};

export const useTechStore = create<TechState>((set) => ({
  items: [],
  setItems: (items) => set({ items }),
}));


