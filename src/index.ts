export class Timebox {
    /**
     * Indicates if the timebox is allowed to return early.
     */
    protected canReturnEarly: boolean = false;

    /**
     * Invoke the given callback within the specified timebox minimum.
     */
    public async call<T>(
        callback: (self: this) => T | Promise<T>,
        microseconds: number
    ): Promise<T> {
        let caught: unknown;
        let result: T | undefined;

        const start = performance.now();

        try {
            result = await callback(this);
        } catch (err) {
            caught = err;
        }

        const remainder = microseconds - ((performance.now() - start) * 1000);

        if ( ! this.canReturnEarly && remainder > 0) {
            await this.usleep(remainder);
        }

        if (caught !== undefined) {
            throw caught;
        }

        return result as T;
    }

    /**
     * Indicate that the timebox can return early or not.
     */
    public returnEarly(condition: boolean = true): this {
        this.canReturnEarly = condition;

        return this;
    }

    /**
     * Sleep for the specified number of microseconds.
     */
    protected async usleep(microseconds: number): Promise<void> {
        const ms = microseconds / 1000;

        await new Promise<void>(resolve => setTimeout(resolve, ms));
    }
}
