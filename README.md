# Sushant Studios ✦

> **Anti-gravity cinematic LUT lab + AI video studio.**
> A 3D website that also works like an **Android app** — phone, tablet and laptop, offline-ready.

Inspired by [guvueluts.com](https://guvueluts.com) — but with 3D anti-gravity motion,
a draggable **RAW ↔ GRADED** comparison slider, and AI engines
(**Google Flow · Gemini · Veo · Seedance 2.5**) built in.

---

## 🚀 Run it (30 seconds)

```bash
python3 server.py
```

Then open **http://localhost:8080** in any browser.
(Any other port works too: `python3 server.py 3000`.)

You can also just double-click `index.html` — the site is 100% static.

---

## 📱 Install as an Android app

The site is a **PWA (Progressive Web App)** — it installs like a real app:

1. Open the site on your phone in **Chrome** (it must be on a real HTTPS website —
   see *Deploy for free* below, or the local network for testing).
2. Tap the **⋮ menu → “Install app”** (or the “Add to Home screen” dialog).
3. Done — a **Sushant** icon with the S-orbit logo appears on your home screen.
   It opens full-screen, works **offline**, and never shows a browser bar.

On **laptop** (Chrome/Edge): click the **install icon** in the address bar.

> The “⤓ Install app” button appears automatically in the nav bar when the
> browser detects the site is installable.

---

## 🗂 What's inside

```
index.html          ← the whole website (one page, 6 sections)
css/style.css       ← dark cinematic theme, 3D effects, responsive
js/main.js          ← anti-gravity particles, LUT slider, tilt, PWA install
js/sw.js            ← service worker (offline app mode)
manifest.json       ← Android app info (name, icon, colors)
server.py           ← Python server for the terminal
images/             ← all the cinematic images (replace these with your own!)
icons/              ← app icons (192, 512, maskable, favicon)
```

## 🎨 The sections

| # | Section | What it does |
|---|---------|--------------|
| 1 | **Hero** | 3D anti-gravity: floating light orbs that rise and *flee your cursor*, 3D title tilt |
| 2 | **LUT Lab** | Drag the glowing line — RAW footage vs GRADED. 6 looks: Amber, Pale Green, Harbour Blue, Island Cyan, Avenue Star, Mong Kok |
| 3 | **AI Engines** | Google Flow, Gemini, Veo, Seedance 2.5 |
| 4 | **Showreel** | Gallery of graded work |
| 5 | **Process** | 4 steps: shoot → grade → AI enhance → export |
| 6 | **Contact** | Email form (opens your email app) |

---

## ✏️ Make it yours (the 3 important edits)

### 1. Swap in YOUR images
Put your photos/videos in `images/` and keep the same filenames —
or edit the paths in `index.html` and the `LUTS` object in `js/main.js`.

The before/after trick: the **“RAW” side is the same image** with a flat color
filter applied. To change how “RAW” looks, edit the `.compare .raw` rule in
`css/style.css`.

### 2. Change the LUT colors
Each LUT is just a CSS filter — tweak it in `js/main.js`:

```js
amber: {
  name: 'Amber',
  scene: 'images/scene-amber.jpg',
  desc: '…',
  filter: 'saturate(1.18) contrast(1.07) sepia(0.2) hue-rotate(-8deg) brightness(1.03)',
},
```

`filter` can use: `saturate()` `contrast()` `brightness()` `sepia()`
`hue-rotate()` `blur()` `grayscale()` — mix as many as you like.

### 3. Your contact details
Search for `hello@sushant.studio` in `index.html` and `js/main.js`
(3 places each) and replace it with **your** email / WhatsApp.

---

## ☁️ Deploy for free (needed for the phone install)

PWA install needs a real **HTTPS** website. Free options:

**GitHub Pages** (easiest — you already have the repo):
1. Repo → **Settings → Pages**
2. Branch: `main`, folder: `/ (root)` → **Save**
3. Your site is live at `https://YOUR-USERNAME.github.io/sushant/`

**Netlify / Vercel / Cloudflare Pages**: drag-and-drop the folder — done in a minute.

Then open that URL on your phone in Chrome → **Install app** →  it's an app now.

---

## 🤖 Tech

- **HTML + CSS + JavaScript** — no frameworks, no build step, loads fast even on a budget phone
- **Python** — `server.py` for the terminal
- **Canvas** — custom anti-gravity particle physics (zero libraries)
- **PWA** — manifest + service worker = offline app on Android & desktop
- **Responsive** — 1 phone → 8K TV
- Respects `prefers-reduced-motion` (accessibility)

Built by Sushant — college student, class 11. 💛
