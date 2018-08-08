let ExternalLibrary_AvoLib_has_loaded = true;

let saveFile = function(filename, data) {
  var blob = new Blob([data], {
    type: 'text/csv'
  });
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveBlob(blob, filename);
  } else {
    var elem = window.document.createElement('a');
    elem.href = window.URL.createObjectURL(blob);
    elem.download = filename;
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
  }
}

let mouseX, mouseY, getMousePosition;
mouseX = mouseY = 0;
getMousePosition = false;

function recordMousePos(Obj) {
  getMousePosition = (getMousePosition) ? false : true;
  Obj.onmousemove = function(e) {
    if (!getMousePosition) {
      return
    }
    mouseX = e.pageX - this.offsetLeft;
    mouseY = e.pageY - this.offsetTop;
  }
}

class CanDraw {
  constructor(Width, Height, BackgroundColor, BorderWidth, Id) {
    this.Element = document.createElement("canvas");
    this.Element.id = (Id) ? Id : "canvas";
    document.body.appendChild(this.Element);
    this.Element.width = (Width) ? Width : (window.innerWidth - this.Element.offsetLeft * 4);
    this.Element.height = (Height) ? Height : (window.innerHeight - this.Element.offsetTop * 4);
    this.Element.style.border = (BorderWidth) ? BorderWidth + "px solid black" : undefined;
    this.Element.style.backgroundColor = (BackgroundColor) ? BackgroundColor : "white";
    this.ctx = this.Element.getContext("2d");
    this.translate = {
      x: 0,
      y: 0
    };
    this.Translate(this.Element.width / 2, this.Element.height / 2);
    this.style = "fill";
    this.gradient = this.ctx.createLinearGradient(0, 0, 50, 50);
    this.Pictures = [];
    this.ctx.textAlign = "center";
  }

  Clear() {
    this.ctx.clearRect(-this.translate.x, -this.translate.y, this.Element.width, this.Element.height);
  }

  Gradient(Element, color) {
    const amount = 1 / arguments.length;
    for (let i = 0, n = arguments.length; i < n; i++) {
      this.gradient.addColorStop(amount * i, arguments[i]);
    }
    this.ctx.fillStyle = this.gradient;
  }

  StartDraw(color) {
    if (color) {
      this.ctx.fillStyle = color;
      this.ctx.strokeStyle = color;
    }
    this.ctx.beginPath();
  }

  EndDraw(style) {
    this.ctx.closePath();
    switch (style) {
      case "fill":
        this.ctx.fill();
        break;
      case "stroke":
        this.ctx.stroke();
        break;
    }
  }

  alpha(alpha) {
    this.ctx.globalAlpha = alpha || 1;
  }

  adaptSize() {
    this.Element.width = window.innerWidth - this.Element.offsetLeft * 2;
    this.Element.height = window.innerHeight - this.Element.offsetTop;
  }

  Translate(x_, y_) {
    this.ctx.translate(-this.translate.x, -this.translate.y);
    this.ctx.translate(x_, y_);
    this.translate = {
      x: x_,
      y: y_
    };
  }

  Circle(x, y, r, style, color, alpha = 1) {
    this.StartDraw(color || this.ctx.fillStyle);
    Canvas.alpha(alpha);
    this.ctx.arc(x, y, r, 0, Math.PI * 2);
    this.EndDraw(style || this.style);
    Canvas.alpha();
  }

  Dot(x, y, color, style, alpha = 1) {
    this.StartDraw(color || this.ctx.fillStyle);
    Canvas.alpha(alpha);
    this.ctx.arc(x, y, 2, 0, Math.PI * 2);
    this.EndDraw(style || this.style);
    Canvas.alpha();
  }

  Rectangle(x, y, w, h, style, color, alpha = 1) {
    this.StartDraw(color || this.ctx.fillStyle);
    Canvas.alpha(alpha);
    switch (style || this.style) {
      case "fill":
        this.ctx.fillRect(x, y, w, h);
        break;
      case "stroke":
        this.ctx.strokeRect(x, y, w, h);
        break;
    }
    Canvas.alpha();
  }

  Write(x, y, text, size, color, style, alpha = 1) {
    this.ctx.font = (size || 30) + "px Arial";
    this.ctx.fillStyle = color || this.ctx.fillStyle;
    this.ctx.strokeStyle = color || this.ctx.strokeStyle;
    Canvas.alpha(alpha);
    if (style && style == "stroke") this.ctx.strokeText(text, x, y);
    if (style && style == "fill") this.ctx.fillText(text, x, y);
    if (!style && this.style == "stroke") this.ctx.strokeText(text, x, y);
    if (!style && this.style == "fill") this.ctx.fillText(text, x, y);
  }

  Line(x, y, x2, y2, color, width = 1, alpha = 1) {
    this.StartDraw(color || this.ctx.fillStyle);
    Canvas.alpha(alpha);
    Canvas.ctx.lineWidth = width;
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x2, y2);
    this.EndDraw("stroke");
    Canvas.ctx.lineWidth = 1;
    Canvas.alpha();
  }

  SymPolygon(x_, y_, corners, length, style, color, alpha = 1) {
    this.StartDraw(color || this.ctx.fillStyle);
    Canvas.alpha(alpha);
    let angleAdd = Math.PI * 2 / corners;
    let angle = 0;
    let num = (corners % 2 == 0) ? 2 : 4;
    this.ctx.moveTo(length * Math.cos(angle - angleAdd / num) + x_, Math.sin(angle - angleAdd / num) + y_);
    let x, y;
    for (let i = 0; i < corners + 1; i++) {
      x = length * Math.cos(angle - angleAdd / num) + x_;
      y = length * Math.sin(angle - angleAdd / num) + y_;
      angle += angleAdd;
      this.ctx.lineTo(x, y);
    }
    this.EndDraw(style || this.style);
    Canvas.alpha();
  }

  Picture(src, Id) {
    let Img = document.createElement("image");
    document.body.appendChild(Img);
    Img.Id = Id;
    Img.src = src;
    console.log(Img);
    this.Pictures.push(Img);
  }

}

let line = (x, y, x2, y2, color, width, alpha) => Canvas.Line(x, y, x2, y2, color, width, alpha);
let rect = (x, y, w, h, style, color, alpha) => Canvas.Rectangle(x, y, w, h, style, color, alpha = 1);
let circle = (x, y, r, style, color, alpha) => Canvas.Circle(x, y, r, style, color, alpha);
let dot = (x, y, color, style, alpha) => Canvas.Dot(x, y, color, style, alpha = 1);
let write = (x, y, text, size, color, style, alpha) => Canvas.Write(x, y, text, size, color, style, alpha = 1);


let cos = a => Math.cos(a);
let sin = a => Math.sin(a);
let tan = a => Math.tan(a);
let acos = a => Math.acos(a);
let asin = a => Math.asin(a);
let atan = a => Math.atan(a);
let smooth = a => Math.round(a * 100000) / 100000;

let root = (a, b) => {
  return Math.pow(a, 1 / b);
};

let pow = (a, b) => {
  return Math.pow(a, b);
};

