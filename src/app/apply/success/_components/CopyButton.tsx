"use client"; // This tells Next.js this component can use browser features
import { useState } from "react";
import style from "./CopyButton.module.css";

export default function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    const fallbackCopy = (value: string) => {
        const el = document.createElement("textarea");
        el.value = value;
        document.body.appendChild(el);
        el.select();
        try {
            document.execCommand("copy");
            document.body.removeChild(el);
            return true;
        } catch {
            document.body.removeChild(el);
            return false;
        }
    };

    const handleCopy = async () => {
        if (!text) return;
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
            } else {
                fallbackCopy(text);
            }
            setCopied(true);
            setTimeout(() => setCopied(false), 2200);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <>
            <button
                className={copied ? `${style.copyButton} ${style.copied}` : style.copyButton}
                onClick={handleCopy}
                aria-label={copied ? "Tracking ID copied" : "Copy tracking ID"}
                title={copied ? "Copied" : "Copy tracking ID"}
            >
                <span className={style.icon} aria-hidden>
                    {copied ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 21H8a2 2 0 0 1-2-2V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><rect x="14" y="3" width="7" height="14" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    )}
                </span>
                <span className={style.label}>{copied ? "Copied" : "Copy"}</span>
            </button>
            <span className={style.srOnly} role="status" aria-live="polite">
                {copied ? "Tracking ID copied to clipboard" : ""}
            </span>
        </>
    );
}