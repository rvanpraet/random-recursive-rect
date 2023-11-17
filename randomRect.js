class RandomRect {
    constructor(config) {
        const { bounds, d, level, weight = 20, isTopLevel = true } = config

        console.log(bounds, d, level)

        this.weight = weight
        this.childRect = null
        this.level = level
        this.isTopLevel = isTopLevel

        this.d = d
        this.posHistory = {}
        this.leftBound = bounds.left
        this.topBound = bounds.top
        this.rightBound = bounds.right
        this.bottomBound = bounds.bottom

        this.nextBound = 'right'
        this.dirTop = 1
        this.dirRight = 1
        this.dirBottom = 1
        this.dirLeft = 1

        this.fromPos = getRandomPointOnLine(this.topBound.x1, this.topBound.y1, this.topBound.x2, this.topBound.y2)
        this.toPos = null

        this.posHistory.top = this.fromPos
    }

    update() {
        // We're on top, go right
        if (this.nextBound === 'right') {
            if (!this.posHistory.right) {
                this.toPos = getRandomPointOnLine(this.rightBound.x1, this.rightBound.y1, this.rightBound.x2, this.rightBound.y2)
                this.posHistory.right = this.toPos
            } else {
                this.toPos = this.posHistory.right

                // const added = noise(this.fromPos.x * 0.005, this.fromPos.y * 0.005) * d
                // const added = sin(this.fromPos.x * this.fromPos.y) * d * this.level * 2
                const added = this.isTopLevel ? sin(frameCount) * d : 0
                // const added = 0

                if (this.toPos.y + added <= this.topBound || this.toPos.y + added >= this.bottomBound) {
                    this.dirRight *= -1
                } 
                
                this.nextBound = 'bottom'
                this.toPos.y += added  * this.dirRight
            }
        }

        // We're right, go bottom
        else if (this.nextBound === 'bottom') {
            if (!this.posHistory.bottom) {
                this.toPos = getRandomPointOnLine(this.bottomBound.x1, this.bottomBound.y1, this.bottomBound.x2, this.bottomBound.y2)
                this.posHistory.bottom = this.toPos
            } else {
                this.toPos = this.posHistory.bottom

                // const added = noise(this.fromPos.x * 0.005, this.fromPos.y * 0.005) * d
                // const added = cos(this.fromPos.x * this.fromPos.y) * d * 2
                const added = this.isTopLevel ? cos(frameCount) * d : 0
                // const added = 0

                if (this.toPos.x + added <= this.leftBound || this.toPos.x + added >= this.rightBound) {
                    this.dirBottom *= -1
                }
                
                this.toPos.x += added * this.dirBottom
                this.nextBound = 'left'
            }
        }

        // We're bottom, go left
        else if (this.nextBound === 'left') {
            if (!this.posHistory.left) {
                this.toPos = getRandomPointOnLine(this.leftBound.x1, this.leftBound.y1, this.leftBound.x2, this.leftBound.y2)
                this.posHistory.left = this.toPos
            } else {
                this.toPos = this.posHistory.left

                // const added = noise(this.fromPos.x * 0.005, this.fromPos.y * 0.005) * d
                // const added = cos(this.fromPos.x * this.fromPos.y) * d * this.level * 2
                const added = this.isTopLevel ? cos(frameCount) * d : 0
                // const added = 0

                if (this.toPos.y + added <= this.topBound || this.toPos.y + added >= this.bottomBound) {
                    this.dirLeft *= -1
                }

                this.toPos.y += added * this.dirLeft
                this.nextBound = 'top'
            }
        }

        // We're left, go top
        else if (this.nextBound === 'top') {
            if (!this.posHistory.top) {
                this.toPos = createVector(floor(random(this.leftBound, this.rightBound)), this.topBound)
                this.posHistory.top = this.toPos
            } else {
                this.toPos = this.posHistory.top

                // const added = noise(this.fromPos.x * 0.005, this.fromPos.y * 0.005) * d
                // const added = sin(this.fromPos.x * this.fromPos.y) * d * this.level * 2
                const added = this.isTopLevel ? sin(frameCount) * d : 0
                // const added = 0

                if (this.toPos.x + added <= this.leftBound || this.toPos.x + added >= this.rightBound) {
                    this.dirTop *= -1
                } 

                this.toPos.x += added * this.dirTop
                this.nextBound = 'right'
            }
        }
    }


    show() {
        // If we have our full rectangle, create the recursive child rectangle
        if (this.childRect === null && this.level > 1) {
            if (this.posHistory.left && this.posHistory.right && this.posHistory.top && this.posHistory.bottom) {
                this.childRect = new RandomRect({
                    d: floor(random( d * 0.25, d * 0.5 )),
                    level: this.level -1,
                    weight: this.weight * (this.level - 1) / this.level,
                    bounds: {
                        top: { x1: this.posHistory.top.x, y1: this.posHistory.top.y, x2: this.posHistory.right.x, y2: this.posHistory.right.y },
                        right: { x1: this.posHistory.right.x, y1: this.posHistory.right.y, x2: this.posHistory.bottom.x, y2: this.posHistory.bottom.y },
                        bottom: { x1: this.posHistory.bottom.x, y1: this.posHistory.bottom.y, x2: this.posHistory.left.x, y2: this.posHistory.left.y },
                        left: { x1: this.posHistory.left.x, y1: this.posHistory.left.y, x2: this.posHistory.top.x, y2: this.posHistory.top.y },
                    }
                })
            }
        } else if (this.childRect) {
            this.childRect.update()
            this.childRect.show()
        }


        const endAlpha = 0.3 - frameCount * 0.0003
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
            weightRnd: 3,
            probability: 0.3
        })

        // A final update
        this.fromPos = this.toPos
    }
}