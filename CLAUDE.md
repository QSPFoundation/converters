# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- Package manager is pnpm (version pinned in `packageManager`). Pass flags straight after the script name — `pnpm test --ci`, not `pnpm test -- --ci` (pnpm forwards a literal `--`).
- Typecheck: `pnpm exec tsc` (tsconfig has `noEmit`; there is no script for it)
- Single test: `pnpm exec jest src/readers/qsp.test.ts` or `pnpm exec jest -t "<test name>"` (coverage is always on via `jest.config.ts`)
- Format: run `pnpm exec prettier --write <files>` on every file you edit (no script; not enforced in CI)
- CI runs `pnpm lint`, `pnpm test`, `pnpm build` on Node 22/24. Published output still declares `engines.node >=14`, so don't use newer runtime APIs in `src/`

## Architecture

- Library only; no file I/O. Readers take `ArrayBuffer` (binary `.qsp`) or an already UTF-8-decoded string (`.qsps`); writers return the same. All formats round-trip through `QspLocation[]` from `src/contracts.ts`.
- One `readers/<fmt>.ts` + `writers/<fmt>.ts` per format, re-exported via `export *` in `src/index.ts`. Tests live next to sources as `*.test.ts` using inline byte arrays/strings.
- All binary encoding goes through `QspByteStream` (`src/qsp-byte-stream.ts`): chars are shifted by `QSP_CODREMOV = 5` except header/version lines; lines separated by `\r\n`; UTF-16LE detected by byte 1 being 0, otherwise CP1251.
- `readQsp` handles both the new (`QSPGAME` header) and old (location count + 27 reserved lines + fixed 20 actions) formats; `writeQsp` always writes the new format in UTF-16LE. Format spec: https://github.com/QSPFoundation/qsp/blob/master/help/gam_desc.txt

## Gotchas

- Package is ESM (`"type": "module"`), so CommonJS config files must use `.cjs`.
- Build is tsdown (`tsdown.config.ts`, ESM + CJS). It rewrites `exports`/`main`/`module`/`types` in `package.json` on every build — change outputs in the config, not by hand. Syntax is downleveled to `engines.node`. tsdown is 0.x, pinned with `~`.
- New dependencies with install scripts fail `pnpm install` until allowed or denied in `allowBuilds` (`pnpm-workspace.yaml`); `@parcel/watcher` and `unrs-resolver` are denied because their scripts are only fallbacks for missing prebuilt binaries.
- TypeScript is held at 6.x: ts-jest and typescript-eslint don't support TS 7 yet.
- The husky pre-commit config in `package.json` is husky v4 style while husky 9 is installed — it does not run.

## Workflow

- Commit directly to `main`.
- Release: `pnpm version <major|minor|patch> && git push --follow-tags`. The `version` script regenerates `src/version.ts` (written into `.qsp` output by `writeQsp`) — never edit it by hand; `src/version.test.ts` fails if it drifts from package.json.
- Pushing a `v*` tag triggers `.github/workflows/publish.yml`: lint, test, build, then `npm stage publish` (npm, because pnpm has no staged publishing) via npm trusted publishing (OIDC, no token). The trusted publisher is stage-only — plain `npm publish` is rejected with E403. The version goes live only after a maintainer approves it with 2FA on npmjs.com; create the GitHub release (`gh release create vX.Y.Z --generate-notes`) after approval. Never publish locally.
