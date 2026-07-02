import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#E1232E] to-[#8f141c] text-lg font-black text-white">
                S
              </span>
              <span className="text-sm font-black tracking-tight text-white">
                SOKPHENG <span className="text-[#E1232E]">NETCAFE</span>
              </span>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-slate-400">
              Your neighborhood café &amp; internet lounge in Phnom Penh. Fresh
              drinks, tasty snacks, fast Wi-Fi — pay in seconds with Bakong
              KHQR.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
              Quick links
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <Link href="/" className="transition hover:text-white">
                  Menu &amp; Checkout
                </Link>
              </li>
              <li>
                <Link
                  href="/transactions"
                  className="transition hover:text-white"
                >
                  Transaction History
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
              Visit us
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <span>📍</span> St. 271, Toul Kork, Phnom Penh, Cambodia
              </li>
              <li className="flex items-start gap-2">
                <span>🕐</span> Open daily · 7:00 AM – 10:00 PM
              </li>
              <li className="flex items-start gap-2">
                <span>📞</span> +855 12 345 678
              </li>
              <li className="flex items-start gap-2">
                <span>✉️</span> hello@sokphengnetcafe.com
              </li>
            </ul>
          </div>

          {/* Payment */}
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
              We accept
            </h4>
            <div className="mt-4 inline-flex overflow-hidden rounded-lg shadow">
              <span className="bg-[#E1232E] px-3 py-2 text-sm font-black tracking-widest text-white">
                KHQR
              </span>
              <span className="bg-white px-3 py-2 text-[10px] font-bold leading-tight text-slate-700">
                Bakong
                <br />
                Payment
              </span>
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
              One QR, every bank — ABA, ACLEDA, Wing, TrueMoney and all Bakong
              member apps.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-800 pt-6 text-[11px] text-slate-500 sm:flex-row">
          <p>
            © {new Date().getFullYear()} SOKPHENG NETCAFE. All rights reserved.
          </p>
          <p>
            Powered by <span className="font-bold text-slate-300">Bakong KHQR</span>{" "}
            · National Bank of Cambodia
          </p>
        </div>
      </div>
    </footer>
  );
}
