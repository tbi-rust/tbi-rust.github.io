# Getting the source

Clone the repository:

```bash
git clone https://github.com/reality-prod/tbi-rust.git
cd tbi-rust
```

## A quick sanity build

Before doing anything else, confirm the toolchain and dependencies resolve
correctly on your machine with a debug build (much faster than `--release`,
and good enough to catch a missing system library early):

```bash
cargo check
```

If this fails on Linux with linker errors mentioning `X11`, `xkbcommon`, or
`wayland`, you're missing the windowing headers — see
[Building on Linux](./building/linux.md#linux-build-dependencies) and come
back here.

If it fails with errors mentioning `nettle` or `bindgen`, that's the
`sequoia-openpgp` PGP library's default C dependency — see
[Dependencies](./dependencies.md#sequoia-openpgp-and-the-nettle-question)
before continuing.

## Repository layout

The source lives under `src/` as several small modules rather than one
large file — see [Project structure](./project-structure.md) for what each
one does before you start reading or editing code.

## Branches and tags

- `master` is the active development branch.
- Version tags (`v0.2.0`, etc.) mark what the release pipeline builds and
  publishes — see [Release checklist](./release-checklist.md).

If you're building for personal use, `master` is fine. If you want the
exact code behind a specific published release, check out its tag instead:

```bash
git checkout v0.2.0
```

Next: [Project structure](./project-structure.md).
