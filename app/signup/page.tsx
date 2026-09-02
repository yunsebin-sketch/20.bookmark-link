"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Toast from "@/components/Toast";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";

function toKoreanMessage(message: string): string {
  const normalized = message.toLowerCase();
  if (normalized.includes("already registered") || normalized.includes("already exists")) {
    return "이미 가입된 이메일입니다.";
  }
  if (normalized.includes("password") && normalized.includes("6")) {
    return "비밀번호는 최소 6자 이상이어야 합니다.";
  }
  if (normalized.includes("weak") && normalized.includes("password")) {
    return "비밀번호가 너무 취약합니다. 더 복잡한 비밀번호를 사용해주세요.";
  }
  if (normalized.includes("email") && (normalized.includes("invalid") || normalized.includes("valid"))) {
    return "올바른 이메일 형식이 아닙니다.";
  }
  if (normalized.includes("rate limit") || normalized.includes("too many")) {
    return "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.";
  }
  return "회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.";
}

export default function SignupPage() {
  const router = useRouter();
  const [supabase] = useState(() => createClient());

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState("");

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);

  // 브라우저 자동완성/비밀번호 매니저는 onChange 없이 값을 채우므로,
  // 마운트 직후 실제 input DOM 값을 상태에 반영한다.
  useEffect(() => {
    if (emailRef.current?.value) setEmail(emailRef.current.value);
    if (passwordRef.current?.value) setPassword(passwordRef.current.value);
    if (passwordConfirmRef.current?.value)
      setPasswordConfirm(passwordConfirmRef.current.value);
  }, []);

  const canSubmit =
    email.trim() !== "" &&
    password !== "" &&
    passwordConfirm !== "" &&
    !submitting;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    // 자동완성 등으로 상태 반영이 늦어진 경우를 대비해 실제 input 값을 사용한다.
    const currentEmail = (emailRef.current?.value ?? email).trim();
    const currentPassword = passwordRef.current?.value ?? password;
    const currentPasswordConfirm =
      passwordConfirmRef.current?.value ?? passwordConfirm;
    if (
      !currentEmail ||
      !currentPassword ||
      !currentPasswordConfirm ||
      submitting
    ) {
      return;
    }

    if (currentPassword !== currentPasswordConfirm) {
      setToast("비밀번호가 일치하지 않습니다.");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: currentEmail,
        password: currentPassword,
      });

      if (error) {
        setToast(toKoreanMessage(error.message));
        return;
      }

      router.push("/");
    } catch {
      setToast("회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[var(--background)] px-6 py-10">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      {toast && <Toast message={toast} onClose={() => setToast("")} />}

      <div className="flex w-full max-w-sm flex-col gap-8 rounded-lg border border-[var(--border)] bg-[var(--card)] p-8">
        <h1 className="flex flex-col items-center gap-2 text-center text-2xl font-bold leading-tight tracking-tight text-[var(--text)]">
          <Logo className="h-8 w-auto" />
          <span>춘천마임축제</span>
          <span>북마크 링크</span>
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

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-sm font-medium text-[var(--text)]"
            >
              비밀번호
            </label>
            <input
              ref={passwordRef}
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onAnimationStart={(event) => {
                if (event.animationName === "onAutoFillStart") {
                  setPassword(event.currentTarget.value);
                }
              }}
              placeholder="비밀번호를 입력하세요"
              className="input-field w-full text-sm"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password-confirm"
              className="text-sm font-medium text-[var(--text)]"
            >
              비밀번호 확인
            </label>
            <input
              ref={passwordConfirmRef}
              id="password-confirm"
              name="password-confirm"
              type="password"
              autoComplete="new-password"
              value={passwordConfirm}
              onChange={(event) => setPasswordConfirm(event.target.value)}
              onAnimationStart={(event) => {
                if (event.animationName === "onAutoFillStart") {
                  setPasswordConfirm(event.currentTarget.value);
                }
              }}
              placeholder="비밀번호를 다시 입력하세요"
              className="input-field w-full text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="hover-accent mt-2 rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--on-accent)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? "회원가입 중..." : "회원가입"}
          </button>
        </form>

        <p className="text-center text-sm text-[var(--text-sub)]">
          이미 계정이 있으신가요?{" "}
          <Link
            href="/login"
            className="font-medium text-[var(--accent)] hover:underline"
          >
            로그인
          </Link>
        </p>

        <p className="text-center text-xs text-[var(--placeholder)]">
          회원가입 시{" "}
          <Link href="/privacy" className="underline">
            개인정보 처리방침
          </Link>
          에 동의하는 것으로 간주됩니다.
        </p>
      </div>
    </div>
  );
}
