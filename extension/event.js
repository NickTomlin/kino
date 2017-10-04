// this page listens for messages from the native messaging bus
// we need to decide on the syntax for these commands

/*
Perhaps?

hosts = {
  [hostname]: { [action]: 'code' }
  '*': { [action]: 'code' }
}

how are we going to store them?

is there a way to protect against cross site scripting?
*/
const hosts = {
  'www.youtube.com': {
    toggle () {
      return `
        document.querySelector('.ytp-play-button').click()
      `
    }
  },
  'egghead.io': {
    toggle () {
      return `document.querySelector('.bmpui-ui-playbacktogglebutton').click()`
    }
  }
}

const port = chrome.runtime.connectNative('com.nicktomlin.kino')

function pageAction (action, message) {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    if (!tabs.length) { console.info('No tabs found; you may have another window (like an inspector) on top of the video tab'); return }
    if (chrome.runtime.lastError) {
      console.log('Error querying tabs', tabs, chrome.runtime.lastError.message)
    }
    const hostname = new URL(tabs[0].url).hostname
    const host = hosts[hostname]

    if (host && host[action]) {
      chrome.tabs.executeScript(tabs[0].id, { code: host[action](message) })
    }
  })
}

port.onMessage.addListener((rawMessage) => {
  let message = {}
  try { message = JSON.parse(rawMessage) } catch (e) {}
  console.info('Received native message', message)

  if (message.action) { pageAction(message.action, message) }
})

port.onDisconnect.addListener(() => {
  console.log('Disconnected from  native port:', chrome.runtime.lastError.message)
})
