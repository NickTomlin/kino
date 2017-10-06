const ALL_HOSTS = '<all-hosts>'
const defaultMappings = {
  'www.youtube.com': {
    toggle: `document.querySelector('.ytp-play-button').click()`
  },
  'egghead.io': {
    toggle: `document.querySelector('.bmpui-ui-playbacktogglebutton').click()`
  },
  [ALL_HOSTS]: {}
}

class Storage {
  static async getMappingsWithDefaults () {
    let mappings = await Storage.get('mappings')

    if (!mappings) {
      await Storage.set({ mappings: defaultMappings })
      return defaultMappings
    }

    return mappings
  }

  static set (data) {
    return new Promise(function (resolve, reject) {
      chrome.storage.sync.set(data, () => {
        if (!chrome.runtime.lastError) {
          resolve(data)
        } else {
          reject(chrome.runtime.lastError)
        }
      })
    })
  }

  static get (key) {
    return new Promise(function (resolve, reject) {
      chrome.storage.sync.get(key, (data) => {
        if (!chrome.runtime.lastError) {
          resolve(data[key])
        } else {
          reject(chrome.runtime.lastError)
        }
      })
    })
  }
}

Storage.ALL_HOSTS = ALL_HOSTS
