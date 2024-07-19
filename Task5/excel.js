import Grid from "./Components/Grid.js";

const canvas= document.getElementById("C1R1");
const body = document.body;
const height = body.clientHeight;
const width = body.clientWidth;
canvas.setAttribute("height",(height - 40) + "px");
canvas.setAttribute("width",(width - 40) + "px");
const column = document.getElementById("C1");
const row = document.getElementById("R1");
column.setAttribute("width",(width - 40) + "px");
column.setAttribute("height","40px");
row.setAttribute("height",(height - 40) + "px");
row.setAttribute("width","40px");
const ctx = canvas.getContext('2d');









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
// // console.log(pageEnd);
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

let grid = new Grid(40,40,0,0,80,25,canvas,column,row);
grid.create_grid();
grid.draw();
// grid.draw_rows();
// grid.draw_cols();