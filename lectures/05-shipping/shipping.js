import { priceWithCoupon } from "../01-price/pricing.js";

export function shippingFor(total, quote) {
  if (!quote || !quote.ok) return { ok: false, error: "no quote" };
  if (total >= 50) return { ok: true, shipping: 0 };
  return { ok: true, shipping: quote.amount };
}

export async function quoteShipping(total) {
  try {
    const quoted = await fetch("https://rates.example/quote", {
      method: "POST",
      body: JSON.stringify({ total }),
    });
    const quote = await quoted.json();
    return { ok: true, amount: quote.amount };
  } catch {
    return { ok: false };
  }
}

export async function applyQuotedCoupon(req, res, db, quoteShipping, now = new Date()) {
  const coupon = await db.getCoupon(req.body.code);
  const priced = priceWithCoupon(req.body.subtotal, coupon, now);
  if (!priced.ok) return res.status(400).send({ error: priced.error });
  const quote = await quoteShipping(priced.total);
  const shipping = shippingFor(priced.total, quote);
  if (!shipping.ok) return res.status(503).send({ error: shipping.error });
  res.send({ total: priced.total, shipping: shipping.shipping });
}
