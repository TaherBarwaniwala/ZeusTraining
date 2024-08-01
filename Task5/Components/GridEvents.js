import Cell from "./Cell.js";

class GridEvents{
    constructor(grid,canvas,Scrollbar){
        this.grid = grid;
        this.Scrollbar = Scrollbar;
        this.canvas = canvas;
        this.onregionpointermovebound = (e) => this.onregionpointermove(e);
        this.onregionpointercancelbound = () => this.onregionpointercancel();
        this.onregionpointerupbound = () => this.onregionpointerup();
        this.onpointerdownbound = (e) => this.onpointerdownmaincanvas(e);
        this.canvas.addEventListener('pointerdown',this.onpointerdownbound);
    }

    onpointerdownmaincanvas(e){
        let scrolloffsetX = this.Scrollbar.getScrollLeft();
        let scrolloffsetY = this.Scrollbar.getScrollTop();
        let x = e.pageX - this.grid.topX - scrolloffsetX;
        let y = e.pageY - this.grid.topY - scrolloffsetY;
        this.cellspointerdown(e);
    }

 

    cellspointerdown(e){
        let scrolloffsetX = this.Scrollbar.getScrollLeft();
        let scrolloffsetY = this.Scrollbar.getScrollTop();
        let activecell = this.grid.activecell;
        this.grid.reset();
        this.grid.activecell = activecell;
        let x = e.pageX - this.grid.topX + scrolloffsetX;
        let y = e.pageY - this.grid.topY + scrolloffsetY;
        this.initialX = e.pageX - this.grid.topX + scrolloffsetX;
        this.initialY = e.pageY - this.grid.topY + scrolloffsetY;
        this.grid.activecol = this.grid.getCol(this.initialX);
        this.grid.activerow = this.grid.getRow(this.initialY)
        if(this.grid.columnEvents.isColEdgeSelect(x)){
            this.grid.columnEvents.oncolumnedgedrag(e.pageX);
        }else if(this.grid.rowEvents.isRowEdgeSelect(y)){
            this.grid.rowEvents.onrowedgedrag(e.pageY);
        }else if(this.grid.activecol !== -1 && this.grid.activerow!==-1){
            if(this.grid.activecell && this.grid.activecell === this.grid.columns[this.grid.activecol].getCell(this.grid.activerow)){
                this.grid.activecell.create_inputbox(this.grid.topX + scrolloffsetX,this.grid.topY + scrolloffsetY);
                this.grid.activecell.isFocus = true;
                this.grid.activecell.inputbox.style.opacity = 1;
                this.grid.activecell.inputbox.value = this.grid.activecell.text;
                this.grid.activecell.inputbox.focus();
                this.grid.istyping = true;
            }else if(this.grid.activecell) this.grid.activecell.isFocus = false;
            this.grid.activecell = this.grid.columns[this.grid.activecol].getCell(this.grid.activerow)?this.grid.columns[this.grid.activecol].getCell(this.grid.activerow):Cell.createCell(this.grid.rows[this.grid.activerow],this.grid.columns[this.grid.activecol]);
            this.grid.activecell.isFocus = true;
            this.grid.columns[this.grid.activecol].header.isFocus = true;
            this.grid.rows[this.grid.activerow].header.isFocus = true;
            this.grid.draw();
            window.addEventListener("pointermove",this.onregionpointermovebound);
            window.addEventListener("pointerup",this.onregionpointerupbound);
            window.addEventListener("pointercancel",this.onregionpointercancelbound);
        }
    }

    
    onregionpointermove(e){
        let scrolloffsetX = this.Scrollbar.getScrollLeft();
        let scrolloffsetY = this.Scrollbar.getScrollTop();
        this.grid.regionselection = true;
        let offsetX = e.pageX - this.grid.topX - this.initialX;
        let offsetY = e.pageY - this.grid.topY - this.initialY;
        if(this.grid.inboundX(this.grid.x+this.grid.cellWidth,offsetX,this.grid.width)==="left") offsetX = this.grid.x + this.grid.cellWidth - this.initialX;
        if(this.grid.inboundY(this.grid.y+this.grid.cellHeight,offsetY,this.grid.height)==="up") offsetY = this.grid.y + this.grid.cellHeight - this.initialY;
        let initialRow = this.grid.getRow(this.initialY);
        let initialCol = this.grid.getCol(this.initialX);
        let finalRow = null;
        let finalCol = null;
        finalRow = this.grid.getRow(e.pageY - this.grid.topY + scrolloffsetY);
        finalCol = this.grid.getCol(e.pageX - this.grid.topX + scrolloffsetX);
        if(finalRow && finalCol){
        let rowsrange = this.grid.getRowinRange(initialRow,finalRow);
        let colrange = this.grid.getColinRange(initialCol,finalCol);
        let region = [];
        let cell;
        colrange.forEach(col => {
            rowsrange.forEach(row => {
                cell = this.grid.rows[row].getCell(col)?this.grid.rows[row].getCell(col):Cell.createCell(this.grid.rows[row],this.grid.columns[col]);
                region.push(cell);
            });
        });
        if(region !== this.grid.region){
            this.grid.deselectheader();
            this.grid.removeregion();
            this.grid.region = region;
            this.grid.activecell.isFocus = true;
            this.grid.getMinMaxAvgCount();
            this.grid.draw();
        }

    }
    }

