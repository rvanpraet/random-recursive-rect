class RandomTriangle {
    constructor(config) {
        const { bounds, boundPoints, d, insideLevel, outsideLevel, weight = 20, isTopLevel = true, drawingMethod } = config

        this.weight = weight
        this.childInside = null
        this.childrenOutside = []
        this.insideLevel = insideLevel
        this.outsideLevel = outsideLevel
        this.isTopLevel = isTopLevel
        this.drawingMethod = drawingMethod
        this.fillColor = sampleArray(palette.colors)
        this.pointsInside = []

        this.offsetMultiplier = map(this.insideLevel, insideTopLevel, 1, 1, 0.2)
        this.offsetMultiplierOutside = map(this.outsideLevel, outsideTopLevel, 1, 1, 0.2)
        this.pointOffset = d * this.offsetMultiplier
        this.pointOffsetOutside = d * this.offsetMultiplierOutside

        this.posHistory = {}
        this.a_bound = bounds.a
        this.b_bound = bounds.b
        this.c_bound = bounds.c
        this.boundPoints = boundPoints

        this.currentBound = 'a'
        this.dir_a = 1
        this.dir_b = 1
        this.dir_c = 1

        this.fromPos = getRandomPointOnLine(this.a_bound.x1, this.a_bound.y1, this.a_bound.x2, this.a_bound.y2)
        // this.fromPos = findMidpoint(this.boundPoints.ac, this.boundPoints.ab)
        // this.fromPos = findMidpointWithOffset(this.boundPoints.ac, this.boundPoints.ab, this.pointOffset)
        this.toPos = null

        this.posHistory.a = this.fromPos
    }

    // TODO
    _getPointByDrawingMethod(method) {
        const methodMap = {

        }
    }

    update() {
        // We're at A, go to B
        if (this.currentBound === 'a') {
            if (!this.posHistory.b) {
                this.toPos = getRandomPointOnLine(this.b_bound.x1, this.b_bound.y1, this.b_bound.x2, this.b_bound.y2)
                // this.toPos = findMidpoint(this.boundPoints.ab, this.boundPoints.bc)
                // this.toPos = findMidpointWithOffset(this.boundPoints.ab, this.boundPoints.bc, this.pointOffset)
                this.posHistory.b = this.toPos
            } else {
                this.toPos = this.posHistory.b

                // const added = noise(this.fromPos.x * 0.005, this.fromPos.y * 0.005) * d
                // const added = sin(this.fromPos.x * this.fromPos.y) * d * this.level * 2
                const added = sin(frameCount) * this.pointOffset
                // const added = 0

                this.toPos = offsetPointOnLine(this.toPos, this.boundPoints.ab, this.boundPoints.bc, added)

                // TODO CHECK BOUND COLLISION

                this.currentBound = 'b'
            }
        }

        // We're at B, go to C
        else if (this.currentBound === 'b') {
            if (!this.posHistory.c) {
                this.toPos = getRandomPointOnLine(this.c_bound.x1, this.c_bound.y1, this.c_bound.x2, this.c_bound.y2)
                // this.toPos = findMidpoint(this.boundPoints.bc, this.boundPoints.ac)
                // this.toPos = findMidpointWithOffset(this.boundPoints.bc, this.boundPoints.ac, this.pointOffset)
                this.posHistory.c = this.toPos
            } else {
                this.toPos = this.posHistory.c

                // const added = noise(this.fromPos.x * 0.005, this.fromPos.y * 0.005) * d
                // const added = cos(this.fromPos.x * this.fromPos.y) * d * 2
                const added = cos(frameCount) * d * this.offsetMultiplier
                // const added = 0

                this.toPos = offsetPointOnLine(this.toPos, this.boundPoints.bc, this.boundPoints.ac, added)

                // TODO CHECK BOUND COLLISION

                this.currentBound = 'c'
            }
        }

        // We're at C, go to A
        else if (this.currentBound === 'c') {
            if (!this.posHistory.a) {
                // this.toPos = getRandomPointOnLine(this.a_bound.x1, this.a_bound.y1, this.a_bound.x2, this.a_bound.y2)
                // this.toPos = findMidpoint(this.boundPoints.ac, this.boundPoints.ab)
                this.toPos = findMidpointWithOffset(this.boundPoints.ac, this.boundPoints.ab, this.pointOffset)
                this.posHistory.a = this.toPos
            } else {
                this.toPos = this.posHistory.a

                // const added = noise(this.fromPos.x * 0.005, this.fromPos.y * 0.005) * d
                // const added = cos(this.fromPos.x * this.fromPos.y) * d * this.level * 2
                const added = cos(frameCount) * d * this.offsetMultiplier
                // const added = 0

                this.toPos = offsetPointOnLine(this.toPos, this.boundPoints.ac, this.boundPoints.ab, added)

                // TODO CHECK BOUND COLLISION

                this.currentBound = 'a'
            }
        }
    }


    show() {
        // this._checkInsideRecursion()
        if (chance(0.5)) {
            this._checkInsideRecursion()
        }

        // this._checkOutsideRecursion()
        if (chance(0.66)) {
            this._checkOutsideRecursion()
        }

        const endAlpha = 0.4 - frameCount * 0.0004

        if (endAlpha <= 0) {
            return true
        }

        drawLineStroked({
            weight: this.weight,
            x1: this.fromPos.x,
            y1: this.fromPos.y,
            x2: this.toPos.x,
            y2: this.toPos.y,
            color: sampleArray(palette.colors),
            alphaRnd: [0.05, endAlpha],
            weightRnd: 3,
            probability: 0.05
        })

        // Fill the triangle
        if (this.posHistory.a && this.posHistory.b && this.posHistory.c) {

            if (!this.pointsInside.length) {
                this.pointsInside = getPointsInsideTriangle(this.posHistory.a, this.posHistory.b, this.posHistory.c)
            } else {
                const maxAlpha = map(this.insideLevel * this.outsideLevel, insideTopLevel * outsideTopLevel, 1, 0.02, 0.3)
                const probability = map(this.insideLevel * this.outsideLevel, insideTopLevel * outsideTopLevel, 1, 0.0075, 0.05)
                this.pointsInside.forEach(p => {
                    if (chance(probability)) {
                        push()
                        noStroke()
                        fill(colorAlpha(this.fillColor, random(0.01, maxAlpha)))
                        ellipse(p.x, p.y, random(3, 6))
                        pop()
                    }

                })
            }

            // const area = calculateTriangleArea(this.posHistory.a, this.posHistory.b, this.posHistory.c)
            // let alpha = area * 0.0001
            // alpha = constrain(alpha, 0.5, 0.1)

            // console.log(area)
            // console.log(alpha)

            // push()
            // noStroke()
            // fill(colorAlpha(this.fillColor, alpha))
            // triangle(this.posHistory.a.x, this.posHistory.a.y, this.posHistory.b.x, this.posHistory.b.y, this.posHistory.c.x, this.posHistory.c.y)
            // pop()
        }

        // A final update
        this.fromPos = this.toPos
    }

    _checkInsideRecursion() {
        // If we have our full triangle, create the recursive child rectangle inside
        if (this.childInside === null && this.insideLevel > 1) {
            if (this.posHistory.a && this.posHistory.b && this.posHistory.c) {
                this.childInside = new RandomTriangle({
                    d: this.pointOffset,
                    insideLevel: this.insideLevel - 1,
                    outsideLevel: floor(this.insideLevel * 0.5),
                    weight: this.weight * (this.insideLevel - 1) / this.insideLevel,
                    bounds: {
                        a: { x1: this.posHistory.a.x, y1: this.posHistory.a.y, x2: this.posHistory.b.x, y2: this.posHistory.b.y },
                        b: { x1: this.posHistory.b.x, y1: this.posHistory.b.y, x2: this.posHistory.c.x, y2: this.posHistory.c.y },
                        c: { x1: this.posHistory.c.x, y1: this.posHistory.c.y, x2: this.posHistory.a.x, y2: this.posHistory.a.y },
                    },
                    boundPoints: {
                        ab: this.posHistory.b,
                        bc: this.posHistory.c,
                        ac: this.posHistory.a
                    }
                })
            }
        } else if (this.childInside) {
            this.childInside.update()
            this.childInside.show()
        }
    }

    _checkOutsideRecursion() {
        // If we have our full triangle, create the recursive child rectangle inside
        if (this.childrenOutside.length < 1 && this.outsideLevel > 1) {
            if (this.posHistory.a && this.posHistory.b && this.posHistory.c) {
                // Create the child triangle outside, connecting to boundpoint AB
                this.childrenOutside.push(new RandomTriangle({
                    d: this.pointOffsetOutside,
                    insideLevel: floor(this.insideLevel * 0.5),
                    outsideLevel: this.outsideLevel - 1,
                    weight: this.weight * (this.outsideLevel - 1) / this.outsideLevel,
                    bounds: {
                        a: { x1: this.posHistory.a.x, y1: this.posHistory.a.y, x2: this.boundPoints.ab.x, y2: this.boundPoints.ab.y },
                        b: { x1: this.boundPoints.ab.x, y1: this.boundPoints.ab.y, x2: this.posHistory.b.x, y2: this.posHistory.b.y },
                        c: { x1: this.posHistory.b.x, y1: this.posHistory.b.y, x2: this.posHistory.a.x, y2: this.posHistory.a.y },
                    },
                    boundPoints: {
                        ab: this.boundPoints.ab,
                        bc: this.posHistory.b,
                        ac: this.posHistory.a
                    }
                }))

                // Create the child triangle outside, connecting to boundpoint BC
                this.childrenOutside.push(new RandomTriangle({
                    d: this.pointOffsetOutside,
                    insideLevel: floor(this.insideLevel * 0.5),
                    outsideLevel: this.outsideLevel - 1,
                    weight: this.weight * (this.outsideLevel - 1) / this.outsideLevel,
                    bounds: {
                        a: { x1: this.posHistory.b.x, y1: this.posHistory.b.y, x2: this.boundPoints.bc.x, y2: this.boundPoints.bc.y },
                        b: { x1: this.boundPoints.bc.x, y1: this.boundPoints.bc.y, x2: this.posHistory.c.x, y2: this.posHistory.c.y },
                        c: { x1: this.posHistory.c.x, y1: this.posHistory.c.y, x2: this.posHistory.b.x, y2: this.posHistory.b.y },
                    },
                    boundPoints: {
                        ab: this.boundPoints.bc,
                        bc: this.posHistory.c,
                        ac: this.posHistory.b
                    }
                }))

                // Create the child triangle outside, connecting to boundpoint BC
                this.childrenOutside.push(new RandomTriangle({
                    d: this.pointOffsetOutside,
                    insideLevel: floor(this.insideLevel * 0.5),
                    outsideLevel: this.outsideLevel - 1,
                    weight: this.weight * (this.outsideLevel - 1) / this.outsideLevel,
                    bounds: {
                        a: { x1: this.posHistory.c.x, y1: this.posHistory.c.y, x2: this.boundPoints.ac.x, y2: this.boundPoints.ac.y },
                        b: { x1: this.boundPoints.ac.x, y1: this.boundPoints.ac.y, x2: this.posHistory.a.x, y2: this.posHistory.a.y },
                        c: { x1: this.posHistory.a.x, y1: this.posHistory.a.y, x2: this.posHistory.c.x, y2: this.posHistory.c.y },
                    },
                    boundPoints: {
                        ab: this.boundPoints.ac,
                        bc: this.posHistory.a,
                        ac: this.posHistory.c
                    }
                }))
            }
        } else if (this.childrenOutside.length > 0) {
            // show and update every child outside the triangle
            this.childrenOutside.forEach(child => {
                child.update()
                child.show()
            })
        }
    }
}