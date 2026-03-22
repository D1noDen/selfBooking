import { useEffect, useRef, useState } from "react";

const RECAPTCHA_SCRIPT_ID = "recaptcha-v2-script";

const SCRIPT_URLS = [
  import.meta?.env?.VITE_RECAPTCHA_SCRIPT_URL,
  "https://www.google.com/recaptcha/api.js?render=explicit",
  "https://www.recaptcha.net/recaptcha/api.js?render=explicit",
].filter(Boolean);

const loadScript = (src) =>
  new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = RECAPTCHA_SCRIPT_ID;
    script.src = src;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.grecaptcha);
    script.onerror = () => {
      script.remove();
      reject(new Error(`Failed to load ${src}`));
    };
    document.body.appendChild(script);
  });

const loadRecaptchaScript = () => {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.grecaptcha) return Promise.resolve(window.grecaptcha);
  const existing = document.getElementById(RECAPTCHA_SCRIPT_ID);
  if (existing) {
    if (window.grecaptcha) return Promise.resolve(window.grecaptcha);
    existing.remove();
  }

  return SCRIPT_URLS.reduce((promise, src) => {
    return promise.catch(() => loadScript(src));
  }, Promise.reject(new Error("No script loaded")));
};

const RecaptchaModal = ({ open, siteKey, onVerify, onClose }) => {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    if (!siteKey) {
      setError("Missing reCAPTCHA site key.");
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError("");

    loadRecaptchaScript()
      .then((grecaptcha) => {
        if (cancelled || !grecaptcha || !containerRef.current) return;
        if (widgetIdRef.current !== null) return;
        widgetIdRef.current = grecaptcha.render(containerRef.current, {
          sitekey: siteKey,
          callback: (token) => {
            if (typeof onVerify === "function") onVerify(token);
          },
          "expired-callback": () => {
            if (typeof grecaptcha.reset === "function" && widgetIdRef.current !== null) {
              grecaptcha.reset(widgetIdRef.current);
            }
          },
        });
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load reCAPTCHA.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, siteKey, onVerify]);

  useEffect(() => {
    if (open) return;
    if (window.grecaptcha && widgetIdRef.current !== null) {
      window.grecaptcha.reset(widgetIdRef.current);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-[420px] rounded-[12px] bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
        <div className="text-[18px] font-sans font-semibold text-[#2F3441] mb-3">
          Complete verification
        </div>
        <div className="text-[14px] text-[#6A7282] mb-4">
          Please confirm you are not a robot to continue.
        </div>
        <div ref={containerRef} className="min-h-[78px]" />
        {loading && (
          <div className="mt-3 text-[12px] text-[#6A7282]">Loading captcha…</div>
        )}
        {error && (
          <div className="mt-3 text-[12px] text-red-500">{error}</div>
        )}
        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-[8px] border border-[#D8DBE2] px-4 py-2 text-[14px] text-[#2F3441]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecaptchaModal;
