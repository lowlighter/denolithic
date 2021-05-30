### 👨‍🏫 Presenting slides

Each markdown header (`#` to `######`) will create a new slide, with its content as title.
A slug will also be associated with it so you can share a specific slide link.
Browser url will automatically be updated to match current slide.

Large sections can be splitted into smaller slides using horizontal rules (`___`).
In this case, the new slide will inherit title from previous slide

**🎮 Controls**

Navigate through slides using:
- Horizontal scroll
- Arrow keys <kbd>←</kbd> and <kbd>→</kbd>
- `Previous` and `Next` buttons *(located at the bottom of page)*

### 👨‍💻 Embedding code blocks

Code blocks are syntax-colored, content editable, copy-pastable and runnable

```ts
import { cyan } from "https://deno.land/std@0.97.0/fmt/colors.ts";
console.log(`Hello, ${cyan("世界")}`)
```

- Use `reset` button to restore inital code snippet content (in case you edited it)
- Use `copy` button to copy code snippet to your clipboard
- Use `run` button (or <kbd>Ctrl</kbd>+<kbd>Enter</kbd> when focused) to run code snippet

<span class="color-text-secondary">*Process will be killed if it exceeds allowed time execution limit. It is subject to Vercel's serverless function limitations*</span>

### 👷 Writing content using markdown

*[ABBREVIATION]: This details abbreviation
[^1]: This is Jojo reference

