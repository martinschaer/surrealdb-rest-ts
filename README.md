# SurrealDB REST client

Stateless SurrealDB client built for serverless architectures

## Motivation

I built a Next.js app with next-auth and a [custom adapter](https://github.com/martinschaer/next-auth/tree/feature/adapter-surrealdb/packages/adapter-surrealdb) for SurrealDB. I deployed it on Vercel, and realized that I needed a stateless SureralDB client because the serverless nature of Vercel functions where losing my DB connection.

To keep the custom adapter compatible with statefull backends, and benefit from a RPC connection, I built this library following the same function signatures as the official [Node.js driver for SurrealDB](https://surrealdb.com/docs/integration/libraries/nodejs).

## To-do:

- implement all methods:
  - [ ] Sureral.Instance
  - [ ] db.connect(url)
  - [ ] db.wait()
  - [ ] db.close()
  - [ ] db.use(ns, db)
  - [ ] db.signup(vars)
  - [ ] db.signin(vars)
  - [ ] db.invalidate()
  - [ ] db.authenticate(token)
  - [ ] db.let(key, val)
  - [x] db.query(sql, vars)
  - [x] db.select(thing)
  - [x] db.create(thing, data)
  - [ ] db.update(thing, data
  - [x] db.change(thing, data)
  - [ ] db.modify(thing, data)
  - [x] db.delete(thing)
- consider fetch-h2 instead of node-fetch
- unit test with DB docker image

## Similar projects:

- [adileo/surrealdb-ts-client](https://github.com/adileo/surrealdb-ts-client)
- [theopensource-company/surrealdb-cloudflare](https://github.com/theopensource-company/surrealdb-cloudflare)
