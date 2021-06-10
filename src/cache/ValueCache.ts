import NodeCache from 'node-cache';

const cache = new NodeCache();

export default class ValueCache<T> {
  private cache = cache;
  private cacheKey: string;

  constructor(cacheKey: string) {
    this.cacheKey = cacheKey;
  }

  get(): T {
    return this.cache.get(this.cacheKey) as T;
  }

  set(value: T): T {
    const result = this.cache.set(this.cacheKey, value);
    if (result != true) {
      throw new Error(`Failed to save value to cache: { ${this.cacheKey}: ${value} }`);
    }
    return value;
  }
}
