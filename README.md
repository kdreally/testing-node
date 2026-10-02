# Testing Node.js

Session notes and code for the [KinjalDixith](https://www.youtube.com/@kinjaldixith) lecture series. The claim is that making a Node program unit-testable forces the production code into a better shape. The example is one coupon.

Reading pages, with the videos embedded: https://kdreally.github.io/testing-node/

Requires Node 24. SQLite is built in. No packages to install.

```bash
node --test lectures/01-price/pricing.test.js lectures/02-route/route.test.js lectures/03-database/database.test.js
```

| Lecture | Video | Code |
|---|---|---|
| 0. What this series is | [watch](https://www.youtube.com/watch?v=eEmXxNVxDR4) | [notes](docs/00.html) |
| 1. The price function | [watch](https://www.youtube.com/watch?v=ziPmEkuOYUM) | [lectures/01-price](lectures/01-price) |
| 2. The route | [watch](https://www.youtube.com/watch?v=uUq1_7VS8d0) | [lectures/02-route](lectures/02-route) |
| 3. A real database | not published yet | [lectures/03-database](lectures/03-database) |

Still coming: one real HTTP call. Then this coupon example is finished.
