//Imports
import type { configuration } from "./types.ts"
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
  const index = await fetch("https://raw.githubusercontent.com/lowlighter/denolithic/main/templates/index.html").then(response => response.text())
  const document = new DOMParser().parseFromString(index, "text/html") as Document

  //Load configuration
  console.log("loading configuration file")
  const configuration = parse(await fetch("https://raw.githubusercontent.com/lowlighter/denolithic/main/config.yml").then(response => response.text())) as configuration

  //Set company name
  if(configuration.name) {
      //TODO
  }

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
    <html>
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

/** Create a new DOM element with the given attributes */
function createElement(document:Document, type: string, attributes: {[key:string]:string|boolean|number}){
  const element = document.createElement(type)
  for (const [key, value] of Object.entries(attributes))
      element.setAttribute(key, value)
  return element
}