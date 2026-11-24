import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { backendOrigin } from "../../lib/backend.mjs";
import SignOut from "./sign-out";

export const metadata = { title: "Your account" };

export default async function AccountPage() {
  const token = (await cookies()).get("token");
  if (!token) redirect("/login");

  const profile = await fetch(`${backendOrigin}/api/auth/profile`, {
    headers: { Cookie: `token=${encodeURIComponent(token.value)}` },
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  }).catch(() => null);

  if (profile?.status === 401 || profile?.status === 404) redirect("/login");
  if (!profile?.ok) {
    return (
      <>
        <h1 className="page-title">Session unavailable</h1>
        <p className="mt-3 text-muted">We couldn’t verify your session. Refresh the page or <Link href="/login" className="text-link">sign in again</Link>.</p>
      </>
    );
  }

  return (
    <>
      <h1 className="page-title">Your account</h1>
      <p className="mt-3 text-muted">You’re signed in to Airflex.</p>
      <SignOut />
    </>
  );
}
