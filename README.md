[Kino](https://www.wired.com/2011/11/1107wireless-remote-control/))
---
A chrome extension to easily control videos from your text editor: useful for coding along to tutorials or lectures.

:warning: I'm spiking this out so nothing works right now; sorry to get your hopes up :warning:

Usage
---

1. Install the [vim plugin](https://github.com/nicktomlin/kino.vim)
  - This will ask you to install the kino client/server: `npm i kino -g`
2. Install this plugin via the [chrome web store (link to come)]()

Todo
---

- [x] spike extension -> native message host
- [ ] spike application -> native message host
- [ ] spike extension -> content script -> player controls (youtube)

_SCIENCE FICTION:_

- [] execute user provided commands

Contributing
---

1. Fork repo
2. Clone down repo
2. In chrome, go to `tools > extensions`
3. Click "load unpacked extension"
4. Navigate to the repository directory and load it
4. Note the extension id in Menu > More Tools > Extensions
5. Edit the extensions url in `host/com.nicktomlin.kino.json` to permit that extension id
6. Run `sh host/install.sh` to install the native message host in the appropriate directory
7. That's as far as i've gotten.
