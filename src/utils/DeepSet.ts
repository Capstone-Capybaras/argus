import { isEqual } from 'lodash';

export class DeepSet<T> extends Set {
  add(o: T) {
    for (let i of this) if (this.deepCompare(o, i)) return this;
    super.add.call(this, o);
    return this;
  }

  private deepCompare(o: T, i: T) {
    return isEqual(o, i);
  }
}
