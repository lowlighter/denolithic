const SUPPORTED_LANGUAGES = /js|ts|javascript|typescript/i

/** Transform into slug */
function slug(text) {
  return text.replace(/[^\w]/g, "-").replace(/-+/g, "-").replace(/(^-)|(-$)/, "").toLocaleLowerCase()
}

/** Page selector */
function page(direction) {
  const slides = document.querySelector(".slides")
  if (slides) {
    const pages = document.querySelectorAll(".slides .slide")?.length ?? 0
    const width = window.innerWidth
    const current = Math.round(slides.scrollLeft/width)
    if (typeof direction === "number")
      slides.scroll({left:(current+direction)*width, behavior:"smooth"})
    document.querySelector(".previous_page").setAttribute("aria-disabled", current === 0)
    document.querySelector(".next_page").setAttribute("aria-disabled", current === pages-1)
    document.querySelector(".slides-progress > *").style.width = `${(100*slides.scrollLeft/((pages-1)*width)).toFixed(1)}%`
    document.querySelector("[aria-current='page']").innerText = `${current+1} / ${pages}`

    const slide = document.querySelector(`.slides .slide:nth-child(${current+1})`)
    if ((slide)&&(typeof direction !== "string")&&(location.hash !== `#${slide.id}`))
      history.replaceState(null, slide.querySelector("h1, h2, h3, h4, h5, h6").innerText, `#${slide.id}`);
  }
}
document.querySelector(".slides").addEventListener("scroll", () => page())
document.addEventListener("keydown", event => {
  switch (event.key) {
    case "ArrowLeft": return page(-1)
    case "ArrowRight": return page(+1)
  }
})

/** Remote script executor */
async function execute(uuid) {
  //Check
  const executor = document.querySelector(`.executor-result[data-executor-uuid="${uuid}"]`)
  if (executor) {
    //Load script
    const body = document.querySelector(`[data-executor-uuid="${uuid}"] code`).innerText
    try {
      //Run script
      document.querySelector(`[data-executor-uuid="${uuid}"] .executor-button`).disabled = true
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
      document.querySelector(`[data-executor-uuid="${uuid}"] .executor-button`).disabled = false
    }
  }
}

