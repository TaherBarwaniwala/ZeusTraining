import Cell from './Cell.js';
import Row from './Row.js';
import Column from './Column.js';
import Scrollbar from './Scollbar.js';

class Grid{
    constructor(topX,topY,x,y,cellWidth,cellHeight,canvas,columncanvas,rowcanvas,footercanvas){
        this.topX = topX;
        this.topY = topY;
        this.x = x;
        this.y = y;
        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.columncanvas = columncanvas;
        this.rowcanvas = rowcanvas;
        this.footercanvas = footercanvas;
        this.footerctx = footercanvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.rows = {};
        this.columns = {};
        this.activecell = null;
        this.activecol = [];
        this.activerow = null;
        this.initialX = 0;
        this.initialY = 0;
        this.istyping = false;
        this.isdragging = false;
        this.regionselection = false;
        this.region = [];
        this.columnselection = [];
        this.rowselection = [];
        this.copyregion = [];
        this.headerHeight = 40;
        this.headerWidth = 40;
        this.offset = 0;
        this.timer = null;
        this.Scrollbar = new Scrollbar();
        this.scrolloffsetX = this.Scrollbar.getScrollLeft();
        this.scrolloffsetY = this.Scrollbar.getScrollTop();
        this.boundedcols = Column.getBoundedColumns(this.columns,this.topX + this.scrolloffsetX , this.width + this.scrolloffsetX);
        this.boundedrows = Row.getBoundedRows(this.rows,this.scrolloffsetY,this.height + this.scrolloffsetY);
        this.Scrollbar.setOnScrollFunction(()=>this.draw())
        this.onpointerdownbound = (e) => this.onpointerdownmaincanvas(e);
        this.canvas.addEventListener('pointerdown',this.onpointerdownbound);
        this.onkeydownbound = (e)=> this.onkeydown(e);
        window.addEventListener('keydown',this.onkeydownbound);
        this.oncolpointermovebound = (e) => this.oncolumndrag(e);
        this.onrowpointermovebound = (e) => this.onrowdrag(e);
        this.onregionpointermovebound = (e) => this.onregionpointermove(e);
        this.onregionpointercancelbound = () => this.onregionpointercancel();
        this.onregionpointerupbound = () => this.onregionpointerup();
        this.onpointerdowncolumnbound = (e) => this.onpointerdowncolumn(e);
        this.columncanvas.addEventListener("pointerdown",this.onpointerdowncolumnbound);
        this.oncolselectpointermovebound = (e) => this.oncolselectpointermove(e);
        this.oncolselectpointercancelbound = (e) => this.oncolselectpointercancel(e);
        this.oncolselectpointerupbound = (e) => this.oncolselectpointerup(e);
        this.oncoldragpointermovebound = (e) => this.oncoldragpointermove(e);
        this.oncoldragpointercancelbound = (e) => this.oncoldragpointercancel(e);
        this.oncoldragpointerupbound = (e) => this.oncoldragpointerup(e);
        this.onpointerdownrowbound = (e) => this.onpointerdownrow(e);
        this.rowcanvas.addEventListener("pointerdown",this.onpointerdownrowbound);
        this.onrowselectpointermovebound = (e) => this.onrowselectpointermove(e);
        this.onrowselectpointercancelbound = (e) => this.onrowselectpointercancel(e);
        this.onrowselectpointerupbound = (e) => this.onrowselectpointerup(e);
        this.onrowdragpointermovebound = (e) => this.onrowdragpointermove(e);
        this.onrowdragpointercancelbound = (e) => this.onrowdragpointercancel(e);
        this.onrowdragpointerupbound = (e) => this.onrowdragpointerup(e);
        this.oncolumnedgepointermovebound = (e)=>this.oncolumnedgepointermove(e);
        this.onrowedgepointermovebound = (e)=>this.onrowedgepointermove(e);

    }



    onpointerdownmaincanvas(e){
        let scrolloffsetX = this.Scrollbar.getScrollLeft();
        let scrolloffsetY = this.Scrollbar.getScrollTop();
        let x = e.pageX - this.topX - scrolloffsetX;
        let y = e.pageY - this.topY - scrolloffsetY;
        this.cellspointerdown(e);
    }

    onpointerdowncolumn(e){
        let x = e.clientX;
        let y = e.clientY;
        this.colheaderpointerdown(x,y);
    }

    colheaderpointerdown(x,y){
        let scrolloffsetX = this.Scrollbar.getScrollLeft();
        let scrolloffsetY = this.Scrollbar.getScrollTop();
        if(this.isColEdgeSelect(x - this.topX - scrolloffsetX)){
            this.oncolumnedgedrag(x);
        }else if(this.isColSelect(y)){
            this.reset();
            this.activecol = this.getCol(x-this.topX + scrolloffsetX);
            this.columns[this.activecol].header.isSelected = true;
            this.columns[this.activecol].isSelected = true;
            this.activecell = this.columns[this.activecol].getCell(1)?this.columns[this.activecol].getCell(1):Cell.createCell(this.rows[1],this.columns[this.activecol]);
            this.activecell.isFocus = true;
            this.columnselection = [this.activecol];
            this.getMinMaxAvgCount();
            this.draw_selectedcols();
            this.removeregion();
            this.oncolumnselect(x);
        }else if(this.isColDrag(y)){
            this.oncolumndrag(x);
        }
    }

    isColSelect(y){
        return (y>this.headerHeight - 25);
    }

    isColDrag(y){
        return (y<this.headerHeight - 25);
    }

    isColEdgeSelect(x){
        for(let col of this.boundedcols){
            if(this.columns[col].edgehittest(x)) return true;
        }
        return false;
    }

    oncolumnedgedrag(x){
        let scrolloffsetX = this.Scrollbar.getScrollLeft();
        this.initialX = x - this.topX + scrolloffsetX;
        for(let col of this.boundedcols){
            if(this.columns[col].edgehittest(this.initialX)) this.activecol = col;
        }
        this.columns[this.activecol].initialWidth = this.columns[this.activecol].cellWidth;
        for(let col in this.columns){
            this.columns[col].initialX = this.columns[col].x;
        }
        window.addEventListener("pointermove",this.oncolumnedgepointermovebound);
        window.addEventListener("pointerup",()=>{
        window.removeEventListener("pointermove",this.oncolumnedgepointermovebound);
        },{"once":true});
        window.addEventListener("pointercancel",()=>{
            window.removeEventListener("pointermove",this.oncolumnedgepointermovebound);
        },{"once":true});
        
    }

    oncolumnedgepointermove(e){
        let offsetX = e.pageX - this.topX - this.initialX + this.Scrollbar.getScrollLeft();
        let activecol = parseInt(this.activecol);
        if(this.columns[this.activecol].cellWidth + offsetX > 0){
            this.columns[this.activecol].resizeEdge(offsetX);
            for(let col in this.columns){
                if(parseInt(col) > activecol){
                    this.columns[col].resizeX(offsetX);
                }
            }
        }
        this.draw();
    }

    oncolumndrag(x){
        let scrolloffsetX = this.Scrollbar.getScrollLeft();
        let initialX = x - this.topX + scrolloffsetX;
        let currentcol = parseInt(this.getCol(initialX));
        if(!this.columnselection.includes(currentcol)){
            this.reset();
            this.activecol = currentcol;
            this.columns[this.activecol].header.isSelected = true;
            this.columns[this.activecol].isSelected = true;
            this.activecell = this.columns[this.activecol].getCell(1)?this.columns[this.activecol].getCell(1):Cell.createCell(this.rows[1],this.columns[this.activecol]);
            this.activecell.isFocus = true;
            this.columnselection = [this.activecol];
            this.draw_selectedcols();
            this.removeregion();
            this.columnselection = [this.activecol];
        }
        this.initialX = initialX;
        let cols = this.columnselection.map(col => this.columns[col]);
        this.shadowcol = Column.create_shadowcol(cols);
        window.addEventListener("pointermove",this.oncoldragpointermovebound);
        window.addEventListener("pointerup",this.oncoldragpointerupbound,{"once":true});
        window.addEventListener("pointercancel",this.oncoldragpointercancelbound,{"once":true});
    }

