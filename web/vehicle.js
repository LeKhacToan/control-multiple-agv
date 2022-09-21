class Vehicle {
  constructor(x, y, id = 1) {
    this.x = x;
    this.y = y;
    this.id = id;
    this.speed = 0.5;
    this.available = true;
    this.direction = "N";
    this.path = [];
    this.nextPosition = { x: this.x, y: this.y };
    this.ws = new WebSocket(`ws://localhost:8000/path/${id}`);
    this.flag = false;
    this.goal = { x: parseInt(random(2, 49)), y: parseInt(random(2, 29)) };
  }

  isInNode() {
    const xLocation = (this.x - W / 2) % W === 0;
    const yLocation = (this.y - W / 2) % W === 0;
    return xLocation && yLocation;
  }

  display() {
    stroke(50);
    fill(100);
    if (this.shouldChangeDirection()) {
      this.flag = !this.flag;
    }

    if (this.flag) {
      quad(
        this.x,
        this.y - 5,
        this.x + 10,
        this.y,
        this.x,
        this.y + 5,
        this.x - 10,
        this.y
      );
    } else {
      quad(
        this.x,
        this.y - 10,
        this.x + 5,
        this.y,
        this.x,
        this.y + 10,
        this.x - 5,
        this.y
      );
    }
  }

  findPath() {
    if (this.ws.readyState === WebSocket.OPEN && this.isInNode()) {
      const { x, y } = convert_pixel_to_location({ x: this.x, y: this.y });
      this.ws.send(
        JSON.stringify({
          location: { x, y },
          goal: this.goal,
          direction: this.direction,
        })
      );
    }
  }

  move() {
    if (!this.nextPosition) return;
    const { x, y } = this.nextPosition;

    if (this.x !== x) {
      this.x = this.x < x ? this.x + this.speed : this.x - this.speed;
    }

    if (this.y !== y) {
      this.y = this.y < y ? this.y + this.speed : this.y - this.speed;
    }

    const { x: goalX, y: goalY } = convert_location_to_pixel(this.goal);

    if (this.x === goalX && this.y === goalY) {
      console.log(`NEW TASK AGV ${this.id}`);
      this.goal = { x: parseInt(random(2, 49)), y: parseInt(random(2, 29)) };
    }
  }

  shouldChangeDirection() {
    if (!this.isInNode()) return false;
    if (!this.nextPosition) return false;

    const { x: nextX, y: nextY } = convert_pixel_to_location(this.nextPosition);
    const { x, y } = convert_pixel_to_location({ x: this.x, y: this.y });
    const horizontal = [x - 1, x + 1]; // E W
    const vertical = [y - 1, y + 1]; // N S

    if (horizontal.includes(nextX) && ["N", "S"].includes(this.direction)) {
      this.direction = "E";
      return true;
    }
    if (vertical.includes(nextY) && ["E", "W"].includes(this.direction)) {
      this.direction = "N";
      return true;
    }
    return false;
  }
}

function convert_location_to_pixel(position) {
  return { x: position.x * W + W / 2, y: position.y * W + W / 2 };
}

function convert_pixel_to_location(pixel) {
  const { x, y } = pixel;
  return { x: (x - W / 2) / W, y: (y - W / 2) / W };
}
