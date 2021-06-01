//Imports
import {document, global, LISTENERS} from "./types.ts"

/** Transform a text into slug */
export function slug(text:string) {
  return text.replace(/[^\w]/g, "-").replace(/-+/g, "-").replace(/(^-)|(-$)/, "").toLocaleLowerCase()
}

/** Load remote content */
export function load() {
  const target = new URLSearchParams(global.location.search).get("target")
  return (target ? fetch("/api/load.ts", {method:"POST", body:target}) : fetch("/README.md")).then(response => response.text())
}

/** Remote script executor */
export async function execute(uuid:string) {
  //Check
  const executor = document.querySelector(`.executor-result[data-executor-uuid="${uuid}"]`)
  if (executor) {
    //Load script
    const body = document.querySelector(`[data-executor-uuid="${uuid}"] code`)?.innerText ?? ""
    try {
      //Run script
      document.querySelector(`[data-executor-uuid="${uuid}"] .executor-button`)?.setAttribute("disabled", true)
      const {headers, result} = await fetch("/api/eval.ts", {method:"POST", body}).then(async response => ({headers:response.headers, result:await response.text()}))
      const success = Number(headers.get("x-success"))
      const code = Number(headers.get("x-code"))
      const duration = Number(headers.get("x-duration"))
      //Display result
      executor.innerText = result
      executor.innerHTML += `<span class="color-text-secondary">${success < 0 ? "Killed (time limit reached)" : `Exited with code ${code}`} (${duration.toFixed(3)} ms)</span>`
      executor.classList[success === -1 ? "add" : "remove"]?.("flash-error")
      executor.classList[success === 0 ? "add" : "remove"]?.("flash-warn")
    }
    //Handle errors
    catch {
      executor.innerText = `<span class="color-text-danger">Server was not able to execute this script</span>`
      executor.classList.add("flash-error")
    }
    //Cleaning
    finally {
      document.querySelector(`[data-executor-uuid="${uuid}"] .executor-button`)?.setAttribute("disabled", false)
    }
  }
}

/** Page selector */
export function page(direction?:number, {updateState = true} = {}) {
  //Load slides
  const slides = document.querySelector(".slides")
  if (slides) {
    const pages = document.querySelectorAll(".slides .slide")?.length ?? 0
    const width = global.innerWidth
    const current = Math.round(slides.scrollLeft/width)

    //Update interface
    document.querySelector(".previous_page")?.setAttribute("aria-disabled", current === 0)
    document.querySelector(".next_page")?.setAttribute("aria-disabled", current === pages-1)
    const progress = document.querySelector(".slides-progress > *")
    if (progress)
      progress.style.width = `${(100*slides.scrollLeft/((pages-1)*width)).toFixed(1)}%`
    const indicator = document.querySelector("[aria-current='page']")
    if (indicator)
      indicator.innerText = `${current+1} / ${pages}`

    //Scroll
    if (typeof direction === "number")
      document.querySelector(`.slides .slide:nth-child(${current+direction+1})`)?.scrollIntoView({behavior:"smooth"})

    //Load current slide
    const slide = document.querySelector(`.slides .slide:nth-child(${current+1})`)
    if (slide) {
      //Update state
      if ((updateState)&&(location.hash !== `#${slide.id}`))
        global.history.replaceState(null, slide.querySelector("h1, h2, h3, h4, h5, h6").innerText, `#${slide.id}`);

      //Apply events
      if (page.previous !== slide.id) {
        LISTENERS.leave.get(page.previous)?.()
        debounce.timeouts.forEach(clearTimeout)
        debounce(LISTENERS.enter.get(slide.id))
      }
      page.previous = slide.id
    }

  }
}
page.previous = null as null|string

/** Debouncer */
export function debounce(func:(...args: unknown[]) => void, {time = 200} = {}) {
  if (func) {
    clearTimeout(debounce.timeouts.get(func))
    debounce.timeouts.set(func, setTimeout(func, time))
  }
}
debounce.timeouts = new Map()