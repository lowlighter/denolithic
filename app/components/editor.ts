//Imports
import {document, global, DOMNode} from "../types.ts"
import {execute} from "../utils.ts"

/** Code editor */
export function Editor({target, key, ctrlKey}:{target:DOMNode, key?:string, ctrlKey?:boolean}, {timeout = 20, resize = (key === "Enter")} = {}) {
  //Resize
  if (resize) {
    target.style.height = `${target.parentNode.querySelector("code").scrollHeight}px`
    target.style.width = `${target.parentNode.querySelector("code").scrollWidth}px`
  }
  //Highlight code
  try {
    const language = [...target.classList].filter(key => /^language-/.test(key)).shift()?.replace(/^language-/, "")
    if (global.hljs.getLanguage(language)) {
      clearTimeout(Editor.timeout.get(target))
      const value = new global.DOMParser().parseFromString(target.value, "text/html").documentElement.textContent
      Editor.timeout.set(target, setTimeout(() => target.parentNode.querySelector("code").innerHTML = global.hljs.highlight(value, {language, ignoreIllegals:true}).value, timeout))
    }
  } catch { null }
  //Handle code execution shortcut
  if ((key === "Enter")&&(ctrlKey))
    execute(target.parentNode.getAttribute("data-executor-uuid"))
  //Unfocus editor on escape
  if (key === "Escape")
    document.activeElement.blur()
}
Editor.timeout = new Map()