let round = (num, didgets = 1) => {
  return Math.round(num * pow(10, didgets)) / pow(10, didgets);
};

let map = (input, start, stop, min, max) => {
  return (input - start) * ((max - min) / (stop - start)) + min;
};

let random = (min, max) => {
  return Math.floor(min + Math.random() * (max + 1 - min))
};

let random_point_in_circle = max_radius => {
  let theta = 2 * Math.PI * Math.random(); //angle = [0 ; 2PI];
  let radius = Math.random() + Math.random(); // I = [0 ; 2] {2 random function for more "randomness"}
  radius = (radius > 1) ? (2 - radius) * max_radius : radius * max_radius; //mapping to [0 ; 1]
  return new V2D(radius * Math.cos(theta), radius * Math.sin(theta)); //giving out coordinates
};

class AM {

  static calcDist(x, y, x2, y2) {
    return root(pow(x - x2, 2), pow(y - y2, 2));
  }

  static factorial(a) {
    let n = 1;
    for (let i = a; i < 0; i--) {
      n *= i;
    }
    return n
  }

  static PQ(p, q) {
    const a = (-p / 2);
    const b = root(pow((p / 2), 2) - q, 2);
    return [a + b, a - b];
  }

  static DecToFrac(a) {
    let divisor = 1;
    let rest, a_, b_;
    while (!Number.isInteger(a * divisor)) {
      divisor *= 10;
    }
    a_ = a * divisor;
    b_ = divisor;
    do {
      rest = a_ % b_;
      a_ = b_;
      b_ = rest;
    } while (b_ != 0)

    console.log("(" + a * divisor / Math.abs(a_) + " / " + divisor / Math.abs(a_) + ")");
    return {
      a: a * divisor / Math.abs(a_),
      b: divisor / Math.abs(a_)
    };
  }

  //Physics
  static Force(m, a) {
    return m * a
  };
  static Work(F, s, alpha) {
    return F * s * cos(alpha)
  };
  static constacc(v, t) {
    return v / t
  };
  static contacc(a, t) {
    return 0.5 * a * pow(t, 2)
  };
  static vel(s, t) {
    return s / t
  };
  static weight(mass) {
    return mass * World.Grav
  };
  static GravConst() {
    return 6.672 * pow(10, -11)
  };
  static vLight() {
    return 299792458
  };
  static GravForce(mass1, mass2, distance) {
    return (GravConst * mass1 * mass2) / pow(distance, 2)
  }
  //Physics End

  //Waves
  static WaveEquation(ymax, t, T, x, Lambda) {
    return ymax * sin(2 * PI) * (t / T - x / Lambda)
  }
  static Reflexion(alpha) {
    return alpha
  };
  //Waves End

  static Pythag(Arr) {
    return Math.sqrt(Arr.map(x => x * x).reduce((a, b) => a + b, 0));
  }

  static radians(a) {
    return a * (Math.PI / 180)
  };

  static ArrayAdd(A1, A2) {
    if (A1.length != A2.length) {
      return
    }
    return A1.map((x, i) => x + A2[i]);
  }

  static ArraySub(A1, A2) {
    if (A1.length != A2.length) {
      return
    }
    return A1.map((x, i) => x - A2[i]);
  }

  static ArrayMult(Arr, number) {
    return Arr.map(x => x * number);
  }

  static ArrayDiv(Arr, number) {
    return Arr.map(x => x / number);
  }

  static DotProduct(A1, A2) {
    if (A1.length != A2.length) {
      return
    }
    return A1.map((x, i) => x * A2[i]).reduce((a, b) => a + b);
  }

  static randomArray(start, end, length) {
    return new Array(length || 1).fill(random(start || 0, end || 1));
  }

  static countinArr(Arr, entity) {
    let result = Arr.filter(word => word == entity);
    return result.length;
  }

  static copyArray(A) {
    return A.splice(0);
  }

  static Gaussian(A) {
    var n = A.length;
    for (var i = 0; i < n; i++) {
      var maxEl = Math.abs(A[i][i]);
      var maxRow = i;
      for (var k = i + 1; k < n; k++) {
        if (Math.abs(A[k][i]) > maxEl) {
          maxEl = Math.abs(A[k][i]);
          maxRow = k;
        }
      }
      for (var k = i; k < n + 1; k++) {
        var tmp = A[maxRow][k];
        A[maxRow][k] = A[i][k];
        A[i][k] = tmp;
      }
      for (k = i + 1; k < n; k++) {
        var c = -A[k][i] / A[i][i];
        for (var j = i; j < n + 1; j++) {
          if (i == j) {
            A[k][j] = 0;
          } else {
            A[k][j] += c * A[i][j];
          }
        }
      }
    }
    var x = new Array(n);
    for (var i = n - 1; i > -1; i--) {
      x[i] = A[i][n] / A[i][i];
      for (var k = i - 1; k > -1; k--) {
        A[k][n] -= A[k][i] * x[i];
      }
    }
    return x;
  }

  static convertFunc(funcArr, start) {
    let x = (start) ? start : "x";
    let func = "f(" + x + ")=";
    x = (start) ? "*" + start : "x";
    console.log(funcArr);
    for (let i = funcArr.length - 1; i >= 0; i--) {
      if (funcArr[i] == 0) {
        continue
      }
      let curr = (i > 1) ? funcArr[i] + x + AM.AsciiExp(i) + "+" : funcArr[i] + x + "+";
      curr = (i == 1) ? funcArr[i] + "x+" : curr;
      curr = (i == 0) ? funcArr[i] : curr;
      curr = (i == 1 && funcArr[i - 1] == 0) ? funcArr[i] + "x" : curr
      func = func.concat(curr);
    }
    return func;
  }

  static calcFunc(Func, x, show) {
    let result = 0;
    for (let i = Func.length - 1; i > 0; i--) {
      const curr = AM.pow(x, i);
      result += Func[i] * curr;
    }
    result += Func[0];
    if (show == true) {
      console.log(AM.convertFunc(Func, x) + " = " + result);
    }
    return result;
  }

  static derive(Func, amount, show) {
    let result = Func;
    const am = (amount) ? amount : 1;
    for (let z = 0; z < am; z++) {
      for (let i = Func.length - 1; i > 0; i--) {
        result[i] *= i;
      }
      result.splice(0, 1);
    }
    if (show == true) {
      console.log(AM.convertFunc(result))
    }
    return result;
  }

  static primitive(Func, amount, show) {
    let result = Func;
    const am = (amount) ? amount : 1;
    for (let z = 0; z < am; z++) {
      for (let i = Func.length - 1; i > 0; i--) {
        result[i] /= (i + 1);
      }
      result.unshift(0);
    }
    if (show == true) {
      console.log(AM.convertFunc(result))
    }
    return result;
  }

  static Integral(upper, lower, Func) {
    let result;
    const CurrFunc = AM.primitive(Func);
    return AM.calcFunc(CurrFunc, upper) - AM.calcFunc(CurrFunc, lower)
  }

  static calcZero(Func) {
    if (Func.length == 3) {
      return AM.PQ(Func[1], Func[0]);
    }
    if (Func.length == 2) {
      return -Func[0] / Func[1];
    }
  }

