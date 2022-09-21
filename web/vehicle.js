class Vehicle {
  constructor(x, y, id = 1) {
    this.x = x;
    this.y = y;
    this.speed = 1;
    this.available = true;
    this.direction = "N";
    this.path = [];
    this.nextPosition = { x: this.x, y: this.y };
    this.ws = new WebSocket(`ws://localhost:8000/path/${id}`);
    this.flag = false;
  }

  isInNode() {
    const xLocation = (this.x - 10) % 20 === 0;
    const yLocation = (this.y - 10) % 20 === 0;
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
  return { x: position.x * 20 + 10, y: position.y * 20 + 10 };
}

function convert_pixel_to_location(pixel) {
  const { x, y } = pixel;
  return { x: (x - 10) / 20, y: (y - 10) / 20 };
}
