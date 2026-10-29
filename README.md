# Keshav Aditya Preethlal: CV and portfolio

My personal CV and portfolio site: who I am, a case study of my largest project (Isiqalo Med), the websites I have built, and an on-page CV that prints cleanly.

Live: https://theyyluvpreeths.github.io/keshav-cv-website/

Plain HTML, CSS and vanilla JavaScript (ES modules). No framework, no build step and no dependencies, so it hosts free on GitHub Pages.

## Structure

```
index.html          Home: hero, about, skills, featured work, contact
isiqalo-med.html    Case study of Isiqalo Med, with a screenshot lightbox
projects.html       Every project, rendered from data/projects.json
cv.html             On-page CV with a print stylesheet and PDF download
css/styles.css      All styles: light/dark tokens, layout, print rules
js/main.js          Theme toggle, mobile menu, entrances, lightbox, project cards
data/projects.json  The project list (edit this to add a project)
assets/             Photo, screenshots (WebP), CV PDF
favicon.svg, sitemap.xml, robots.txt, .nojekyll
```

The header and footer are the same markup on every page. If you change one, change all four pages.

## Run locally

The project cards are loaded with `fetch`, which browsers block on `file://`, so use a local server:

```bash
python -m http.server 8000
# then open http://localhost:8000
```

## Add a project

Add an object to `data/projects.json`:

```json
{
  "name": "Project name",
  "type": "Business website",
  "year": "2026",
  "featured": false,
  "summary": "One or two sentences on what it is and who it is for.",
  "tech": ["HTML", "CSS"],
  "image": "assets/my-project.webp",
  "imageAlt": "What the screenshot shows",
  "repo": "https://github.com/theyyluvpreeths/my-project",
  "live": null
}
```

`"featured": true` also shows it on the home page. `"flagship": true` gives the wide card. `caseStudy` links to a page in this site.

## Optimise images

Images are converted to WebP with ffmpeg (no npm tooling needed):

```bash
ffmpeg -i screenshot.png -vf "scale=1600:-2" -quality 78 assets/my-project.webp
```

## Deploy

GitHub Pages serves the `main` branch root. Every push to `main` redeploys within a minute or two:

```bash
git add -A
git commit -m "Describe the change"
git push
```

All paths are relative, so the site works under the `/keshav-cv-website/` sub-path.

Note: crawlers only read `robots.txt` at a domain root, so this one is informational until the site moves to its own domain. Submit `sitemap.xml` in Google Search Console instead.

## Still to fill in

Search the code for `TODO`:

- LinkedIn URL (`linkedin.com/in/TODO`, every page)
- Start date at Isiqalo Industries (`cv.html`)
- Rejuv Aesthetics and Isiqalo Med live URLs (`data/projects.json`)
- Your own wording for the Isiqalo Med role and lessons (`isiqalo-med.html`)

© 2026 Isiqalo Industries, Keshav Aditya Preethlal.
