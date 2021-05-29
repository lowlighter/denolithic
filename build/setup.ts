//Imports
import { parse } from "https://deno.land/std@0.97.0/encoding/yaml.ts";
import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

//Create a new DOM element with the given attributes
function setElement(type: string, attrs: any){
    let elem = html.createElement(type)
    for (const [key, value] of Object.entries(attrs))
        elem.setAttribute(key, value)
    return elem
}

//Load static/base.html
const index = await fetch("https://raw.githubusercontent.com/lowlighter/denolithic/main/templates/index.html").then(response => response.text())
//await Deno.readTextFile(`${Deno.cwd()}/templates/index.html`)
let html: any = new DOMParser().parseFromString(index, "text/html")

//Load config.yml
const _config = await fetch("https://raw.githubusercontent.com/lowlighter/denolithic/main/templates/index.html").then(response => response.text())
let config: any = parse(_config)

//Set company name
if(config["name"]){
    //TODO
}

//Set custom css
config["styles"]?.forEach((stylePath: string ) => {
    let attrs = {
        "href" : `static/${stylePath}`,
        "rel": "stylesheet"
    }
    html.head.appendChild(setElement("link", attrs))
})

//Set plugins dependecies
// TODO Manage markdown-it plugins
config["plugins"].forEach((element: string ) => {
    switch(element){
        case "katex" : {
            // Add css
            html.body.appendChild(setElement("link", {
                "href" : "https://cdn.jsdelivr.net/npm/katex@0.13.11/dist/katex.min.css",
                "integrity": "sha384-Um5gpz1odJg5Z4HAmzPtgZKdTBHZdw8S29IecapCSB31ligYPhHQZMIlWLYQGVoc",
                "crossorigin": "anonymous",
                "rel": "stylesheet"
            }))

            // Add min.js
            let elemScript = setElement("link", {
                "href" : "https://cdn.jsdelivr.net/npm/katex@0.13.11/dist/katex.min.js",
                "integrity": "sha384-YNHdsYkH6gMx9y3mRkmcJ2mFUjTd0qNQQvY9VYZgQd7DcN7env35GzlmFaZ23JGp",
                "crossorigin": "anonymous"
            })
            elemScript.defer = true
            html.body.appendChild(elemScript)

            break
        }
    }
})

//Generate index.html
html = `
<!DOCTYPE html>
<html>
  <head>
    ${html.head.innerHTML}
  </head>
  <body>
   ${html.body.innerHTML}
  </body>
 </html>`;
Deno.writeTextFileSync(`${Deno.cwd()}/index.html`, html);

// TODO Remove template folder
await Deno.remove('./templates', { recursive: true });