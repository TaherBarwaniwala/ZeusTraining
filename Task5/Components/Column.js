import Cell from './Cell.js';


class Column{
    constructor(index,x,y,cellWidth,cellHeight,canvas,headercanvas,lineWidth = "0.1",strokeStyle = "#000000"){
        this.index = index;
        this.x = x;
        this.y = y;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.headercanvas = headercanvas;
        this.height = parseInt(this.canvas.getAttribute('height'));
        this.width = cellWidth;
        this.cellHeight = cellHeight;
        this.cellWidth = cellWidth;
        this.selectFillStyle = "#caead8";
        this.fillStyle = "white";
        this.isSelected = false;
        this.strokeStyle = strokeStyle;
        this.lineWidth = lineWidth;
        this.header = new Cell(this.x,this.y,this.cellWidth,this.cellHeight,this.headercanvas,this.getindex(this.index),"column","#101010","#f5f5f5","#393939");
        this.header.align = "middle";
        this.cells = [];
        this.onpointerdownbound = (e) => this.onpointerdown(e);
        // this.canvas.addEventListener('pointerdown',this.onpointerdownbound);
        this.onkeydownbound = (e) => this.onkeydown(e);
        // window.addEventListener('keydown',this.onkeydownbound);
        this.onpointermovebound = (e) => onpointermove(e);
        this.shadowcol = null;
    }

    getindex(i){
        i = parseInt(i);
        if(i<27){
            return String.fromCharCode(65+i-1);
        }else{
        }
    }

    onpointerdown(e){
        if(this.headerhittest(e.pageX,e.pageY))
        if(!this.isSelected){
            this.isSelected = true;
            this.initialX = e.pageX;
            this.initialY = e.pageY;
            // this.shadowcol = new Cell(this.x,this.y,this.width,this.height,this.canvas,"","darkgreen","lightgreen");
            // this.shadowcol.draw();
        }else{
            this.isSelected = false;
            this.header.fillStyle = "#f5f5f5";
            this.initialX = 0;
            this.initialY = 0;
            this.shadowcol = null;
        }
        this.draw()
        this.header.isFocus = false;
    }

    onopintermove(e){
        let offsetX = e.pageX - this.initialX;
        let offsetY = e.pageY - this.initialY;
        if(this.inboundX(this.initialX+offsetX,this.initialY+offsetY)==="in"){
            this.shadowcol.move(offsetX,offsetY);
        }
    }

    onkeydown(e){
        if(e.keyCode === 38 ){
             return this.moveactivecellup();
        }
        if(e.keyCode === 40){
            return this.moveactivecelldown();
        }
    }

    moveactivecellup(){
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
            return this.cells[activecellindex - 1];
        }
        return this.cells[activecellindex];
    }

    moveactivecelldown(){
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
            return this.cells[activecellindex + 1];
        }
        return this.cells[activecellindex];
    }

    add_cell(cell){
        this.cells.push(cell);
    }

    draw(){
        this.draw_without_boundary();
        this.draw_boundary();
    }

    draw_without_boundary(){
        this.fill();
        this.draw_header();
        this.draw_cells();
    }

    draw_cells(){
        if(this.isSelected){
            this.cells.forEach(cell => {
                cell.isSelected = true;
                cell.draw();
            })
        }else{
            this.cells.forEach((cell)=>{
                cell.isSelected = false;
                cell.draw()
            });
        }
        

    }
    draw_header(){
        if(this.isSelected){
            this.header.fillStyle = "#caead8";
        }else{
            this.header.fillStyle = "#f5f5f5";
        }
        this.header.draw();
    }

    draw_boundary(){
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.strokeStyle =this.strokeStyle;
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.moveTo(this.x,0);
        this.ctx.lineTo(this.x,this.height);
        this.ctx.beginPath();
        this.ctx.moveTo(this.x+this.cellWidth,0);
        this.ctx.lineTo(this.x+this.cellWidth,this.height);
        this.ctx.stroke();
        this.ctx.restore();
    }

    fill(){
        this.ctx.save();
        this.ctx.fillStyle = this.isSelected?this.selectFillStyle:this.fillStyle;
        this.ctx.fillRect(this.x,0,this.cellWidth,this.height);
        this.ctx.restore();
    }

    headerhittest(x,y){
        return this.header.hittest(x,y);
    }

    hittest(x){
        return (x>this.x &&x<this.x+this.cellWidth);
    }

    move(x){
        this.cells.forEach(cell => cell.move(x,0));
    }

    copy(col){
        this.canvas = col.canvas;
        this.cellHeight = col.cellHeight;
        this.cellWidth = col.cellWidth;
        this.isSelected = col.isSelected;
        for(let i=1;i<col.cells.length;i++){
            this.cells[i].text = col.cells[i].text;
            this.cells[i].x = this.x;
            this.cells[i].width = this.cellWidth;
        }
    }



}

export default Column;