import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { applyCoupon } from "../02-route/route.js";
import { fakeResponse } from "../02-route/response.js";
import { couponDb, insertCoupon, openCoupons } from "./coupons.js";

test("a coupon row is ten percent off 100", async () => {
  const dir = mkdtempSync(join(tmpdir(), "coupons-"));
  const sqlite = openCoupons(join(dir, "coupons.db"));
  insertCoupon(sqlite, {
    code: "SAVE10",
    percentOff: 10,
    expiresAt: new Date("2026-12-01"),
  });

  const res = fakeResponse();
  await applyCoupon(
    { body: { code: "SAVE10", subtotal: 100 } },
    res,
    couponDb(sqlite),
    new Date("2026-06-01"),
  );
  assert.equal(res.body.total, 90);
});