  static FuncAreaX(Func) {
    const Zeros = AM.calcZero(Func);
    const upper = (Zeros[0] > Zeros[1]) ? Zeros[0] : Zeros[1];
    const lower = (Zeros[0] < Zeros[1]) ? Zeros[0] : Zeros[1];
    return Math.abs(AM.Integral(upper, lower, Func));
  }

  static AsciiExp(exp) {
    let exponent;
    switch (exp) {
      case 0:
        exponent = "\u2070";
        break;
      case 1:
        exponent = "\u00B9";
        break;
      case 2:
        exponent = "\u00B2";
        break;
      case 3:
        exponent = "\u00B3";
        break;
      case 4:
        exponent = "\u2074"
        break;
      case 5:
        exponent = "\u2075"
        break;
      case 6:
        exponent = "\u2076"
        break;
      case 7:
        exponent = "\u2077"
        break;
      case 8:
        exponent = "\u2078"
        break;
      case 9:
        exponent = "\u2079"
        break;
      default:
        exponent = AM.AsciiExp((exp - exp % 10) / 10) + AM.AsciiExp(exp % 10);
        break;
    }
    return exponent
  }

  static renderHarmonic(type, stepsize) {
    cclear();
    AM.CoordSys();
    stepsize = (stepsize) ? stepsize : 10;
    ctx.translate(c.width / 2, c.height / 2);
    ctx.beginPath();

    switch (type) {
      case "cos":
        ctx.moveTo(-c.width / 2, -AM.cos(-c.width / 2) * stepsize);
        break;
      case "sin":
        ctx.moveTo(-c.width / 2, -AM.sin(-c.width / 2) * stepsize);
        break;
      case "tan":
        ctx.moveTo(-c.width / 2, -AM.tan(-c.width / 2) * stepsize);
        break;
      case "acos":
        ctx.moveTo(-c.width / 2, -AM.acos(-c.width / 2) * stepsize);
        break;
      case "asin":
        ctx.moveTo(-c.width / 2, -AM.asin(-c.width / 2) * stepsize);
        break;
      case "atan":
        ctx.moveTo(-c.width / 2, -AM.atan(-c.width / 2) * stepsize);
        break;
    }
    for (let i = -c.width / 2; i < c.width; i++) {
      switch (type) {
        case "cos":
          ctx.lineTo(i, -AM.cos(i / stepsize) * stepsize);
          break;
        case "sin":
          ctx.lineTo(i, -AM.sin(i / stepsize) * stepsize);;
          break;
        case "tan":
          ctx.lineTo(i, -AM.tan(i / stepsize) * stepsize);
          break;
        case "acos":
          ctx.lineTo(i, -AM.acos(i / stepsize) * stepsize);
          break;
        case "asin":
          ctx.lineTo(i, -AM.asin(i / stepsize) * stepsize);
          break;
        case "atan":
          ctx.lineTo(i, -AM.atan(i / stepsize) * stepsize);
          break;
      }
    }
    ctx.stroke();
    ctx.translate(-c.width / 2, -c.height / 2);
  }

  static renderFunc(Func, stepsize) {
    cclear();
    AM.CoordSys();
    stepsize = (stepsize) ? stepsize : 10;
    ctx.translate(c.width / 2, c.height / 2);
    ctx.beginPath();
    ctx.moveTo(-c.width / 2, -AM.calcFunc(Func, -c.width / 2));
    for (let i = -c.width / 2; i < c.width; i += stepsize) {
      ctx.lineTo(i, -AM.calcFunc(Func, i / stepsize));
    }
    ctx.stroke();
    ctx.translate(-c.width / 2, -c.height / 2);
  }

  static CoordSys() {
    ctx.beginPath();
    ctx.moveTo(0, c.height / 2);
    ctx.lineTo(c.width, c.height / 2);
    ctx.moveTo(c.width / 2, 0);
    ctx.lineTo(c.width / 2, c.height);
    ctx.stroke();
  }

}

let GetMouseCoordinates = (count, Arr) => {
  let MX;
  let MY;
  let active = true;
  let counter = (count) ? count : 1;
  c.onmousedown = function(e) {
    MX = e.pageX - this.offsetLeft - c.width / 2;
    MY = e.pageY - this.offsetTop - c.height / 2;
    if (active) {
      Arr.push([MX, MY]);
      console.log(MX, MY)
    }
    counter--;
    if (counter == 0) {
      active = false
    }
  }
}

/**
 * @version 1.0.0
 * @author AvoLord
 * @description Performs simple matrix math
 */


/**
 * Sets the Error-messages and the state
 */
let Matrix_Class_Error_Message = true;
let WrongType1 = new TypeError("Error, wrong object! The object has to be a matrix or a number.");
let WrongType2 = new TypeError("Error, wrong object! The object has to be a matrix.");
let WrongType3 = new TypeError("Error, wrong object! The object has to be a function.");
let WrongType4 = new TypeError("Error, wrong object! The object has to be an array [of the right type].");
let WrongType5 = new TypeError("Error, wrong object! The object has to be a number.");
let WrongDim1 = new RangeError("Error, wrong dimensions! Amount of columns of A have to be equal to the amount of rows of B.");
let WrongDim2 = new RangeError("Error, wrong dimensions! Matrix has to be quadratic.");
let WrongArrDim = new RangeError("Error, wrong dimensions! Sub arrays have to have the same length.");

/**
 * Creates a new matrix-object with given rows, columns and fill
 * @constructor
 * @param { Number } rows - The amount of rows of the matrix
 * @param { Number } columns - The amount of columns of the matrix
 * @param { Number } fill - The number with wich the matrix will be filled
 */
class Matrix {
  constructor(rows, columns, fill) {
    rows = (Number.isInteger(rows)) ? rows : 3;
    columns = (Number.isInteger(columns)) ? columns : 3;
    fill = (Number.isInteger(fill)) ? fill : 0;
    this.cols = columns;
    this.rows = rows;
    this.data = new Array(this.rows).fill(0).map(cols => new Array(this.cols).fill(fill));
  }

  /**
   * Shows the contents of the matrix in the console
   * @inner
   */
  show() {
    if (console.table) {
      console.table(this.data);
    } else {
      let row_string = "";
      this.data.forEach(row => {
        row_string = row_string.concat("[");
        row.forEach(col => {
          row_string = row_string.concat(" " + col + " ");
        });
        row_string = row_string.concat("]\n");
      });
      console.log(row_string);
    }
  }

  dim() {
    return new Array(this.rows, this.cols);
  }

  /**
   * Toggels if Error messages are displayed
   * @static
   */
  static Error_Message() {
    Matrix_Class_Error_Message = (Matrix_Class_Error_Message) ? false : true;
    console.log((Matrix_Class_Error_Message) ?
      "Error messages are now displayed!" :
      "Error messages are now hidden!"
    );
  }

