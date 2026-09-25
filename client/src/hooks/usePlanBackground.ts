"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import backgrounds from "@/data/habitPlanBackgrounds.json";

const cardCount = 4;
const imagePool = [...new Set(
  Object.values(backgrounds).flatMap(({ images }) => images.map(({ localSrc }) => localSrc)),
)];

type BackgroundStyle = CSSProperties & { "--habit-plan-background": string };

export function selectPlanBackgrounds(): string[] {
  const shuffled = [...imagePool];

  // Fisher–Yates: sample without replacement from the shared image pool.
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled.slice(0, cardCount);
}

export function usePlanBackground(): BackgroundStyle[] {
  const selection = useRef<string[] | null>(null);
  const [loaded, setLoaded] = useState<(string | null)[]>([]);

  useEffect(() => {
    // Choose only after hydration; keep the choice when Strict Mode replays the effect.
    if (selection.current === null) {
      selection.current = selectPlanBackgrounds();
    }

    const images = selection.current.map((src, index) => {
      const image = new Image();
      const publish = (value: string | null) => {
        setLoaded((previous) => {
          const next = [...previous];
          next[index] = value;
          return next;
        });
      };

      image.onload = () => publish(src);
      image.onerror = () => publish(null);
      image.src = src;
      return image;
    });

    return () => {
      images.forEach((image) => {
        image.onload = null;
        image.onerror = null;
      });
    };
  }, []);

  return Array.from({ length: cardCount }, (_, index) => ({
    "--habit-plan-background": loaded[index]
      ? `url(${JSON.stringify(loaded[index])})`
      : "none",
  }));
}
