Remote
---
A chrome extension to easily control videos from your text editor: useful for coding along to tutorials or lectures.

:warning: I'm spiking this out so nothing works right now; sorry to get your hopes up :warning:

Usage
---

1. Install this plugin via the [chrome web store (link to come)]()

**OR**

1. Clone this repo
2. In chrome, go to `tools > extensions`
3. Click "load unpacked extension"
4. Navigate to the repository directory and load it

Todo
---

- [x] spike extension -> native message host
- [ ] spike application -> native message host
- [ ] spike extension -> content script -> player controls (youtube)

Contributing
---

1. Fork repo
2. Clone down repo
3. Load the extension (2nd part of usage instructions above)
4. Note the extension id in Menu > More Tools > Extensions
5. Edit the extensions url in `host/com.nicktomlin.remote.json` to permit that extension id
6. Run `sh host/install.sh` to install the native message host in the appropriate directory
7. That's as far as i've gotten.
