import { ServerRequest } from "https://deno.land/std@0.97.0/http/server.ts";
import { readAll } from "https://deno.land/std@0.97.0/io/util.ts";

export default async (req: ServerRequest) =>
  req.method === "POST"
    ? req.respond({
      body: new TextEncoder().encode(eval(new TextDecoder().decode(await readAll(req.body)))),
    })
    : req.respond({ status: 405 });
