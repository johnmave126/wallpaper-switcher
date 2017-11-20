const edge = require('edge');
const path = require('path');

module.exports = edge.func({
    source: path.join(__dirname, 'MessagePump.cs'),
    references: ['System.Windows.Forms.dll']
})(null, true);
