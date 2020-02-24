const { sin, cos, PI, sqrt } = Math
const TAU = 2 * PI
const canvas = document.getElementsByTagName('canvas')[0]
const _ = canvas.getContext('2d')

const width = canvas.width = window.innerWidth
const height = canvas.height = window.innerHeight

/* ---
  Data
--- */

const data = [
  createCirclesStructure(squareWave),
  createCirclesStructure(triangleWave),
  createCirclesStructure(sawtoothWave),
]

function createCirclesStructure(fn) {
  return {
    circles: fn(),
    points: []
  }
}

function squareWave() {
  const circles = []
  const startingRho = 64

  for (let i = 1; i < 128 + 1; i += 2) {
    circles.push({
      t: PI,
      r: startingRho / i,
      a: i * PI,
    })
  }

  return circles
}

function triangleWave() {
  const circles = []
  const startingRho = 64

  let rho = startingRho

  for (let i = 0; i < 25; i++) {
    const n = 2 * i + 1

    circles.push({
      t: i % 2 ? PI : 0,
      r: rho,
      a: n,
    })

    rho = sqrt(rho)
  }

  return circles
}

function sawtoothWave() {
  const circles = []
  const startingRho = 64

  for (let i = 1; i < 128; i += 1) {
    const n = 2 * i + 1

    circles.push({
      t: 0,
      r: startingRho / i,
      a: i * TAU,
    })
  }
  return circles
}

/* ---
  Update
--- */

function update() {
  data.forEach(({ circles, points }) => {
    circles.forEach(c => {
      c.t += c.a / 100
    })

    points.forEach((p, i) => {
      p.x += 0.5

      if (p.x > width + 1) {
        points.splice(i, 1)
      }
    })
  })
}

/* ---
  Draw
--- */

function draw() {
  _.fillStyle = 'white'
  _.strokeStyle = 'black'
  _.fillRect(0, 0, width, height)

  data.forEach(({ circles, points }, k) => {
    let previousCoordinates = {
      x: width / 3,
      y: (k + 1) * height / (data.length + 1),
    }

    circles.forEach(({ t, r }) => {
      const nextCoordinates = sumPoints(previousCoordinates, polarToCarthesian(t, r))

      drawCircle(previousCoordinates.x, previousCoordinates.y, r, nextCoordinates)

      previousCoordinates = nextCoordinates
    })

    const point = { x: 2 * width / 3, y: previousCoordinates.y }

    _.moveTo(previousCoordinates.x, previousCoordinates.y)
    _.lineTo(point.x, point.y)
    _.stroke()

    points.push(point)

    points.forEach((p, i) => {

      if (i + 1 < points.length && distanceSquared(p, points[i + 1]) > 1) {
        _.moveTo(p.x, p.y)
        _.lineTo(points[i + 1].x, points[i + 1].y)
        _.stroke()
      }
      else {
        drawPoint(p.x, p.y)
      }
    })
  })
}

function drawCircle(x, y, r, p) {
  _.strokeStyle = 'black'
  _.beginPath()
  _.arc(x, y, r, 0, TAU)
  _.closePath()
  _.stroke()
  _.moveTo(x, y)
  _.lineTo(p.x, p.y)
  _.stroke()
}

function drawPoint(x, y) {
  _.fillStyle = 'black'
  _.beginPath()
  _.arc(x, y, 0.5, 0, TAU)
  _.closePath()
  _.fill()
}

/* ---
  Utils
--- */

function sumPoints(a, b) {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
  }
}

function polarToCarthesian(theta, rho) {
  return {
    x: rho * cos(theta),
    y: rho * sin(theta),
  }
}

function distanceSquared(a, b) {
  return (b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y)
}

/* ---
  Loop
--- */

function tick() {
  update()
  draw()
  window.requestAnimationFrame(tick)
}

window.requestAnimationFrame(tick)
