import Cell from "./Cell.js";
import Grid from "./Grid.js";
import Row from "./Row.js";
import Scrollbar from "./Scollbar.js";

class RowEvents{

    /**
     * 
     * @param {Grid} grid 
     * @param {HTMLCanvasElement} rowcanvas 
     * @param {Scrollbar} scrollbar 
     */
    constructor(grid,rowcanvas,scrollbar){
        this.grid = grid;
        this.rowcanvas = rowcanvas;
        this.Scrollbar = scrollbar;
        this.onpointerdownrowbound = (e) => this.onpointerdownrow(e);
        this.rowcanvas.addEventListener("pointerdown",this.onpointerdownrowbound);
        this.onrowselectpointermovebound = (e) => this.onrowselectpointermove(e);
        this.onrowselectpointercancelbound = () => this.onrowselectpointercancel();
        this.onrowselectpointerupbound = () => this.onrowselectpointerup();
        this.onrowdragpointermovebound = (e) => this.onrowdragpointermove(e);
        this.onrowdragpointercancelbound = () => this.onrowdragpointercancel();
        this.onrowdragpointerupbound = () => this.onrowdragpointerup();
        this.onrowedgepointermovebound = (e)=>this.onrowedgepointermove(e);
        this.onrowedgepointercancelbound = () => this.onrowdragpointercancel();
        this.onrowedgepointerupbound = () => this.onrowedgepointerup();
    }

    /**
     * 
     * @param {PointerEvent} e 
     */

    onpointerdownrow(e){
        let x = e.clientX;
        let y = e.clientY;
        this.rowheaderpointerdown(x,y);
    }

    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     */
    rowheaderpointerdown(x,y){
        let scrolloffsetY = this.Scrollbar.getScrollTop();
        if(this.isRowEdgeSelect(y - this.grid.topY + scrolloffsetY)){
            this.onrowedgedrag(y);
        }else if(this.isRowSelect(x)){
            this.grid.reset();
            this.grid.activerow = this.grid.getRow(y-this.grid.topY + scrolloffsetY);
            this.grid.rows[this.grid.activerow].header.isSelected = true;
            this.grid.rows[this.grid.activerow].isSelected = true;
            this.grid.activecell = this.grid.rows[this.grid.activerow].getCell(1)?this.grid.rows[this.grid.activerow].getCell(1):Cell.createCell(this.grid.rows[this.grid.activerow],this.grid.columns[1]);
            this.grid.activecell.isFocus = true;
            this.grid.rowselection = [this.grid.activerow];
            this.grid.getMinMaxAvgCount();
            this.grid.draw()
            this.grid.removeregion();
            this.onrowselect(y);
        }else if(this.isRowDrag(x)){
            this.onrowdrag(y);
        }
    }
    /**
     * 
     * @param {Number} x 
     * @returns {Boolean}
     */
    isRowDrag(x){
        return (x<25);
    }

    /**
     * 
     * @param {Number} y 
     * @returns {Boolean}
     */

    isRowEdgeSelect(y){
        for(let row of this.grid.boundedrows){
            if(this.grid.rows[row].edgehittest(y)) return true;
        }
        return false;
    }


/**
 * 
 * @param {Number} y 
 */
    onrowedgedrag(y){
        let scrolloffsetY = this.Scrollbar.getScrollTop();
        this.initialY = y - this.grid.topY + scrolloffsetY;
        for(let row of this.grid.boundedrows){
            if(this.grid.rows[row].edgehittest(this.initialY)) this.grid.activerow = row;
        }
        this.grid.rows[this.grid.activerow].initialHeight = this.grid.rows[this.grid.activerow].cellHeight;
        for(let row in this.grid.rows){
            this.grid.rows[row].initialY = this.grid.rows[row].y;
        }
        window.addEventListener("pointermove",this.onrowedgepointermovebound);
        window.addEventListener("pointerup",this.onrowedgepointerupbound);
        window.addEventListener("pointercancel",this.onrowedgepointercancelbound);
        
    }

    onrowedgepointercancel(){
        window.removeEventListener("pointermove",this.onrowedgepointermovebound);
        window.addEventListener("pointerup",this.onrowedgepointerupbound);
        window.addEventListener("pointercancel",this.onrowedgepointercancelbound);
    }

