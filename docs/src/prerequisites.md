# Prerequisites

You need three things on any platform: **Rust**, a **C linker/toolchain**
(usually already present, or installed alongside Rust), and, on Linux,
a handful of **windowing library headers**. Platform-specific extras are
called out in each build chapter.

## 1. Install Rust

Install via [rustup](https://rustup.rs/) — this is the only supported way
to get a toolchain that matches what this project is tested against:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

On Windows, download and run [rustup-init.exe](https://win.rustup.rs/)
instead. It will prompt you to also install the Visual Studio Build Tools
(the MSVC linker) if you don't already have them — accept that prompt.

Confirm it worked:

```bash
rustc --version
cargo --version
```

This project targets a reasonably recent stable toolchain (the CI badge in
the repository README shows the exact version it's built against). If
you're on an older `rustc`, update first:

```bash
rustup update stable
```

## 2. A C linker

- **macOS**: install the Xcode Command Line Tools if you haven't already:
  ```bash
  xcode-select --install
  ```
- **Linux**: `gcc` or `clang`, usually already installed. If not:
  ```bash
  sudo apt-get install build-essential   # Debian/Ubuntu
  sudo dnf groupinstall "Development Tools"   # Fedora
  ```
- **Windows**: the MSVC linker comes with the Visual Studio Build Tools
  (rustup will offer to install it). If you'd rather avoid Visual Studio
  entirely, you can target `x86_64-pc-windows-gnu` instead and install
  [mingw-w64](https://www.mingw-w64.org/) — see
  [Building on Windows](./building/windows.md).

## 3. Linux windowing headers

Only needed on Linux, because `eframe`/`winit` link against your windowing
system at build time. Covered in full in
[Building on Linux](./building/linux.md) — the short version:

```bash
sudo apt-get install pkg-config libx11-dev libxkbcommon-dev \
  libxkbcommon-x11-dev libwayland-dev libxcb1-dev \
  libxcb-render0-dev libxcb-shape0-dev libxcb-xfixes0-dev libssl-dev
```

## Optional but recommended

- **`cargo clippy`** and **`cargo fmt`** — installed by default with
  rustup. Run `cargo clippy` before opening a pull request; CI runs it too.
- **A GitHub account with Actions enabled**, if you plan to use the
  matrix-build release pipeline instead of building locally — see
  [Building with GitHub Actions](./ci-github-actions.md).

Once these are in place, move on to [Getting the source](./getting-the-source.md).
