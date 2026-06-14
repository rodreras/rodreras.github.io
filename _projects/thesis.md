---
title: Morphological Mathematics & Tree Structures
description: Master's thesis. Novel Estimated Slope attribute for pattern spectra on component trees. NumPy/SciPy, Higra-compatible implementation.
tag: Research · Computer Vision
stack: [Python, NumPy, SciPy, Higra]
year: 2024–present
role: Researcher / Author
order: 4
# github: https://github.com/rodreras/estimated-slope-tree
---

## Overview

Master's thesis in computer vision at the University of Porto. The research introduces a new attribute — **Estimated Slope** — for pattern spectra computed on component trees (max-trees, min-trees, alpha-trees).

## Background

Component trees are hierarchical image representations that capture connected components at every intensity threshold. Pattern spectra summarise the distribution of an attribute (e.g. area, compactness) across tree nodes, enabling multi-scale shape description without explicit segmentation.

Existing attributes (area, volume, extent) describe static geometric properties of each component. The Estimated Slope attribute instead captures the *rate of change* of a shape descriptor as the threshold varies — encoding how quickly components merge or split through the hierarchy.

## Contribution

- Formal definition of the Estimated Slope attribute within the component tree framework
- Proof of anti-extensivity and other algebraic properties relevant to pattern spectra
- Efficient NumPy/SciPy implementation compatible with the [Higra](https://higra.readthedocs.io/) C++/Python library
- Evaluation on texture discrimination and remote sensing segmentation benchmarks

## Status

Ongoing. Implementation complete, experiments in progress.
