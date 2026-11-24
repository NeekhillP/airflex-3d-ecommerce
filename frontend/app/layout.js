import "./globals.css";

export const metadata = {
  title: { default: "Airflex account", template: "%s | Airflex" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main className="mx-auto grid min-h-svh max-w-[1800px] md:grid-cols-2">
          <section className="flex flex-col px-6 py-8 sm:px-12 lg:px-16 lg:py-12">
            <header className="flex items-center gap-2.5" aria-label="Airflex">
              <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
              <span className="text-3xl font-black italic tracking-[-0.075em]">AIRFLEX</span>
            </header>
            <div className="mx-auto flex w-full max-w-[25rem] flex-1 flex-col justify-center py-14">
              {children}
            </div>
          </section>
          <figure className="relative m-3 hidden overflow-hidden rounded-xl bg-cobalt md:block">
            <img src="/mesh-runner.webp" alt="Silver mesh running shoe suspended against cobalt blue" className="absolute inset-0 size-full object-cover" />
            <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-linear-to-t from-black/45 to-transparent p-7 pt-14 text-white lg:p-10 lg:pt-16">
              <span className="text-2xl font-semibold tracking-tight">Mesh runner</span>
              <span className="font-mono text-xs">Silver / Cobalt</span>
            </figcaption>
          </figure>
        </main>
      </body>
    </html>
  );
}
