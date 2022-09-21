let W = 20;
let columns;
let rows;
let v;

function setup() {
  createCanvas(1000, 600);
  columns = floor(width / W);
  rows = floor(height / W);

  v = new Vehicle(10, 110);

  v.ws.onmessage = function (event) {
    const a = JSON.parse(event.data).map((item) =>
      convert_location_to_pixel(item)
    );
    v.path = a;
    v.nextPosition = a[1];
  };

  v2 = new Vehicle(30, 30, 2);
  v2.ws.onmessage = function (event) {
    const a = JSON.parse(event.data).map((item) =>
      convert_location_to_pixel(item)
    );
    v2.path = a;
    v2.nextPosition = a[1];
  };

  v3 = new Vehicle(10, 10, 3);
  v3.ws.onmessage = function (event) {
    const a = JSON.parse(event.data).map((item) =>
      convert_location_to_pixel(item)
    );
    v3.path = a;
    v3.nextPosition = a[1];
  };
}

function draw() {
  background(200);
  drawGrid();

  v.display();
  v.findPath();
  v.move();

  v2.display();
  v2.findPath();
  v2.move();

  v3.display();
  v3.findPath();
  v3.move();
}

const drawGrid = () => {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      fill(255);
      stroke(0);
      rect(i * W, j * W, W - 1, W - 1);
    }
  }
};
