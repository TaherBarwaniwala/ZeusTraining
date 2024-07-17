const canvas= document.getElementById("main-canvas");
const body = document.body;
canvas.setAttribute("height",body.clientHeight.toString()+"px");
canvas.setAttribute("width",body.clientWidth.toString()+"px");
const ctx = canvas.getContext('2d');

class Cell{
    constructor(x,y,width,height,canvas,text = "",strokeStyle = "black",fillStyle="white",lineWidth="0.5",font="16px serif",textStyle = "black"){
        this.x=x;
        this.y=y;
        this.height = height;
        this.width = width;
        this.text = text;
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.strokeStyle = strokeStyle;
        this.fillStyle = fillStyle;
        this.lineWidth = lineWidth;
        this.font = font;
        this.textStyle = textStyle;
        this.inputbox = null;
        this.isFocus = false;
        this.focusStyle = "green";
        this.renderWidth = this.width;
        
        this.onpointerdownbound = (e) => this.onpointerdown(e);
        this.onkeypressbound = (e) => this.onkeypress(e);
        this.onpointerdownupbound = () => this.onpointerup();
        // this.canvas.addEventListener('pointerdown',this.onpointerdownbound)

    }

    onpointerup(){
        
    }


    onpointerdown(){
        if(this.inputbox){
            this.isFocus = false;
            window.removeEventListener('keydown',this.onkeypressbound);
            if(this.inputbox.value !== "") this.text = this.inputbox.value;
            document.body.removeChild(this.inputbox);
            this.inputbox = null;
            this.draw();
        }else{
            this.isFocus = true;
            this.create_inputbox();
            // window.addEventListener('keydown',this.onkeypressbound);
            
            this.draw();
        }
    }

    hittest(x,y){
        if(x<this.x + 2 || x>this.x+this.width - 2 || y<this.y + 2 || y>this.y+this.height - 2) return false;
        return true;
    }

    onkeypress(event){
        if(this.inputbox !== null){
            this.inputbox.style.opacity = 1;
            this.inputbox.focus();
            if(this.inputbox.scrollWidth > this.renderWidth){
                this.renderWidth += this.width;
                this.inputbox.style.width = this.renderWidth + "px";
            }
            if(event.key === 'Escape'){
                document.body.removeChild(this.inputbox);
                this.inputbox = null;
            }
            if(event.key === 'Enter'){
                this.text = this.inputbox.value;
                this.inputbox.style.width = this.inputbox.value.length + "ch";
                while(this.renderWidth - this.width > this.inputbox.scrollWidth) this.renderWidth -= this.width;
                document.body.removeChild(this.inputbox);
                this.inputbox = null;
                this.draw();
            }
           
        }
        
    }

    oninputpointerdown(){
        this.inputbox.style.opacity = 1;
        this.inputbox.focus();
        this.inputbox.value = this.text;
    }

    draw(){
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.fillStyle = this.isFocus?this.focusStyle:this.fillStyle;
        this.ctx.fillRect(this.x,this.y,this.renderWidth,this.height);
        this.ctx.strokeStyle = this.isFocus?this.focusStyle:this.strokeStyle;
        this.ctx.strokeRect(this.x,this.y,this.renderWidth,this.height);
        this.ctx.font = this.font;
        this.ctx.fillStyle = this.textStyle;
        this.ctx.fillText(this.text,this.x + 4,this.y+this.height - 4);
        this.ctx.restore();
    }
    clear(){
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.fillStyle = this.fillStyle;
        this.ctx.fillRect(this.x,this.y,this.renderWidth,this.height);
        this.ctx.strokeStyle = this.isFocus?this.focusStyle:this.strokeStyle;
        this.ctx.strokeRect(this.x,this.y,this.renderWidth,this.height);
        this.ctx.restore();
    }

