//Imports
import type { configuration as Configuration } from "./types.ts"
import { parse } from "https://deno.land/std@0.97.0/encoding/yaml.ts"
import { copy, exists } from "https://deno.land/std@0.97.0/fs/mod.ts"
import { DOMParser, Document } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts"

/** Create public directory */
export async function createPublicDirectory() {
  //Clean public directory
  console.log("cleaning public directory")
  if (await exists("public"))
  await Deno.remove("public", { recursive: true })
  //Create public directory
  console.log("creating public directory")
  await Deno.mkdir("public", { recursive: true })
}

/** Template HTML index and publish it to public directory */
export async function templateIndexHTML() {
  //Load templates/index.html
  console.log("loading templates/index.html")
  const index = await readTextFile("templates/index.html")
  let document = new DOMParser().parseFromString(index, "text/html") as Document

  //Load configuration
  console.log("loading configuration file")
  const configuration = parse(await readTextFile("config.yml")) as Configuration

  //Set signature
  if(configuration?.signature && document.querySelector(".footer-signature")) {
    document.querySelector(".footer-signature")!.innerHTML = configuration.signature
  }

  //Set logo
  if(configuration?.logo) {
    //TODO
  }

  //Opengraph metadata
  console.log("applying opengraph metadata")
  Object.entries(configuration.opengraph ?? {}).forEach((property, content) =>
    document.head.appendChild(createElement(document, "meta", {property:`og:${property}`, content}))
  )

  //Set plugins dependecies
  //TODO Manage markdown-it plugins
  console.log("enabling plugins")
  configuration.plugins?.forEach(plugin => {
    switch(plugin) {
      case "katex" : {
          //Add styles
          document.head.appendChild(createElement(document, "link", {
            href : "https://cdn.jsdelivr.net/npm/katex@0.13.11/dist/katex.min.css",
            integrity: "sha384-Um5gpz1odJg5Z4HAmzPtgZKdTBHZdw8S29IecapCSB31ligYPhHQZMIlWLYQGVoc",
            crossorigin: "anonymous",
            rel: "stylesheet"
          }))

          //Add scripts
          document.body.appendChild(createElement(document, "script", {
            href : "https://cdn.jsdelivr.net/npm/katex@0.13.11/dist/katex.min.js",
            integrity: "sha384-YNHdsYkH6gMx9y3mRkmcJ2mFUjTd0qNQQvY9VYZgQd7DcN7env35GzlmFaZ23JGp",
            crossorigin: "anonymous",
            defer: true
          }))

          break
      }
    }
  })

  //Set custom css
  console.log("applying additional styles")
  configuration.styles?.forEach(href => {
    console.log(`applying addition styles: ${href}`)
    document.head.appendChild(createElement(document, "link", {href, rel:"stylesheet"}))
  })

  //Set custom javascripts
  console.log("applying additional javascripts")
  configuration.styles?.forEach(src => {
    console.log(`applying addition javascripts: ${src}`)
    document.body.appendChild(createElement(document, "link", {src, defer:true}))
  })

  //Generate index.html
  console.log("templating public/index.html")
  const html = `
    <!DOCTYPE html>
    <html data-color-mode="auto" data-light-theme="light" data-dark-theme="dark">
      <head>
        ${document.head.innerHTML}
      </head>
      <body>
        ${document.body.innerHTML}
      </body>
    </html>`
  await Deno.writeTextFileSync("public/index.html", html)
}

/** Copy static assets to public directory */
export async function copyStaticAssets() {
  for (const {source, destination} of [{source:"README.md", destination:"public/README.md"}, {source:"static", destination:"public"}, {source:"static/slides", destination:"public"}]) {
    console.log(`copying ${source} to ${destination}`)
    await copy(source, destination, {overwrite: true})
  }
}

/** Bundle client app from typescript to a single javascript file */
export async function bundleClientApp() {
  console.log("bundling client app")
  const {files, diagnostics} = await Deno.emit("app/mod.ts", {bundle:"classic", compilerOptions:{}})
  if (diagnostics.length) {
    console.error(Deno.formatDiagnostics(diagnostics))
    throw new Error(`Failed to bundle app.js correctly`)
  }
  await Deno.writeTextFile("public/app.js", Object.entries(files).filter(([file]) => /bundle.js$/.test(file)).map(([_, value]) => value).shift() ?? "")
}

/** Create a new DOM element with the given attributes */
function createElement(document:Document, type: string, attributes: {[key:string]:string|boolean|number}){
  const element = document.createElement(type)
  for (const [key, value] of Object.entries(attributes))
      element.setAttribute(key, value)
  return element
}

/** Read text file magic */
async function readTextFile(file:string) {
  try {
    return Deno.readTextFile(file)
  }
  catch {
    console.warn(`failed to read ${file} using Deno.readTextFile`)
    let process
    try {
      process = Deno.run({cmd:["cat", file], stdout:"piped", stderr:"piped"})
      return new TextDecoder().decode(await process.output())
    }
    catch {
      console.warn(`failed to read ${file} using Deno.run`)
      return fetch(`https://raw.githubusercontent.com/lowlighter/denolithic/main/${file}`).then(response => response.text())
    }
    finally {
      process?.close()
    }
  }
}