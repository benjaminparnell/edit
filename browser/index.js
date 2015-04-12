var io = require('socket.io-client')

var components =
  [ require('./components/editor') ]

var socket = io()

components.forEach(function (component) {
  component(socket)
})
