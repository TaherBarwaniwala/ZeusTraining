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
        // this.stats = new Cell(this.x+this.width/2,this.y+this.height-this.cellHeight,this.width/2,this.cellHeight,this.canvas,"","black","grey");
        this.onpointerdownbound = (e) => this.onpointerdown(e);
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
    }

    onpointerdown(e){
        let x = e.pageX - this.topX;
        let y = e.pageY - this.topY;
        this.istyping = false;
        if(this.activecell) this.activecell.remove_inputbox();
        if(this.regionselection === true){
            this.deselectcells();
            this.deselectheader();
            this.region = [];
            this.regionselection = false;
            this.draw();
        }
        if(this.colheaderhittest(x,y)){
            for( let col in this.columns){
                if(this.columns[col].headerhittest(x,y)){
                    this.columns[col].isSelected = true;
                    this.activecol = col;
                    window.addEventListener("pointermove",this.oncolpointermovebound);
                    window.addEventListener("pointerup",this.oncolpointerupbound,{ once: true });
                    window.addEventListener("pointercancel",this.oncolpointercancelbound,{ once: true });
                    this.initialX = x;
                    this.initialY = y;
                }else{
                    this.columns[col].isSelected = false;
                }
            }
            for(let row in this.rows){ this.rows[row].isSelected = true;}
            this.draw();
        }else if(this.rowheaderhittest(x+this.topX,y)){

            for(let row in this.rows){
                if(this.rows[row].headerhittest(x,y)){
                    this.rows[row].isSelected = true;
                    this.activerow = row;
                    window.addEventListener("pointermove",this.onrowpointermovebound);
                    window.addEventListener("pointerup",this.onrowpointerupbound,{ once: true });
                    window.addEventListener("pointercancel",this.onrowpointercancelbound,{ once: true });
                    this.initialX = x;
                    this.initialY = y;
                }else{
                    this.rows[row].isSelected = false;
                }
            }
            for( let col in this.columns){
                this.columns[col].isSelected = true;
            }
            this.draw();

        }else{
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
            if(this.regionselection === true){
                this.deselectcells();
                this.deselectheader();
                this.region = [];
                this.regionselection = false;
                this.draw();
            }
            if(this.activecol) this.columns[this.activecol].header.isFocus= false;
            if(this.activerow) this.rows[this.activerow].header.isFocus = false;
            if(e.keyCode === 37){
                if (this.activecol !== "A") this.rows[this.activerow].onkeydown(e);
                let keys = Object.keys(this.columns);
                this.activecol = keys[keys.indexOf(this.activecol) + (this.activecol === "A"?0:-1)];
                this.activecell = this.columns[this.activecol].cells[this.activerow-1];
            }else if(e.keyCode ===38){
                if(this.activerow !== "1" ) this.columns[this.activecol].onkeydown(e);
                let keys = Object.keys(this.rows);
                this.activerow = keys[keys.indexOf(this.activerow) + (this.activerow === "1" ?0:-1)];
                this.activecell = this.columns[this.activecol].cells[this.activerow-1];
            }else if(e.keyCode === 39){
                this.rows[this.activerow].onkeydown(e);
                let keys = Object.keys(this.columns);
                this.activecol = keys[keys.indexOf(this.activecol) + 1];
                this.activecell = this.columns[this.activecol].cells[this.activerow-1];
            }else if(e.keyCode === 40){
                this.columns[this.activecol].onkeydown(e);
                let keys = Object.keys(this.rows);
                this.activerow = keys[keys.indexOf(this.activerow) + 1];
                this.activecell = this.columns[this.activecol].cells[this.activerow-1];
            }
            
            if(this.activecol) this.columns[this.activecol].header.isFocus = true;
            if(this.activerow) this.rows[this.activerow].header.isFocus = true;
            this.activecell.isFocus = true;
            this.draw();
        }else if(this.activecell && this.istyping){
            if(e.code === "Enter" || e.code === "Escape") this.istyping = false;
            this.activecell.onkeypress(e);
        }else if(this.activecell){
            this.activecell.create_inputbox(this.topX,this.topY);
            this.activecell.isFocus = true;
            this.istyping = true;
            this.activecell.onkeypress(e);
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
        this.region.forEach(cell => {
            cell.fillStyle = "white";
        });
        this.deselectheader();
        this.region = [];
        let cell;
        rowsrange.forEach(row => {
            colrange.forEach(col => {
                cell = this.columns[col].cells[row];
                this.region.push(cell);
                cell.fillStyle = "#caead8";
                this.columns[col].header.isFocus = true;
                this.rows[row].header.isFocus = true;
            });
        });
        // console.log(this.region);
        this.activecell.fillStyle = "white";
        this.activecell.strokeStyle = "#e0e0e0";
        this.draw();
        this.draw_region();
        this.getMinMaxAvgCount();
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

    deselectheader(){
        for(let col in this.columns){
            this.columns[col].header.isFocus = false;
        }
        for(let row in this.rows){
            this.rows[row].header.isFocus = false;
        }
    }

    deselectcells(){
        this.region.forEach(cell => cell.fillStyle = "white");
    }

    getRow(y){
        if(y< this.y + this.cellHeight) return 1;
        for(let row in this.rows){
            if(this.rows[row].hittest(y)) return row;
        }
    }
    getCol(x){
        if(x<this.x + this.cellWidth) return "A";
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
        let cmp = this.getColDiff(c1,c2);
        if(cmp === 0){
            cols.push(c1);
            return cols;
        }else if(cmp<0){
            for(let i = cmp;i<=0;i++){
                cols.push(c1);
                c1 = this.increment_col(c1);
            }
            return cols;
        }else{
            for(let i=0;i<=cmp;i++){
                cols.push(c2);
                c2 = this.increment_col(c2);
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
        let columnindex = 'A';
        while(y < this.height){
            this.rows[rowindex] = new Row(rowindex,x,y,this.cellWidth,this.cellHeight,this.canvas,this.rowcanvas);
            rowindex+=1;
            y+=this.cellHeight;
        }
        x = this.x;
        y =this.y+15;
        while(x < this.width){
            this.columns[columnindex] = new Column(columnindex,x,y,this.cellWidth,this.cellHeight,this.canvas,this.columncanvas);
            columnindex = this.increment_col(columnindex);
            x+=this.cellWidth;
        }
        // console.log(this.columns)
        y =this.y;
        rowindex = 1;
        while( y < this.height){
            columnindex = 'A';
            x = this.x;           
            while( x < this.width){
                cell = new Cell(x,y,this.cellWidth,this.cellHeight,this.canvas,y*x + x,false,this.rows[rowindex],this.columns[columnindex]);
                // console.log(columnindex);
                // this.columns[columnindex] = this.columns[columnindex]?this.columns[columnindex]:new Column(columnindex,x,y,this.cellWidth,this.cellHeight,this.canvas);
                this.columns[columnindex].add_cell(cell);
                this.rows[rowindex].add_cell(cell);
                columnindex = this.increment_col(columnindex);
                x+=this.cellWidth;
            }
            rowindex += 1;
            y += this.cellHeight;
        }
        console.log(this.rows);
        
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
        console.log(this.activecell);  

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