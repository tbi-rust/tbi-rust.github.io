# Dependencies

Everything the app depends on is declared in `Cargo.toml`. Most are
straightforward; one (`sequoia-openpgp`) has an important build-time
trade-off worth understanding before you compile.

| Crate | Used for |
|---|---|
| `eframe` / `egui` | The GUI framework and windowing/rendering backend |
| `egui_extras` (`all_loaders`) | Loads the app logo SVG at runtime |
| `directories` | Platform-correct default paths (`/Applications`, `LOCALAPPDATA`, XDG dirs) |
| `reqwest` (`blocking`, `json`) | HTTP client for the release check and download |
| `serde` / `serde_json` | Parsing the Tor Project's release JSON |
| `sha2` | SHA-256 checksum verification |
| `hex` | Encoding the computed checksum for comparison/display |
| `sequoia-openpgp` | PGP signature verification |
| `anyhow` | Ergonomic error handling in the worker thread |

## `sequoia-openpgp` and the nettle question

By default, `sequoia-openpgp` uses its `crypto-nettle` backend, which links
against **nettle**, a C cryptography library, via the `nettle-sys` crate
(which in turn needs `bindgen` and a C compiler at build time).

This is fine for a normal native build — `apt install nettle-dev` on
Linux, and it's usually already resolvable via `pkg-config` on macOS if
you have it installed (`brew install nettle`) — but it's the single
biggest obstacle to **cross-compiling** this project, because cross-compiling
a C dependency for a different target OS is a much harder problem than
cross-compiling pure Rust.

### The alternative: `crypto-rust`

`sequoia-openpgp` also ships a pure-Rust backend (RustCrypto crates under
the hood) that has no C dependency at all:

```toml
sequoia-openpgp = { version = "2.4", default-features = false, features = ["crypto-rust"] }
```

This is what the [Cross-compiling](./cross-compiling.md) and
[GitHub Actions](./ci-github-actions.md) chapters assume, because it makes
every build — native or cross — behave the same way with no extra system
packages. The trade-off: `crypto-rust` is newer and has had less
third-party cryptographic audit than nettle or OpenSSL. For this app's use
case — verifying a signature against a known public key, not generating
keys or handling secret material — that trade-off is reasonable, but it's
worth knowing if you're evaluating this project for something more
security-critical.

If you'd rather keep the default `crypto-nettle` backend, that's fine too
— you'll just need `nettle-dev` (or your platform's equivalent) installed
for every target you build for, including inside CI runners and cross
toolchains.

## Checking the resolved dependency tree

To see exactly which versions and backends are in use in your working
copy:

```bash
cargo tree -p sequoia-openpgp
```

If you see `nettle-sys` in that output, you're on the default backend. If
you see `aes`, `sha1collisiondetection` without `nettle`, and similar
RustCrypto crates instead, you're on `crypto-rust`.

Next: [Building on macOS](./building/macos.md), [Linux](./building/linux.md),
or [Windows](./building/windows.md) — or skip straight to
[Cross-compiling](./cross-compiling.md) if you're not building on the
target OS directly.
