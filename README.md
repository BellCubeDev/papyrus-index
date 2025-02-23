# The Papyrus Index

[![Components made with React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://react.dev/)
[![Built with Next.js](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Packages managed via pnpm](https://img.shields.io/badge/pnpm-%234a4a4a.svg?style=for-the-badge&logo=pnpm&logoColor=f69220)](https://pnpm.io/)
[![Commit Formatting dictated by gitmoji](https://img.shields.io/badge/gitmoji-%20😜%20😍-FFDD67.svg?style=for-the-badge)](https://gitmoji.dev)

The Papyrus Index is a project to provide indexing, useful searching, and documentation for all developer-oriented Papyrus functions, properties, and events&mdash;for all Papyrus-using games.

> [!TIP]
> If you're looking to track development, check out the [`development` branch](https://github.com/BellCubeDev/papyrus-index/tree/development). The default branch is `production`.

Site deployed at https://papyrus.bellcube.dev/ from the [`production` branch](https://github.com/BellCubeDev/papyrus-index/tree/production)

[![Deployed at https://papyrus.bellcube.dev](https://img.shields.io/badge/Deployed%20At-papyrus.bellcube.dev-blue?style=for-the-badge)](https://papyrus.bellcube.dev/)
[![Image depicting GitHub Workflow status](https://img.shields.io/github/actions/workflow/status/BellCubeDev/papyrus-index/build.yaml?branch=production&style=for-the-badge)](https://papyrus.bellcube.dev/)



## Why Does This Exist?
The Papyrus Index was born largely out of frustration (as many great projects are). Searching for a Papyrus extender that enabled the features you want to use in your script can be&hellip; annoying, to say the least. Aside from this project, there's not even a centralized list of Papyrus extenders, let alone a searchable one. Even finding the correct function to use in the vanilla Papyrus language can be a pain, honestly.

## How It Works
The Papyrus Index uses a custom-built JS parser for the Papyrus language to extract a ton of relevant information. We store the Papyrus scripts we want to index in [`data/`](./data/), and everything is separated out by game. After separating scripts by game, we further divide scripts by their "sources"&mdash;where the script came from. This might be the vanilla game, script extender, an xSE plugin, or even a regular mod that intentionally gives developers a way to interact with it. Multiple sources may contain versions of a script&mdash;most commonly seen with the vanilla game and the game's script extender.

The extracted information is initially stored in a JSON-compatible data structure. When it comes time to use the data, we typically uses an "indexed" version of the data, which replaces names of things (e.g. the name of a struct) with references to the original data (e.g. the actual struct object). This is significantly easier for a developer to work with, but, crucially, cannot be serialized (no saving to disk, no sending over the network) because of the circular data structure.

The website also fetches documentation from the following sources:
* The game's CK wiki (or a fallback if the game doesn't have its own CK wiki; e.g. Starfield uses FO4's CK wiki)
* TODO: The GitHub Wiki for the mod (if applicable)
* TODO: The GitHub Wiki for the Papyrus Index <!-- can be grabbed via `git clone https://github.com/BellCubeDev/papyrus-index.wiki.git` -->

We then use this data to generate the site. The website is a static site built with Next.js.
