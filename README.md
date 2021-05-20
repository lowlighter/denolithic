<!--
name: Denolithic
author: lowlighter
-->

# 🦕 Denolithic

Denolithic is a powerful markdown powered presentation tool which can transform any markdown file into slides.

![](https://user-images.githubusercontent.com/22963968/119055511-75bfc800-b9c9-11eb-8adf-5ee3a774b2cb.gif)

## ✨ Features
- Markdown powered slides, including extended markup features and raw html support
- Interactive, editable and syntax-colored code blocks
  - JS and TS code snippetes can even be ran live!
- Smooth design powered by GitHub's primer style
- Intuitive controls and navigation elements, including linkable slides
- Metadata support

## 👨‍🔬 Using denolithic

This `README.md` is intended to be viewed as [denolithic presentation slides](https://denolithic.vercel.app/).

Check it out there for a full experience!

**🌧️ Deploy your own instance with Vercel**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Flowlighter%2Fdenolithic&env=DENO_UNSTABLE&envDescription=Set%20to%20true%20to%20enable%20unstable%20features%20of%20deno%20runtime%20(required%20for%20code%20execution)&project-name=denolithic&repository-name=denolithic&demo-title=Denolithic&demo-description=Create%20presentation%20slides%20from%20markdown&demo-url=https%3A%2F%2Fdenolithic.vercel.app&demo-image=https%3A%2F%2Fdenolithic.vercel.app%2Fstatic%2Fopengraph.png)

**🧪 Test it on your own markdown file!**

<form class="d-flex">
  <input id="denolithic-it" class="form-control flex-1 mr-2" type="url" placeholder="Link to a markdown file">
  <button type="button" class="btn btn-primary" onclick="window.location.replace(`${location.pathname}?target=${encodeURIComponent(document.querySelector('#denolithic-it').value)}`)">Denolithic it!</button>
</form>

### 👨‍🏫 Presenting slides

Each markdown header (`#` to `######`) will create a new slide, with its content as title.
A slug will also be associated with it so you can share a specific slide link.

Large sections can be splitted into smaller slides using horizontal rules (`___`).
In this case, the new slide will inherit title from previous slide

**🎮 Controls**

Navigate through slides using:
- Horizontal scroll
- Arrow keys <kbd>←</kbd> and <kbd>→</kbd>
- `Previous` and `Next` buttons *(located at the bottom of page)*

### 💻 Embedding code blocks

Code blocks are syntax-colored, content editable, copy-pastable and runnable

```ts
import { cyan } from "https://deno.land/std@0.97.0/fmt/colors.ts";
console.log(`Hello, ${cyan("世界")}`)
```

- Use `reset` button to restore inital code snippet content (in case you edited it)
- Use `copy` button to copy code snippet to your clipboard
- Use `run` button (or <kbd>Ctrl</kbd>+<kbd>Enter</kbd> when focused) to run code snippet

<span class="color-text-secondary">*Process will be killed if it exceeds allowed time execution limit*</span>

### ✍️ Writing content using markdown

*[ABBREVIATION]: This details abbreviation
[^1]: This is Jojo reference

You can use common markdown to style your content with **bold text**, *italic text*, ~~strikethrough text~~, `inline code`, [links](#), references[^1], ==highlighted text==, ABBREVIATION, etc.

Raw links will be transformed into actual links (like https://github.com/lowlighter/denolithic) while some characters sequences will be replaced with a nicer typography: (c), (tm), +-, -- and ---, ...

<div class="container d-flex">

  <div class="col-3 text-center">

| Table              |     |
| -------------------| :-: |
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

### ✍️ Writing content using raw HTML

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

## 📜 License

> MIT License<br>
> Copyright (c) 2021-present [@lowlighter](https://github.com/lowlighter)

**🥇 Credits**

[lowlighter/denolithic](https://github.com/lowlighter/denolithic) is powered by:
* [vercel](https://vercel.com)
* [vercel-deno](https://github.com/TooTallNate/vercel-deno)
* [primer css](https://github.com/primer/css)
* [markdown-it and plugins](https://github.com/markdown-it/markdown-it)
