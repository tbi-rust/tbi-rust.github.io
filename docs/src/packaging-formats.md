# Packaging formats

A quick reference for what to build on each platform, and why. Detailed
commands for each are in the per-OS build chapters — this page is for
deciding *which* format fits your situation.

| Platform | Format | Best for | Chapter |
|---|---|---|---|
| macOS | `.dmg` containing a `.app` | General distribution — what most Mac users expect | [macOS](./building/macos.md#packaging-as-a-dmg) |
| macOS | Bare binary | Personal use, scripting, homebrew formula source | [macOS](./building/macos.md#build) |
| Linux | `.tar.xz` | Universal fallback, matches this project's own Tor Browser install format | [Linux](./building/linux.md#packaging-as-tarxz) |
| Linux | AppImage | One file, runs on most distros without installing anything | [Linux](./building/linux.md#packaging-as-an-appimage) |
| Linux | `.deb` | Debian/Ubuntu package managers, apt-based install/upgrade/uninstall | [Linux](./building/linux.md#packaging-as-deb) |
| Windows | `.zip` | Simplest option, portable, no installer needed | [Windows](./building/windows.md#packaging-as-a-zip) |
| Windows | NSIS `.exe` installer | Start Menu shortcuts, uninstall entry, familiar install flow | [Windows](./building/windows.md#packaging-as-an-nsis-installer) |

## Naming convention

The [GitHub Actions release pipeline](./ci-github-actions.md) names
artifacts `TorBrowserInstaller-<os>-<arch>.<ext>`, e.g.
`TorBrowserInstaller-macos-arm64.tar.gz`. Sticking to this pattern for
manual builds too makes it obvious at a glance what a given file is, and
keeps checksums/signatures (see [Verifying a release](./verifying-releases.md))
easy to match against the right artifact.

## Should I sign my build?

If you're only running it on your own machine, no. If you're distributing
it to other people:

- **macOS**: unsigned `.app`/`.dmg` triggers a Gatekeeper warning. Fixing
  this needs an Apple Developer account, `codesign`, and
  `xcrun notarytool`.
- **Windows**: unsigned `.exe` triggers a SmartScreen warning. Fixing this
  needs a code-signing certificate and `signtool.exe`.
- **Linux**: no OS-level signing gate exists in the same way — package
  managers (apt, etc.) use repository-level signing instead, which is a
  separate concern from signing the binary itself.

Neither signing path is currently wired into this project's build or CI —
they're genuinely separate infrastructure (a paid certificate, secrets
management, and usually a manual identity-verification step with the
certificate authority) and are left as a deliberate gap rather than a
half-implemented one. If you take this on for a fork or a packaging
effort, treat it as its own project.

## Deciding what to actually publish

For most users, publishing **one archive format per platform** — `.tar.xz`
for Linux, `.dmg` for macOS, `.zip` for Windows — covers the vast majority
of people who'd download a Rust GUI tool directly from a Releases page.
Add AppImage/`.deb`/NSIS installer variants only once you have a specific
audience asking for them; each additional format is another thing to keep
building and testing on every release.
