"use client";

import Link from "next/link";
import { UserButton, SignInButton, useUser } from "@clerk/nextjs";

export function AuthButton({ mobile }: { mobile?: boolean }) {
  const { isSignedIn } = useUser();

  if (isSignedIn) {
    return <UserButton />;
  }

  if (mobile) {
    return (
      <SignInButton mode="modal">
        <button className="w-full px-4 py-3 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 transition-colors">
          Masuk ke Islamiva
        </button>
      </SignInButton>
    );
  }

  return (
    <SignInButton mode="modal">
      <button className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors">
        Masuk
      </button>
    </SignInButton>
  );
}
