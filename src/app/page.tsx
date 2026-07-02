"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

const PRODUCTS = [
  { image: "/products/iced-latte.jpg", name: "Iced Latte", usd: 2.5 },
  { image: "/products/matcha-tea.jpg", name: "Matcha Green Tea", usd: 3.0 },
  { image: "/products/croissant.jpg", name: "Butter Croissant", usd: 1.75 },
  { image: "/products/boba.jpg", name: "Brown Sugar Boba", usd: 2.25 },
  { image: "/products/pandan-cake.jpg", name: "Pandan Cake Slice", usd: 3.5 },
  { image: "/products/mango-sticky-rice.jpg", name: "Mango Sticky Rice", usd: 4.0 },
];

const KHR_RATE = 4100;

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [currency, setCurrency] = useState<"USD" | "KHR">("USD");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [customAmount, setCustomAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartItems = PRODUCTS.filter((p) => cart[p.name]);

  if (!mounted) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="flex h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#E1232E] border-t-transparent"></div>
        </div>
      </main>
    );
  }
  const cartUsd = cartItems.reduce((s, p) => s + p.usd * cart[p.name], 0);
  const custom = parseFloat(customAmount) || 0;

  const totalUsd = cartUsd + (currency === "USD" ? custom : custom / KHR_RATE);
  const total =
    currency === "USD" ? totalUsd : Math.round(cartUsd * KHR_RATE) + Math.round(custom);

  const formatMoney = (v: number) =>
    currency === "USD"
      ? `$${v.toFixed(2)}`
      : `៛ ${Math.round(v).toLocaleString()}`;

  const displayPrice = (usd: number) =>
    currency === "USD" ? `$${usd.toFixed(2)}` : `៛ ${(usd * KHR_RATE).toLocaleString()}`;

  const addItem = (name: string) =>
    setCart((c) => ({ ...c, [name]: (c[name] || 0) + 1 }));
  const removeItem = (name: string) =>
    setCart((c) => {
      const next = { ...c };
      if (next[name] > 1) next[name] -= 1;
      else delete next[name];
      return next;
    });

  const payNow = async () => {
    setError(null);
    const amount =
      currency === "USD"
        ? Math.round(totalUsd * 100) / 100
        : Math.round(cartUsd * KHR_RATE) + Math.round(custom);
    if (amount <= 0) {
      setError("Add items to your cart or enter a custom amount.");
      return;
    }
    setLoading(true);
    try {
      const description =
        cartItems.map((p) => `${p.name} x${cart[p.name]}`).join(", ") ||
        "Custom payment";
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, currency, description }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      router.push(`/pay/${data.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <SiteHeader />

      {/* Hero strip */}
      <section className="bg-gradient-to-r from-[#E1232E] to-[#8f141c] text-white">
        <div className="mx-auto flex max-w-3xl flex-col items-start gap-1.5 px-4 py-8">
          <span className="rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] backdrop-blur">
            Welcome to
          </span>
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
            SOKPHENG NETCAFE
          </h1>
          <p className="text-sm text-white/80">
            Order your favorites and pay instantly with Bakong KHQR — no cash
            needed.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-8 pb-16">
        {/* Currency toggle */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">Menu</h2>
          <div className="flex rounded-full bg-slate-200 p-1 text-xs font-semibold">
            {(["USD", "KHR"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={`rounded-full px-4 py-1.5 transition ${
                  currency === c
                    ? "bg-[#E1232E] text-white shadow"
                    : "text-slate-600"
                }`}
              >
                {c === "USD" ? "$ USD" : "៛ KHR"}
              </button>
            ))}
          </div>
        </div>

        {/* Products */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {PRODUCTS.map((p) => {
            const qty = cart[p.name] || 0;
            return (
              <div
                key={p.name}
                className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition ${
                  qty ? "border-[#E1232E] ring-1 ring-[#E1232E]/30" : "border-slate-200"
                }`}
              >
                <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
                  <img
                    src={p.image}
                    alt={p.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/400x400?text=No+Image";
                    }}
                    className="h-full w-full object-cover transition duration-300 hover:scale-105"
                  />
                  {qty > 0 && (
                    <span className="absolute right-2 top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-[#E1232E] px-1.5 text-xs font-bold text-white shadow">
                      {qty}
                    </span>
                  )}
                </div>
                <div className="p-3">
                <div className="text-sm font-semibold text-slate-800">
                  {p.name}
                </div>
                <div className="text-xs text-slate-500">{displayPrice(p.usd)}</div>
                <div className="mt-3 flex items-center justify-between">
                  {qty > 0 ? (
                    <div className="flex w-full items-center justify-between">
                      <button
                        onClick={() => removeItem(p.name)}
                        className="h-7 w-7 rounded-full bg-slate-100 text-sm font-bold text-slate-600 hover:bg-slate-200"
                      >
                        −
                      </button>
                      <span className="text-sm font-bold">{qty}</span>
                      <button
                        onClick={() => addItem(p.name)}
                        className="h-7 w-7 rounded-full bg-[#E1232E] text-sm font-bold text-white hover:bg-[#c11d27]"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addItem(p.name)}
                      className="w-full rounded-full bg-slate-900 py-1.5 text-xs font-semibold text-white hover:bg-slate-700"
                    >
                      Add
                    </button>
                  )}
                </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom amount */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800">
            Or pay a custom amount
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Tips, top-ups, or any amount you want to pay via KHQR.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-lg font-bold text-slate-400">
              {currency === "USD" ? "$" : "៛"}
            </span>
            <input
              type="number"
              min="0"
              step={currency === "USD" ? "0.01" : "100"}
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder={currency === "USD" ? "0.00" : "0"}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-lg font-semibold outline-none focus:border-[#E1232E] focus:ring-2 focus:ring-[#E1232E]/20"
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}
      </div>

      <SiteFooter />
      {/* Spacer so the fixed pay bar doesn't cover the footer */}
      <div className="h-24" />

      {/* Sticky pay bar */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4">
          <div>
            <div className="text-[11px] uppercase tracking-wide text-slate-500">
              Total
            </div>
            <div className="text-2xl font-black text-slate-900">
              {formatMoney(total)}
            </div>
          </div>
          <button
            onClick={payNow}
            disabled={loading || total <= 0}
            className="flex items-center gap-2 rounded-full bg-[#E1232E] px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-200 transition hover:bg-[#c11d27] disabled:opacity-40"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Generating KHQR…
              </>
            ) : (
              <>Pay with KHQR</>
            )}
          </button>
        </div>
      </div>
    </main>
  );
}
