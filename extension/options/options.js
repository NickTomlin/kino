/* global Prism */
const { Component, h, render } = window.preact

function codeToMarkup (code) {
  return Prism.highlight(
    Prism.plugins.NormalizeWhitespace.normalize(code),
    Prism.languages.javascript
  )
}

function Action ({ actionName, code }) {
  const __html = codeToMarkup(code)

  return h('div', { className: 'action' },
    h('p', { className: 'action-title' }, actionName),
    h('pre', { className: 'code' }, h('code', {dangerouslySetInnerHTML: { __html }}))
  )
}

function Host ({ hostname, actions, onActionAdd }) {
  const renderedActions = Object.keys(actions)
    .map(actionName => h(Action, {
      actionName, code: actions[actionName]
    }))

  return h('div', { className: 'host' },
    h('header', { className: 'hostname' },
      h('span', { className: 'hostname-title' }, hostname),
      h('button', {onClick: onActionAdd}, '+ Add action')
    ),
    renderedActions
  )
}

function Hostnames ({ mappings }) {
  return h('div', {}, Object.keys(mappings).map(hostname => {
    return h(Host, {
      hostname,
      actions: mappings[hostname]
    })
  }))
}

class AddHost extends Component {
  constructor () {
    super()
    this.state.valid = true
  }

  onSubmit () {
    try {
      let url = new URL(this.input.value)
      this.props.onSubmit(url.hostname)
    } catch (e) {
      this.setState({ valid: false, error: e.toString() })
    }
  }

  onKeyup (e) {
    if (e.key === 'Enter') {
      this.onSubmit()
    } else {
      this.setState({ valid: true, error: null })
    }
  }

  render () {
    return h('div', null,
      h('input', {
        style: this.state.valid ? '' : `border: 1px solid red`,
        placeholder: 'https://example.com',
        onKeyup: this.onKeyup.bind(this),
        ref: c => (this.input = c)
      }, null),
      h('button', { onClick: this.onSubmit.bind(this) }, '+ Add Host'),
      this.state.error ? h('span', {}, this.state.error) : null
    )
  }
}

class Options extends Component {
  constructor () {
    super()
    this.state.mappings = null
  }

  componentDidMount () {
    chrome.storage.local.get('mappings', ({ mappings }) => {
      if (!mappings) { return false }
      this.setState({ mappings })
    })
  }

  onHostAdd (hostname) {
    chrome.storage.local.get('mappings', (data) => {
      if (hostname in data.mappings) {
        return
      }
      const mappings = { ...data.mappings, [hostname]: {} }

      chrome.storage.local.set({
        mappings
      }, () => {
        if (!chrome.runtime.lastError) {
          this.setState({ mappings })
        }
      })
    })
  }

  render () {
    const { mappings } = this.state

    if (!mappings) { return null }

    return h('div', {},
      h(Hostnames, { mappings }),
      h(AddHost, { onSubmit: this.onHostAdd.bind(this) })
    )
  }
}

render(h(Options), document.getElementById('app'))
