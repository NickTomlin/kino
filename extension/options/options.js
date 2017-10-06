/* global Prism, Storage */
const { Component, h, render } = window.preact

function codeToMarkup (code) {
  return Prism.highlight(
    Prism.plugins.NormalizeWhitespace.normalize(code),
    Prism.languages.javascript
  )
}

function Action ({ actionName, code, onActionRemove }) {
  const __html = codeToMarkup(code)

  return h('div', { className: 'action' },
    h('p', { className: 'action-title' }, actionName),
    h('button', { className: 'form-control', onClick: onActionRemove }, '- Remove'),
    h('pre', { className: 'code' }, h('code', {dangerouslySetInnerHTML: { __html }}))
  )
}

class AddAction extends Component {
  clearInputs () {
    this.textarea.value = ''
    this.input.value = ''
  }

  create () {
    this.props.createAction(this.input.value, this.textarea.value)
    this.clearInputs()
  }

  cancel () {
    this.clearInputs()
    this.props.cancelCreateAction()
  }

  render () {
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
        cols: 60
      }),
      h('div', {},
        h('button', { onClick: this.create.bind(this) }, 'Add'),
        h('button', { onClick: this.cancel.bind(this) }, 'Cancel')
      )
    )
  }
}

class Actions extends Component {
  renderActions () {
    const { hostname, actions, onActionRemove } = this.props
    return Object.keys(actions)
      .map(actionName => h(Action, {
        actionName,
        onActionRemove: () => onActionRemove(hostname, actionName),
        code: actions[actionName]
      }))
  }

  render () {
    const {
      editing,
      addAction
    } = this.props

    if (editing) { return null }

    return h('div', {},
      this.renderActions(),
      h('button', {
        className: 'form-control',
        onClick: addAction
      }, '+ Add action')
    )
  }
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

  removeHost () {
    this.props.removeHost(this.props.hostname)
  }

  render () {
    const { hostname, actions, onActionRemove, onHostRemove } = this.props
    const { editing } = this.state

    return (
      h('div', { className: 'host' },
        h('header', { className: 'hostname' },
        h('span', { className: 'hostname-title' }, hostname),
        h('button', {
          className: 'form-control',
          onClick: () => onHostRemove(hostname)
        }, '- Remove'),
        editing
          ? h(AddAction, {
            createAction: this.onActionChange.bind(this, hostname),
            cancelCreateAction: () => { this.setState({ editing: false }) }
          }) : null
        ),
        h(Actions, {
          hostname,
          editing,
          actions,
          onActionRemove,
          addAction: this.addAction.bind(this)
        })
      )
    )
  }
}

function Hostnames ({
  mappings,
  onActionChange,
  onActionRemove,
  onHostRemove
}) {
  return h('div', {}, Object.keys(mappings).map(hostname => {
    return h(Host, {
      hostname,
      actions: mappings[hostname],
      onActionChange,
      onActionRemove,
      onHostRemove
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
    const mappings = await Storage.getMappingsWithDefaults()
    this.setState({ mappings })
  }

  async onHostAdd (hostname) {
    const currentMappings = await Storage.get('mappings')
    if (hostname in currentMappings) { return }
    const mappings = { ...currentMappings, [hostname]: {} }

    await Storage.set({ mappings })
    this.setState({ mappings }, () => (
      // this is a punt around the bad UX we currently have with adding hosts
      // (e.g. they are wayyy out of frame with multiple hosts)
      // in the future we'll hopefully have a more ergonomic flow that will remove the
      // need for this
      [...(document.querySelectorAll('.host'))]
      .filter(ele => (
        ele.querySelector('.hostname-title').textContent === hostname)
      )
      .forEach(ele => ele.scrollIntoView())
    ))
  }

  async onActionChange (hostname, actionName, code) {
    const mappings = await Storage.get('mappings')
    mappings[hostname] = {
      ...mappings[hostname],
      [actionName]: code
    }

    await Storage.set({ mappings })
    this.setState({ mappings })
  }

  async onActionRemove (hostname, actionName) {
    const mappings = await Storage.get('mappings')
    delete mappings[hostname][actionName]

    await Storage.set({ mappings })
    this.setState({ mappings })
  }

  async onHostRemove (hostname) {
    const mappings = await Storage.get('mappings')
    delete mappings[hostname]

    await Storage.set({ mappings })
    this.setState({ mappings })
  }

  render () {
    const { mappings } = this.state

    if (!mappings) { return null }

    return h('div', {},
      h(AddHost, { onSubmit: this.onHostAdd.bind(this) }),
      h(Hostnames, {
        mappings,
        onHostRemove: this.onHostRemove.bind(this),
        onActionChange: this.onActionChange.bind(this),
        onActionRemove: this.onActionRemove.bind(this)
      })
    )
  }
}

render(h(Options), document.getElementById('app'))