    onrowedgepointerup(){
        window.removeEventListener("pointermove",this.onrowedgepointermovebound);
        window.addEventListener("pointercancel",this.onrowedgepointercancelbound);
        window.addEventListener("pointerup",this.onrowedgepointerupbound);
    }

    /**
     * 
     * @param {PointerEvent} e 
     */

    onrowedgepointermove(e){
        let offsetY = e.pageY - this.grid.topY - this.initialY + this.Scrollbar.getScrollTop();
        let activerow = parseInt(this.grid.activerow);
        if(this.grid.rows[this.grid.activerow].cellHeight + offsetY > 0){
            this.grid.rows[this.grid.activerow].resizeEdge(offsetY);
            for(let row in this.grid.rows){
                if(parseInt(row) > activerow){
                    this.grid.rows[row].resizeY(offsetY);
                }
            }
        }
        this.grid.draw();
    }

    /**
     * 
     * @param {Number} y 
     */

    onrowdrag(y){
        let scrolloffsetY = this.Scrollbar.getScrollTop();
        let initialY = y - this.grid.topY + scrolloffsetY;
        let currentrow = parseInt(this.grid.getRow(initialY));
        if(!this.grid.rowselection.includes(currentrow)){
            this.grid.reset();
            this.grid.activerow = currentrow;
            this.grid.rows[this.grid.activerow].header.isSelected = true;
            this.grid.rows[this.grid.activerow].isSelected = true;
            this.grid.activecell = this.grid.rows[this.grid.activerow].getCell(1)?this.grid.rows[this.grid.activerow].getCell(1):Cell.createCell(this.grid.rows[this.grid.activerow],this.grid.columns[1]);
            this.grid.activecell.isFocus = true;
            this.grid.rowselection = [this.grid.activerow];
            this.grid.draw();

            this.grid.removeregion();
            this.grid.rowselection = [this.grid.activerow];
        }
        this.initialY = initialY;
        let rows = this.grid.rowselection.map(row => this.grid.rows[row]);
        this.shadowrow = Row.create_shadowrow(rows);
        this.grid.getMinMaxAvgCount();
        window.addEventListener("pointermove",this.onrowdragpointermovebound);
        window.addEventListener("pointerup",this.onrowdragpointerupbound);
        window.addEventListener("pointercancel",this.onrowdragpointercancelbound);
    }

    /**
     * 
     * @param {PointerEvent} e 
     */

    onrowdragpointermove(e){
        document.body.style.cursor = "grabbing"
        let scrolloffsetY = this.Scrollbar.getScrollTop();
        let offsetY = e.pageY - this.grid.topY - this.initialY + scrolloffsetY;
        this.grid.activerow = this.grid.getRow(this.initialY+offsetY);
        this.grid.draw();
        if(this.grid.rows[this.grid.activerow]){
            this.shadowrow.moveShadow(offsetY - scrolloffsetY);
            if(this.grid.activerow)this.grid.rows[this.grid.activerow].draw_upBoundary(scrolloffsetY);
        }
    }

    onrowdragpointerup(){
        document.body.style.cursor = "grab"
        this.shadowrow = null;
        this.moverows();
        window.removeEventListener("pointermove",this.onrowdragpointermovebound);
        window.removeEventListener("pointercancel",this.onrowdragpointercancelbound);
        window.removeEventListener("pointerup",this.onrowdragpointerupbound);

    }

    onrowdragpointercancel(){
        document.body.style.cursor = "grab"
        this.shadowrow = null;
        this.moverows();
        window.removeEventListener("pointermove",this.onrowdragpointermovebound);
        window.removeEventListener("pointerup",this.onrowdragpointerupbound);
        window.removeEventListener("pointercancel",this.onrowdragpointercancelbound);
    }

