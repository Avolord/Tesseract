let distance = 1.5;

let ortho4D = () => Matrix.fromArray([
  [1, 0, 0, 0],
  [0, 1, 0, 0],
  [0, 0, 1, 0]
]);

let stereo4D = (Vec) => Matrix.fromArray([
  [1 / (distance - Vec.w), 0, 0, 0],
  [0, 1 / (distance - Vec.w), 0, 0],
  [0, 0, 1 / (distance - Vec.w), 0]
]);

let METHOD4D = stereo4D;

class V4D {
  constructor(x = 0, y = 0, z = 0, w = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  div(v) {
    if (v instanceof V4D) {
      return new V4D(this.x / v.x, this.y / v.y, this.z / v.z, this.w / v.w);
    } else {
      return new V4D(this.x / v, this.y / v, this.z / v, this.w / v);
    }
  }

  mult(v) {
    if (v instanceof V4D) {
      return new V4D(this.x * v.x, this.y * v.y, this.z * v.z, this.w * v.w);
    } else {
      return new V4D(this.x * v, this.y * v, this.z * v, this.w * v);
    }
  }

  add(v) {
    if (v instanceof V4D) {
      return new V4D(this.x + v.x, this.y + v.y, this.z + v.z, this.w + v.w);
    } else {
      return new V4D(this.x + v, this.y + v, this.z + v, this.w + v);
    }
  }

  sub(v) {
    if (v instanceof V4D) {
      return new V4D(this.x - v.x, this.y - v.y, this.z - v.z, this.w - v.w);
    } else {
      return new V4D(this.x - v, this.y - v, this.z - v, this.w - v);
    }
  }

  clone() {
    return new V4D(this.x, this.y, this.z, this.w);
  }

  toMat() {
    return Matrix.fromArray([this.x, this.y, this.z, this.w]);
  }

  static fromMat(M) {
    return new V4D(M.data[0][0], M.data[1][0], M.data[2][0], M.data[3][0]);
  }

  transform(method) {
    let point = this.toMat();
    let P = Matrix.prod(method(this), point);
    return new V3D(P.data[0][0], P.data[1][0], P.data[2][0]);
  }

  rotateZ(angle) {
    let Vec = this.toMat();
    let matrix = Matrix.fromArray([
      [cos(angle), -sin(angle), 0, 0],
      [sin(angle), cos(angle), 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ]);
    return V4D.fromMat(Matrix.prod(matrix, Vec));
  }

  rotateY(angle) {
    let Vec = this.toMat();
    let matrix = Matrix.fromArray([
      [cos(angle), 0, sin(angle), 0],
      [0, 1, 0, 0],
      [-sin(angle), 0, cos(angle), 0],
      [0, 0, 0, 1]
    ]);
    return V4D.fromMat(Matrix.prod(matrix, Vec));
  }

  rotateX(angle) {
    let Vec = this.toMat();
    let matrix = Matrix.fromArray([
      [1, 0, 0, 0],
      [0, cos(angle), -sin(angle), 0],
      [0, sin(angle), cos(angle), 0],
      [0, 0, 0, 1]
    ]);
    return V4D.fromMat(Matrix.prod(matrix, Vec));
  }

  rotateXZ(angle) {
    let Vec = this.toMat();
    let matrix = Matrix.fromArray([
      [1, 0, 0, 0],
      [0, cos(angle), 0, -sin(angle)],
      [0, 0, 1, 0],
      [0, sin(angle), 0, cos(angle)]
    ]);
    return V4D.fromMat(Matrix.prod(matrix, Vec));
  }

  rotateYZ(angle) {
    let Vec = this.toMat();
    let matrix = Matrix.fromArray([
      [cos(angle), 0, 0, -sin(angle)],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [sin(angle), 0, 0, cos(angle)]
    ]);
    return V4D.fromMat(Matrix.prod(matrix, Vec));
  }

  rotateXYZW(angle) {
    let Vec = this.toMat();
    let matrix = Matrix.fromArray([
      [cos(angle), -sin(angle), 0, 0],
      [sin(angle), cos(angle), 0, 0],
      [0, 0, cos(angle), -sin(angle)],
      [0, 0, sin(angle), cos(angle)]
    ]);
    return V4D.fromMat(Matrix.prod(matrix, Vec));
  }

  rotateC(angle) {
    let Vec = this.toMat();
    let matrix = Matrix.fromArray([
      [cos(angle), 0, sin(angle), 0],
      [0, cos(angle), 0, -sin(angle)],
      [-sin(angle), 0, cos(angle), 0],
      [0, sin(angle), 0, cos(angle)]
    ]);
    return V4D.fromMat(Matrix.prod(matrix, Vec));
  }


  // rotateW(angle) {
  //   let Vec = this.toMat();
  //   let matrix = Matrix.fromArray([
  //     [1, 0, 0, 0],
  //     [0, cos(angle), -sin(angle), 0],
  //     [0, sin(angle), cos(angle), 0],
  //     [0, 0, 0, 1]
  //   ]);
  //   return V4D.fromMat(Matrix.prod(matrix, Vec));
  // }
}
