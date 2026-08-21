# Building with GitHub Actions

The recommended way to produce release binaries for all three platforms:
build **natively** on `macos-latest`, `ubuntu-latest`, and `windows-latest`
in parallel, then publish everything to one GitHub Release. No
cross-compiling, no Docker, no nettle headaches — each runner already has
exactly what its own OS needs.

## The workflow

Save this as `.github/workflows/build-and-release.yml`:

```yaml
name: Build & Release

on:
  push:
    tags:
      - "v*"
  workflow_dispatch:

permissions:
  contents: write

jobs:
  build:
    strategy:
      fail-fast: false
      matrix:
        include:
          - os: macos-latest
            target: x86_64-apple-darwin
            asset_name: TorBrowserInstaller-macos-x86_64
          - os: macos-latest
            target: aarch64-apple-darwin
            asset_name: TorBrowserInstaller-macos-arm64
          - os: ubuntu-latest
            target: x86_64-unknown-linux-gnu
            asset_name: TorBrowserInstaller-linux-x86_64
          - os: windows-latest
            target: x86_64-pc-windows-msvc
            asset_name: TorBrowserInstaller-windows-x86_64

    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4

      - uses: dtolnay/rust-toolchain@stable
        with:
          targets: ${{ matrix.target }}

      - uses: Swatinem/rust-cache@v2
        with:
          key: ${{ matrix.target }}

      - name: Install Linux build dependencies
        if: matrix.os == 'ubuntu-latest'
        run: |
          sudo apt-get update
          sudo apt-get install -y pkg-config libx11-dev libxkbcommon-dev \
            libxkbcommon-x11-dev libwayland-dev libxcb1-dev \
            libxcb-render0-dev libxcb-shape0-dev libxcb-xfixes0-dev libssl-dev

      - name: Build (release)
        run: cargo build --release --locked --target ${{ matrix.target }}

      - name: Package (macOS / Linux)
        if: matrix.os != 'windows-latest'
        run: |
          cd target/${{ matrix.target }}/release
          tar -czf ${{ github.workspace }}/${{ matrix.asset_name }}.tar.gz tor-browser-builder
          cd ${{ github.workspace }}

      - name: Package (Windows)
        if: matrix.os == 'windows-latest'
        shell: pwsh
        run: |
          Compress-Archive -Path "target/${{ matrix.target }}/release/tor-browser-builder.exe" `
            -DestinationPath "${{ matrix.asset_name }}.zip"

      - uses: actions/upload-artifact@v4
        with:
          name: ${{ matrix.asset_name }}
          path: |
            ${{ matrix.asset_name }}.tar.gz
            ${{ matrix.asset_name }}.zip
          if-no-files-found: ignore

  release:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
        with:
          path: artifacts

      - uses: softprops/action-gh-release@v2
        with:
          draft: false
          prerelease: ${{ contains(github.ref_name, 'beta') || contains(github.ref_name, 'rc') }}
          files: artifacts/**/*
          generate_release_notes: true
```

## How it's structured

- **`build` job**: a matrix of four target/OS combinations, running in
  parallel. Each leg checks out the code, installs the Rust toolchain for
  its specific target, builds in release mode, packages the result
  (`.tar.gz` on macOS/Linux, `.zip` on Windows), and uploads it as a
  workflow artifact.
- **`release` job**: waits for every matrix leg to finish (`needs: build`),
  downloads all the artifacts, and hands them to
  [`softprops/action-gh-release`](https://github.com/softprops/action-gh-release),
  which creates (or updates) a GitHub Release matching the pushed tag and
  attaches every file.

## Triggering it

Push a version tag:

```bash
git tag v0.2.0
git push origin v0.2.0
```

The `-beta`/`-rc` check in the `prerelease:` line means tags like
`v0.3.0-beta` or `v1.0.0-rc1` automatically get marked as a GitHub
pre-release, while plain `vX.Y.Z` tags publish as a normal release.

You can also trigger it manually without pushing a tag, from the Actions
tab in GitHub (`workflow_dispatch`) — useful for testing the pipeline
itself without cutting a real release.

## Extending the matrix

To add another target — say, `aarch64-unknown-linux-gnu` for ARM Linux —
add a new entry to `matrix.include` with the right `os`, `target`, and
`asset_name`. Cross-architecture Linux builds inside GitHub's `ubuntu-latest`
runner (x86_64 host, aarch64 target) need either a cross tool
(see [Cross-compiling](./cross-compiling.md)) or QEMU-based emulation —
they're not free the way macOS Intel/Apple Silicon are, since GitHub's
runners are x86_64-only for Linux.

## Caching

`Swatinem/rust-cache@v2` caches `~/.cargo` and `target/` between runs,
keyed per target. This is what keeps subsequent builds fast — without it,
every push would recompile every dependency (including `eframe`/`egui`,
which are not small) from scratch on every runner.

Next: [Release checklist](./release-checklist.md).