  /**
   * Creates a random Integer
   * @static
   * @param { Number } min - The minimum random number
   * @param { Number } max - The maximum random number
   * @return { Number } - A random number between min and max
   */
  static randomInt(min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min));
  }

  /**
   * The scalar-multiplication of two arrays seen as vectors
   * @static
   * @param { Object } a1 - The first  array / vector
   * @param { Object } a2 - The second array / vector
   * @return { Object } The scalar-product of two "vectors"
   */
  static array_mult(a1, a2) {
    if (!(a1 instanceof Array) || !(a2 instanceof Array) || a1.length != a2.length) {
      throw WrongType4;
      return null;
    }
    let result = 0;
    a1.forEach((x, i) => {
      result += x * a2[i];
    });
    return result;
  }

  /**
   * Creates matrix-object from a two-dimensional array
   * @static
   * @param { Object } array - The array that will be converted to a matrix
   * @return { Object } A new matrix-object with the values form the array
   */
  static fromArray(array) {
    if (!(array instanceof Array)) {
      throw WrongType4;
      return null;
    }
    if (!(array[0] instanceof Array)) {
      array = array.map(x => new Array(1).fill(x));
    }
    let columns = 1;
    if (array[0] instanceof Array) {
      if (!array.every(x => x.length == array[0].length)) {
        throw WrongArrDim;
        return null;
      } else {
        columns = array[0].length;
      }
    }
    let result = new Matrix(array.length, columns);
    result.data = result.data.map((x, i) => {
      return array[i];
    });
    return result;
  }

  /**
   * Creates a diagnonal matrix-object
   * @static
   * @param { Object } M1 - The matrix that will be cloned and converted
   * @param { Number } diagnonal_num - The number that will fill the diagonal line
   * @param { Number } filler - The number that will fill the result
   * @return { Object } A new matrix with the same dimensions as the input-matrix but with a new set of numbers
   */
  static diagonal(M1, diagonal_num, filler) {
    if (!(M1 instanceof Matrix)) {
      throw WrongType2;
      return null;
    }
    let M2 = M1.copy();
    M2.diagonal(diagonal_num, filler);
    return M2;
  }

  static fill(M1, filler) {
    if (!(M1 instanceof Matrix)) {
      throw WrongType2;
      return null;
    }
    let M2 = M1.copy();
    M2.fill(filler);
    return M2;
  }

  /**
   * Creates a matrix-object with random numbers
   * @static
   * @param { Object } M1 - The matrix that will be cloned and converted
   * @param { Number } min - The minimum random number
   * @param { Number } max - The maximum random number
   * @return { Object } A new matrix with the same dimensions as the input-matrix but with random numbers randing form min to max
   */
  static random(M1, min, max) {
    if (!(M1 instanceof Matrix)) {
      throw WrongType2;
      return null;
    }
    let M2 = M1.copy();
    M2.random(min, max);
    return M2;
  }

  /**
   * Creates a matrix on which a function has been mapped to
   * @static
   * @param { Object } M1 - The Matrix that will be cloned and converted
   * @param { function } func - The function that will alter the elements of the matrix
   * @return { Object } A new matrix with the same dimensions as the input-matrix but with a new set of numbers
   */
  static map(M1, func) {
    if (!(M1 instanceof Matrix)) {
      throw WrongType2;
      return null;
    }
    let M2 = M1.copy();
    M2.map(func);
    return M2;
  }

  static row_map(M1, row, func) {
    if (!(M1 instanceof Matrix) || !M1.data[row]) {
      throw WrongType2;
      return null;
    }
    let M2 = M1.copy();
    M2.row_map(row, func);
    return M2;
  }

  static col_map(M1, col, func) {
    if (!(M1 instanceof Matrix) || !M1.data[0][col]) {
      throw WrongType2;
      return null;
    }
    let M2 = M1.copy();
    M2.col_map(col, func);
    return M2;
  }

  /**
   * Creates a new matrix from the sum of the elements of two matrices or a matrix and a number
   * @static
   * @param { Object } M1 - The matrix that will be cloned and converted
   * @param { Number } Obj - The number that will be added to all elements of the matrix
   * @param { Object } Obj - The matrix whose elements will be added to the elements of M1
   * @return { Object } A new Matrix with the same dimensions as the input Matrix but with a new set of numbers
   */
  static add(M1, Obj) {
    if (!(M1 instanceof Matrix)) {
      throw WrongType2;
      return null;
    }
    let M2 = M1.copy();
    M2.add(Obj);
    return M2;
  }

  /**
   * Creates a new matrix from the difference of the elements of two matrices or a matrix and a number
   * @static
   * @param { Object } M1 - The matrix that will be cloned and converted
   * @param { Number } Obj - The number that will be subtracted from all elements of the matrix
   * @param { Object } Obj - The matrix whose elements will be subtracted from the elements of M1
   * @return { Object } A new Matrix with the same dimensions as the input Matrix but with a new set of numbers
   */
  static sub(M1, Obj) {
    if (!(M1 instanceof Matrix)) {
      throw WrongType2;
      return null;
    }
    let M2 = M1.copy();
    M2.sub(Obj);
    return M2;
  }

  /**
   * Creates a new matrix from the product of the elements of two matrices or a matrix and a number
   * @static
   * @param { Object } M1 - The matrix that will be cloned and converted
   * @param { Number } Obj - The number that will be multiplied with all elements of the matrix
   * @param { Object } Obj - The matrix whose elements will be multiplied by the elements of M1
   * @return { Object } A new Matrix with the same dimensions as the input Matrix but with a new set of numbers
   */
  static mult(M1, Obj) {
    if (!(M1 instanceof Matrix)) {
      throw WrongType2;
      return null;
    }
    let M2 = M1.copy();
    M2.mult(Obj);
    return M2;
  }

  /**
   * Creates a new matrix from the division of the elements of two matrices or a matrix and a number
   * @static
   * @param { Object } M1 - The matrix that will be cloned and converted
   * @param { Number } Obj - The number that will be divided from all elements of the matrix
   * @param { Object } Obj - The matrix whose elements will be divided by the elements of M1
   * @return { Object } A new Matrix with the same dimensions as the input Matrix but with a new set of numbers
   */
  static div(M1, Obj) {
    if (!(M1 instanceof Matrix)) {
      throw WrongType2;
      return null;
    }
    let M2 = M1.copy();
    M2.div(Obj);
    return M2;
  }

  /**
   * Creates a new matrix from the multiplication of two matrices
   * @static
   * @param { Object } M1 - The first matrix
   * @param { Object } M2 - The second matrix that will be multiplied with the first
   * @return { Object } The Product of the matrix multiplication
   */
  static prod(M1, M2) {
    if (!(M1 instanceof Matrix) || !(M2 instanceof Matrix)) {
      throw WrongType2;
      return null;
    }
    if (M1.cols != M2.rows) {
      throw WrongDim1;
      return null;
    }
    let result = new Matrix(M1.rows, M2.cols);
    let helper = M2.transpose();
    result.data = result.data.map((rows, main_index) => {
      return rows.map((col, sub_index) => {
        return Matrix.array_mult(M1.data[main_index], helper.data[sub_index]);
      });
    });
    return result;
  }

  /**
   * Creates a new matrix whose values are inverted
   * @static
   * @param { Object } M1 - The matrix that will be cloned and converted
   * @return { Object } A new matrix with the same dimensions as the input-matrix but with an inverted set of numbers
   */
  static invert(M1) {
    if (!(M1 instanceof Matrix)) {
      throw WrongType2;
      return null;
    }
    let M2 = M1.copy();
    M2.invert();
    return M2;
  }

  /**
   * Randomizes the elements of a matrix
   * @param { Number } min - The minimum random number
   * @param { Number } max - The maximum random number
   */
  random(min, max) {
    this.data = this.data.map(row => row.map(col => Matrix.randomInt(min || 0, max || 1)));
  }

  /**
   * Represents a matrix as a two-dimensional array
   * @return An array with the elements of the input-matrix
   */
  toArray() {
    let result = new Array(this.rows);
    result = this.data.splice(0);
    return result;
  }

  /**
   * Represents a matrix as a one-dimensional array
   * @return An array with the elements of the input-matrix
   */
  toArray_flat() {
    let result = [];
    this.data.forEach(rows => rows.forEach(cols => result.push(cols)));
    return result;
  }

  /**
   * Represents a matrix as a string
   * @return A string with the elements of the input-matrix
   */
  toString() {
    return this.data.toString();
  }

  /**
   * Represents a matrix-object as a JSON-file
   * @return A JSON-file with the elements of the input-matrix-object
   */
  serialize() {
    return JSON.stringify(this);
  }

  /**
   * Creates a new matrix-object from a JSON-file
   * @param data - The JSON-file that contains all the necessary information of a matrix-object
   * @return A new matrix-objet with the information of the JSON-file
   */
  static deserialize(data) {
    if (typeof data == 'string') {
      data = JSON.parse(data);
    }
    let matrix = new Matrix(data.rows, data.cols);
    matrix.data = data.data;
    return matrix;
  }

  /**
   * Creates the sum of all elements of the matrix
   * @return The sum of all the elements of the input-matrix
   */
  reduce() {
    if (Array.flatten) {
      return this.data.flatten().reduce();
    } else {
      let result = 0;
      this.data.forEach(row => {
        row.forEach(col => {
          result += col;
        });
      });
      return result;
    }
  }

  /**
   * Maps a function to all elements of the matrix
   * @param { function } func - The function that will be mapped to the matrix elements
   */
  map(func) {
    if (typeof func != "function") {
      throw WrongType3;
      return null;
    }
    this.data = this.data.map(rows => rows.map(cols => func(cols)));
  }

  row_map(row, func) {
    if (typeof func != "function") {
      throw WrongType3;
      return null;
    }
    this.data[row] = this.data[row].map(cols => func(cols));
  }

  col_map(col, func) {
    if (typeof func != "function") {
      throw WrongType3;
      return null;
    }
    this.data = this.data.map(rows => rows.map((cols, i) => {
      return (i === col) ? func(cols) : cols
    }));
  }

  /**
   * Creates a copy of a matrix-object
   * @return A copy of the input-matrix
   */
  copy() {
    let result = new Matrix(this.rows, this.cols);
    result.data = this.data.slice(0);
    return result;
  }

  /**
   * Converts the matrix to a unit-matrix
   */
  unit() {
    this.data = this.data.map((rows, main_index) => {
      return rows.map((cols, sub_index) => {
        return (sub_index === main_index) ? 1 : 0;
      });
    });
  }

  /**
   * Converts the matrix to a diagonal matrix with custom infill
   * @param { Number } diagonal_num - The value of the diagonal line
   * @param { Number } filler - The value that the other elements will have
   */
  diagonal(diagonal_num, filler) {
    if ((diagonal_num != undefined && typeof diagonal_num != "number") || (filler != undefined && typeof filler != "number")) {
      throw WrongType1;
      return null;
    }
    this.data = this.data.map((rows, main_index) => {
      return rows.map((cols, sub_index) => {
        return (sub_index === main_index) ? (diagonal_num || 1) : (filler || 0);
      });
    });
  }

  fill(filler) {
    if (filler != undefined && typeof filler != "number") {
      throw WrongType1;
      return null;
    }
    this.data = this.data.map((rows, main_index) => {
      return rows.map((cols, sub_index) => {
        return filler || 0;
      });
    });
  }

  /**
   * Creates the transposed version of a matrix
   * @return The transposed matrix
   */
  transpose() {
    let result = new Matrix(this.cols, this.rows);
    result.data = result.data.map((rows, main_index) => {
      return rows.map((cols, sub_index) => {
        return this.data[sub_index][main_index];
      });
    });
    return result;
  }

  /**
   * Inverts the elements of a matrix
   */
  invert() {
    this.data = this.data.map(rows => rows.map(cols => cols * -1));
  }

  /**
   * Adds elements of another matrix or a number to the initial matrix
   * @param { Number } Obj - The number that will be added to all elements of the initial matrix
   * @param { Object } Obj - The matrix whose elements are added to the elements of the initial matrix
   */
  add(Obj) {
    if (Obj instanceof Matrix)
      this.data = this.data.map((rows, main_index) => {
        return rows.map((cols, sub_index) => {
          return cols + (Obj.data[main_index][sub_index] || 0);
        });
      });
    else if (typeof Obj == "number")
      this.data = this.data.map(rows => rows.map(cols => cols + (Obj || 0)));
    else
      throw WrongType1;
  }

  /**
   * Subtracts elements of another matrix or a number from the initial matrix
   * @param { Number } Obj - The number that will be subtracted from all elements of the initial matrix
   * @param { Object } Obj - The matrix whose elements are subtracted from the elements of the initial matrix
   */
  sub(Obj) {
    if (Obj instanceof Matrix)
      this.data = this.data.map((rows, main_index) => {
        return rows.map((cols, sub_index) => {
          return cols - (Obj.data[main_index][sub_index] || 0);
        });
      });
    else if (typeof Obj == "number")
      this.data = this.data.map(rows => rows.map(cols => cols - (Obj || 0)));
    else
      throw WrongType1;
  }

  /**
   * Multiplies elements of another matrix or a number with the initial matrix
   * @param { Number } Obj - The number that will multiply all elements of the initial matrix
   * @param { Object } Obj - The matrix whose elements multiply the elements of the initial matrix
   */
  mult(Obj) {
    if (Obj instanceof Matrix)
      this.data = this.data.map((rows, main_index) => {
        return rows.map((cols, sub_index) => {
          return cols * (Obj.data[main_index][sub_index] || 1);
        });
      });
    else if (typeof Obj == "number")
      this.data = this.data.map(rows => rows.map(cols => cols * (Obj || 1)));
    else
      throw WrongType1;
  }

  /**
   * Divides elements of the initial matrix by the elements of another matrix or number
   * @param { Number } Obj - The number that will divide added to all elements of the initial matrix
   * @param { Object } Obj - The matrix whose elements divide the elements of the initial matrix
   */
  div(Obj) {
    if (Obj instanceof Matrix)
      this.data = this.data.map((rows, main_index) => {
        return rows.map((cols, sub_index) => {
          return cols / (Obj.data[main_index][sub_index] || 1);
        });
      });
    else if (typeof Obj == "number")
      this.data = this.data.map(rows => rows.map(cols => cols / (Obj || 1)));
    else
      throw WrongType1;
  }

  triangle(above = true, below = false) {
    this.data.forEach((row, i) => {
      row.forEach((col, j) => {
        if (i > j && below) { //below-check
          this.data[i][j] = 0;
        }
        if (i < j && above) { //above-check
          this.data[i][j] = 0;
        }
      });
    });
  }

  isTriangle() {
    let below = true;
    let above = true;

    return !this.data.some((row, i) => {
      return row.some((col, j) => {
        if (i > j && below) { //below-check
          below = (col != 0) ? false : true;
        }
        if (i < j && above) { //above-check
          above = (col != 0) ? false : true;
        }
        if (!above && !below)
          return true;
        else
          return false;
      });
    });
  }

  hasEmpty() {
    return (
      this.data.some(row => row.every(num => num == 0)) ||
      this.transpose().data.some(row => row.every(num => num == 0))
    );
  }

  determinant(iterations = 0) { //iterations are an Error-catch so that the function doesn't have too much recursion!
    if (this.cols != this.rows) { //check if it's quadratic
      throw WrongDim2;
    }

    if (iterations > 100) {
      console.log("Uhh..well..something went wrong...I guess?");
      return;
    }

    if (this.isTriangle()) { //Check if it is a triangle-matrix
      let result = 1;
      for (let i = 0; i < this.rows; i++) {
        result *= this.data[i][i];
      }
      return Math.round(result * 1000) / 1000;
    }

    if (this.hasEmpty()) { //Check if a row or collumn consists of zeroes.
      return 0;
    }

    if (this.cols === 2 && this.rows === 2) { //check if it's a 2x2 Matrix
      return this.data[0][0] * this.data[1][1] - this.data[1][0] * this.data[0][1];
    }

    if (this.cols === 3 && this.rows === 3) { //check if it's a 3x3 Matrix [Sarrus-rule]
      return this.data[0][0] * this.data[1][1] * this.data[2][2] +
        this.data[0][1] * this.data[1][2] * this.data[2][0] +
        this.data[0][2] * this.data[1][0] * this.data[2][1] -
        this.data[0][2] * this.data[1][1] * this.data[2][0] -
        this.data[0][0] * this.data[1][2] * this.data[2][1] -
        this.data[0][1] * this.data[1][0] * this.data[2][2];
    }

    //AvoLords aproach to a gauß elimination -> creating a trinagle Matrix [below]
    let M = this.copy();

    let start = 1;

    for (let j = 0; j < M.cols - 1; j++) {

      //-----Error Catch--------
      if (M.data[j][j] == 0) {
        let switchindex = j + 1;
        let M2 = M.copy();

        while (M.data[j][j] == 0) {
          if (switchindex > M.rows - 1)
            if (M.hasEmpty())
              return 0;
            else
              return "Determinant cannot be determined!";
          if (M.data[switchindex][j] != 0) {
            M.data[j] = M2.data[switchindex].map(x => -1 * x);
            M.data[switchindex] = M2.data[j].slice(0);
          }
          switchindex++;
        }
      }
      //------------------------

      for (let i = start; i < M.rows; i++) {
        let temp = M.data[j].slice(0);
        temp = temp.map(x => x * M.data[i][j] / M.data[j][j]);

        M.data[i] = M.data[i].map((x, z) => Math.round((x - temp[z]) * 1000000) / 1000000); //avoiding rounding errors (1.2e-103 != 0)

      }
      start++;
    }
    return M.determinant(iterations + 1);

  }

  solveLGS(iterations) {
    if (this.cols > this.rows + 1) { //check if it has too many variables to solve for
      throw WrongDim1;
    }

    if (iterations > 100) {
      console.log("Uhh..well..something went wrong...I guess?");
      return;
    }

    if (this.isTriangle()) { //Check if it is a triangle-matrix
      //add basic math pls

    }

    let zero_row_index = -1;
    if (b.data.some((row, i) => {
        if (row.every(num => num == 0)) {
          zero_row_index = i;
          return true
        } else
          return false
      })) { //Check if a row consists of zeroes.
      let M = this.copy();
      M.rows--;
      M.data.splice(zero_row_index, 1);
      return M.solveLGS();
    }

    let zero_col_index = -1;
    if (b.transpose().data.some((row, i) => {
        if (row.every(num => num == 0)) {
          zero_col_index = i;
          return true
        } else
          return false
      })) { //Check if a row consists of zeroes.
      let M = this.transpose();
      M.rows--;
      M.data.splice(zero_col_index,1);
      return M.transpose().solveLGS();
    }

    //AvoLords aproach to a gauß elimination -> creating a trinagle Matrix [below]
    let M = this.copy();
    let start = 1;
    for (let j = 0; j < M.cols - 1; j++) {

      //-----Error Catch--------
      if (M.data[j][j] == 0) {
        let switchindex = j + 1;
        let M2 = M.copy();

        while (M.data[j][j] == 0) {
          if (switchindex > M.rows - 1)
            if (M.hasEmpty())
              return "I dont know!";
          if (M.data[switchindex][j] != 0) {
            M.data[j] = M2.data[switchindex].map(x => -1 * x);
            M.data[switchindex] = M2.data[j].slice(0);
          }
          switchindex++;
        }
      }
      //------------------------

      for (let i = start; i < M.rows; i++) {
        let temp = M.data[j].slice(0);
        temp = temp.map(x => x * M.data[i][j] / M.data[j][j]);

        M.data[i] = M.data[i].map((x, z) => Math.round((x - temp[z]) * 1000000) / 1000000); //avoiding rounding errors (1.2e-103 != 0)

      }
      start++;
    }
    return M.solveLGS(iterations + 1);

  }

}



