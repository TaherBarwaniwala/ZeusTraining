import Cell from "./Cell.js";
import Column from "./Column.js";

class ColumnEvents{
    constructor(grid,columnscanvas,Scrollbar){
        this.grid = grid;
        this.columncanvas = columnscanvas;
        this.topX = this.grid.topX;
        this.Scrollbar = Scrollbar;
        this.grid.columnselection = [];
        this.oncolpointermovebound = (e) => this.oncolumndrag(e);
        this.onpointerdowncolumnbound = (e) => this.onpointerdowncolumn(e);
        this.columncanvas.addEventListener("pointerdown",this.onpointerdowncolumnbound);
        this.oncolselectpointermovebound = (e) => this.oncolselectpointermove(e);
        this.oncolselectpointercancelbound = (e) => this.oncolselectpointercancel(e);
        this.oncolselectpointerupbound = (e) => this.oncolselectpointerup(e);
        this.oncoldragpointermovebound = (e) => this.oncoldragpointermove(e);
        this.oncoldragpointercancelbound = (e) => this.oncoldragpointercancel(e);
        this.oncoldragpointerupbound = (e) => this.oncoldragpointerup(e);
        this.oncolumnedgepointermovebound = (e)=>this.oncolumnedgepointermove(e);
    }

    onpointerdowncolumn(e){
        let x = e.clientX;
        let y = e.clientY;
        this.colheaderpointerdown(x,y);
    }

    colheaderpointerdown(x,y){
        let scrolloffsetX = this.Scrollbar.getScrollLeft();
        if(this.isColEdgeSelect(x - this.topX - scrolloffsetX)){
            this.oncolumnedgedrag(x);
        }else if(this.isColSelect(y)){
            this.grid.reset();
            this.grid.activecol = this.grid.getCol(x-this.topX + scrolloffsetX);
            this.grid.columns[this.grid.activecol].header.isSelected = true;
            this.grid.columns[this.grid.activecol].isSelected = true;
            this.grid.activecell = this.grid.columns[this.grid.activecol].getCell(1)?this.grid.columns[this.grid.activecol].getCell(1):Cell.createCell(this.rows[1],this.grid.columns[this.grid.activecol]);
            this.grid.activecell.isFocus = true;
            this.grid.columnselection = [this.grid.activecol];
            this.grid.getMinMaxAvgCount();
            this.draw_selectedcols();
            this.grid.removeregion();
            this.oncolumnselect(x);
        }else if(this.isColDrag(y)){
            this.oncolumndrag(x);
        }
    }

    isColSelect(y){
        return (y>this.grid.headerHeight - 25);
    }

    isColDrag(y){
        return (y<this.grid.headerHeight - 25);
    }

    isColEdgeSelect(x){
        for(let col of this.grid.boundedcols){
            if(this.grid.columns[col].edgehittest(x)) return true;
        }
        return false;
    }

    oncolumnedgedrag(x){
        let scrolloffsetX = this.Scrollbar.getScrollLeft();
        this.initialX = x - this.topX + scrolloffsetX;
        for(let col of this.grid.boundedcols){
            if(this.grid.columns[col].edgehittest(this.initialX)) this.grid.activecol = col;
        }
        this.grid.columns[this.grid.activecol].initialWidth = this.grid.columns[this.grid.activecol].cellWidth;
        for(let col in this.grid.columns){
            this.grid.columns[col].initialX = this.grid.columns[col].x;
        }
        window.addEventListener("pointermove",this.oncolumnedgepointermovebound);
        window.addEventListener("pointerup",()=>{
        window.removeEventListener("pointermove",this.oncolumnedgepointermovebound);
        });
        window.addEventListener("pointercancel",()=>{
            window.removeEventListener("pointermove",this.oncolumnedgepointermovebound);
        });
        
    }

    oncolumnedgepointermove(e){
        let offsetX = e.pageX - this.topX - this.initialX + this.Scrollbar.getScrollLeft();
        let activecol = parseInt(this.grid.activecol);
        if(this.grid.columns[this.grid.activecol].cellWidth + offsetX > 0){
            this.grid.columns[this.grid.activecol].resizeEdge(offsetX);
            for(let col in this.grid.columns){
                if(parseInt(col) > activecol){
                    this.grid.columns[col].resizeX(offsetX);
                }
            }
        }
        this.grid.draw();
    }

    oncolumndrag(x){
        let scrolloffsetX = this.Scrollbar.getScrollLeft();
        let initialX = x - this.topX + scrolloffsetX;
        let currentcol = parseInt(this.grid.getCol(initialX));
        if(!this.grid.columnselection.includes(currentcol)){
            this.grid.reset();
            this.grid.activecol = currentcol;
            this.grid.columns[this.grid.activecol].header.isSelected = true;
            this.grid.columns[this.grid.activecol].isSelected = true;
            this.grid.activecell = this.grid.columns[this.grid.activecol].getCell(1)?this.grid.columns[this.grid.activecol].getCell(1):Cell.createCell(this.rows[1],this.grid.columns[this.grid.activecol]);
            this.grid.activecell.isFocus = true;
            this.grid.columnselection = [this.grid.activecol];
            this.draw_selectedcols();
            this.grid.removeregion();
            this.grid.columnselection = [this.grid.activecol];
        }
        this.initialX = initialX;
        let cols = this.grid.columnselection.map(col => this.grid.columns[col]);
        this.shadowcol = Column.create_shadowcol(cols);
        window.addEventListener("pointermove",this.oncoldragpointermovebound);
        window.addEventListener("pointerup",this.oncoldragpointerupbound);
        window.addEventListener("pointercancel",this.oncoldragpointercancelbound);
    }

