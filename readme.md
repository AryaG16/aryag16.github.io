# Portfolio — Aryan Bhavsar

Static, multi-page site (HTML/CSS/JS), no build step. Everything you'd normally
hunt through the HTML for is driven by small JSON files, so you edit data in one
place. Host on GitHub Pages.

## Pages

- `index.html` — About (bio, research interests, education, experience, blog)
- `publications.html` — Publications
- `projects.html` — Projects
- Blog (header link) redirects to whatever URL you set in `config.json`

## Edit your content here (JSON files)

| File                | Controls                                                                                                                                               |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `config.json`       | **All links + identity** — Scholar, ORCID, CV, GitHub, LinkedIn, LeetCode, email(s), blog URL, your name/role/affiliation. Every page reads from this. |
| `education.json`    | Education entries on the About page                                                                                                                    |
| `experience.json`   | Experience entries on the About page                                                                                                                   |
| `blog.json`         | Featured blog posts on the About page. **Set to `[]` to hide the blog section.**                                                                       |
| `publications.json` | Publications list                                                                                                                                      |
| `projects.json`     | Projects (Selected work + Other)                                                                                                                       |

Change a link once in `config.json` and it updates in the header, hero, footer,
and every page automatically. Leave any link **empty (`""`)** and it disappears
everywhere (e.g. clear `orcid` if you don't have one yet).

### config.json

```json
{
  "name": "Aryan Bhavsar",
  "role": "PhD Scholar · IIT Indore",
  "affiliation": "Dept. of Computer Science & Engineering · IIT Indore",
  "links": {
    "scholar": "",
    "orcid": "",
    "cv": "Aryan_Bhavsar_CV.pdf",
    "github": "",
    "linkedin": "",
    "leetcode": "",
    "email": "",
    "emailSecondary": "",
    "blog": ""
  }
}
```

### education.json / experience.json

```json
[
  {
    "period": "2024 — Present",
    "title": "Ph.D., CSE",
    "org": "IIT Indore",
    "note": "CPI 8.88 / 10"
  }
]
```

`note` is optional. Entries display in the order listed (put newest first).

### blog.json

```json
[
  {
    "title": "Post title",
    "url": "https://…",
    "date": "2026",
    "excerpt": "Optional summary"
  }
]
```

Only `title` and `url` are required. Empty array `[]` → the whole blog section is hidden.

### publications.json

```json
[
  {
    "title": "Paper title",
    "authors": "N. Inam, A. Bhavsar, …",
    "venue": "Venue",
    "year": 2026,
    "type": "preprint",
    "links": {
      "pdf": "",
      "doi": "",
      "arxiv": "",
      "code": "",
      "slides": "",
      "video": "",
      "url": ""
    }
  }
]
```

Grouped and sorted newest-first automatically. A link button shows only if its URL is set.

### projects.json

```json
{
  "featured": [
    { "title": "Project", "description": "…", "status": "Research",
      "image": "images/foo.png", "tags": ["tag"], "links": { "paper": "", "repo": "", "demo": "" } }
  ],
  "other": [ … ]
}
```

The **Paper** button appears only when `links.paper` is set. `image` is optional
(omit for a placeholder tile).

## Things to fill in

- **ORCID** and **blog** URLs in `config.json` (currently placeholders).
- Keep the `images/` folder from your old repo (the hero uses `images/Photo.jpg`).
- `Aryan_Bhavsar_CV.pdf` is already included; keep it in the repo root.
- The two `[Example]` posts in `blog.json` — replace them or set `blog.json` to `[]`.

## Deploy to GitHub Pages

1. Put all files in your `aryag16.github.io` repo (keep the existing `images/`).
2. Commit and push to `main`.
3. Settings → Pages → Source: Deploy from a branch → `main` / root.
4. Live at `https://aryag16.github.io/`.

## Local preview

Open with a local server so the JSON files load (double-clicking the HTML won't fetch them):

```
python3 -m http.server
```

then visit `http://localhost:8000`.
