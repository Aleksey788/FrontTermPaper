"use client";

import Link from "next/link";
import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import styles from "./AuthRequiredDialog.module.css";

export default function AuthRequiredDialog({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);

  return createPortal(
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <button type="button" className={styles.close} aria-label="Закрыть" onClick={onClose}>×</button>
      <h2 id={titleId}>Необходима авторизация</h2>
      <p id={descriptionId}>Чтобы начать план, необходимо сначала войти в аккаунт.</p>
      <Link href="/login" className={styles.login}>Войти</Link>
    </dialog>,
    document.body,
  );
}