    oncoldragpointermove(e){
        let offsetX = e.pageX - this.topX - this.initialX + this.Scrollbar.getScrollLeft();
        this.draw();
        if(this.getCol(this.initialX+offsetX) !== this.activecol){
            this.activecol = this.getCol(this.initialX+offsetX);
        }
        this.shadowcol.moveShadow(offsetX - this.Scrollbar.getScrollLeft());
        this.columns[this.activecol].draw_leftBoundary(this.Scrollbar.getScrollLeft());
    }

    oncoldragpointerup(e){
        this.shadowcol = null;
        this.movecolumns();
        this.getMinMaxAvgCount();
        window.removeEventListener("pointermove",this.oncoldragpointermovebound);
        window.removeEventListener("pointercancel",this.oncoldragpointercancelbound);
    }

    oncoldragpointercancel(e){
        this.shadowcol = null;
        this.movecolumns();
        this.getMinMaxAvgCount();
        window.removeEventListener("pointermove",this.oncoldragpointermovebound);
        window.removeEventListener("pointerup",this.oncoldragpointerupbound);
    }

    movecolumns(){
        let initialSelectionIndex;
        let finalSelectionIndex;
        if(this.columnselection[0]<this.columnselection[this.columnselection.length-1]){
            initialSelectionIndex = this.columnselection[0];
            finalSelectionIndex = this.columnselection[this.columnselection.length-1];
        }else{
            initialSelectionIndex = this.columnselection[this.columnselection.length-1];
            finalSelectionIndex = this.columnselection[0];
        }
        if(this.activecol <= finalSelectionIndex + 1 && this.activecol >= initialSelectionIndex){
            this.draw();
        }else if(this.activecol < initialSelectionIndex){
            let offsetSelectedcol = this.columns[initialSelectionIndex].x - this.columns[this.activecol].x;
            let offsetcols = this.columns[finalSelectionIndex].x + this.columns[finalSelectionIndex].cellWidth - this.columns[initialSelectionIndex].x;
            for(let index = this.activecol;index<initialSelectionIndex;index++){
                this.columns[index].x += offsetcols;
                this.columns[index].index += finalSelectionIndex - initialSelectionIndex + 1;
                this.columns[index].header.x += offsetcols;
                this.columns[index].header.text = Column.getindex(this.columns[index].index-1);
                this.columns[index].update_index();
            }
            for(let index = initialSelectionIndex;index <= finalSelectionIndex;index++){
                this.columns[index].x -= offsetSelectedcol;
                this.columns[index].index -= initialSelectionIndex - this.activecol;
                this.columns[index].header.x -= offsetSelectedcol;
                this.columns[index].header.text = Column.getindex(this.columns[index].index-1);
                this.columns[index].update_index();
            }
            this.columnselection = this.columnselection.map(col => col -= initialSelectionIndex - this.activecol);

        }else{
            let offsetSelectedcol = this.columns[finalSelectionIndex].x + this.columns[finalSelectionIndex].cellWidth - (this.columns[this.activecol].x);
            let offsetcols = this.columns[finalSelectionIndex].x + this.columns[finalSelectionIndex].cellWidth - this.columns[initialSelectionIndex].x;
            for(let index = initialSelectionIndex;index <= finalSelectionIndex;index++){
                this.columns[index].x -= offsetSelectedcol;
                this.columns[index].index += this.activecol - finalSelectionIndex - 1;
                this.columns[index].header.x -= offsetSelectedcol;
                this.columns[index].header.text = Column.getindex(this.columns[index].index-1);
                this.columns[index].update_index();
            }
            for(let index = finalSelectionIndex + 1;index<this.activecol;index++){
                this.columns[index].x -= offsetcols;
                this.columns[index].index -= finalSelectionIndex - initialSelectionIndex + 1;
                this.columns[index].header.x -= offsetcols;
                this.columns[index].header.text = Column.getindex(this.columns[index].index-1);
                this.columns[index].update_index();
            }
            this.columnselection = this.columnselection.map(col => col +=this.activecol - finalSelectionIndex - 1);

        }
        let cols = [];
        for(let col in this.columns){
            cols.push(this.columns[col]);
        }
        cols.forEach(col => {
            this.columns[col.index] = col;
        });
        this.draw_selectedcols();
    }

    oncolumnselect(x){
        this.deselectrows();
        this.deselectheader();
        this.removeregion();
        this.initialX = x - this.topX + this.Scrollbar.getScrollLeft();
        window.addEventListener("pointermove",this.oncolselectpointermovebound);
        window.addEventListener("pointerup",this.oncolselectpointerupbound,{"once":true});
        window.addEventListener("pointercancel",this.oncolselectpointercancelbound,{"once":true});
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
        let initialCol = this.getCol(this.initialX);
        let finalCol = this.getCol(this.initialX + offsetX);
        if(initialCol && finalCol){
        this.deselectcolumns();
        let columnrange = this.getColinRange(initialCol,finalCol);
        columnrange.forEach(col => {
            this.columns[col].header.isSelected = true;
            this.columns[col].isSelected = true;
        });
        this.columnselection = columnrange;

        this.draw_selectedcols();
        this.getMinMaxAvgCount();
        }
    }


    onpointerdownrow(e){
        let x = e.clientX;
        let y = e.clientY;
        this.rowheaderpointerdown(x,y);
    }

    
    rowheaderpointerdown(x,y){
        let scrolloffsetY = this.Scrollbar.getScrollTop();
        if(this.isRowEdgeSelect(y - this.topY + scrolloffsetY)){
            this.onrowedgedrag(y);
        }else if(this.isRowSelect(x)){
            this.reset();
            this.activerow = this.getRow(y-this.topY + scrolloffsetY);
            this.rows[this.activerow].header.isSelected = true;
            this.rows[this.activerow].isSelected = true;
            this.activecell = this.rows[this.activerow].getCell(1)?this.rows[this.activerow].getCell(1):Cell.createCell(this.rows[this.activerow],this.columns[1]);
            this.activecell.isFocus = true;
            this.rowselection = [this.activerow];
            this.getMinMaxAvgCount();
            this.draw_selectedrows();
            this.removeregion();
            this.onrowselect(y);
        }else if(this.isRowDrag(x)){
            this.onrowdrag(y);
        }
    }

    isRowDrag(x){
        return (x<this.headerWidth/2);
    }

    isRowEdgeSelect(y){
        for(let row of this.boundedrows){
            if(this.rows[row].edgehittest(y)) return true;
        }
        return false;
    }

    onrowedgedrag(y){
        let scrolloffsetY = this.Scrollbar.getScrollTop();
        this.initialY = y - this.topY + scrolloffsetY;
        for(let row of this.boundedrows){
            if(this.rows[row].edgehittest(this.initialY)) this.activerow = row;
        }
        this.rows[this.activerow].initialHeight = this.rows[this.activerow].cellHeight;
        for(let row in this.rows){
            this.rows[row].initialY = this.rows[row].y;
        }
        window.addEventListener("pointermove",this.onrowedgepointermovebound);
        window.addEventListener("pointerup",()=>{
        window.removeEventListener("pointermove",this.onrowedgepointermovebound);
        },{"once":true});
        window.addEventListener("pointercancel",()=>{
            window.removeEventListener("pointermove",this.onrowedgepointermovebound);
        },{"once":true});
        
    }

    onrowedgepointermove(e){
        let offsetY = e.pageY - this.topY - this.initialY + this.Scrollbar.getScrollTop();
        let activerow = parseInt(this.activerow);
        if(this.rows[this.activerow].cellHeight + offsetY > 0){
            this.rows[this.activerow].resizeEdge(offsetY);
            for(let row in this.rows){
                if(parseInt(row) > activerow){
                    this.rows[row].resizeY(offsetY);
                }
            }
        }
        this.draw();
    }

