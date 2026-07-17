# Portfolio — Aryan Bhavsar

Static, multi-page site (HTML/CSS/JS), no build step. Content is driven by small
JSON files so you edit data in one place. Host on GitHub Pages.

## Pages

- `index.html` — About (bio, research interests, education, experience, blog)
- `publications.html` — Publications
- `projects.html` — Projects
- Blog (header link) redirects to the URL you set in `config.json`

## Where to edit things (JSON files)

| File                | Controls                                                      |
| ------------------- | ------------------------------------------------------------- |
| `config.json`       | **Everything identity + links.** See structure below.         |
| `education.json`    | Education entries (About)                                     |
| `experience.json`   | Experience entries (About)                                    |
| `blog.json`         | Featured blog posts (About). **`[]` hides the blog section.** |
| `publications.json` | Publications list                                             |
| `projects.json`     | Projects (Selected work + Other)                              |

### config.json (nested for clarity)

```json
{
  "name": "Aryan Bhavsar",
  "role": "PhD Scholar",
  "institute": "IIT Indore",
  "affiliation": "Dept. of Computer Science & Engineering · IIT Indore",
  "about": {
    "tagline": "Building <strong>networks for AI</strong> — …",
    "description": "I am a PhD scholar …",
    "tags": ["Networks for AI", "Data-Center Networking", "…"]
  },
  "links": {
    "scholar": "",
    "orcid": "",
    "cv": "Aryan_Bhavsar_CV.pdf",
    "github": "",
    "linkedin": "",
    "leetcode": "",
    "email": "aryan.bhavsar@hotmail.com",
    "emailSecondary": "phd2401201001@iiti.ac.in",
    "blog": ""
  }
}
```

- `about.tagline` and `about.description` accept inline HTML (e.g. `<strong>…</strong>`, links). `description` can also be an **array of strings** for multiple paragraphs.
- `about.tags` is the research-interest chip list on the About page.
- **`email` is your primary** (used by the "Email me" button); `emailSecondary` shows as "Also:". Leave `emailSecondary` empty to hide it.
- Any link left **empty (`""`)** disappears everywhere (header, hero, footer). Change a link once here and every page updates.

### projects.json

```json
{
  "featured": [
    {
      "title": "Project",
      "status": "Research",
      "image": "", // empty → no image, card is full width
      "tags": ["tag"],
      "description": ["Bullet one.", "Bullet two."], // array → bullets; string → paragraph
      "links": { "paper": "", "repo": "", "demo": "" } // a button shows only if its URL is set
    }
  ],
  "other": [
    {
      "title": "…",
      "description": "Short line.",
      "image": "images/foo.png",
      "tags": ["…"],
      "links": { "repo": "", "demo": "" }
    }
  ]
}
```

- **Featured** cards are full width with the image on the left (top on mobile). No image (`""`) → the image is omitted entirely.
- **Other** cards are a grid; if `image` is missing they show a placeholder tile.

### publications.json

```json
[
  {
    "title": "…",
    "authors": "N. Inam, A. Bhavsar, …",
    "venue": "…",
    "year": 2026,
    "type": "preprint",
    "links": { "pdf": "", "doi": "", "arxiv": "", "code": "" }
  }
]
```

Grouped newest-first automatically. A link button shows only when its URL is set.

### blog.json / education.json / experience.json

```json
// blog.json — only title + url required; date/excerpt optional; [] hides the section
[ { "title": "Post", "url": "https://…", "date": "2026", "excerpt": "…" } ]

// education.json / experience.json — note is optional
[ { "period": "2024 — Present", "title": "…", "org": "…", "note": "…" } ]
```

## Images (put these in `images/`, names are case-sensitive)

- `me.jpeg` — your photo (hero)
- `favicon.jpg` — browser tab icon
- `chatinc.png`, `finartz.png`, `gamehub.png` — project screenshots

## Still to fill in

- **ORCID** and **blog** URLs in `config.json` (currently placeholders).
- Replace the two `[Example]` posts in `blog.json`, or set it to `[]`.
- `Aryan_Bhavsar_CV.pdf` is included; keep it in the repo root.

## Deploy to GitHub Pages

1. Put all files in your `aryag16.github.io` repo, including the `images/` folder.
2. Commit and push to `main`.
3. Settings → Pages → Source: Deploy from a branch → `main` / root.
4. Live at `https://aryag16.github.io/`.

## Local preview

Serve locally so the JSON files load (double-clicking the HTML won't fetch them):

```
python3 -m http.server
```

then visit `http://localhost:8000`.