You can use common markdown to style your content with **bold text**, *italic text*, ~~strikethrough text~~, `inline code`, [links](#), references[^1], ==highlighted text==, ABBREVIATION, etc.

Raw links will be transformed into actual links (like https://github.com/lowlighter/denolithic) while some characters sequences will be replaced with a nicer typography: (c), (tm), +-, -- and ---, ...

<div class="container d-flex">

  <div class="col-3 text-center">

| Table              |     |
| ------------------ | :-: |
| Denolithic         | ✔️ |

  </div>
  <div class="col-3 text-center">

> A remarquable quote

  </div>
  <div class="col-3 text-center">

Important concept
: Concept definition

  </div>
  <div class="col-3 text-center">

![image](https://user-images.githubusercontent.com/22963968/119019292-5a3ec800-b99d-11eb-9fed-89409a48a664.png)

  </div>
</div>

::: info
Display `info`, `warn`, `error` and `success` messages using triple colons `:::`
:::

### 👷 Writing content using raw HTML

It is also possible to use html tags for complex content like <kbd>keyboard keys</kbd>, <sup>superscript</sup> or <sub>subscript</sub> texts, etc.

<details>
  <summary>Like creating expandable sections</summary>
  Hello there!
</details>

You can directly use `style` attribute to <span style="color: darkred">change text color</span> for example.

Or use [primer css style](https://primer.style/css/) predefined classes like below:

<div class="TimelineItem">
  <div class="TimelineItem-badge bg-red text-white">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fill-rule="evenodd" d="M4.25 2.5c-1.336 0-2.75 1.164-2.75 3 0 2.15 1.58 4.144 3.365 5.682A20.565 20.565 0 008 13.393a20.561 20.561 0 003.135-2.211C12.92 9.644 14.5 7.65 14.5 5.5c0-1.836-1.414-3-2.75-3-1.373 0-2.609.986-3.029 2.456a.75.75 0 01-1.442 0C6.859 3.486 5.623 2.5 4.25 2.5zM8 14.25l-.345.666-.002-.001-.006-.003-.018-.01a7.643 7.643 0 01-.31-.17 22.075 22.075 0 01-3.434-2.414C2.045 10.731 0 8.35 0 5.5 0 2.836 2.086 1 4.25 1 5.797 1 7.153 1.802 8 3.02 8.847 1.802 10.203 1 11.75 1 13.914 1 16 2.836 16 5.5c0 2.85-2.045 5.231-3.885 6.818a22.08 22.08 0 01-3.744 2.584l-.018.01-.006.003h-.002L8 14.25zm0 0l.345.666a.752.752 0 01-.69 0L8 14.25z"></path></svg>
  </div>
  <div class="TimelineItem-body">
    Amazing project!
  </div>
</div>
<div class="TimelineItem">
  <div class="TimelineItem-badge bg-green text-white">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fill-rule="evenodd" d="M14.064 0a8.75 8.75 0 00-6.187 2.563l-.459.458c-.314.314-.616.641-.904.979H3.31a1.75 1.75 0 00-1.49.833L.11 7.607a.75.75 0 00.418 1.11l3.102.954c.037.051.079.1.124.145l2.429 2.428c.046.046.094.088.145.125l.954 3.102a.75.75 0 001.11.418l2.774-1.707a1.75 1.75 0 00.833-1.49V9.485c.338-.288.665-.59.979-.904l.458-.459A8.75 8.75 0 0016 1.936V1.75A1.75 1.75 0 0014.25 0h-.186zM10.5 10.625c-.088.06-.177.118-.266.175l-2.35 1.521.548 1.783 1.949-1.2a.25.25 0 00.119-.213v-2.066zM3.678 8.116L5.2 5.766c.058-.09.117-.178.176-.266H3.309a.25.25 0 00-.213.119l-1.2 1.95 1.782.547zm5.26-4.493A7.25 7.25 0 0114.063 1.5h.186a.25.25 0 01.25.25v.186a7.25 7.25 0 01-2.123 5.127l-.459.458a15.21 15.21 0 01-2.499 2.02l-2.317 1.5-2.143-2.143 1.5-2.317a15.25 15.25 0 012.02-2.5l.458-.458h.002zM12 5a1 1 0 11-2 0 1 1 0 012 0zm-8.44 9.56a1.5 1.5 0 10-2.12-2.12c-.734.73-1.047 2.332-1.15 3.003a.23.23 0 00.265.265c.671-.103 2.273-.416 3.005-1.148z"></path></svg>
  </div>
  <div class="TimelineItem-body">
    This is the beginning of a new adventure!
  </div>
</div>

### 👨‍🎨 Styling slides

When using `<style>` tags, [`:scope`](https://developer.mozilla.org/en-US/docs/Web/CSS/:scope) will be automatically changed to current slide:

```css
<style>
  :scope .gradient-animated {
    animation: gradient-animation 10s ease-in-out infinite;
    background: linear-gradient(-60deg, #16BFFD, #16BFFD, #CB3066, #CB3066);
    background-clip: text;
  }
</style>
```

```html
<p class="gradient-animated">Wow look at this cool gradient animation!</p>
```

Will result into the following:

<p class="gradient-animated">Wow look at this cool gradient animation!</p>

You can use this to locally define custom style, like a custom background!

::: warn
Note that if you do not precede your rules by `:scope` selector, these will be applied globally!
:::

<style>
  :scope .gradient-animated {
    animation: gradient-animation 10s ease-in-out infinite;
    background: linear-gradient(-60deg, #16BFFD, #16BFFD, #CB3066, #CB3066);
    background-size: 300%;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  @keyframes gradient-animation {
    0% { background-position: 0 50%; }
    50% { background-position: 100%; }
    100% { background-position: 0 50%; }
  }
</style>

### 👨‍🏭 Scripting slides

Each slide supports a limited set of events, which can be listened to execute small JavaScript snippets.
To use this feature, embed a `script` tag which returns an object:
```html
<script>
  {
    enter() { /* Execute code when entering slide */ },
    leave() { /* Execute code when leaving slide */ },
  }
</script>
```

You can use it for small interactions like `<canvas>` drawing or confetti popping 🎉 !

::: error
Note that code is actually interpreted through [`eval`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval) so pay attention to what you're running when using this
:::

<script>
  {
    async enter() {
      if (!window.confetti) {
        const script = document.createElement("script")
        script.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.4.0/dist/confetti.browser.min.js"
        document.querySelector("body").append(script)
        await new Promise((solve) => script.addEventListener("load", solve))
      }
      for (const {angle, x} of [{angle:60, x:0}, {angle:120, x:1}])
        confetti({particleCount:50, spread:55, angle, origin:{x}})
    },
  }
</script>

### 🤵 Using meta-tags and meta-data

The following meta-tags are supported:

| Meta-tag                        | Effect                                                  |
| ------------------------------- | ------------------------------------------------------- |
| `[d-comment` and `d-comment]`   | Content between these instructions will not be rendered |
| `[d-uncomment ... d-uncomment]` | Content within this instruction will be rendered        |
| `[d-meta] key: value`           | Define a meta-data value                                |
| `[d-include] /url`              | Include another slides markdown document                |

These can be used to describe what should be ignored by classic markdown renderers and what should be displayed by denolithic.

Supported meta-data :
- `title` sets both html and header title
- `author` sets author name
- `menu-link` add a link in header menu