    onrowdrag(y){
        let scrolloffsetY = this.Scrollbar.getScrollTop();
        let initialY = y - this.topY + scrolloffsetY;
        let currentrow = parseInt(this.getRow(initialY));
        if(!this.rowselection.includes(currentrow)){
            this.reset();
            this.activerow = currentrow;
            this.rows[this.activerow].header.isSelected = true;
            this.rows[this.activerow].isSelected = true;
            this.activecell = this.rows[this.activerow].getCell(1)?this.rows[this.activerow].getCell(1):Cell.createCell(this.rows[this.activerow],this.columns[1]);
            this.activecell.isFocus = true;
            this.rowselection = [this.activerow];
            this.draw_selectedrows();

            this.removeregion();
            this.rowselection = [this.activerow];
        }
        this.initialY = initialY;
        let rows = this.rowselection.map(row => this.rows[row]);
        this.shadowrow = Row.create_shadowrow(rows);
        this.getMinMaxAvgCount();
        window.addEventListener("pointermove",this.onrowdragpointermovebound);
        window.addEventListener("pointerup",this.onrowdragpointerupbound,{"once":true});
        window.addEventListener("pointercancel",this.onrowdragpointercancelbound,{"once":true});
    }

    onrowdragpointermove(e){
        let scrolloffsetY = this.Scrollbar.getScrollTop();
        let offsetY = e.pageY - this.topY - this.initialY + scrolloffsetY;
        this.activerow = this.getRow(this.initialY+offsetY);
        this.draw();
        this.shadowrow.moveShadow(offsetY - scrolloffsetY);
        if(this.activerow)this.rows[this.activerow].draw_upBoundary(scrolloffsetY);
    }

    onrowdragpointerup(e){
        this.shadowrow = null;
        this.moverows();
        window.removeEventListener("pointermove",this.onrowdragpointermovebound);
        window.removeEventListener("pointercancel",this.onrowdragpointercancelbound);
    }

    onrowdragpointercancel(e){
        this.shadowrow = null;
        this.moverows();
        window.removeEventListener("pointermove",this.onrowdragpointermovebound);
        window.removeEventListener("pointerup",this.onrowdragpointerupbound);
    }

    moverows(){
        let initialSelectionIndex;
        let finalSelectionIndex;
        if(this.rowselection[0]<this.rowselection[this.rowselection.length-1]){
            initialSelectionIndex = this.rowselection[0];
            finalSelectionIndex = this.rowselection[this.rowselection.length-1];
        }else{
            initialSelectionIndex = this.rowselection[this.rowselection.length-1];
            finalSelectionIndex = this.rowselection[0];
        }
        if(this.activerow <= finalSelectionIndex + 1 && this.activerow >= initialSelectionIndex){
            this.draw();
        }else if(this.activerow < initialSelectionIndex){
            let offsetSelectedrow = this.rows[initialSelectionIndex].y - this.rows[this.activerow].y;
            let offsetrows = this.rows[finalSelectionIndex].y + this.rows[finalSelectionIndex].cellHeight - this.rows[initialSelectionIndex].y;
            for(let index = this.activerow;index<initialSelectionIndex;index++){
                this.rows[index].y += offsetrows;
                this.rows[index].index += finalSelectionIndex - initialSelectionIndex + 1;
                this.rows[index].header.y += offsetrows;
                this.rows[index].header.text = this.rows[index].index;
                this.rows[index].update_index();
            }
            for(let index = initialSelectionIndex;index <= finalSelectionIndex;index++){
                this.rows[index].y -= offsetSelectedrow;
                this.rows[index].index -= initialSelectionIndex - this.activerow;
                this.rows[index].header.y -= offsetSelectedrow;
                this.rows[index].header.text = this.rows[index].index;
                this.rows[index].update_index();
            }
            this.rowselection = this.rowselection.map(row => row -= initialSelectionIndex - this.activerow);

        }else{
            let offsetSelectedrow = (this.rows[this.activerow].y) - (this.rows[finalSelectionIndex].y + this.rows[finalSelectionIndex].cellHeight) ;
            let offsetrows = this.rows[finalSelectionIndex].y + this.rows[finalSelectionIndex].cellHeight - this.rows[initialSelectionIndex].y;
            for(let index = initialSelectionIndex;index <= finalSelectionIndex;index++){
                this.rows[index].y += offsetSelectedrow;
                this.rows[index].index += this.activerow - finalSelectionIndex - 1;
                this.rows[index].header.y += offsetSelectedrow;
                this.rows[index].header.text = this.rows[index].index;
                this.rows[index].update_index();
            }
            for(let index = finalSelectionIndex + 1;index<this.activerow;index++){
                this.rows[index].y -= offsetrows;
                this.rows[index].index -= finalSelectionIndex - initialSelectionIndex + 1;
                this.rows[index].header.y -= offsetrows;
                this.rows[index].header.text = this.rows[index].index;
                this.rows[index].update_index();
            }
            this.rowselection = this.rowselection.map(row => row +=this.activerow - finalSelectionIndex - 1);

        }
        let rows = [];
        for(let row in this.rows){
            rows.push(this.rows[row]);
        }
        rows.forEach(row => {
            this.rows[row.index] = row;
        });
        this.draw();
        this.draw_selectedrows();
    }

    isRowSelect(x){
        return (x>this.headerWidth/2);
    }

    onrowselect(y){
        this.deselectcolumns();
        this.deselectheader();
        this.removeregion();
        this.initialY = y - this.topY + this.Scrollbar.getScrollTop();
        window.addEventListener("pointermove",this.onrowselectpointermovebound);
        window.addEventListener("pointerup",this.onrowselectpointerupbound,{"once":true});
        window.addEventListener("pointercancel",this.onrowselectpointercancelbound,{"once":true});
    }

    onrowselectpointerup(e){
        window.removeEventListener("pointermove",this.onrowselectpointermovebound);
        window.removeEventListener("pointercancel",this.onrowselectpointercancelbound);
    }

    onrowselectpointercancel(e){
        window.removeEventListener("pointermove",this.onrowselectpointermovebound);
        window.removeEventListener("pointerup",this.onrowselectpointerupbound);
    }

    onrowselectpointermove(e){
        let offsetY = e.pageY - this.initialY - this.topY + this.Scrollbar.getScrollTop();
        let initialRow = this.getRow(this.initialY);
        let finalRow = this.getRow(this.initialY + offsetY);
        if(initialRow && finalRow){
        this.deselectrows();
        let rowrange = this.getRowinRange(initialRow,finalRow);
        rowrange.forEach(row => {
            this.rows[row].header.isSelected = true;
            this.rows[row].isSelected = true;
        });
        this.rowselection = rowrange;
        this.getMinMaxAvgCount();
        this.draw_selectedrows();

        }
    }


    cellspointerdown(e){
        let scrolloffsetX = this.Scrollbar.getScrollLeft();
        let scrolloffsetY = this.Scrollbar.getScrollTop();
        let activecell = this.activecell;
        this.reset();
        this.activecell = activecell;
        let x = e.pageX - this.topX + scrolloffsetX;
        let y = e.pageY - this.topY + scrolloffsetY;
        this.initialX = e.pageX - this.topX + scrolloffsetX;
        this.initialY = e.pageY - this.topY + scrolloffsetY;
        this.activecol = this.getCol(this.initialX);
        this.activerow = this.getRow(this.initialY)
        if(this.isColEdgeSelect(x)){
            this.oncolumnedgedrag(e.pageX);
        }else if(this.isRowEdgeSelect(y)){
            this.onrowedgedrag(e.pageY);
        }else if(this.activecol !== -1 && this.activerow!==-1){
            if(this.activecell && this.activecell === this.columns[this.activecol].getCell(this.activerow)){
                this.activecell.create_inputbox(this.topX + scrolloffsetX,this.topY + scrolloffsetY);
                this.activecell.isFocus = true;
                this.activecell.inputbox.style.opacity = 1;
                this.activecell.inputbox.value = this.activecell.text;
                this.activecell.inputbox.focus();
                this.istyping = true;
            }else if(this.activecell) this.activecell.isFocus = false;
            this.activecell = this.columns[this.activecol].getCell(this.activerow)?this.columns[this.activecol].getCell(this.activerow):Cell.createCell(this.rows[this.activerow],this.columns[this.activecol]);
            this.activecell.isFocus = true;
            this.columns[this.activecol].header.isFocus = true;
            this.rows[this.activerow].header.isFocus = true;
            this.draw();
            window.addEventListener("pointermove",this.onregionpointermovebound);
            window.addEventListener("pointerup",this.onregionpointerupbound,{once:true});
            window.addEventListener("pointercancel",this.onregionpointercancelbound,{once:true});
        }
    }



