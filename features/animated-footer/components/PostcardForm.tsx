"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import styles from "../styles/classes";
import { ASSET_BASE, DEFAULT_SUBJECT, OWNER_EMAIL } from "../utils/animationConfig";
import type { MessagePayload } from "../utils/mockSubmit";

export type PostcardPhase = "open" | "closing" | "hidden" | "opening";

type Props = {
  phase: PostcardPhase;
  /** Narrow layout: the postcard is drawn on a taller canvas so its text stays readable. */
  compact: boolean;
  /** True while a message is being sent (submit is disabled). */
  busy: boolean;
  /** What the Send button says while it is disabled. */
  busyLabel?: string;
  /** Message to show in place of the toolbar (e.g. a failed send). */
  externalError?: string | null;
  onSubmit: (payload: MessagePayload) => void;
  onFirstInput?: () => void;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Decorative window chrome. Only the fields and the Send button are interactive.
const Paperclip = () => (
  <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden>
    <path d="M20 11.5l-8.2 8.2a5 5 0 01-7-7l8.6-8.6a3.4 3.4 0 014.8 4.8l-8.6 8.6a1.7 1.7 0 01-2.4-2.4l7.6-7.6" />
  </svg>
);
const Smiley = () => (
  <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden>
    <circle cx="12" cy="12" r="9.2" />
    <path d="M8.3 14.2a4.6 4.6 0 007.4 0" />
    <path d="M9 9.6h.01M15 9.6h.01" strokeWidth="3" />
  </svg>
);
const Link = () => (
  <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden>
    <path d="M10 14a4.2 4.2 0 005.9 0l3-3a4.2 4.2 0 00-5.9-5.9l-1 1M14 10a4.2 4.2 0 00-5.9 0l-3 3a4.2 4.2 0 005.9 5.9l1-1" />
  </svg>
);
const List = () => (
  <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden>
    <path d="M9 6h11M9 12h11M9 18h11" />
    <path d="M4.5 6h.01M4.5 12h.01M4.5 18h.01" strokeWidth="3" />
  </svg>
);
const Plane = () => (
  <svg className={styles.sendIcon} viewBox="0 0 24 24" aria-hidden>
    <path d="M21.6 2.4a1 1 0 00-1-.2L2.9 9.6a1 1 0 00.05 1.9l6.1 2.3 2.3 6.1a1 1 0 001.9.05L21.8 3.4a1 1 0 00-.2-1zM10.5 12.6l7-5.6-4.7 7.2z" />
  </svg>
);

export default function PostcardForm({ phase, compact, busy, busyLabel = "Sending…", externalError, onSubmit, onFirstInput }: Props) {
  const uid = useId();
  const [values, setValues] = useState({ email: "", subject: DEFAULT_SUBJECT, message: "" });
  const [error, setError] = useState<string | null>(null);
  const touched = useRef(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const set = (key: keyof typeof values) => (e: { target: { value: string } }) => {
    if (!touched.current) {
      touched.current = true;
      onFirstInput?.();
    }
    setError(null);
    setValues((v) => ({ ...v, [key]: e.target.value }));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    const email = values.email.trim();
    const message = values.message.trim();
    if (!EMAIL_RE.test(email)) return fail("That email doesn’t look right.", emailRef);
    if (!message) return fail("Write a little something first.", messageRef);
    setError(null);
    onSubmit({ email, subject: values.subject.trim() || DEFAULT_SUBJECT, message });
  };
  const fail = (text: string, ref: { current: HTMLElement | null }) => {
    setError(text);
    ref.current?.focus();
  };

  const shown = error ?? externalError;
  return (
    <div className={styles.card} data-phase={phase} data-compact={compact}>
      <form className={styles.form} onSubmit={submit} noValidate aria-label="Send me a message" aria-busy={busy}>
        <div className={styles.window}>
          <div className={styles.titlebar} aria-hidden>
            <div className={styles.dots}>
              <span className={styles.dot} style={{ background: "#e65440" }} />
              <span className={styles.dot} style={{ background: "#ebb73b" }} />
              <span className={styles.dot} style={{ background: "#6a9f46" }} />
            </div>
            <div className={styles.titleIcons}>
              <Paperclip />
              <Smiley />
              <span>Aa</span>
            </div>
          </div>

          <div className={styles.fields}>
            <div className={`${styles.row} ${styles.rowTo}`}>
              <span className={styles.label}>To</span>
              <span className={`${styles.pill} ${styles.pillStatic}`}>
                {OWNER_EMAIL}
                <svg className={styles.icon} style={{ width: "calc(var(--u) * 26)", height: "calc(var(--u) * 26)", color: "#9a9288" }} viewBox="0 0 24 24" aria-hidden>
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </span>
            </div>

            <div className={`${styles.row} ${styles.rowFrom}`}>
              <label className={styles.label} htmlFor={`${uid}-email`}>
                From
              </label>
              <span className={`${styles.pill} ${styles.pillInput}`}>
                <input id={`${uid}-email`} ref={emailRef} className={styles.input} type="email" name="email" autoComplete="email" placeholder="you@email.com" value={values.email} onChange={set("email")} disabled={busy} required />
              </span>
            </div>

            <div className={`${styles.row} ${styles.rowSubject}`}>
              <label className={styles.label} htmlFor={`${uid}-subject`}>
                Subject
              </label>
              <input id={`${uid}-subject`} className={`${styles.input} ${styles.subject}`} type="text" name="subject" value={values.subject} onChange={set("subject")} disabled={busy} />
            </div>

            <div className={styles.messageWrap}>
              <label className={styles.srOnly} htmlFor={`${uid}-message`}>
                Message
              </label>
              <textarea id={`${uid}-message`} ref={messageRef} className={styles.textarea} name="message" placeholder="Write a message…" value={values.message} onChange={set("message")} disabled={busy} required />
            </div>
          </div>

          <div className={styles.toolbar}>
            {shown ? (
              <p role="alert" style={{ margin: 0, fontSize: "calc(var(--u) * 30)", fontWeight: 600, color: "#c4331a" }}>
                {shown}
              </p>
            ) : (
              <div className={styles.tools} aria-hidden>
                <span>B</span>
                <span style={{ fontStyle: "italic", fontWeight: 500 }}>I</span>
                <span style={{ textDecoration: "underline" }}>U</span>
                <Link />
                <List />
                <Smiley />
              </div>
            )}
            <button className={styles.send} type="submit" disabled={busy}>
              {busy ? busyLabel : "Send"}
              <Plane />
            </button>
          </div>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element -- cut-out of the supplied postcard art, sized by CSS */}
        <img className={styles.envelopeFront} src={`${ASSET_BASE}/postcard/envelope-front.png`} alt="" draggable={false} />
      </form>
    </div>
  );
}
