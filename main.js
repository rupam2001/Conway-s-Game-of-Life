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
        gridOperation(grid);

        drawGrid(numrows, numcols, { x: -1, y: -1 }, CANVAS.gridDims, ctx, grid);


        counter++;
        if (counter > 10) {
            alert("stoped");
            clearInterval(t);
        }
        console.log(counter);


    }, speed);
}



function gridOperation(grid) {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            const alive = checkIfAlive(grid, i, j);
            if (alive == true) grid[i][j] = 1;
            else grid[i][j] = 0;
        }
    }
}

function checkIfAlive(grid, i, j) {

    //check for alive
    if (grid[i][j] == 1) {
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
    //left side
    if (j - 1 >= 0 && i + 1 < grid.length) {
        if (grid[i + 1][j - 1] == 1 && grid[i][j - 1] == 1 && grid[i + 1][j - 1] == 1) {
            return true;
        }
    }
    if (i - 1 >= 0 && j - 1 >= 0 && j + 1 < grid[0].length) {
        //up side
        if (grid[i - 1][j - 1] == 1 && grid[i - 1][j] == 1 && grid[i - 1][j + 1] == 1) {
            return true;
        }
    }

    if (j - 1 >= 0 && i + 1 < grid.length) {
        //right
        if (grid[i + 1][j - 1] == 1 && grid[i][j - 1] == 1 && grid[i + 1][j - 1] == 1) {
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

