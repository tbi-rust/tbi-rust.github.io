# Building on macOS

## Build

```bash
cargo build --release
```

The binary lands at `target/release/tor-browser-builder`. Run it directly:

```bash
./target/release/tor-browser-builder
```

## Building for a specific Mac architecture

macOS ships both Apple Silicon (`aarch64`) and Intel (`x86_64`) Macs.
`cargo build --release` targets whatever chip you're building *on* by
default. To build for the other one, or both:

```bash
rustup target add x86_64-apple-darwin aarch64-apple-darwin

cargo build --release --target x86_64-apple-darwin
cargo build --release --target aarch64-apple-darwin
```

Building for the architecture you're *not* on (e.g. Intel target on an
Apple Silicon Mac) works out of the box — Xcode's linker supports both
natively, no extra toolchain needed. This is not the same as cross-compiling
to a *different OS*; see [Cross-compiling](./cross-compiling.md) for that.

## Universal (fat) binary

To ship one binary that runs natively on both architectures:

```bash
cargo build --release --target x86_64-apple-darwin
cargo build --release --target aarch64-apple-darwin

lipo -create \
  target/x86_64-apple-darwin/release/tor-browser-builder \
  target/aarch64-apple-darwin/release/tor-browser-builder \
  -output tor-browser-builder-universal
```

## Packaging as a `.app` bundle

A plain binary works, but a proper `.app` bundle is what people expect to
drag into `/Applications`. There's no `cargo-bundle`-style step wired into
this project yet, so the bundle is assembled by hand:

```bash
APP=TorBrowserInstaller.app
mkdir -p "$APP/Contents/MacOS" "$APP/Contents/Resources"

cp target/release/tor-browser-builder "$APP/Contents/MacOS/"
cp src/assets/tor_logo_tbb.svg "$APP/Contents/Resources/"
```

Then add an `Info.plist` at `$APP/Contents/Info.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleName</key><string>Tor Browser Installer</string>
  <key>CFBundleExecutable</key><string>tor-browser-builder</string>
  <key>CFBundleIdentifier</key><string>dev.reality-prod.tbi-rust</string>
  <key>CFBundleVersion</key><string>0.2.0</string>
  <key>CFBundleShortVersionString</key><string>0.2.0</string>
  <key>CFBundlePackageType</key><string>APPL</string>
  <key>NSHighResolutionCapable</key><true/>
</dict>
</plist>
```

(An actual `.icns` app icon isn't included yet — `tor_logo_tbb.svg` needs
converting via `sips`/`iconutil` first if you want one. Without a
`CFBundleIconFile` entry, macOS just shows the generic app icon.)

## Packaging as a `.dmg`

```bash
hdiutil create -volname "Tor Browser Installer" \
  -srcfolder TorBrowserInstaller.app \
  -ov -format UDZO \
  TorBrowserInstaller.dmg
```

This is the same archive format `install.rs`'s macOS install path already
knows how to read (`install_from_dmg` mounts it with `hdiutil attach` and
copies the `.app` out) — so a `.dmg` built this way is exactly what
end users of the *official* release download too.

## Code signing and notarization

Not currently part of this project's build. An unsigned `.app` will
trigger Gatekeeper's "unidentified developer" warning on other people's
Macs. If you're distributing builds beyond your own machine, look at
`codesign` and `xcrun notarytool` — both need an active Apple Developer
account and are out of scope for this guide.

Next: [Building on Linux](./linux.md), or skip to
[Building with GitHub Actions](../ci-github-actions.md) to have all three
platforms built and packaged for you automatically.