    moverows(){
        let initialSelectionIndex;
        let finalSelectionIndex;
        if(this.grid.rowselection[0]<this.grid.rowselection[this.grid.rowselection.length-1]){
            initialSelectionIndex = this.grid.rowselection[0];
            finalSelectionIndex = this.grid.rowselection[this.grid.rowselection.length-1];
        }else{
            initialSelectionIndex = this.grid.rowselection[this.grid.rowselection.length-1];
            finalSelectionIndex = this.grid.rowselection[0];
        }
        if(this.grid.activerow <= finalSelectionIndex + 1 && this.grid.activerow >= initialSelectionIndex){
            this.grid.draw();
        }else if(this.grid.activerow < initialSelectionIndex){
            let offsetSelectedrow = this.grid.rows[initialSelectionIndex].y - this.grid.rows[this.grid.activerow].y;
            let offsetrows = this.grid.rows[finalSelectionIndex].y + this.grid.rows[finalSelectionIndex].cellHeight - this.grid.rows[initialSelectionIndex].y;
            for(let index = this.grid.activerow;index<initialSelectionIndex;index++){
                if(!this.grid.rows[index]) this.grid.rows[index] = new Row(index,0,this.grid.rows[index-1].y + this.grid.rows[index-1].cellHeight,this.grid.cellWidth,this.grid.cellHeight,this.grid.canvas,this.rowcanvas);
                this.grid.rows[index].y += offsetrows;
                this.grid.rows[index].index += finalSelectionIndex - initialSelectionIndex + 1;
                this.grid.rows[index].header.y += offsetrows;
                this.grid.rows[index].header.text = this.grid.rows[index].index;
                this.grid.rows[index].update_index();
            }
            for(let index = initialSelectionIndex;index <= finalSelectionIndex;index++){
                if(!this.grid.rows[index]) this.grid.rows[index] = new Row(index,0,this.grid.rows[index-1].y + this.grid.rows[index-1].cellHeight,this.grid.cellWidth,this.grid.cellHeight,this.grid.canvas,this.rowcanvas);
                this.grid.rows[index].y -= offsetSelectedrow;
                this.grid.rows[index].index -= initialSelectionIndex - this.grid.activerow;
                this.grid.rows[index].header.y -= offsetSelectedrow;
                this.grid.rows[index].header.text = this.grid.rows[index].index;
                this.grid.rows[index].update_index();
            }
            this.grid.rowselection = this.grid.rowselection.map(row => row -= initialSelectionIndex - this.grid.activerow);

        }else{
            let offsetSelectedrow = (this.grid.rows[this.grid.activerow].y) - (this.grid.rows[finalSelectionIndex].y + this.grid.rows[finalSelectionIndex].cellHeight) ;
            let offsetrows = this.grid.rows[finalSelectionIndex].y + this.grid.rows[finalSelectionIndex].cellHeight - this.grid.rows[initialSelectionIndex].y;
            for(let index = initialSelectionIndex;index <= finalSelectionIndex;index++){
                if(!this.grid.rows[index]) this.grid.rows[index] = new Row(index,0,this.grid.rows[index-1].y + this.grid.rows[index-1].cellHeight,this.grid.cellWidth,this.grid.cellHeight,this.grid.canvas,this.rowcanvas);
                this.grid.rows[index].y += offsetSelectedrow;
                this.grid.rows[index].index += this.grid.activerow - finalSelectionIndex - 1;
                this.grid.rows[index].header.y += offsetSelectedrow;
                this.grid.rows[index].header.text = this.grid.rows[index].index;
                this.grid.rows[index].update_index();
            }
            for(let index = finalSelectionIndex + 1;index<this.grid.activerow;index++){
                if(!this.grid.rows[index]) this.grid.rows[index] = new Row(index,0,this.grid.rows[index-1].y + this.grid.rows[index-1].cellHeight,this.grid.cellWidth,this.grid.cellHeight,this.grid.canvas,this.rowcanvas);
                this.grid.rows[index].y -= offsetrows;
                this.grid.rows[index].index -= finalSelectionIndex - initialSelectionIndex + 1;
                this.grid.rows[index].header.y -= offsetrows;
                this.grid.rows[index].header.text = this.grid.rows[index].index;
                this.grid.rows[index].update_index();
            }
            this.grid.rowselection = this.grid.rowselection.map(row => row +=this.grid.activerow - finalSelectionIndex - 1);

        }
        let rows = [];
        for(let row in this.grid.rows){
            rows.push(this.grid.rows[row]);
        }
        rows.forEach(row => {
            this.grid.rows[row.index] = row;
        });
        this.grid.draw();
    }

