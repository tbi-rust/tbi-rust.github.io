# Cross-compiling

Building for an OS other than the one you're on. This is genuinely harder
than it sounds for this particular project, because `eframe`/`winit`
(windowing) and, by default, `sequoia-openpgp` (PGP, via nettle) both link
against C libraries that need to exist *for the target*, not just the host.

> **Read [Dependencies](./dependencies.md#sequoia-openpgp-and-the-nettle-question)
> first.** Switching `sequoia-openpgp` to its `crypto-rust` backend removes
> one whole category of cross-compile pain. Everything below assumes
> you've made that switch; if you haven't, expect nettle-related linker
> errors on top of whatever else comes up.

If cross-compiling turns out to be more trouble than it's worth for your
use case, [Building with GitHub Actions](../ci-github-actions.md) sidesteps
the entire problem by building natively on real macOS/Linux/Windows
runners — that's the recommended path for actual releases. Treat this
chapter as the "I specifically want to do this locally" option.

## macOS → Windows

The easiest cross-compile direction, because Windows doesn't need a full
sysroot the way Linux does.

```bash
brew install mingw-w64
rustup target add x86_64-pc-windows-gnu

cargo build --release --target x86_64-pc-windows-gnu
```

This produces a `-windows-gnu` build. Cross-compiling to `-windows-msvc`
from macOS is possible with Microsoft's [`xwin`](https://github.com/Jake-Shadle/xwin)
tool (which downloads the MSVC headers/libs you'd otherwise only get from
Visual Studio), but it's fiddlier to set up correctly than `-gnu` and
generally not worth it unless you specifically need an MSVC-built binary
outside of CI.

## macOS → Linux

Needs a Linux sysroot, which is why this is normally done inside a
container rather than directly on the host.

### Option A: `cross` (Docker-based)

[`cross`](https://github.com/cross-rs/cross) wraps `cargo build` with a
prebuilt Docker image containing the right sysroot per target:

```bash
brew install --cask docker   # Docker Desktop, if you don't have it
cargo install cross --git https://github.com/cross-rs/cross
rustup target add x86_64-unknown-linux-gnu

cross build --release --target x86_64-unknown-linux-gnu
```

`cross` handles the windowing-library headers (X11/Wayland/xkbcommon)
inside its default Linux image, so you shouldn't need to install anything
extra beyond Docker itself.

### Option B: `cargo-zigbuild` (lighter weight)

[`cargo-zigbuild`](https://github.com/rust-cross/cargo-zigbuild) uses
[Zig](https://ziglang.org/) as the C compiler/linker instead of a full
Docker image — smaller download, faster, and it makes targeting a
*specific* glibc version straightforward (useful for "runs on older
distros too" builds):

```bash
brew install zig
cargo install cargo-zigbuild
rustup target add x86_64-unknown-linux-gnu

cargo zigbuild --release --target x86_64-unknown-linux-gnu.2.17
```

The `.2.17` suffix pins the minimum glibc version — drop it to target
whatever glibc your build machine has instead.

Both options still need the windowing dev headers to be *findable* at
build time; `cross`'s Docker image bundles them, `cargo-zigbuild` on a
bare macOS host generally does not, so if you hit header-not-found errors
with `cargo-zigbuild`, reach for `cross` instead.

## Linux → macOS

Not realistically supported by any current tool — Apple's SDK license
prohibits redistributing the macOS SDK, which is what every macOS
cross-compilation approach ultimately needs. If you need a macOS build
and don't have a Mac, use
[Building with GitHub Actions](../ci-github-actions.md)'s `macos-latest`
runner, or a cloud Mac (MacStadium, GitHub-hosted, etc.).

## Linux → Windows

Same as the macOS → Windows case, just with MinGW installed via your
distro's package manager instead of Homebrew:

```bash
sudo apt-get install mingw-w64
rustup target add x86_64-pc-windows-gnu

cargo build --release --target x86_64-pc-windows-gnu
```

## Verifying a cross-compiled binary

Cross-compiling successfully doesn't guarantee the binary actually *runs*
correctly on the target — only that it linked. Confirm the target
architecture and format with `file` before shipping it anywhere:

```bash
file target/x86_64-pc-windows-gnu/release/tor-browser-builder.exe
# -> PE32+ executable (GUI) x86-64, for MS Windows
```

If you have any way to actually run the binary on the target OS (a VM, a
spare machine, a friend), do — a successful cross-compile is necessary but
not sufficient.

Next: [Packaging formats](./packaging-formats.md), or skip cross-compiling
altogether with [Building with GitHub Actions](../ci-github-actions.md).