    oncoldragpointermove(e){
        document.body.style.cursor = "grabbing";
        let offsetX = e.pageX - this.topX - this.initialX + this.Scrollbar.getScrollLeft();
        this.grid.draw();
        if(this.grid.getCol(this.initialX+offsetX) !== this.grid.activecol){
            this.grid.activecol = this.grid.getCol(this.initialX+offsetX);
        }
        if(this.grid.columns[this.grid.activecol]){
            this.shadowcol.moveShadow(offsetX - this.Scrollbar.getScrollLeft());
            this.grid.columns[this.grid.activecol].draw_leftBoundary(this.Scrollbar.getScrollLeft());
        }
    }

    oncoldragpointerup(e){
        document.body.style.cursor = "grab";
        this.shadowcol = null;
        this.movecolumns();
        this.grid.getMinMaxAvgCount();
        window.removeEventListener("pointermove",this.oncoldragpointermovebound);
        window.removeEventListener("pointercancel",this.oncoldragpointercancelbound);
        window.removeEventListener("pointerup",this.oncoldragpointerupbound);
    }

    oncoldragpointercancel(e){
        document.body.style.cursor = "grab";
        this.shadowcol = null;
        this.movecolumns();
        this.grid.getMinMaxAvgCount();
        window.removeEventListener("pointermove",this.oncoldragpointermovebound);
        window.removeEventListener("pointerup",this.oncoldragpointerupbound);
        window.removeEventListener("pointercancel",this.oncoldragpointercancelbound);
    }

    movecolumns(){
        if(!this.grid.columns[this.grid.activecol]) return;
        let initialSelectionIndex;
        let finalSelectionIndex;
        if(this.grid.columnselection[0]<this.grid.columnselection[this.grid.columnselection.length-1]){
            initialSelectionIndex = this.grid.columnselection[0];
            finalSelectionIndex = this.grid.columnselection[this.grid.columnselection.length-1];
        }else{
            initialSelectionIndex = this.grid.columnselection[this.grid.columnselection.length-1];
            finalSelectionIndex = this.grid.columnselection[0];
        }
        if(this.grid.activecol <= finalSelectionIndex + 1 && this.grid.activecol >= initialSelectionIndex){
            this.grid.draw();
        }else if(this.grid.activecol < initialSelectionIndex){
            let offsetSelectedcol = this.grid.columns[initialSelectionIndex].x - this.grid.columns[this.grid.activecol].x;
            let offsetcols = this.grid.columns[finalSelectionIndex].x + this.grid.columns[finalSelectionIndex].cellWidth - this.grid.columns[initialSelectionIndex].x;
            for(let index = this.grid.activecol;index<initialSelectionIndex;index++){
                if(!this.grid.columns[index]) this.grid.columns[index] = new Column(index,this.grid.columns[index-1].x + this.grid.columns[index-1].cellWidth,15,this.cellWidth,this.cellHeight,this.canvas,this.columncanvas);
                this.grid.columns[index].x += offsetcols;
                this.grid.columns[index].index += finalSelectionIndex - initialSelectionIndex + 1;
                this.grid.columns[index].header.x += offsetcols;
                this.grid.columns[index].header.text = Column.getindex(this.grid.columns[index].index-1);
                this.grid.columns[index].update_index();
            }
            for(let index = initialSelectionIndex;index <= finalSelectionIndex;index++){
                if(!this.grid.columns[index]) this.grid.columns[index] = new Column(index,this.grid.columns[index-1].x + this.grid.columns[index-1].cellWidth,15,this.cellWidth,this.cellHeight,this.canvas,this.columncanvas);
                this.grid.columns[index].x -= offsetSelectedcol;
                this.grid.columns[index].index -= initialSelectionIndex - this.grid.activecol;
                this.grid.columns[index].header.x -= offsetSelectedcol;
                this.grid.columns[index].header.text = Column.getindex(this.grid.columns[index].index-1);
                this.grid.columns[index].update_index();
            }
            this.grid.columnselection = this.grid.columnselection.map(col => col -= initialSelectionIndex - this.grid.activecol);

        }else{
            let offsetSelectedcol = this.grid.columns[finalSelectionIndex].x + this.grid.columns[finalSelectionIndex].cellWidth - (this.grid.columns[this.grid.activecol].x);
            let offsetcols = this.grid.columns[finalSelectionIndex].x + this.grid.columns[finalSelectionIndex].cellWidth - this.grid.columns[initialSelectionIndex].x;
            for(let index = initialSelectionIndex;index <= finalSelectionIndex;index++){
                if(!this.grid.columns[index]) this.grid.columns[index] = new Column(index,this.grid.columns[index-1].x + this.grid.columns[index-1].cellWidth,15,this.cellWidth,this.cellHeight,this.canvas,this.columncanvas);
                this.grid.columns[index].x -= offsetSelectedcol;
                this.grid.columns[index].index += this.grid.activecol - finalSelectionIndex - 1;
                this.grid.columns[index].header.x -= offsetSelectedcol;
                this.grid.columns[index].header.text = Column.getindex(this.grid.columns[index].index-1);
                this.grid.columns[index].update_index();
            }
            for(let index = finalSelectionIndex + 1;index<this.grid.activecol;index++){
                if(!this.grid.columns[index]) this.grid.columns[index] = new Column(index,this.grid.columns[index-1].x + this.grid.columns[index-1].cellWidth,15,this.cellWidth,this.cellHeight,this.canvas,this.columncanvas);
                this.grid.columns[index].x -= offsetcols;
                this.grid.columns[index].index -= finalSelectionIndex - initialSelectionIndex + 1;
                this.grid.columns[index].header.x -= offsetcols;
                this.grid.columns[index].header.text = Column.getindex(this.grid.columns[index].index-1);
                this.grid.columns[index].update_index();
            }
            this.grid.columnselection = this.grid.columnselection.map(col => col +=this.grid.activecol - finalSelectionIndex - 1);

        }
        let cols = [];
        for(let col in this.grid.columns){
            cols.push(this.grid.columns[col]);
        }
        cols.forEach(col => {
            this.grid.columns[col.index] = col;
        });
        this.draw_selectedcols();
    }

