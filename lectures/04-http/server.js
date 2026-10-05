import { createServer } from "node:http";
import { applyCoupon } from "../02-route/route.js";

export function collect() {
  return {
    statusCode: undefined,
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    send(body) {
      this.body = body;
    },
  };
}

export function startCouponServer(db) {
  const server = createServer(async (req, res) => {
    if (req.method !== "POST" || req.url !== "/coupon") {
      res.writeHead(404).end();
      return;
    }
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    let body;
    try {
      body = JSON.parse(Buffer.concat(chunks).toString());
    } catch {
      res.writeHead(400).end();
      return;
    }
    const out = collect();
    await applyCoupon({ body }, out, db, new Date("2026-06-01"));
    const status = out.statusCode ?? 200;
    res.writeHead(status, { "content-type": "application/json" });
    res.end(JSON.stringify(out.body ?? null));
  });
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => resolve(server));
  });
}
