/* eslint-env mocha */
/* global browser, $, $$ */

const assert = require('assert')
const defaultHostPrefix = '.host:last-child'

async function createAction ({prefix = defaultHostPrefix} = {}) {
  const actionName = `action-${Date.now()}`
  // unfortunately chaining selectors does not seem to work with async/await
  await browser.click(`${prefix} .add-action`)
  await browser.setValue(`${prefix} .action-name`, actionName)
  await browser.setValue(`${prefix} .action-code`, `document.body.style.color = 'red'`)
  await browser.click(`${prefix} .confirm-action-add`)

  return actionName
}

describe('Kino: chrome extension', () => {
  let extensionId = null

  before(async () => {
    await browser
      .url('chrome://extensions')

    const id = await browser.selectorExecute(['.extension-details'], (results) => {
      return results.find((result) => {
        return /Kino/.test(result.querySelector('.extension-title').textContent)
      })
      .querySelector('.extension-id').textContent.trim()
    })

    assert(id, 'Could not find extension id')
    extensionId = id
  })

  beforeEach(async () => {
    await browser.url(`chrome-extension://${extensionId}/options/options.html`)
  })

  it('has an options page', async () => {
    return browser.getText('h2=Hosts')
  })

  it('allows a user to add a host', async () => {
    const newHostname = 'www.biz.com'
    // TODO: classes to make this more specific
    await $('.add-host-input')
      .setValue(`https://${newHostname}`)
      .keys('Enter')
    const text = await browser.getText('.hostname-title')

    assert(text, newHostname)
  })

  it('allows a user to add an action to a host', async () => {
    const actionName = await createAction()
    const newActionName = await browser.getText(`${defaultHostPrefix} .action-title`)

    assert.equal(newActionName[1], actionName)
  })

  it('allows a user to remove an action from a host', async () => {
    await createAction()
    const oldElements = await browser.elements(`${defaultHostPrefix} .action`)
    await browser.click(`${defaultHostPrefix} .action .remove-action`)
    const newElements = await browser.elements(`${defaultHostPrefix} .action`)

    assert(newElements.value.length === oldElements.value.length - 1)
  })
})