    create_inputbox(){
        this.inputbox = document.createElement('input');
        this.inputbox.setAttribute("type","text");
        this.inputbox.setAttribute("id",`C${this.x}${this.y}${this.height}${this.width}`);
        this.inputbox.setAttribute("class","input-box");
        this.inputbox.setAttribute("style",`top:${this.y}px;left:${this.x}px;height:${this.height}px;width:${this.renderWidth}px;`)
        document.body.appendChild(this.inputbox); 
        this.inputbox.addEventListener('pointerdown',() => this.oninputpointerdown());
    }
    remove_inputbox(){
        if(this.inputbox){
            this.text = this.inputbox.value;
            document.body.removeChild(this.inputbox);
            this.inputbox = null;
        }
    }
    move(x,y){
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.fillStyle = this.isFocus?this.focusStyle:this.fillStyle;
        this.ctx.fillRect(this.x + x,this.y + y,this.renderWidth,this.height);
        this.ctx.strokeStyle = this.isFocus?this.focusStyle:this.strokeStyle;
        this.ctx.strokeRect(this.x + x,this.y + y,this.renderWidth,this.height);
        this.ctx.font = this.font;
        this.ctx.fillStyle = this.textStyle;
        this.ctx.fillText(this.text,this.x + x+ 4,this.y+y+this.height - 4);
        this.ctx.restore();
    }
}

class Row{
    constructor(index,x,y,cellWidth,cellHeight,canvas){
        this.index = index;
        this.x = x;
        this.y = y;
        this.canvas = canvas;
        this.width = parseInt(this.canvas.getAttribute('width'));
        this.cellHeight = cellHeight;
        this.cellWidth = cellWidth;
        this.header = new Cell(this.x,this.y,this.cellWidth,this.cellHeight,this.canvas,this.index);
        this.cells = [this.header];
        this.isSelected = false;
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
            let activecellindex = -1;
            this.cells.forEach((cell,i)=>{
                if(cell.isFocus === true){
                    activecellindex = i;
                }
            });
            if(activecellindex > 0 && activecellindex<this.cells.length){
                this.cells[activecellindex].isFocus = false;
                this.cells[activecellindex].draw();
                this.cells[activecellindex-1].isFocus = true;
                this.cells[activecellindex - 1].draw();

            }
        }
        if(e.keyCode === 39){
            let activecellindex = -1;
            this.cells.forEach((cell,i)=>{
                if(cell.isFocus === true){
                    activecellindex = i;
                }
            });
            if(activecellindex > -1 && activecellindex<this.cells.length-1){
                this.cells[activecellindex].isFocus = false;
                this.cells[activecellindex].draw();
                this.cells[activecellindex+1].isFocus = true;
                this.cells[activecellindex+1].draw();

            }
        }
    }

    add_cell(cell){
        this.cells.push(cell);
    }

    draw(){
        if(this.isSelected){
            this.header.fillStyle = "yellow";
        }else{
            this.header.fillStyle = "white";
        }
        this.cells.forEach((cell)=>cell.draw());
        
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
        return (y>this.y+2 && y < this.y+this.cellHeight-2);
    }
}

class Column{
    constructor(index,x,y,cellWidth,cellHeight,canvas){
        this.index = index;
        this.x = x;
        this.y = y;
        this.canvas = canvas;
        this.height = parseInt(this.canvas.getAttribute('height'));
        this.cellHeight = cellHeight;
        this.cellWidth = cellWidth;
        this.isSelected = false;
        this.header = new Cell(this.x,this.y,this.cellWidth,this.cellHeight,this.canvas,this.index);
        this.cells = [this.header];
        this.onpointerdownbound = (e) => this.onpointerdown(e);
        // this.canvas.addEventListener('pointerdown',this.onpointerdownbound);
        this.onkeydownbound = (e) => this.onkeydown(e);
        // window.addEventListener('keydown',this.onkeydownbound);
        this.onpointermovebound = (e) => onpointermove(e);
        this.shadowcol = null;
    }

