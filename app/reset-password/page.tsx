"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Toast from "@/components/Toast";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [supabase] = useState(() => createClient());

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState("");

  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (passwordRef.current?.value) setPassword(passwordRef.current.value);
    if (passwordConfirmRef.current?.value)
      setPasswordConfirm(passwordConfirmRef.current.value);
  }, []);

  const canSubmit =
    password !== "" && passwordConfirm !== "" && !submitting;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const currentPassword = passwordRef.current?.value ?? password;
    const currentPasswordConfirm =
      passwordConfirmRef.current?.value ?? passwordConfirm;
    if (!currentPassword || !currentPasswordConfirm || submitting) return;

    if (currentPassword !== currentPasswordConfirm) {
      setToast("비밀번호가 일치하지 않습니다.");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: currentPassword,
      });

      if (error) {
        const normalized = error.message.toLowerCase();
        if (normalized.includes("session") || normalized.includes("expired")) {
          setToast(
            "재설정 링크가 만료되었습니다. 비밀번호 찾기를 다시 시도해주세요.",
          );
        } else if (normalized.includes("6") || normalized.includes("weak")) {
          setToast("비밀번호는 최소 6자 이상이어야 합니다.");
        } else if (normalized.includes("same") || normalized.includes("different from")) {
          setToast("이전과 다른 비밀번호를 사용해주세요.");
        } else {
          setToast("비밀번호 재설정에 실패했습니다. 잠시 후 다시 시도해주세요.");
        }
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setToast("비밀번호 재설정에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-6 py-10">
      {toast && <Toast message={toast} onClose={() => setToast("")} />}

      <div className="flex w-full max-w-sm flex-col gap-8 rounded-lg border border-[var(--border)] bg-[var(--card)] p-8">
        <h1 className="text-center text-2xl font-bold tracking-tight text-[var(--text)]">
          비밀번호 재설정
        </h1>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-sm font-medium text-[var(--text)]"
            >
              새 비밀번호
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
              placeholder="새 비밀번호를 입력하세요"
              className="input-field w-full text-sm"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password-confirm"
              className="text-sm font-medium text-[var(--text)]"
            >
              새 비밀번호 확인
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
              placeholder="새 비밀번호를 다시 입력하세요"
              className="input-field w-full text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="hover-accent mt-2 rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? "변경 중..." : "비밀번호 변경"}
          </button>
        </form>
      </div>
    </div>
  );
}
