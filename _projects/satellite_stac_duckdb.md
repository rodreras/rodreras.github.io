---
title: Querying freely available disaster response images with STAC and DuckDB 
description: Using DuckDB, CLI to perform a quick ETL and spatial visualization
tag: Data Engineering · DuckDB · ETL  · Python  
stack: [Python, DuckDB, STAC, Geopandas]
year: 2026
role: Author
order: 4
# github: https://github.com/rodreras/estimated-slope-tree
---

# Querying Planet's Open Data for Disasters 

## 1. DuckDB Env setting

First, we install all the extensions: 

```bash
INSTALL h3 FROM community;
INSTALL lindel FROM community;
INSTALL json;
INSTALL parquet;
INSTALL spatial;
``` 

Then we create a `.duckdbrc`, which is a configuration file. It loads whenever we run a query. 

```bash 
touch .duckdbrc
nano .duckdbrc
``` 
Then paste 

``` 
bash
.timer on
.width 180
LOAD h3;
LOAD lindel;
LOAD json;
LOAD parquet;
LOAD spatial;
```

## 2. Verifying information on their bucket

We run `bash sql/planet_nepal/01_check_bucket.sh` to check what datasets are available.

As result, we got this output:

```json

{
  "type": "Catalog",
  "stac_version": "1.1.0",
  "id": "disasterdata",
  "title": "Disaster Data Releases from Planet Labs PBC",
  "description": "Planet Crisis Response Program imagery for major disaster events — earthquakes, floods, storms, wildfires and human-made disasters — as a single browsable STAC / Portolan catalog. Each event is a self-contained sub-catalog with pre- and post-event high-resolution COGs (visual, pansharpened-analytic and usable-data masks), organised by affected location. Imagery © Planet Labs PBC, licensed CC-BY-NC-4.0 (non-commercial).",
  "links": [
    {
      "rel": "root",
      "href": "./catalog.json",
      "type": "application/json",
      "title": "Disaster Data Releases from Planet Labs PBC"
    },
    {
      "rel": "child",
      "href": "./nepal-flash-flood-2026-08-26/catalog.json",
      "type": "application/json",
      "title": "Planet Crisis Response — Bhote Koshi–Trishuli Outburst Flood, Nepal (2026)"
    },
    {
      "rel": "child",
      "href": "./colombia-earthquake-2026-08-10/catalog.json",
      "type": "application/json",
      "title": "Planet Crisis Response — Colombia Earthquake (2026)"
    },
    {
      "rel": "child",
      "href": "./gironde-wildfire-2026/catalog.json",
      "type": "application/json",
      "title": "Planet Crisis Response — Gironde/Landes Wildfire, France (2026)"
    },
    {
      "rel": "child",
      "href": "./venezuela-earthquake-2026-06-24/catalog.json",
      "type": "application/json",
      "title": "Planet Crisis Response — Venezuela Earthquake (2026)"
    },
    {
      "rel": "child",
      "href": "./philippines-earthquake-2026-06-08/catalog.json",
      "type": "application/json",
      "title": "Planet Crisis Response — Philippines Earthquake (2026)"
    },
    {
      "rel": "child",
      "href": "./hurricane-melissa-2025/catalog.json",
      "type": "application/json",
      "title": "Planet Crisis Response — Hurricane Melissa, Jamaica (2025)"
    },
    {
      "rel": "license",
      "href": "https://creativecommons.org/licenses/by-nc/4.0/",
      "type": "text/html",
      "title": "CC-BY-NC-4.0"
    },
    {
      "rel": "about",
      "href": "https://source.coop/planet/disasterdata/",
      "type": "text/html",
      "title": "Dataset folder & README on Source Cooperative"
    },
    {
      "rel": "describedby",
      "href": "./llms.txt",
      "type": "text/markdown",
      "title": "llms.txt (agent guide)"
    },
    {
      "rel": "icon",
      "href": "./logo-mark.png",
      "type": "image/png",
      "title": "Planet logo"
    },
    {
      "rel": "agents",
      "href": "./AGENTS.md",
      "type": "text/markdown",
      "title": "AGENTS.md (agent guide)"
    },
    {
      "rel": "describedby",
      "href": "./README.md",
      "type": "text/markdown",
      "title": "README.md"
    }
  ],
  "stac_extensions": [
    "https://schemas.portolan-sdi.org/portolan/v0.1.0/schema.json"
  ]
}

```

Ok, what interests me is that repository with images from Nepal. Let's dig into it. 

## 3. Drilling into the Nepal flood catalog

On 26 August 2026 an outburst flood swept the Bhote Koshi–Trishuli river corridor across the Nepal–China border, and Planet's Crisis Response program released a dedicated STAC sub-catalog for it within hours. We fetch it with `sql/planet_nepal/02_check_nepal_bucket.sh`:

