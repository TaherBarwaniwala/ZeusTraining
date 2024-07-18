import Grid from "./Components/Grid.js";

const canvas= document.getElementById("main-canvas");
const body = document.body;
canvas.setAttribute("height",body.clientHeight.toString()+"px");
canvas.setAttribute("width",body.clientWidth.toString()+"px");
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

let grid = new Grid(0,0,80,40,canvas);
grid.create_grid();
grid.draw_rows();
grid.draw_cols();