/* global Storage */
const port = chrome.runtime.connectNative('com.nicktomlin.kino')

function pageAction (action, message) {
  chrome.tabs.query({active: true}, async (tabs) => {
    if (!tabs.length) { console.info('No tabs found; you may have another window (like an inspector) on top of the video tab'); return }
    if (chrome.runtime.lastError) {
      console.log('Error querying tabs', tabs, chrome.runtime.lastError.message)
    }

    const hostname = new URL(tabs[0].url).hostname
    const mappings = await Storage.getMappingsWithDefaults()

    const code = (mappings[hostname] && mappings[hostname][action]) || mappings[Storage.ALL_HOSTS][action]
    if (code) {
      chrome.tabs.executeScript(tabs[0].id, { code })
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
