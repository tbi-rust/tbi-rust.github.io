# FAQ

**Do I need to build this myself, or is there a prebuilt download?**
If you just want to run the app, check the
[Releases page](https://github.com/reality-prod/tbi-rust/releases) first
— prebuilt binaries for macOS, Linux, and Windows are published there via
the pipeline described in [Building with GitHub Actions](./ci-github-actions.md).
Building from source is for people who want to audit, modify, or package
the tool themselves.

**Why is this so much harder to cross-compile than a typical Rust CLI tool?**
Two reasons stack together: `eframe`/`winit` need real windowing-system
headers for the *target* OS (not just the host), and the default PGP
library links a C dependency (nettle). Most Rust CLI tools have neither
problem. See [Cross-compiling](./cross-compiling.md) for the workarounds,
or just build natively per-OS via [GitHub Actions](./ci-github-actions.md)
and skip the problem entirely.

**Which crypto backend does the published release actually use?**
Check `Cargo.toml` in the tagged commit for that release — search for
`sequoia-openpgp` and look at its `features`. See
[Dependencies](./dependencies.md#sequoia-openpgp-and-the-nettle-question)
for what the difference means in practice.

**Can I build a smaller binary?**
The release profile already sets `opt-level = 3` and `lto = true` in
`Cargo.toml`, which favors speed over size. For a smaller binary, try
`opt-level = "z"` and `strip = true` instead — trade-off is slightly
slower runtime performance, which matters little for a UI-bound app like
this one.

**Does this project support ARM Linux (Raspberry Pi, etc.)?**
Not out of the box in the current CI matrix — GitHub's Linux runners are
x86_64-only. You can add an `aarch64-unknown-linux-gnu` target yourself
using `cross` (see [Cross-compiling](./cross-compiling.md#option-a-cross-docker-based))
either locally or as an extra matrix leg in CI
(see [Extending the matrix](./ci-github-actions.md#extending-the-matrix)).

**Why isn't the app signed/notarized?**
Signing needs paid developer accounts (Apple) or a code-signing
certificate (Windows) and isn't currently part of this project's
infrastructure. See
[Should I sign my build?](./packaging-formats.md#should-i-sign-my-build)
for what's involved if you want to add it for your own fork or packaging
effort.

**I'm packaging this for a Linux distro's repository — anything I should know?**
Read [Packaging formats](./packaging-formats.md) and
[Building on Linux](./building/linux.md) in full first, particularly the
glibc-version note. Distro packages generally shouldn't vendor a `musl`
static binary if the distro's own toolchain can build a normal
dynamically-linked one — check your distro's packaging guidelines.

**Where do I report a bug in this documentation, specifically?**
Same place as the project itself — open an issue on
[the repository](https://github.com/reality-prod/tbi-rust/issues) and
mention it's a docs issue. This book is versioned alongside the code, so
please mention which version/tag you were reading when something didn't
match reality.

**Is there a Discord/Matrix/mailing list for this project?**
Not documented here — check the repository's own README for current
community links, since those change more often than a build guide should.
