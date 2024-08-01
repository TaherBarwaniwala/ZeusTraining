import Cell from './Cell.js';


class Row{
    constructor(index,x,y,cellWidth,cellHeight,canvas,headercanvas,lineWidth = "1",strokeStyle = "#e0e0e0",fillStyle = "white"){
        this.index = index;
        this.x = x;
        this.y = y;
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.headercanvas = headercanvas;
        this.headerctx = headercanvas.getContext('2d');
        this.width = parseInt(this.canvas.getAttribute('width'));
        this.cellHeight = cellHeight;
        this.cellWidth = cellWidth;
        this.height = this.cellHeight;
        this.header = new Cell(this.headercanvas,this.index,"row",this,null,"#101010","#f5f5f5","rgb(97,97,97)");
        this.header.align = "right";
        this.header.width = 40;
        this.cells = {};
        this.selectFillStyle = "#e7f1ec";
        this.fillStyle = fillStyle;
        this.strokeStyle = strokeStyle;
        this.lineWidth = lineWidth;;
        this.isSelected = false;
        this.initialHeight = this.cellHeight;
        this.initialY = this.y;
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
            return this.moveactivecellleft();
        }else if(e.keyCode === 39){
            return this.moveactivecellright();
        }
    }

    moveactivecellleft(){
        let col = -1
        for(let cell in this.cells){
            if(this.cells[cell].isFocus === true){
                this.cells[cell].isFocus = false;
                this.cells[cell].draw();
                col = parseInt(cell);
                }
            }
        if(col === 1) return [1,this.cells[1]]
        if(Object.hasOwn(this.cells,col -1)){
            this.cells[col - 1].isFocus =true;
            this.cells[col - 1].draw();
            return [col -1 , this.cells[col - 1]];
        }
            let newcell = new Cell(this.canvas,"",false,this,null);
            return [col -1 ,newcell];

    }

    moveactivecellright(){
        let col = -1
        for(let cell in this.cells){
            if(this.cells[cell].isFocus === true){
                this.cells[cell].isFocus = false;
                this.cells[cell].draw();
                col = parseInt(cell);
                }
            }
        if(Object.hasOwn(this.cells,col + 1)){
            this.cells[col + 1].isFocus =true;
            this.cells[col + 1].draw();
            return [col + 1 , this.cells[col + 1]];
        }
            let newcell = new Cell(this.canvas,"",false,this,null);
            return [col + 1,newcell];
    }

    add_cell(cell){
        if(!cell.column){
            var a = 10;
        }
        this.cells[cell.column.index] = cell;
    }

    update_index(){
        for(let cell in this.cells){
            this.cells[cell].column.cells[this.index] = this.cells[cell];
        }
    }

    draw(){
        this.draw_without_boundary();
        this.draw_boundary();
    }

    draw_cells(x,y){
        if(Object.keys(this.cells).length > 0){
            if(this.isSelected){
                for(let cell in this.cells){
                    this.cells[cell].isSelected = true;
                    this.cells[cell].draw(x,y);
                }
            }else{
                for(let cell in this.cells){
                    this.cells[cell].isSelected = false;
                    this.cells[cell].draw(x,y);
                }
            }
        }
    }

    draw_header(y){
        if(this.isSelected){
            this.header.fillStyle = "#caead8";
        }else{
            this.header.fillStyle = "#f5f5f5";
        }
        this.header.draw(0,y);
    }

    draw_without_boundary(x,y){
        this.fill(y);
        this.draw_header(y);
        this.draw_cells(x,y);
    }

    fill(y){
        this.ctx.save();
        this.ctx.fillStyle = this.isSelected?this.selectFillStyle:this.fillStyle;
        this.ctx.fillRect(this.x,this.y - y,this.x + this.width,this.cellHeight);
        this.ctx.restore();
    }

    draw_boundary(y){
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.strokeStyle = this.strokeStyle;
        // this.ctx.moveTo(this.x,this.y + 0.5);
        // this.ctx.lineTo(this.x + this.width,this.y + 0.5);
        this.ctx.beginPath();
        this.ctx.moveTo(this.x,this.y - y +this.cellHeight + 0.5);
        this.ctx.lineTo(this.x+this.width,this.y - y  + this.cellHeight + 0.5);
        this.ctx.stroke();
        this.ctx.restore();
    }

    draw_upBoundary(y){
        this.ctx.save();
        this.ctx.strokeStyle = "#107c41";
        this.ctx.lineWidth = "2";
        this.ctx.beginPath();
        this.ctx.moveTo(this.x - this.header.width,this.y - y + 1.5);
        this.ctx.lineTo(this.x + this.width,this.y - y + 1.5);
        this.ctx.stroke();
        this.ctx.restore();
        this.headerctx.save();
        this.headerctx.strokeStyle = "#107c41";
        this.headerctx.lineWidth = "2";
        this.headerctx.beginPath();
        this.headerctx.moveTo(this.x + 2,this.y - y + 1.5);
        this.headerctx.lineTo(this.x + 2 + this.width,this.y - y + 1.5);
        this.headerctx.stroke();
        this.headerctx.beginPath();
        this.headerctx.moveTo(this.x + 2,this.y - y - 5 + 1.5);
        this.headerctx.lineTo(this.x + 2,this.y - y + 5 + 1.5);
        this.headerctx.stroke();
        this.headerctx.restore();
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
        return (y>=this.y && y < this.y+this.cellHeight);
    }

    edgehittest(y){
        return (y <= this.y + this.cellHeight + 2 && y >= this.y + this.cellHeight - 2);
    }

    move(y){
        this.cells.forEach(cell => cell.move(0,y));
    }
    moveShadow(y){
        this.ctx.save();
        this.ctx.fillStyle = this.isSelected?this.selectFillStyle:this.fillStyle;
        this.ctx.fillRect(0,this.y+y,this.width,this.cellHeight);
        this.ctx.restore();
        this.headerctx.save();
        this.headerctx.fillStyle = this.isSelected?this.selectFillStyle:this.fillStyle;
        this.headerctx.fillRect(0,this.y+y,this.width,this.cellHeight);
        this.headerctx.restore();
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

    getCell(col){
        if(Object.hasOwn(this.cells,col)){
            return this.cells[col];
        }else return null;
    }

    resizeEdge(y){
        this.cellHeight  = this.initialHeight + y;
    }

    resizeY(y){
        this.y = this.initialY + y;
    }

    static create_shadowrow(rows){
        let initialrow;
        let finalrow;
        if(rows[0].y < rows[rows.length-1].y){
            initialrow = rows[0];
            finalrow = rows[rows.length-1];
        }else{
            initialrow = rows[rows.length-1];
            finalrow = rows[0];
        }
        let cellHeight = (finalrow.y+finalrow.cellHeight) - initialrow.y;
        return new Row(initialrow.index,initialrow.x,initialrow.y,initialrow.cellWidth,cellHeight,initialrow.canvas,initialrow.headercanvas,"0.1","#000000","rgba(202, 234, 216,0.5)");
    }

    static getBoundedRows(rows,y,h){
        let boundedrows = [];
        for(let row in rows){
            if( (rows[row].y >= y && rows[row].y + rows[row].cellHeight <= y + h) || (rows[row].y <= y && rows[row].y + rows[row].cellHeight >= y + h) || 
                (rows[row].y >= y && rows[row].y <= y + h) || (rows[row].y + rows[row].cellHeight >= y && rows[row].y + rows[row].cellHeight <= y + h)){
                boundedrows.push(row);
            }
        }
        return boundedrows;
    }

    static async removeRows(rows,boundedrows){
        for(let row in rows){
            if(boundedrows.indexOf(row) < 0 && Object.keys(rows[row].cells).length === 0 && !rows[row].header.isFocus && !rows[row].header.isSelected){
                delete rows[row];
            }
        }
    }

}

export default Row;