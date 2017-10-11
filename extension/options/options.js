/* global Prism, Storage */
const { Component, h, render } = window.preact

function codeToMarkup (code) {
  return Prism.highlight(
    Prism.plugins.NormalizeWhitespace.normalize(code),
    Prism.languages.javascript
  )
}

function Action ({
  actionName,
  code,
  onActionRemove,
  onActionEdit
}) {
  const __html = codeToMarkup(code)

  return h('div', { className: 'action' },
    h('p', { className: 'action-title' }, actionName),
    h('button', {
      className: 'form-control edit-action',
      onClick: () => onActionEdit(actionName, code)
    }, '~ Edit'),
    h('button', {
      className: 'form-control remove-action',
      onClick: onActionRemove
    }, '- Remove'),
    h('pre', { className: 'code' }, h('code', {dangerouslySetInnerHTML: { __html }}))
  )
}

class ActionEditor extends Component {
  constructor (props) {
    const {
      actionName,
      actionCode
    } = props

    super()

    this.state = {
      actionName,
      actionCode
    }
  }

  clearInputs () {
    this.setState({
      actionName: '',
      actionCode: ''
    })
  }

  create () {
    const { actionName, actionCode } = this.state
    const originalActionName = this.props.actionName
    this.props.createAction(actionName, originalActionName, actionCode)
    this.clearInputs()
  }

  cancel () {
    this.clearInputs()
    this.props.cancelCreateAction()
  }

  handleChange (key, event) {
    this.setState({
      [key]: event.target.value
    })
  }

  render () {
    const { actionName, actionCode } = this.state
    return h('div', { className: 'add-action-inputs' },
      h('input', {
        style: 'display: block',
        value: actionName,
        onChange: this.handleChange.bind(this, 'actionName'),
        defaultValue: actionName,
        className: 'action-name',
        placeholder: 'Action Name'
      }),
      h('textarea', {
        className: 'action-code',
        onChange: this.handleChange.bind(this, 'actionCode'),
        value: actionCode,
        placeholder: 'document.body.style.color = "red"',
        rows: 5,
        cols: 60
      }),
      h('div', {},
        h('button', {
          className: 'confirm-action-add',
          onClick: this.create.bind(this)
        }, 'Add'),
        h('button', {
          className: 'cancel-action-add',
          onClick: this.cancel.bind(this)
        }, 'Cancel')
      )
    )
  }
}

class Actions extends Component {
  renderActions () {
    const {
      hostname,
      actions,
      onActionRemove,
      onActionEdit
    } = this.props
    return Object.keys(actions)
      .map(actionName => h(Action, {
        actionName,
        onActionEdit,
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
        className: 'form-control add-action',
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

  onActionChange (hostname, actionName, originalActionName, code) {
    this.setState({ editing: false })
    this.props.onActionChange(hostname, actionName, originalActionName, code)
  }

  addAction () {
    this.setState({ editing: true })
  }

  editAction (hostname, actionName, actionCode) {
    this.setState({ editing: true, actionName, actionCode })
  }

  removeHost () {
    this.props.removeHost(this.props.hostname)
  }

  render () {
    const { hostname, actions, onActionRemove, onHostRemove } = this.props
    const { editing, actionName, actionCode } = this.state

    return (
      h('div', { className: 'host', 'data-hostname': hostname },
        h('header', { className: 'hostname' },
        h('span', { className: 'hostname-title' }, hostname),
        h('button', {
          className: 'form-control remove-host',
          onClick: () => onHostRemove(hostname)
        }, '- Remove'),
        editing
          ? h(ActionEditor, {
            actionName,
            actionCode,
            createAction: this.onActionChange.bind(this, hostname),
            cancelCreateAction: () => { this.setState({ editing: false }) }
          }) : null
        ),
        h(Actions, {
          hostname,
          editing,
          actions,
          onActionRemove,
          addAction: this.addAction.bind(this),
          onActionEdit: this.editAction.bind(this, hostname)
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
        className: 'add-host-input',
        placeholder: 'https://example.com',
        onKeyup: this.onKeyup.bind(this),
        ref: c => (this.input = c)
      }, null),
      h('button', {
        className: 'add-host',
        onClick: this.onSubmit.bind(this)
      }, '+ Add Host'),
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

  async onActionChange (hostname, actionName, originalActionName, code) {
    let mappings = await Storage.get('mappings')
    mappings[hostname] = {
      ...mappings[hostname],
      [actionName]: code
    }

    if (originalActionName !== actionName) {
      delete mappings[hostname][originalActionName]
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
