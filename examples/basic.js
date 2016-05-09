const timeoutQueue = require('./../index');
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
    console.log(time() + 'Got ' + value);       // at 200 ms: Got Bob
}, 200);

function expired(value) {
    console.log(time() + 'Expired ' + value);   // at 500 ms: Expired Jan
}

function time() {
    return 'at ' + (Date.now() - start) + ' ms: ';
}