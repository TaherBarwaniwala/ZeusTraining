import Cell from './Cell.js';
import Row from './Row.js';
import Column from './Column.js';

class Grid{
    constructor(topX,topY,x,y,cellWidth,cellHeight,canvas,columncanvas,rowcanvas){
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
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.cells = [];
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
        this.headerHeight = 40;
        this.headerWidth = 40;
        // this.stats = new Cell(this.x+this.width/2,this.y+this.height-this.cellHeight,this.width/2,this.cellHeight,this.canvas,"","black","grey");
        this.onpointerdownbound = (e) => this.onpointerdownmaincanvas(e);
        this.canvas.addEventListener('pointerdown',this.onpointerdownbound);
        this.onkeydownbound = (e)=> this.onkeydown(e);
        window.addEventListener('keydown',this.onkeydownbound);
        this.oncolpointermovebound = (e) => this.oncolumndrag(e);
        this.oncolpointerupbound = (e) => this.oncolpointerup(e);
        this.oncolpointercancelbound = (e) => this.oncolpointerup(e);
        this.onrowpointermovebound = (e) => this.onrowdrag(e);
        this.onrowpointerupbound = (e) => this.onrowpointerup(e);
        this.onrowpointercancelbound = (e) => this.onrowpointerup(e);
        this.onregionpointermovebound = (e) => this.onregionpointermove(e);
        this.onregionpointercancelbound = () => this.onregionpointercancel();
        this.onregionpointerupbound = () => this.onregionpointerup();
        this.onpointerdowncolumnbound = (e) => this.onpointerdowncolumn(e);
        this.columncanvas.addEventListener("pointerdown",this.onpointerdowncolumnbound);
        this.oncolselectpointermovebound = (e) => this.oncolselectpointermove(e);
        this.oncolselectpointercancelbound = (e) => this.oncolselectpointercancel(e);
        this.oncolselectpointerupbound = (e) => this.oncolselectpointerup(e);
        this.onpointerdownrowbound = (e) => this.onpointerdownrow(e);
        this.rowcanvas.addEventListener("pointerdown",this.onpointerdownrowbound);
        this.onrowselectpointermovebound = (e) => this.onrowselectpointermove(e);
        this.onrowselectpointercancelbound = (e) => this.onrowselectpointercancel(e);
        this.onrowselectpointerupbound = (e) => this.onrowselectpointerup(e);
    }

    onpointerdownmaincanvas(e){
        let x = e.pageX - this.topX;
        let y = e.pageY - this.topY;
        this.deselectactivecell();
        this.removeregion();
        if(this.colheaderhittest(x,y)){
            this.colheaderpointerdown(x,y);
        } else if(this.rowheaderhittest(x+this.topX,y)){
            this.rowheaderpointerdown(x,y);
        }else{
            this.cellspointerdown(e);
        }

    }

    onpointerdowncolumn(e){
        let x = e.pageX;
        let y = e.pageY;
        this.deselectactivecell();
        this.removeregion();
        this.colheaderpointerdown(x,y);
    }

    colheaderpointerdown(x,y){
        if(this.isColSelect(y)){
            this.oncolumnselect(x);
        }else if(this.isColDrag()){
            this.oncolumndrag();
        }
            // for( let col in this.columns){
            //     if(this.columns[col].headerhittest(x,y)){
            //         this.columns[col].isSelected = true;
            //         this.activecol = col;
            //         window.addEventListener("pointermove",this.oncolpointermovebound);
            //         window.addEventListener("pointerup",this.oncolpointerupbound,{ once: true });
            //         window.addEventListener("pointercancel",this.oncolpointercancelbound,{ once: true });
            //         this.initialX = x;
            //         this.initialY = y;
            //     }else{
            //         this.columns[col].isSelected = false;
            //     }
            // }
            // for(let row in this.rows){ this.rows[row].isSelected = true;}
            // this.draw();
    }

    isColSelect(y){
        return (y>this.headerHeight/2);
    }

    isColDrag(){

    }

    oncolumndrag(){
        
    }

