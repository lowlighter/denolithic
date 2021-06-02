<!-- [d-meta] title: Denolithic -->
<!-- [d-meta] author: lowlighter -->
<!-- [d-meta] menu-link: [Source](https://github.com/lowlighter/denolithic) -->
<!-- [d-meta] menu-link: [Sponsor](https://github.com/sponsors/lowlighter) -->

# 🦕 Denolithic

Denolithic is a powerful markdown powered presentation tool which can transform any markdown file into slides.
Along with a nice design and controls, you'll be able to run and edit code snippets live and use extended markup features.

<!-- [d-comment -->
![](https://user-images.githubusercontent.com/22963968/119055511-75bfc800-b9c9-11eb-8adf-5ee3a774b2cb.gif)

This `README.md` is intended to be viewed as a [denolithic presentation slides](https://denolithic.vercel.app), please check it out!
<!-- d-comment] -->

<!-- [d-uncomment

::: info

**🧪 Test it on your own markdown file!**

Enter an URL to any markdown file to preview it live with denolithic:

<form class="d-flex" onsubmit="setTimeout(() => window.location.replace(`${location.pathname}?target=${encodeURIComponent(document.querySelector('#denolithic-it').value)}`, 500))">
  <input id="denolithic-it" class="form-control flex-1 mr-2" type="url" placeholder="https://raw.githubusercontent.com/lowlighter/denolithic/main/README.md">
  <button type="submit" class="btn btn-primary">Denolithic it!</button>
</form>

:::

d-uncomment] -->

## ✨ Features
- Markdown powered slides, including extended markup features and raw html support
- Interactive, editable and syntax-colored code blocks
  - Code snippets can even be ran live! (provided it is supported)
- Smooth design powered by GitHub's primer style
- Intuitive controls and navigation elements, including linkable slides
- Metadata support to customize links, include others slides, etc.

**🌧️ Deploy your own instance with Vercel**

Use [Vercel](https://vercel.com) to deploy your own instance:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Flowlighter%2Fdenolithic&env=DENO_UNSTABLE&envDescription=Set%20to%20true%20to%20enable%20unstable%20features%20of%20deno%20runtime%20(required%20for%20code%20execution)&project-name=denolithic&repository-name=denolithic&demo-title=Denolithic&demo-description=Create%20presentation%20slides%20from%20markdown&demo-url=https%3A%2F%2Fdenolithic.vercel.app&demo-image=https%3A%2F%2Fdenolithic.vercel.app%2Fstatic%2Fopengraph.png)

<!-- [d-include] /_denolithic_features.md -->

## 🧙 Contributing

* Report bugs by filling an [issue](https://github.com/lowlighter/denolithic/issues)
* Suggest new features or request help through [discussions](https://github.com/lowlighter/denolithic/discussions)
* To contribute, [fork this repository](https://github.com/lowlighter/denolithic/network/members) and submit a [pull request](https://github.com/lowlighter/denolithic/pulls)

**Developping locally**

Setup [vercel cli](https://vercel.com/cli) and launch it in project's root:
```
npm i -g vercel
vercel dev
```

## 👨‍⚖️ License

> MIT License<br>
> Copyright (c) 2021-present [@lowlighter](https://github.com/lowlighter)

**🥇 Credits**

[lowlighter/denolithic](https://github.com/lowlighter/denolithic) is powered by:
* [vercel](https://vercel.com)
* [vercel-deno](https://github.com/TooTallNate/vercel-deno)
* [primer css](https://github.com/primer/css)
* [markdown-it and plugins](https://github.com/markdown-it/markdown-it)