    onregionpointerup(){
        window.removeEventListener("pointermove",this.onregionpointermovebound);
        window.removeEventListener("pointercancel",this.onregionpointercancelbound);
        window.removeEventListener("pointerup",this.onregionpointerupbound);

    }

    onregionpointercancel(){
        window.removeEventListener("pointermove",this.onregionpointermovebound);
        window.removeEventListener("pointerup",this.onregionpointerupbound);
        window.removeEventListener("pointercancel",this.onregionpointercancelbound);
    }

    
    draw_region(){
        if(this.grid.region.length > 0){
            this.grid.set_bounding_region();
            let scrolloffsetX = this.Scrollbar.getScrollLeft();
            let scrolloffsetY = this.Scrollbar.getScrollTop();
            let r1=this.grid.region[0].row.index;
            let r2 = r1;
            let c1 = this.grid.region[0].column.index;
            let c2 = c1;
            this.grid.region.forEach(cell => {
                cell.isSelected = true;
                cell.column.header.isFocus = true;
                cell.row.header.isFocus = true;
                if(this.grid.boundedrows.includes(cell.row.index.toString()) && this.grid.boundedcols.includes(cell.column.index.toString())){
                    cell.draw(scrolloffsetX,scrolloffsetY);
                }
                c1 = c1>cell.column.index?cell.column.index:c1;
                c2 = c2<cell.column.index?cell.column.index:c2;
                r1 = r1>cell.row.index?cell.row.index:r1;
                r2 = r2<cell.row.index?cell.row.index:r2;
            });
            let rowsrange = this.grid.getRowinRange(r1,r2);
            let colrange = this.grid.getColinRange(c1,c2);
            // this.grid.draw();
            rowsrange.forEach(row =>{
                if(this.grid.boundedrows.includes(row.toString())){
                    this.grid.rows[row].header.draw(scrolloffsetX,scrolloffsetY);
                    this.grid.rows[row].draw_boundary(scrolloffsetY);
                }
            });
            colrange.forEach(col => {
                if(this.grid.boundedcols.includes(col.toString())){
                    this.grid.columns[col].header.draw(scrolloffsetX,scrolloffsetY);
                    this.grid.columns[col].draw_boundary(scrolloffsetX);
                }
            });
            let topx = this.grid.region[0].x - scrolloffsetX;
            let topy = this.grid.region[0].y - scrolloffsetY;
            let bottomx = this.grid.region[this.grid.region.length-1].x - scrolloffsetX + this.grid.region[this.grid.region.length - 1].width;
            let bottomy = this.grid.region[this.grid.region.length-1].y - scrolloffsetY + this.grid.region[this.grid.region.length - 1].height;
            this.grid.ctx.save();
            this.grid.ctx.strokeStyle = "#107c41";
            this.grid.ctx.lineWidth = "2";
            this.grid.ctx.strokeRect((topx<bottomx?topx:bottomx) + 1,(topy<bottomy?topy:bottomy) + 1,Math.abs(topx-bottomx) - 1,Math.abs(topy-bottomy) - 1);
            this.grid.ctx.restore();
            this.grid.draw_copy_region();
        }
    }



}

export default GridEvents;