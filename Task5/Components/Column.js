import Cell from './Cell.js';


class Column{
    constructor(index,x,y,cellWidth,cellHeight,canvas){
        this.index = index;
        this.x = x;
        this.y = y;
        this.canvas = canvas;
        this.height = parseInt(this.canvas.getAttribute('height'));
        this.cellHeight = cellHeight;
        this.cellWidth = cellWidth;
        this.isSelected = false;
        this.header = new Cell(this.x,this.y,this.cellWidth,this.cellHeight,this.canvas,this.index);
        this.cells = [this.header];
        this.onpointerdownbound = (e) => this.onpointerdown(e);
        // this.canvas.addEventListener('pointerdown',this.onpointerdownbound);
        this.onkeydownbound = (e) => this.onkeydown(e);
        // window.addEventListener('keydown',this.onkeydownbound);
        this.onpointermovebound = (e) => onpointermove(e);
        this.shadowcol = null;
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
            this.header.fillStyle = "white";
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
        if(e.keyCode === 40){
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
    headerhittest(x,y){
        return this.header.hittest(x,y);
    }
    hittest(x){
        return (x>this.x + 2&&x<this.x+this.cellWidth - 2);
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