    onpointerdown(e){
        if(this.headerhittest(e.pageX,e.pageY))
        if(!this.isSelected){
            this.isSelected = true;
            this.initialX = e.pageX;
            this.initialY = e.pageY;
            // this.shadowcol = new Cell(this.x,this.y,this.width,this.height,this.canvas,"","darkgreen","lightgreen");
            // this.shadowcol.draw();
        }else{
            this.isSelected = false;
            this.header.fillStyle = "white";
            this.initialX = 0;
            this.initialY = 0;
            this.shadowcol = null;
        }
        this.draw()
        this.header.isFocus = false;
    }

    onopintermove(e){
        let offsetX = e.pageX - this.initialX;
        let offsetY = e.pageY - this.initialY;
        if(this.inbound(this.initialX+offsetX,this.initialY+offsetY)==="in"){
            this.shadowcol.move(offsetX,offsetY);
        }
    }

    onkeydown(e){
        if(e.keyCode === 38 ){
            let activecellindex = -1;
            this.cells.forEach((cell,i)=>{
                if(cell.isFocus === true){
                    activecellindex = i;
                }
            });
            if(activecellindex > 0 && activecellindex<this.cells.length){
                this.cells[activecellindex].isFocus = false;
                this.cells[activecellindex].draw();
                this.cells[activecellindex-1].isFocus = true;
                this.cells[activecellindex - 1].draw();

            }
        }
        if(e.keyCode === 40){
            let activecellindex = -1;
            this.cells.forEach((cell,i)=>{
                if(cell.isFocus === true){
                    activecellindex = i;
                }
            });
            if(activecellindex > -1 && activecellindex<this.cells.length-1){
                this.cells[activecellindex].isFocus = false;
                this.cells[activecellindex].draw();
                this.cells[activecellindex+1].isFocus = true;
                this.cells[activecellindex+1].draw();

            }
        }
    }

    add_cell(cell){
        this.cells.push(cell);
    }

    draw(){
        if(this.isSelected){
            this.header.fillStyle = "yellow";
        }else{
            this.header.fillStyle = "white";
        }
        this.cells.forEach((cell)=>cell.draw());
    }
    headerhittest(x,y){
        return this.header.hittest(x,y);
    }
    hittest(x){
        return (x>this.x + 2&&x<this.x+this.cellWidth - 2);
    }

    move(x){
        this.cells.forEach(cell => cell.move(x,0));
    }

}

class Grid{
    constructor(x,y,cellWidth,cellHeight,canvas){
        this.x = x;
        this.y = y;
        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;
        this.canvas = canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.cells = [];
        this.rows = {};
        this.columns = {};
        this.activecell = null;
        this.activecol = null;
        this.activerow = null;
        this.initialX = 0;
        this.initialY = 0;
        this.istyping = false;
        this.isdragging = false;
        this.onpointerdownbound = (e) => this.onpointerdown(e);
        this.canvas.addEventListener('pointerdown',this.onpointerdownbound);
        this.onkeydownbound = (e)=> this.onkeydown(e);
        window.addEventListener('keydown',this.onkeydownbound);
        this.onpointermovebound = (e) => this.oncolumndrag(e);
        this.onpointerupbound = (e) => this.onpointerup(e);
        this.onpointercancelbound = (e) => this.onpoinntercancel(e);
    }

