---
title: Deforestation Monitoring Pipeline with Airflow and STAC
description: Monitoring deforestation in Brazil's indigenous protected land with Sentinel-1
tag: Data Engineering · Pipeline
stack: [Python, STAC, Airflow, Data Engineering, SAR]
year: 2026
role: Author
order: 4
# github: https://github.com/rodreras/estimated-slope-tree
---


## Introduction

Brazil is known for the vast scale of its natural landscape and territory. This immense size, however, presents a series of challenges when it comes to monitoring the land.

It is well known globally that, in recent years, there has been a significant rise in deforestation and fires across vegetated areas, particularly in the Amazon rainforest. This biome currently faces intense pressure from agricultural expansion in the Centro-Oeste region, as well as from other illegal activities within its borders, such as drug trafficking and illegal mining.

Indigenous Territories, protected by law, serve as a refuge against these activities. They act as a barrier to the spread of deforestation and are vital for preserving biodiversity—not only due to legal protections prohibiting such encroachment but also thanks to their inhabitants: the native peoples. They manage the land and forest symbiotically, creating the least possible impact while respecting Mother Earth, the source of all they have. Therefore, ensuring these protected areas remain intact means ensuring the preservation of diverse native cultures and societies.


## The Project
The best way to do this is through satellite monitoring, particularly using SAR. This is because SAR can cover vast areas and capture images under any weather conditions. Given these challenges and the open technologies available today, I developed a project aimed at monitoring protected Indigenous lands using SAR over a specific period. 

![Sentinel-1 VV bands difference between 2 months to identify changes in the dry and wet period.](/assets/images/sar_img_01.png)

The images are accessed via the STAC API from the Microsoft Planetary Computer. Initially, the user selects the protected area to analyze, as well as the dates, resolution, and spectral bands to be used. Once all variables are defined, a processing pipeline built in Airflow triggers scripts to retrieve the images from the repository. Since the volume of images is often large, we leverage Dask’s capabilities for parallelization and lazy loading, ensuring that data is loaded only when necessary.

So, the code handles all the geospatial processing. It collects the images, crops them to the area of ​​interest, and creates a data cube.

![Airflow pipeline successfully processed](/assets/images/sar_img_02.png)

From each image, an average is calculated for each index and band. These values ​​are then saved in a PostgreSQL database, where we can query the time series for the area of ​​interest, as well as the image metadata and location of all Brazilian indigenous lands.

The entire project was developed within a Docker container, using Python, a database for data ingestion, and all the necessary dependencies to run Airflow.

![Timeseries saved in a Postgresql table where we can verify against the land ID as well as metadata from imagery acquisition.](/assets/images/sar_img_03.png)


## Next Steps

Currently, the project lacks an intelligence layer to detect breaks in the time series of the four indices I have. Also, when the area of ​​interest is very large, the MCP access token may expire. These are two problems I intend to solve in the next version.

Regarding the intelligence layer, I plan to use time series decomposition with Fourier series capable of breaking the seasonality of the vegetation. The model needs to learn that seasonality is distinct according to each region of Brazil; therefore, a learning period of at least 24 months is necessary before it can perform detections.

Regarding the token timeout problem, I plan to optimize data acquisition and the data cube, filtering exactly what I need.

## Stack

- Docker
- Python
    - Geopandas
    - Dask
    - Pyarrow
    - STAC API
- Apache Airflow
- PostgreSQL

## Repository 

[You can visit the code in my repository](https://github.com/rodreras/protected_areas_etl)