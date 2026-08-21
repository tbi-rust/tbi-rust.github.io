# Project structure

The application is split into small, single-purpose modules under `src/`
rather than one large file. If you're compiling for the first time, you
don't need to read any of this — it's here for when you're debugging a
build error and need to know which file a symbol lives in, or when you
want to patch behavior for a package you're maintaining.

```
src/
├── main.rs      # entry point: wires the modules together, sets window options
├── app.rs       # AppState enum, TorBrowserBuilder struct, worker plumbing
├── ui.rs        # all UI drawing (second impl block for TorBrowserBuilder)
├── install.rs   # background worker: fetch, download, verify, install
├── platform.rs  # OS detection, install paths, install-scope logic
├── theme.rs     # light/dark color palette
└── icons.rs     # hand-drawn vector icons (egui Painter, not image assets)
```

## `main.rs`

The smallest file in the project. It declares the module tree
(`mod theme; mod icons; mod platform; mod app; mod ui; mod install;`),
sets the app's own version string and author credit, configures the
window (`eframe::NativeOptions`), and calls `eframe::run_native`. If your
build fails at the `mod` declarations, it usually means one of the other
files has a compile error — the message underneath will point to the real
file.

## `app.rs`

Defines:

- **`AppState`** — the enum driving the whole UI: `Idle`, `Checking`,
  `AlreadyInstalled`, `ConfirmInstall`, `Downloading`, `Verifying`,
  `VerifyingSignature`, `Installing`, `Complete`, `Error`.
- **`TorBrowserBuilder`** — the app struct itself: install path, theme,
  install scope, the channel endpoints used to talk to the background
  worker thread, and the command log.
- Worker plumbing — `start_download` (spawns the worker thread),
  `send_confirm`, and `poll_worker` (drains worker events once per frame).
- Theme color helpers (`text_primary()`, `surface()`, etc.) and the
  `eframe::App` trait implementation that ties it all into egui's update loop.

## `ui.rs`

A **second `impl TorBrowserBuilder` block** — Rust allows splitting a
type's methods across files within the same crate, so this file owns every
`draw_*` method (header, card, idle screen, confirm screen, progress bar,
error screen, the About overlay, etc.) without needing to touch `app.rs`.
This is deliberate: UI layout changes and state-machine changes rarely
need to happen in the same place, so they're kept in different files.

## `install.rs`

The actual install pipeline, run on a background thread so the UI stays
responsive. This is where you'll find:

- `run_install_pipeline` — the top-level sequence (fetch → confirm →
  download → verify checksum → verify signature → install).
- `fetch_release_info` — talks to the Tor Project's release JSON API.
- `download_with_progress`, `sha256_of_file`, `verify_pgp_signature`.
- Platform-specific install routines, gated by `#[cfg(target_os = "...")]`
  — `install_from_dmg` (macOS), `install_from_targz` (Linux),
  `install_from_exe` (Windows), plus their helper functions. Each build
  only compiles the branch matching its own target, so a Linux build
  contains none of the macOS `hdiutil`/AppleScript code, and vice versa.

If you're packaging for a **new** platform, this is almost certainly the
file you need to extend — see [Packaging formats](./packaging-formats.md).

## `platform.rs`

OS detection and path conventions: `platform_label()`, `default_install_path()`,
the `InstallScope` enum (`User` vs `Global`, and whether a given scope
needs a password on this OS), and `find_existing_install()` /
`find_file()` used to locate an already-installed copy or a file inside an
extracted archive.

## `theme.rs`

Just color constants — `palette` (light) and `palette_dark` — plus the
`Theme` enum. No logic. Safe to edit without touching anything else if
you're re-skinning the app.

## `icons.rs`

Every icon in the UI is drawn procedurally with egui's `Painter` (lines,
polylines, arcs) rather than loaded from image files — there's no runtime
SVG rendering dependency. Each function here corresponds 1:1 to an SVG in
`src/assets/icons/` (kept in the repo as the source-of-truth reference the
hand-drawn version was traced from), except a few UI-only icons (`info`,
`moon`, `sun`, `chevron_down`, `chevron_right`) that never had an SVG and
are documented as such in the file's doc comments.

The one asset that *is* loaded as an image at runtime is the app logo,
`src/assets/tor_logo_tbb.svg`, pulled in via `include_bytes!` in `app.rs`
and rendered through `egui_extras`' image loader.

---

With the module map in hand, move on to the build chapter for your OS:
[macOS](./building/macos.md), [Linux](./building/linux.md), or
[Windows](./building/windows.md).
