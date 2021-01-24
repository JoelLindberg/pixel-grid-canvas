class PixelGrid {
    constructor(drawingArea, drawingGrid) {
        this.isDrawing = false;
        this.onCanvas = false;
        this.color = "#000000"; // used to set pen or fill tool color
        this.erase = false;
        // Foreground drawing layer
        this.canvas = document.getElementById(drawingArea);
        this.ctx = this.canvas.getContext('2d', { alpha: true });
        // Background layer
        this.canvasGrid = document.getElementById(drawingGrid); // previously this.canvasBackground
        this.ctxGrid = this.canvasGrid.getContext('2d', { alpha: true }); // previously this.ctxBackground
        this.canvasW = this.canvas.width;
        this.canvasH = this.canvas.height;
        this.pixelRes = 25; // canvas width and height must be divisible by this value
        this.pixelDrawSize = this.pixelRes - 2; // mark as private/not to be changed. should optimally be 2 but the lines look too thick then
        this.pixelDrawOffset = 1; // mark as private/not to be changed
    }

    setupCanvas() {
        this.fillCanvas();
        this.drawGrid();
    }

    fillCanvas() {
        this.ctxGrid.fillStyle = "#535353";
        this.ctxGrid.fillRect(0, 0, this.canvasW, this.canvasH);
    }

    drawGrid() {
        let numOfGridsX = this.canvasW / this.pixelRes;
        let numOfGridsY = this.canvasH / this.pixelRes;
        this.ctxGrid.beginPath();
        this.ctxGrid.setLineDash([1, 2]); // width, space
        this.ctxGrid.strokeStyle = "#939393";
        this.ctxGrid.lineWidth = 2;
        let xpos = 0;
        for (let xcount = 0; xcount <= numOfGridsX; xcount++) {
            this.ctxGrid.moveTo(xpos, 0);
            this.ctxGrid.lineTo(xpos, this.canvasH);
            this.ctxGrid.stroke();
            xpos += this.pixelRes;
        }
        let ypos = 0;
        for (let ycount = 0; ycount <= numOfGridsY; ycount++) {
            this.ctxGrid.moveTo(0, ypos);
            this.ctxGrid.lineTo(this.canvasW, ypos);
            this.ctxGrid.stroke();
            ypos += this.pixelRes;
        }
    }

    setColor(color) {
        this.erase = false;
        this.color = color;
    }

    setErase(erase) {
        this.erase = erase;
    }

    drawPixel(ctx, x, y, color) {
        ctx.fillStyle = color;
        ctx.clearRect(x, y, this.pixelRes, this.pixelRes);
        ctx.fillRect(x + this.pixelDrawOffset, y + this.pixelDrawOffset, this.pixelDrawSize, this.pixelDrawSize);
    }

    erasePixel(ctx, x, y) {
        ctx.clearRect(x, y, this.pixelRes, this.pixelRes);
    }

    clearCanvas() {
        this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
    }

    startEventListeners() {
        this.canvas.addEventListener("mousedown", event => {
            //console.log(`x: ${event.clientX}, y: ${event.clientY}`); // DEBUG
            //console.log(`offsetX: ${event.offsetX}, offsetY: ${event.offsetY}`); // DEBUG
            this.isDrawing = true;
            this.onCanvas = true;
        });
        this.canvas.addEventListener("mousemove", event => {
            if (this.isDrawing === true) {
                if (this.erase != true) {
                    this.drawPixel(this.ctx, (event.offsetX - (event.offsetX % this.pixelRes)), (event.offsetY - (event.offsetY % this.pixelRes)), this.color);
                } else {
                    this.erasePixel(this.ctx, (event.offsetX - (event.offsetX % this.pixelRes)), (event.offsetY - (event.offsetY % this.pixelRes)));
                }
            }
        });
        window.addEventListener("mouseup", event => {
            if (this.isDrawing === true) {
                if (this.erase != true) {
                    // To avoid having a pixel drawn if mouse is released outside of the canvas
                    if (this.onCanvas === true) {
                        this.drawPixel(this.ctx, (event.offsetX - (event.offsetX % this.pixelRes)), (event.offsetY - (event.offsetY % this.pixelRes)), this.color);
                    }
                    this.isDrawing = false;
                } else {
                    if (this.onCanvas === true) {
                        this.erasePixel(this.ctx, (event.offsetX - (event.offsetX % this.pixelRes)), (event.offsetY - (event.offsetY % this.pixelRes)));
                    }
                    this.isDrawing = false;
                }
            }
        });
        this.canvas.addEventListener("mouseleave", event => {
            this.onCanvas = false;
        });
    }
}

pg = new PixelGrid("drawingArea", "drawingGrid");
pg.setupCanvas();
pg.startEventListeners();