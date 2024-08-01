class KeyboardEvents{
    constructor(grid){
        this.grid = grid;
        this.onkeydownbound = (e)=> this.onkeydown(e);
        window.addEventListener('keydown',this.onkeydownbound);
    }
    
    onkeydown(e){
        if(this.grid.activecell && !this.grid.istyping && ((e.keyCode > 36 && e.keyCode < 41)||e.code === "Enter")){
            if(e.code === "Enter"){
                this.handleEnterdown();
            }else{
                this.handleArrawkeyDown(e);
                this.grid.draw();
            }
            this.grid.getMinMaxAvgCount();
        }else if(e.ctrlKey){
            this.handleCtrldown(e);
        }else if(e.code === "Escape"){
            this.handleEscKeyDown(e);
        }else if(this.grid.activecell && this.grid.istyping){
            if(e.code === "Enter" || e.code === "Escape") this.grid.istyping = false;
            this.grid.activecell.onkeypress(e);
            this.grid.draw();
        }else if(this.grid.activecell){
            if(e.code === "Enter" || e.code === "Escape"){
                this.grid.istyping = false;
            }else{
                this.grid.activecell.isFocus = true;
                this.grid.istyping = true;
                this.grid.activecell.onkeypress(e);
            }
        }
    }

    handleEnterdown(){
        if(this.grid.region.length > 0){
            for(let i = 0; i < this.grid.region.length ; i++){
                if(this.grid.activecell === this.grid.region[i]){
                    this.grid.activecell.isFocus = false;
                    this.grid.activecell = this.grid.region[(i + 1)%this.grid.region.length];
                    this.grid.activecell.isFocus = true;
                    break;
                }
            }
            this.grid.gridEvents.draw_region();
        }
    }

    handleArrawkeyDown(e){
        if(this.grid.activecell&& this.grid.boundedrows.includes(this.grid.activecell.row.index.toString()) && this.grid.boundedcols.includes(this.grid.activecell.column.index.toString())){
            this.grid.activecell.isFocus = true;
            this.grid.activecol = this.grid.activecell.column.index;
            this.grid.activerow = this.grid.activecell.row.index;
            if(this.grid.activecol) this.grid.columns[this.grid.activecol].header.isFocus= false;
            if(this.grid.activerow) this.grid.rows[this.grid.activerow].header.isFocus = false;
            if(e.keyCode === 37 || e.keyCode === 39){
                let res = this.grid.rows[this.grid.activerow].onkeydown(e);
                this.grid.activecol = res[0];
                if(!this.grid.columns[this.grid.activecol]){
                    delete this.grid.rows[this.grid.activerow].cells[this.grid.activecol];
                    return;
                }
                this.grid.activecell = res[1];
                this.grid.activecell.column = this.grid.columns[this.grid.activecol];
                this.grid.activecell.x = this.grid.columns[this.grid.activecol].x;
                this.grid.activecell.width = this.grid.columns[this.grid.activecol].cellWidth;
                this.grid.rows[this.grid.activerow].add_cell(this.grid.activecell);
                this.grid.columns[this.grid.activecol].add_cell(this.grid.activecell);
            }else if(e.keyCode ===38 || e.keyCode === 40 || e.code === "Enter"){
                let res = this.grid.columns[this.grid.activecol].onkeydown(e);
                this.grid.activerow = res[0];
                if(!this.grid.rows[this.grid.activerow]){
                    delete this.grid.columns[this.grid.activecol].cells[this.grid.activerow];
                    return;
                }
                this.grid.activecell = res[1];
                this.grid.activecell.row = this.grid.rows[this.grid.activerow];
                this.grid.activecell.y = this.grid.rows[this.grid.activerow].y;
                this.grid.activecell.height = this.grid.rows[this.grid.activerow].cellHeight;
                this.grid.rows[this.grid.activerow].add_cell(this.grid.activecell);
                this.grid.columns[this.grid.activecol].add_cell(this.grid.activecell);
            }            
            if(this.grid.activecol) this.grid.columns[this.grid.activecol].header.isFocus = true;
            if(this.grid.activerow) this.grid.rows[this.grid.activerow].header.isFocus = true;
            this.grid.activecell.isFocus = true;
    }
    }

    handleCtrldown(e){
        if( e.key === "c" || e.key === "C") this.grid.onCopy();
        if( e.key === "v" || e.key === "V") this.grid.onPaste();
    }

    handleEscKeyDown(e){
        if(this.grid.istyping){
            this.grid.activecell.onkeypress(e);
            this.grid.istyping = false;
            this.grid.draw();
        }else{
            navigator.clipboard.writeText("");
            this.grid.remove_copy();
            this.grid.draw();
            this.grid.gridEvents.draw_region();
            if(this.grid.columnselection.length > 0)this.grid.columnEvents.draw_selectedcols();
            if(this.grid.rowselection.length > 0)this.grid.rowEvents.draw_selectedrows();
        }
    }

}

export default KeyboardEvents;