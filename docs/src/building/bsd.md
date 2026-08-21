# Building on BSD

## Note this will only work with **FreeBSD** and **GhostBSD**

> [!WARNING]
> **Limited BSD Support**
> Currently, the Tor Browser Builder project does not officially support FreeBSD or other BSD derivatives out of the box. The instructions on this page are provided as a community effort and have only been verified to work on **FreeBSD** and **GhostBSD**. 

If you are a BSD user looking to run the Tor Browser, you might be wondering why our builder doesn't seamlessly support your operating system. We understand the frustration, and we want to be transparent about why the BSD ecosystem presents unique challenges for this project.

### Why doesn't the Tor Browser Builder support FreeBSD natively?

There are two primary reasons why BSD platforms are not fully integrated into our automated builder:

> [!NOTE]
> **1. It's usually packaged for you**
> The BSD philosophy often revolves around centralized, highly curated package management systems (like FreeBSD's `pkg` and Ports collection). In many cases, community maintainers already package a version of the Tor Browser or the core Tor daemon for your system. Because BSD users typically rely on these native package managers to resolve complex dependencies, a third-party automated builder can easily conflict with your system's native environment.

> [!NOTE]
> **2. You have to compile it from source**
> Unlike Linux, Windows, or macOS, the Tor Project does not distribute pre-compiled, standalone binaries for BSD operating systems. Because there is no official binary to simply download, extract, and configure, installing the Tor Browser on BSD requires compiling the entire browser—a modified version of Mozilla Firefox—directly from source. This is a massive, time-consuming process that requires a deeply customized build environment, which falls outside the scope of our automated builder tool.

### The Official Stance of The Tor Project

> [!IMPORTANT]
> **Awaiting Official Support**
> Unless [Tor Project Inc.](https://www.torproject.org) officially releases and maintains BSD as a supported platform with pre-compiled binaries, the Tor Browser Builder will not be able to offer automated support for BSDs. Our tool relies on upstream binaries, and without them, the heavy lifting of source compilation is left entirely to the user.

### A Sincere Apology

We deeply apologize in advance for this inconvenience. We have profound respect for the BSD community and the focus on privacy and security that BSD users bring to the table. However, until upstream support changes, you will need to rely on the FreeBSD Ports tree (e.g., `www/tor-browser`) or manual source compilation to access the Tor network via the browser.

> [!TIP]
> **Workaround for FreeBSD/GhostBSD users**
> If you still want to proceed on FreeBSD or GhostBSD, we highly recommend checking your package manager first:
> ```bash
> pkg search tor-browser
> ```
> Alternatively, look into the Ports collection under `/usr/ports/www/tor-browser` for the community-maintained version.