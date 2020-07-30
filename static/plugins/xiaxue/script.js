function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;} // Options editor: https://codepen.io/Alca/pen/MWYwxoN
/* requestAnimationFrame(); */

const SPRITE_SIZE = 32;

let flakes = [];
let spritesheet;
let SPRITE_SCALE = 1;
let MAX_FLAKES = 100;
let WIND_SCALE = 1;
let WIND_DENSITY = 1;
let GRAVITY = 1;

let GRAVITY_BASE = 1.5;
let GRAVITY_SPEED = 1.5;

const simplex = new SimplexNoise();

function setup() {
  loadImage('https://cdn.alca.tv/sharex/2019/12/03/2f7ac68a-29ca-4397-8735-f4a7c226834e.png').
  then(img => spritesheet = img);

  // ?sprite_scale=1.0&max_flakes=100&wind_scale=1&wind_density=1
  const _qs = new URLSearchParams(location.search);
  const qs = new URLSearchParams();
  for (const [key, value] of _qs.entries()) {
    qs.append(key.toLowerCase(), value);
  }
  if (qs.has('sprite_scale')) {
    const _val = qs.get('sprite_scale');
    if (_val) {
      const val = parseFloat(_val, 10);
      if (!isNaN(val) && val > 0) {
        SPRITE_SCALE = val;
      }
    }
  }
  if (qs.has('max_flakes')) {
    const _val = qs.get('max_flakes');
    if (_val) {
      const val = parseFloat(_val, 10);
      if (!isNaN(val) && val >= 0) {
        MAX_FLAKES = val;
      }
    }
  }
  if (qs.has('gravity')) {
    const _val = qs.get('gravity');
    if (_val) {
      const val = parseFloat(_val, 10);
      if (!isNaN(val)) {
        GRAVITY = val;
      }
    }
  }
  GRAVITY_BASE *= GRAVITY;
  GRAVITY_SPEED *= GRAVITY;
  if (qs.has('wind_scale')) {
    const _val = qs.get('wind_scale');
    if (_val) {
      const val = parseFloat(_val, 10);
      if (!isNaN(val)) {
        WIND_SCALE = val;
      }
    }
  }
  if (qs.has('wind_density')) {
    const _val = qs.get('wind_density');
    if (_val) {
      const val = parseFloat(_val, 10);
      if (!isNaN(val)) {
        WIND_DENSITY = val;
      }
    }
  }
  if (qs.has('hide_overlay')) {
    const ele = document.querySelector('.overlay');
    ele.remove();
  }

  for (let i = 0; i < MAX_FLAKES; i++) {
    const f = new Snowflake();
    f._pos.setY(
    // random(-SPRITE_SIZE, width),
    random(-SPRITE_SIZE, height));

    flakes.push(f);
  }
}

function draw(e) {
  if (!spritesheet) {
    return;
  }
  // if(flakes.length < MAX_FLAKES) {
  // 	const f = new Snowflake();
  // 	f._pos.set(random(-SPRITE_SIZE, width), -SPRITE_SIZE);
  // 	flakes.push(f);
  // }
  const time = e * 0.001;
  const windTime = time * 0.1 * WIND_DENSITY;
  beginPath();
  for (let i = flakes.length - 1; i >= 0; i--) {
    const f = flakes[i];
    f.update(time, windTime);
    f.draw(time);
    if (
    GRAVITY >= 0 && f.pos.y > height + SPRITE_SIZE ||
    GRAVITY < 0 && f.pos.y < -SPRITE_SIZE)
    {
      // flakes.splice(i, 1);
      f.randomize();
    }
  }
  stroke(hsl(0, 0, 100));
}

const sclRngs = [
[0.12, 0.2], [0.25, 0.4], [0.5, 0.7], [0.8, 1]];


const scales = [
sclRngs[0], sclRngs[0], sclRngs[0],
sclRngs[1], sclRngs[1], sclRngs[1], sclRngs[1],
sclRngs[2], sclRngs[2], sclRngs[2], sclRngs[2],
sclRngs[3], sclRngs[3]];


class Snowflake {


  // scale; img; offset; rot;
  constructor() {_defineProperty(this, "_pos", new Vector());_defineProperty(this, "pos", new Vector());
    this.randomize();
  }
  randomize() {
    this._pos.set(random(-SPRITE_SIZE, width), -SPRITE_SIZE);
    this.scale = SPRITE_SCALE * random(...random(scales));
    this.img = [random([0, 1, 2, 3]), random([0, 1, 2, 3])];
    this.offset = random(10000000);
    this.rot = random(0.1, 1) * PI * random([-1, 1]);
  }
  update(e = performance.now(), windTime) {
    const { _pos, pos, scale, offset } = this;
    let wind = 0;
    if (WIND_SCALE) {
      wind = WIND_SCALE * simplex.noise3D(
      ..._pos._.mult(WIND_DENSITY * 0.0002 * (1 - scale * 0.5)).xy,
      windTime);

    }
    _pos.add(
    wind,
    ease.expo.inOut(scale, GRAVITY_BASE, GRAVITY_SPEED, 1));

    pos.set(_pos).
    add(
    sin(offset + e * scale) * (scale + 1) * 10,
    0);

  }
  draw(e = performance.now()) {
    const { pos, vel, scale: flakeScale, img, offset, rot } = this;
    const size = SPRITE_SIZE * flakeScale;
    push();
    translate(pos);
    rotate(offset * flakeScale + rot * e);
    const r = 0;
    rotate(r);
    scale(sin((e + offset) * rot), 1);
    rotate(-r);
    drawImage(
    spritesheet,
    img[0] * SPRITE_SIZE, img[1] * SPRITE_SIZE,
    SPRITE_SIZE, SPRITE_SIZE,
    -size * 0.5, -size * 0.5,
    size, size);

    pop();
  }}