/**
 * Represents a value that can be resolved to a bitfield.
 *
 * This type can accept:
 * - A bigint value representing the bits directly
 * - A number value (must be a non-negative integer)
 * - A string that can be parsed as a bigint
 * - A type T that can be resolved to bits (typically an enum value)
 * - An array of any of the above
 *
 * @template T - The custom type that can be resolved to bits
 */
export type BitFieldResolvable<T = unknown> =
  | bigint
  | number
  | string
  | T
  | BitFieldResolvable<T>[];

/** The maximum value a 64-bit bitfield can hold (2^64 - 1) */
const MAX_BIT_VALUE = (1n << 64n) - 1n;

/**
 * Validates and normalizes a bigint value to ensure it's within valid bitfield range.
 *
 * @param value - The bigint value to validate
 * @returns The validated and masked bigint value
 * @throws {RangeError} If the value is negative
 */
function validateBigInt(value: bigint): bigint {
  if (value < 0n) {
    throw new RangeError("BitField values cannot be negative");
  }

  return value & MAX_BIT_VALUE;
}

/**
 * A utility class for managing bitfields with type safety.
 *
 * BitFieldManager provides methods for working with 64-bit bitfields using BigInt,
 * with support for bitwise operations, transformations, and analysis. It's designed
 * to work with enumerated flag values, such as permission systems or feature flags.
 *
 * @template T - The type of values to be used with this bitfield
 *
 * @example
 * ```typescript
 * enum Permissions {
 *   Read = 1n << 0n,
 *   Write = 1n << 1n,
 *   Execute = 1n << 2n
 * }
 *
 * const userPermissions = new BitFieldManager<Permissions>(Permissions.Read, Permissions.Write);
 *
 * if (userPermissions.has(Permissions.Read)) {
 *   console.log('User has read permission');
 * }
 * ```
 */
export class BitFieldManager<T> {
  /** The internal bitfield value as a bigint */
  #bitfield: bigint;

  /**
   * Creates a new BitFieldManager instance.
   *
   * @param values - The initial values to set in the bitfield
   */
  constructor(...values: BitFieldResolvable<T>[]) {
    this.#bitfield =
      values.length > 0 ? BitFieldManager.resolve<T>(...values) : 0n;
  }

  /**
   * Creates a new BitFieldManager from the given values.
   *
   * @template F - The type of values to be used with the new bitfield
   * @param values - The values to include in the bitfield
   * @returns A new BitFieldManager instance
   */
  static from<F>(...values: BitFieldResolvable<F>[]): BitFieldManager<F> {
    return new BitFieldManager<F>(...values);
  }

  /**
   * Resolves a set of input values to a single bigint representing the combined bits.
   *
   * @template F - The type of values to resolve
   * @param bits - The values to resolve
   * @returns The resolved bigint value
   * @throws {RangeError|TypeError} If any value cannot be resolved
   */
  static resolve<F>(...bits: BitFieldResolvable<F>[]): bigint {
    return bits.reduce<bigint>((acc, bit) => {
      if (bit == null) {
        return acc;
      }

      // Handle bigint values
      if (typeof bit === "bigint") {
        return acc | validateBigInt(bit);
      }

      // Handle number values
      if (typeof bit === "number") {
        if (
          !Number.isInteger(bit) ||
          bit < 0 ||
          bit > Number.MAX_SAFE_INTEGER
        ) {
          throw new RangeError("Invalid number value for BitField resolution");
        }
        return acc | BigInt(bit);
      }

      // Handle string values (parsing to bigint)
      if (typeof bit === "string") {
        try {
          return acc | validateBigInt(BigInt(bit));
        } catch {
          throw new Error(
            `Could not resolve string "${bit}" to a BitField value`,
          );
        }
      }

      // Handle array values recursively
      if (Array.isArray(bit)) {
        return acc | BitFieldManager.resolve<F>(...bit);
      }

      // Handle any other value (likely a custom flag type)
      try {
        // Try to use the value directly, assuming it can be converted to a bigint somehow
        return acc | validateBigInt(BigInt(bit as unknown as number));
      } catch {
        throw new TypeError(
          `Could not resolve ${String(bit)} to a BitField value`,
        );
      }
    }, 0n);
  }

