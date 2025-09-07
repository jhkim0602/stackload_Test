"use client";

import { Button } from "@/components/ui/button";
import { useFavorites } from "@/store/favorites-store";
import { Heart } from "lucide-react";

export function FavoriteButton({ slug }: { slug: string }) {
  const toggle = useFavorites((s) => s.toggle);
  const has = useFavorites((s) => s.has(slug));
  return (
    <Button variant={has ? "secondary" : "outline"} onClick={() => toggle(slug)}>
      <Heart className="size-4 mr-2" /> {has ? "즐겨찾기 해제" : "즐겨찾기"}
    </Button>
  );
}


