let w = 20;
let columns;
let rows;
let v;

function setup() {
  createCanvas(1000, 600);
  columns = floor(width / w);
  rows = floor(height / w);
  console.log(columns, rows);
  v = new Vehicle(10, 110);

  v.ws.onmessage = function (event) {
    const a = JSON.parse(event.data).map((item) =>
      convert_location_to_pixel(item)
    );
    v.path = a;
    v.nextPosition = a[1];
  };
}

function draw() {
  background(200);
  drawGrid();

  v.display();
  v.findPath();
  v.move();
}

const drawGrid = () => {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      fill(255);
      stroke(0);
      rect(i * w, j * w, w - 1, w - 1);
    }
  }
};
