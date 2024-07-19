import Cell from './Cell.js';


class Row{
    constructor(index,x,y,cellWidth,cellHeight,canvas,headercanvas,lineWidth = "0.3",strokeStyle = "#101010"){
        this.index = index;
        this.x = x;
        this.y = y;
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.headercanvas = headercanvas;
        this.width = parseInt(this.canvas.getAttribute('width'));
        this.cellHeight = cellHeight;
        this.cellWidth = cellWidth;
        this.header = new Cell(this.x,this.y,this.cellWidth,this.cellHeight,this.headercanvas,this.index,true,"#101010","#f5f5f5","#393939");
        this.header.align = "right";
        this.header.width = 40;
        this.cells = [];
        this.selectFillStyle = "#caead8";
        this.fillStyle = "white"
        this.strokeStyle = strokeStyle;
        this.lineWidth = lineWidth;;
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
        this.draw_without_boundary();
        this.draw_boundary();
    }

    draw_cells(){
        this.cells.forEach((cell)=>cell.draw());
    }
    draw_header(){
        if(this.isSelected){
            this.header.fillStyle = "#caead8";
        }else{
            this.header.fillStyle = "#f5f5f5";
        }
        this.header.draw();
    }

    draw_without_boundary(){
        this.fill();
        this.draw_header();
        this.draw_cells();
    }

    fill(){
        if(this.isSelected){
        this.ctx.save();
        this.ctx.fillStyle = this.isSelected?this.selectFillStyle:this.fillStyle;
        this.ctx.fillRect(this.x,this.y,this.x + this.width,this.cellHeight);
        this.ctx.restore();
        }
    }

    draw_boundary(){
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.strokeStyle = this.strokeStyle;
        this.ctx.moveTo(this.x,this.y);
        this.ctx.lineTo(this.x + this.width,this.y);
        this.ctx.beginPath();
        this.ctx.moveTo(this.x,this.y+this.cellHeight);
        this.ctx.lineTo(this.x+this.width,this.y + this.cellHeight);
        this.ctx.stroke();
        this.ctx.restore();
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