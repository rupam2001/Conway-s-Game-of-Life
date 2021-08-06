function main() {
    const canvas = document.getElementById('playground');
    const CANVAS = {
        width: 2000,
        height: 2000,
        canvas: canvas,
        bgColor: "white",
        gridDims: {
            width: 20,
            height: 20
        }
    }




    let ctx = canvas.getContext("2d");

    setDims(CANVAS);

    ctx.fillStyle = CANVAS.bgColor;
    ctx.fillRect(0, 0, CANVAS.width, CANVAS.height);

    const numrows = parseInt(CANVAS.height / CANVAS.gridDims.height);
    const numcols = parseInt(CANVAS.width / CANVAS.gridDims.width);

    const gridMatrix = getGridMatrix(numrows, numcols);


    drawGrid(numrows, numcols, { x: -1, y: -1 }, CANVAS.gridDims, ctx, gridMatrix)

    canvas.addEventListener('mousedown', (e) => {
        let pos = getMousePosition(canvas, e);
        ctx.clearRect(0, 0, CANVAS.width, CANVAS.height);
        drawGrid(numrows, numcols, pos, CANVAS.gridDims, ctx, gridMatrix);
    })

    window.addEventListener('keyup', (e) => {
        if (e.keyCode === 13) {
            loop(ctx, CANVAS, numrows, numcols, gridMatrix, 600);
        }
    })

}


function loop(ctx, CANVAS, numrows, numcols, grid, speed) {
    let counter = 0;
    const t = setInterval(() => {

        ctx.clearRect(0, 0, CANVAS.width, CANVAS.height);

        grid = gridOperation(grid)

        drawGrid(numrows, numcols, { x: -1, y: -1 }, CANVAS.gridDims, ctx, grid);

        counter++;
        if (counter >= 10) {
            // alert("stoped");
            clearInterval(t);
        }
        console.log(counter);


    }, speed);
}

function multiplyMatrixElemWise(m1, m2) {
    let numrows = m1.length;
    let numcols = m1[0].length;

    let m3 = [...m1];

    for (let i = 0; i < numrows; i++) {
        for (let j = 0; j < numcols; j++) {
            if (m3[i][j] == 0) {
                m3[i][j] += m2[i][j];
            } else {
                m3[i][j] *= m2[i][j];
            }
        }
    }
    return m3;
}


function gridOperation(grid) {
    let res_grid = copyGrid(grid)
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            const alive = checkIfAlive(grid, i, j);
            if (alive) {
                res_grid[i][j] = 1;
            } else {
                res_grid[i][j] = 0;
            }
        }
    }
    return res_grid
}

function copyGrid(g) {
    let grid = [];
    for (let i = 0; i < g.length; i++) {
        let arow = []
        for (let j = 0; j < g[0].length; j++)
            arow.push(g[i][j]);
        grid.push(arow);
    }
    return grid;
}

function checkIfAlive(grid, i, j) {

    const numcols = grid[0].length
    const numrows = grid.length
    //check for alive
    // if (grid[i][j] == 1) {
    //     const sum =
    //         ((i + 1) < numrows ? grid[(i + 1)][(j)] : 0)
    //         + ((j - 1) >= 0 ? grid[i][(j - 1)] : 0)
    //         + ((i - 1) >= 0 ? grid[(i - 1)][j] : 0)
    //         + ((j + 1) < numcols ? grid[i][(j + 1)] : 0)

    //     return sum >= 2;
    // }

    //check for born
    const s =
        ((i - 1) >= 0 && (j - 1) >= 0 ? grid[(i - 1)][(j - 1)] : 0)
        + ((i - 1) >= 0 ? grid[(i - 1)][j] : 0)
        + ((i - 1) >= 0 && (j + 1) < numcols ? grid[(i - 1)][(j + 1)] : 0)
        + ((j + 1) < numcols ? grid[i][(j + 1)] : 0)
        + ((i + 1) < numrows && (j + 1) < numcols ? grid[(i + 1)][(j + 1)] : 0)
        + ((i + 1) < numrows ? grid[(i + 1)][j] : 0)
        + ((i + 1) < numrows && (j - 1) >= 0 ? grid[(i + 1)][(j - 1)] : 0)
        + ((j - 1) >= 0 ? grid[i][(j - 1)] : 0)

    if (grid[i][j] == 1) return s == 2 || s == 3

    return s == 3
}


function drawGrid(numrows, numcols, pos = { x: -1, y: -1 }, dims = { width: 0, height: 0 }, ctx, grid) {
    for (let i = 0; i < numrows; i++) {
        for (let j = 0; j < numcols; j++) {

            let x = j * dims.width;
            let y = i * dims.height;

            let ax, bx, cx, dx;
            let ay, by, cy, dy;

            ax = x; ay = y;
            bx = x + dims.width; by = y;
            cx = x + dims.width; cy = y + dims.height
            dx = x; dy = y + dims.height;


            ctx.beginPath();
            ctx.lineWidth = "2";
            ctx.strokeStyle = "rgb(46, 56, 63)";
            if ((pos.x > ax && pos.x < bx && pos.y > ay && pos.y < cy) && grid[i][j] == 1) {
                grid[i][j] = 0;
                drawGrid(numrows, numcols, { width: -1, height: -1 }, dims, ctx, grid);
                return
            }
            else if ((pos.x > ax && pos.x < bx && pos.y > ay && pos.y < cy)) {
                //clicked
                grid[i][j] = 1;
                ctx.fillStyle = "black";
                ctx.fillRect(x, y, dims.width, dims.height)
            }
            else if (grid[i][j] == 1) {

                ctx.fillStyle = "black";
                ctx.fillRect(x, y, dims.width, dims.height)
            }
            else {
                ctx.rect(dims.width, dims.height, x, y);
                ctx.stroke();
            }
        }
    }
}

function getMousePosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    return { x, y };
}


function getGridMatrix(row, col) {
    let grid = [];

    for (let i = 0; i < row; i++) {
        let arow = []
        for (let j = 0; j < col; j++)
            arow.push(0);
        grid.push(arow);
    }
    return grid;
}









function setDims({ width, height, canvas }) {
    canvas.height = height;
    canvas.width = width;
}






function drawBoard(context, bw, bh) {
    for (var x = 0; x <= bw; x += 40) {
        context.strokeStyle = "black";
        context.moveTo(0.5 + x + p, p);
        context.lineTo(0.5 + x + p, bh + p);
        context.stroke();
    }

    for (var x = 0; x <= bh; x += 40) {
        context.strokeStyle = "black";
        context.moveTo(p, 0.5 + x + p);
        context.lineTo(bw + p, 0.5 + x + p);
        context.stroke();
    }
    // context.strokeStyle = "black";
    // context.stroke();
}



main();


