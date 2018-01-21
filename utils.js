var exports = module.exports = {};

exports.simpleClone = function(obj) {
    return JSON.parse(JSON.stringify((obj)));
}
