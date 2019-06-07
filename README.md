# timeout-queue

Add items to the end of a queue. If the item is not pulled off the queue before time expires then the item will call it's callback function and be pulled off the queue immediately.

## Installation

```sh
npm install timeout-queue
```

## Usage

```js
const timeoutQueue = require('timeout-queue');
const start = Date.now();

// items added to the queue set to persist for 500 ms before calling
// the expired function and removing the item from the queue
const queue = timeoutQueue(500, expired);

// add two items to the queue, both will expire in 500 ms
queue.push('Bob');
queue.push('Jan');

// output the queue length
console.log(queue.length);                      // 2

setTimeout(function() {
    const value = queue.next();
    console.log(time() + 'Got ' + value);       // "at 200 ms: Got Bob"
}, 200);

function expired(value) {
    console.log(time() + 'Expired ' + value);   // "at 500 ms: Expired Jan"
}

function time() {
    return 'at ' + (Date.now() - start) + ' ms: ';
}
```

## API

#### timeoutQueue ( [ defaultTimeToLive ] [, timeoutCallback ] )

Get an instance of a timeout queue. Values added to the queue will last for the number of milliseconds specified in the `defaultTimeToLive` parameter. If they are not pulled off the queue before the value expires then the `timeoutCallback` function will be called with the value that was added to (and expired from) the queue.

**Parameters**

- **defaultTimeToLive** - The optional default number of milliseconds that a value will live on the queue before expiring. If set to a negative number then the default time to live will be to not expire. Defaults to `-1`.
- **timeoutCallback** - The optional callback function to call if the value added to the queue is not removed before the `timeToLive` expires.

**Returns** `object` with the `next`, `push`, and `length`,

**Example**

```js
const timeoutQueue = require('timeout-queue');
const queue = timeoutQueue(500, function(value) {
    console.log('Expired ' + value);
});
```

#### #length

Get the length of the queue.

**Returns** a number.

**Example**

```js
const timeoutQueue = require('timeout-queue');
const queue = timeoutQueue(500);

queue.push('Bob');

console.log(queue.length);         // 1
```

#### #next ( )

Get the next item off of the queue.

**Returns** the value of the item pulled off the queue.

**Example**

```js
const timeoutQueue = require('timeout-queue');
const queue = timeoutQueue(500);

queue.push('Bob');

const value = queue.next();
console.log(value);         // "Bob"
```

#### #push ( value [, timeToLive ] [, callback ] )

Add a value to a timeout queue.

**Parameters**

- **value** - The value to add to the queue.
- **timeToLive** - An optional number specifying the number of seconds the value should remain on the queue. If omitted then the default time to live will be used.
- **callback** - An optional callback to call when the value is removed from the queue (either by expiring or not). The callback is passed two parameters: 1) the value, 2) a boolean specifying if it was removed because it expired.

**Returns** the value passed in.

**Example 1: Value Only**

```js
const timeoutQueue = require('timeout-queue');
const queue = timeoutQueue(500, function(value) {
    console.log('Expired ' + value);
});

queue.push('Bob');
```

**Example 2: Value Plus Custom Expiration**

```js
const timeoutQueue = require('timeout-queue');
const queue = timeoutQueue(500, function(value) {
    console.log('Expired ' + value);
});

queue.push('Bob', 700);
```

**Example 3: Value Plus Extra Callback**

```js
const timeoutQueue = require('timeout-queue');
const queue = timeoutQueue(500, function(value) {
    console.log('Expired ' + value);
});

queue.push('Bob', removed);

function removed(value, expired) {
    console.log('Value removed: ' + value + ', Expired: ' + expired);
}
```

**Example 4: All Arguments**

```js
const timeoutQueue = require('timeout-queue');
const queue = timeoutQueue(500, function(value) {
    console.log('Expired ' + value);
});

queue.push('Bob', 700, removed);

function removed(value, expired) {
    console.log('Value removed: ' + value + ', Expired: ' + expired);
}
```