    onkeydown(e){
        if(this.activecell && !this.istyping && ((e.keyCode > 36 && e.keyCode < 41)||e.code === "Enter")){
            if(e.code === "Enter"){
                this.handleEnterdown();
            }else{
                this.handleArrawkeyDown(e);
                this.draw();
            }
            this.getMinMaxAvgCount();
        }else if(e.ctrlKey){
            this.handleCtrldown(e);
        }else if(e.code === "Escape"){
            this.handleEscKeyDown(e);
        }else if(this.activecell && this.istyping){
            if(e.code === "Enter" || e.code === "Escape") this.istyping = false;
            this.activecell.onkeypress(e);
            this.draw();
        }else if(this.activecell){
            if(e.code === "Enter" || e.code === "Escape"){
                this.istyping = false;
            }else{
                this.activecell.isFocus = true;
                this.istyping = true;
                this.activecell.onkeypress(e);
            }
        }
    }

    handleEnterdown(){
        if(this.region.length > 0){
            for(let i = 0; i < this.region.length ; i++){
                if(this.activecell === this.region[i]){
                    this.activecell.isFocus = false;
                    this.activecell = this.region[(i + 1)%this.region.length];
                    this.activecell.isFocus = true;
                    break;
                }
            }
            this.draw_region();
        }
    }

    handleArrawkeyDown(e){
        let tempcell = this.activecell;
        this.reset();
        this.activecell = tempcell;
        this.activecell.isFocus = true;
        this.activecol = this.activecell.column.index;
        this.activerow = this.activecell.row.index;
        if(this.activecol) this.columns[this.activecol].header.isFocus= false;
        if(this.activerow) this.rows[this.activerow].header.isFocus = false;
        if(e.keyCode === 37 || e.keyCode === 39){
            let res = this.rows[this.activerow].onkeydown(e);
            this.activecol = res[0];
            this.activecell = res[1];
            this.activecell.column = this.columns[this.activecol];
            this.activecell.x = this.columns[this.activecol].x;
            this.activecell.width = this.columns[this.activecol].cellWidth;
            this.rows[this.activerow].add_cell(this.activecell);
            this.columns[this.activecol].add_cell(this.activecell);
        }else if(e.keyCode ===38 || e.keyCode === 40 || e.code === "Enter"){
            let res = this.columns[this.activecol].onkeydown(e);
            this.activerow = res[0];
            this.activecell = res[1];
            this.activecell.row = this.rows[this.activerow];
            this.activecell.y = this.rows[this.activerow].y;
            this.activecell.height = this.rows[this.activerow].cellHeight;
            this.rows[this.activerow].add_cell(this.activecell);
            this.columns[this.activecol].add_cell(this.activecell);
        }            
        if(this.activecol) this.columns[this.activecol].header.isFocus = true;
        if(this.activerow) this.rows[this.activerow].header.isFocus = true;
        this.activecell.isFocus = true;
    }

    handleCtrldown(e){
        if( e.key === "c" || e.key === "C") this.onCopy();
        if( e.key === "v" || e.key === "V") this.onPaste();
    }

    handleEscKeyDown(e){
        if(this.istyping){
            this.activecell.onkeypress(e);
            this.istyping = false;
            this.draw();
        }else{
            navigator.clipboard.writeText("");
            this.remove_copy();
            this.draw();
            this.draw_region();
            if(this.columnselection.length > 0)this.draw_selectedcols();
            if(this.rowselection.length > 0)this.draw_selectedrows();
        }
    }

    onregionpointermove(e){
        let scrolloffsetX = this.Scrollbar.getScrollLeft();
        let scrolloffsetY = this.Scrollbar.getScrollTop();
        this.regionselection = true;
        let offsetX = e.pageX - this.topX - this.initialX;
        let offsetY = e.pageY - this.topY - this.initialY;
        if(this.inboundX(this.x+this.cellWidth,offsetX,this.width)==="left") offsetX = this.x + this.cellWidth - this.initialX;
        if(this.inboundY(this.y+this.cellHeight,offsetY,this.height)==="up") offsetY = this.y + this.cellHeight - this.initialY;
        let initialRow = this.getRow(this.initialY);
        let initialCol = this.getCol(this.initialX);
        let finalRow = null;
        let finalCol = null;
        finalRow = this.getRow(e.pageY - this.topY + scrolloffsetY);
        finalCol = this.getCol(e.pageX - this.topX + scrolloffsetX);
        if(finalRow && finalCol){
        let rowsrange = this.getRowinRange(initialRow,finalRow);
        let colrange = this.getColinRange(initialCol,finalCol);
        let region = [];
        let cell;
        colrange.forEach(col => {
            rowsrange.forEach(row => {
                cell = this.rows[row].getCell(col)?this.rows[row].getCell(col):Cell.createCell(this.rows[row],this.columns[col]);
                region.push(cell);
            });
        });
        if(region !== this.region){
            this.deselectheader();
            this.removeregion();
            this.region = region;
            this.activecell.isFocus = true;
            this.getMinMaxAvgCount();
            this.draw_region();
        }

    }
    }

    onregionpointerup(){
        window.removeEventListener("pointermove",this.onregionpointermovebound);
        window.removeEventListener("pointercancel",this.onregionpointercancelbound);
    }

    onregionpointercancel(){
        window.removeEventListener("pointermove",this.onregionpointermovebound);
        window.removeEventListener("pointerup",this.onregionpointerupbound);
    }

    onCopy(){
        this.copyregion = [];
        if(this.region.length > 0){
            this.draw();
            this.draw_region();
            this.copyregion = this.region;
            if(this.timer !== null){
                clearInterval(this.timer);
                this.timer = null;
            }

        }else if(this.columnselection.length > 0){
            this.draw();
            this.draw_selectedcols();
            this.columnselection.forEach(col => {
                this.copyregion.push(...Object.values(this.columns[col].cells));
            });
        }else if(this.rowselection.length > 0){
            this.draw();
            this.draw_selectedrows();
            this.rowselection.forEach(row => {
                this.copyregion.push(...Object.values(this.rows[row].cells));
            });
        }else if(this.activecell){
            this.draw();
            this.activecell.draw();
            this.copyregion = [this.activecell];
        }
        if(this.timer !== null){
            clearInterval(this.timer);
            this.timer = null;
        }
        this.draw_copy_region();
        this.copy_text_to_clipboard();
    }

