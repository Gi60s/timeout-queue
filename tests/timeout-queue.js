'use strict';
const expect        = require('chai').expect;
const timeoutQueue  = require('../index');

describe('timeout-queue', function() {

    it('is a function', function() {
        expect(timeoutQueue).to.be.a('function');
    });
    
    describe('#', function() {
        var queue;

        beforeEach(function() {
            queue = timeoutQueue(0);
        });

        it('returns an object', function() {
            expect(queue).to.be.an('object');
        });

        describe('length', function() {

            it('property exists', function() {
                expect(queue).to.have.ownProperty('length');
            });

            it('is a number', function() {
                expect(queue.length).to.a('number');
            });

            it('initializes to zero', function() {
                expect(queue.length).to.equal(0);
            });

        });

        describe('next', function() {

            it('property exists', function() {
                expect(queue).to.have.ownProperty('next');
            });

            it('is a function', function() {
                expect(queue.next).to.a('function');
            });

        });

        describe('push', function() {

            it('property exists', function() {
                expect(queue).to.have.ownProperty('push');
            });

            it('is a function', function() {
                expect(queue.push).to.a('function');
            });

        });
        
    });

    describe('#push', function() {

        it('adds a value', function() {
            const queue = timeoutQueue(0);
            expect(queue.length).to.equal(0);
            queue.push('bob');
            expect(queue.length).to.equal(1);
        });

        it('value times out', function(done) {
            const o = {};
            const queue = timeoutQueue(100, function(value) {
                expect(value).to.equal(o);
                done();
            });
            queue.push(o);
        });

        it('takes custom timeout', function(done) {
            const o = {};
            const start = Date.now();
            const queue = timeoutQueue(100, function(value) {
                const diff = Date.now() - start;
                expect(diff).to.be.lessThan(100);
                done();
            });
            queue.push(o, 10);
        });

        it('timeout of -1 does not expire', function(done) {
            const o = {};
            const queue = timeoutQueue(10, function(value) {
                done(Error('Should not expire'));
            });
            queue.push(o, -1);
            setTimeout(function() {
                done();
            }, 200);
        });

        describe('custom callback', function() {

            it('as third parameter', function() {
                const o = {};
                const queue = timeoutQueue(100);
                const start = Date.now();
                queue.push(o, 0, function(value, expired) {
                    const diff = Date.now() - start;
                    expect(value).to.equal(o);
                    expect(diff).to.be.lessThan(100);
                    expect(expired).to.equal(true);
                });
            });

            it('expired', function() {
                const o = {};
                const queue = timeoutQueue(100);
                queue.push(o, function(value, expired) {
                    expect(value).to.equal(o);
                    expect(expired).to.equal(true);
                });
            });

            it('not expired', function() {
                const o = {};
                const queue = timeoutQueue(100);
                queue.push(o, function(value, expired) {
                    expect(value).to.equal(o);
                    expect(expired).to.equal(false);
                });
                queue.next();
            });

        });

    });

    describe('#next', function() {

        it('gets value', function() {
            const o = {};
            const queue = timeoutQueue(0);
            queue.push(o);
            expect(queue.next()).to.equal(o);
        });

        it('removes from timeout', function(done) {
            const o = {};
            const queue = timeoutQueue(0);
            queue.push(o, function(value, expired) {
                expect(value).to.equal(o);
                expect(expired).to.equal(false);
                setTimeout(done, 200);
            });
            queue.next();
        });

    });

    describe('#length', function() {
        var queue;

        beforeEach(function() {
            queue = timeoutQueue(1000);
        });

        it('initializes to zero', function() {
            expect(queue.length).to.equal(0);
        });

        it('increments with add', function() {
            expect(queue.length).to.equal(0);
            queue.push('');
            expect(queue.length).to.equal(1);
        });

        it('decrements with next', function() {
            queue.push('');
            expect(queue.length).to.equal(1);
            queue.next();
            expect(queue.length).to.equal(0);
        });

    });
    
});