"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Toast from "@/components/Toast";

function toKoreanMessage(message: string): string {
  const normalized = message.toLowerCase();
  if (normalized.includes("invalid login credentials")) {
    return "이메일 또는 비밀번호가 올바르지 않습니다.";
  }
  if (normalized.includes("email not confirmed")) {
    return "이메일 인증이 완료되지 않았습니다. 메일함을 확인해주세요.";
  }
  if (normalized.includes("email") && (normalized.includes("invalid") || normalized.includes("valid"))) {
    return "올바른 이메일 형식이 아닙니다.";
  }
  if (normalized.includes("rate limit") || normalized.includes("too many")) {
    return "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.";
  }
  return "로그인에 실패했습니다. 잠시 후 다시 시도해주세요.";
}

export default function LoginPage() {
  const router = useRouter();
  const [supabase] = useState(() => createClient());

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState("");

  const canSubmit = email.trim() !== "" && password !== "" && !submitting;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setToast(toKoreanMessage(error.message));
        return;
      }

      router.push("/");
    } catch {
      setToast("로그인에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-6 py-10">
      {toast && <Toast message={toast} onClose={() => setToast("")} />}

      <div className="flex w-full max-w-sm flex-col gap-8 rounded-lg border border-[var(--border)] bg-[var(--card)] p-8">
        <h1 className="text-center text-2xl font-bold tracking-tight text-[var(--text)]">
          북마크 링크
        </h1>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-sm font-medium text-[var(--text)]"
            >
              이메일
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="input-field w-full text-sm"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-sm font-medium text-[var(--text)]"
            >
              비밀번호
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="비밀번호를 입력하세요"
              className="input-field w-full text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="hover-accent mt-2 rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <p className="text-center text-sm text-[var(--text-sub)]">
          아직 계정이 없으신가요?{" "}
          <Link
            href="/signup"
            className="font-medium text-[var(--accent)] hover:underline"
          >
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
