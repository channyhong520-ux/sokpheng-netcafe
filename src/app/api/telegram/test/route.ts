import { NextResponse } from "next/server";
import {
  getTelegramConfig,
  isTelegramConfigured,
  sendTelegramMessage,
} from "@/lib/telegram";

/** GET: report whether Telegram alerts are configured. */
export async function GET() {
  const config = getTelegramConfig();
  return NextResponse.json({
    configured: isTelegramConfigured(),
    // Never expose the bot token — only the target channel.
    channel: config?.chatId ?? null,
  });
}

/** POST: send a test alert to the configured channel. */
export async function POST() {
  if (!isTelegramConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Telegram is not configured. Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHANNEL environment variables.",
      },
      { status: 400 }
    );
  }

  const result = await sendTelegramMessage(
    [
      "🔔 <b>Test alert from KHQR Checkout</b>",
      "",
      "Your Telegram integration is working! You will receive alerts here when:",
      "🆕 a new KHQR checkout is created",
      "✅ a payment is received",
    ].join("\n")
  );

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
