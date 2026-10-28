"""Reproducible public documentation; no package or network execution."""
import os

project = "NovAsia Listing Normalizer"
author = "NovAsia Estate"
copyright = "2026, NovAsia Estate"
release = "1.0.0"
extensions = []
exclude_patterns = ["_build"]
html_theme = "sphinx_rtd_theme"
html_title = "NovAsia Listing Normalizer — property data import guide"
html_baseurl = os.environ.get("READTHEDOCS_CANONICAL_URL", "")
html_theme_options = {"navigation_depth": 2, "collapse_navigation": False}
html_context = {
    "display_github": True,
    "github_user": "novasia-estate",
    "github_repo": "listing-normalizer",
    "github_version": "main",
    "conf_py_path": "/docs/",
}
