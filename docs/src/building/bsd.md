# Building on BSD (and other alternative operating systems)

## This page currently only applies to **FreeBSD** and **GhostBSD**

> [!WARNING]
> **Limited support.** The Tor Browser Installer doesn't build or install anything automatically on FreeBSD. Nothing on this page has been tested on any other BSD derivative. If you're on OpenBSD, NetBSD, DragonFly, HardenedBSD, or anything else outside Windows/macOS/Linux, none of this is verified for you. If you get something working, open an issue so this page can grow.

Short answer: no, this installer does not support your OS, and it isn't going to for a while. Here's why, and here's what actually moves the needle if you want that to change.

### Why it doesn't work

The installer's entire job is to fetch an official upstream Tor Browser build, verify its signature, and install it. It doesn't compile anything. That means it can only ever support platforms the Tor Project itself ships binaries for, which today is Windows, macOS, and Linux. Nothing else.

That's not a technical limitation I could patch around with more code. There's no official upstream binary sitting on Tor Project's servers for most alternative platforms, so there's nothing for me to point the installer at. If it doesn't exist upstream, there's nothing to download and nothing to verify, and an installer whose whole purpose is "download and verify official releases" has nothing to do.

If your OS is FreeBSD or GhostBSD, your package manager already has something covered separately below.

### Why Tor Project only ships for the big three

This isn't a mystery or a snub. Tor Browser is maintained by a small, chronically overworked team that runs largely on grant funding and volunteer time. They package for Windows, macOS, and Linux because that's where the overwhelming majority of their user base sits, and every additional platform they officially support is permanent ongoing cost. Nobody on that team has spare capacity sitting around waiting for a reason to burn it on a platform with a handful of users. That's resourcing reality, not a value judgment about anyone running something else.

### Maintenance cost, and what it actually means

People tend to picture porting Tor Browser to a new OS as a one-time job: get it compiling, cut a release, done. That's not what the ongoing cost actually is, and it's worth spelling out, because it's the entire reason "just ship a build" isn't a small ask.

**Sandboxing has to actually exist on the target platform.** Tor Browser's security model leans hard on OS-level process isolation — seccomp-bpf on Linux, the sandbox container model on macOS, AppContainer on Windows — to contain a compromised renderer process and to make browser fingerprinting and exploit chains harder to pull off. That isolation isn't a feature Tor Project can bolt on from outside; it has to already exist as a mature, well-tested primitive in the OS itself. A single-user operating system that was never designed around strict process and permission boundaries the way a multi-user Unix was doesn't have that primitive to build on. Shipping an "official" Tor Browser there wouldn't just be extra work, it would be handing users a browser that looks as hardened as the Linux build but isn't, which is arguably worse than no build at all, because it creates false confidence in exactly the tool people are trusting with their safety.

**A young or still-in-development OS is a moving, less-hardened target.** Plenty of hobbyist and alt OS projects are genuinely excellent engineering and still only a couple of decades old, with core subsystems like memory protection, ASLR, or the network stack still being actively hardened rather than finished. That's a completely normal stage for an OS to be in. But it means the ground underneath a Tor Browser build shifts constantly: APIs aren't stable yet, the TLS and crypto libraries available may lag behind what Tor Browser needs, and syscalls or memory-safety guarantees that Tor Browser quietly assumes on Linux/macOS/Windows may not hold yet. Maintaining a build there isn't "compile once," it's "keep re-patching around an OS that hasn't finished hardening itself," indefinitely, for a user base measured in the hundreds.

**Someone has to actually learn the platform, deeply, forever.** Every OS has its own package format, its own release cadence, its own deviations from POSIX assumptions, its own quirks in how it handles threads, sockets, or filesystem permissions. Patching Tor Browser to build and run correctly means understanding all of that well enough to fix it when it breaks — and it will break, every time the OS updates, every time Firefox (which Tor Browser is built on) changes something upstream. That's not a bug fix, that's a permanent, recurring job.

**And sometimes the platform's own community doesn't even want upstream involvement.** FreeBSD is the clearest case of this: it already has a mature Ports collection and `pkg` doing exactly this kind of packaging work, run by maintainers who understand FreeBSD's internals far better than Tor Project ever will from outside. Those maintainers may have very good reasons not to ask for "official" upstream packaging — Tor Project's release process, build tooling, and sandbox assumptions are built around glibc-based Linux and may not map cleanly onto a BSD base system at all. In cases like that, the lack of an official ask isn't neglect from either side. It's two teams rationally staying in their own lane, because forcing Tor Project's build pipeline onto a platform it wasn't designed for could easily produce something worse than what the platform's own maintainers already ship.

Put together: supporting a new platform officially isn't "add a download URL." It's taking on an open-ended commitment to understand that platform's security model, track its instability if it's young, keep up with its own release cycle forever, and do it all with a team that's already stretched thin supporting the three platforms nearly everyone uses. That's the actual cost being asked for, and it's why the bar for "yes, we'll support this" is much higher than it looks from the outside.

### What actually gets a new platform supported

If you want your OS to become an officially supported build target, the ask has to go to Tor Project, not to me — I have zero influence over their roadmap. Realistically, this looks less like a feature request and more like a pitch you'd bring to a resourcing meeting: prove there's a userbase big enough to justify the ongoing cost, and prove someone competent is willing to carry real work.

Things that move this forward:

- **File it where it counts.** Tor Project tracks work on their GitLab (`gitlab.torproject.org`), not on this repo. A ticket here does nothing for you.
- **Bring numbers, not vibes.** "A few of us want this" doesn't beat a maintenance-cost argument. Download counts from your OS's ports/package repo, forum threads, mailing list interest — anything that shows a real, counted audience rather than a handful of people in a Discord.
- **Show up with a build, not just a request.** If your platform's ports/package maintainers already build Tor Browser from source, that's your strongest card — it proves the porting work is solvable and someone's already doing it. Point Tor Project at that existing packaging effort as evidence, and ideally get that maintainer directly into the conversation.
- **Offer maintenance, not a one-time patch.** A build that lands once and then bitrots is worse than no build. If you're petitioning for official support, the pitch needs an answer to "who fixes this when it breaks in six months," because that's the actual cost being asked for.
- **Loop in your OS's own community first.** Coordinated asks from an OS's dev team or package maintainers carry more weight than scattered individual requests. If your platform's own maintainers formally ask Tor Project to collaborate on official support, that reads very differently than isolated bug reports.

None of this is a fast process, and there's a real chance the answer stays "not enough demand to justify it" for a long time. That's the honest tradeoff of running a smaller platform: you get more control and less official support, and the way you get more official support is by making the cost-benefit case yourself to the people who'd have to maintain it.

### What to do right now, today

**FreeBSD / GhostBSD:** check the package manager first, it's usually already there:

```bash
# Check whether it's already packaged
pkg search tor-browser

# Install it if it is
sudo pkg install tor-browser
```

If `pkg` doesn't have it, check the Ports collection directly — packages and ports aren't always in sync.

**Any other alternative OS:** check your own package manager or ports tree the same way before assuming nothing exists. If there's genuinely no build anywhere, your options are building it from source yourself using your platform's own toolchain, or finding your OS's community channels and asking whether anyone's already solved this — a lot of these platforms have small but dedicated packaging communities that know things Tor Project doesn't.

For anything else, see building for [Windows](./windows.md), [macOS](./macos.md), or [Linux](./linux.md).