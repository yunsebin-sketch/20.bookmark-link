"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import Toast from "@/components/Toast";

export default function ForgotPasswordPage() {
  const [supabase] = useState(() => createClient());

  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [toast, setToast] = useState("");

  const emailRef = useRef<HTMLInputElement>(null);

  // 브라우저 자동완성은 onChange 없이 값을 채우므로 실제 input 값을 반영한다.
  useEffect(() => {
    if (emailRef.current?.value) setEmail(emailRef.current.value);
  }, []);

  const canSubmit = email.trim() !== "" && !submitting;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const currentEmail = (emailRef.current?.value ?? email).trim();
    if (!currentEmail || submitting) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(currentEmail, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      });

      if (error) {
        if (error.message.toLowerCase().includes("rate limit")) {
          setToast("요청이 너무 많습니다. 잠시 후 다시 시도해주세요.");
        } else {
          setToast("링크 발송에 실패했습니다. 잠시 후 다시 시도해주세요.");
        }
        return;
      }

      setSent(true);
    } catch {
      setToast("링크 발송에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-6 py-10">
      {toast && <Toast message={toast} onClose={() => setToast("")} />}

      <div className="flex w-full max-w-sm flex-col gap-8 rounded-lg border border-[var(--border)] bg-[var(--card)] p-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-center text-2xl font-bold tracking-tight text-[var(--text)]">
            비밀번호 찾기
          </h1>
          <p className="text-center text-sm text-[var(--text-sub)]">
            가입한 이메일로 비밀번호 재설정 링크를 보내드립니다.
          </p>
        </div>

        {sent ? (
          <p className="rounded-md border border-[var(--border)] bg-[var(--hover-bg)] px-4 py-3 text-center text-sm text-[var(--text)]">
            {email.trim()}(으)로 재설정 링크를 보냈습니다. 메일함을 확인해주세요.
          </p>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium text-[var(--text)]"
              >
                이메일
              </label>
              <input
                ref={emailRef}
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                onAnimationStart={(event) => {
                  if (event.animationName === "onAutoFillStart") {
                    setEmail(event.currentTarget.value);
                  }
                }}
                placeholder="you@example.com"
                className="input-field w-full text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className="hover-accent mt-2 rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--on-accent)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {submitting ? "발송 중..." : "비밀번호 리셋 링크 발송"}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-[var(--text-sub)]">
          <Link
            href="/login"
            className="font-medium text-[var(--accent)] hover:underline"
          >
            로그인으로 돌아가기
          </Link>
        </p>
      </div>
    </div>
  );
}
