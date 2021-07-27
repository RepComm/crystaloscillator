export class Queue<T> {
  private internal_array: Array<T>;

  constructor () {
    this.internal_array = new Array<T>();
  }
  enqueue (...items:T[]): this {
    this.internal_array.push(...items);
    return this;
  }
  dequeue (): T {
    return this.internal_array.shift();
  }
  dequeueMultiple (count: number): T[] {
    let result = new Array<T>(count);
    if (this.internal_array.length < count) throw `count: ${count} is greater than queued items`;
    result = this.internal_array.slice(0, count);
    //TODO - check if im off by one..
    this.internal_array = this.internal_array.slice(count);
    return result;
  }
  size (): number {
    return this.internal_array.length;
  }
  isEmpty (): boolean {
    return this.size() < 1;
  }
}