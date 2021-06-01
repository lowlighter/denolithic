export const global = globalThis as any

export const document = global.document as {
  querySelectorAll:(selector:string) => DOMNode[]
  querySelector:(selector:string) => DOMNode|null
  addEventListener:(event:string, callback:(event:loose) => void) => void
  [key:string]:any
}

export type event = any

export const SUPPORTED_LANGUAGES = /js|ts|javascript|typescript/i

export const LISTENERS = {enter:new Map(), leave:new Map()}

export type loose = {[key:string]:any}

export type DOMNode = {
  innerText:string
  innerHTML:string
  addEventListener:(event:string, callback:(event:loose) => void) => void
  cloneNode:(deep?:boolean) => DOMNode
  [key:string]:any
}