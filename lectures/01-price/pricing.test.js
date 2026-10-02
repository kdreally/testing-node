import { test } from "node:test";
import assert from "node:assert/strict";
import { priceWithCoupon } from "./pricing.js";

const tenPercent = {
  percentOff: 10,
  expiresAt: new Date("2026-12-01"),
};

test("expired coupon is rejected", () => {
  const priced = priceWithCoupon(100, tenPercent, new Date("2027-01-01"));
  assert.equal(priced.ok, false);
});

test("ten percent off 100 is 90", () => {
  const priced = priceWithCoupon(100, tenPercent, new Date("2026-06-01"));
  assert.equal(priced.total, 90);
});
