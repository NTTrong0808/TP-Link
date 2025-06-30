import { Injectable } from '@nestjs/common';

@Injectable()
export class LCGGenerator {
  private seed: number;
  private readonly a: number;
  private readonly c: number;
  private readonly m: number;
  private counter = 0;

  constructor() {
    this.seed = Date.now() + process.pid;
    this.a = 1664525;
    this.c = 1013904223;
    this.m = 2 ** 32;
  }

  /**
   * Generates the next random number in the sequence.
   */
  #next(): number {
    this.seed = (this.a * this.seed + this.c + this.counter++) % this.m;
    return this.seed;
  }

  /**
   * Generates a random numeric string
   * @param {number} length
   */
  randomNumericString(length: number): string {
    let result = '';
    for (let i = 0; i < length; i++) {
      this.seed = (this.a * this.seed + this.c + i) % this.m;
      result += (this.seed % 10).toString();
    }
    return result;
  }

  /**
   * Generates a random alphanumeric string
   * @param {number} length
   */
  randomAlphanumericString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars[this.#next() % chars.length];
    }
    return result;
  }
}