/** Slides setup */
async function setup(text) {
  const markdown = markdownit({langPrefix:"language-", html:true, linkify:true, typographer:true})
    .use(markdownitFootnote)
    .use(markdownitMark)
    .use(markdownitAbbr)
    .use(markdownitDeflist)
    .use(markdownitContainer, "info", {render:(tokens, index) => tokens[index].nesting === 1 ? `<div class="flash">` : `</div>`})
    .use(markdownitContainer, "warn", {render:(tokens, index) => tokens[index].nesting === 1 ? `<div class="flash flash-warn">` : `</div>`})
    .use(markdownitContainer, "error", {render:(tokens, index) => tokens[index].nesting === 1 ? `<div class="flash flash-error">` : `</div>`})
    .use(markdownitContainer, "success", {render:(tokens, index) => tokens[index].nesting === 1 ? `<div class="flash flash-success">` : `</div>`})
  markdown.renderer.rules.footnote_block_open = () => `<footer class="footnotes pl-3"><ul>`
  markdown.renderer.rules.footnote_block_close = () => `</ul></footer>`

  /** Slide creator */
  function Slide() {
    //Slide wrapper
    const slide = document.createElement("article")
    slide.classList.add("p-6", "slide")
    document.querySelector(".slides").appendChild(slide)
    //Slide content
    const container = document.createElement("div")
    container.classList.add("container-md")
    slide.appendChild(container)
    const body = document.createElement("div")
    body.classList.add("markdown-body", "col-12")
    container.appendChild(body)
    return body
  }

  /** Nav builder */
  function Nav(elements) {
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

  /** Code editor */
  function vim({target, key, ctrlKey}) {
    //Hightlight code
    try {
      const language = [...target.classList].filter(key => /^language-/.test(key)).shift()?.replace(/^language-/, "")
      if (hljs.getLanguage(language)) {
        target.parentNode.querySelector("code:not(.editor)").innerHTML = hljs.highlight(target.innerText, {language, ignoreIllegals:true}).value
      }
    } catch {}
    //Handle code execution shortcut
    if ((key === "Enter")&&(ctrlKey))
      execute(target.parentNode.getAttribute("data-executor-uuid"))
  }

  //Compute render
  const nav = []
  const headnav = new Set()
  const meta = new Map()
  const render = document.createElement("div")
  render.innerHTML = markdown.render(text)
  const nodes = Array.from(render.childNodes)
  let slide = null, empty = false, footnotes = null, commented = false
  while (nodes.length) {
    const node = nodes.shift()
    const {nodeName:tag} = node

    //Comments
    if (/^#comment$/i.test(tag)) {
      const {textContent:content} = node

      //Meta
      if (/^\s*\[d-meta\]\s+(?<key>[^:]*):\s+(?<value>[\s\S]*)/.test(content)) {
        const {key = "", value = ""} = content.match(/^\s*\[d-meta\]\s+(?<key>[^:]*):\s+(?<value>[\s\S]*)/)?.groups ?? {}
        meta.set(key.trim(), value.trim())
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

      slide = new Slide()
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
      }
      slide.appendChild(Nav(nav.slice(0, nav.length-1)))
      slide.appendChild(nav.slice(-1).shift().cloneNode(true))
      continue
    }

    //Handle footnotes
    if ((/^footer$/i.test(tag))&&([...node.classList].includes("footnotes"))) {
      footnotes = node
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
      const editor = document.createElement("code")
      const initalContent = code.innerText
      const language = [...code.classList].filter(key => /^language-/.test(key)).shift()?.replace(/^language-/, "")
      editor.classList.add("editor", ...code.classList)
      editor.setAttribute("contenteditable", true)
      editor.setAttribute("spellcheck", false)
      editor.innerHTML = code.innerHTML ?? ""
      editor.addEventListener("keyup", vim)
      editor.addEventListener("keydown", event => event.stopPropagation())
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
      reset.classList.add("btn", "btn-sm", "primary", "copy-button", "m-2")
      reset.setAttribute("type", "button")
      reset.addEventListener("click", () => {
        editor.innerHTML = initalContent
        code.innerHTML = initalContent
        vim({target:code})
      })
      reset.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fill-rule="evenodd" d="M8 2.5a5.487 5.487 0 00-4.131 1.869l1.204 1.204A.25.25 0 014.896 6H1.25A.25.25 0 011 5.75V2.104a.25.25 0 01.427-.177l1.38 1.38A7.001 7.001 0 0114.95 7.16a.75.75 0 11-1.49.178A5.501 5.501 0 008 2.5zM1.705 8.005a.75.75 0 01.834.656 5.501 5.501 0 009.592 2.97l-1.204-1.204a.25.25 0 01.177-.427h3.646a.25.25 0 01.25.25v3.646a.25.25 0 01-.427.177l-1.38-1.38A7.001 7.001 0 011.05 8.84a.75.75 0 01.656-.834z"></path></svg>`
      actions.appendChild(reset)
      //Create copy button
      const copy = document.createElement("button")
      copy.classList.add("btn", "btn-sm", "primary", "copy-button", "m-2")
      copy.setAttribute("type", "button")
      copy.setAttribute("data-clipboard-target", `[data-executor-uuid="${uuid}"] .editor`)
      copy.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fill-rule="evenodd" d="M5.75 1a.75.75 0 00-.75.75v3c0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75v-3a.75.75 0 00-.75-.75h-4.5zm.75 3V2.5h3V4h-3zm-2.874-.467a.75.75 0 00-.752-1.298A1.75 1.75 0 002 3.75v9.5c0 .966.784 1.75 1.75 1.75h8.5A1.75 1.75 0 0014 13.25v-9.5a1.75 1.75 0 00-.874-1.515.75.75 0 10-.752 1.298.25.25 0 01.126.217v9.5a.25.25 0 01-.25.25h-8.5a.25.25 0 01-.25-.25v-9.5a.25.25 0 01.126-.217z"></path></svg>`
      actions.appendChild(copy)
      //Create executor button
      if (SUPPORTED_LANGUAGES.test(language)) {
        const executor = document.createElement("button")
        executor.classList.add("btn", "btn-sm", "primary", "executor-button", "m-2")
        executor.setAttribute("type", "button")
        executor.addEventListener("click", () => execute(uuid))
        executor.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fill-rule="evenodd" d="M1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zM8 0a8 8 0 100 16A8 8 0 008 0zM6.379 5.227A.25.25 0 006 5.442v5.117a.25.25 0 00.379.214l4.264-2.559a.25.25 0 000-.428L6.379 5.227z"></path></svg>`
        actions.appendChild(executor)
      }
      //Link code block to executor
      node.prepend(editor)
      node.appendChild(actions)
      node.setAttribute("data-executor-uuid", uuid)
      vim({target:code})
    }
  }

  //Copy paste initializer
  new ClipboardJS(".copy-button")

  /** Checkbox formatter */
  function checkbox(element) {
    if (/^\s*\[[x ]\]\s+/.test(element.innerText)) {
      element.innerHTML = element.innerHTML.replace(/^\s*\[(?<checked>[x ])\]/, (m, checked) => `<input type="checkbox" ${checked === "x" ? "checked" : ""}>`)
      element.querySelectorAll("li").forEach(checkbox)
    }
  }
  document.querySelectorAll("li").forEach(checkbox)

  //Append footnotes
  if (footnotes) {
    new Set([...document.querySelectorAll(".slide .footnote-ref")].map(element => element.closest(".slide .container-md"))).forEach(element => {
      const hr = document.createElement("hr")
      element.appendChild(hr)
      const localFootnotes = footnotes.cloneNode(true)
      const references = [...element.querySelectorAll(".footnote-ref a")].map(footnote => footnote.getAttribute("href").substring(1))
      localFootnotes.querySelectorAll("li").forEach(element => references.includes(element.id) ? element.querySelector("p").prepend(`${element.id.replace(/^fn/, "")}. `) : element.remove())
      element.appendChild(localFootnotes)
    })
  }

  //Create links
  document.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach(element => element.closest(".slide").id = slug(element.innerText))

  //Create header nav
  headnav.forEach(element => {
    const li = document.createElement("li")
    li.innerHTML = `<a class="dropdown-item" href="#${slug(element.innerText)}">${element.innerText.replace(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g, "").trim()}</a>`
    document.querySelector(".Header .dropdown-menu").appendChild(li)
  })

  //Smooth scroll anchors
  document.querySelectorAll(`a[href^="#"]`).forEach(anchor =>
    anchor.addEventListener("click", function (event) {
      event.preventDefault()
      document.querySelector(this.getAttribute("href")).scrollIntoView({behavior:"smooth"})
    })
  )

  function Meta(data) {
    if (data.has("title")) {
      document.querySelector(".meta-title").innerText = data.get("title")
      document.title = data.get("title")
    }
  }
  Meta(meta)

  document.querySelectorAll(".d-only-loading").forEach(element => element.remove())
  document.querySelectorAll(".d-none-loading").forEach(element => element.classList.remove("d-none-loading"))

  //Set page
  page(location.hash)
}

/** Load content */
async function load() {
  const target = new URLSearchParams(window.location.search).get("target")
  return (target ? fetch("/api/load.ts", {method:"POST", body:target}) : fetch("/README.md")).then(response => response.text())
}

(async () => setup(await load()))()