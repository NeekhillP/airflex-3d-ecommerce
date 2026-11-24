"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AuthForm({ registering = false }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  async function submit(event) {
    event.preventDefault();
    if (busy) return;

    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    values.email = values.email.trim();
    if (registering) values.name = values.name.trim();

    function fieldError(field, message) {
      setError({ field, message });
      form.elements.namedItem(field).focus();
    }

    if (registering && !values.name) return fieldError("name", "Enter your name.");
    if (!values.email || form.elements.email.validity.typeMismatch) {
      return fieldError("email", "Enter a valid email address.");
    }
    if (!values.password) return fieldError("password", "Enter your password.");
    if (registering && values.password.length < 6) {
      return fieldError("password", "Use at least 6 characters for your password.");
    }

    setError(null);
    setBusy(true);
    try {
      const response = await fetch(registering ? "/api/auth/register" : "/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        signal: AbortSignal.timeout(20000),
      });
      if (response.ok) {
        router.replace("/account");
        return;
      }
      if (response.status === 400 && registering) {
        const data = await response.json();
        if (data.message === "User already exists") {
          fieldError("email", "This email already has an account. Sign in to continue.");
        } else {
          setError({ message: "Check your details and try again." });
        }
      } else if (response.status === 400) {
        fieldError("email", "Check your email and password and try again.");
      } else if (response.status === 403) {
        setError({ message: "This account has been deactivated." });
      } else {
        setError({ message: "The account service is unavailable. Try again shortly." });
      }
    } catch {
      setError({ message: "Couldn’t reach the account service. Check your connection and try again." });
    }
    setBusy(false);
  }

  function fieldProps(name) {
    const invalid = error?.field === name;
    return {
      id: name,
      name,
      required: true,
      readOnly: busy,
      "aria-invalid": invalid || undefined,
      "aria-describedby": invalid ? "auth-error" : undefined,
      className: "auth-input",
    };
  }

  return (
    <>
      <h1 className="page-title">{registering ? "Create an account" : "Welcome back."}</h1>
      <p className="mt-3 text-muted">
        {registering ? "Enter your details to join Airflex." : "Sign in to your Airflex account."}
      </p>
      <form method="post" noValidate onSubmit={submit} className="mt-9 space-y-5">
        {registering && (
          <div>
            <label htmlFor="name">Full name</label>
            <input {...fieldProps("name")} autoComplete="name" maxLength={50} placeholder="Your name" />
          </div>
        )}
        <div>
          <label htmlFor="email">Email address</label>
          <input {...fieldProps("email")} type="email" autoComplete="email" placeholder="you@example.com" />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <div className="relative">
            <input {...fieldProps("password")} type={showPassword ? "text" : "password"}
              autoComplete={registering ? "new-password" : "current-password"}
              minLength={registering ? 6 : undefined}
              placeholder={registering ? "At least 6 characters" : "Enter your password"}
              className="auth-input pr-16" />
            <button type="button" aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-1 right-1 px-3 text-xs font-semibold text-muted hover:text-ink">
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        {error && <p id="auth-error" role="alert" className="text-sm text-red-800">{error.message}</p>}
        <button className="primary-button" disabled={busy}>
          <span>{registering ? (busy ? "Creating account…" : "Create account") : (busy ? "Signing in…" : "Sign in")}</span>
          <span aria-hidden="true" className="text-xl">→</span>
        </button>
      </form>
      <p className="mt-7 border-t border-black/15 pt-6 text-sm text-muted">
        {registering ? "Already have an account? " : "New to Airflex? "}
        <Link href={registering ? "/login" : "/register"} className="text-link">
          {registering ? "Sign in" : "Create an account"}
        </Link>
      </p>
    </>
  );
}
