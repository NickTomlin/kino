const portConfig = require('./port')
const net = require('net')

class Client {
  connect () {
    return portConfig.read()
      .then(data => {
        return new Promise((resolve, reject) => {
          let socket = net.connect(data.port, function (err) {
            if (err) { return reject(err) }
            resolve(socket)
          })
        })
      })
  }

  message (content = {}) {
    this.connect().then(socket => {
      return new Promise((resolve, reject) => {
        let buf = ''
        socket.on('data', (chunk) => {
          buf += chunk
        })

        socket.on('end', () => resolve(buf))
        socket.on('error', reject)

        socket.end(JSON.stringify(content))
      })
    })
  }

  static message (message) {
    return new Client().message(message)
  }
}

module.exports = Client
