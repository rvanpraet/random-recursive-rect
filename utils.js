let minX = 0
let maxX = 0

/**
 * Draws a circle based on a certain divisions and will draw lines between the division points
 */
function drawCircle (x, y, r, config) {
    const {
        divisions = 100,
        angle = 0,
        color = '#fff',
        filled = true,
        stroked = false,
        strokeWeight = 1,
        alphaRnd = [0, 1],
        weightRnd = 5,
        probability = 0.5
    } = config

    let theta = TWO_PI / divisions
    const points = []

    // push()
    // translate(x, y)
    // rotate(PI/2 * noise(x * 0.005))
    // rotate(angle)

    for (let i=0; i<divisions; i++) {
        const xCir = cos((theta) * i) * r
        const yCir = sin((theta) * i) * r

        if (!minX || xCir < minX) minX = xCir
        if (!maxX || xCir > maxX) maxX = xCir

        points.push({ x: xCir, y: yCir })
    }

    // Every point on the circle should draw a line inwards over a `strokeWeight` length
    if (stroked) {
        const c = createVector(x, y)

        for (let i=1; i < points.length; i++) {
            const p1 = points[i]

            // Create vectors at the point and center of the circle
            const v = createVector(p1.x, p1.y)
            const a = atan2(v.y - c.y, v.x - c.x) + PI;

            // Calculate the new position based on the angle and distance
            let dx = cos(a) * strokeWeight;
            let dy = sin(a) * strokeWeight;

            // Update the position
            v.add(createVector(dx, dy));

            const p2 = { x: v.x, y: v.y }

            // Get creative with the configuration of drawLine function
            drawLine({
                x1: p1.x,
                y1: p1.y,
                x2: p2.x,
                y2: p2.y,
                color,
                alphaRnd,
                weightRnd,
                probability
            })
        }
    }

    if (filled) {
        for (let i=1; i <= points.length / 2; i++) {
            const p1 = points[i]
            const p2 = points[points.length - i - 1]

            // Get creative with the configuration of drawLine function
            drawLine({
                x1: p1.x,
                y1: p1.y,
                x2: p2.x,
                y2: p2.y,
                color,
                alphaRnd,
                weightRnd,
                probability
            })
        }
    }
    // pop()
}

/**
 * Draw line per point, so you can distort individual points
 *
 */
function drawLine(props) {
    let { x1, x2, y1, y2, color, alphaRnd, weightRnd, probability } = props;

    x1 = floor(x1);
    y1 = floor(y1);
    x2 = floor(x2);
    y2 = floor(y2);

    const drawFn = (x, y) => {
        // // Uncomment if you want to weigh the probability of drawing a point at x, y
        // const maxD = dist(-width * 0.5, -height * 0.5, 0, 0)
        // const weightedProb = prob * d / maxD // Linear weighted probability
        // const weightedProb = prob * Math.exp(-a * d / maxD) // Exponential weighted probability
        // const weightedProb = prob * Math.log(1.2 + d) / Math.log(1.1 + maxD); // Logarithmic weighted probability
        // probability = weightedProb

        if (chance(probability)) {
            const clr = colorAlpha(color, random(alphaRnd))

            push();

            translate(x, y)

            noStroke()
            fill(clr);
            circle(0, 0, random(1, weightRnd))
            pop();
        }
    };

    // Line is not vertical
    if (floor(x1) !== floor(x2)) {
        let y = y1; // Y-Coord starting point
        let yInc = (y2 - y1) / abs(x2 - x1);

        // Left to right
        if (x2 > x1) {
            for (let x = x1; x <= x2; x++) {
                drawFn(x, y);
                y += yInc;
            }
        }
        // Right to left
        else {
            for (let x = x1; x >= x2; x--) {
                drawFn(x, y);
                y += yInc;
            }
        }
    }

    // Line is vertical
    else {
        const x = x1; // x will stay the same

        // Top to bottom
        if (y2 > y1) {
            for (let y = y1; y <= y2; y++) {
                drawFn(x, y);
            }
        }
        // Bottom to top
        else {
            for (let y = y1; y >= y2; y--) {
                drawFn(x, y);
            }
        }
    }
}

/**
 * To draw a stroked line, calculate the start and end points of the parallel lines
 */
function drawLineStroked({ weight, ...props }) {
    const { x1, x2, y1, y2 } = props;

    // Calculate the slope of the original line
    const slope = (y2 - y1) / (x2 - x1);

    // Calculate the perpendicular slope
    const perpendicularSlope = slope === Infinity || slope === 0 ? 0 : -1 / slope;

    // Loop over every parallel line from -weight/2 to weight/2
    for (let d = -floor(weight * 0.5); d <= floor(weight * 0.5); d++) {
        // Calculate unit vector components
        let unitX = d / Math.sqrt(1 + perpendicularSlope ** 2);
        let unitY = perpendicularSlope * unitX;

        // Calculate the starting point (x3, y3)
        let x3 = x1 + unitX;
        let y3 = y1 + unitY;

        // Calculate the ending point (x4, y4)
        let x4 = x2 + unitX;
        let y4 = y2 + unitY;

        drawLine({ ...props, x1: x3, y1: y3, x2: x4, y2: y4 });
    }
}


/**
 * Simple helper function to providing a probability which returns true or false using random
 * @param {*} probability - Value between 0 and 1
 * @returns
 */
function chance(probability = 1) {
    return random() <= probability
}

/**
 * Turns a P5 color value (hex, decimal) into an RGBA color value
 * @param {t} P5.Color - P5 color value
 * @param {*} alpha - Alpha value between 0 and 1
 * @returns RGBA color string
 */
function colorAlpha(aColor, alpha) {
    var c = color(aColor);
    return color('rgba(' +  [red(c), green(c), blue(c), alpha].join(',') + ')');
}

/**
 * Samples a given array using random index
 * @param {*} array - The array to sample
 * @returns
 */
function sampleArray (array = []) {
    const randIdx = ceil(random(0.0001, array.length)) - 1
    return array[randIdx]
}

/**
 * Samples an array using 2D perlin noise, expects
 * @param {*} x
 * @param {*} y
 * @param {*} length
 * @returns
 */
function sampleArrayNoise (x = null, y = null, array = []) {
    if (x === null && y === null) console.error('Provide at least one dimension for sampling with noise')

    let noiseVal

    if (x !== null && y !== null) {
        noiseVal = noise(x, y)
    }
    else if (x !== null) {
        noiseVal = noise(x)
    }
    else if (y !== null) {
        noiseVal = noise(y)
    }

    const noiseIdx = ceil(noiseVal * array.length) - 1
    return array[noiseIdx]
}

/**
 * Samples a random point on a given line
 * @param {*} x1 
 * @param {*} y1 
 * @param {*} x2 
 * @param {*} y2 
 * @returns p5.Vector with the random point
 */
function getRandomPointOnLine(x1, y1, x2, y2) {
    // Generate a random value between 0 and 1
    console.log('making random line', x1, y1, x2, y2);

    let t = random();
    
    // Use the random value to interpolate between the two points
    let x = lerp(x1, x2, t);
    let y = lerp(y1, y2, t);

    
    // Return the random point
    return createVector(x, y);
  }