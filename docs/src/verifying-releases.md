# Verifying a release

This chapter is for **end users** who downloaded a prebuilt binary from
the Releases page and want to confirm it's actually the file the project
published — not for people building from source (if you built it
yourself, you already have the source, which is its own form of
verification).

## Why bother

A downloaded binary can be corrupted in transit, or — in a worse case —
tampered with somewhere between the build server and your machine. This
project takes exactly the same precaution with the *Tor Browser* downloads
it fetches (SHA-256 + PGP, see the app's own
[Security page](https://reality-prod.github.io/tbi-rust/security)); it's
reasonable to hold the installer itself to that standard too.

## Checking the SHA-256 checksum

If the release includes a checksums file (`SHA256SUMS` or similar),
compare against it:

```bash
# macOS / Linux
shasum -a 256 TorBrowserInstaller-macos-arm64.tar.gz
```

```powershell
# Windows
Get-FileHash TorBrowserInstaller-windows-x86_64.zip -Algorithm SHA256
```

Compare the output against the value published alongside the release. If
they don't match exactly, don't run the file — re-download it, and if the
mismatch persists, report it.

## Where the checksum comes from

Every release built through
[the GitHub Actions pipeline](./ci-github-actions.md) is a direct, visible
build from tagged source — you can open the **Actions** tab, find the run
for a given version tag, and read the exact build log that produced the
artifact you downloaded. That's the same transparency principle the app
itself follows internally with its "View commands" panel: nothing about
the build is hidden.

## GPG-signing releases (not yet set up)

This project does not currently GPG-sign its release artifacts the way
Tor Browser itself does. If you need that level of assurance today, the
most trustworthy option is still to
[build from source yourself](./getting-the-source.md) from a tagged
commit and compare against the published SHA-256, rather than trusting an
unsigned binary on its own.

If you're maintaining a fork or a package for a distro that requires
signed artifacts, GPG-signing the release assets as part of the
[release checklist](./release-checklist.md) is a reasonable thing to add
— `gpg --detach-sign` on each artifact, published alongside it, the same
pattern Tor Browser itself uses and this app already knows how to verify
in the other direction.

## Reporting a verification failure

If a checksum genuinely doesn't match what's published, that's worth
treating seriously — open an issue on the repository with:

- Which release/asset you downloaded
- The checksum you computed
- How you downloaded it (browser, `curl`, a mirror, etc.)

so it can be investigated rather than assumed to be a one-off download
glitch.
