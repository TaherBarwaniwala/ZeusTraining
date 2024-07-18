import Cell from './Cell.js';


class Row{
    constructor(index,x,y,cellWidth,cellHeight,canvas){
        this.index = index;
        this.x = x;
        this.y = y;
        this.canvas = canvas;
        this.width = parseInt(this.canvas.getAttribute('width'));
        this.cellHeight = cellHeight;
        this.cellWidth = cellWidth;
        this.header = new Cell(this.x,this.y,this.cellWidth,this.cellHeight,this.canvas,this.index);
        this.cells = [this.header];
        this.isSelected = false;
        this.onpointerdownbound = (e) => this.onpointerdown(e);
        // this.canvas.addEventListener('pointerdown',this.onpointerdownbound);
        this.onkeydownbound = (e) => this.onkeydown(e);
        // window.addEventListener('keydown',this.onkeydownbound);
    }

    onpointerdown(e){
        if(this.headerhittest(e.pageX,e.pageY))
        if(!this.isSelected){
            this.cells.forEach(cell=> cell.fillStyle = "yellow");
            this.isSelected = true;
        }else{
            this.isSelected = false;
            this.cells.forEach(cell=> cell.fillStyle = "white");
        }
        this.draw()
    }

    onkeydown(e){
        if(e.keyCode === 37 ){
            let activecellindex = -1;
            this.cells.forEach((cell,i)=>{
                if(cell.isFocus === true){
                    activecellindex = i;
                }
            });
            if(activecellindex > 0 && activecellindex<this.cells.length){
                this.cells[activecellindex].isFocus = false;
                this.cells[activecellindex].draw();
                this.cells[activecellindex-1].isFocus = true;
                this.cells[activecellindex - 1].draw();

            }
        }
        if(e.keyCode === 39){
            let activecellindex = -1;
            this.cells.forEach((cell,i)=>{
                if(cell.isFocus === true){
                    activecellindex = i;
                }
            });
            if(activecellindex > -1 && activecellindex<this.cells.length-1){
                this.cells[activecellindex].isFocus = false;
                this.cells[activecellindex].draw();
                this.cells[activecellindex+1].isFocus = true;
                this.cells[activecellindex+1].draw();

            }
        }
    }

    add_cell(cell){
        this.cells.push(cell);
    }

    draw(){
        if(this.isSelected){
            this.header.fillStyle = "yellow";
        }else{
            this.header.fillStyle = "white";
        }
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

    headerhittest(x,y){
        return this.header.hittest(x,y);
    }

    hittest(y){
        return (y>this.y && y < this.y+this.cellHeight);
    }

    move(y){
        this.cells.forEach(cell => cell.move(0,y));
    }

    copy(row){
        this.canvas = row.canvas;
        this.cellHeight = row.cellHeight;
        this.cellWidth = row.cellWidth;
        this.isSelected = row.isSelected;
        for(let i=1;i<row.cells.length;i++){
            this.cells[i].text = row.cells[i].text;
            this.cells[i].y = this.y;
            this.cells[i].height = this.cellHeight;
        }
    }
}

export default Row;