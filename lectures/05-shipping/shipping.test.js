import { test } from "node:test";
import assert from "node:assert/strict";
import { applyQuotedCoupon, shippingFor } from "./shipping.js";
import { fakeResponse } from "../02-route/response.js";

test("forty keeps the quote and ninety ships free", () => {
  assert.deepEqual(shippingFor(40, { ok: true, amount: 12 }), {
    ok: true,
    shipping: 12,
  });
  assert.deepEqual(shippingFor(90, { ok: true, amount: 12 }), {
    ok: true,
    shipping: 0,
  });
  assert.deepEqual(shippingFor(40, { ok: false }), {
    ok: false,
    error: "no quote",
  });
});

test("a failed quote is status 503 and the body has no total", async () => {
  const res = fakeResponse();
  await applyQuotedCoupon(
    { body: { code: "SAVE10", subtotal: 100 } },
    res,
    {
      async getCoupon() {
        return { percentOff: 10, expiresAt: new Date("2026-12-01") };
      },
    },
    async () => ({ ok: false }),
    new Date("2026-06-01"),
  );
  assert.equal(res.statusCode, 503);
  assert.equal(res.body.total, undefined);
  assert.equal(res.body.error, "no quote");
});
