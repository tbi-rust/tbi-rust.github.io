# Building on Linux

## Linux build dependencies

`eframe`/`winit` link against your windowing system's headers at build
time (X11 and/or Wayland, plus xkbcommon for keyboard handling). Install
them before your first build:

```bash
# Debian / Ubuntu
sudo apt-get update
sudo apt-get install -y \
  pkg-config \
  libx11-dev \
  libxkbcommon-dev \
  libxkbcommon-x11-dev \
  libwayland-dev \
  libxcb1-dev \
  libxcb-render0-dev \
  libxcb-shape0-dev \
  libxcb-xfixes0-dev \
  libssl-dev
```

```bash
# Fedora
sudo dnf install pkgconf-pkg-config libX11-devel libxkbcommon-devel \
  libxkbcommon-x11-devel wayland-devel libxcb-devel openssl-devel
```

```bash
# Arch
sudo pacman -S pkgconf libx11 libxkbcommon libxkbcommon-x11 wayland libxcb openssl
```

If you kept the default `sequoia-openpgp` crypto backend (see
[Dependencies](../dependencies.md#sequoia-openpgp-and-the-nettle-question)),
also install `nettle-dev` (Debian/Ubuntu) or `nettle-devel` (Fedora).

## Build

```bash
cargo build --release
```

The binary is at `target/release/tor-browser-builder`. It's a normal
dynamically-linked ELF binary — check what it's linked against with:

```bash
ldd target/release/tor-browser-builder
```

## Static linking against a specific glibc (for portability)

A binary built on your machine is linked against *your* glibc version. If
you want it to run on older distros too, either build on an older distro
(or an equivalent Docker image), or build against `musl` instead for a
fully static binary:

```bash
rustup target add x86_64-unknown-linux-musl
sudo apt-get install musl-tools

cargo build --release --target x86_64-unknown-linux-musl
```

Note: `musl` builds can be fussier with GUI crates and OpenSSL-linking
dependencies (`reqwest` defaults to relying on the system's TLS backend).
If `musl` gives you trouble, `reqwest`'s `rustls-tls` feature avoids the
OpenSSL linking question entirely and tends to be the smoother path for
static Linux builds — swap it in for the default `default-tls` feature
in `Cargo.toml` if you go this route.

## Packaging as `.tar.xz`

This matches what `install.rs`'s Linux install path already expects to
extract (`install_from_targz` looks for a `start-tor-browser`-style
launcher inside — for *this* app's own packaging, just the binary itself
is enough):

```bash
mkdir -p tor-browser-installer/
cp target/release/tor-browser-builder tor-browser-installer/
tar -cJf TorBrowserInstaller-linux-x86_64.tar.xz tor-browser-installer/
```

## Packaging as an AppImage

AppImage is the closest thing to a universal Linux package format — one
file, runs on most distros, no root/install step needed.

```bash
# One-time: get appimagetool
wget https://github.com/AppImage/AppImageKit/releases/download/continuous/appimagetool-x86_64.AppImage
chmod +x appimagetool-x86_64.AppImage

# Build the AppDir
mkdir -p AppDir/usr/bin
cp target/release/tor-browser-builder AppDir/usr/bin/
cat > AppDir/tor-browser-builder.desktop << 'EOF'
[Desktop Entry]
Name=Tor Browser Installer
Exec=tor-browser-builder
Icon=tor-browser-builder
Type=Application
Categories=Network;
EOF
# AppImage needs an icon file matching the Icon= name above (PNG, not SVG)
# — convert src/assets/tor_logo_tbb.svg with `rsvg-convert` or similar first.

./appimagetool-x86_64.AppImage AppDir TorBrowserInstaller-x86_64.AppImage
```

## Packaging as `.deb`

For Debian/Ubuntu-based distros, [`cargo-deb`](https://github.com/kornelski/cargo-deb)
generates a `.deb` straight from your `Cargo.toml` metadata:

```bash
cargo install cargo-deb
cargo deb
```

This produces `target/debian/tor-browser-builder_0.2.0_amd64.deb`. You may
want to add a `[package.metadata.deb]` section to `Cargo.toml` to set the
package description, section, and desktop-file details — see the
`cargo-deb` documentation for the available keys.

Next: [Building on Windows](./windows.md), or
[Cross-compiling](../cross-compiling.md) if you'd rather produce the
Linux build from a different host OS.
