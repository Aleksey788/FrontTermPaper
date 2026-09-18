"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import styles from "./layout.module.css";

type Background = {
  url: string;
  quote: { text: string; author: string } | null;
};

export default function LoginBackdrop({ children }: { children: ReactNode }) {
  const [background, setBackground] = useState<Background | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let objectUrl: string | undefined;

    async function loadBackground() {
      try {
        const response = await fetch("/api/login/background", {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok || !response.headers.get("Content-Type")?.startsWith("image/")) return;

        const quoteText = response.headers.get("X-Quote-Text");
        const quoteAuthor = response.headers.get("X-Quote-Author");
        let quote: Background["quote"] = null;
        if (quoteText && quoteAuthor) {
          try {
            quote = { text: decodeURIComponent(quoteText), author: decodeURIComponent(quoteAuthor) };
          } catch {
            // Invalid quote metadata must not prevent the image from loading.
          }
        }

        objectUrl = URL.createObjectURL(await response.blob());
        if (!controller.signal.aborted) setBackground({ url: objectUrl, quote });
        else URL.revokeObjectURL(objectUrl);
      } catch {
        // The existing dark background remains if the image is unavailable.
      }
    }

    void loadBackground();
    return () => {
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

  const backgroundStyle = background
    ? ({ "--auth-background-image": `url("${background.url}")` } as CSSProperties)
    : undefined;

  return (
    <div className={styles.authPage} style={backgroundStyle}>
      {children}
      {background?.quote && (
        <figure className={styles.quoteCard}>
          <blockquote>«{background.quote.text}»</blockquote>
          <figcaption>— {background.quote.author}</figcaption>
        </figure>
      )}
    </div>
  );
}
