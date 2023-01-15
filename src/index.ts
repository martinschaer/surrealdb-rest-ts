import fetch from "isomorphic-fetch";

type RequestInit = {
  method: string,
  headers?: Record<string, string>,
  body?: string
}

// TODO: list all possible statuses
export type SurrealRESTResponse<T> = {
  time: string;
  status: "OK";
  result: T;
};

export class SurrealREST {
  url = "https://api.surrealdb.com/v1/sql"; // I got this URL from copilot…
  ns: string | null = null;
  db: string | null = null;
  user: string | null = null;
  password: string | null = null;

  constructor(
    url: string,
    opts: { ns?: string; db?: string; user?: string; password?: string }
  ) {
    this.url = url;
    this.ns = opts.ns || null;
    this.db = opts.db || null;
    this.user = opts.user || null;
    this.password = opts.password || null;
  }

  private getFetchOpts(method: string, body?: string): RequestInit {
    const headers: Record<string, string> = { Accept: "application/json" };
    const opts: RequestInit = {
      method,
    };
    if (this.ns) {
      headers.NS = this.ns;
    }
    if (this.db) {
      headers.DB = this.db;
    }
    if (this.user) {
      headers.Authorization =
        "Basic " +
        Buffer.from(this.user + ":" + this.password, "utf-8").toString(
          "base64"
        );
    }
    opts.headers = headers;
    if (body) {
      opts.body = body;
    }
    return opts;
  }

  async select<T>(thing: string): Promise<T[]> {
    const [table, id] = thing.split(":");
    const res = await fetch(
      `${this.url}/key/${table}/${id}`,
      this.getFetchOpts("GET")
    );
    const json = (await res.json()) as SurrealRESTResponse<T[]>[];
    if (!json[0]) throw new Error("Not found");
    return json[0].result;
  }

  async query<T>(sql: string, vars?: Record<string, unknown>): Promise<T> {
    const sqlWithVars = vars
      ? sql.replace(/\$(\w+)/g, (_, key) => JSON.stringify(vars[key]))
      : sql;
    const res = await fetch(
      `${this.url}/sql`,
      this.getFetchOpts("POST", sqlWithVars)
    );
    const json = (await res.json()) as T;
    return json;
  }

  async create<T extends Record<string, unknown>, U = T & { id: string }>(
    table: string,
    doc: T
  ): Promise<U> {
    const opts = this.getFetchOpts("POST", JSON.stringify(doc));
    const res = await fetch(`${this.url}/key/${table}`, opts);
    const json = (await res.json()) as SurrealRESTResponse<U[]>[];
    if (!json[0] || !json[0].result[0]) throw new Error("Not found");
    return json[0].result[0];
  }

  async change<T extends Record<string, unknown>>(
    thing: string,
    doc: T
  ): Promise<T> {
    const [table, id] = thing.split(":");
    const res = await fetch(
      `${this.url}/key/${table}/${id}`,
      this.getFetchOpts("PATCH", JSON.stringify(doc))
    );
    const json = (await res.json()) as SurrealRESTResponse<T[]>[];
    if (!json[0] || !json[0].result[0]) throw new Error("Not found");
    return json[0].result[0];
  }

  async delete<T extends Record<string, unknown>, U = T & { id: string }>(
    thing: string
  ): Promise<U> {
    const [table, id] = thing.split(":");
    const res = await fetch(
      `${this.url}/key/${table}/${id}`,
      this.getFetchOpts("DELETE")
    );
    const json = (await res.json()) as SurrealRESTResponse<U>[];
    if (!json[0]) throw new Error("Not found");
    else {
      return json[0].result;
    }
  }
}
