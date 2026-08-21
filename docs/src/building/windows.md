# Building on Windows

## Choose a target: MSVC or GNU

Windows Rust builds come in two flavors:

- **`x86_64-pc-windows-msvc`** (default) — uses the Microsoft Visual C++
  linker. Needs the Visual Studio Build Tools. This is what most published
  Windows Rust binaries use, and what CI builds for you (see
  [Building with GitHub Actions](../ci-github-actions.md)).
- **`x86_64-pc-windows-gnu`** — uses the MinGW linker instead. Useful if
  you don't want to install Visual Studio at all, and it's the target
  cross-compiling from macOS/Linux typically produces (see
  [Cross-compiling](../cross-compiling.md)).

If `rustup-init.exe` already offered to install the Build Tools and you
accepted, you're set up for MSVC — that's the simplest path on Windows
itself.

## Build (MSVC)

From PowerShell or Command Prompt, in the repository root:

```powershell
cargo build --release
```

The binary lands at `target\release\tor-browser-builder.exe`.

## Build (GNU, no Visual Studio)

```powershell
rustup target add x86_64-pc-windows-gnu
rustup toolchain install stable-x86_64-pc-windows-gnu
rustup default stable-x86_64-pc-windows-gnu

cargo build --release
```

You'll also need MinGW-w64 on your `PATH` — the easiest route is installing
it via [MSYS2](https://www.msys2.org/):

```powershell
# inside an MSYS2 shell
pacman -S mingw-w64-x86_64-gcc
```

## Packaging as a `.zip`

The simplest distributable — just the executable:

```powershell
Compress-Archive -Path target\release\tor-browser-builder.exe `
  -DestinationPath TorBrowserInstaller-windows-x86_64.zip
```

## Packaging as an NSIS installer

`install.rs`'s Windows install path (`install_from_exe`) already expects
to run a Tor Browser release's own NSIS-based installer silently with
`/S /D=<path>`. If you want *this app itself* to be distributed the same
way — a proper installer rather than a bare `.exe` — you'll need
[NSIS](https://nsis.sourceforge.io/) installed, and a script like:

```nsis
; installer.nsi
OutFile "TorBrowserInstaller-Setup.exe"
InstallDir "$LOCALAPPDATA\Tor Browser Installer"

Section "Install"
  SetOutPath $INSTDIR
  File "target\release\tor-browser-builder.exe"
  CreateShortcut "$SMPROGRAMS\Tor Browser Installer.lnk" "$INSTDIR\tor-browser-builder.exe"
SectionEnd
```

Build it with:

```powershell
makensis installer.nsi
```

This is optional — a plain `.zip` with the `.exe` inside is a perfectly
normal way to distribute a small native Windows tool, and is what the
[GitHub Actions](../ci-github-actions.md) pipeline produces by default.

## Code signing

An unsigned `.exe` will trigger SmartScreen warnings on other people's
machines the first time it's run. Signing needs a code-signing certificate
(from a CA, or an EV cert for immediate SmartScreen reputation) and
`signtool.exe` from the Windows SDK — out of scope for this guide, same as
macOS notarization.

Next: [Cross-compiling](../cross-compiling.md), or
[Building with GitHub Actions](../ci-github-actions.md) to build all three
platforms — including a proper Windows MSVC build — without needing
Windows yourself.
