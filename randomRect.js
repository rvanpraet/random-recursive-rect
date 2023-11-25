class RandomRect {
    constructor(config) {
        const { bounds, boundPoints, d, insideLevel, outsideLevel, weight = 20, isTopLevel = true } = config

        this.weight = weight
        this.childInside = null
        this.childrenOutside = []
        this.insideLevel = insideLevel
        this.outsideLevel = outsideLevel
        this.isTopLevel = isTopLevel

        this.offsetMultiplier = map(this.insideLevel, insideTopLevel, 1, 1, 0.2)
        this.offsetMultiplierOutside = map(this.outsideLevel, outsideTopLevel, 1, 1, 0.2)
        this.pointOffset = d * this.offsetMultiplier
        this.pointOffsetOutside = d * this.offsetMultiplierOutside * 0.1

        this.posHistory = {}
        this.leftBound = bounds.left
        this.topBound = bounds.top
        this.rightBound = bounds.right
        this.bottomBound = bounds.bottom
        this.boundPoints = boundPoints

        this.nextBound = 'right'
        this.dirTop = 1
        this.dirRight = 1
        this.dirBottom = 1
        this.dirLeft = 1

        this.fromPos = getRandomPointOnLine(this.topBound.x1, this.topBound.y1, this.topBound.x2, this.topBound.y2)
        // this.fromPos = findMidpoint(this.boundPoints.topLeft, this.boundPoints.topRight)
        // this.fromPos = findMidpointWithOffset(this.boundPoints.topLeft, this.boundPoints.topRight, this.pointOffset)
        this.toPos = null

        this.posHistory.top = this.fromPos
    }

    update() {
        // We're on top, go right
        if (this.nextBound === 'right') {
            if (!this.posHistory.right) {
                this.toPos = getRandomPointOnLine(this.rightBound.x1, this.rightBound.y1, this.rightBound.x2, this.rightBound.y2)
                // this.toPos = findMidpoint(this.boundPoints.topRight, this.boundPoints.bottomRight)
                // this.toPos = findMidpointWithOffset(this.boundPoints.topRight, this.boundPoints.bottomRight, this.pointOffset)
                this.posHistory.right = this.toPos
            } else {
                this.toPos = this.posHistory.right

                // const added = noise(this.fromPos.x * 0.005, this.fromPos.y * 0.005) * this.d
                // const added = sin(this.fromPos.x * this.fromPos.y) * this.d * this.level * 2
                const added = sin(frameCount) * this.pointOffset
                // const added = 0

                this.toPos = offsetPointOnLine(this.toPos, this.boundPoints.topRight, this.boundPoints.bottomRight, added)

                // if (this.toPos.y + added <= this.topBound || this.toPos.y + added >= this.bottomBound) {
                //     this.dirRight *= -1
                // }

                this.nextBound = 'bottom'
                // this.toPos.y += added  * this.dirRight
            }
        }

        // We're right, go bottom
        else if (this.nextBound === 'bottom') {
            if (!this.posHistory.bottom) {
                this.toPos = getRandomPointOnLine(this.bottomBound.x1, this.bottomBound.y1, this.bottomBound.x2, this.bottomBound.y2)
                // this.toPos = findMidpoint(this.boundPoints.bottomRight, this.boundPoints.bottomLeft)
                // this.toPos = findMidpointWithOffset(this.boundPoints.bottomRight, this.boundPoints.bottomLeft, this.pointOffset)
                this.posHistory.bottom = this.toPos
            } else {
                this.toPos = this.posHistory.bottom

                // const added = noise(this.fromPos.x * 0.005, this.fromPos.y * 0.005) * this.d
                // const added = cos(this.fromPos.x * this.fromPos.y) * this.d * 2
                const added = cos(frameCount) * this.pointOffset
                // const added = 0

                this.toPos = offsetPointOnLine(this.toPos, this.boundPoints.bottomRight, this.boundPoints.bottomLeft, added)

                // if (this.toPos.x + added <= this.leftBound || this.toPos.x + added >= this.rightBound) {
                //     this.dirBottom *= -1
                // }

                this.nextBound = 'left'
                // this.toPos.x += added * this.dirBottom
            }
        }

        // We're bottom, go left
        else if (this.nextBound === 'left') {
            if (!this.posHistory.left) {
                this.toPos = getRandomPointOnLine(this.leftBound.x1, this.leftBound.y1, this.leftBound.x2, this.leftBound.y2)
                // this.toPos = findMidpoint(this.boundPoints.bottomLeft, this.boundPoints.topLeft)
                // this.toPos = findMidpointWithOffset(this.boundPoints.bottomLeft, this.boundPoints.topLeft, this.pointOffset)

                this.posHistory.left = this.toPos
            } else {
                this.toPos = this.posHistory.left

                // const added = noise(this.fromPos.x * 0.005, this.fromPos.y * 0.005) * this.d
                // const added = cos(this.fromPos.x * this.fromPos.y) * this.d * this.level * 2
                const added = cos(frameCount) * this.pointOffset
                // const added = 0

                this.toPos = offsetPointOnLine(this.toPos, this.boundPoints.bottomLeft, this.boundPoints.topLeft, added)

                // if (this.toPos.y + added <= this.topBound || this.toPos.y + added >= this.bottomBound) {
                //     this.dirLeft *= -1
                // }

                this.nextBound = 'top'
                // this.toPos.y += added * this.dirLeft
            }
        }

        // We're left, go top
        else if (this.nextBound === 'top') {
            if (!this.posHistory.top) {
                this.toPos = createVector(floor(random(this.leftBound, this.rightBound)), this.topBound)
                // this.toPos = findMidpoint(this.boundPoints.topLeft, this.boundPoints.topRight)
                // this.toPos = findMidpointWithOffset(this.boundPoints.topLeft, this.boundPoints.topRight, this.pointOffset)
                this.posHistory.top = this.toPos
            } else {
                this.toPos = this.posHistory.top

                // const added = noise(this.fromPos.x * 0.005, this.fromPos.y * 0.005) * this.d
                // const added = sin(this.fromPos.x * this.fromPos.y) * this.d * this.level * 2
                const added = sin(frameCount) * this.pointOffset
                // const added = 0

                this.toPos = offsetPointOnLine(this.toPos, this.boundPoints.topLeft, this.boundPoints.topRight, added)

                // if (this.toPos.x + added <= this.leftBound || this.toPos.x + added >= this.rightBound) {
                //     this.dirTop *= -1
                // }

                this.nextBound = 'right'
                // this.toPos.x += added * this.dirTop
            }
        }
    }


    show() {
        this._checkInsideRecursion()
        // this._checkOutsideRecursion()

        if (chance(0.5)) {
            this._checkOutsideRecursion()
        }

        // if (this.insideLevel < insideTopLevel) {
        //     this._checkOutsideRecursion()
        // }

        const endAlpha = 0.4 - frameCount * 0.0004
        // console.log(endAlpha)
        if (endAlpha <= 0) {
            return true
        }

        // console.log(this.fromPos, this.toPos)

        drawLineStroked({
            weight: this.weight,
            x1: this.fromPos.x,
            y1: this.fromPos.y,
            x2: this.toPos.x,
            y2: this.toPos.y,
            color: sampleArray(palette.colors),
            alphaRnd: [0.05, endAlpha],
            weightRnd: 4,
            probability: 0.1
        })

        // A final update
        this.fromPos = this.toPos
    }

    _checkInsideRecursion() {
        if (this.childInside === null && this.insideLevel > 1) {
            if (this.posHistory.left && this.posHistory.right && this.posHistory.top && this.posHistory.bottom) {
                this.childInside = new RandomRect({
                    d: this.pointOffset,
                    insideLevel: this.insideLevel -1,
                    outsideLevel: floor(this.insideLevel * 0.5),
                    weight: this.weight * (this.insideLevel - 1) / this.insideLevel,
                    bounds: {
                        top: { x1: this.posHistory.top.x, y1: this.posHistory.top.y, x2: this.posHistory.right.x, y2: this.posHistory.right.y },
                        right: { x1: this.posHistory.right.x, y1: this.posHistory.right.y, x2: this.posHistory.bottom.x, y2: this.posHistory.bottom.y },
                        bottom: { x1: this.posHistory.bottom.x, y1: this.posHistory.bottom.y, x2: this.posHistory.left.x, y2: this.posHistory.left.y },
                        left: { x1: this.posHistory.left.x, y1: this.posHistory.left.y, x2: this.posHistory.top.x, y2: this.posHistory.top.y },
                    },
                    boundPoints: {
                        topRight: this.posHistory.right,
                        bottomRight: this.posHistory.bottom,
                        bottomLeft: this.posHistory.left,
                        topLeft: this.posHistory.top,
                    }
                })
            }
        } else if (this.childInside) {
            this.childInside.update()
            this.childInside.show()
        }
    }

    _checkOutsideRecursion() {
        if (this.childrenOutside.length < 1 && this.insideLevel > 1) {
            if (this.posHistory.left && this.posHistory.right && this.posHistory.top && this.posHistory.bottom) {

                const childInsideLevel = this.insideLevel - 2
                const childOutsideLevel = this.outsideLevel - 1

                // Topright triangle corner
                this.childrenOutside.push(new RandomTriangle({
                    d: this.pointOffsetOutside,
                    insideLevel: childInsideLevel,
                    outsideLevel: childOutsideLevel,
                    weight: this.weight * 0.5,
                    bounds: {
                        a: { x1: this.posHistory.top.x, y1: this.posHistory.top.y, x2: this.boundPoints.topRight.x, y2: this.boundPoints.topRight.y },
                        b: { x1: this.boundPoints.topRight.x, y1: this.boundPoints.topRight.y, x2: this.posHistory.right.x, y2: this.posHistory.right.y },
                        c: { x1: this.posHistory.right.x, y1: this.posHistory.right.y, x2: this.posHistory.top.x, y2: this.posHistory.top.y },
                    },
                    boundPoints: {
                        ab: this.boundPoints.topRight,
                        ac: this.posHistory.top,
                        bc: this.posHistory.right,
                    }
                }))

                // Bottomright triangle corner
                this.childrenOutside.push(new RandomTriangle({
                    d: this.pointOffsetOutside,
                    insideLevel: childInsideLevel,
                    outsideLevel: childOutsideLevel,
                    weight: this.weight * 0.5,
                    bounds: {
                        a: { x1: this.posHistory.right.x, y1: this.posHistory.right.y, x2: this.boundPoints.bottomRight.x, y2: this.boundPoints.bottomRight.y },
                        b: { x1: this.boundPoints.bottomRight.x, y1: this.boundPoints.bottomRight.y, x2: this.posHistory.bottom.x, y2: this.posHistory.bottom.y },
                        c: { x1: this.posHistory.bottom.x, y1: this.posHistory.bottom.y, x2: this.posHistory.right.x, y2: this.posHistory.right.y },
                    },
                    boundPoints: {
                        ab: this.boundPoints.bottomRight,
                        ac: this.posHistory.right,
                        bc: this.posHistory.bottom,
                    }
                }))

                // Bottomleft triangle corner
                this.childrenOutside.push(new RandomTriangle({
                    d: this.pointOffsetOutside,
                    insideLevel: childInsideLevel,
                    outsideLevel: childOutsideLevel,
                    weight: this.weight * 0.5,
                    bounds: {
                        a: { x1: this.posHistory.bottom.x, y1: this.posHistory.bottom.y, x2: this.boundPoints.bottomLeft.x, y2: this.boundPoints.bottomLeft.y },
                        b: { x1: this.boundPoints.bottomLeft.x, y1: this.boundPoints.bottomLeft.y, x2: this.posHistory.left.x, y2: this.posHistory.left.y },
                        c: { x1: this.posHistory.left.x, y1: this.posHistory.left.y, x2: this.posHistory.bottom.x, y2: this.posHistory.bottom.y },
                    },
                    boundPoints: {
                        ab: this.boundPoints.bottomLeft,
                        ac: this.posHistory.bottom,
                        bc: this.posHistory.left,
                    }
                }))

                // Topleft triangle corner
                this.childrenOutside.push(new RandomTriangle({
                    d: this.pointOffsetOutside,
                    insideLevel: childInsideLevel,
                    outsideLevel: childOutsideLevel,
                    weight: this.weight * 0.5,
                    bounds: {
                        a: { x1: this.posHistory.left.x, y1: this.posHistory.left.y, x2: this.boundPoints.topLeft.x, y2: this.boundPoints.topLeft.y },
                        b: { x1: this.boundPoints.topLeft.x, y1: this.boundPoints.topLeft.y, x2: this.posHistory.top.x, y2: this.posHistory.top.y },
                        c: { x1: this.posHistory.top.x, y1: this.posHistory.top.y, x2: this.posHistory.left.x, y2: this.posHistory.left.y },
                    },
                    boundPoints: {
                        ab: this.boundPoints.topLeft,
                        ac: this.posHistory.left,
                        bc: this.posHistory.top,
                    }
                }))
            }
        } else if (this.childrenOutside.length > 0) {
            for (const childOutside of this.childrenOutside) {
                childOutside.update()
                childOutside.show()
            }
        }
    }
}