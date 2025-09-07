"use client";

import { create } from "zustand";
import type { Tech, TechCategory } from "@/lib/types";

export type TechItem = Pick<Tech, "slug" | "name" | "category" | "tags" | "description" | "logoUrl"> & {
  category: TechCategory;
};

type TechState = {
  items: TechItem[];
  setItems: (items: TechItem[]) => void;
};

export const useTechStore = create<TechState>((set) => ({
  items: [],
  setItems: (items) => set({ items }),
}));


