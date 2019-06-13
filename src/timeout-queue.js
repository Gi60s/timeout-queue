"use strict";

module.exports = TimeoutQueue;

/**
 * Create a timeout queue.
 * @param {number} [defaultTimeToLive=-1] The default number of milliseconds before timeout.
 * @param {function} [timeoutCallback] The function to call when a value times out.
 * @returns {TimeoutQueue}
 * @constructor
 */
function TimeoutQueue(defaultTimeToLive, timeoutCallback) {
    const factory = Object.create(TimeoutQueue.prototype);
    const store = [];
    if (arguments.length === 0) defaultTimeToLive = -1;

    /**
     * Add a value to the queue.
     * @name TimeoutQueue#push
     * @param {*} value
     * @param {number} [timeToLive=defaultTimeToLive] The number of milliseconds before timeout.
     * @param {function} [callback] A callback to call when the item is removed from the queue. The callback
     * gets two parameters: 1) the value, 2) a boolean specifying if it was removed because it expired.
     * @returns {*} The value passed in.
     */
    factory.push = function(value, timeToLive, callback) {
        const item = { value: value };
        const myTTL = typeof timeToLive === 'number' ? timeToLive : defaultTimeToLive;

        // store the callback function
        item.callback = arguments.length === 2 && typeof arguments[1] === 'function' ? arguments[1] : callback;

        // set a timeout if the ttl is zero or greater
        if (myTTL >= 0) {
            item.timeoutId = setTimeout(function () {
                var index = store.indexOf(item);
                if (index !== -1) {
                    store.splice(index, 1);
                    if (typeof timeoutCallback === 'function') timeoutCallback(value);
                    if (typeof item.callback === 'function') item.callback(value, true);
                }
            }, myTTL);
        }

        store.push(item);

        return value;
    };

    /**
     * Get the oldest item off of the queue.
     * @name TimeoutQueue#next
     * @returns {*}
     */
    factory.next = function() {
        var item;
        if (store.length > 0) {
            item = store.shift();
            clearTimeout(item.timeoutId);
            if (typeof item.callback === 'function') item.callback(item.value, false);
            return item.value;
        }
    };

    /**
     * @name TimeoutQueue#length
     * @property
     * @readonly
     * @type {number}
     */
    Object.defineProperty(factory, 'length', {
        enumerable: true,
        get: function() {
            return store.length;
        }
    });

    return factory;
}