```bash
curl -s "${1:-https://data.source.coop/planet/disasterdata/nepal-flash-flood-2026-08-26/catalog.json}" \
    | jq . > "${2:-data/planet_nepal/response.json}"
```

```bash
bash sql/planet_nepal/02_check_nepal_bucket.sh
```

The catalog splits into exactly two children, which is the whole point of a crisis-response release: a before and an after.

```json
{
  "id": "nepal-flash-flood-2026-08-26",
  "title": "Planet Crisis Response — Bhote Koshi–Trishuli Outburst Flood, Nepal (2026)",
  "links": [
    { "rel": "child", "href": "./post-event/catalog.json", "title": "Post-event imagery" },
    { "rel": "child", "href": "./pre-event/catalog.json", "title": "Pre-event baseline imagery" }
  ]
}
```

Each of those sub-catalogs carries an `alternate` link to a **STAC-GeoParquet** index (`items.parquet`). The whole point of Pattern B/C from the study guide: don't crawl hundreds of sidecar JSON files one by one, just read the pre-built Parquet index straight off the bucket.

- Post-event: `.../post-event/items.parquet`, made of three collections: PlanetScope same-day coverage (26 Aug), and two SkySat/Pelican tasked collects over Syabrubesi and Rasuwagadhi (27 Aug).
- Pre-event: `.../pre-event/items.parquet`, a single PlanetScope baseline collection over the same corridor from 27 May.

## 4. Querying the STAC-GeoParquet index directly with DuckDB

`sql/planet_nepal/03_query_bucket.sql` is a one-liner that was originally pointed at the Venezuela earthquake release:

```sql
SELECT 
    *
FROM 
    read_parquet('https://data.source.coop/planet/disasterdata/venezuela-earthquake-2026-06-24/post-event/items.parquet')
```

Swap the URL for the Nepal event and it works exactly the same. That's the whole appeal of STAC-GeoParquet, every provider's catalog collapses to the same `read_parquet()` call. Unioning pre- and post-event side by side gives a clean acquisition timeline without downloading a single pixel:

```sql
SELECT phase, id, collection, datetime::DATE AS acquired, platform, "eo:cloud_cover" AS cloud_pct, gsd
FROM (
    SELECT 'pre'  AS phase, * FROM read_parquet('.../pre-event/items.parquet')
    UNION ALL BY NAME
    SELECT 'post' AS phase, * FROM read_parquet('.../post-event/items.parquet')
)
ORDER BY datetime
```

```bash
┌─────────┬────────────────────────────┬───────────────────────────────────┬────────────┬──────────┬───────────┬────────┐
│  phase  │             id             │            collection             │  acquired  │ platform │ cloud_pct │  gsd   │
│ varchar │          varchar           │              varchar              │    date    │ varchar  │   int64   │ double │
├─────────┼────────────────────────────┼───────────────────────────────────┼────────────┼──────────┼───────────┼────────┤
│ pre     │ 20260527_053217_72_254a    │ pre-event-planetscope-2026-05-27  │ 2026-05-27 │ 254a     │        41 │    3.7 │
│ pre     │ 20260527_053219_95_254a    │ pre-event-planetscope-2026-05-27  │ 2026-05-27 │ 254a     │        43 │    3.7 │
│ pre     │ 20260527_053221_96_254a    │ pre-event-planetscope-2026-05-27  │ 2026-05-27 │ 254a     │        52 │    3.7 │
│ pre     │ 20260527_053224_18_254a    │ pre-event-planetscope-2026-05-27  │ 2026-05-27 │ 254a     │        48 │    3.7 │
│ pre     │ 20260527_053226_41_254a    │ pre-event-planetscope-2026-05-27  │ 2026-05-27 │ 254a     │         5 │    3.7 │
│ post    │ 20260826_050125_99_255f    │ post-event-planetscope-2026-08-26 │ 2026-08-26 │ 255f     │        79 │    3.8 │
│ post    │ 20260826_050128_33_255f    │ post-event-planetscope-2026-08-26 │ 2026-08-26 │ 255f     │        78 │    3.8 │
│ post    │ 20260826_050130_66_255f    │ post-event-planetscope-2026-08-26 │ 2026-08-26 │ 255f     │        93 │    3.8 │
│ post    │ 20260826_050133_00_255f    │ post-event-planetscope-2026-08-26 │ 2026-08-26 │ 255f     │        92 │    3.8 │
│ post    │ 20260826_050135_34_255f    │ post-event-planetscope-2026-08-26 │ 2026-08-26 │ 255f     │        62 │    3.8 │
│ post    │ 20260826_054456_67_251f    │ post-event-planetscope-2026-08-26 │ 2026-08-26 │ 251f     │        72 │    3.4 │
│ post    │ 20260826_054458_74_251f    │ post-event-planetscope-2026-08-26 │ 2026-08-26 │ 251f     │        88 │    3.4 │
│ post    │ 20260826_054500_80_251f    │ post-event-planetscope-2026-08-26 │ 2026-08-26 │ 251f     │        92 │    3.4 │
│ post    │ 20260826_054502_86_251f    │ post-event-planetscope-2026-08-26 │ 2026-08-26 │ 251f     │        78 │    3.4 │
│ post    │ 20260827_020055_ssc1_u0001 │ post-event-skysat-2026-08-27      │ 2026-08-27 │ SSC1     │        50 │   0.81 │
│ post    │ 20260827_020055_ssc1_u0002 │ post-event-skysat-2026-08-27      │ 2026-08-27 │ SSC1     │        50 │   0.79 │
│ post    │ 20260827_060956_98_3009    │ post-event-pelican-2026-08-27     │ 2026-08-27 │ 3009     │        85 │   0.55 │
│ post    │ 20260827_060958_31_3009    │ post-event-pelican-2026-08-27     │ 2026-08-27 │ 3009     │        83 │   0.55 │
│ post    │ 20260827_060959_65_3009    │ post-event-pelican-2026-08-27     │ 2026-08-27 │ 3009     │        85 │   0.55 │
└─────────┴────────────────────────────┴───────────────────────────────────┴────────────┴──────────┴───────────┴────────┘
  19 rows                                                                                                     7 columns
```