    oncolumnselect(x){
        this.grid.deselectrows();
        this.initialX = x - this.topX + this.Scrollbar.getScrollLeft();
        window.addEventListener("pointermove",this.oncolselectpointermovebound);
        window.addEventListener("pointerup",this.oncolselectpointerupbound);
        window.addEventListener("pointercancel",this.oncolselectpointercancelbound);
    }

    oncolselectpointerup(e){
        window.removeEventListener("pointermove",this.oncolselectpointermovebound);
        window.removeEventListener("pointercancel",this.oncolselectpointercancelbound);
    }

    oncolselectpointercancel(e){
        window.removeEventListener("pointermove",this.oncolselectpointermovebound);
        window.removeEventListener("pointerup",this.oncolselectpointerupbound);
    }

    oncolselectpointermove(e){
        let offsetX = e.pageX - this.initialX - this.topX + this.Scrollbar.getScrollLeft();
        let initialCol = this.grid.getCol(this.initialX);
        let finalCol = this.grid.getCol(this.initialX + offsetX);
        if(initialCol && finalCol){
        this.grid.deselectcolumns();
        let columnrange = this.grid.getColinRange(initialCol,finalCol);
        columnrange.forEach(col => {
            this.grid.columns[col].header.isSelected = true;
            this.grid.columns[col].isSelected = true;
        });
        this.grid.columnselection = columnrange;

        this.draw_selectedcols();
        this.grid.getMinMaxAvgCount();
        }
    }


    draw_selectedcols(){
        if(this.grid.columnselection.length > 0){
            this.grid.set_bounding_region();
            let scrolloffsetX = this.Scrollbar.getScrollLeft();
            let scrolloffsetY = this.Scrollbar.getScrollTop();
            this.grid.columnselection.forEach(col => {
                this.grid.columns[col].header.isSelected = true;
            });
            for(let col of this.grid.boundedcols){
                this.grid.columns[col].draw_without_boundary(scrolloffsetX,scrolloffsetY);
            }
            for(let row of this.grid.boundedrows){
                this.grid.rows[row].header.isFocus = true;
                this.grid.rows[row].draw_boundary(scrolloffsetY);
                this.grid.rows[row].draw_header(scrolloffsetY);
            }
            for(let col of this.grid.boundedcols){
                this.grid.columns[col].draw_boundary(scrolloffsetX);
            }
            // this.draw();
            if(this.grid.activecell) this.grid.activecell.draw(scrolloffsetX,scrolloffsetY);
            // this.draw();
            let topx = this.grid.columns[this.grid.columnselection[0]].x - scrolloffsetX;
            let bottomx = this.grid.columns[this.grid.columnselection[this.grid.columnselection.length-1]].x - scrolloffsetX+ this.grid.columns[this.grid.columnselection[this.grid.columnselection.length - 1]].cellWidth;
            this.grid.ctx.save();
            this.grid.ctx.strokeStyle ="#107c41";
            this.grid.ctx.lineWidth = "2";
            this.grid.ctx.strokeRect(topx + 1,1,bottomx - topx - 1,this.grid.height);
            this.grid.ctx.restore();
            this.grid.draw_copy_region();

        }

    }

}

export default ColumnEvents;