const allHosts = '<all-hosts>'
const defaultMappings = {
  'www.youtube.com': {
    toggle: `document.querySelector('.ytp-play-button').click()`
  },
  'egghead.io': {
    toggle: `document.querySelector('.bmpui-ui-playbacktogglebutton').click()`
  },
  [allHosts]: {
    test: `
    const t = document.createElement('h1')
    t.textContent = 'inserted'
    document.body.prepend(t)
    `
  }
}

function getMappings () {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('mappings', (data) => {
      if (!data || !data.mappings) {
        chrome.storage.local.set({ mappings: defaultMappings })
        return resolve(defaultMappings)
      }

      resolve(data.mappings)
    })
  })
}

const port = chrome.runtime.connectNative('com.nicktomlin.kino')

function pageAction (action, message) {
  chrome.tabs.query({active: true}, async (tabs) => {
    if (!tabs.length) { console.info('No tabs found; you may have another window (like an inspector) on top of the video tab'); return }
    if (chrome.runtime.lastError) {
      console.log('Error querying tabs', tabs, chrome.runtime.lastError.message)
    }

    const hostname = new URL(tabs[0].url).hostname
    const mappings = await getMappings()

    const code = (mappings[hostname] && mappings[hostname][action]) || mappings[allHosts][action]
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
