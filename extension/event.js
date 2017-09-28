// this page listens for messages from the native messaging bus
// and sends info to a content script on the current page
// we can probably use a pageAction of some sort to show whether or not it is enabled

let counter = 0
const port = chrome.runtime.connectNative('com.nicktomlin.remote');

port.onMessage.addListener(function(msg) {
  console.log('Received Native Message', msg)
});

port.onDisconnect.addListener(function() {
  console.log('Disconnected', chrome.runtime.lastError.message);
});

function sendMessage () {
  message = {'text': `Hi ${++counter}`};
  port.postMessage(message)
}

setInterval(function () {
  sendMessage()
}, 1000)
