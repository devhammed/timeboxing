# Timeboxing

`Timebox` class ensures that the given callback always takes a fixed amount of time to execute, even if its actual execution completes sooner.

This is particularly useful for cryptographic operations and user authentication checks, where attackers might exploit variations in execution time to infer sensitive information.

If the execution exceeds the fixed duration, `Timebox` has no effect. It is up to the developer to choose a sufficiently long time as the fixed duration to account for worst-case scenarios.

The `call` method accepts a closure and a time limit in microseconds, and then executes the closure and waits until the time limit is reached:

```ts
import { Timebox } from 'timeboxing';

await new Timebox().call(
    async () => {
        // ...
    },
    10_000,
);
```

If an exception is thrown within the closure, this class will respect the defined delay and re-throw the exception after the delay.

And, you can also choose to allow returning early by accepting the `Timebox` instance in the callback passed:

```ts
await new Timebox().call(
    async (t) => {
        // ...

        if (someCondition) {
            t.returnEarly();
            
            return;
        }

        // ...
    },
    10_000,
);
```

## Installation

You can install the library using the package manager of your choice:

- NPM: `npm install timeboxing`
- Yarn: `yarn add timeboxing`
- PNPM: `pnpm add timeboxing`
- BUN: `bun add timeboxing`
- Deno: `deno add jsr:@devhammed/timeboxing`

## Credits

- [Hammed Oyedele](https://github.com/devhammed) - Author
- [Laravel](https://laravel.com/docs/12.x/helpers#timebox) - Inspiration
