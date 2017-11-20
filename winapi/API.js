const edge = require('edge');
const path = require('path');

var exports = module.exports = edge.func(path.join(__dirname, 'API.cs'))(null, true);
