function main() {
    const canvas = document.getElementById('playground');


    const CANVAS = {
        width: 500,
        height: 500,
        canvas: canvas,
        bgColor: "whitesmoke",
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

    //make a way to draw the grid

    for (let i = 0; i < numrows; i++) {
        for (let j = 0; j < numcols; j++) {
            ctx.beginPath();
            ctx.lineWidth = "0.2";
            ctx.strokeStyle = "black";
            ctx.rect(CANVAS.gridDims.width, CANVAS.gridDims.height, j * CANVAS.gridDims.width, i * CANVAS.gridDims.height);
            ctx.stroke();
        }
    }

    canvas.addEventListener('mousedown', (e) => {
        let pos = getMousePosition(canvas, e);
        ctx.clearRect(0, 0, CANVAS.width, CANVAS.height);
        drawGrid(numrows, numcols, pos, CANVAS.gridDims, ctx, gridMatrix);
    })

    window.addEventListener('keyup', (e) => {
        if (e.keyCode === 13) {
            loop(ctx, CANVAS, numrows, numcols, gridMatrix, 500);
        }
    })

}


function loop(ctx, CANVAS, numrows, numcols, grid, speed) {
    let counter = 0;
    const t = setInterval(() => {
        ctx.clearRect(0, 0, CANVAS.width, CANVAS.height);

        //manipulate the grid
        // let all_grids = []
        // for (let i = 0; i < grid.length; i++) {
        //     for (let j = 0; j < grid[0].length; j++) {
        //         all_grids.push(gridOperation(grid));
        //     }
        // }
        // let result_grid = grid;

        // for (let i = 1; i < all_grids.length; i++) {
        //     result_grid = multiplyMatrixElemWise(result_grid, all_grids[i]);
        // }

        // grid = [...result_grid];
        grid = gridOperation(grid)

        drawGrid(numrows, numcols, { x: -1, y: -1 }, CANVAS.gridDims, ctx, grid);


        counter++;
        if (counter > 10) {
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
    let _grid = [...grid]
    let all_grids = []


    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            const alive = checkIfAlive(grid, i, j);
            if (alive == true)
                _grid[i][j] = 1;
            else _grid[i][j] = 0;

            all_grids.push(_grid)
            _grid = [...grid]
        }
        _grid = [...grid]

    }
    let result_grid = grid;

    for (let i = 1; i < all_grids.length; i++) {
        result_grid = multiplyMatrixElemWise(result_grid, all_grids[i]);
    }

    return result_grid
}

function checkIfAlive(grid, i, j) {

    //check for alive
    if (grid[i][j] == 1) {
        const sum = grid[i + 1][j - 1] + grid[i][j - 1] + grid[i - 1][j] + grid[i][j + 1]
        return sum >= 2;

        if (j - 1 >= 0 && j + 1 < grid[0].length) {
            if (grid[i][j - 1] == 1 && grid[i][j + 1] == 1) {
                return true
            }
        }
        if (i - 1 >= 0 && i + 1 < grid.length) {
            if (grid[i - 1][j] == 1 && grid[i + 1][j] == 1) {
                return true
            }
        }
        return false
    }

    //check for born
    const numcols = grid[0].length
    const numrows = grid.length
    const s = (i - 1 >= 0 && j - 1 >= 0 && grid[i - 1][j - 1] == 1)
        + (i - 1 >= 0 && grid[i - 1][j] == 1)
        + (i - 1 >= 0 && j + 1 < numcols && grid[i - 1][j + 1] == 1)
        + (j + 1 < numcols && grid[i][j + 1] == 1)
        + (i + 1 < numrows && j + 1 < numcols && grid[i + 1][j + 1] == 1)
        + (i + 1 < numrows && grid[i + 1][j] == 1)
        + (i + 1 < numrows && j - 1 >= 0 && grid[i + 1][j - 1] == 1)
        + (j - 1 >= 0 && grid[i][j - 1] == 1)

    // alert(s)

    return s >= 3

    //left side
    if (j - 1 >= 0 && i + 1 < grid.length && i - 1 >= 0) {


        if (grid[i - 1][j - 1] == 1 && grid[i][j - 1] == 1 && grid[i + 1][j - 1] == 1) {
            return true;
        }
    }
    if (i - 1 >= 0 && j - 1 >= 0 && j + 1 < grid[0].length) {
        //up side
        if (grid[i - 1][j - 1] == 1 && grid[i - 1][j] == 1 && grid[i - 1][j + 1] == 1) {
            return true;
        }
    }

    if (j + 1 < grid[0].length && i + 1 < grid.length && i - 1 >= 0) {
        //right
        if (grid[i - 1][j + 1] == 1 && grid[i][j + 1] == 1 && grid[i + 1][j + 1] == 1) {
            return true;
        }
    }
    if (j - 1 >= 0 && i + 1 < grid.length && j + 1 < grid[0].length) {
        //bottom
        if (grid[i + 1][j - 1] == 1 && grid[i + 1][j] == 1 && grid[i + 1][j + 1] == 1) {

            return true;
        }
    }

    return false;
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
            ctx.lineWidth = "0.2";
            ctx.strokeStyle = "black";
            if ((pos.x > ax && pos.x < bx && pos.y > ay && pos.y < cy) && grid[i][j] == 1) {
                // ctx.clearRect(x, y, dims.width, dims.height)
                grid[i][j] = 0;
                drawGrid(numrows, numcols, { width: -1, height: -1 }, dims, ctx, grid);

            }
            else if ((pos.x > ax && pos.x < bx && pos.y > ay && pos.y < cy)) {

                //clicked
                grid[i][j] = 1;
                ctx.fillStyle = "#FF0000";
                ctx.fillRect(x, y, dims.width, dims.height)
            }
            else if (grid[i][j] == 1) {

                ctx.fillStyle = "#FF0000";
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
        context.moveTo(0.5 + x + p, p);
        context.lineTo(0.5 + x + p, bh + p);
    }

    for (var x = 0; x <= bh; x += 40) {
        context.moveTo(p, 0.5 + x + p);
        context.lineTo(bw + p, 0.5 + x + p);
    }
    context.strokeStyle = "black";
    context.stroke();
}



main();


