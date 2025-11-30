import {test} from 'node:test';
import assert from 'node:assert/strict';
import { Timebox } from './index.js';

test('Timebox.call executes callback and returns value', async () => {
    const tb = new Timebox();
    const result = await tb.call(() => 42, 1000); // 1ms in microseconds
    assert.equal(result, 42);
});

test('Timebox.call waits at least the specified time when canReturnEarly is false', async () => {
    const tb = new Timebox();
    const start = performance.now();

    await tb.call(async () => {
        // immediate return
    }, 50_000); // 50ms in microseconds

    const elapsed = performance.now() - start;
    assert(elapsed >= 50, `Expected at least 50ms delay, got ${elapsed.toFixed(2)}ms`);
});

test('Timebox.call returns early if canReturnEarly is true', async () => {
    const tb = new Timebox().returnEarly(true);
    const start = performance.now();

    await tb.call(async (t) => {
        t.returnEarly();
    }, 50_000); // 50ms in microseconds

    const elapsed = performance.now() - start;
    assert(elapsed < 50, `Expected early return, got ${elapsed.toFixed(2)}ms`);
});

test('Timebox.call rethrows exceptions after delay', async () => {
    const tb = new Timebox();
    const start = performance.now();
    const error = new Error('test');

    await assert.rejects(
        async () => {
            await tb.call(() => { throw error; }, 20_000);
        },
        error
    );

    const elapsed = performance.now() - start;
    assert(elapsed >= 20, `Expected at least 20ms delay before throwing, got ${elapsed.toFixed(2)}ms`);
});

test('Timebox.call executes async callbacks properly', async () => {
    const tb = new Timebox();
    const start = performance.now();

    const result = await tb.call(async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
        return 'async';
    }, 30_000); // 30ms in microseconds

    assert.equal(result, 'async');
    const elapsed = performance.now() - start;
    assert(elapsed >= 30, `Expected at least 30ms delay, got ${elapsed.toFixed(2)}ms`);
});
