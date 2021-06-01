/** Global context */
//deno-lint-ignore no-explicit-any
export const global = globalThis as any

/** HTML document */
export const document = global.document as {
  querySelectorAll:(selector:string) => DOMNode[]
  querySelector:(selector:string) => DOMNode|null
  addEventListener:(event:string, callback:(event:loose) => void) => void
  //deno-lint-ignore no-explicit-any
  [key:string]:any
}

/** Eval supported languages */
export const SUPPORTED_LANGUAGES = /js|ts|javascript|typescript/i

/** DOM listeners */
export const LISTENERS = {enter:new Map(), leave:new Map()}

/** DOM event */
//deno-lint-ignore no-explicit-any
export type event = any

/** Loose object */
//deno-lint-ignore no-explicit-any
export type loose = {[key:string]:any}

/** DOM Node */
export type DOMNode = {
  innerText:string
  innerHTML:string
  addEventListener:(event:string, callback:(event:loose) => void) => void
  cloneNode:(deep?:boolean) => DOMNode
  //deno-lint-ignore no-explicit-any
  [key:string]:any
}