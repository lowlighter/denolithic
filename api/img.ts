//Imports
import type { ServerRequest } from "https://deno.land/std@0.97.0/http/server.ts"
import { readAll, writeAll } from "https://deno.land/std@0.97.0/io/util.ts"

/** GitHub content */
const RAW_GITHUB = /https:[/][/]raw[.]githubusercontent[.]com[/](?<owner>[-\w]+)[/](?<repo>[-\w]+)[/](?<branch>[-\w]+)/


/** Request handler */
export default async function (request: ServerRequest) {
  //Only get requests are allowed
  if (request.method !== "GET")
    return request.respond({status:405})
  //Parse params
  const params = new URLSearchParams(request.url.substring(request.url.indexOf("?")))
  const target = `${params.get("target")}`
  const source = `${params.get("source")}`.substring(1)

  //GitHub content
  if (RAW_GITHUB.test(target)) {
    const {owner, repo, branch} = target.match(RAW_GITHUB)?.groups ?? {}
    console.log(`fetching https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${source}`)
    const buffer = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${source}`).then(response => response.arrayBuffer())
    const body = new Uint8Array(buffer)
    return request.respond({status:200, body})
  }

  //Default
  return request.respond({status:404})
}