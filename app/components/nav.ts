//Imports
import {document, DOMNode} from "../types.ts"
import {slug} from "../utils.ts"

/** Nav builder */
export function Nav(elements:DOMNode[]) {
  const nav = document.createElement("nav")
  nav.setAttribute("aria-label", "Breadcrumb")
  const ol = document.createElement("ol")
  ol.classList.add("p-0")
  nav.appendChild(ol)
  for (const element of elements) {
    const li = document.createElement("li")
    li.classList.add("breadcrumb-item")
    li.innerHTML = `<a href="#${slug(element.innerText)}">${element.innerText}</a>`
    ol.appendChild(li)
  }
  return nav
}