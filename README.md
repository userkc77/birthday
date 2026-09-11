# 🎂 Birthday Website for My Sister

A magical, animated, single-page birthday surprise built with plain HTML, CSS
and JavaScript — no frameworks, no build step, no backend. Just open
`index.html` (or host it on GitHub Pages) and it works.

## What's inside

```
birthday-sister/
├── index.html          the whole page structure
├── style.css            all styling, theme colors, and animations
├── script.js             all interactivity (edit your settings here)
├── assets/
│   ├── images/           put sister1.jpg … sister6.jpg here
│   └── music/             put birthday.mp3 here (optional)
└── README.md
```

## 1. Change her name and the birthday date (the only required edit)

Open `script.js`. At the very top you'll find a clearly marked settings block:

```js
const SISTER_NAME = "Your Sister's Name";
const BIRTHDAY = "2026-09-25T00:00:00";
```

- **`SISTER_NAME`** — replace with her real name, e.g. `"Anisha"`. It updates
  automatically everywhere on the site: the opening screen, the hero title,
  the personal message, the secret surprise, and the final message.
- **`BIRTHDAY`** — replace with her birthday in `YYYY-MM-DDTHH:MM:SS` format,
  e.g. `"2026-09-25T00:00:00"`. The countdown (days / hours / minutes /
  seconds) is calculated from this automatically. If the date has already
  passed, the site automatically counts down to *next year's* birthday, so
  you can reuse it year after year without touching this file again.

You do not need to edit any other JavaScript — every other part of the site
reads from these two variables.

## 2. Replace the personal message

Open `index.html` and find the section with `id="message"`. Inside the
`<p id="message-text" ...>` tag is the placeholder letter. Replace the text
between the tags with your own words — keep the blank lines between
paragraphs if you want the same spacing. The `<span data-sister-name></span>`
tags inside it will keep showing her name automatically; leave them as-is (or
remove them if you'd rather type her name manually in that spot).

## 3. Add her real photos

Drop six photos into `assets/images/` and name them exactly:

```
sister1.jpg
sister2.jpg
sister3.jpg
sister4.jpg
sister5.jpg
sister6.jpg
```

(You can use `.png` or `.webp` too — just update the `src="..."` path for
that photo in the `id="memories"` section of `index.html` to match.) If a
photo file is missing, that card will simply show a soft placeholder instead
of breaking the layout, so you can add photos gradually.

To change a caption (e.g. "Beautiful Memories ❤️"), edit the text inside the
matching `<span class="photo-caption">` and the `data-caption="..."`
attribute on that same `<button class="photo-card">`.

## 4. Add background music (optional)

Drop an MP3 file into `assets/music/` and name it exactly `birthday.mp3`.
Music never autoplays on page load (browsers block that anyway) — it starts
only after she taps "Open Your Surprise" or the floating 🎵 button, per
browser autoplay rules. If no music file is present, the site works exactly
the same, just silently.

## 5. Upload the project to GitHub

1. Create a new repository on GitHub (e.g. `birthday-sister`).
2. On your computer, inside the `birthday-sister` folder, run:
   ```bash
   git init
   git add .
   git commit -m "Birthday website"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/birthday-sister.git
   git push -u origin main
   ```
   (Or use GitHub's "Add file → Upload files" button in the browser instead
   of the command line — either works.)

## 6. Enable GitHub Pages

1. In your repository on GitHub, go to **Settings → Pages**.
2. Under "Build and deployment", set **Source** to **Deploy from a branch**.
3. Set **Branch** to `main` and folder to `/ (root)`, then **Save**.
4. After a minute or two, your site will be live at:
   ```
   https://YOUR-USERNAME.github.io/birthday-sister/
   ```

That's it — send her the link! 💌