  /**
   * Checks if a value is a valid bitfield.
   *
   * @param value - The value to check
   * @returns Whether the value can be safely used as a bitfield
   */
  static isValidBitField(value: unknown): boolean {
    // Handle bigint values
    if (typeof value === "bigint") {
      return value >= 0n && value <= MAX_BIT_VALUE;
    }

    // Handle number values
    if (typeof value === "number") {
      return (
        Number.isInteger(value) &&
        value >= 0 &&
        value <= Number.MAX_SAFE_INTEGER
      );
    }

    // Handle string values
    if (typeof value === "string") {
      try {
        const bigintValue = BigInt(value);
        return bigintValue >= 0n && bigintValue <= MAX_BIT_VALUE;
      } catch {
        return false;
      }
    }

    // Handle array values recursively
    if (Array.isArray(value)) {
      return value.every((item) => BitFieldManager.isValidBitField(item));
    }

    // Any other value type is not directly valid
    return false;
  }

  /**
   * Combines multiple bitfields using a bitwise OR operation.
   *
   * @template F - The type of values to combine
   * @param bitfields - The bitfields to combine
   * @returns A new BitFieldManager with the combined bits
   */
  static combine<F>(...bitfields: BitFieldResolvable<F>[]): BitFieldManager<F> {
    return new BitFieldManager<F>(
      bitfields.reduce<bigint>(
        (acc, bf) => acc | BitFieldManager.resolve<F>(bf),
        0n,
      ),
    );
  }

  /**
   * Finds the intersection of multiple bitfields using a bitwise AND operation.
   *
   * @template F - The type of values to intersect
   * @param bitfields - The bitfields to intersect
   * @returns A new BitFieldManager with the intersected bits
   */
  static intersection<F>(
    ...bitfields: BitFieldResolvable<F>[]
  ): BitFieldManager<F> {
    if (bitfields.length === 0) {
      return new BitFieldManager<F>();
    }

    const first = BitFieldManager.resolve<F>(bitfields[0] ?? 0n);
    return new BitFieldManager<F>(
      bitfields
        .slice(1)
        .reduce<bigint>(
          (acc, bf) => acc & BitFieldManager.resolve<F>(bf),
          first,
        ),
    );
  }

  /**
   * Performs XOR operation on multiple bitfields.
   *
   * @template F - The type of values to XOR
   * @param bitfields - The bitfields to XOR
   * @returns A new BitFieldManager with the XORed bits
   */
  static xor<F>(...bitfields: BitFieldResolvable<F>[]): BitFieldManager<F> {
    return new BitFieldManager<F>(
      bitfields.reduce<bigint>(
        (acc, bf) => acc ^ BitFieldManager.resolve<F>(bf),
        0n,
      ),
    );
  }

  /**
   * Creates a BitFieldManager from a serialized string representation.
   *
   * @template F - The type of values to deserialize
   * @param value - The serialized string to deserialize
   * @returns A new BitFieldManager with the deserialized value
   * @throws {Error} If the string cannot be parsed as a bigint
   */
  static deserialize<F>(value: string): BitFieldManager<F> {
    try {
      return new BitFieldManager<F>(BigInt(value));
    } catch (error) {
      throw new Error("Invalid serialized BitField", { cause: error });
    }
  }

