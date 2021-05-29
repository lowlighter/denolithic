//Imports
import type { ServerRequest } from "https://deno.land/std@0.97.0/http/server.ts"
import { expandGlob } from "https://deno.land/std@0.97.0/fs/mod.ts"
import { fromFileUrl, toFileUrl, dirname, resolve } from "https://deno.land/std@0.97.0/path/mod.ts"

/** Request handler */
export default async function (request: ServerRequest) {
  //Only get requests are allowed
  if (request.method !== "GET")
    return request.respond({status:405})

  //Explore available slides
  try {
    const directory = []
    const base = toFileUrl(resolve(dirname(fromFileUrl(import.meta.url)), ".."))
    for await (const { path, isFile } of expandGlob("slides/**/*.md")) {
      if (!isFile)
        continue
      const urn = toFileUrl(path).href.replace(base.href, "")
      directory.push({path:urn})
    }
    //Send back headers and output
    const headers = new Headers()
    headers.set("Content-Type", "application/json")
    return request.respond({status:200, headers, body:JSON.stringify(directory)})
  }
  catch {
    return request.respond({status:500})
  }
}