import { DatabaseSync } from "node:sqlite";

export function openCoupons(path) {
  const db = new DatabaseSync(path);
  db.exec(`
    CREATE TABLE IF NOT EXISTS coupons (
      code TEXT PRIMARY KEY,
      percent_off INTEGER NOT NULL,
      expires_at TEXT NOT NULL
    )
  `);
  return db;
}

export function insertCoupon(db, coupon) {
  db.prepare(
    "INSERT INTO coupons (code, percent_off, expires_at) VALUES (?, ?, ?)",
  ).run(coupon.code, coupon.percentOff, coupon.expiresAt.toISOString());
}

export function couponDb(sqlite) {
  return {
    async getCoupon(code) {
      const row = sqlite.prepare(
        "SELECT percent_off, expires_at FROM coupons WHERE code = ?",
      ).get(code);
      if (!row) return undefined;
      return {
        percentOff: row.percent_off,
        expiresAt: new Date(row.expires_at),
      };
    },
  };
}
