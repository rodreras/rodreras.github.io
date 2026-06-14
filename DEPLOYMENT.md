# Deployment Guide

## Prerequisites

- A GitHub account (username: `rodreras`)
- The domain `rodrigobrust.com` registered somewhere (Namecheap, GoDaddy, Cloudflare, etc.)
- Git installed locally

---

## 1. Create the GitHub repository

Go to github.com and create a **new public repository** named exactly:

```
rodreras.github.io
```

The name must match `<username>.github.io` — this is what activates GitHub Pages for your user site.

---

## 2. Push the code

```bash
cd path/to/this/folder
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/rodreras/rodreras.github.io.git
git push -u origin main
```

---

## 3. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages** (left sidebar)
3. Under **Source**, select `Deploy from a branch`
4. Choose branch: `main`, folder: `/ (root)`
5. Click **Save**

GitHub will start building your site. The first build takes ~2 minutes.

---

## 4. Configure your custom domain DNS

Log into your domain registrar and add these DNS records:

### A records (apex domain `rodrigobrust.com`)

| Type | Name | Value          |
|------|------|----------------|
| A    | @    | 185.199.108.153 |
| A    | @    | 185.199.109.153 |
| A    | @    | 185.199.110.153 |
| A    | @    | 185.199.111.153 |

### CNAME record (www subdomain)

| Type  | Name | Value                  |
|-------|------|------------------------|
| CNAME | www  | rodreras.github.io     |

> DNS propagation can take anywhere from a few minutes to 48 hours depending on your registrar and TTL settings.

---

## 5. Add custom domain in GitHub Pages settings

1. Go back to **Settings → Pages**
2. Under **Custom domain**, type `rodrigobrust.com`
3. Click **Save**
4. GitHub will run a DNS check — wait for it to turn green
5. Once active, tick **Enforce HTTPS**

The `CNAME` file in the repo root is already set to `rodrigobrust.com`, so GitHub knows which domain to serve.

---

## 6. Running locally (optional)

To preview locally before pushing:

```bash
gem install bundler
bundle install
bundle exec jekyll serve
```

Then open `http://localhost:4000` in your browser.

> Requires Ruby ≥ 2.7. On macOS: `brew install ruby`. On Ubuntu: `sudo apt install ruby-full`.

---

## Adding a new project

1. Create a new file in `_projects/` — e.g. `_projects/my-new-project.md`
2. Add front matter:

```yaml
---
title: My New Project
description: One-sentence summary shown on the index card.
tag: Category · Subcategory
stack: [Python, GDAL, Rasterio]
year: 2025
role: Solo developer
order: 5
github: https://github.com/rodreras/my-new-project   # optional
demo: https://example.com                              # optional
---
```

3. Write the project body in Markdown below the front matter
4. Commit and push — GitHub Pages rebuilds automatically in ~1 minute

The card appears on the homepage automatically, sorted by `order`.
