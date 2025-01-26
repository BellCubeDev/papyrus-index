# Papyrus Index - Raw Data Folder

This folder contains raw PSC files (which are, in this case, API definition files) from various mods. It is my belief that these are acceptable to include in this repository, as they are not the actual code, but rather API definitions (similar to C++ header files). See the US Supreme Court case [Google LLC v. Oracle America, Inc.](https://en.wikipedia.org/wiki/Google_LLC_v._Oracle_America,_Inc.) for a high-profile Fair Use ruling on such grounds. I believe, based on this, that including these declarations in their typical textual representation is acceptable.

Where applicable, the original license for each source will be included in the respective subfolder.

## Respecting Authors' Wishes
For some mods where the author/team either likely would not allow distribution for this particular use case OR where they show a clear precedent of disapproving of distribution for similar use cases, they will be downloaded automatically through the Nexus Mods API and placed into a `download` folder (e.g. `data/scripts/SkyrimSE/racemenu/download/`). These folders are already included in the .gitignore file via wildcards.

To do so, an empty .download file must be added to the respective folder. The entire mod will be download and any BSA archives will be extracted.

For pure-Papyrus utilities which are included outright, it is best if they are Guard()ed, similar to the SkyUI SDK for Skyrim. This removes the actual source code while still allowing for the API to be documented.

## Inclusion Criteria
Generally, included mods must meet the following criteria:
* Runs on the latest xSE-supported version of the game they are designed for. They may support other versions, but should be compatible with the latest version.
    * Community support is fine, subject to the same criteria.
* If it is an xSE plugin, the DLL should have source code available ***or*** be well-trusted by the community.
    * If the xSE plugin is community supported, both the original version and the community-supported version should satisfy this condition.
* It should have some developer-facing Papyrus API.

Once a mod is included, it should not be excluded outside of exceptional circumstances (e.g. malware).

## Selecting Scripts
To reduce clutter, it is best if only scripts which contain developer-oriented functions are included. This means that scripts which are primarily used for internal logic or are not intended to be called by other scripts should be excluded. If unsure, err on the side of inclusion. Examples of scripts to not include:
* Player alias scripts
* MCM menu scripts
* Cloak scripts
* Thread-based worker scripts
* etc.
