//Imports
import {document, global, loose, DOMNode, event, LISTENERS, SUPPORTED_LANGUAGES} from "./types.ts"
import {load, page, slug, execute} from "./utils.ts"
import {Slide} from "./components/slide.ts"
import {Nav} from "./components/nav.ts"
import {Editor} from "./components/editor.ts"

/** Slides setup */
export async function setup() {
  const text = await load()

  const markdown = global.markdownit({langPrefix:"language-", html:true, linkify:true, typographer:true})
    .use(global.markdownitFootnote)
    .use(global.markdownitMark)
    .use(global.markdownitAbbr)
    .use(global.markdownitDeflist)
    .use(global.markdownitContainer, "info", {render:(tokens:loose[], index:number) => tokens[index].nesting === 1 ? `<div class="flash">` : `</div>`})
    .use(global.markdownitContainer, "warn", {render:(tokens:loose[], index:number) => tokens[index].nesting === 1 ? `<div class="flash flash-warn">` : `</div>`})
    .use(global.markdownitContainer, "error", {render:(tokens:loose[], index:number) => tokens[index].nesting === 1 ? `<div class="flash flash-error">` : `</div>`})
    .use(global.markdownitContainer, "success", {render:(tokens:loose[], index:number) => tokens[index].nesting === 1 ? `<div class="flash flash-success">` : `</div>`})
  markdown.renderer.rules.footnote_block_open = () => `<footer class="footnotes pl-3"><ul>`
  markdown.renderer.rules.footnote_block_close = () => `</ul></footer>`


  //Compute render
  const nav = []
  const headnav = new Set<DOMNode>()
  const meta = new Map()
  const render = document.createElement("div")
  render.innerHTML = markdown.render(text)
  const nodes = Array.from(render.childNodes) as DOMNode[]
  let slide = null, empty = false, footnotes = null as DOMNode|null, commented = false, scope = null
  while (nodes.length) {
    const node = nodes.shift() as DOMNode
    const {nodeName:tag} = node

    //Comments
    if (/^#comment$/i.test(tag)) {
      const {textContent:content} = node

      //Meta
      if (/^\s*\[d-meta\]\s+(?<key>[^:]*):\s+(?<value>[\s\S]*)/.test(content)) {
        const {key = "", value = ""} = content.match(/^\s*\[d-meta\]\s+(?<key>[^:]*):\s+(?<value>[\s\S]*)/)?.groups ?? {}
        if (!meta.has(key))
          meta.set(key.trim(), [])
        meta.get(key.trim())?.push(value.trim())
        continue
      }

      //Comment in-between
      if (/^\s*\[d-comment\s*$/.test(content)) {
        commented = true
        continue
      }
      if (/^\s*d-comment\]\s*$/.test(content)) {
        commented = false
        continue
      }

      //Include directive
      if (/^\s*\[d-include\]\s+(?<slides>[\s\S]*)/.test(content)) {
        const {slides} = content.match(/^\s*\[d-include\]\s+(?<slides>[\s\S]*)/)?.groups ?? {}
        const render = document.createElement("div")
        render.innerHTML = markdown.render(await fetch(slides).then(response => response.text()))
        nodes.unshift(...Array.from(render.childNodes) as DOMNode[])
        continue
      }

      //Un comment in-between
      if (/^\s*\[d-uncomment\s*\n(?<text>[\s\S]*?)\nd-uncomment\]\s*$/.test(content)) {
        const {text = ""} = content.match(/^\s*\[d-uncomment\s*\n(?<text>[\s\S]*?)\nd-uncomment\]\s*$/)?.groups ?? {}
        const render = document.createElement("div")
        render.innerHTML = markdown.render(text)
        nodes.unshift(...render.childNodes)
        continue
      }

    }
    if (commented)
      continue

    //Handle headers and separators
    if (/^h[1-6r]$/i.test(tag)) {
      //If previous slide was empty, switch to interlude
      if ((empty)&&(slide))
        slide.classList.add("interlude")

      slide = Slide()
      empty = true

      if (/^h[1-6]$/i.test(tag)) {
        headnav.add(node)
        const previous = Number(nav.slice(-1).shift()?.nodeName.substring(1) ?? 0)
        const current = Number(tag.substring(1))
        if (previous === current)
          nav[nav.length-1] = node
        else if (previous < current)
          nav.push(node)
        else if (previous > current) {
          for (let i = previous; i >= current; i--)
            nav.pop()
          nav.push(node)
        }
        scope = slug(node.innerText)
      }
      slide.appendChild(Nav(nav.slice(0, nav.length-1)))
      slide.appendChild(nav.slice(-1).shift()?.cloneNode(true))
      continue
    }

    //Handle footnotes
    if ((/^footer$/i.test(tag))&&([...node.classList].includes("footnotes"))) {
      footnotes = node as DOMNode
      continue
    }

    //Scoped styles
    if (/^style$/i.test(tag)) {
      node.innerText = node.innerText.replace(/:scope/g, `#${scope}`)
      slide?.appendChild(node)
      continue
    }

    //Scripts
    if (/^script$/i.test(tag)) {
      const {enter = null, leave = null} = await eval(`(async function() { return ${node.innerText.trimStart()} })()`) ?? {}
      if (enter)
        LISTENERS.enter.set(scope, enter)
      if (leave)
        LISTENERS.leave.set(scope, leave)
      continue
    }

    //Handle other nodes
    if (`${node.innerText ?? node.textContent ?? ""}`.trim().length)
      empty = false
    slide?.appendChild(node)

    //Handle code blocks
    if (/^pre$/i.test(tag)) {
      //Create code editor
      const code = node.querySelector("code")
      const editor = document.createElement("textarea")
      const initalContent = code.innerText
      const language = [...code.classList].filter(key => /^language-/.test(key)).shift()?.replace(/^language-/, "")
      editor.classList.add("editor", ...code.classList)
      editor.setAttribute("spellcheck", "false")
      editor.value = code.innerHTML ?? ""
      editor.addEventListener("keyup", Editor)
      editor.addEventListener("keydown", (event:event) => event.stopPropagation())
      //Create executor result
      const uuid = `${Math.random()}`.substring(2)
      const flash = document.createElement("div")
      flash.classList.add("flash", "executor-result", "text-mono", "text-small")
      flash.setAttribute("data-executor-uuid", uuid)
      slide?.appendChild(flash)
      //Actions
      const actions = document.createElement("div")
      actions.classList.add("code-actions")
      //Create reset button
      const reset = document.createElement("button")
      reset.classList.add("btn-octicon", "copy-button", "m-2")
      reset.setAttribute("type", "button")
      reset.addEventListener("click", () => {
        editor.value = initalContent
        code.innerHTML = initalContent
        Editor({target:editor}, {timeout:0, resize:true})
      })
      reset.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fill-rule="evenodd" d="M8 2.5a5.487 5.487 0 00-4.131 1.869l1.204 1.204A.25.25 0 014.896 6H1.25A.25.25 0 011 5.75V2.104a.25.25 0 01.427-.177l1.38 1.38A7.001 7.001 0 0114.95 7.16a.75.75 0 11-1.49.178A5.501 5.501 0 008 2.5zM1.705 8.005a.75.75 0 01.834.656 5.501 5.501 0 009.592 2.97l-1.204-1.204a.25.25 0 01.177-.427h3.646a.25.25 0 01.25.25v3.646a.25.25 0 01-.427.177l-1.38-1.38A7.001 7.001 0 011.05 8.84a.75.75 0 01.656-.834z"></path></svg>`
      actions.appendChild(reset)
      //Create copy button
      const copy = document.createElement("button")
      copy.classList.add("btn-octicon", "copy-button", "m-2")
      copy.setAttribute("type", "button")
      copy.setAttribute("data-clipboard-target", `[data-executor-uuid="${uuid}"] .editor`)
      copy.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fill-rule="evenodd" d="M5.75 1a.75.75 0 00-.75.75v3c0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75v-3a.75.75 0 00-.75-.75h-4.5zm.75 3V2.5h3V4h-3zm-2.874-.467a.75.75 0 00-.752-1.298A1.75 1.75 0 002 3.75v9.5c0 .966.784 1.75 1.75 1.75h8.5A1.75 1.75 0 0014 13.25v-9.5a1.75 1.75 0 00-.874-1.515.75.75 0 10-.752 1.298.25.25 0 01.126.217v9.5a.25.25 0 01-.25.25h-8.5a.25.25 0 01-.25-.25v-9.5a.25.25 0 01.126-.217z"></path></svg>`
      actions.appendChild(copy)
      //Create executor button
      if (SUPPORTED_LANGUAGES.test(language)) {
        const executor = document.createElement("button")
        executor.classList.add("btn-octicon", "executor-button", "m-2")
        executor.setAttribute("type", "button")
        executor.addEventListener("click", () => execute(uuid))
        executor.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fill-rule="evenodd" d="M1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zM8 0a8 8 0 100 16A8 8 0 008 0zM6.379 5.227A.25.25 0 006 5.442v5.117a.25.25 0 00.379.214l4.264-2.559a.25.25 0 000-.428L6.379 5.227z"></path></svg>`
        actions.appendChild(executor)
      }
      //Link code block to executor
      node.prepend(editor)
      node.appendChild(actions)
      node.setAttribute("data-executor-uuid", uuid)
      Editor({target:editor}, {timeout:0, resize:true})
    }
  }

  //Copy paste initializer
  new global.ClipboardJS(".copy-button")

  /** Checkbox formatter */
  function checkbox(element:DOMNode) {
    if (/^\s*\[[x ]\]\s+/.test(element.innerText)) {
      element.innerHTML = element.innerHTML.replace(/^\s*\[(?<checked>[x ])\]/, (_:string, checked:string) => `<input type="checkbox" ${checked === "x" ? "checked" : ""}>`)
      element.querySelectorAll("li").forEach(checkbox)
    }
  }
  document.querySelectorAll("li").forEach(checkbox)

  //Append footnotes
  if (footnotes) {
    new Set([...document.querySelectorAll(".slide .footnote-ref")].map(element => element.closest(".slide .container-md"))).forEach((element:DOMNode) => {
      const hr = document.createElement("hr")
      element.appendChild(hr)
      const localFootnotes = (footnotes as DOMNode).cloneNode(true)
      const references = [...element.querySelectorAll(".footnote-ref a")].map(footnote => footnote.getAttribute("href").substring(1))
      localFootnotes.querySelectorAll("li").forEach((element:DOMNode) => references.includes(element.id) ? element.querySelector("p").prepend(`${element.id.replace(/^fn/, "")}. `) : element.remove())
      element.appendChild(localFootnotes)
    })
  }

  //Create links
  document.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach(element => element.closest(".slide").id = slug(element.innerText))

  //Create header nav
  headnav.forEach(element => {
    const li = document.createElement("li")
    li.innerHTML = `<a class="dropdown-item" href="#${slug(element.innerText)}">${element.innerText.replace(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g, "").trim()}</a>`
    document.querySelector(".Header .dropdown-menu")?.appendChild(li)
  })

  //Smooth scroll anchors
  document.querySelectorAll(`a[href^="#"]`).forEach(anchor =>
    anchor.addEventListener("click", function (this:DOMNode, event:event) {
      event.preventDefault()
      document.querySelector(this.getAttribute("href"))?.scrollIntoView({behavior:"smooth"})
    })
  )

  function Meta(data:loose) {
    if (data.has("title")) {
      const title = document.querySelector(".meta-title")
      if (title)
        title.innerText = data.get("title").shift() ?? ""
      document.title = data.get("title")
    }
    if (data.has("menu-link")) {
      document.querySelector(".d-title")?.after(...data.get("menu-link").map((link:string) => {
        const item = document.createElement("div")
        item.classList.add("Header-item")
        item.innerHTML = markdown.render(link)
        item.innerHTML = item.querySelector("p").innerHTML
        const a = item.querySelector("a")
        if (a) {
          a.classList.add("Header-link")
          a.target = "_blank"
        }
        return item
      }))
    }
  }
  Meta(meta)

  document.querySelectorAll(".d-only-loading").forEach(element => element.remove())
  document.querySelectorAll(".d-none-loading").forEach(element => element.classList.remove("d-none-loading"))

  //Set page
  page(undefined, {updateState:false})
  document.querySelector(`a[href="${location.hash}"]`)?.click()

  let ticking = false
  document.querySelector(".slides")?.addEventListener("scroll", () => {
    if (!ticking)
      global.requestAnimationFrame(() => (page(), ticking = false))
    ticking = true
  })
  document.addEventListener("keydown", event => {
    switch (event.key) {
      case "ArrowLeft": return page(-1)
      case "ArrowRight": return page(+1)
    }
  })

  document.querySelector(".previous_page")?.addEventListener("click", () => page(-1))
  document.querySelector(".next_page")?.addEventListener("click", () => page(+1))
  document.querySelector("[aria-current='page']")?.addEventListener("click", () => page(0))

  //Theme chooser
  //deno-lint-ignore no-explicit-any
  let theme = (globalThis as any).matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  document.querySelector(".d-theme-switch")?.addEventListener("click", () => {
    const html = document.querySelector("html")
    if (html) {
      //Hide current version toggle
      {
        const toggle = document.querySelector(`.d-theme-switch-${theme}`)
        if (toggle)
          toggle.style.display = "none"
      }
      //Switch color mode
      theme = {dark:"light", light:"dark"}[theme] ?? "light"
      html.dataset.colorMode = theme
      //Show alternate version toggle
      {
        const toggle = document.querySelector(`.d-theme-switch-${theme}`)
        if (toggle)
          toggle.style.display = "block"
      }
    }
  })
  const toggle = document.querySelector(`.d-theme-switch-${theme}`)
  if (toggle)
    toggle.style.display = "block"

}