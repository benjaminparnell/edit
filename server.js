var express = require('express')
var serviceLocator = require('service-locator')()
var bunyan = require('bunyan')
var app = express()
var server = require('http').Server(app)
var io = require('socket.io')(server)

var port = process.env.PORT || 1337
var logLevel = process.env.LOG_LEVEL || 'debug'
var logger = bunyan.createLogger({ name: 'edit', level: logLevel, stream: process.stdout })

serviceLocator.register('router', app)
serviceLocator.register('logger', logger)
serviceLocator.register('socketIo', io)

app.use(express.static('static'))

io.on('connection', function (socket) {
  serviceLocator.logger.debug('User connected')

  socket.on('disconnect', function () {
    serviceLocator.logger.debug('User disconnected')
  })

  socket.on('change', function (change) {
    serviceLocator.logger.debug(change)

    socket.broadcast.emit('change', change)
  })
})

server.listen(port, function () {
  serviceLocator.logger.info('edit started on port', port)
})
