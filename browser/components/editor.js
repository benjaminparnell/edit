module.exports = init

var throttle = require('lodash.throttle')

function init (socket) {
  var ace = require('brace')
  require('brace/mode/javascript')
  require('brace/theme/monokai')

  var editor = ace.edit('editor')
  editor.getSession().setMode('ace/mode/javascript')
  editor.setTheme('ace/theme/monokai')
  editor.clearSelection()

  var ignore
  var changed
  var handleInput = throttle(function () {
    if (changed) {
      var editorValue = editor.getSession().getValue()
      socket.emit('change', editorValue)
    }
    changed = false
  }, 1500)

  editor.on('input', handleInput)

  editor.on('change', function () {
    if (!ignore) changed = true
  })

  socket.on('change', function (value) {
    ignore = true
    editor.getSession().setValue(value)
    ignore = false
  })
}
