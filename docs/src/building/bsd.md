# Building on BSD

## Note this will only work with **FreeBSD**, and **GhostBSD**

> [!WARNING]
> **Limited Support:** The Tor Browser builder doesn't currently support FreeBSD automatically. Any manual instructions or workarounds discussed on this page will only work with FreeBSD and GhostBSD. Other BSD derivatives are completely unsupported at this time.

If you are a BSD/Alt OS user looking to run the Tor Browser, you might be wondering why our builder doesn't seamlessly support your operating system out of the box. We understand the frustration, and we want to be completely transparent about why the BSD ecosystem presents unique challenges for this project.

### Why Doesn't the Builder Support non-Linux/Windows/Mac Natively?

There are two primary reasons why other platforms are not fully integrated into our automated builder at this time:

**1. It's either packaged for you.**
The BSD philosophy revolves around centralized, highly curated package management systems (like FreeBSD's `pkg` utility and the Ports collection). Dedicated community maintainers already do the heavy lifting to patch and package the Tor Browser specifically for your system. Because BSD users typically rely on these native package managers, a third-party automated builder can easily conflict with your system's environment. 

**2. You have to compile it from source.**
Unlike Windows, macOS, or Linux, there is no pre-built, ready-to-use release of the Tor Browser provided by upstream developers for  your platform. Because there is no official binary for our builder to download and configure, getting the Tor Browser on BSD requires compiling the entire browser directly from source code. This is a massive, resource-intensive process that falls far outside the scope of a lightweight installer.

### The Official Stance on Alternative OSs

Unless Tor Project Inc releases those operating systems  as an official platform, BSDs will not be supported. I apologize in advance. 

I have profound respect for the alternative operating system  community and the shared focus on privacy and open-source software, but our tool relies entirely on pulling official, verified upstream releases. Without those binaries, the heavy lifting of source compilation must be left to the operating system's community maintainers.

### What should you do instead?

If you are on FreeBSD or GhostBSD, we highly recommend using the community-maintained packages rather than trying to compile from scratch yourself. You can usually find the Tor Browser in your package manager:

```bash
# Check for the package using pkg
pkg search tor-browser

# Install via pkg (if available)
sudo pkg install tor-browser
```
If you aren't, well...good luck.
