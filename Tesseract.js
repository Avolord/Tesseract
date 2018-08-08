let ortho = () => Matrix.fromArray([
  [1, 0, 0],
  [0, 1, 0]
]);

let stereo = Vec => Matrix.fromArray([
  [1 / (distance - Vec.z), 0, 0],
  [0, 1 / (distance - Vec.z), 0]
]);

let METHOD = stereo;

class Box {
  constructor(x = 0, y = 0, z = 0, size = 50) {
    if (x instanceof V3D) {
      this.center = x.clone();
      this.size = y;
    } else {
      this.center = new V3D(x, y, z);
      this.size = size;
    }
    this.build_vertices();
    this.build_edges();
    this.method = METHOD;
  }

  build_vertices() {
    // this.vertices = [];
    let start = this.center.sub(this.size / 2);
    // for (let x_ = 0; x_ <= 1; x_++) {
    //   for (let y_ = 0; y_ <= 1; y_++) {
    //     for (let z_ = 0; z_ <= 1; z_++) {
    //       this.vertices.push(start.add(new V3D(x_ * this.size, y_ * this.size, z_ * this.size)));
    //     }
    //   }
    // }
    this.vertices = new Array(8);
    this.vertices[0] = start.clone();
    this.vertices[1] = start.addX(this.size);
    this.vertices[2] = start.addX(this.size).addY(this.size);
    this.vertices[3] = start.addY(this.size);
    this.vertices[4] = start.addZ(this.size)
    this.vertices[5] = start.addX(this.size).addZ(this.size);
    this.vertices[6] = start.addX(this.size).addY(this.size).addZ(this.size);
    this.vertices[7] = start.addY(this.size).addZ(this.size);
  }

  build_edges() {
    let connections = [];
    for (let i = 0; i < 4; i++) {
      connections.push([i, (i + 1) % 4]);
      connections.push([(i + 4), ((i + 1) % 4) + 4]);
      connections.push([i, (i + 4)]);
    }
    this.edges = connections;
  }

  rotateZ(angle = 0) {
    this.vertices = this.vertices.map(vert =>
      vert.rotateZ(angle)
    );
  }

  rotateY(angle = 0) {
    this.vertices = this.vertices.map(vert =>
      vert.rotateY(angle)
    );
  }

  rotateX(angle = 0) {
    this.vertices = this.vertices.map(vert =>
      vert.rotateX(angle)
    );
  }

  draw(scaling = 1) {
    this.edges.forEach(edge => {
      let P1 = this.vertices[edge[0]];
      let P2 = this.vertices[edge[1]];
      P1.connectV3D(P2, scaling, this.method);
    });
    this.vertices.forEach((vert, i) => {
      vert.showV3D(scaling, this.method);
    })
  }
}

class Tesseract {
  constructor(x = 0, y = 0, z = 0, w = 0, size = 50) {
    if (x instanceof V4D) {
      this.center = x.clone();
      this.size = y;
    } else {
      this.center = new V4D(x, y, z, w);
      this.size = size;
    }
    this.build_vertices();
    this.build_edges();
    this.method = METHOD4D;
  }

  build_vertices() {
    let start = this.center.sub(this.size / 2);
    this.vertices = new Array(16);
    this.vertices[0] = start.clone(); //0,0,0
    this.vertices[1] = start.add(new V4D(this.size, 0, 0, 0)); //1,0,0
    this.vertices[2] = start.add(new V4D(this.size, this.size, 0, 0)); //1,1,0
    this.vertices[3] = start.add(new V4D(0, this.size, 0, 0)); //0,1,0
    this.vertices[4] = start.add(new V4D(0, 0, this.size, 0)); //0,0,1;
    this.vertices[5] = start.add(new V4D(this.size, 0, this.size, 0)); //1,0,1
    this.vertices[6] = start.add(new V4D(this.size, this.size, this.size, 0)); //1,1,1
    this.vertices[7] = start.add(new V4D(0, this.size, this.size, 0)); //0,1,1

    this.vertices[8] = start.add(new V4D(0, 0, 0, this.size));
    this.vertices[9] = start.add(new V4D(this.size, 0, 0, this.size));
    this.vertices[10] = start.add(new V4D(this.size, this.size, 0, this.size));
    this.vertices[11] = start.add(new V4D(0, this.size, 0, this.size));
    this.vertices[12] = start.add(new V4D(0, 0, this.size, this.size));
    this.vertices[13] = start.add(new V4D(this.size, 0, this.size, this.size));
    this.vertices[14] = start.add(new V4D(this.size, this.size, this.size, this.size));
    this.vertices[15] = start.add(new V4D(0, this.size, this.size, this.size));
  }

  draw(scaling = 1) {
    this.edges.forEach(edge => {
      let P1 = this.vertices[edge[0]].transform(this.method);
      let P2 = this.vertices[edge[1]].transform(this.method);
      P1.connectV3D(P2, scaling, METHOD);
    });
    this.vertices.forEach((vert, i) => {
      vert.transform(this.method).showV3D(scaling, METHOD, i);
    })
  }

  move(axys = "x", amount) {
    switch (axys.toLowerCase()) {
      case "x":
        this.vertices = this.vertices.map(vert =>
          vert.add(new V4D(amount, 0, 0, 0))
        );
        break;
      case "y":
        this.vertices = this.vertices.map(vert =>
          vert.add(new V4D(0, amount, 0, 0))
        );
        break;
      case "z":
        this.vertices = this.vertices.map(vert =>
          vert.add(new V4D(0, 0, amount, 0))
        );
        break;
      case "w":
        this.vertices = this.vertices.map(vert =>
          vert.add(new V4D(0, 0, 0, amount))
        );
        break;
    }
  }

  rotate(axys = "x", angle = 0) {
    switch (axys.toLowerCase()) {
      case "x":
        this.vertices = this.vertices.map(vert =>
          vert.rotateX(angle)
        );
        break;
      case "y":
        this.vertices = this.vertices.map(vert =>
          vert.rotateY(angle)
        );
        break;
      case "z":
        this.vertices = this.vertices.map(vert =>
          vert.rotateZ(angle)
        );
        break;
      case "xz":
        this.vertices = this.vertices.map(vert =>
          vert.rotateXZ(angle)
        );
        break;
      case "xy":
        this.vertices = this.vertices.map(vert =>
          vert.rotateXY(angle)
        );
        break;
      case "yz":
        this.vertices = this.vertices.map(vert =>
          vert.rotateYZ(angle)
        );
        break;
      case "xyzw":
        this.vertices = this.vertices.map(vert =>
          vert.rotateXYZW(angle)
        );
        break;
      case "c":
        this.vertices = this.vertices.map(vert =>
          vert.rotateC(angle)
        );
        break;
    }
  }

  build_edges() {
    let connections = [];
    for (let i = 0; i < 4; i++) {
      connections.push([i, (i + 1) % 4]);
      connections.push([(i + 4), ((i + 1) % 4) + 4]);
      connections.push([i, (i + 4)]);

      connections.push([i+8, (i + 1) % 4+8]);
      connections.push([(i + 12), ((i + 1) % 4) + 12]);
      connections.push([i+8, (i + 12)]);

      connections.push([i, i+8]);
      connections.push([i+4, i+12]);
    }

    this.edges = connections;
  }

}
