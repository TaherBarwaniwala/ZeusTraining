import Cell from './Cell.js';
import Row from './Row.js';
import Column from './Column.js';
import Scrollbar from './Scollbar.js';
import ColumnEvents from './ColumnEvents.js';
import RowEvents from './RowEvents.js';
import GridEvents from './GridEvents.js';
import KeyboardEvents from './KeyboardEvents.js';
import MouseHoverEvents from './MouseHoverEvents.js';

class Grid{
    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} cellWidth 
     * @param {Number} cellHeight 
     * @param {HTMLCanvasElement} canvas 
     * @param {HTMLCanvasElement} columncanvas 
     * @param {HTMLCanvasElement} rowcanvas 
     * @param {HTMLCanvasElement} footercanvas 
     * @param {HTMLCanvasElement} allselectorcanvas 
     */
    constructor(x,y,cellWidth,cellHeight,canvas,columncanvas,rowcanvas,footercanvas,allselectorcanvas){
        this.topX = canvas.offsetParent.offsetLeft;
        this.topY = canvas.offsetParent.offsetTop;
        console.log(this.topX,this.topY);
        this.x = x;
        this.y = y;
        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.columncanvas = columncanvas;
        this.rowcanvas = rowcanvas;
        this.footercanvas = footercanvas;
        this.allselectorcanvas = allselectorcanvas;
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
        this.Scrollbar.setOnScrollFunction(()=>this.onscroll())
        this.mouseHoverEvents = new MouseHoverEvents(this,this.Scrollbar);
        this.keyboardEvents = new KeyboardEvents(this);
        this.gridEvents = new GridEvents(this,this.canvas,this.Scrollbar)
        this.columnEvents = new ColumnEvents(this,this.columncanvas,this.Scrollbar);
        this.rowEvents = new RowEvents(this,this.rowcanvas,this.Scrollbar);
        this.draw_triangle();
        this.onpointerdownallselectorbound = () => this.onpointerdownallselector();
        this.allselectorcanvas.addEventListener("pointerdown",this.onpointerdownallselectorbound);
    }

    /**
     * 
     */

    onpointerdownallselector(){
        this.reset();
        this.columnselection = Object.keys(this.columns);
        this.rowselection = Object.keys(this.rows);
        this.activecell = this.rows[1].getCell(1);
        this.draw();
    }


    onCopy(){
        this.copyregion = [];
        if(this.region.length > 0){
            this.draw();
            this.gridEvents.draw_region();
            this.copyregion = this.region;
            if(this.timer !== null){
                clearInterval(this.timer);
                this.timer = null;
            }

        }else if(this.columnselection.length > 0){
            this.draw();
            if(this.rowselection.length === 0)this.columnEvents.draw_selectedcols();
            this.columnselection.forEach(col => {
                this.copyregion.push(...Object.values(this.columns[col].cells));
            });
        }else if(this.rowselection.length > 0){
            this.draw();
            if(this.columnselection.length === 0)this.rowEvents.draw_selectedrows();
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

    /**
     * 
     * @param {Cell} activecell 
     * @param {Array<String>} selection 
     */

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
                    if(this.rows[row] && this.columns[col] && this.rows[row].cells && this.rows[row].cells.hasOwnProperty(col))
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

    /**
     * 
     * @param {Number} y 
     * @returns {Number | String}
     */

    getRow(y){
        if(y< this.y + this.cellHeight) return 1;
        // if(y> this.y + this.height) return Object.keys(this.rows).length;
        for(let row in this.rows){
            if(this.rows[row].hittest(y)) return row;
        }
    }
    /**
     * 
     * @param {Number} x 
     * @returns {Number | String}
     */
    getCol(x){
        if(x<this.x + this.cellWidth) return 1;
        // if(x>this.x + this.width) return Object.keys(this.columns).length;
        for(let col in this.columns){
            if(this.columns[col].hittest(x)) return col;
        }
    }
    
/**
 * 
 * @param {Number | String} r1 
 * @param {Number | String} r2 
 * @returns {Array<Number>}
 */
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

    /**
     * 
     * @param {Number | String} c1 
     * @param {Number | String} c2 
     * @returns {Array<Number>}
     */
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
        this.set_bounding_region();
        this.get_bounding_region();
        // y =this.y;
        // rowindex = 1;
        // while( y < this.height){
        //     columnindex = 1;
        //     x = this.x;           
        //     while( x < this.width){
        //         cell = new Cell(this.canvas,y*x + x,false,this.rows[rowindex],this.columns[columnindex]);
        //         this.columns[columnindex].add_cell(cell);
        //         this.rows[rowindex].add_cell(cell);
        //         columnindex += 1;
        //         x+=this.cellWidth;
        //     }
        //     rowindex += 1;
        //     y += this.cellHeight;
        // }
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


    draw_copy_region(){
        if(this.copyregion.length > 0){
            this.set_bounding_region();
            let scrolloffsetX = this.Scrollbar.getScrollLeft();
            let scrolloffsetY = this.Scrollbar.getScrollTop();
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


    draw_triangle(){
        this.allselectorctx = this.allselectorcanvas.getContext("2d");
        this.allselectorctx.save();
        let triangle = new Path2D();
        this.allselectorctx.strokeStyle = "#a0a0a0";
        this.allselectorctx.fillStyle = "#a0a0a0";
        triangle.moveTo(37,20);
        triangle.lineTo(37,37);
        triangle.lineTo(20,37);
        triangle.lineTo(37,20);
        triangle.closePath();
        this.allselectorctx.fill(triangle);
        this.allselectorctx.restore();
    }

    draw(){
        this.set_bounding_region();
       this.draw_allselector();
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
        this.gridEvents.draw_region();
        if(this.rowselection.length === 0)this.columnEvents.draw_selectedcols();
        if(this.columnselection.length === 0)this.rowEvents.draw_selectedrows();
        if(this.activecell) this.activecell.draw(this.scrolloffsetX,this.scrolloffsetY);
        this.draw_copy_region();
        Column.removeColumns(this.columns,this.boundedcols);
        Row.removeRows(this.rows,this.boundedrows);
    }

    draw_allselector(){
        if(this.rowselection.length > 0 && this.columnselection.length > 0){
            for(let col of this.boundedcols){
                // if(this.boundedcols.includes(col.toString())){
                    this.columns[col].header.isSelected = true;
                    this.columns[col].isSelected = true;
                // }
            }
            for(let row of this.boundedrows){
                // if(this.boundedrows.includes(row.toString())){
                    this.rows[row].isSelected = true;
                    this.rows[row].header.isSelected = true;
                // }
            }
            this.getMinMaxAvgCount();
        }
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

    /**
     * 
     * @param {Object}} stats 
     */
    draw_stats(stats){
        let text = `Average :${stats.avg}\t\t Count :${stats.count}\t\t NumCount :${stats.numcount}\t\t  Min :${stats.min}\t\t Max :${stats.max}\t\t Sum :${stats.sum}\t`;
        this.footerctx.save();
        // this.footerctx.strokeStyle = "#e0e0e0";
        this.footerctx.fillStyle ="white";
        this.footerctx.lineWidth = "1";
        let textwidth = this.footerctx.measureText(text).width;
        this.footerctx.font = "12px Arial";
        this.footerctx.clearRect(0,300,this.width + this.topX,this.height + this.topY);
        this.footerctx.fillStyle = "rgb(96, 94, 92)";
        this.footerctx.fillText(text,this.x + this.width - textwidth - 40,20);
        this.footerctx.restore();
    }



    set_bounding_region(){
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
                if(Math.abs(this.columns[col].x + this.columns[col].cellWidth - this.scrolloffsetX) < Math.abs(this.columns[closestCol].x + this.columns[closestCol].cellWidth - this.scrolloffsetX) ||
                Math.abs(this.columns[col].x - this.scrolloffsetX) < Math.abs(this.columns[closestCol].x - this.scrolloffsetX) ){
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
                if(Math.abs(this.rows[row].y + this.rows[row].cellHeight - this.scrolloffsetY) < Math.abs(this.rows[closestRow].y + this.rows[closestRow].cellHeight - this.scrolloffsetY) || 
                Math.abs(this.rows[row].y - this.scrolloffsetY) < Math.abs(this.rows[closestRow].y  - this.scrolloffsetY)){
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
                if(index-1 <= 0) break;
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
                if(index-1 <= 0 ) break;
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

    }

    throttle(fn, wait) {
        var time = Date.now();
        return function() {
          if ((time + wait - Date.now()) < 0) {
            fn();
            time = Date.now();
          }
        }
      }

    async get_bounding_region(){
        if(this.boundedrows.length > 0){
            this.boundedrows.sort();
            if(!this.rows[this.boundedrows[0]-1] || this.rows[this.boundedrows[0] - 1].cells.length === 0){
                this.throttle(this.fetchRows(parseInt(this.boundedrows[0]) - 1),2000);
            }else if(!this.rows[this.boundedrows[this.boundedrows.length-1]+1] || this.rows[this.boundedrows[this.boundedrows.length-1] + 1].cells.length === 0){
                this.throttle(this.fetchRows(parseInt(this.boundedrows[this.boundedrows.length -1]) + 1),2000);
            }

        }
    }

    fetchRows(row){
        row = parseInt(row);
        if(row <= 0) row = 1;
        fetch(`http://localhost:5081/api/UserDataCollection/${row}`).then(async(res)=>{
        let responseArray = await res.json();
        let i = 1;

        for(let j = 0;j<responseArray.length;j++){
            let res = responseArray[j];

            let rowobj = this.rows[row+j];

            if(rowobj === null || rowobj === undefined){
                if(!this.rows[row + j -1]) continue;
                rowobj = new Row(row + j,0,this.rows[row + j -1].y + this.rows[row + j -1].cellHeight,this.cellWidth,this.cellHeight,this.canvas,this.rowcanvas);
            }
            i = 1;
            for(let key in res){
                let cell = Cell.createCell(rowobj,this.columns[i.toString()]);
                cell.text = res[key];
                i++;
            }
            this.rows[row + j] = rowobj;

        }
        this.draw();
    });
    this.draw();
}

onscroll(){
        this.draw();
        this.get_bounding_region();
    }
}

export default Grid;