class V2D {
  constructor(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  value() {
    return Math.hypot(this.x, this.y);
  }

  valueSq() {
    return this.x * this.x + this.y * this.y;
  }

  norm(length) {
    if (length) {
      return this.div(this.value()).mult(length || 1)
    } else {
      return this.div(this.value());
    }
  }

  invert() {
    return new V2D(-this.x, -this.y);
  }

  invertX() {
    return new V2D(-this.x, this.y);
  }

  invertY() {
    return new V2D(this.x, -this.y);
  }

  mix(V2, amount) {
    return this.add(V2.sub(this).mult(amount || 1));
  }

  mixX(V2, amount) {
    return new V2D(this.x + (V2.x - this.x) * (amount || 1), this.y);
  }

  mixY(V2, amount) {
    return new V2D(this.x, this.y + (V2.y - this.y) * (amount || 1));
  }

  limit(value, amount) {
    const x = (this.x > value) ? this.x * amount : this.x;
    const y = (this.y > value) ? this.y * amount : this.y;
    return new V2D(x, y);
  }


  div(v) {
    if (v instanceof V2D) {
      return new V2D(this.x / v.x, this.y / v.y);
    } else {
      return new V2D(this.x / v, this.y / v);
    }
  }

  divX(v) {
    if (v instanceof V2D) {
      return new V2D(this.x / v.x, this.y);
    } else {
      return new V2D(this.x / v, this.y);
    }
  }

  divY(v) {
    if (v instanceof V2D) {
      return new V2D(this.x, this.y / v.y);
    } else {
      return new V2D(this.x, this.y / v);
    }
  }

  mult(v) {
    if (v instanceof V2D) {
      return new V2D(this.x * v.x, this.y * v.y);
    } else {
      return new V2D(this.x * v, this.y * v);
    }
  }

  multX(v) {
    if (v instanceof V2D) {
      return new V2D(this.x * v.x, this.y);
    } else {
      return new V2D(this.x * v, this.y);
    }
  }

  multY(v) {
    if (v instanceof V2D) {
      return new V2D(this.x, this.y * v.y);
    } else {
      return new V2D(this.x, this.y * v);
    }
  }

  add(v) {
    if (v instanceof V2D) {
      return new V2D(this.x + v.x, this.y + v.y);
    } else {
      return new V2D(this.x + v, this.y + v);
    }
  }

  addX(v) {
    if (v instanceof V2D) {
      return new V2D(this.x + v.x, this.y);
    } else {
      return new V2D(this.x + v, this.y);
    }
  }

  addY(v) {
    if (v instanceof V2D) {
      return new V2D(this.x, this.y + v.y);
    } else {
      return new V2D(this.x, this.y + v);
    }
  }

  sub(v) {
    if (v instanceof V2D) {
      return new V2D(this.x - v.x, this.y - v.y);
    } else {
      return new V2D(this.x - v, this.y - v);
    }
  }

  subX(v) {
    if (v instanceof V2D) {
      return new V2D(this.x - v.x, this.y);
    } else {
      return new V2D(this.x - v, this.y);
    }
  }

  subY(v) {
    if (v instanceof V2D) {
      return new V2D(this.x, this.y - v.y);
    } else {
      return new V2D(this.x, this.y - v);
    }
  }

  absDiff(V2) {
    return new V2D(Math.abs(this.x - V2.x), Math.abs(this.y - V2.y));
  }

  dotP(V2) {
    return this.x * V2.x + this.y * V2.y;
  }

  crossP(V2) {
    return this.x * V2.x - this.y * V2.y;
  }

  Vangle(V2) {
    return Math.acos(this.dotP(V2) / (this.value() * V2.value()));
  }

  dist(V2) {
    return this.absDiff(V2).value();
  }

  distSq(V2) {
    return (this.x - V2.x) * (this.x - V2.x) + (this.y - V2.y) * (this.y - V2.y);
  }

  distX(V2) {
    return this.x - V2.x;
  }

  distY(V2) {
    return this.y - V2.y;
  }

  absDistX(V2) {
    return Math.abs(this.x - V2.x);
  }

  absDistY(V2) {
    return Math.abs(this.y - V2.y);
  }

  clone() {
    return new V2D(this.x, this.y);
  }

  copy(V2) {
    this.x = V2.x;
    this.y = V2.y;
  }

  copyX(V2) {
    this.x = V2.x;
  }

  copyY(V2) {
    this.x = V2.x;
  }

  show() {
    Canvas.Dot(this.x, this.y);
  }

  toString() {
    return "=> x:" + this.x + " , y:" + this.y;
  }

  toArray() {
    return [this.x, this.y]
  }

  toObject() {
    return {
      x: this.x,
      y: this.y
    }
  }

  unfloat() {
    return new V2D(Math.round(this.x), Math.round(this.y));
  }

  max() {
    return new V2D(Math.ceil(this.x), Math.ceil(this.y));
  }

  min() {
    return new V2D(Math.floor(this.x), Math.floor(this.y));
  }

  randomize(topLeft, bottomRight) {
    return new V2D(AM.RandInt(topLeft.x, bottomRight.x - topLeft.x), AM.RandInt(topLeft.y, bottomRight.y - topLeft.y))
  }

  randomizeX(topLeft, bottomRight) {
    return new V2D(this.x, AM.RandInt(topLeft.y, bottomRight.y - topLeft.y))
  }

  randomizeY(topLeft, bottomRight) {
    return new V2D(AM.RandInt(topLeft.x, bottomRight.x - topLeft.x), this.y)
  }

  Rectangle(Corner2, color, style) {
    Canvas.Rectangle(this.x, this.y, Corner2.distX(this), Corner2.distY(this), style, color);
  }

  CircleCENTER(Corner2, color, style) {
    Canvas.Circle(this.x, this.y, this.dist(Corner2), style, color);
  }

  Circle(Corner2, color, style) {
    let x = this.x + Corner2.distX(this) / 2,
      y = this.y + Corner2.distY(this) / 2,
      r = this.dist(Corner2) / 2;
    Canvas.Circle(x, y, r, style, color);
  }

  draw(size, color) {
    Canvas.Circle(this.x, this.y, size || 5, "", color || "white");
  }

  connect(V2, color, width) {
    Canvas.Line(this.x, this.y, V2.x, V2.y, color || "white", width);
  }

  Orthogonal() {
    return new V2D(-this.y, this.x);
  }

  CheckOrthog(V2) {
    if (this.dotP(V2) == 0)
      return true
    else
      return false
  }

  rotate(angle, length) {
    return new V2D(Math.cos(angle) * (length || 100), Math.sin(angle) * (length || 100));
  }

  rotateAround(V2, angle, length) {
    return new V2D(Math.cos(angle) * (length || 100) + V2.x, Math.sin(angle) * (length || 100) + V2.y);
  }

  SCHNITT(P1, P2, P3) {
    let rv2 = P1.sub(this);
    let rv1 = P3.sub(P2);
    const dx = this.x - P2.x;
    const dy = this.y - P2.y;
    let sol1 = (dy * rv1.x - dx * rv1.y) / ((-rv2.y) * rv1.x + rv2.x * rv1.y);
    let sol2 = ((-rv2.x) * dy + rv2.y * dx) / ((-rv2.x) * rv1.y + rv2.y * rv1.x);
    //Canvas.Dot(this.x+rv2.x*sol1,this.y+rv2.y*sol1,"blue");
    if (!sol1 || !sol2 || sol2 < 0 || sol2 > 1) {
      sol1 = 1.1
    }
    return sol1
  }

}

class Sort {
  static Avo(List) {

    let Arr = List;
    let lowest;
    let result = [];
    let index = 0;

    while (Arr.length > 0) {
      lowest = Arr[0];
      for (let i of Arr) {
        if (Arr[i] <= lowest) {
          index = i;
          lowest = Arr[i];
        }
      }
      result.push(Arr[index]);
      console.log(Arr);
      Arr.splice(index, 1);
      console.log(Arr);
      if (Arr.length == 0) {
        return result
      }
    }
  }

