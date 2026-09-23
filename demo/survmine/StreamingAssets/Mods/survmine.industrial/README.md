# SurvMine Industrial

Data-only industrial content mod scaffold for SurvMine.

## Purpose

- Keep industrial content separate from `survmine.core`.
- Author future machines, recipes, blocks, items, graphics, and audio through canonical mod folders.
- Use `StableId` references only in YAML content.

## Canonical roots

- `Content/Blocks/`
- `Content/Items/`
- `Content/Tags/Items/`
- `Content/RecipeTypes/`
- `Content/Recipes/`
- `Content/Machines/`
- `Graphics/blocks/`
- `Graphics/items/`
- `Graphics/misc/`
- `Audio/`

## Naming guidance

- Keep manifest id as `survmine.industrial`.
- Keep content stable IDs lowercase.
- Prefer industrial content IDs such as:
  - `survmine:macerator`
  - `survmine:compressor`
  - `survmine:industrial/copper_dust`
  - `survmine:industrial/plate_iron`
- Use `.example.yaml` for templates that should not load live yet.

## Authoring rules

- Do not use numeric IDs in YAML.
- Reference blocks, items, tags, recipe types, and recipes by `StableId`.
- Do not store `RuntimeId` in content.
- Do not move unfinished examples to live `.yaml` files until all references exist.

## Suggested next content

- Add industrial item tags under `Content/Tags/Items/`.
- Add industrial items under `Content/Items/`.
- Add industrial blocks under `Content/Blocks/`.
- Promote machine and recipe examples from `.example.yaml` to `.yaml` only after the referenced content exists.
