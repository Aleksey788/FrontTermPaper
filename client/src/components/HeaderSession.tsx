"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { apiService } from "@/service/ApiService";
import styles from "./HeaderSession.module.css";

type Session =
  | { kind: "loading" | "unauthenticated" | "error" }
  | { kind: "authenticated"; userId: number; email?: string | null };

export default function HeaderSession({ loginClassName }: { loginClassName: string }) {
  const [session, setSession] = useState<Session>({ kind: "loading" });
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownId = useId();

  useEffect(() => {
    let active = true;
    let version = 0;
    function refreshSession() {
      const requestVersion = ++version;
      void apiService.apiClient.get<{ userId: number; email?: string | null }>("/me", {
        validateStatus: (status) => status === 401 || (status >= 200 && status < 300),
      }).then((response) => {
        if (!active || requestVersion !== version) return;
        if (response.status === 401) {
          setSession({ kind: "unauthenticated" });
          setOpen(false);
        } else {
          setSession({ kind: "authenticated", ...response.data });
        }
      }).catch(() => {
        if (active && requestVersion === version) {
          setSession({ kind: "error" });
          setOpen(false);
        }
      });
    }
    refreshSession();
    window.addEventListener("session-changed", refreshSession);
    window.addEventListener("focus", refreshSession);
    return () => {
      active = false;
      window.removeEventListener("session-changed", refreshSession);
      window.removeEventListener("focus", refreshSession);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    function outsideClick(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", outsideClick);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outsideClick);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  async function logout() {
    if (loggingOut) return;
    setLoggingOut(true);
    setLogoutError(null);
    try {
      await apiService.apiClient.post("/logout");
      localStorage.removeItem("userId");
      setSession({ kind: "unauthenticated" });
      setOpen(false);
      window.dispatchEvent(new Event("session-changed"));
    } catch {
      setLogoutError("Не удалось выйти. Попробуйте ещё раз.");
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <div className={styles.session} ref={containerRef}>
      {session.kind === "loading" ? (
        <span className={styles.loading} role="status" aria-label="Проверка авторизации" />
      ) : session.kind !== "authenticated" ? (
        <Link href="/login" className={`${loginClassName} ${styles.login}`}>Вход</Link>
      ) : (
        <>
          <button
            ref={triggerRef}
            type="button"
            className={styles.trigger}
            aria-expanded={open}
            aria-controls={open ? dropdownId : undefined}
            onClick={() => { setOpen(!open); setLogoutError(null); }}
          >
            Аккаунт <span aria-hidden="true" className={styles.arrow}>{open ? "▴" : "▾"}</span>
          </button>
          {open && (
            <div id={dropdownId} className={styles.dropdown} role="region" aria-label="Аккаунт">
              <div className={styles.identity}>
                <p>{session.email ? "Вы вошли как" : "Вы вошли в аккаунт"}</p>
                {session.email && <p className={styles.email}>{session.email}</p>}
              </div>
              <button type="button" className={styles.logout} disabled={loggingOut} onClick={logout}>
                {loggingOut ? "Выход..." : "Выйти"}
              </button>
              {logoutError && <p className={styles.error} role="alert">{logoutError}</p>}
            </div>
          )}
        </>
      )}
    </div>
  );
}