  static Bubble(List) {
    for (let z = 0, n = List.length; z < n; z++) {
      for (let i = 0; i < n; i++) {
        if (List[i] > List[i + 1]) {
          const temp = List[i];
          List[i] = List[i + 1];
          List[i + 1] = temp;
        }
      }
    }
    return List
  }

}

class randVec2D extends V2D {
  constructor(topLeft, bottomRight) {
    super();
    this.x = AM.RandInt(topLeft.x, bottomRight.x - topLeft.x);
    this.y = AM.RandInt(topLeft.y, bottomRight.y - topLeft.y);
  }
}

let Physics2DObjects = [];
let Physics2DGravity = new V2D(0, 9.81);

class Particle2D {
  constructor(x, y, r, mass) {
    this.pos = new V2D(x, y);
    this.vel = new V2D();
    this.acc = new V2D();
    this.mass = mass || 1;
    this.force = new V2D();
    this.rad = r || 10;
    Physics2DObjects.push(this);
  }

  static render(speed) {
    for (let i in Physics2DObjects) {
      Physics2DObjects[i].calcForces(speed || 1);
      Physics2DObjects[i].draw();
      Physics2DObjects[i].acc = new V2D();
      Physics2DObjects[i].force = new V2D();
    }
  }

  calcGravity() {
    this.force = this.force.add(Physics2DGravity.mult(this.mass));
  }

