//Imports
import type { ServerRequest } from "https://deno.land/std@0.97.0/http/server.ts"
import { readAll } from "https://deno.land/std@0.97.0/io/util.ts"

//Maximum runtime execution
const TIMEOUT = 5*1000

/** Request handler */
export default async function (request: ServerRequest) {
  //Only post requests are allowed
  if (request.method !== "POST")
    return request.respond({status:405})
  //Parse requests
  const params = new URLSearchParams(request.url.split("?")[1] ?? "")
  const script = new TextDecoder().decode(await readAll(request.body))
  //Spawn process
  const process = Deno.run({cmd:["deno", "eval", "--ext", params.get("ext") ?? "ts", "--seed", "0", "--unstable", "--no-check", script], stdout: "piped", stderr: "piped"})
  try {
    //Wait for process (kill if needed)
    const timeout = setTimeout(() => process.kill(Deno.Signal.SIGKILL), TIMEOUT)
    const [{success, code}, stdout, stderr] = await Promise.all([process.status(), process.output(), process.stderrOutput()])
    clearTimeout(timeout)
    //Send back status and output
    const headers = new Headers()
    headers.set("x-success", `${Number(success)}`)
    headers.set("x-code", `${code}`)
    return request.respond({status:200, headers, body:new Uint8Array([...stdout, ...stderr])})
  }
  catch {
    //Unknown error
    request.respond({status:500})
  }
  finally {
    //Close process
    process.close()
  }
}