import { test } from "node:test";
import assert from "node:assert/strict";
import { applyCoupon } from "./route.js";
import { fakeResponse } from "./response.js";

const expiredDb = {
  async getCoupon() {
    return { percentOff: 10, expiresAt: new Date("2026-01-01") };
  },
};

const validDb = {
  async getCoupon() {
    return { percentOff: 10, expiresAt: new Date("2026-12-01") };
  },
};

test("expired coupon is a 400", async () => {
  const res = fakeResponse();
  await applyCoupon(
    { body: { code: "SAVE10", subtotal: 100 } },
    res,
    expiredDb,
    new Date("2026-06-01"),
  );
  assert.equal(res.statusCode, 400);
});

test("ten percent off 100 is 90", async () => {
  const res = fakeResponse();
  await applyCoupon(
    { body: { code: "SAVE10", subtotal: 100 } },
    res,
    validDb,
    new Date("2026-06-01"),
  );
  assert.equal(res.body.total, 90);
});
