# Artsy Browser

A small Vue 3 app that browses artworks from Artsy's public Metaphysics
GraphQL API. Built as a JavaScript assessment for codecapi.

## Stack

- Vite + Vue 3 (`<script setup>`) + TypeScript
- Vue Router 4
- `graphql-request` + GraphQL Code Generator (typed queries)
- Tailwind CSS 4
- Vitest + `@vue/test-utils`

## Routes

- `/` — browse + search (debounced, query persisted in the URL)
- `/artwork/:slug` — detail page with carousel navigation between neighbours

## Getting started

```bash
pnpm install
pnpm dev
```

The `postinstall` hook runs GraphQL Code Generator; the `preinstall` hook
enforces pnpm.

## Scripts

| Script           | What it does                                   |
|------------------|------------------------------------------------|
| `pnpm dev`       | Vite dev server                                |
| `pnpm build`     | Codegen + vue-tsc + production build           |
| `pnpm preview`   | Preview the production build                   |
| `pnpm codegen`   | Regenerate `src/generated/graphql.ts`          |
| `pnpm test`      | Vitest watch mode                              |
| `pnpm test:run`  | Vitest single run                              |

## Structure

```
src/
  App.vue
  main.ts
  router/index.ts
  views/
    BrowseView.vue
    ArtworkView.vue
  components/
    SearchBar.vue
    HoverPreview.vue
    StateMessage.vue
  composables/
    useArtworks.ts
    useArtwork.ts
  lib/
    graphql.ts
    debounce.ts
  graphql/
    artworks.graphql
    searchArtworks.graphql
    artwork.graphql
  generated/graphql.ts   (gitignored)
  assets/main.css
```

## API

- Endpoint: `https://metaphysics-production.artsy.net/v2` (public, no auth)
- Queries: `artworksConnection`, `searchConnection(entities: [ARTWORK])`,
  `artwork(id: slug)`
