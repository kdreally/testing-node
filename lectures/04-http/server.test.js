import { test } from "node:test";
import assert from "node:assert/strict";
import { startCouponServer } from "./server.js";

function db() {
  const seen = [];
  return {
    seen,
    async getCoupon(code) {
      seen.push(code);
      return { percentOff: 10, expiresAt: new Date("2026-12-01") };
    },
  };
}

test("the code arrives and the status is 200", async () => {
  const coupons = db();
  const server = await startCouponServer(coupons);
  try {
    const { port } = server.address();
    const response = await fetch(`http://127.0.0.1:${port}/coupon`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ code: "SAVE10", subtotal: 100 }),
    });
    assert.equal(response.status, 200);
    assert.deepEqual(coupons.seen, ["SAVE10"]);
  } finally {
    server.close();
  }
});

test("a body that is not JSON is 400", async () => {
  const coupons = db();
  const server = await startCouponServer(coupons);
  try {
    const { port } = server.address();
    const response = await fetch(`http://127.0.0.1:${port}/coupon`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "nope",
    });
    assert.equal(response.status, 400);
    assert.deepEqual(coupons.seen, []);
  } finally {
    server.close();
  }
});
