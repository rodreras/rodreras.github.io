---
layout: default
title: Home
---

<section class="hero" id="hero">
  <canvas id="sat-canvas" aria-hidden="true"></canvas>
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <p class="hero-mono">Geodata Scientist</p>
    <h1 class="hero-title">Rodrigo Brust</h1>
    <p class="hero-sub">Remote Sensing · Geospatial analysis · Machine Learning & Deep Learning ·</p>
    <div class="hero-links">
      <a href="https://github.com/{{ site.author.github }}" target="_blank" rel="noopener">GitHub</a>
      <a href="https://www.linkedin.com/in/{{ site.author.linkedin }}/" target="_blank" rel="noopener">LinkedIn</a>
      <a href="mailto:{{ site.author.email }}">Email</a>
    </div>
        <div class="hero-nav">
          <a href="#about">About</a>
          <span>·</span>
          <a href="#projects">Projects</a>
          <span>·</span>
          <a href="#publications">Publications</a>
          <span>·</span>
          <a href="#courses">Courses</a>
          <span>·</span>
          <a href="/assets/cv/rodrigo-brust-cv.pdf" target="_blank">CV</a>
    </div>
  </div>
  <div class="hero-hint" aria-hidden="true">move cursor to reveal satellite view</div>
</section>

<section id="about" class="section">
  <div class="container">
    <h2 class="section-label">About</h2>
    <div class="about-grid">
      <div class="about-text">
        <p>Data scientist and engineer focused on Geospatial Applications with international experience. I build geospatial pipelines, analyze satellite imagery, use machine learning and deep learning to develop tools for environmental monitoring, insurance sustainable land use, mining, and infrastructure monitoring.</p>
        <p>Currently working as a <strong>Geospatial Data Scientist at Enline</strong> (Portugal), holding a master's degree in Geospatial Data Science and Remote Sensing. Previously at <strong>OreFox AI</strong> (Australia), where I built the remote sensing pipelines from scratch for mineral exploration.</p>
        <p>I care about writing clean, reproducible code — and about making geospatial data accessible for real-world decisions.</p>
      </div>
      <div class="about-stack">
        <h3>Tools &amp; Stack</h3>
        <ul>
          <li>Python · NumPy · GeoPandas · Rasterio</li>
          <li>Google Earth Engine · GDAL · QGIS · PDAL</li>
          <li>PostgreSQL · PostGIS · DuckDB</li>
          <li>Git · Docker · Airflow · Streamlit</li>
          <li>Machine Learning · Deep Learning</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<section id="projects" class="section section-dark">
  <div class="container">
    <h2 class="section-label">Projects</h2>
    <div class="projects-grid">
      {% assign sorted_projects = site.projects | sort: 'order' %}
      {% for project in sorted_projects %}
      <a class="project-card" href="{{ project.url | relative_url }}">
        <span class="project-tag">{{ project.tag }}</span>
        <h3 class="project-title">{{ project.title }}</h3>
        <p class="project-desc">{{ project.description }}</p>
        <div class="project-stack">
          {% for item in project.stack %}
          <span class="stack-pill">{{ item }}</span>
          {% endfor %}
        </div>
        <span class="project-arrow">→</span>
      </a>
      {% endfor %}
    </div>
  </div>
</section>

<section id="publications" class="section">
  <div class="container">
    <h2 class="section-label">Publications</h2>

    <div class="pub-item">
      <span class="pub-year">2023</span>
      <div class="pub-body">
        <p class="pub-type">Journal Article</p>
        <h2 class="pub-title">Hazard Mapping in Urban Environmental Protected Areas: Tijuca National Park</h2>
        <p class="pub-meta">Rodrigo B Santos, Francisco Dourado, Leonard Schumm</p>
        <p class="pub-venue">urbe. Revista Brasileira de Gestão Urbana, vol. 15, e2020210</p>
        <div class="pub-links">
          <a href="https://www.scielo.br/j/urbe/a/ms3pMcqgFKjXXWw5T4MrqnK/?lang=en" target="_blank" rel="noopener">PDF →</a>
          <a href="https://scholar.google.com/citations?view_op=view_citation&hl=en&user=AyuOanwAAAAJ&citation_for_view=AyuOanwAAAAJ:9yKSN-GCB0IC" target="_blank" rel="noopener">Scholar →</a>
        </div>
      </div>
    </div>

    <div class="pub-item">
      <span class="pub-year">2024</span>
      <div class="pub-body">
        <p class="pub-type">Master's Thesis</p>
        <h2 class="pub-title">Evaluation of Image Pattern Feature Extraction From Digital Elevation Model for Hydrogen Seeps Detection</h2>
        <p class="pub-meta">Rodrigo Brust Santos</p>
        <p class="pub-venue">Paris-Lodron University Salzburg (PLUS) & University of South Brittany (UBS) — Data Science Specialization, June 2024</p>
        <p class="pub-venue" style="font-size:.78rem;margin-top:.25rem;">Supervisors: Dr. Zahra Dabiri (PLUS) · Prof. Dr. Sébastien Lefrèvre (UBS)</p>
        <div class="pub-links">
          <a href="/assets/cv/MasterThesis.pdf" target="_blank">PDF →</a>
        </div>
      </div>
    </div>

    <div class="pub-item">
      <span class="pub-year">2025</span>
      <div class="pub-body">
        <p class="pub-type">Conference Paper</p>
        <h2 class="pub-title">Data Processing with Computer Vision and Geological Implicit Modelling Application in Viability Study of Eolic Power Plants, a Case Study in Rio Grande do Norte</h2>
        <p class="pub-meta">R. C. Hammerle, R. Brust Santos, J. Yasbek, F. Moura</p>
        <p class="pub-venue">18° Congresso Brasileiro de Geologia de Engenharia e Ambiental, 7 pp.</p>
        <div class="pub-links">
          <a href="https://scholar.google.com/citations?view_op=view_citation&hl=en&user=AyuOanwAAAAJ&citation_for_view=AyuOanwAAAAJ:IjCSPb-OGe4C" target="_blank" rel="noopener">Scholar →</a>
        </div>
      </div>
    </div>

  </div>
</section>

<section id="courses" class="section section-dark">
  <div class="container">
    <h2 class="section-label">Free Courses</h2>
    <div class="projects-grid">

      <a class="project-card" href="https://github.com/rodreras/geopy_minicurso" target="_blank" rel="noopener">
        <span class="project-tag">Free · Python</span>
        <h3 class="project-title">Python applied to Geology Analysis</h3>
        <p class="project-desc">Introduction to Python programming aiming Geological Analysis. Learn how to open files, do structural plotting and create remote sensing compositions.</p>
        <div class="project-stack">
          <span class="stack-pill">Python</span>
          <span class="stack-pill">GeoPandas</span>
          <span class="stack-pill">Rasterio</span>
        </div>
        <span class="project-arrow">→</span>
      </a>

      <a class="project-card" href="https://github.com/rodreras/qgis_geologico" target="_blank" rel="noopener">
        <span class="project-tag">Free · QGIS</span>
        <h3 class="project-title">QGIS for Geological Mapping</h3>
        <p class="project-desc">Learn how to create maps in QGISbased on the information you collected from the field. </p>
        <div class="project-stack">
          <span class="stack-pill">QGIS</span>
          <span class="stack-pill">GIS</span>
        </div>
        <span class="project-arrow">→</span>
      </a>

    </div>
  </div>
</section>



<script src="{{ '/assets/js/satellite-hero.js' | relative_url }}"></script>