  /**
   * Checks if this bitfield has a specific bit or set of bits.
   *
   * @param val - The bit(s) to check for
   * @returns True if all specified bits are set
   */
  has(val: BitFieldResolvable<T>): boolean {
    const bit = BitFieldManager.resolve<T>(val);
    return (this.#bitfield & bit) === bit;
  }

  /**
   * Checks if this bitfield has all of the specified bits.
   *
   * @param flags - The bits to check for
   * @returns True if all specified bits are set
   */
  hasAll(...flags: BitFieldResolvable<T>[]): boolean {
    const bits = BitFieldManager.resolve<T>(...flags);
    return (this.#bitfield & bits) === bits;
  }

  /**
   * Checks if this bitfield has any of the specified bits.
   *
   * @param flags - The bits to check for
   * @returns True if any of the specified bits are set
   */
  hasAny(...flags: BitFieldResolvable<T>[]): boolean {
    const bits = BitFieldManager.resolve<T>(...flags);
    return (this.#bitfield & bits) !== 0n;
  }

  /**
   * Returns the bits that are in the flags but not in this bitfield.
   *
   * @param flags - The bits to check against
   * @returns An array of bigint values representing the missing bits
   */
  missing(...flags: BitFieldResolvable<T>[]): bigint[] {
    const bits = BitFieldManager.resolve<T>(...flags);
    return BitFieldManager.from(bits & ~this.#bitfield).toArray();
  }

  /**
   * Checks if this bitfield is empty (has no bits set).
   *
   * @returns True if no bits are set
   */
  isEmpty(): boolean {
    return this.#bitfield === 0n;
  }

  /**
   * Checks if this bitfield is equal to another.
   *
   * @param other - The bitfield to compare with
   * @returns True if the bitfields are equal
   */
  equals(other: BitFieldResolvable<T>): boolean {
    return this.#bitfield === BitFieldManager.resolve<T>(other);
  }

  /**
   * Adds bits to this bitfield.
   *
   * @param flags - The bits to add
   * @returns This instance for chaining
   */
  add(...flags: BitFieldResolvable<T>[]): this {
    this.#bitfield = validateBigInt(
      this.#bitfield | BitFieldManager.resolve<T>(...flags),
    );
    return this;
  }

  /**
   * Removes bits from this bitfield.
   *
   * @param flags - The bits to remove
   * @returns This instance for chaining
   */
  remove(...flags: BitFieldResolvable<T>[]): this {
    this.#bitfield = validateBigInt(
      this.#bitfield & ~BitFieldManager.resolve<T>(...flags),
    );
    return this;
  }

  /**
   * Toggles bits in this bitfield.
   *
   * @param flags - The bits to toggle
   * @returns This instance for chaining
   */
  toggle(...flags: BitFieldResolvable<T>[]): this {
    this.#bitfield = validateBigInt(
      this.#bitfield ^ BitFieldManager.resolve<T>(...flags),
    );
    return this;
  }

  /**
   * Sets this bitfield to the specified value.
   *
   * @param flags - The bits to set
   * @returns This instance for chaining
   */
  set(...flags: BitFieldResolvable<T>[]): this {
    this.#bitfield = validateBigInt(BitFieldManager.resolve<T>(...flags));
    return this;
  }

  /**
   * Clears all bits in this bitfield.
   *
   * @returns This instance for chaining
   */
  clear(): this {
    this.#bitfield = 0n;
    return this;
  }

  /**
   * Creates a new BitFieldManager with the same bits as this one.
   *
   * @returns A new BitFieldManager instance
   */
  clone(): BitFieldManager<T> {
    return new BitFieldManager<T>(this.#bitfield);
  }

  /**
   * Converts this bitfield to an array of powers of 2 representing the set bits.
   *
   * @returns An array of bigint values representing the set bits
   */
  toArray(): bigint[] {
    const result: bigint[] = [];
    let value = this.#bitfield;
    let position = 0n;

    while (value > 0n) {
      if (value & 1n) {
        result.push(1n << position);
      }
      value >>= 1n;
      position++;
    }

    return result;
  }

  /**
   * Converts this bitfield to a string representation.
   *
   * @param radix - The radix to use for the string representation (default: 16)
   * @returns The string representation
   */
  toString(radix = 16): string {
    return this.#bitfield.toString(radix);
  }

  /**
   * Converts this bitfield to a binary string.
   *
   * @returns The binary string representation
   */
  toBinaryString(): string {
    return this.toString(2);
  }

  /**
   * Converts this bitfield to a number.
   *
   * @returns The number representation
   * @throws If the value exceeds Number.MAX_SAFE_INTEGER
   */
  toNumber(): number {
    if (this.#bitfield > BigInt(Number.MAX_SAFE_INTEGER)) {
      throw new RangeError("BitField value exceeds Number.MAX_SAFE_INTEGER");
    }
    return Number(this.#bitfield);
  }

  /**
   * Returns the raw bigint value of this bitfield.
   *
   * @returns The bigint value
   */
  valueOf(): bigint {
    return this.#bitfield;
  }

  /**
   * Counts the number of leading zeros in the binary representation.
   *
   * @returns The number of leading zeros
   */
  leadingZeros(): number {
    let count = 0;
    const value = this.#bitfield;

    for (let i = 63; i >= 0; i--) {
      if ((value & (1n << BigInt(i))) === 0n) {
        count++;
      } else {
        break;
      }
    }

    return count;
  }

  /**
   * Counts the number of trailing zeros in the binary representation.
   *
   * @returns The number of trailing zeros
   */
  trailingZeros(): number {
    if (this.#bitfield === 0n) {
      return 64;
    }

    let count = 0;
    let value = this.#bitfield;

    while ((value & 1n) === 0n) {
      count++;
      value >>= 1n;
    }

    return count;
  }

  /**
   * Returns the most significant (highest) bit that is set.
   *
   * @returns The most significant bit as a bigint
   */
  getMostSignificantBit(): bigint {
    return this.#bitfield === 0n ? 0n : 1n << BigInt(this.bitLength() - 1);
  }

  /**
   * Returns the least significant (lowest) bit that is set.
   *
   * @returns The least significant bit as a bigint
   */
  getLeastSignificantBit(): bigint {
    if (this.#bitfield === 0n) {
      return 0n;
    }

    return 1n << BigInt(this.trailingZeros());
  }

  /**
   * Returns the number of bits needed to represent this bitfield.
   *
   * @returns The bit length
   */
  bitLength(): number {
    return 64 - this.leadingZeros();
  }

  /**
   * Checks if a specific bit position is set.
   *
   * @param position - The bit position to check (0-63)
   * @returns True if the bit is set
   * @throws {RangeError} If the position is out of range
   */
  isBitSet(position: number): boolean {
    if (!Number.isInteger(position) || position < 0 || position >= 64) {
      throw new RangeError("Bit position must be between 0 and 63");
    }

    return (this.#bitfield & (1n << BigInt(position))) !== 0n;
  }

  /**
   * Serializes this bitfield to a string.
   *
   * @returns The serialized string representation
   */
  serialize(): string {
    return this.#bitfield.toString();
  }

  /**
   * Returns a new BitFieldManager with the bits that are in this bitfield but not in the other.
   *
   * @param other - The bitfield to subtract
   * @returns A new BitFieldManager with the difference
   */
  difference(other: BitFieldResolvable<T>): BitFieldManager<T> {
    return new BitFieldManager<T>(
      this.#bitfield & ~BitFieldManager.resolve<T>(other),
    );
  }

  /**
   * Checks if this bitfield has any bits in common with another.
   *
   * @param other - The bitfield to check against
   * @returns True if there are any common bits
   */
  intersects(other: BitFieldResolvable<T>): boolean {
    return (this.#bitfield & BitFieldManager.resolve<T>(other)) !== 0n;
  }

  /**
   * Checks if this bitfield is a subset of another.
   *
   * @param other - The bitfield to check against
   * @returns True if this bitfield is a subset of the other
   */
  isSubset(other: BitFieldResolvable<T>): boolean {
    const otherBits = BitFieldManager.resolve<T>(other);
    return (this.#bitfield & otherBits) === this.#bitfield;
  }

  /**
   * Checks if this bitfield is a superset of another.
   *
   * @param other - The bitfield to check against
   * @returns True if this bitfield is a superset of the other
   */
  isSuperset(other: BitFieldResolvable<T>): boolean {
    const otherBits = BitFieldManager.resolve<T>(other);
    return (this.#bitfield & otherBits) === otherBits;
  }

  /**
   * Calculates the Hamming distance between this bitfield and another.
   * The Hamming distance is the number of bits that differ.
   *
   * @param other - The bitfield to compare with
   * @returns The Hamming distance
   */
  hammingDistance(other: BitFieldResolvable<T>): number {
    const distance = this.#bitfield ^ BitFieldManager.resolve<T>(other);
    return this.#getSetBitCount(distance);
  }

  /**
   * Returns a new BitFieldManager with only the bits within the given range.
   *
   * @param start - The start bit position (inclusive)
   * @param end - The end bit position (exclusive)
   * @returns A new BitFieldManager with the masked bits
   * @throws {RangeError} If the range is invalid
   */
  mask(start: number, end: number): BitFieldManager<T> {
    if (
      !Number.isInteger(start) ||
      start < 0 ||
      start >= 64 ||
      !Number.isInteger(end) ||
      end < 0 ||
      end >= 64 ||
      start >= end
    ) {
      throw new RangeError("Invalid mask range. Must be 0 ≤ start < end < 64");
    }

    const mask = ((1n << BigInt(end - start)) - 1n) << BigInt(start);
    return new BitFieldManager<T>(this.#bitfield & mask);
  }

  /**
   * Sets a specific bit position.
   *
   * @param position - The bit position to set (0-63)
   * @returns This instance for chaining
   * @throws {RangeError} If the position is out of range
   */
  setBit(position: number): this {
    if (!Number.isInteger(position) || position < 0 || position >= 64) {
      throw new RangeError("Bit position must be between 0 and 63");
    }

    this.#bitfield |= 1n << BigInt(position);
    return this;
  }

  /**
   * Clears a specific bit position.
   *
   * @param position - The bit position to clear (0-63)
   * @returns This instance for chaining
   * @throws {RangeError} If the position is out of range
   */
  clearBit(position: number): this {
    if (!Number.isInteger(position) || position < 0 || position >= 64) {
      throw new RangeError("Bit position must be between 0 and 63");
    }

    this.#bitfield &= ~(1n << BigInt(position));
    return this;
  }

  /**
   * Toggles a specific bit position.
   *
   * @param position - The bit position to toggle (0-63)
   * @returns This instance for chaining
   * @throws {RangeError} If the position is out of range
   */
  toggleBit(position: number): this {
    if (!Number.isInteger(position) || position < 0 || position >= 64) {
      throw new RangeError("Bit position must be between 0 and 63");
    }

    this.#bitfield ^= 1n << BigInt(position);
    return this;
  }

  /**
   * Returns an array of position indices where bits are set.
   *
   * @returns An array of bit positions
   */
  getSetBitPositions(): number[] {
    const positions: number[] = [];
    let value = this.#bitfield;
    let position = 0;

    while (value > 0n) {
      if (value & 1n) {
        positions.push(position);
      }
      value >>= 1n;
      position++;
    }

    return positions;
  }

  /**
   * Swaps the values of two bit positions.
   *
   * @param pos1 - The first bit position (0-63)
   * @param pos2 - The second bit position (0-63)
   * @returns This instance for chaining
   * @throws {RangeError} If any position is out of range
   */
  swapBits(pos1: number, pos2: number): this {
    if (
      !Number.isInteger(pos1) ||
      pos1 < 0 ||
      pos1 >= 64 ||
      !Number.isInteger(pos2) ||
      pos2 < 0 ||
      pos2 >= 64
    ) {
      throw new RangeError("Bit positions must be between 0 and 63");
    }

    if (pos1 !== pos2) {
      const bit1 = (this.#bitfield >> BigInt(pos1)) & 1n;
      const bit2 = (this.#bitfield >> BigInt(pos2)) & 1n;
      if (bit1 !== bit2) {
        this.#bitfield ^= (1n << BigInt(pos1)) | (1n << BigInt(pos2));
      }
    }
    return this;
  }

  /**
   * Counts the number of bits set (population count).
   *
   * @returns The number of set bits
   */
  popCount(): number {
    return this.#getSetBitCount(this.#bitfield);
  }

  /**
   * Makes the BitFieldManager iterable, yielding each set bit as a power of 2.
   */
  *[Symbol.iterator](): Iterator<bigint> {
    yield* this.toArray();
  }

  /**
   * Counts the number of bits set in a bigint value.
   *
   * @param value - The value to count bits in
   * @returns The number of set bits
   */
  #getSetBitCount(value: bigint): number {
    let count = 0;
    let num = value;

    // Brian Kernighan's algorithm for counting set bits
    while (num > 0n) {
      num &= num - 1n; // Clear the least significant bit set
      count++;
    }

    return count;
  }
}
