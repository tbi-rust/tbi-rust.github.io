# Building on BSD (and other alternative operating systems)

## This page currently only applies to **FreeBSD** and **GhostBSD**

> [!WARNING]
> **Limited support.** The Tor Browser Installer doesn't build or install anything automatically on FreeBSD. Nothing on this page has been tested on any other BSD derivative. If you're on OpenBSD, NetBSD, DragonFly, HardenedBSD, Haiku, SerenityOS, ReactOS, or anything else outside Windows/macOS/Linux, none of this is verified for you. If you get something working, open an issue so this page can grow.

Short answer: no, this installer does not support your OS, and it isn't going to for a while. Here's why, and here's what actually moves the needle if you want that to change.

### Why it doesn't work

The installer's entire job is to fetch an official upstream Tor Browser build, verify its signature, and install it. It doesn't compile anything. That means it can only ever support platforms the Tor Project itself ships binaries for, which today is Windows, macOS, and Linux. Nothing else.

That's not a technical limitation I could patch around with more code. There's no FreeBSD binary, no Haiku binary, no SerenityOS or ReactOS binary sitting on Tor Project's servers for me to point the installer at. If it doesn't exist upstream, there's nothing to download and nothing to verify, and an installer whose whole purpose is "download and verify official releases" has nothing to do.

If your OS is FreeBSD or GhostBSD, your package manager already has something covered separately below.

### Why Tor Project only ships for the big three

This isn't a mystery or a snub. Tor Browser is maintained by a small, chronically overworked team that runs largely on grant funding and volunteer time. They package for Windows, macOS, and Linux because that's where the overwhelming majority of their user base sits, and every additional platform they officially support is permanent ongoing cost: build infrastructure, sandboxing work, security patches, QA, and someone answering bug reports for it forever. Nobody on that team has spare capacity sitting around waiting for a reason to burn it on a platform with a handful of users. That's just resourcing reality, not a value judgment about FreeBSD or Haiku or anyone running them.

Which means the blocker isn't technical. It's that nobody has made the case to Tor Project that shipping for your platform is worth the ongoing maintenance cost.

### What actually gets a new platform supported

If you want your OS to become an officially supported build target, the ask has to go to Tor Project, not to me — I have zero influence over their roadmap. Realistically, this looks less like a feature request and more like a pitch you'd bring to a resourcing meeting: prove there's a userbase big enough to justify the ongoing cost, and prove someone competent is willing to carry real work.

Things that move this forward:

- **File it where it counts.** Tor Project tracks work on their GitLab (`gitlab.torproject.org`), not on this repo. A ticket here does nothing for you.
- **Bring numbers, not vibes.** "A few of us want this" doesn't beat a maintenance-cost argument. Download counts from your OS's ports/package repo, forum threads, mailing list interest — anything that shows a real, counted audience rather than three people in a Discord.
- **Show up with a build, not just a request.** If your platform's ports/package maintainers already build Tor Browser from source (FreeBSD's do), that's your strongest card — it proves the porting work is solvable and someone's already doing it. Point Tor Project at that existing packaging effort as evidence, and ideally get that maintainer directly into the conversation.
- **Offer maintenance, not a one-time patch.** A build that lands once and then bitrots is worse than no build. If you're petitioning for official support, the pitch needs an answer to "who fixes this when it breaks in six months," because that's the actual cost being asked for.
- **Loop in your OS's own community first.** Coordinated asks from an OS's dev team or package maintainers carry more weight than scattered individual requests. If FreeBSD's own maintainers formally ask Tor Project to collaborate on official support, that reads very differently than isolated bug reports.

None of this is a fast process, and there's a real chance the answer stays "not enough demand to justify it" for a long time. That's the honest tradeoff of running a smaller platform: you get more control and less official support, and the way you get more official support is by making the cost-benefit case yourself to the people who'd have to maintain it.

### What to do right now, today

**FreeBSD / GhostBSD:** check the package manager first, it's usually already there:

```
# Check whether it's already packaged
pkg search tor-browser

# Install it if it is
sudo pkg install tor-browser
```

If `pkg` doesn't have it, check the Ports collection directly — packages and ports aren't always in sync.

**Any other alternative OS:** check your own package manager or ports tree the same way before assuming nothing exists. If there's genuinely no build anywhere, your options are building it from source yourself using your platform's own toolchain, or finding your OS's community channels and asking whether anyone's already solved this — a lot of these platforms have small but dedicated packaging communities that know things Tor Project doesn't.

For anything else, see building for [Windows](./windows.md), [macOS](./macos.md), or [Linux](./linux.md).