    onPaste(){
        if(this.activecell){
            let selectionText;
            let selection = [];
            navigator.clipboard.readText().then(text => {
                text = text.replace("\r","");
                selectionText = text;
            }).catch(() => {
                selectionText = "";
            }).finally(() =>{
                selection = selectionText.split("\n");
                for(let index=0;index < selection.length;index++){
                    selection[index] = selection[index].split("\t");
                }
                let selectionrowrange = selection.length;
                let selectioncolrange = selection[0].length;
                let activecell = [];
                if(this.region.length > 0){
                    let initialrow  = this.region[0].row.index;
                    let initialcol = this.region[0].column.index;
                    let finalrow = initialrow;
                    let finalcol = initialcol;
                    this.region.forEach(cell => {
                        initialrow = Math.min(cell.row.index,initialrow);
                        initialcol = Math.min(cell.column.index,initialcol);
                        finalrow = Math.max(cell.row.index,finalrow);
                        finalcol = Math.max(cell.column.index,finalcol);
                    });
                    let cell;
                    for(let rowindex = 0;rowindex <= finalrow - initialrow - selectionrowrange + 1; rowindex+= selectionrowrange){
                        for(let colindex = 0;colindex <= finalcol - initialcol - selectioncolrange + 1;colindex += selectioncolrange){
                            if(!this.rows.hasOwnProperty(initialrow + rowindex)){
                                let row = new Row(initialrow + rowindex,
                                    this.x,
                                    this.rows[initialrow + rowindex-1].y + this.rows[initialrow + rowindex-1].cellHeight,
                                    this.cellWidth,
                                    this.cellHeight,
                                    this.canvas,
                                    this.rowcanvas);
                                this.rows[initialrow + rowindex] = row;
                            }
                            if(!this.columns.hasOwnProperty(initialcol + colindex)){
                                let col = new Column(initialcol + colindex,
                                    this.columns[initialcol + colindex - 1].x + this.columns[initialcol + colindex - 1].cellWidth,
                                    this.y,
                                    this.cellWidth,
                                    this.cellHeight,
                                    this.canvas,
                                    this.columncanvas);
                                this.columns[initialcol + colindex] = col;
                            }
                            cell = this.rows[initialrow + rowindex].getCell(initialcol + colindex)?this.rows[initialrow + rowindex].getCell(initialcol + colindex):Cell.createCell(this.rows[initialrow + rowindex],this.columns[initialcol + colindex]);
                            activecell.push(cell);
                            
                        }
                    }
                    if(!(activecell.includes(this.rows[initialrow].getCell(initialcol)))){
                        activecell.push(this.rows[initialrow].getCell(initialcol));
                    }
                    
                }else if(this.columnselection.length > 0){
                    let initialrow  = 1;
                    let initialcol = this.columnselection[0];
                    let finalrow = Object.keys(this.rows).length;
                    let finalcol = initialcol;
                    this.columnselection.forEach(col => {
                        initialcol = Math.min(col,initialcol);
                        finalcol = Math.max(col,finalcol);
                    });
                    for(let rowindex = 0;rowindex <= finalrow - initialrow - selectionrowrange + 1; rowindex+= selectionrowrange){
                        for(let colindex = 0;colindex <= finalcol - initialcol - selectioncolrange + 1;colindex += selectioncolrange){
                            activecell.push(this.rows[initialrow + rowindex].getCell(initialcol + colindex)?this.rows[initialrow + rowindex].getCell(initialcol + colindex):Cell.createCell(this.rows[initialrow + rowindex],this.columns[initialcol + colindex]));
                        }
                    }
                    if(!(activecell.includes(this.rows[initialrow].getCell(initialcol)))){
                        activecell.push(this.rows[initialrow].getCell(initialcol));
                    }
                }else if(this.rowselection.length > 0){
                    let initialcol  = 1;
                    let initialrow = this.rowselection[0];
                    let finalcol = Object.keys(this.columns).length;
                    let finalrow = initialrow;
                    this.rowselection.forEach(row => {
                        initialrow = Math.min(row,initialrow);
                        finalrow = Math.max(row,finalrow);
                    });
                    for(let rowindex = 0;rowindex <= finalrow - initialrow - selectionrowrange + 1; rowindex+= selectionrowrange){
                        for(let colindex = 0;colindex <= finalcol - initialcol - selectioncolrange + 1;colindex += selectioncolrange){
                            activecell.push(this.rows[initialrow + rowindex].getCell(initialcol + colindex)?this.rows[initialrow + rowindex].getCell(initialcol + colindex):Cell.createCell(this.rows[initialrow + rowindex],this.columns[initialcol + colindex]));
                        }
                    }
                    if(!(activecell.includes(this.rows[initialrow].getCell(initialcol)))){
                        activecell.push(this.rows[initialrow].getCell(initialcol));
                    }
                }else{
                    activecell.push(this.activecell);
                }
                this.reset();
                activecell.forEach(cell => {
                    this.paste_selection(cell,selection);
                })
            });
        }
    }

    paste_selection(activecell , selection){
        let initialrow = activecell.row.index;
        let initialcol = activecell.column.index;
        let rowcount = selection.length;
        let colcount = selection[0].length;
        let cell;
        for(let rowoffset = 0;rowoffset < rowcount;rowoffset++){
            for(let columnoffset = 0;columnoffset < colcount;columnoffset++){
                if(!this.rows.hasOwnProperty(initialrow + rowoffset)){
                    let row = new Row(initialrow + rowoffset,
                        this.x,
                        this.rows[initialrow + rowoffset-1].y + this.rows[initialrow + rowoffset-1].cellHeight,
                        this.cellWidth,
                        this.cellHeight,
                        this.canvas,
                        this.rowcanvas);
                    this.rows[initialrow + rowoffset] = row;
                }
                if(!this.columns.hasOwnProperty(initialcol + columnoffset)){
                    let col = new Column(initialcol + columnoffset,
                        this.columns[initialcol + columnoffset - 1].x + this.columns[initialcol + columnoffset - 1].cellWidth,
                        this.y,
                        this.cellWidth,
                        this.cellHeight,
                        this.canvas,
                        this.columncanvas);
                    this.columns[initialcol + columnoffset] = col;
                }
                cell = this.rows[initialrow + rowoffset].getCell(initialcol + columnoffset)?this.rows[initialrow + rowoffset].getCell(initialcol + columnoffset):Cell.createCell(this.rows[initialrow + rowoffset],this.columns[initialcol + columnoffset]);
                cell.text = selection[rowoffset][columnoffset]?selection[rowoffset][columnoffset]:"";
                this.region.push(cell);
            }
        }
        this.draw();
    }

    copy_text_to_clipboard(){
        if(this.copyregion.length > 0){
            let initialrow = this.copyregion[0].row.index;
            let initialcol = this.copyregion[0].column.index;
            let finalrow = this.copyregion[0].row.index;
            let finalcol = this.copyregion[0].column.index;
            this.copyregion.forEach(cell => {
                initialrow = Math.min(cell.row.index,initialrow);
                initialcol = Math.min(cell.column.index,initialcol);
                finalrow = Math.max(cell.row.index,finalrow);
                finalcol = Math.max(cell.column.index,finalcol)
            });
            let outstring = "";
            for(let row = initialrow;row <= finalrow ; row++){
                for(let col = initialcol;col <= finalcol;col++){
                    if(this.rows[row].cells && this.rows[row].cells.hasOwnProperty(col))
                    outstring = outstring.concat(this.rows[row].getCell(col).text);
                    outstring = outstring.concat("\t")
                }
                outstring = outstring.concat("\n");
            }
            outstring = outstring.replace("\t\n","\n");
            outstring = outstring.substring(0,outstring.length - 1);
            navigator.clipboard.writeText(outstring);
        }
    }

    deselectactivecell(){
        this.istyping = false;
        if(this.activecell){
        this.activecell.remove_inputbox();
        if(this.activecell.text === "") Cell.deleteCell(this.activecell);
        }
    }

    removeregion(){
        if(this.region.length > 0){
            this.deselectcells();
            this.deselectheader();
            this.region = [];
            this.regionselection = false;
            this.draw();
        }
    }

    deselectheader(){
        for(let col in this.columns){
            this.columns[col].header.isFocus = false;
            this.columns[col].header.isSelected = false;

        }
        for(let row in this.rows){
            this.rows[row].header.isFocus = false;
            this.rows[row].header.isSelected = false;

        }
    }

    deselectcells(){
        let curentcell,curentrow;
        for(let row in this.rows){
            curentrow = this.rows[row];
            for(let cell in curentrow.cells){
                curentcell = curentrow.cells[cell];
                curentcell.isSelected = false;
                curentcell.isFocus = false;
                if(curentcell.text.length <= 0) Cell.deleteCell(curentcell);
            }
        }
    }

    deselectcolumns(){
        this.columnselection.forEach(col => {
            this.columns[col].header.isSelected = false;
            this.columns[col].isSelected = false;
        }  
        )
    }

