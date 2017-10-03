[Kino](https://www.wired.com/2011/11/1107wireless-remote-control/)
---
A chrome extension to easily manipulate chrome pages from the comfort of your text editor or OS.

> ⚠️ This is currently an alpha; feel free to use it but don't expect amazing things ⚠️

Usage
---

0. Install kino `npm i kino -g` and run `kino init` to create the [native messaging host](https://developer.chrome.com/apps/nativeMessaging#native-messaging-host)
1. Install the chrome plugin via the [chrome web store](https://chrome.google.com/webstore/detail/kino/gfonelhapmmnblbnniimhkdmnlopaabm)
2. Install an editor plugin like the [vim plugin](https://github.com/nicktomlin/kino.vim) or the CLI via `kino action` directly

Currently, there is only one supported action for `egghead.io` and `youtube`: `toggle`. All this does is toggle the 'play' button. A simple start :)

Todo
---

- [x] spike extension -> native message host
- [x] spike application -> native message host
- [x] spike extension -> content script -> player controls (youtube)
- [ ] scroll back -> forward

_SCIENCE FICTION:_

- [ ] execute user provided commands

Contributing
---

1. Fork repo
2. Clone down repo
2. In chrome, go to `tools > extensions`
3. Click "load unpacked extension"
4. Navigate to the repository directory and load it
4. Note the extension id in Menu > More Tools > Extensions
5. Edit the extensions url in `host/com.nicktomlin.kino.json` to permit that extension id
6. Run `./bin/kino init` to install the native messaging host
7. Reload the extension