  calcForces(speed) {
    this.calcGravity();
    this.checkGroundCollision();
    this.convertForces(speed);
  }

  convertForces(speed) {
    this.acc = this.force.div(this.mass);
    this.vel = this.vel.add(this.acc);
    this.pos = this.pos.add(this.vel.mult(speed / 60));
  }

  checkGroundCollision() {
    if (this.pos.y + this.rad >= Canvas.Element.height) {
      this.pos = new V2D(this.pos.x, Canvas.Element.height - this.rad);
      this.vel.y *= -1;
    }
    if (this.pos.y - this.rad <= 0) {
      this.pos = new V2D(this.pos.x, 0 + this.rad);
      this.vel.y *= -1;
    }
    if (this.pos.x + this.rad >= Canvas.Element.width) {
      this.pos = new V2D(Canvas.Element.width - this.rad, this.pos.y);
      this.vel.x *= -1;
    }
    if (this.pos.x - this.rad <= 0) {
      this.pos = new V2D(0 + this.rad, this.pos.y);
      this.vel.x *= -1;
    }
  }

  draw() {
    this.pos.draw(this.r, "white");
  }

}

//Easy Animation / Loop

let AnimationLoopVariable;
let ClearCanvasOnLoop = true;
let FrameRate = 60;
let FrameIterator = 60 / FrameRate - 1;
let FPS = FrameRate;
let AvoLoop_before = Date.now();
let AvoLoop_now;

let BenchmarkStartTime = 0;
let BenchmarkStopTime = 0;

function Animation(active) {
  if (active) {
    AnimationLoopVariable = requestAnimationFrame(AnimationLoop);
  } else {
    cancelAnimationFrame(AnimationLoopVariable);
  }
}

function AnimationLoop() {
  if (typeof draw == 'function') {
    if (FrameIterator >= 60 / FrameRate - 1) {
      AvoLoop_now = Date.now();
      FPS = Math.round(1000 / (AvoLoop_now - AvoLoop_before));
      AvoLoop_before = AvoLoop_now;
      if (ClearCanvasOnLoop) {
        Canvas.Clear();
      }
      draw();
      FrameIterator = 0;
    } else
      FrameIterator++;
  }
  AnimationLoopVariable = requestAnimationFrame(AnimationLoop);
}

function benchmark_start() {
  BenchmarkStartTime = new Date().getTime();
}

function benchmark_stop() {
  BenchmarkStopTime = new Date().getTime();
  console.log("Benchmark took : " + (BenchmarkStopTime - BenchmarkStartTime) / 1000 + " Seconds");
}

//Dunnso


class Button {
  constructor(caption, Id, template) {
    const text = document.createTextNode(caption || "Button");
    this.text = caption || "Button";
    this.Element = document.createElement("button");
    this.Element.appendChild(text);
    this.Element.id = (Id) ? Id : "button";
    this.template = template
    document.body.appendChild(this.Element);
  }

}

class Stochastics {
  constructor(InputArray) {
    this.values = Sort.Bubble(InputArray);
    this.amount = InputArray.length;
    this.CalculateDifferent();
    this.CalculateAbsolute();
    this.CalculateRelative();
    this.CalculateAverage();
    this.CalculateDeviation();
    this.CalculateInterval();
    this.CheckGaussian();
  }

