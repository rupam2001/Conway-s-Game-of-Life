function main() {
    const canvas = document.getElementById('playground');
    this.ctx = canvas.getContext("2d");

    this.isLooping = false

    this.loop_t = null;
    this.speed_min_mili = 15000
    this.speed = 50

    this.gen = 0;

    this.CANVAS = {
        width: 2000,
        height: 2000,
        canvas: canvas,
        bgColor: "white",
        gridDims: {
            width: 20,
            height: 20
        },
        gridOutlineColor: "rgb(46, 56, 63)",
        gridOulineWidth: "2",
        gridFillColor: "black"
    }

    this.CANVAS.canvas.height = this.CANVAS.height;
    this.CANVAS.canvas.width = this.CANVAS.width;

    this.ctx.fillStyle = this.CANVAS.bgColor;
    this.ctx.fillRect(0, 0, this.CANVAS.width, this.CANVAS.height);

    this.numrows = parseInt(this.CANVAS.height / this.CANVAS.gridDims.height);
    this.numcols = parseInt(this.CANVAS.width / this.CANVAS.gridDims.width);

    this.getGridMatrix = function (row, col) {
        let _grid = [];

        for (let i = 0; i < row; i++) {
            let arow = []
            for (let j = 0; j < col; j++)
                arow.push(0);
            _grid.push(arow);
        }
        return _grid;
    }




    this.grid = getGridMatrix(this.numrows, this.numcols);

    this.drawGrid = (pos = { x: -1, y: -1 }) => {
        for (let i = 0; i < this.numrows; i++) {
            for (let j = 0; j < this.numcols; j++) {

                let x = j * this.CANVAS.gridDims.width;
                let y = i * this.CANVAS.gridDims.height;

                let ax, bx, cx, dx;
                let ay, by, cy, dy;

                ax = x; ay = y;
                bx = x + this.CANVAS.gridDims.width;; by = y;
                cx = x + this.CANVAS.gridDims.width; cy = y + this.CANVAS.gridDims.height;
                dx = x; dy = y + this.CANVAS.gridDims.height;


                this.ctx.beginPath();
                this.ctx.lineWidth = this.CANVAS.gridOulineWidth;
                this.ctx.strokeStyle = this.CANVAS.gridOutlineColor;

                if ((pos.x > ax && pos.x < bx && pos.y > ay && pos.y < cy) && this.grid[i][j] == 1) {
                    this.grid[i][j] = 0;
                    drawGrid({ x: -1, y: -1 });
                    return
                }
                else if ((pos.x > ax && pos.x < bx && pos.y > ay && pos.y < cy)) {
                    //clicked
                    this.grid[i][j] = 1;
                    this.ctx.fillStyle = this.CANVAS.gridFillColor;
                    this.ctx.fillRect(x, y, this.CANVAS.gridDims.width, this.CANVAS.gridDims.height)
                }
                else if (this.grid[i][j] == 1) {

                    this.ctx.fillStyle = this.CANVAS.gridFillColor;
                    this.ctx.fillRect(x, y, this.CANVAS.gridDims.width, this.CANVAS.gridDims.height)
                }
                else {
                    this.ctx.rect(this.CANVAS.gridDims.width, this.CANVAS.gridDims.height, x, y);
                    this.ctx.stroke();
                }
            }
        }
    }


    this.drawGrid({ x: -1, y: -1 })


    this.copyGrid = function (g) {
        let _grid = [];
        for (let i = 0; i < g.length; i++) {
            let arow = []
            for (let j = 0; j < g[0].length; j++)
                arow.push(g[i][j]);
            _grid.push(arow);
        }
        return _grid;
    }

    this.checkIfAlive = (i, j) => {
        const s =
            ((i - 1) >= 0 && (j - 1) >= 0 ? this.grid[(i - 1)][(j - 1)] : 0)
            + ((i - 1) >= 0 ? this.grid[(i - 1)][j] : 0)
            + ((i - 1) >= 0 && (j + 1) < this.numcols ? this.grid[(i - 1)][(j + 1)] : 0)
            + ((j + 1) < this.numcols ? this.grid[i][(j + 1)] : 0)
            + ((i + 1) < this.numrows && (j + 1) < this.numcols ? this.grid[(i + 1)][(j + 1)] : 0)
            + ((i + 1) < this.numrows ? this.grid[(i + 1)][j] : 0)
            + ((i + 1) < this.numrows && (j - 1) >= 0 ? this.grid[(i + 1)][(j - 1)] : 0)
            + ((j - 1) >= 0 ? this.grid[i][(j - 1)] : 0)

        if (this.grid[i][j] == 1) return s == 2 || s == 3
        return s == 3
    }


    this.gridOperation = () => {
        let res_grid = this.copyGrid(this.grid)
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[0].length; j++) {
                const alive = this.checkIfAlive(i, j);
                if (alive) {
                    res_grid[i][j] = 1;
                } else {
                    res_grid[i][j] = 0;
                }
            }
        }
        return res_grid
    }


    this.gameLoop = () => {

        const loop_speed = this.speed_min_mili / this.speed
        this.loop_t = setInterval(() => {

            this.gen++;

            ctx.clearRect(0, 0, this.CANVAS.width, this.CANVAS.height);

            this.grid = gridOperation()

            drawGrid({ x: -1, y: -1 });

            document.getElementById('gen').innerHTML = `Generation: <br/>  <span>${this.gen}</span>`

        }, loop_speed);
    }

    canvas.addEventListener('mousedown', (e) => {
        let pos = getMousePosition(canvas, e);
        ctx.clearRect(0, 0, this.CANVAS.width, this.CANVAS.height);
        this.drawGrid(pos);
    })

    document.getElementById("start").addEventListener('click', (e) => {
        if (!this.isLooping) {
            //start it
            this.gameLoop()
            this.isLooping = true
            document.getElementById("play-icon").classList.remove("fa-play")
            document.getElementById("play-icon").classList.add("fa-pause")
        } else {
            //stop it
            clearInterval(this.loop_t)
            this.isLooping = false;
            document.getElementById("play-icon").classList.remove("fa-pause")
            document.getElementById("play-icon").classList.add("fa-play")
        }
    })

    document.getElementById("stop").addEventListener('click', (e) => {
        if (this.isLooping) {
            clearInterval(this.loop_t)
            this.isLooping = false;
        }
    })
    document.getElementById("reset").addEventListener('click', (e) => {
        window.location.reload()
        if (this.isLooping) {
            clearInterval(this.loop_t)
            this.isLooping = false;
        }
        grid = this.getGridMatrix(this.numrows, this.numcols);
        drawGrid({ x: -1, y: -1 })
    })

    document.getElementById('speed').addEventListener('change', (e) => {
        console.log(e.target.value)
        // alert(this.speed)
        this.speed = e.target.value
        // document.getElementById("speed_slider").title = e.target.value
    })
}



function getMousePosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    return { x, y };
}

main();


