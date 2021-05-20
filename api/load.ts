//Imports
import type { ServerRequest } from "https://deno.land/std@0.97.0/http/server.ts"
import { readAll } from "https://deno.land/std@0.97.0/io/util.ts"

/** Request handler */
export default async function (request: ServerRequest) {
  //Only post requests are allowed
  if (request.method !== "POST")
    return request.respond({status:405})
  //Parse body
  const url = new TextDecoder().decode(await readAll(request.body))
  try {
    const body = await fetch(url).then(response => response.text())
    return request.respond({status:200, body})
  }
  catch {
    return request.respond({status:500})
  }
}