    onpointerdown(e){
        let x = e.pageX;
        let y = e.pageY;
        this.istyping = false;
        if(this.activecell) this.activecell.remove_inputbox();
        if(this.colheaderhittest(x,y)){
            window.addEventListener("pointermove",this.onpointermovebound);
            window.addEventListener("pointerup",this.onpointerupbound);
            window.addEventListener("pointercancel",this.onpointercancelbound);
            this.initialX = x;
            this.initialY = y;
            for( let col in this.columns){
                if(this.columns[col].headerhittest(x,y)){
                    this.columns[col].isSelected = true;
                    this.columns[col].draw();
                    this.activecol = col;
                }else{
                    this.columns[col].isSelected = false;
                    this.columns[col].draw();
                }
            }
            for(let row in this.rows){ this.rows[row].isSelected = true;}
            this.draw_cols();
            this.draw_rows();
        }else if(this.rowheaderhittest(x,y)){
            for(let row in this.rows){
                if(this.rows[row].headerhittest(x,y)){
                    this.rows[row].isSelected = true;
                }else{
                    this.rows[row].isSelected = false;
                }
            }
            for( let col in this.columns){
                this.columns[col].isSelected = true;
            }
            this.draw_rows();
            this.draw_cols();

        }else{
            for(let col in this.columns){
                if(this.columns[col].hittest(x)){
                    this.activecol = col;
                    this.columns[this.activecol].isSelected = true;
                }else{
                    this.columns[col].isSelected = false;
                }
            }
            for(let row in this.rows){
                if(this.rows[row].hittest(y)){
                    this.activerow = row;
                    this.rows[this.activerow].isSelected=true;
                }else{
                    this.rows[row].isSelected = false;
                }
            }
            if(this.activecol !== -1 && this.activerow!==-1){
                if(this.activecell) this.activecell.isFocus = false;
                this.activecell = this.columns[this.activecol].cells[this.activerow]
                this.activecell.isFocus = true;
                this.draw_rows();
                this.draw_cols();
            }
           
        }

    }

    oncolumndrag(e){
        this.isdragging = true;
        let offsetX = e.pageX - this.initialX;
        if(this.inbound(this.columns[this.activecol],offsetX)==="in"){
            this.draw_cols();
            this.draw_rows();
            this.columns[this.activecol].move(offsetX);
        }
    }

    onpointerup(e){
        if(this.isdragging){
            window.removeEventListener("pointermove",this.onpointermovebound);
            let offsetX = e.pageX - this.initialX;
            let pastecol = null;
            for(let col in this.columns) {
                if(this.columns[col].hittest(this.initialX + offsetX)) pastecol = this.columns[col];
            }
            pastecol.cells.forEach((cell,i)=>{
                if(i > 0){
                cell.text = this.columns[this.activecol].cells[i].text;
                this.columns[this.activecol].cells[i].text = "";
                }
            });
            this.activecol = pastecol.index;
            this.draw_cols();
            this.draw_rows(); 
            this.isdragging = false;
        }
    }

    onpoinntercancel(e){
        if(this.isdragging){
            window.removeEventListener("pointermove",this.onpointermovebound);
            let offsetX = e.pageX - this.initialX;
            let pastecol = null;
            for(let col in this.columns) {
                if(this.columns[col].hittest(this.initialX + offsetX)) pastecol = this.columns[col];
            }
            pastecol.cells.forEach((cell,i)=>{
                if(i > 0){
                cell.text = this.columns[this.activecol].cells[i].text;
                this.columns[this.activecol].cells[i].text = "";
                }
            });
            this.activecol = pastecol.index;
            this.draw_cols();
            this.draw_rows(); 
            this.isdragging = false;
        }
    }

    onkeydown(e){
        if(!this.istyping && e.keyCode > 36 && e.keyCode < 41){
            if(this.activecol) this.columns[this.activecol].isSelected = false;
            if(this.activerow) this.rows[this.activerow].isSelected = false;
            if(e.keyCode === 37){
                if (this.activecol !== "A") this.rows[this.activerow].onkeydown(e);
                let keys = Object.keys(this.columns);
                this.activecol = keys[keys.indexOf(this.activecol) + (this.activecol === "A"?0:-1)];
                this.activecell = this.columns[this.activecol].cells[this.activerow];
            }else if(e.keyCode ===38){
                if(this.activerow !== "1" ) this.columns[this.activecol].onkeydown(e);
                let keys = Object.keys(this.rows);
                this.activerow = keys[keys.indexOf(this.activerow) + (this.activerow === "1" ?0:-1)];
                this.activecell = this.columns[this.activecol].cells[this.activerow];
            }else if(e.keyCode === 39){
                this.rows[this.activerow].onkeydown(e);
                let keys = Object.keys(this.columns);
                this.activecol = keys[keys.indexOf(this.activecol) + 1];
                this.activecell = this.columns[this.activecol].cells[this.activerow];
            }else if(e.keyCode === 40){
                this.columns[this.activecol].onkeydown(e);
                let keys = Object.keys(this.rows);
                this.activerow = keys[keys.indexOf(this.activerow) + 1];
                this.activecell = this.columns[this.activecol].cells[this.activerow];
                
            }
            
            if(this.activecol) this.columns[this.activecol].isSelected = true;
            if(this.activerow) this.rows[this.activerow].isSelected = true;
            this.draw_rows();
            this.draw_cols();
        }else if(this.istyping){
            if(e.code === "Enter" || e.code === "Escape") this.istyping = false;
            this.activecell.onkeypress(e);
        }else if(this.activecell){
            this.activecell.create_inputbox();
            this.activecell.isFocus = true;
            this.istyping = true;
            this.activecell.onkeypress(e);
        }
    }

