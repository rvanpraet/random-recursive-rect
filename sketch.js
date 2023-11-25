let rows
let cols
let palette
let borderWidth = 100
let randomRect
let randomTriangle
let insideTopLevel
let outsideTopLevel
let padding
let leftBound, rightBound, topBound, bottomBound
let topLeft, topRight, bottomLeft, bottomRight
const TOTAL_FRAMES = 1000

function setup() {
    palette = palette8 // Pick palette
    frameRate(60)
    // Setup canvas // 3840 x 2160 for hi-res
    createCanvas(3000, 4000, P2D);
    // colorMode(ADD)
    // createCanvas(1000, 1000)
    background(palette.bg)


    padding = borderWidth * 0.32
    leftBound = borderWidth + padding
    rightBound = width - borderWidth - padding
    topBound = borderWidth + padding
    bottomBound = height - borderWidth - padding

    topLeft = createVector(borderWidth, borderWidth)
    topRight = createVector(width - borderWidth, borderWidth)
    bottomRight = createVector(width - borderWidth, height - borderWidth)
    bottomLeft = createVector(borderWidth, height - borderWidth)

    d = width * 0.025 * random(-1, 1)
    insideTopLevel = 10
    outsideTopLevel = 6

    randomRect = new RandomRect({
        insideLevel: insideTopLevel,
        outsideLevel: outsideTopLevel,
        d,
        bounds: {
            left: { x1: leftBound, y1: topBound, x2: leftBound, y2: bottomBound },
            right: { x1: rightBound, y1: topBound, x2: rightBound, y2: bottomBound },
            top: { x1: leftBound, y1: topBound, x2: rightBound, y2: topBound },
            bottom: { x1: leftBound, y1: bottomBound, x2: rightBound, y2: bottomBound }
        },
        boundPoints: {
            topLeft,
            topRight,
            bottomLeft,
            bottomRight
        },
        weight: width * 0.01,
        isTopLevel: true
    })

    // randomTriangle = new RandomTriangle({
    //     insideLevel: insideTopLevel,
    //     outsideLevel: outsideTopLevel,
    //     d,
    //     bounds: {
    //         a: { x1: leftBound, y1: topBound, x2: leftBound, y2: bottomBound },
    //         b: { x1: leftBound, y1: topBound, x2: rightBound, y2: topBound },
    //         c: { x1: rightBound, y1: topBound, x2: rightBound, y2: bottomBound },
    //         // bottom: { x1: leftBound, y1: bottomBound, x2: rightBound, y2: bottomBound }
    //     },
    //     boundPoints: {
    //         ab: topLeft,
    //         ac: bottomLeft,
    //         bc: topRight
    //     },
    //     weight: width * 0.005,
    //     isTopLevel: true
    // })

    // randomRect = new RandomRect({
    //     level: 3,
    //     d: width * 0.01,
    //     bounds: {
    //         left: { x1: topLeft.x, y1: topLeft.y, x2: bottomLeft.x, y2: bottomLeft.y },
    //         right: { x1: topRight.x, y1: topRight.y, x2: bottomRight.x, y2: bottomRight.y },
    //         top: { x1: topLeft.x, y1: topLeft.y, x2: topRight.x, y2: topRight.y },
    //         bottom: { x1: bottomLeft.x, y1: bottomLeft.y, x2: bottomRight.x, y2: bottomRight.y }
    //     }
    // })
}

function draw() {
    randomRect.update()
    const hasEnded = randomRect.show()

    // randomTriangle.update()
    // const hasEnded = randomTriangle.show()

    // drawBound()

    if (hasEnded) {
        noLoop()
        save('random_lines.tiff')
    }
}

function drawBound() {

    // push()
    // stroke(palette.dark)
    // strokeWeight(20)
    // line(topLeft.x, topLeft.y, topRight.x, topRight.y)
    // pop()

    if (frameCount < 25) {
        drawLineStroked({
            weight: 30,
            x1: topLeft.x,
            y1: topLeft.y,
            x2: topRight.x,
            y2: topRight.y,
            color: sampleArray(palette.colors),
            alphaRnd: [0.1, 0.35],
            weightRnd: 3,
            probability: 0.1
        })

        drawLineStroked({
            weight: 30,
            x1: topRight.x,
            y1: topRight.y,
            x2: bottomRight.x,
            y2: bottomRight.y,
            color: sampleArray(palette.colors),
            alphaRnd: [0.1, 0.35],
            weightRnd: 3,
            probability: 0.1
        })

        drawLineStroked({
            weight: 30,
            x1: bottomRight.x,
            y1: bottomRight.y,
            x2: bottomLeft.x,
            y2: bottomLeft.y,
            color: sampleArray(palette.colors),
            alphaRnd: [0.1, 0.35],
            weightRnd: 3,
            probability: 0.1
        })

        drawLineStroked({
            weight: 30,
            x1: bottomLeft.x,
            y1: bottomLeft.y,
            x2: topLeft.x,
            y2: topLeft.y,
            color: sampleArray(palette.colors),
            alphaRnd: [0.1, 0.35],
            weightRnd: 3,
            probability: 0.1
        })
    }

    // push()
    // stroke(palette.dark)
    // strokeWeight(borderWidth * 2)
    // noFill()
    // rect(0, 0, width, height)

    // stroke(palette.bg)
    // strokeWeight(borderWidth * 0.05)
    // noFill()
    // const borderOff = borderWidth * 0.05
    // rect(borderWidth + borderOff, borderWidth + borderOff, rightBound - borderWidth - borderOff, bottomBound - borderWidth - borderOff)

    // stroke(palette.bg)
    // strokeWeight(borderWidth * 1.6)
    // noFill()
    // rect(0, 0, width, height)

    // stroke(palette.dark)
    // strokeWeight(borderWidth * .4)
    // noFill()
    // rect(0, 0, width, height)
    // pop()
}

function keyPressed() {
    if (key === 'k') {
        save('random_lines.tiff')
    }
}