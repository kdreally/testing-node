export function priceWithCoupon(subtotal, coupon, now) {
  if (!coupon || coupon.expiresAt <= now) {
    return { ok: false, error: "invalid coupon" };
  }
  const total = subtotal * (1 - coupon.percentOff / 100);
  return { ok: true, total };
}
