const canvas= document.getElementById("main-canvas");
const body = document.body;
canvas.setAttribute("height",body.clientHeight.toString()+"px");
canvas.setAttribute("width",body.clientWidth.toString()+"px");
const ctx = canvas.getContext('2d');

class Cell{
    constructor(x,y,width,height,canvas,text = "",strokeStyle = "black",fillStyle="white",lineWidth="0.5",font="16px serif",textStyle = "black"){
        this.x=x;
        this.y=y;
        this.height = height;
        this.width = width;
        this.text = text;
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.strokeStyle = strokeStyle;
        this.fillStyle = fillStyle;
        this.lineWidth = lineWidth;
        this.font = font;
        this.textStyle = textStyle;
        this.inputbox = null;
        this.isFocus = false;
        this.focusStyle = "green";
        this.renderWidth = this.width;
        
        this.onpointerdownbound = (e) => this.onpointerdown(e);
        this.onkeypressbound = (e) => this.onkeypress(e);
        this.onpointerdownupbound = () => this.onpointerup();
        this.canvas.addEventListener('pointerdown',this.onpointerdownbound)

    }

    onpointerup(){
        
    }


    onpointerdown(event){
        if(this.hittest(event.pageX,event.pageY)){
            this.isFocus = true;
            this.create_inputbox();
            window.addEventListener('keydown',this.onkeypressbound);
            this.inputbox.addEventListener('pointerdown',() => this.oninputpointerdown());
            this.draw();
        }else{
            if(this.inputbox){
                this.isFocus = false;
                window.removeEventListener('keydown',this.onkeypressbound);
                if(this.inputbox.value !== "") this.text = this.inputbox.value;
                document.body.removeChild(this.inputbox);
                this.inputbox = null;
                this.draw();
            }
        }
    }

    hittest(x,y){
        if(x<this.x + 2 || x>this.x+this.width - 2 || y<this.y + 2 || y>this.y+this.height - 2) return false;
        return true;
    }

    onkeypress(event){
        if(this.inputbox !== null){
            this.inputbox.style.opacity = 1;
            this.inputbox.focus();
            if(this.inputbox.scrollWidth > this.renderWidth){
                this.renderWidth += this.width;
                this.inputbox.style.width = this.renderWidth + "px";
            }
            if(event.key === 'Escape'){
                this.isFocus = false;
                document.body.removeChild(this.inputbox);
                this.inputbox = null;
            }
            if(event.key === 'Enter'){
                this.isFocus = false;
                this.text = this.inputbox.value;
                this.inputbox.style.width = this.inputbox.value.length + "ch";
                while(this.renderWidth - this.width > this.inputbox.scrollWidth) this.renderWidth -= this.width;
                document.body.removeChild(this.inputbox);
                this.inputbox = null;
                this.draw();
            }
           
        }
        
    }

    oninputpointerdown(){
        this.inputbox.style.opacity = 1;
        this.inputbox.focus();
        this.inputbox.value = this.text;
    }

    draw(){
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.fillStyle = this.fillStyle;
        this.ctx.fillRect(this.x,this.y,this.renderWidth,this.height);
        this.ctx.strokeStyle = this.isFocus?this.focusStyle:this.strokeStyle;
        this.ctx.strokeRect(this.x,this.y,this.renderWidth,this.height);
        this.ctx.font = this.font;
        this.ctx.fillStyle = this.textStyle;
        this.ctx.fillText(this.text,this.x + 4,this.y+this.height - 4);
        this.ctx.restore();
    }
    clear(){
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.fillStyle = this.fillStyle;
        this.ctx.fillRect(this.x,this.y,this.renderWidth,this.height);
        this.ctx.strokeStyle = this.isFocus?this.focusStyle:this.strokeStyle;
        this.ctx.strokeRect(this.x,this.y,this.renderWidth,this.height);
        this.ctx.restore();
    }

    create_inputbox(){
        this.inputbox = document.createElement('input');
        this.inputbox.setAttribute("type","text");
        this.inputbox.setAttribute("id",`C${this.x}${this.y}${this.height}${this.width}`);
        this.inputbox.setAttribute("class","input-box");
        this.inputbox.setAttribute("style",`top:${this.y}px;left:${this.x}px;height:${this.height}px;width:${this.renderWidth}px;`)
        document.body.appendChild(this.inputbox); 
    }
}

class Row{
    constructor(x,y,cellWidth,cellHeight,canvas){
        this.x = x;
        this.y = y;
        this.canvas = canvas;
        this.width = parseInt(this.canvas.getAttribute('width'));
        this.cellHeight = cellHeight;
        this.cellWidth = cellWidth;
        this.cells = [];
    }

    add_cell(cell){
        this.cells.push(cell);
    }

    draw(){
        this.cells.forEach((cell)=>cell.draw());
    }

    create_row(){
        let cellx = this.x;
        let celly = this.y;
        let cell =null;
        do{
            cell = new Cell(cellx,celly,this.cellWidth,this.cellHeight,this.canvas);
            this.cells.push(cell);
            cellx += this.cellWidth;
        }while(cellx + this.cellWidth < this.width + this.cellWidth);
    }
}

class Column{
    constructor(x,y,cellWidth,cellHeight,canvas){
        this.x = x;
        this.y = y;
        this.canvas = canvas;
        this.height = parseInt(this.canvas.getAttribute('height'));
        this.cellHeight = cellHeight;
        this.cellWidth = cellWidth;
        this.cells = [];
    }

    add_cell(cell){
        this.cells.push(cell);
    }

    draw(){
        this.cells.forEach((cell)=>cell.draw());
    }

}

class Grid{
    constructor(x,y,cellWidth,cellHeight,canvas){
        this.x = x;
        this.y = y;
        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;
        this.canvas = canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.cells = [];
        this.rows = {};
        this.columns = {};
    }

    create_grid(){
        let rowindex = 0;
        let x = this.x;
        let y =this.y;
        let cell = null;
        while( y < this.height ){
            let columnindex = 'A';
            this.rows[rowindex] = new Row(x,y,this.cellHeight,this.cellWidth,this.canvas);
            x = this.x;
            while( x < this.width){
                cell = new Cell(x,y,this.cellWidth,this.cellHeight,this.canvas);
                this.columns[columnindex] = this.columns[columnindex]?this.columns[columnindex]:new Column(x,y,this.cellWidth,this.cellHeight,this.canvas);
                this.columns[columnindex].add_cell(cell);
                this.rows[rowindex].add_cell(cell);

                x += this.cellWidth;
            }
            rowindex += 1;
            y += this.cellHeight;
        }
    }

    increment_col(index){
        if(index.length > 1){
            
        }else if(index.charCodeAt(0)>91){
            return 'A';
        }else{
            return String.fromCharCode(index.charCodeAt(0)+1);
        }
    }

    draw_rows(){
        console.log(this.columns);
        for(const row in this.rows){ 
            this.rows[row].draw();
        }
    }



}



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