    deselectrows(){
        this.rowselection.forEach(row => {
            this.rows[row].header.isSelected = false;
            this.rows[row].isSelected = false;
        }  
        );
    }

    remove_copy(){
        if(this.timer) clearInterval(this.timer);
        this.timer = null;
        this.copyregion = [];
    }

    reset(){
        this.deselectcolumns();
        this.deselectrows();
        this.deselectactivecell();
        this.deselectcells();
        this.deselectheader();
        this.activecell = null;
        this.activecol = [];
        this.activerow = null;
        this.initialX = 0;
        this.initialY = 0;
        this.istyping = false;
        this.isdragging = false;
        this.regionselection = false;
        this.region = [];
        this.columnselection = [];
        this.rowselection = [];
        this.getMinMaxAvgCount();
        this.draw();
    }

    getRow(y){
        if(y< this.y + this.cellHeight) return 1;
        // if(y> this.y + this.height) return Object.keys(this.rows).length;
        for(let row in this.rows){
            if(this.rows[row].hittest(y)) return row;
        }
    }
    getCol(x){
        if(x<this.x + this.cellWidth) return 1;
        // if(x>this.x + this.width) return Object.keys(this.columns).length;
        for(let col in this.columns){
            if(this.columns[col].hittest(x)) return col;
        }
    }
    
    getColDiff(c1,c2){
        return c1.charCodeAt(0) - c2.charCodeAt(0);
    }

    getRowinRange(r1,r2){
        let rows = [];
        r1 = parseInt(r1);
        r2 = parseInt(r2);
        if(r1 === r2){
            rows.push(r1);
            return rows;
        }else if(r1<r2){
            for(let i = r1;i<=r2;i++){
                rows.push(i);
            }
            return rows;
        }else{
            for(let i=r2;i<=r1;i++){
                rows.push(i);
            }
            return rows;
        }
    }
    getColinRange(c1,c2){
        let cols = [];
        c1 = parseInt(c1);
        c2 = parseInt(c2);
        if(c2 === c1){
            cols.push(c1);
            return cols;
        }else if(c1<c2){
            for(let i = c1;i<=c2;i++){
                cols.push(i);
            }
            return cols;
        }else{
            for(let i=c2;i<=c1;i++){
                cols.push(i);
            }
            return cols;
        }
    }

    inboundX(x,offsetX,width){
        if(x + width + offsetX > this.width) return "right";
        if(x + offsetX < this.x + this.cellWidth) return "left";
        return "in";
    }

    inboundY(y,offsetY,height){
        if(y + offsetY < this.y + this.cellHeight) return "up";
        return "in";
    }

    colheaderhittest(x,y){
        if(x>this.cellWidth && y < this.cellHeight) return true;
        return false;
    }

    rowheaderhittest(x,y){
        if(x < this.cellWidth && y > this.cellHeight) return true;
        return false;
    }

    create_grid(){
        let rowindex = 1;
        let x = this.x;
        let y =this.y;
        let cell = null;
        let columnindex = 1;
        while(y < this.height){
            this.rows[rowindex] = new Row(rowindex,x,y,this.cellWidth,this.cellHeight,this.canvas,this.rowcanvas);
            rowindex+=1;
            y+=this.cellHeight;
        }
        x = this.x;
        y =this.y+15;
        while(x < this.width){
            this.columns[columnindex] = new Column(columnindex,x,y,this.cellWidth,this.cellHeight,this.canvas,this.columncanvas);
            columnindex += 1;
            x+=this.cellWidth;
        }
        y =this.y;
        rowindex = 1;
        while( y < this.height){
            columnindex = 1;
            x = this.x;           
            while( x < this.width){
                cell = new Cell(this.canvas,y*x + x,false,this.rows[rowindex],this.columns[columnindex]);
                this.columns[columnindex].add_cell(cell);
                this.rows[rowindex].add_cell(cell);
                columnindex += 1;
                x+=this.cellWidth;
            }
            rowindex += 1;
            y += this.cellHeight;
        }
    }


    draw_rows(){
        for(let row of this.boundedrows){ 
            this.rows[row].draw();
        }
    }
    draw_cols(){
        for(let col of this.boundedcols){ 
            this.columns[col].draw();
        }
    }

    draw_region(){
        let scrolloffsetX = this.Scrollbar.getScrollLeft();
        let scrolloffsetY = this.Scrollbar.getScrollTop();
        if(this.region.length > 0){
            let r1=this.region[0].row.index;
            let r2 = r1;
            let c1 = this.region[0].column.index;
            let c2 = c1;
            this.region.forEach(cell => {
                cell.isSelected = true;
                cell.column.header.isFocus = true;
                cell.row.header.isFocus = true;
                if(cell.row.index in this.boundedrows && cell.column.index in this.boundedcols){
                    cell.draw(scrolloffsetX,scrolloffsetY);
                }
                c1 = c1>cell.column.index?cell.column.index:c1;
                c2 = c2<cell.column.index?cell.column.index:c2;
                r1 = r1>cell.row.index?cell.row.index:r1;
                r2 = r2<cell.row.index?cell.row.index:r2;
            });
            let rowsrange = this.getRowinRange(r1,r2);
            let colrange = this.getColinRange(c1,c2);
            rowsrange.forEach(row =>{
                if(row in this.boundedrows){
                    this.rows[row].header.draw(scrolloffsetX,scrolloffsetY);
                    this.rows[row].draw_boundary(scrolloffsetY);
                }
            });
            colrange.forEach(col => {
                if(col in this.boundedcols){
                    this.columns[col].header.draw(scrolloffsetX,scrolloffsetY);
                    this.columns[col].draw_boundary(scrolloffsetX);
                }
            });
            let topx = this.region[0].x - scrolloffsetX;
            let topy = this.region[0].y - scrolloffsetY;
            let bottomx = this.region[this.region.length-1].x - scrolloffsetX + this.region[this.region.length - 1].width;
            let bottomy = this.region[this.region.length-1].y - scrolloffsetY + this.region[this.region.length - 1].height;
            this.ctx.save();
            this.ctx.strokeStyle = "#107c41";
            this.ctx.lineWidth = "2";
            this.ctx.strokeRect((topx<bottomx?topx:bottomx) + 1,(topy<bottomy?topy:bottomy) + 1,Math.abs(topx-bottomx) - 1,Math.abs(topy-bottomy) - 1);
            this.ctx.restore();
            this.draw_copy_region();
        }
    }

    draw_copy_region(){
        let scrolloffsetX = this.Scrollbar.getScrollLeft();
        let scrolloffsetY = this.Scrollbar.getScrollTop();
        if(this.copyregion.length > 0){
            let topx = this.copyregion[0].x;
            let topy = this.copyregion[0].y;
            let bottomx = this.copyregion[this.copyregion.length-1].x + this.copyregion[this.copyregion.length - 1].width;
            let bottomy = this.copyregion[this.copyregion.length-1].y + this.copyregion[this.copyregion.length - 1].height;
            this.copyregion.forEach(cell => {
                topx = topx<cell.x?topx:cell.x;
                topy = topy<cell.y?topy:cell.y;
                bottomx = bottomx > cell.x + cell.width?bottomx:cell.x + cell.width;
                bottomy = bottomy > cell.y + cell.height?bottomy:cell.y + cell.height;
            });
            topx -= scrolloffsetX;
            bottomx -= scrolloffsetX;
            topy -= scrolloffsetY;
            bottomy -= scrolloffsetY;
            this.ctx.save();
            this.ctx.strokeStyle = "#ffffff";
            this.ctx.lineWidth = "2";
            if(this.columnselection.length > 0 || this.rowselection.length > 0){
                this.ctx.strokeRect((topx<bottomx?topx:bottomx) + 2,(topy<bottomy?topy:bottomy) + 2,Math.abs(topx-bottomx) - 3,Math.abs(topy-bottomy) - 3);
            }else{
                this.ctx.strokeRect((topx<bottomx?topx:bottomx) + 2,(topy<bottomy?topy:bottomy) + 2,Math.abs(topx-bottomx) - 3,Math.abs(topy-bottomy) - 3); 
            }
            this.ctx.setLineDash([4,2]);
            this.ctx.strokeStyle = "#107c41";
            this.ctx.lineWidth = "2";
            this.ctx.lineDashOffset = -this.offset;
            if(this.columnselection.length > 0 || this.rowselection.length > 0){
                this.ctx.strokeRect((topx<bottomx?topx:bottomx) + 2,(topy<bottomy?topy:bottomy) + 2,Math.abs(topx-bottomx) - 3,Math.abs(topy-bottomy) - 3);
            }else{
                this.ctx.strokeRect((topx<bottomx?topx:bottomx) + 2,(topy<bottomy?topy:bottomy) + 2,Math.abs(topx-bottomx) - 3,Math.abs(topy-bottomy) - 3); 
            }
            this.ctx.restore();
            if(this.timer === null) this.draw_copy_region_timer();
        }
    }