    oncolumnselect(x){
        this.deselectrows();
        this.deselectheader();
        this.removeregion();
        this.initialX = x - this.topX;
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
        let offsetX = e.pageX - this.initialX - this.topX;
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
        // console.log(columnrange);
        // for(let col in this.columns){
        //     this.columns[col].draw();
        // }
        this.draw_selectedcols();
        for(let row in this.rows){
            this.rows[row].header.isFocus = true;
            this.rows[row].draw_boundary();
            this.rows[row].draw_header();
        }
        }
    }


    onpointerdownrow(e){
        let x = e.pageX;
        let y = e.pageY;
        this.deselectactivecell();
        this.removeregion();
        this.rowheaderpointerdown(x,y);
    }

    
    rowheaderpointerdown(x,y){
        if(this.isRowSelect(x)){
            this.onrowselect(y);
        }else if(this.isRowDrag(x)){
            this.onrowdrag(y);
        }
        // for(let row in this.rows){
        //     if(this.rows[row].headerhittest(x,y)){
        //         this.rows[row].isSelected = true;
        //         this.activerow = row;
        //         window.addEventListener("pointermove",this.onrowpointermovebound);
        //         window.addEventListener("pointerup",this.onrowpointerupbound,{ once: true });
        //         window.addEventListener("pointercancel",this.onrowpointercancelbound,{ once: true });
        //         this.initialX = x;
        //         this.initialY = y;
        //     }else{
        //         this.rows[row].isSelected = false;
        //     }
        // }
        // for( let col in this.columns){
        //     this.columns[col].isSelected = true;
        // }
        // this.draw();
    }

    isRowDrag(x){
        return (x<this.headerWidth/2);
    }

    onrowdrag(){
        this.deselectcolumns();
        this.deselectheader();
        this.removeregion();
    }

    isRowSelect(x){
        return (x>this.headerWidth/2);
    }

    onrowselect(y){
        this.deselectcolumns();
        this.deselectheader();
        this.removeregion();
        this.initialY = y - this.topY;
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
        let offsetY = e.pageY - this.initialY - this.topY;
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
        // console.log(columnrange);
        // for(let col in this.columns){
        //     this.columns[col].draw();
        // }
        this.draw_selectedrows();
        for(let column in this.columns){
            this.columns[column].header.isFocus = true;
            this.columns[column].draw_boundary();
            this.columns[column].draw_header();
        }
        }
    }


    cellspointerdown(e){
        this.deselectrows();
        this.deselectcolumns();
        let x = e.pageX - this.topX;
        let y = e.pageY - this.topY;
        this.initialX = e.pageX - this.topX;
        this.initialY = e.pageY - this.topY;
        for(let col in this.columns){
            if(this.columns[col].hittest(x)){
                this.activecol = col;
                this.columns[this.activecol].header.isFocus = true;
            }else{
                this.columns[col].header.isFocus = false;
            }
        }
        for(let row in this.rows){
            if(this.rows[row].hittest(y)){
                this.activerow = row;
                this.rows[this.activerow].header.isFocus=true;
            }else{
                this.rows[row].header.isFocus = false;
            }
        }
        if(this.activecol !== -1 && this.activerow!==-1){
            if(this.activecell === this.columns[this.activecol].cells[this.activerow-1]){
                this.activecell.create_inputbox(this.topX,this.topY);
                this.activecell.isFocus = true;
                this.istyping = true;
            }else if(this.activecell) this.activecell.isFocus = false;
            this.activecell = this.columns[this.activecol].cells[this.activerow-1]
            this.activecell.isFocus = true;
            this.draw();
            window.addEventListener("pointermove",this.onregionpointermovebound);
            window.addEventListener("pointerup",this.onregionpointerupbound,{once:true});
            window.addEventListener("pointercancel",this.onregionpointercancelbound,{once:true});
        }
    }


    oncolumndrag(e){
        this.isdragging = true;
        let offsetX = e.pageX - this.topX - this.initialX;
        if(this.inboundX(this.columns[this.activecol].x,offsetX,this.columns[this.activecol].width)==="in"){
            this.draw();
            this.columns[this.activecol].move(offsetX);
        }else if(this.inboundX(this.columns[this.activecol].x,offsetX,this.columns[this.activecol].width)==="left"){
            this.draw();
            this.columns[this.activecol].move(this.x+this.cellWidth - this.columns[this.activecol].x);
        }
    }

    onrowdrag(e){
        this.isdragging = true;
        let offsetY = e.pageY - this.topY - this.initialY;
        if(this.inboundY(this.rows[this.activerow].y,offsetY,this.rows[this.activerow].height)==="in"){
            this.draw();
            this.rows[this.activerow].move(offsetY);
        }else if(this.inboundY(this.rows[this.activerow].y,offsetY,this.rows[this.activerow].height)==="up"){
            this.draw();
            this.rows[this.activerow].move(this.y+this.cellHeight - this.rows[this.activerow].y);
        }
    }

    oncolpointerup(e){
        if(this.isdragging){
            window.removeEventListener("pointermove",this.oncolpointermovebound);
            let offsetX = e.pageX - this.topX - this.initialX;
            let pastecol = null;
            if(this.inboundX(this.columns[this.activecol].x,offsetX,this.columns[this.activecol].width)==="left")
                 offsetX = this.x+this.cellWidth - this.columns[this.activecol].x;
            for(let col in this.columns) {
                if(this.columns[col].hittest(this.initialX + offsetX)){
                        pastecol = col;
                        break;
                }
            }

            if(this.activecol.localeCompare(pastecol) < 0){
                let temp = JSON.parse(JSON.stringify(this.columns[this.activecol]));
                let prevcol = null
                for(let col in this.columns){
                    if(col === this.activecol){
                        prevcol = col;
                    }else if(prevcol === pastecol){
                        this.columns[prevcol].copy(temp);
                        prevcol = null;
                        break;
                    }else if(prevcol){
                        this.columns[prevcol].copy(this.columns[col]);
                        prevcol = col;
                    }
                }
            }else if(this.activecol.localeCompare(pastecol) > 0){
                let temp = JSON.parse(JSON.stringify(this.columns[this.activecol]));
                let col = this.activecol;
                let prevcol = null;
                while(prevcol !== pastecol){
                    prevcol = this.decrement_col(col);
                    this.columns[col].copy(this.columns[prevcol]);
                    col = prevcol;
                }
                this.columns[pastecol].copy(temp);
            }
            this.activecol = pastecol.index;
            if(this.activecell) this.activecell.isFocus = false;
            this.activecell = null;
            this.draw();
            this.isdragging = false;
        }
    }

    onrowpointerup(e){
        if(this.isdragging){
            window.removeEventListener("pointermove",this.onrowpointermovebound);
            let offsetY = e.pageY - this.topY - this.initialY;
            let pasterow = null;
            if(this.inboundY(this.rows[this.activerow].y,offsetY,this.rows[this.activerow].height)==="up")
                 offsetY = this.y+this.cellHeight - this.rows[this.activerow].y;
            for(let row in this.rows) {
                if(this.rows[row].hittest(this.initialY + offsetY)){
                        pasterow = row;
                        break;
                }
            }

            if(this.activerow - pasterow < 0){
                let temp = JSON.parse(JSON.stringify(this.rows[this.activerow]));
                let prevrow = null
                for(let row in this.rows){
                    if(row === this.activerow){
                        prevrow = row;
                    }else if(prevrow === pasterow){
                        this.rows[prevrow].copy(temp);
                        prevrow = null;
                        break;
                    }else if(prevrow){
                        this.rows[prevrow].copy(this.rows[row]);
                        prevrow = row;
                    }
                }
            }else if(this.activerow - pasterow > 0){
                let temp = JSON.parse(JSON.stringify(this.rows[this.activerow]));
                let row = this.activerow;
                let prevrow = row - 1;
                while(prevrow.toString() !== pasterow){               
                    this.rows[row].copy(this.rows[prevrow]);
                    row = prevrow;
                    prevrow = row - 1;
                }
                this.rows[pasterow].copy(temp);
            }
            this.activerow = pasterow.index;
            if(this.activecell) this.activecell.isFocus = false;
            this.activecell = null;
            this.draw();
            this.isdragging = false;
        }
    }

    onkeydown(e){
        if(this.activecell && !this.istyping && e.keyCode > 36 && e.keyCode < 41){
            this.removeregion();
            if(this.activecol) this.columns[this.activecol].header.isFocus= false;
            if(this.activerow) this.rows[this.activerow].header.isFocus = false;
            if(e.keyCode === 37 || e.keyCode === 39){
                // console.log(this.activerow);
                this.activecell = this.rows[this.activerow].onkeydown(e);
                // console.log(this.activecell);
                this.activecol = this.activecell.column.index;
            }else if(e.keyCode ===38 || e.keyCode === 40){
                this.activecell = this.columns[this.activecol].onkeydown(e);
                this.activerow = this.activecell.row.index;
            }            
            if(this.activecol) this.columns[this.activecol].header.isFocus = true;
            if(this.activerow) this.rows[this.activerow].header.isFocus = true;
            this.activecell.isFocus = true;
            this.draw();
        }else if(this.activecell && this.istyping){
            if(e.code === "Enter" || e.code === "Escape") this.istyping = false;
            this.activecell.onkeypress(e);
        }else if(this.activecell){
            // this.activecell.create_inputbox(this.topX,this.topY);
            if(e.code === "Enter" || e.code === "Escape"){
                this.istyping = false;
            }else{
                this.activecell.isFocus = true;
                this.istyping = true;
                this.activecell.onkeypress(e);
            }

        }
    }

    onregionpointermove(e){
        this.regionselection = true;
        let offsetX = e.pageX - this.topX - this.initialX;
        let offsetY = e.pageY - this.topY - this.initialY;
        if(this.inboundX(this.x+this.cellWidth,offsetX,this.width)==="left") offsetX = this.x + this.cellWidth - this.initialX;
        if(this.inboundY(this.y+this.cellHeight,offsetY,this.height)==="up") offsetY = this.y + this.cellHeight - this.initialY;
        let initialRow = this.getRow(this.initialY);
        let initialCol = this.getCol(this.initialX);
        let finalRow = null;
        let finalCol = null;
        finalRow = this.getRow(e.pageY - this.topX);
        finalCol = this.getCol(e.pageX - this.topY);
        if(finalRow && finalCol){
        let rowsrange = this.getRowinRange(initialRow,finalRow);
        let colrange = this.getColinRange(initialCol,finalCol);
        this.deselectheader();
        this.removeregion();
        this.region = [];
        let cell;
        rowsrange.forEach(row => {
            colrange.forEach(col => {
                cell = this.columns[col].cells[row-1];
                this.region.push(cell);
                cell.isSelected = true;
                this.columns[col].header.isFocus = true;
                this.rows[row].header.isFocus = true;
            });
        });
        // console.log(this.region);
        this.activecell.fillStyle = "white";
        this.activecell.strokeStyle = "#e0e0e0";
        // this.draw();
        this.draw_region();
        rowsrange.forEach(row =>{
            this.rows[row].header.draw();
            this.rows[row].draw_boundary();
        });
        colrange.forEach(col => {
            this.columns[col].header.draw();
            this.columns[col].draw_boundary();
        });

        // this.getMinMaxAvgCount();
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

    deselectactivecell(){
        this.istyping = false;
        if(this.activecell) this.activecell.remove_inputbox();
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
        }
        for(let row in this.rows){
            this.rows[row].header.isFocus = false;
        }
    }

    deselectcells(){
        this.region.forEach(cell => {
            cell.isSelected = false;
        });
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
        )
    }

    getRow(y){
        if(y< this.y + this.cellHeight) return 1;
        for(let row in this.rows){
            if(this.rows[row].hittest(y)) return row;
        }
    }
    getCol(x){
        if(x<this.x + this.cellWidth) return 1;
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
        // console.log(this.columns)
        y =this.y;
        rowindex = 1;
        while( y < this.height){
            columnindex = 1;
            x = this.x;           
            while( x < this.width){
                cell = new Cell(x,y,this.cellWidth,this.cellHeight,this.canvas,y*x + x,false,this.rows[rowindex],this.columns[columnindex]);
                // console.log(columnindex);
                // this.columns[columnindex] = this.columns[columnindex]?this.columns[columnindex]:new Column(columnindex,x,y,this.cellWidth,this.cellHeight,this.canvas);
                this.columns[columnindex].add_cell(cell);
                this.rows[rowindex].add_cell(cell);
                columnindex += 1;
                x+=this.cellWidth;
            }
            rowindex += 1;
            y += this.cellHeight;
        }
        // console.log(typeof this.columns);
        
    }

    increment_col(index){
        let code = index.charCodeAt(0);
        if(index.length > 1){
            
        }else if(code>91){
            return 'A';
        }else{
            return String.fromCharCode(code+1);
        }
    }

    decrement_col(index){
        let code = index.charCodeAt(0);
        if(index.length > 1){

        }else if(code<65){
            return 'A';
        }else{
            return String.fromCharCode(code-1);
        }
    }

    draw_rows(){
        for(const row in this.rows){ 
            this.rows[row].draw();
        }
    }
    draw_cols(){
        for(const col in this.columns){ 
            this.columns[col].draw();
        }
    }

    draw_region(){
        if(this.region.length > 0){
            let topx = this.region[0].x;
            let topy = this.region[0].y;
            let bottomx = this.region[this.region.length-1].x + this.region[this.region.length - 1].width;
            let bottomy = this.region[this.region.length-1].y + this.region[this.region.length - 1].height;
            this.ctx.save();
            this.ctx.strokeStyle = "#107c41";
            this.ctx.lineWidth = "5";
            this.ctx.strokeRect(topx<bottomx?topx:bottomx,topy<bottomy?topy:bottomy,Math.abs(topx-bottomx),Math.abs(topy-bottomy));
            this.ctx.restore();
            this.region.forEach(cell => cell.draw());
        }
    }

    draw_selectedcols(){
        if(this.columnselection.length > 0){
            for(let col in this.columns){
                this.columns[col].draw();
            }
            let topx = this.columns[this.columnselection[0]].x;
            let bottomx = this.columns[this.columnselection[this.columnselection.length-1]].x + this.columns[this.columnselection[this.columnselection.length - 1]].width;
            this.ctx.save();
            this.ctx.strokeStyle ="#107c41";
            this.ctx.lineWidth = "2";
            this.ctx.beginPath();
            this.ctx.moveTo(topx+2,0);
            this.ctx.lineTo(topx+2,this.height);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.moveTo(bottomx-2,0);
            this.ctx.lineTo(bottomx-2,this.height);
            this.ctx.stroke();
            this.ctx.restore();
        }
    }

    draw_selectedrows(){
        if(this.rowselection.length > 0){
            for(let row in this.rows){
                this.rows[row].draw();
            }
            let topy = this.rows[this.rowselection[0]].y;
            let bottomy = this.rows[this.rowselection[this.rowselection.length-1]].y + this.rows[this.rowselection[this.rowselection.length - 1]].height;
            this.ctx.save();
            this.ctx.strokeStyle ="#107c41";
            this.ctx.lineWidth = "2";
            this.ctx.beginPath();
            this.ctx.moveTo(0,topy);
            this.ctx.lineTo(this.width,topy);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.moveTo(0,bottomy);
            this.ctx.lineTo(this.width,bottomy);
            this.ctx.stroke();
            this.ctx.restore();
        }
    }

    draw(){

        for(const col in this.columns){ 
            this.columns[col].draw_without_boundary();
        }
        for(const row in this.rows){ 
            this.rows[row].draw_without_boundary();
        }
        for(const row in this.rows){ 
            this.rows[row].draw_boundary();
        }
        for(const col in this.columns){ 
            this.columns[col].draw_boundary();
        }
        if(this.activecell) this.activecell.draw();
        // console.log(this.activecell);  

    }

    getMinMaxAvgCount(){
        let count = 0;
        let min = 9999999999;
        let max = 0;
        let sum = 0;
        let num;
        let numcount = 0;
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
        let stats = {
            "count":count,
            "min":min,
            "max":max,
            "avg":sum/numcount,
            "sum":sum,
        }
        this.draw_stats(stats);
    }

    draw_stats(stats){
        this.stats.text = `Average :${stats.avg}\t Sum :${stats.sum}\t Count :${stats.count}\t Min :${stats.min}\t Max :${stats.max}\t `;
        this.stats.draw();
    }
}

export default Grid;