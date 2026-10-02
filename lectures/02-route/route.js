import { priceWithCoupon } from "../01-price/pricing.js";

export async function applyCoupon(req, res, db, now = new Date()) {
  const coupon = await db.getCoupon(req.body.code);
  const priced = priceWithCoupon(req.body.subtotal, coupon, now);
  if (!priced.ok) {
    return res.status(400).send({ error: priced.error });
  }
  res.send({ total: priced.total });
}
