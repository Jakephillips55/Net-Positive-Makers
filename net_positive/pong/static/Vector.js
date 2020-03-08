class Vector {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
  get length() {
      const lengthConst = this.vectorLength();
    return lengthConst;
  }
    vectorLength() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

  set length(value) {
    const factor = value / this.length;
    this.x *= factor;
    this.y *= factor;
  }
}
