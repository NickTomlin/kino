/* global Prism */
const { Component, h, render } = window.preact

function storageSet (data) {
  return new Promise(function (resolve, reject) {
    chrome.storage.local.set(data, () => {
      if (!chrome.runtime.lastError) {
        resolve(data)
      } else {
        reject(chrome.runtime.lastError)
      }
    })
  })
}

function storageGet (key) {
  return new Promise(function (resolve, reject) {
    chrome.storage.local.get(key, (data) => {
      if (!chrome.runtime.lastError) {
        resolve(data[key])
      } else {
        reject(chrome.runtime.lastError)
      }
    })
  })
}

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

function AddAction ({ createAction, cancelCreateAction }) {
  return h('div', {},
    h('input', {
      style: 'display: block',
      ref: (c) => (this.input = c),
      placeholder: 'Action Name'
    }),
    h('textarea', {
      ref: (c) => (this.textarea = c),
      placeholder: 'document.body.style.color = "red"',
      rows: 5,
      cols: 50
    }),
    h('div', null,
      h('button', {
        onClick: () => {
          createAction(this.input.value, this.textarea.value)
          this.textarea.value = ''
          this.input.value = ''
        }
      }, 'Add'),
      h('button', {
        onClick: () => {
          this.textarea.value = ''
          this.input.value = ''
          cancelCreateAction()
        }
      }, 'Cancel')
    )
  )
}

class Host extends Component {
  constructor () {
    super()
    this.editing = false
  }

  onActionChange (hostname, actionName, code) {
    this.setState({ editing: false })
    this.props.onActionChange(hostname, actionName, code)
  }

  addAction () {
    this.setState({ editing: true })
  }

  render () {
    const { hostname, actions } = this.props
    const { editing } = this.state
    const renderedActions = Object.keys(actions)
      .map(actionName => h(Action, {
        actionName,
        code: actions[actionName]
      }))

    return h('div', { className: 'host' },
      h('header', { className: 'hostname' },
        h('span', { className: 'hostname-title' }, hostname),
        h('button', {onClick: this.addAction.bind(this)}, '+ Add action'),
        editing
        ? h(AddAction, {
          createAction: this.onActionChange.bind(this, hostname),
          cancelCreateAction: () => { this.setState({ editing: false }) }
        }) : null
      ),
      renderedActions
    )
  }
}

function Hostnames ({ mappings, onActionChange }) {
  return h('div', {}, Object.keys(mappings).map(hostname => {
    return h(Host, {
      hostname,
      actions: mappings[hostname],
      onActionChange
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
      this.input.value = ''
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

  async componentDidMount () {
    const mappings = await storageGet('mappings')
    if (!mappings) { return false }
    this.setState({ mappings })
  }

  async onHostAdd (hostname) {
    const currentMappings = await storageGet('mappings')
    if (hostname in currentMappings) { return }
    const mappings = { ...currentMappings, [hostname]: {} }

    await storageSet({ mappings })
    this.setState({ mappings })
  }

  async onActionChange (hostname, actionName, code) {
    const mappings = await storageGet('mappings')
    mappings[hostname] = {
      ...mappings[hostname],
      [actionName]: code
    }

    await storageSet({ mappings })
    this.setState({ mappings })
  }

  render () {
    const { mappings } = this.state

    if (!mappings) { return null }

    return h('div', {},
      h(AddHost, { onSubmit: this.onHostAdd.bind(this) }),
      h(Hostnames, { mappings, onActionChange: this.onActionChange.bind(this) })
    )
  }
}

render(h(Options), document.getElementById('app'))
