const hosts = {
  'www.youtube.com': {
    toggle () {
      document.querySelector('.ytp-play-button').click()
    }
  },
  'egghead.io': {
    toggle () {
      document.querySelector('.bmpui-ui-playbacktogglebutton').click()
    }
  }
}

function pageAction (action) {
  const host = hosts[window.location.hostname]
  if (!host || !host[action]) { return }

  host[action]()
}

chrome.runtime.onMessage.addListener((message, _sender) => {
  pageAction(message.action)
})
