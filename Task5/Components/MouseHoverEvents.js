import Grid from "./Grid.js";
import Scrollbar from "./Scollbar.js";

class MouseHoverEvents{
    /**
     * 
     * @param {Grid} grid 
     * @param {Scrollbar} scrollbar 
     */
    constructor(grid,scrollbar){
        this.grid = grid;
        this.Scrollbar = scrollbar;
        this.onmousemovebound = (e) => this.onmousemove(e);
        window.addEventListener("mousemove",this.onmousemovebound);
    
    }
    /**
     * 
     * @param {MouseEvent} e 
     * @returns {null}
     */
    changemouseicon(e){
        let x = e.clientX - this.grid.topX + this.Scrollbar.getScrollLeft(),y = e.clientY - this.grid.topY + this.Scrollbar.getScrollTop();
        if(document.body.style.cursor === "grabbing") return;
        if(e.clientX > this.grid.topX && e.clientY > this.grid.topY){
            document.body.style.cursor = "cell";
        }else if(this.grid.columnEvents.isColEdgeSelect(x)){
            document.body.style.cursor = "col-resize";
        }else if(this.grid.rowEvents.isRowEdgeSelect(y)){
            document.body.style.cursor = "row-resize";    
        }else if(this.grid.columnEvents.isColDrag(e.clientY) || this.grid.rowEvents.isRowDrag(e.clientX)){
            document.body.style.cursor = "grab";
        }else{
            document.body.style.cursor = "default";
        }
        
    }
/**
 * 
 * @param {MouseEvent} e 
 */
    onmousemove(e){
        window.setTimeout(this.changemouseicon(e),500);
    }

}

export default MouseHoverEvents;