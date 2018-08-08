class V3D {
  constructor(x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
  }

  value() {
    return AM.Pythag([this.x, this.y, this.z]);
  }

  valueSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  norm(length) {
    if (length) {
      return this.div(this.value()).mult(length || 1)
    } else {
      return this.div(this.value());
    }
  }

  invert() {
    return new V3D(-this.x, -this.y, -this.z);
  }

  invertX() {
    return new V3D(-this.x, this.y, this.z);
  }

  invertY() {
    return new V3D(this.x, -this.y, this.z);
  }

  invertZ() {
    return new V3D(this.x, this.y, -this.z);
  }

  mix(V2, amount) {
    return this.add(V2.sub(this).mult(amount || 1));
  }

  mixX(V2, amount) {
    return new V3D(this.x + (V2.x - this.x) * (amount || 1), this.y, this.z);
  }

  mixY(V2, amount) {
    return new V3D(this.x, this.y + (V2.y - this.y) * (amount || 1), this.z);
  }

  mixZ(V2, amount) {
    return new V3D(this.x, this.y, this.z + (V2.z - this.z) * (amount || 1));
  }

  limit(value, amount) {
    const x = (this.x > value) ? this.x * amount : this.x;
    const y = (this.y > value) ? this.y * amount : this.y;
    const z = (this.z > value) ? this.z * amount : this.z;
    return new V3D(x, y, z);
  }


  div(v) {
    if (v instanceof V3D) {
      return new V3D(this.x / v.x, this.y / v.y, this.z / v.z);
    } else {
      return new V3D(this.x / v, this.y / v, this.z / v);
    }
  }

  divX(v) {
    if (v instanceof V3D) {
      return new V3D(this.x / v.x, this.y, this.z);
    } else {
      return new V3D(this.x / v, this.y, this.z);
    }
  }

  divY(v) {
    if (v instanceof V3D) {
      return new V3D(this.x, this.y / v.y, this.z);
    } else {
      return new V3D(this.x, this.y / v, this.z);
    }
  }

  divZ(v) {
    if (v instanceof V3D) {
      return new V3D(this.x, this.y, this.z / v.z);
    } else {
      return new V3D(this.x, this.y, this.z / v);
    }
  }

  mult(v) {
    if (v instanceof V3D) {
      return new V3D(this.x * v.x, this.y * v.y, this.z * v.z);
    } else {
      return new V3D(this.x * v, this.y * v, this.z * v);
    }
  }

  multX(v) {
    if (v instanceof V3D) {
      return new V3D(this.x * v.x, this.y, this.z);
    } else {
      return new V3D(this.x * v, this.y, this.z);
    }
  }

  multY(v) {
    if (v instanceof V3D) {
      return new V3D(this.x, this.y * v.y, this.z);
    } else {
      return new V3D(this.x, this.y * v, this.z);
    }
  }

  multZ(v) {
    if (v instanceof V3D) {
      return new V3D(this.x, this.y, this.z * v.z);
    } else {
      return new V3D(this.x, this.y, this.z * v);
    }
  }

  add(v) {
    if (v instanceof V3D) {
      return new V3D(this.x + v.x, this.y + v.y, this.z + v.z);
    } else {
      return new V3D(this.x + v, this.y + v, this.z + v);
    }
  }

  addX(v) {
    if (v instanceof V3D) {
      return new V3D(this.x + v.x, this.y, this.z);
    } else {
      return new V3D(this.x + v, this.y, this.z);
    }
  }

  addY(v) {
    if (v instanceof V3D) {
      return new V3D(this.x, this.y + v.y, this.z);
    } else {
      return new V3D(this.x, this.y + v, this.z);
    }
  }

  addZ(v) {
    if (v instanceof V3D) {
      return new V3D(this.x, this.y, this.z + v.z);
    } else {
      return new V3D(this.x, this.y, this.z + v);
    }
  }

  sub(v) {
    if (v instanceof V3D) {
      return new V3D(this.x - v.x, this.y - v.y, this.z - v.z);
    } else {
      return new V3D(this.x - v, this.y - v, this.z - v);
    }
  }

  subX(v) {
    if (v instanceof V3D) {
      return new V3D(this.x - v.x, this.y, this.z);
    } else {
      return new V3D(this.x - v, this.y, this.z);
    }
  }

  subY(v) {
    if (v instanceof V3D) {
      return new V3D(this.x, this.y - v.y, this.z);
    } else {
      return new V3D(this.x, this.y - v, this.z);
    }
  }

  subZ(v) {
    if (v instanceof V3D) {
      return new V3D(this.x, this.y, this.z - v.z);
    } else {
      return new V3D(this.x, this.y, this.z - v);
    }
  }

  absDiff(V2) {
    return new V3D(Math.abs(this.x - V2.x), Math.abs(this.y - V2.y), Math.abs(this.z - V2.z));
  }

  dotP(V2) {
    return this.x * V2.x + this.y * V2.y + this.z * V2.z;
  }

  crossP(V2) {
    return new V3D(this.y * V2.z - this.z * V2.y, this.z * V2.x - this.x * V2.z, this.x * V2.y - this.y * V2.x);
  }

  Vangle(V2) {
    return AM.radians(AM.acos(this.dotP(V2) / (this.value() * V2.value())));
  }

  dist(V2) {
    return this.absDiff(V2).value();
  }

  distSq(V2) {
    return (this.x - V2.x) * (this.x - V2.x) + (this.y - V2.y) * (this.y - V2.y) + (this.z - V2.z) * (this.z - V2.z);
  }

  distX(V2) {
    return this.x - V2.x;
  }

  distY(V2) {
    return this.y - V2.y;
  }

  distZ(V2) {
    return this.z - V2.z;
  }

  absDistX(V2) {
    return Math.abs(this.x - V2.x);
  }

  absDistY(V2) {
    return Math.abs(this.y - V2.y);
  }

  absDistY(V2) {
    return Math.abs(this.z - V2.z);
  }

  clone() {
    return new V3D(this.x, this.y, this.z);
  }

  copy(V2) {
    this.x = V2.x;
    this.y = V2.y;
    this.z = V2.z;
  }

  copyX(V2) {
    this.x = V2.x;
  }

  copyY(V2) {
    this.x = V2.x;
  }

  copyZ(V2) {
    this.z = V2.z;
  }

  toString() {
    return "=> x:" + this.x + " , y:" + this.y + " , z:" + this.z;
  }

  toArray() {
    return [this.x, this.y, this.z];
  }

  toObject() {
    return {
      x: this.x,
      y: this.y,
      z: this.z
    };
  }

  unfloat() {
    return new V3D(Math.round(this.x), Math.round(this.y), Math.round(this.z));
  }

  max() {
    return new V3D(Math.ceil(this.x), Math.ceil(this.y), Math.ceil(this.z));
  }

  min() {
    return new V3D(Math.floor(this.x), Math.floor(this.y), Math.floor(this.z));
  }

  randomize(topLeftFront, bottomRightBack) {
    return new V3D(AM.RandInt(topLeftFront.x, bottomRightBack.x - topLeftFront.x), AM.RandInt(topLeftFront.y, bottomRightBack.y - topLeftFront.y), AM.RandInt(topLeftFront.z, bottomRightBack.z - topLeftFront.z));
  }

  randomizeY(topLeftFront, bottomRightBack) {
    return new V3D(this.x, AM.RandInt(topLeftFront.y, bottomRightBack.y - topLeftFront.y), this.z);
  }

  randomizeX(topLeftFront, bottomRightBack) {
    return new V3D(AM.RandInt(topLeftFront.x, bottomRightBack.x - topLeftFront.x), this.y, this.z);
  }

  randomizeX(topLeftFront, bottomRightBack) {
    return new V3D(this.x, this.y, AM.RandInt(topLeftFront.z, bottomRightBack.z - topLeftFront.z));
  }


  Orthogonal() {
    return new V3D(-this.y, 0, this.z);
  }

  CheckOrthog(V2) {
    if (this.dotP(V2) == 0)
      return true
    else
      return false
  }

  showV3D(scaling = 1, method, i) {
    if(i == 0 && i)
    this.transformV3D(method).mult(scaling).draw(6, "red");
    else
    this.transformV3D(method).mult(scaling).draw(5, "red");
  }

  connectV3D(V2, scaling = 1, method) {
    let A = this.transformV3D(method).mult(scaling);
    let B = V2.transformV3D(method).mult(scaling);
    A.connect(B, "white");
  }

  transformV3D(method) {
    let point = Matrix.fromArray([this.x, this.y, this.z]);
    let P = Matrix.prod(method(this), point);
    return new V2D(P.data[0][0], P.data[1][0]);
  }

  V3DtoMat() {
    return Matrix.fromArray([this.x, this.y, this.z]);
  }

  MattoV3D(M) {
    return new V3D(M.data[0][0], M.data[1][0], M.data[2][0]);
  }

  rotateZ(angle) {
    let Vec = this.V3DtoMat();
    let matrix = Matrix.fromArray([
      [cos(angle), -sin(angle), 0],
      [sin(angle), cos(angle), 0],
      [0, 0, 1]
    ]);
    return this.MattoV3D(Matrix.prod(matrix, Vec));
  }

  rotateY(angle) {
    let Vec = this.V3DtoMat();
    let matrix = Matrix.fromArray([
      [cos(angle), 0, sin(angle)],
      [0, 1, 0],
      [-sin(angle), 0, cos(angle)]
    ]);
    return this.MattoV3D(Matrix.prod(matrix, Vec));
  }

  rotateX(angle) {
    let Vec = this.V3DtoMat();
    let matrix = Matrix.fromArray([
      [1, 0, 0],
      [0, cos(angle), -sin(angle)],
      [0, sin(angle), cos(angle)]
    ]);
    return this.MattoV3D(Matrix.prod(matrix, Vec));
  }

}