    draw_copy_region_timer(){
        if(this.timer !== null){
        this.offset = (this.offset + 1)%5;
        this.draw_copy_region();
        }else{
        this.timer = setInterval(()=> this.draw_copy_region_timer(),100);
        }
    }


    draw_selectedcols(){
        let scrolloffsetX = this.Scrollbar.getScrollLeft();
        let scrolloffsetY = this.Scrollbar.getScrollTop();
        if(this.columnselection.length > 0){
            this.columnselection.forEach(col => {
                this.columns[col].header.isSelected = true;
            });
            for(let col of this.boundedcols){
                this.columns[col].draw_without_boundary(scrolloffsetX,scrolloffsetY);
            }
            for(let row of this.boundedrows){
                this.rows[row].header.isFocus = true;
                this.rows[row].draw_boundary(scrolloffsetY);
                this.rows[row].draw_header(scrolloffsetY);
            }
            for(let col of this.boundedcols){
                this.columns[col].draw_boundary(scrolloffsetX);
            }
            // this.draw();
            if(this.activecell) this.activecell.draw(scrolloffsetX,scrolloffsetY);
            // this.draw();
            let topx = this.columns[this.columnselection[0]].x - scrolloffsetX;
            let bottomx = this.columns[this.columnselection[this.columnselection.length-1]].x - scrolloffsetX+ this.columns[this.columnselection[this.columnselection.length - 1]].cellWidth;
            this.ctx.save();
            this.ctx.strokeStyle ="#107c41";
            this.ctx.lineWidth = "2";
            this.ctx.strokeRect(topx + 1,1,bottomx - topx - 1,this.height);
            this.ctx.restore();
            this.draw_copy_region();

        }

    }

    draw_selectedrows(){
        let scrolloffsetY = this.Scrollbar.getScrollTop();
        let scrolloffsetX = this.Scrollbar.getScrollLeft();
        if(this.rowselection.length > 0){
            this.rowselection.forEach(row => {
                this.rows[row].header.isSelected = true;
            });
            for(let row of this.boundedrows){
                this.rows[row].draw_without_boundary(scrolloffsetX,scrolloffsetY);
            }
            for(let row of this.boundedrows){
                this.rows[row].draw_boundary(scrolloffsetY);
            }
            for(let col of this.boundedcols){
            this.columns[col].header.isFocus = true;
            this.columns[col].draw_boundary(scrolloffsetX);
            this.columns[col].draw_header(scrolloffsetX);
            }
            let topy = this.rows[this.rowselection[0]].y - scrolloffsetY;
            let bottomy = this.rows[this.rowselection[this.rowselection.length-1]].y + this.rows[this.rowselection[this.rowselection.length - 1]].cellHeight - scrolloffsetY;
            this.ctx.save();
            this.ctx.strokeStyle ="#107c41";
            this.ctx.lineWidth = "2";
            this.ctx.strokeRect(1,topy + 1,this.width,bottomy - topy - 1);
            this.ctx.restore();
            this.draw_copy_region();

        }

    }