    inbound(cell,offsetX){
        if(cell.x + cell.width + offsetX > this.width) return "right";
        if(cell.x + offsetX < this.x) return "left";
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
        let y =this.y + this.cellHeight;
        let cell = null;
        let columnindex = 'A';
        while(y < this.height){
            this.rows[rowindex] = new Row(rowindex,x,y,this.cellWidth,this.cellHeight,this.canvas);
            rowindex+=1;
            y+=this.cellHeight;
        }
        x = this.x + this.cellWidth;
        y =this.y;
        while(x < this.width){
            this.columns[columnindex] = new Column(columnindex,x,y,this.cellWidth,this.cellHeight,this.canvas);
            columnindex = this.increment_col(columnindex);
            x+=this.cellWidth;
        }
        y =this.y + this.cellHeight;
        rowindex = 1;
        while( y < this.height){
            columnindex = 'A';
            x = this.x + this.cellWidth;           
            while( x < this.width){
                cell = new Cell(x,y,this.cellWidth,this.cellHeight,this.canvas,'R'+y.toString()+'C'+x.toString());
                // this.columns[columnindex] = this.columns[columnindex]?this.columns[columnindex]:new Column(columnindex,x,y,this.cellWidth,this.cellHeight,this.canvas);
                this.columns[columnindex].add_cell(cell);
                this.rows[rowindex].add_cell(cell);
                columnindex = this.increment_col(columnindex);
                x+=this.cellWidth;
            }
            rowindex += 1;
            y += this.cellHeight;
        }
        
    }

    increment_col(index){
        if(index.length > 1){
            
        }else if(index.charCodeAt(0)>91){
            return 'A';
        }else{
            return String.fromCharCode(index.charCodeAt(0)+1);
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


}



// const cell = new Cell(10,10,50,25,canvas);
// const cell1 = new Cell(60,10,50,25,canvas);
// const cell2 = new Cell(110,10,50,25,canvas);
// const cell3 = new Cell(160,10,50,25,canvas);
// const cell4 = new Cell(10,35,50,25,canvas);
// const cell5 = new Cell(60,35,50,25,canvas);
// const cell6 = new Cell(110,35,50,25,canvas);
// const cell7 = new Cell(160,35,50,25,canvas);

// const row = new Row(10,20);
// row.add_cell(cell);
// row.add_cell(cell1);
// row.add_cell(cell2);
// row.add_cell(cell3);
// row.add_cell(cell4);
// row.add_cell(cell5);
// row.add_cell(cell6);
// row.add_cell(cell7);


// row.draw();
// let pageEnd = parseInt(canvas.getAttribute('height'));
// // console.log(pageEnd);
// let temprow = null;
// let y =0;
// while(y < pageEnd + 40){
//     temprow = new Row(0,y,80,40,canvas);
//     temprow.create_row();
//     temprow.draw();
//     y += 40;
// }
// const row = new Row(0,0,80,40,canvas);
// row.create_row();
// row.draw();

let grid = new Grid(0,0,80,40,canvas);
grid.create_grid();
grid.draw_rows();
grid.draw_cols();