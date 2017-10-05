const { Component, h, render } = window.preact

function Action ({ actionName, code }) {
  return h('div', { className: 'action' },
    h('p', null, actionName),
    h('pre', null, h('code', null, code))
  )
}

function Host ({ hostname, actions }) {
  const renderedActions = Object.keys(actions)
    .map(actionName => h(Action, {
      actionName, code: actions[actionName]
    }))

  return h('div', { className: 'host' },
    h('h1', { className: 'hostname' }, hostname),
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

  render () {
    const { mappings } = this.state

    return h('div', {},
      mappings ? h(Hostnames, { mappings }) : h('p', null, 'No mappings')
    )
  }
}

render(h(Options), document.getElementById('app'))
