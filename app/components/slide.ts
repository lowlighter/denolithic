//Imports
import {document, DOMNode} from "../types.ts"

/** Slide creator */
export function Slide() {
  //Slide wrapper
  const slide = document.createElement("article")
  slide.classList.add("p-6", "slide")
  document.querySelector(".slides")?.appendChild(slide)
  //Slide content
  const container = document.createElement("div")
  container.classList.add("container-md")
  slide.appendChild(container)
  const body = document.createElement("div")
  body.classList.add("markdown-body", "col-12")
  container.appendChild(body)
  return body as DOMNode
}