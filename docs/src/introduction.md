# Introduction

This book documents how to **build, package, cross-compile, and release**
Tor Browser Installer — a cross-platform, native installer and launcher for
Tor Browser, written in Rust with [egui](https://github.com/emilk/egui).

> **This is a build guide, not a user manual.** If you just want to *run*
> the app, grab a prebuilt binary from the
> [Releases page](https://github.com/reality-prod/tbi-rust/releases) and
> see the [main project README](https://github.com/reality-prod/tbi-rust)
> instead. This book is for people who want to compile it themselves, patch
> it, package it for a new platform, or maintain the release pipeline.


>[!WARNING]
> **Not Supported OS**:
> If you are on FreeBSD, GhostBSD, or any alternative OS please read [this](./building/bsd.md).
## Who this is for

- **End users** who'd rather build from source than trust a prebuilt binary
  — everything you need is in [Getting set up](./prerequisites.md) and the
  three per-platform build chapters.
- **Packagers** putting this into a Linux distro repo, a Homebrew tap, a
  winget/Scoop manifest, etc. — see [Packaging formats](./packaging-formats.md).
- **Maintainers** cutting releases — see [Building with GitHub Actions](./ci-github-actions.md)
  and the [Release checklist](./release-checklist.md).

## What you're building

The app is a single native binary per platform (`tor-browser-builder`, or
`tor-browser-builder.exe` on Windows). It has no runtime dependencies beyond
what's statically linked or ships with the OS — there's no installer-for-the-installer,
no bundled runtime, no Electron.

At a high level, the binary:

1. Fetches the current Tor Browser release metadata from the Tor Project.
2. Shows you what it's about to download and waits for confirmation.
3. Downloads it over HTTPS with a live progress bar.
4. Verifies the SHA-256 checksum, then the PGP signature.
5. Installs it to the right place for your OS, and can launch it.

Every one of those steps is real, working code — this book walks through
compiling that code, not a simplified version of it.

## Project status

This project is **beta**. Version numbers, dependency choices (notably the
`sequoia-openpgp` crypto backend — see [Dependencies](./dependencies.md) and
[Cross-compiling](./cross-compiling.md)), and even the packaging pipeline
described here are still settling. If something in this book doesn't match
what you see in the repository, the repository is the source of truth —
please open an issue so the docs can be corrected.
