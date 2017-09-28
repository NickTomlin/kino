// this script interacts with the page itself
// it is responsible for listening to messages from the extension and then interacting with a videoplayer
//
//
// we _may_ be able to get away with just using the browserAction api:

// chrome.browserAction.onClicked.addListener(function(tab) {
//   chrome.tabs.executeScript({
//     code: 'document.body.style.backgroundColor="red"'
//   });
// });
// OR chrome.tabs.executeScript(null, {file: 'src/content.js'});
