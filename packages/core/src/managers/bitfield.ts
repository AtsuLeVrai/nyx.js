/**
 * Represents a value that can be resolved to a bitfield.
 * It can be an array of T, bigint, or string representations of bigint,
 * an instance of BitfieldManager, a single T, a bigint, or a string representation of a bigint.
 */
export type BitfieldResolvable<T> = (T | bigint | `${bigint}`)[] | BitfieldManager<T> | T | bigint | `${bigint}`;

/**
 * Asserts that a string represents a valid BigInt and returns it.
 *
 * @param value The string to validate and convert.
 * @returns The validated BigInt.
 * @throws Error if the string is not a valid BigInt representation.
 */
export function assertValidBigInt(value: string): bigint {
    // Remove any leading/trailing whitespace
    const trimmedValue = value.trim();

    // Check if the string is empty after trimming
    if (trimmedValue.length === 0) {
        throw new Error("Empty string is not a valid BigInt");
    }

    // Check if the string contains only digits, optionally preceded by a sign
    if (!/^-?\d+$/.test(trimmedValue)) {
        throw new Error("Invalid BigInt format");
    }

    try {
        // Attempt to create a BigInt from the string
        const result = BigInt(trimmedValue);

        // Ensure the result is non-negative
        if (result < 0n) {
            throw new Error("BigInt must be non-negative for bitfield operations");
        }

        return result;
    } catch (error) {
        // Catch any errors thrown by BigInt constructor
        if (error instanceof Error) {
            throw new TypeError(`Failed to create BigInt: ${error.message}`);
        } else {
            throw new TypeError("Failed to create BigInt: Unknown error");
        }
    }
}

/**
 * Symbol used as a key for the internal bitfield value.
 */
const bitfield = Symbol("bitfield");

/**
 * A class that manages bitfields with type-safe flag operations.
 */
export class BitfieldManager<T> {
    /**
     * The internal bitfield value.
     */
    private [bitfield]: bigint;

    /**
     * Creates a new BitfieldManager instance.
     *
     * @param value - The initial value of the bitfield. Can be an array of flags or a bigint.
     * @throws TypeError If the initial value is neither a bigint nor an array of flags.
     */
    public constructor(value: T[] | bigint = 0n) {
        if (typeof value === "bigint") {
            this[bitfield] = value;
        } else if (Array.isArray(value)) {
            this[bitfield] = value.reduce((acc, val) => acc | this.resolve(val), 0n);
        } else {
            throw new TypeError("Initial value must be a bigint or an array of flags");
        }
    }

    /**
     * Creates a new BitfieldManager instance from various input types.
     *
     * @param value - The value to create the BitfieldManager from.
     * @returns A new BitfieldManager instance.
     */
    public static from<F>(value: BitfieldManager<F> | F[] | bigint): BitfieldManager<F> {
        if (value instanceof BitfieldManager) {
            return new BitfieldManager(value.valueOf());
        }

        return new BitfieldManager(value);
    }

    /**
     * Checks if the bitfield has a specific flag set.
     *
     * @param val - The flag to check for.
     * @returns True if the flag is set, false otherwise.
     */
    public has(val: T): boolean {
        const bit = this.resolve(val);
        return (this[bitfield] & bit) === bit;
    }

    /**
     * Adds one or more flags to the bitfield.
     *
     * @param flags - The flags to add.
     * @returns The BitfieldManager instance for chaining.
     */
    public add(...flags: T[]): this {
        this[bitfield] |= flags.reduce((acc, val) => acc | this.resolve(val), 0n);
        return this;
    }

    /**
     * Removes one or more flags from the bitfield.
     *
     * @param flags - The flags to remove.
     * @returns The BitfieldManager instance for chaining.
     */
    public remove(...flags: T[]): this {
        this[bitfield] &= ~flags.reduce((acc, val) => acc | this.resolve(val), 0n);
        return this;
    }

    /**
     * Toggles one or more flags in the bitfield.
     *
     * @param flags - The flags to toggle.
     * @returns The BitfieldManager instance for chaining.
     */
    public toggle(...flags: T[]): this {
        this[bitfield] ^= flags.reduce((acc, val) => acc | this.resolve(val), 0n);
        return this;
    }

    /**
     * Clears all flags in the bitfield.
     *
     * @returns The BitfieldManager instance for chaining.
     */
    public clear(): this {
        this[bitfield] = 0n;
        return this;
    }

    /**
     * Gets the raw bigint value of the bitfield.
     *
     * @returns The bigint value of the bitfield.
     */
    public valueOf(): bigint {
        return this[bitfield];
    }

    /**
     * Converts the bitfield to a string representation.
     *
     * @returns A string representation of the bitfield's bigint value.
     */
    public toString(): string {
        return this[bitfield].toString();
    }

    /**
     * Resolves a value to a bigint bitfield.
     *
     * @param value - The value to resolve. It can be a single value or an array of values.
     * @returns The resolved bigint bitfield.
     * @throws TypeError If the value is of an invalid type.
     * @throws Error If a number value is not a non-negative integer.
     */
    private resolve(value: BitfieldResolvable<T> | BitfieldResolvable<T>[]): bigint {
        if (Array.isArray(value)) {
            return value.reduce<bigint>((acc, val) => acc | this.resolve(val), 0n);
        }

        if (typeof value === "bigint") {
            return value;
        }

        if (typeof value === "number") {
            if (!Number.isInteger(value) || value < 0) {
                throw new Error("Number must be a non-negative integer");
            }

            return BigInt(value);
        }

        if (typeof value === "string") {
            return assertValidBigInt(value);
        }

        throw new TypeError("Invalid type for bitfield value");
    }
}
