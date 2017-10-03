const fs = require('fs')
const path = require('path')
const os = require('os')
const promisfy = require('util.promisify')

const writeFile = promisfy(fs.writeFile)
const readFile = promisfy(fs.readFile)
const portFilePath = path.join(os.homedir(), '.kino-port')
const unlink = promisfy(fs.unlink)

const port = {
  write (port) {
    return writeFile(portFilePath, port)
  },
  read () {
    return readFile(portFilePath, 'utf8')
      .then(contents => ({ port: contents }))
  },
  delete () {
    return unlink(portFilePath)
  },
  portFilePath
}

module.exports = port
