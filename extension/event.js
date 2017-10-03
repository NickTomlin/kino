// this page listens for messages from the native messaging bus
// and sends info to a content script on the current page
// we can probably use a pageAction of some sort to show whether or not it is enabled

const port = chrome.runtime.connectNative('com.nicktomlin.kino')

function pageAction (action, message) {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    if (!tabs.length) { console.info('No tabs found; you may have another window (like an inspector) on top of the video tab'); return }
    if (chrome.runtime.lastError) {
      console.log('Error querying tabs', tabs, chrome.runtime.lastError.message)
    }

    chrome.tabs.sendMessage(tabs[0].id, {
      action,
      message
    })
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