    /**
     * 
     * @param {Number} x 
     * @returns {Boolean} 
     */

    isRowSelect(x){
        return (x>this.grid.headerWidth/2);
    }

    /**
     * 
     * @param {Number} y 
     */
    onrowselect(y){
        this.grid.deselectcolumns();
        this.grid.deselectheader();
        this.grid.removeregion();
        this.initialY = y - this.grid.topY + this.Scrollbar.getScrollTop();
        window.addEventListener("pointermove",this.onrowselectpointermovebound);
        window.addEventListener("pointerup",this.onrowselectpointerupbound);
        window.addEventListener("pointercancel",this.onrowselectpointercancelbound);
    }

    onrowselectpointerup(){
        window.removeEventListener("pointermove",this.onrowselectpointermovebound);
        window.removeEventListener("pointercancel",this.onrowselectpointercancelbound);
        window.removeEventListener("pointerup",this.onrowselectpointerupbound);

    }

    onrowselectpointercancel(){
        window.removeEventListener("pointermove",this.onrowselectpointermovebound);
        window.removeEventListener("pointerup",this.onrowselectpointerupbound);
        window.removeEventListener("pointercancel",this.onrowselectpointercancelbound);
    }


    /**
     * 
     * @param {PointerEvent} e 
     */
    onrowselectpointermove(e){
        let offsetY = e.pageY - this.initialY - this.grid.topY + this.Scrollbar.getScrollTop();
        let initialRow = this.grid.getRow(this.initialY);
        let finalRow = this.grid.getRow(this.initialY + offsetY);
        if(initialRow && finalRow){
        this.grid.deselectrows();
        let rowrange = this.grid.getRowinRange(initialRow,finalRow);
        rowrange.forEach(row => {
            this.grid.rows[row].header.isSelected = true;
            this.grid.rows[row].isSelected = true;
        });
        this.grid.rowselection = rowrange;
        this.grid.getMinMaxAvgCount();
        this.grid.draw();

        }
    }

    
    draw_selectedrows_border(){
        if(this.grid.rowselection.length > 0){
            this.grid.set_bounding_region();
            let scrolloffsetY = this.Scrollbar.getScrollTop();
            let scrolloffsetX = this.Scrollbar.getScrollLeft();
            this.grid.rowselection.forEach(row => {
                this.grid.rows[row].header.isSelected = true;
                this.grid.rows[row].draw_header();
            });
            for(let col of this.grid.boundedcols){
            this.grid.columns[col].header.isFocus = true;
            this.grid.columns[col].draw_boundary(scrolloffsetX);
            this.grid.columns[col].draw_header(scrolloffsetX);
            }
            let topy = this.grid.rows[this.grid.rowselection[0]].y - scrolloffsetY;
            let bottomy = this.grid.rows[this.grid.rowselection[this.grid.rowselection.length-1]].y + this.grid.rows[this.grid.rowselection[this.grid.rowselection.length - 1]].cellHeight - scrolloffsetY;
            this.grid.ctx.save();
            this.grid.ctx.strokeStyle ="#107c41";
            this.grid.ctx.lineWidth = "2";
            this.grid.ctx.strokeRect(1,topy + 1,this.grid.width,bottomy - topy - 1);
            this.grid.ctx.restore();

        }

    }
    draw_selectedrows_background(){
        let scrolloffsetY = this.Scrollbar.getScrollTop();
        let scrolloffsetX = this.Scrollbar.getScrollLeft();
        let topy = this.grid.rows[this.grid.rowselection[0]].y - scrolloffsetY;
        let bottomy = this.grid.rows[this.grid.rowselection[this.grid.rowselection.length-1]].y + this.grid.rows[this.grid.rowselection[this.grid.rowselection.length - 1]].cellHeight - scrolloffsetY;
        this.grid.ctx.save();
        this.grid.ctx.strokeStyle ="#e7f1ec";
        this.grid.ctx.lineWidth = "2";
        this.grid.ctx.fillRect(1,topy + 1,this.grid.width,bottomy - topy - 1);
        this.grid.ctx.restore();
    }

}

export default RowEvents;