Two things jump out. First, cloud cover on the PlanetScope pass over the actual flood day (26 Aug) is brutal, between 60-90%. Second, the tasked SkySat/Pelican collects that came in a day later have sub-metre `gsd` (0.55-0.81 m against 3.4-3.8 m for PlanetScope).

## 5. Turning the catalog into a GeoParquet + map with Python

`sql/planet_nepal/get_planet_stac_data.py` is the reusable pipeline behind all of this. It doesn't hardcode Nepal, Venezuela or any single provider, it takes any STAC **Catalog or Collection** URL and:

1. loads it with `pystac` (`load_catalog`),
2. walks every item recursively (`collect_items`),
3. tags each geometry `pre` / `post` from its STAC lineage, falling back to the event date parsed out of the catalog title/description when lineage alone isn't enough (`classify_phase`),
4. writes the result to GeoParquet (`save_parquet`),
5. and renders a UNOSAT-style satellite map; geometries colored by phase or by exact acquisition date, plus a small world-locator inset over Esri World Imagery (`plot_event_map`).

```python
def run(url: str, parquet_path: Path, map_path: Path) -> gpd.GeoDataFrame:
    """End-to-end: load a catalog, classify, export, and plot."""
    catalog = load_catalog(url)
    event = extract_event_info(catalog)
    gdf = items_to_gdf(collect_items(catalog))
    gdf = classify_phase(gdf, event)

    save_parquet(gdf, parquet_path)
    plot_event_map(gdf, event, map_path)
    return gdf
```

Pointing it at Planet's Nepal catalog root gives 19 footprints (5 pre-event, 14 post-event) and this map:

![alt text](/assets/images/satellite_duckdb_02.png)

The cyan footprints are the 27 May PlanetScope baseline, the purple ones are the 26 Aug same-day PlanetScope pass, and the tight magenta cluster is the 27 Aug SkySat/Pelican tasking; visibly much smaller and much more tightly targeted on the actual river corridor, which lines up with the sub-metre `gsd` we saw in the query above.

## 6. Cross-checking against a second, independent provider

Planet isn't the only open feed with eyes on this event. Vantor (Maxar's open disaster-imagery bucket, `vantor-opendata`) publishes its own STAC `Collection` for the same flood at `events/Nepal-Flooding-Aug-2026/collection.json` — no pre-computed GeoParquet index, no pre/post sub-catalogs, just a flat collection of tasked scenes. Since `get_planet_stac_data.py` only cares that a URL resolves to *some* STAC container, the exact same script runs against it unchanged:

```bash
python sql/planet_nepal/get_planet_stac_data.py  # URL swapped to the Vantor collection
```

![alt text](/assets/images/satellite_duckdb_02.png)

This is a good example of why "classify by lineage, fall back to date" isn't a nicety but a necessity: Vantor's collection has no `pre-event`/`post-event` sub-folders to inherit a phase from, and its description spells the date out as "August 26, 2026" instead of the `26 Aug 2026` / ISO forms the date-parser recognizes, so every footprint falls through to `unknown` phase, and  the plotting code automatically drops into its date-colored fallback instead. It also surfaces something Planet's curated release doesn't show: Vantor's archive reaches back to **16 October 2021**, and that oldest footprint is a wide swath sitting mostly *west* of the flood corridor, leftover coverage from an unrelated earlier tasking, not disaster response. It's a reminder that a raw provider bucket is an archive, not a curated crisis package, and a real pipeline has to filter for relevance itself rather than trust that everything returned is on-topic.

## Sources & Inspiration

This was shaped by working through [Mark Litwintschik's](https://tech.marksblogg.com/asos-weather-observations.html) approach to treating big open datasets as "just a table," applied here to STAC/GeoParquet.