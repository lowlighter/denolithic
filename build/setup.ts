//Imports
import { parse,  stringify } from "https://deno.land/std@0.97.0/encoding/yaml.ts";
import { DOMParser, Element } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import "https://deno.land/x/file_fetch@0.1.0/polyfill.ts";

//Create a new DOM element with the given attributes
function setElement(type: string, attrs: any){
    let elem = html.createElement(type)
    for (const [key, value] of Object.entries(attrs))
        elem.setAttribute(key, value)
    return elem
}

console.log(Deno.cwd())
try { console.log(await Deno.stat("./templates/index.html")) } catch (error) { console.log(error) }
try { console.log(await Deno.stat(`${Deno.cwd()}/templates/index.html`)) } catch (error) { console.log(error) }
console.log(await Deno.stat(`${Deno.cwd()}/templates/index.html`))

try { console.log(await Deno.readTextFile(`${Deno.cwd()}/templates/index.html`)) } catch (error) { console.log(error) }
try { console.log(await Deno.writeTextFile(`${Deno.cwd()}/index.html`, "hello world")) } catch (error) { console.log(error) }
try { console.log(await fetch("file:///vercel/path1/templates/index.html").then(response => response.text())) } catch (error) { console.log(error) }

//Load static/base.html
let html: any = new DOMParser().parseFromString(await Deno.readTextFile(`${Deno.cwd()}/templates/index.html`), "text/html")

//Load config.yml
let config: any = parse(await Deno.readTextFile(`${Deno.cwd()}/config.yml`))

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