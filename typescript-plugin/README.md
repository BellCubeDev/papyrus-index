# Papyrus Index TypeScript Plugin

> [!CAUTION]
> Due to limitations in TypeScript's plugin system, the plugin does not add type checking to standalone typechecking; it only provides diagnostics in the editor.

This TypeScript plugin enforces that all files matching the pattern `data/*/*/wiki.ts` (or another pattern provided by the config) must have a default export that extends the abstract class `GitHubWiki` (or another class provided by the config).

> [!NOTE]
> This plugin may morph over time as the Papyrus Index project evolves.

## Installation

To install the plugin into an existing TypeScript project using `pnpm` for package management, place this directory into your project.

Then, at the root of your project, install the plugin using `pnpm`

```bash
pnpm install --dev file:./path/to/this/directory
```

After installation, edit your `tsconfig.json` to include the plugin in the `compilerOptions.plugins` array. For example:

```json
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "papyrus-index-typescript-plugin",
        "filePattern": "data/*/*/wiki.ts",
        "baseClassName": "GitHubWiki"
      }
    ]
  }
}
```

Once finished, restart your TypeScript language server in your IDE (e.g., VS Code) to load the plugin. Enjoy!

## Configuration

The plugin is configured in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "papyrus-index-typescript-plugin",
        "filePattern": "data/*/*/wiki.ts",
        "baseClassName": "GitHubWiki"
      }
    ]
  }
}
```

## Examples

### ❌ Invalid (will show error)

```typescript
// data/SkyrimSE/po3/wiki.ts
export default class SkyrimPO3PapyrusExtenderWiki {
  constructor() {
    // This doesn't extend GitHubWiki
  }
}
```

### ✅ Valid

```typescript
// data/SkyrimSE/po3/wiki.ts
import { GitHubWiki } from '../../../src/wiki-data-extraction/individual-github-wikis/GitHubWiki';
import type { PapyrusGame } from '../../../src/papyrus/data-structures/pure/game';

export default class SkyrimPO3PapyrusExtenderWiki extends GitHubWiki<PapyrusGame> {
  // Correct implementation
}
```

## Development

If you have not already, you'll want to [add the plugin to your project](#installation).

To modify the plugin:

1. Edit `index.ts`
2. In the repo using the plugin, run `pnpm install`
3. Restart the TypeScript language server in VS Code
