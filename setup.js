Animation(true);

let V1 = new V3D(0,0,0);
let V2 = new V4D(0,0,0,0);
let B1 = new Box(V1,1);
let T1 = new Tesseract(V2,1);
let angle = 0.01;

function setup() {
  recordMousePos(Canvas.Element);
  FrameRate = 60;
}

function draw() {
//showV3D(V1);
// B1.rotateX(angle);
// B1.rotateY(angle*2);
// B1.rotateZ(angle*3);
//B1.draw(200);
//T1.rotate("x",angle);
//T1.rotate("y",angle*2);
T1.rotate("c",angle);
T1.draw(600);
  document.getElementById("Count").innerHTML = FPS;
}
