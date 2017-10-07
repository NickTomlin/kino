[Kino](https://www.wired.com/2011/11/1107wireless-remote-control/) [![Build Status](https://travis-ci.org/NickTomlin/kino.svg?branch=master)](https://travis-ci.org/NickTomlin/kino) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
---
A chrome extension to easily manipulate chrome pages from the comfort of your text editor or OS.

> ⚠️ This is currently an alpha; feel free to use it but don't expect amazing things ⚠️

Usage
---

0. Install kino `npm i kino -g` and run `kino init` to create the [native messaging host](https://developer.chrome.com/apps/nativeMessaging#native-messaging-host)
1. Install the chrome plugin via the [chrome web store](https://chrome.google.com/webstore/detail/kino/gfonelhapmmnblbnniimhkdmnlopaabm)
2. Install an editor plugin like the [vim plugin](https://github.com/nicktomlin/kino.vim) or the CLI via `kino action` directly

By default, there are actions defined for toggling video playback on youtube.com and egghead.io as an example. You can add other domains and define custom actions for them via the options page. Once this is done, you can trigger an action using the client to play the code for that action on an active chrome tab for the corresponding domain.

Todo
---

- [x] spike extension -> native message host
- [x] spike application -> native message host
- [x] spike extension -> content script -> player controls (youtube)
- [x] user defined commands

Troubleshooting
---

There is very light logging available via the event page:

- Open the [background page](chrome-extension://gfonelhapmmnblbnniimhkdmnlopaabm/_generated_background_page.html) (or menu > "more tools" > "extensions" and click "background page")
- Open the console
- hit reload and see what error messages pop up
- attempt to send a kino action `kino action toggle` and see if there is any logging

### Common issues

- have you run `kino init` ?
- Is `node` available at `/usr/local/bin/node`? If not, `ln -s <path to node> /usr/local/bin/node` and disable/enable the extension
  - alas, chrome cannot use `/usr/bin/env node` when launching the native extension host

Contributing
---

1. Fork repo
2. Clone down repo
2. In chrome, go to `tools > extensions`
3. Click "load unpacked extension"
4. Navigate to the repository directory and load it
5. Run `./bin/kino init` to install the native messaging host
6. Reload the extension
