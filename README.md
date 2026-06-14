# rodrigobrust.com — portfolio

Jekyll portfolio for [Rodrigo Brust](https://rodrigobrust.com), geodata scientist.

## Structure

```
.
├── _layouts/
│   ├── default.html       # base HTML shell + footer
│   └── project.html       # individual project page
├── _projects/             # one .md file per project
│   ├── agricheck.md
│   ├── ceiia.md
│   ├── orefox.md
│   └── thesis.md
├── assets/
│   ├── css/main.css       # all styles
│   └── js/satellite-hero.js  # procedural terrain canvas
├── _config.yml
├── index.md               # homepage
├── CNAME                  # rodrigobrust.com
└── DEPLOYMENT.md          # full deploy walkthrough
```

## Adding a project

Drop a `.md` file in `_projects/` with this front matter:

```yaml
---
title: Project Name
description: Short summary for the index card.
tag: Category · Subcategory
stack: [Python, Tool1, Tool2]
year: 2025
role: Your role
order: 5          # controls sort order on homepage
github: ...       # optional
demo: ...         # optional
---
```

Write the full project writeup in Markdown below.

## Local development

```bash
bundle install
bundle exec jekyll serve
```

## Deploy

See [DEPLOYMENT.md](DEPLOYMENT.md).
