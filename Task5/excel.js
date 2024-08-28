import FormSubmission from "./Components/FormSubmission.js";
import Grid from "./Components/Grid.js";
import Scrollbar from "./Components/Scollbar.js";

/**@type {HTMLCanvasElement} */
const canvas = document.getElementById("C1R1");
const body = document.body;
const height = body.clientHeight;
const width = body.clientWidth;
canvas.width = width - 60;
canvas.height = height - 40 - 24;
canvas.style.width = canvas.width + "px";
canvas.style.height = canvas.height + "px";
/** @type {HTMLCanvasElement} */
const column = document.getElementById("C1");
/** @type {HTMLCanvasElement} */
const row = document.getElementById("R1");
column.width = canvas.width;
column.height = 40;
column.style.width = column.width + "px";
column.style.height = column.height + "px";
row.width = 60;
row.height = canvas.height;
row.style.width = row.width + "px";
row.style.height = row.height + "px";

/** @type {HTMLCanvasElement} */
const footer = document.getElementById("footer-canvas");
footer.height = 24;
footer.width = column.width + 60;
footer.style.width = footer.width + "px";
footer.style.height = footer.height + "px";
/** @type {HTMLCanvasElement} */
const allSelector = document.getElementById("all-selector-canvas");
allSelector.height = 40;
allSelector.width = 60;
allSelector.style.height = allSelector.height + "px";
allSelector.style.width = allSelector.width + "px";

const ctx = canvas.getContext("2d");

// const cell = new Cell(10,10,50,25,canvas);
// const cell1 = new Cell(60,10,50,25,canvas);
// const cell2 = new Cell(110,10,50,25,canvas);
// const cell3 = new Cell(160,10,50,25,canvas);
// const cell4 = new Cell(10,35,50,25,canvas);
// const cell5 = new Cell(60,35,50,25,canvas);
// const cell6 = new Cell(110,35,50,25,canvas);
// const cell7 = new Cell(160,35,50,25,canvas);

// const row = new Row(10,20);
// row.add_cell(cell);
// row.add_cell(cell1);
// row.add_cell(cell2);
// row.add_cell(cell3);
// row.add_cell(cell4);
// row.add_cell(cell5);
// row.add_cell(cell6);
// row.add_cell(cell7);

// row.draw();
// let pageEnd = parseInt(canvas.getAttribute('height'));
// let temprow = null;
// let y =0;
// while(y < pageEnd + 40){
//     temprow = new Row(0,y,80,40,canvas);
//     temprow.create_row();
//     temprow.draw();
//     y += 40;
// }
// const row = new Row(0,0,80,40,canvas);
// row.create_row();
// row.draw();

let grid = new Grid(0, 0, 80, 25, canvas, column, row, footer, allSelector);
grid.create_grid();
grid.draw();

// grid.draw_rows();
// grid.draw_cols();
