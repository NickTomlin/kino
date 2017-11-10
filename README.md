[Kino](https://www.wired.com/2011/11/1107wireless-remote-control/) [![Build Status](https://travis-ci.org/NickTomlin/kino.svg?branch=master)](https://travis-ci.org/NickTomlin/kino) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
---
A chrome extension to easily manipulate chrome pages from the comfort of your text editor or OS.

Usage
---

0. Install kino `npm i kino -g` and run `kino init` to create the [native messaging host](https://developer.chrome.com/apps/nativeMessaging#native-messaging-host)
1. Install the chrome plugin via the [chrome web store](https://chrome.google.com/webstore/detail/kino/gfonelhapmmnblbnniimhkdmnlopaabm)
2. Install an editor plugin like the [vim plugin](https://github.com/nicktomlin/kino.vim) or the CLI via `kino action` directly

By default, there are actions defined for toggling video playback on youtube.com and egghead.io as an example. You can add other domains and define custom actions for them via the options page. Once this is done, you can trigger an action using the client to play the code for that action on an active chrome tab for the corresponding domain.

Here's a quick start video to help you get up and running: 

[![Kino Quick Start](https://img.youtube.com/vi/5KL63mD229c/0.jpg)](https://www.youtube.com/watch?v=5KL63mD229c)

Todo
---

- [x] spike extension -> native message host
- [x] spike application -> native message host
- [x] spike extension -> content script -> player controls (youtube)
- [x] user defined commands
- [x] Figure out a more universal away to do pathing for node in host

### Niceties:

- [ ] Page action that allows you to add a host/action from the current page
- [ ] Local storage based logging for troubleshooting
- [ ] Pass metadata though action messages?

Troubleshooting
---

There's currently not a great way to troubleshoot Kino issues without installing the extension unpacked. There are a few things you can do without going into Dev mode:

### Common issues

- have you installed `kino` globally and run `kino init` ?
- Is `node` available at `/usr/local/bin/node`? If not, `ln -s <path to node> /usr/local/bin/node` and disable/enable the extension
  - alas, chrome cannot use `/usr/bin/env node` when launching the native extension host

Contributing
---

1. Fork repo
2. Clone down repo
2. In chrome, go to `tools > extensions`
3. Click "load unpacked extension"
4. Navigate to the repository directory and load it
5. Take note of the "id: <string>" under the loaded extension and add it to the `allowed_origins` array in `host/com.nicktomlin.kino.json`
5. Run `./bin/kino init` to install the native messaging host
6. Reload the extension

There is very light logging available via the background page:

- Open the [background page](chrome-extension://gfonelhapmmnblbnniimhkdmnlopaabm/_generated_background_page.html) (or menu > "more tools" > "extensions" and click "background page")
- Open the console
- hit reload and see what error messages pop up
- attempt to send a kino action `kino action toggle` and see if there is any logging
