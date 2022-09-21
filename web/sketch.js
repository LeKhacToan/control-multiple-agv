let W = 30;
let columns = 50;
let rows = 30;
let v;

function setup() {
  createCanvas(50 * W, rows * W);

  const vLocation = convert_location_to_pixel({ x: 0, y: 1 });
  v = new Vehicle(vLocation.x, vLocation.y);

  v.ws.onmessage = function (event) {
    const a = JSON.parse(event.data).map((item) =>
      convert_location_to_pixel(item)
    );
    v.path = a;
    v.nextPosition = a[1];
  };
  const vLocation2 = convert_location_to_pixel({ x: 10, y: 5 });

  v2 = new Vehicle(vLocation2.x, vLocation2.y, 2);
  v2.ws.onmessage = function (event) {
    const a = JSON.parse(event.data).map((item) =>
      convert_location_to_pixel(item)
    );
    v2.path = a;
    v2.nextPosition = a[1];
  };

  const vLocation3 = convert_location_to_pixel({ x: 5, y: 5 });
  v3 = new Vehicle(vLocation3.x, vLocation3.y, 3);
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