    draw(){
        this.scrolloffsetX = this.Scrollbar.getScrollLeft();
        this.scrolloffsetY = this.Scrollbar.getScrollTop();
        this.boundedcols = Column.getBoundedColumns(this.columns,this.topX + this.scrolloffsetX , this.width + this.scrolloffsetX);
        this.boundedrows = Row.getBoundedRows(this.rows,this.topY + this.scrolloffsetY,this.height + this.scrolloffsetY);
        // Handling columns and rows before and after the starting and ending indices if there is some gap;
        // Hnadles empty bounded column array
        if(this.boundedcols.length < 1){
            let columnkeys = Object.keys(this.columns);
            let closestCol = columnkeys.pop();
            for(let col of columnkeys){
                if(Math.abs(this.columns[col].x + this.columns[col].cellWidth - this.scrolloffsetX) < Math.abs(this.columns[closestCol].x + this.columns[closestCol].cellWidth - this.scrolloffsetX)){
                    closestCol = col;
                }
            }
            if(this.columns[closestCol].x - this.scrolloffsetX > 0){
                let index = parseInt(closestCol);
                index -= Math.floor((this.columns[closestCol].x - this.scrolloffsetX)/this.cellWidth);
                let x = this.columns[closestCol].x - index*this.cellWidth;
                this.columns[index.toString()] = new Column(index,x,15,this.cellWidth,this.cellHeight,this.canvas,this.columncanvas);
                this.boundedcols.push(index.toString());
            }else{
                let index = parseInt(closestCol);
                index += Math.floor((this.scrolloffsetX - this.columns[closestCol].x - this.columns[closestCol].cellWidth)/this.cellWidth) + 1;
                let x = this.columns[closestCol].x + this.columns[closestCol].cellWidth + Math.floor((this.scrolloffsetX - this.columns[closestCol].x - this.columns[closestCol].cellWidth)/this.cellWidth)*this.cellWidth;
                this.columns[index.toString()] = new Column(index,x,15,this.cellWidth,this.cellHeight,this.canvas,this.columncanvas);
                this.boundedcols.push(index.toString());
            }

        }
        //handles empty boundedrows array
        if(this.boundedrows.length < 1){
            let rowkeys = Object.keys(this.rows);
            let closestRow = rowkeys.pop();
            for(let row of rowkeys){
                if(Math.abs(this.rows[row].y + this.rows[row].cellHeight - this.scrolloffsetY) < Math.abs(this.rows[closestRow].y + this.rows[closestRow].cellHeight - this.scrolloffsetY)){
                    closestRow = row;
                }
            }
            if(this.rows[closestRow].y - this.scrolloffsetY > 0){
                let index = parseInt(closestRow);
                index -= Math.floor((this.rows[closestRow].y - this.scrolloffsetY)/this.cellHeight);
                let y = this.rows[closestRow].y - index*this.cellHeight;
                this.rows[index.toString()] = new Row(index,0,y,this.cellWidth,this.cellHeight,this.canvas,this.rowcanvas);
                this.boundedrows.push(index.toString());
            }else{
                let index = parseInt(closestRow);
                index += Math.floor((this.scrolloffsetY - this.rows[closestRow].y - this.rows[closestRow].cellHeight)/this.cellHeight) + 1;
                let y = this.rows[closestRow].y + this.rows[closestRow].cellHeight + Math.floor((this.scrolloffsetY - this.rows[closestRow].y - this.rows[closestRow].cellHeight)/this.cellHeight)*this.cellHeight;
                this.rows[index.toString()] = new Row(index,0,y,this.cellWidth,this.cellHeight,this.canvas,this.rowcanvas);
                this.boundedrows.push(index.toString());
            }

        }

        while(this.width - (this.columns[this.boundedcols[this.boundedcols.length-1]].x + this.columns[this.boundedcols[this.boundedcols.length-1]].cellWidth - this.scrolloffsetX) > 0){
            let index = parseInt(this.boundedcols[this.boundedcols.length - 1]);
            if(this.columns.hasOwnProperty(index + 1)){
                this.boundedcols.push((index + 1).toString());
            }else{
                let newcol = new Column(index+1,this.columns[index].x + this.columns[index].cellWidth,15,this.cellWidth,this.cellHeight,this.canvas,this.columncanvas);
                this.boundedcols.push(newcol.index.toString());
                this.columns[index+1] = newcol;
            }
        }
        while((this.columns[this.boundedcols[0]].x - this.x - this.scrolloffsetX) > 0){
            let index = parseInt(this.boundedcols[0]);
            if(index === 1) break;
            if(this.columns.hasOwnProperty(index - 1)){
                this.boundedcols.unshift((index - 1).toString());
            }else{
                let newcol = new Column(index-1,this.columns[index].x - this.columns[index].cellWidth,15,this.cellWidth,this.cellHeight,this.canvas,this.columncanvas);
                this.boundedcols.unshift(newcol.index.toString());
                this.columns[index-1] = newcol;
            }
        }
        while(this.height - (this.rows[this.boundedrows[this.boundedrows.length-1]].y + this.rows[this.boundedrows[this.boundedrows.length-1]].cellHeight - this.scrolloffsetY) > 0){
            let index = parseInt(this.boundedrows[this.boundedrows.length - 1]);
            if(this.rows.hasOwnProperty(index + 1)){
                this.boundedrows.push((index+1).toString());
            }else{
                let newrow = new Row(index+1,0,this.rows[index].y + this.rows[index].cellHeight,this.cellWidth,this.cellHeight,this.canvas,this.rowcanvas);
                this.boundedrows.push(newrow.index.toString());
                this.rows[index+1] = newrow;
            }
        }
        while(this.rows[this.boundedrows[0]].y - this.scrolloffsetY - this.y > 0){
            let index = parseInt(this.boundedrows[0]);
            if(index === 1) break;
            if(this.rows.hasOwnProperty(index - 1)){
                this.boundedrows.unshift((index-1).toString());
            }else{
                let newrow = new Row(index-1,0,this.rows[index].y - this.rows[index].cellHeight,this.cellWidth,this.cellHeight,this.canvas,this.rowcanvas);
                this.boundedrows.unshift(newrow.index.toString());
                this.rows[index-1] = newrow;
            }
        }
        //handling gaps in between if there is any
        let prevEnd = this.rows[this.boundedrows[0]].y + this.rows[this.boundedrows[0]].cellHeight,nextStart;
        for(let row =1 ; row < this.boundedrows.length ; row++){
            nextStart = this.rows[this.boundedrows[row]].y;
            if(nextStart - prevEnd > 0){
                while(nextStart - (this.rows[this.boundedrows[row-1]].y + this.rows[this.boundedrows[row-1]].cellHeight) > 0){
                    let index = parseInt(this.boundedrows[row - 1]);
                    if(this.rows.hasOwnProperty(index + 1)){
                        this.boundedrows.splice(row,0,(index+1).toString());
                    }else{
                        let newrow = new Row(index+1,0,this.rows[index].y + this.rows[index].cellHeight,this.cellWidth,this.cellHeight,this.canvas,this.rowcanvas);
                        this.boundedrows.splice(row,0,newrow.index.toString());
                        this.rows[index+1] = newrow;
                    }
                    row++;
                }
            }
            prevEnd = nextStart + this.rows[this.boundedrows[row]].cellHeight;
        }
        prevEnd = this.columns[this.boundedcols[0]].x + this.columns[this.boundedcols[0]].cellWidth,nextStart;
        for(let col =1 ; col < this.boundedcols.length ; col++){
            nextStart = this.columns[this.boundedcols[col]].x;
            if(nextStart - prevEnd > 0){
                while(nextStart - (this.columns[this.boundedcols[col-1]].x + this.columns[this.boundedcols[col-1]].cellWidth) > 0){
                    let index = parseInt(this.boundedcols[col - 1]);
                    if(this.columns.hasOwnProperty(index + 1)){
                        this.boundedcols.splice(col,0,(index+1).toString());
                    }else{
                        let newcol = new Column(index+1,this.columns[index].x + this.columns[index].cellWidth,15,this.cellWidth,this.cellHeight,this.canvas,this.columncanvas);
                        this.boundedcols.splice(col,0,newcol.index.toString());
                        this.columns[index+1] = newcol;
                    }
                    col++;
                }
            }
            prevEnd = nextStart + this.columns[this.boundedcols[col]].cellWidth;
        }

        for(const col of this.boundedcols){ 
            this.columns[col].draw_without_boundary(this.scrolloffsetX,this.scrolloffsetY);
        }
        for(const row of this.boundedrows){ 
            this.rows[row].draw_without_boundary(this.scrolloffsetX,this.scrolloffsetY);
        }
        for(const row of this.boundedrows){ 
            this.rows[row].draw_boundary(this.scrolloffsetY);
        }
        for(const col of this.boundedcols){ 
            this.columns[col].draw_boundary(this.scrolloffsetX);
        }
        this.draw_selectedcols();
        this.draw_selectedrows();
        if(this.activecell) this.activecell.draw(this.scrolloffsetX,this.scrolloffsetY);
        this.draw_region();
        this.draw_copy_region();
        Column.removeColumns(this.columns,this.boundedcols);
        Row.removeRows(this.rows,this.boundedrows);
    }

    getMinMaxAvgCount(){
        let count = 0;
        let min = 9999999999;
        let max = 0;
        let sum = 0;
        let num;
        let numcount = 0;
        if(this.region.length > 0){
            this.region.forEach(cell => {
                if(cell.text !== ""){
                    count++;
                    if(!isNaN(cell.text)){
                            num = parseFloat(cell.text);
                            min = Math.min(min,num);
                            max = Math.max(max,num);
                            sum += num;
                            numcount++;
                    }
                }
            });
        }else if(this.columnselection.length > 0){
            this.columnselection.forEach(col => {
                for(let cell in this.columns[col].cells){
                    if(this.columns[col].cells[cell].text !== ""){
                        count++;
                        if(!isNaN(this.columns[col].cells[cell].text)){
                                num = parseFloat(this.columns[col].cells[cell].text);
                                min = Math.min(min,num);
                                max = Math.max(max,num);
                                sum += num;
                                numcount++;
                        }
                    }
            }
            });
        }else if(this.rowselection.length > 0){
            this.rowselection.forEach(row => {
                for(let cell in this.rows[row].cells){
                    if(this.rows[row].cells[cell].text !== ""){
                        count++;
                        if(!isNaN(this.rows[row].cells[cell].text)){
                                num = parseFloat(this.rows[row].cells[cell].text);
                                min = Math.min(min,num);
                                max = Math.max(max,num);
                                sum += num;
                                numcount++;
                        }
                    }
            }
            });
        }

        if(numcount > 0){
            let stats = {
                "count":count,
                "min":min,
                "max":max,
                "avg":sum/numcount,
                "sum":sum,
                "numcount":numcount,
            }
            this.draw_stats(stats);
        }else{
        this.footerctx.save();
        this.footerctx.fillStyle ="white";
        this.footerctx.fillRect(0,0,this.width + this.topX,this.height + this.topY);
        this.footerctx.restore();
        }
    }

    draw_stats(stats){
        let text = `Average :${stats.avg}\t\t Count :${stats.count}\t\t NumCount :${stats.numcount}\t\t  Min :${stats.min}\t\t Max :${stats.max}\t\t Sum :${stats.sum}\t`;
        this.footerctx.save();
        // this.footerctx.strokeStyle = "#e0e0e0";
        this.footerctx.fillStyle ="white";
        this.footerctx.lineWidth = "1";
        let textwidth = this.footerctx.measureText(text).width;
        this.footerctx.font = "12px Arial";
        this.footerctx.fillRect(0,0,this.width + this.topX,this.height + this.topY);
        this.footerctx.fillStyle = "rgb(96, 94, 92)";
        this.footerctx.fillText(text,this.x + this.width - textwidth - 40,20);
        this.footerctx.restore();
    }
}

export default Grid;
