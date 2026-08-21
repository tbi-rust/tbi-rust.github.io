j# Release checklist

Steps for cutting an actual release, in order. Treat this as a literal
checklist — copy it into the release PR or issue if that helps.

## 1. Bump the version

Update the version in **both** places it's declared — they're independent
and nothing enforces they match:

- `Cargo.toml` → `[package] version = "..."`
- `app.rs` → `APP_VERSION` constant (shown in the About screen and sent
  as the HTTP User-Agent when talking to the Tor Project's release API)

## 2. Update the changelog

If the repository keeps a `CHANGELOG.md`, add an entry for the new
version before tagging — it's much easier to write while the changes are
fresh than to reconstruct from commit history later.

## 3. Run the checks locally

```bash
cargo check
cargo clippy --all-targets -- -D warnings
cargo test
cargo build --release
```

Catching a build failure locally is faster than watching it fail in CI
across four runners.

## 4. Confirm the CI workflow itself is current

If you've changed `Cargo.toml` dependencies, added a new target, or
changed anything about how the app builds, make sure
`.github/workflows/build-and-release.yml` (see
[Building with GitHub Actions](./ci-github-actions.md)) still reflects
that — a release tag push is a bad time to discover the workflow is
out of date.

## 5. Tag and push

```bash
git tag v0.2.0
git push origin v0.2.0
```

This triggers the build-and-release workflow automatically.

## 6. Watch the Actions run

Open the **Actions** tab and confirm all four matrix legs (macOS x86_64,
macOS arm64, Linux x86_64, Windows x86_64) go green. If one fails, the
`release` job won't run at all (it depends on all of `build` succeeding),
so nothing gets half-published.

## 7. Check the generated Release

Once the workflow finishes, open the **Releases** page and confirm:

- All four expected assets are attached, named correctly
  (`TorBrowserInstaller-<os>-<arch>.<ext>` — see
  [Packaging formats](./packaging-formats.md#naming-convention)).
- The auto-generated release notes look reasonable (`generate_release_notes: true`
  builds them from merged PRs/commits since the last tag — edit by hand if
  they need cleanup).
- The pre-release flag is set correctly (`-beta`/`-rc` tags should show as
  a pre-release; plain version tags should not).

## 8. Smoke-test at least one artifact

Download the build for your own platform from the freshly published
release (not your local build — the actual published artifact) and run
it. This catches packaging mistakes — a missing file in the archive, a
broken `Compress-Archive` path, etc. — that a successful CI build alone
won't.

## 9. Update anything that references the old version

- The project website, if it hardcodes a version number anywhere.
- Any package manager manifests you maintain externally (Homebrew tap,
  winget/Scoop manifest, AUR PKGBUILD, `.deb`/`.rpm` spec files) — these
  live outside this repository and won't update themselves.

## 10. Announce it

However you'd normally let people know — a GitHub Discussions post, the
project README's "latest release" badge (if it points at a specific
version rather than `latest`), etc.

---

If something in this checklist doesn't match your actual release process,
update this file in the same PR — a stale checklist is worse than no
checklist.
