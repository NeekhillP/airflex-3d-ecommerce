"use client";

import { useState } from "react";

export default function SignOut() {
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  async function signOut() {
    setBusy(true);
    setFailed(false);
    try {
      const response = await fetch("/api/auth/logout", {
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
      });
      if (!response.ok) throw new Error("Sign out failed");
      window.location.replace("/login");
    } catch {
      setFailed(true);
      setBusy(false);
    }
  }

  return (
    <div className="mt-7">
      <button type="button" className="text-link" disabled={busy} onClick={signOut}>
        {busy ? "Signing out…" : "Sign out"}
      </button>
      {failed && <p role="alert" className="mt-3 text-sm text-red-800">Couldn’t sign out. Try again.</p>}
    </div>
  );
}
