# Troubleshooting

Common build errors and what they actually mean.

## `error: failed to run custom build command for nettle-sys`

You're on the default `sequoia-openpgp` crypto backend and are missing the
nettle C library / headers, or you're trying to cross-compile without a
target-appropriate nettle build.

**Fix**: install `nettle-dev` (Linux) / `nettle` via Homebrew (macOS) for
a native build, or switch to the pure-Rust backend to sidestep this
entirely — see [Dependencies](./dependencies.md#sequoia-openpgp-and-the-nettle-question).

## Linker errors mentioning `X11`, `xkbcommon`, or `wayland` (Linux only)

Missing windowing system headers that `eframe`/`winit` link against at
build time.

**Fix**: install the package list in
[Building on Linux](./building/linux.md#linux-build-dependencies).

## `error: linking with 'cc' failed` with no other useful detail

Usually means no C linker/toolchain is installed at all, or it's not on
your `PATH`.

**Fix**:
- macOS: `xcode-select --install`
- Linux: `sudo apt-get install build-essential` (or your distro's equivalent)
- Windows: install the Visual Studio Build Tools (MSVC) or MinGW-w64
  (GNU) — see [Building on Windows](./building/windows.md#choose-a-target-msvc-or-gnu)

## `error: could not find native static library` (Windows, cross-compiled)

You're cross-compiling to `x86_64-pc-windows-msvc` from macOS or Linux
without the MSVC libraries available (they're not redistributable the
normal way).

**Fix**: target `x86_64-pc-windows-gnu` instead when cross-compiling — see
[Cross-compiling](./cross-compiling.md#macos--windows). Save
`-msvc` builds for [GitHub Actions](./ci-github-actions.md)'s
`windows-latest` runner, which has MSVC natively.

## Build succeeds, but the binary won't run on another machine (Linux)

Almost always a glibc version mismatch — the binary was built against a
newer glibc than the target machine has.

**Fix**: build on an older distro (or an equivalent container image), or
use a `musl` target for a fully static binary — see
[Building on Linux](./building/linux.md#static-linking-against-a-specific-glibc-for-portability).

## `cargo build` hangs or is extremely slow the first time

Normal, if unwelcome — `eframe`/`egui` and their transitive dependencies
(especially `wgpu` and `naga`) are large crates with a lot to compile from
scratch. Subsequent builds are much faster because `cargo` only
recompiles what changed. If you're doing this repeatedly (e.g. in CI),
see the caching setup in
[Building with GitHub Actions](./ci-github-actions.md#caching).

## `cross build` fails with a Docker-related error

`cross` needs Docker Desktop (or a compatible container runtime) actually
running, not just installed.

**Fix**: start Docker Desktop, confirm `docker ps` works without error,
then retry. If Docker itself won't start on your machine, try
[`cargo-zigbuild`](./cross-compiling.md#option-b-cargo-zigbuild-lighter-weight)
instead — it doesn't need a container runtime at all.

## None of the above matches my error

Open an issue on the repository with:

- The exact command you ran
- The full error output (not just the last line — the real cause is often
  several lines above the final `error:`)
- Your OS, architecture, and `rustc --version` / `cargo --version`
- Whether you're building natively or cross-compiling, and for which target

Next: [FAQ](./faq.md).