  CalculateDifferent() {
    this.diff = [];
    let tempArr = AM.copyArray(this.values);
    let temp = tempArr[tempArr.length - 1];
    while (tempArr.length > 0) {
      this.diff.push(temp)
      for (let i = tempArr.length - 1; i >= 0; i--) {
        if (tempArr[i] == temp) {
          tempArr.pop();
        }
      }
      temp = tempArr[tempArr.length - 1];
    }
    this.diff = Sort.Bubble(this.diff);
  }

  CalculateAbsolute() {
    this.abs = new Array(this.diff.length);
    for (let i in this.diff) {
      this.abs[i] = AM.countinArr(this.values, this.diff[i]);
    }
  }

  CalculateRelative() {
    this.rel = AM.copyArray(this.abs);
    this.rel = AM.ArrayDiv(this.rel, this.amount);
  }

  CalculateAverage() {
    this.average = 0;
    for (let i in this.abs) {
      this.average += this.diff[i] * this.rel[i];
    }
  }

  CalculateDeviation() {
    this.deviation = 0;
    for (let i in this.abs) {
      this.deviation += Math.pow(this.diff[i] - this.average, 2) * this.rel[i];
    }
    this.deviation = Math.sqrt(this.deviation);
  }

  CalculateInterval() {
    this.Interval = {
      min: 0,
      max: 0
    };
    this.Interval.min = this.average - this.deviation;
    this.Interval.max = this.average + this.deviation;
  }

  CheckGaussian() {
    let result = 0;
    for (let i in this.values) {
      if (this.values[i] < this.Interval.min || this.values[i] > this.Interval.max) {
        result++;
      }
    }
    this.PartOfInterval = AM.smooth(1 - result / this.amount);
  }

  createGraphic(x, y, w, h, color1, color2) {
    let width = w / this.diff.length - 2;
    for (let i in this.diff) {
      const offset = (width + 2) * i;
      const size = (h + w) / (4 * 1.2 * this.diff.length);
      Canvas.Rectangle(x + offset, y + h, width, -AM.map(this.rel[i], 0, 1, 0, h), "fill", color2 || "red");
      Canvas.Write(x + offset + width / 2, y + h + size, this.diff[i], size, color1 || "white");
    }
    Canvas.Rectangle(x, y, w, h, "stroke", color1 || "white");
  }



}

function Bernoulli(n, p, a, b) {
  let result = 0;
  for (let i = a; i <= b; i++) {
    result += BernoulliSingleRun(n, i, p);
  }
  return result;
}


function BernoulliSingleRun(n, r, p) {
  let zaehler = 1;
  let nenner = 1;
  for (let i = 1; i <= r; i++) {
    nenner *= i
  }
  for (let i = (n - r) + 1; i <= n; i++) {
    zaehler *= i
  }
  const Coeff = zaehler / nenner;
  return Coeff * Math.pow(p, r) * Math.pow(1 - p, n - r);
}
