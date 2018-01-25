var exports = module.exports = {};

/**
 * Deep copy a plain object
 * @param  {object} obj the object to copy
 * @return {object}     copied object
 */
exports.simpleClone = function(obj) {
    return JSON.parse(JSON.stringify((obj)));
};

/**
 * Shuffle an array (shallow copy)
 * @param  {Array} arr the array to shuffle
 * @return {Array}     shuffled array
 */
exports.shuffle = function(arr) {
    var shuffled = arr.slice(0);
    for(let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};
