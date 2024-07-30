class Cell{
    constructor(canvas,text = "",Header = false,row=null,column=null,strokeStyle = "#101010",fillStyle="white",textStyle = "black",align = "left",lineWidth="0.1",font="12px Arial"){

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
        this.focusStyle = "#137e43";
        this.renderWidth = this.width;
        this.align = align;
        this.Header = Header;
        this.row = row;
        this.column = column;
        this.textAlign = "left";
        this.isSelected = false;
        this.x=this.column?this.column.x:0;
        this.y=this.row?this.row.y:15;
        this.height = this.row?this.row.cellHeight:25;
        this.width = this.column?this.column.cellWidth:80;
        this.onpointerdownbound = (e) => this.onpointerdown(e);
        this.onkeypressbound = (e) => this.onkeypress(e);
        this.onpointerdownupbound = () => this.onpointerup();
        // this.canvas.addEventListener('pointerdown',this.onpointerdownbound)

    }

    onpointerup(){
        
    }


    onpointerdown(){
        // if(this.inputbox){
        //     this.isFocus = false;
        //     if(this.inputbox.value !== "") this.text = this.inputbox.value;
        //     this.remove_inputbox();
        //     this.draw();
        // }else{
        //     this.isFocus = true;
        //     this.create_inputbox();
        //     this.draw();
        // }
        this.isFocus != this.isFocus;
        if(this.inputbox){
            this.text = this.inputbox.value;
            this.remove_inputbox();
        }
        this.draw();
    }

    hittest(x,y){
        if(x<this.x + 2 || x>this.x+this.width - 2 || y<this.y + 2 || y>this.y+this.height - 2) return false;
        return true;
    }

    onkeypress(event){
        if(event.key === 'Escape'){
            this.remove_inputbox();
        }else if(!this.inputbox && event.key !== "Enter"){
            this.create_inputbox();
            this.inputbox.style.opacity = 1;
            this.inputbox.focus();
        }else if(this.inputbox){
            this.inputbox.style.opacity = 1;
            this.inputbox.focus();
            if(this.inputbox.scrollWidth > this.renderWidth){
                this.renderWidth += this.width;
                this.inputbox.style.width = this.renderWidth + "px";
            }
            if(event.key === 'Enter'){
                this.text = this.inputbox.value;
                this.inputbox.style.width = this.inputbox.value.length + "ch";
                while(this.renderWidth - this.width > this.inputbox.scrollWidth) this.renderWidth -= this.width;
                this.remove_inputbox();
                this.draw();
            }
           
        }
        
    }

    oninputpointerdown(){
        this.inputbox.style.opacity = 1;
        this.inputbox.focus();
        this.inputbox.value = this.text;
    }

    draw(x,y){
        this.ctx.save();
        this.ctx.beginPath();
        if(this.Header === "column"){
            this.ctx.fillStyle = this.fillStyle;
            this.ctx.fillRect(this.x - x,this.y,this.width,this.height);
            if(this.isFocus){
                this.ctx.beginPath();
                this.ctx.fillStyle = "#caead8";
                this.ctx.fillRect(this.x - x,this.y,this.width,this.height);
                this.ctx.strokeStyle =this.strokeStyle;
                this.ctx.lineWidth = "5";
                // this.ctx.strokeRect(this.x,this.y,this.renderWidth,this.height)
                this.ctx.strokeStyle = this.focusStyle;
                this.ctx.moveTo(this.x - x,this.y+this.height);
                this.ctx.lineTo(this.x - x+this.width,this.y+this.height);
                this.ctx.stroke();

            }else if(this.isSelected){
                this.ctx.fillStyle = "#107c41";
                this.ctx.fillRect(this.x - x,this.y,this.width,this.height);
                this.ctx.strokeStyle =this.strokeStyle;
                this.ctx.lineWidth = "1";
                // this.ctx.strokeRect(this.x,this.y,this.renderWidth,this.height)
                this.ctx.strokeStyle = "white";
                this.ctx.moveTo(this.x - x,this.y);
                this.ctx.lineTo(this.x - x,this.y+this.height);
                this.ctx.moveTo(this.x - x+this.width,this.y);
                this.ctx.lineTo(this.x - x+this.width,this.y+this.height);
                this.ctx.stroke();

            }
            this.ctx.strokeStyle =this.strokeStyle;
            this.ctx.lineWidth = this.lineWidth;
            this.ctx.beginPath();
            this.ctx.moveTo(this.x - x+0.5,this.y);
            this.ctx.lineTo(this.x - x + 0.5,this.y + this.height);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.moveTo(this.x - x + this.width + 0.5,this.y);
            this.ctx.lineTo(this.x - x + this.width + 0.5,this.y + this.height);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.moveTo(this.x - x,this.y + this.height - 0.5);
            this.ctx.lineTo(this.x - x + this.width,this.y + this.height - 0.5);
            this.ctx.stroke(); 
            if(this.text !== "") this.draw_text(x,0);

        }else if(this.Header === "row"){
            this.ctx.fillStyle = this.fillStyle;
            this.ctx.fillRect(this.x,this.y - y,this.width,this.height);
            if(this.isFocus){
                this.ctx.beginPath();
                this.ctx.fillStyle = "#caead8";
                this.ctx.fillRect(this.x ,this.y - y,this.width,this.height);
                this.ctx.strokeStyle =this.strokeStyle;
                this.ctx.lineWidth = "5";
                // this.ctx.strokeRect(this.x,this.y,this.renderWidth,this.height)
                this.ctx.strokeStyle = this.focusStyle;
                this.ctx.moveTo(this.x +this.width,this.y - y);
                this.ctx.lineTo(this.x +this.width,this.y - y+this.height);
                this.ctx.stroke();

            }else if(this.isSelected){
                this.ctx.strokeStyle =this.strokeStyle;
                this.ctx.lineWidth = "1";
                // this.ctx.strokeRect(this.x,this.y,this.renderWidth,this.height)
                this.ctx.strokeStyle = "white";
                this.ctx.moveTo(this.x ,this.y - y);
                this.ctx.lineTo(this.x ,this.y - y+this.height);
                this.ctx.moveTo(this.x +this.width,this.y - y);
                this.ctx.lineTo(this.x +this.width,this.y - y+this.height);
                this.ctx.stroke();
                this.ctx.fillStyle = "#107c41";
                this.ctx.fillRect(this.x  + 0.5,this.y - y + 0.5,this.width + 2.5,this.height + 2.5);

            }
            this.ctx.strokeStyle =this.strokeStyle;
            this.ctx.lineWidth = this.lineWidth;
            this.ctx.beginPath();
            this.ctx.moveTo(this.x  ,this.y - y + 0.5);
            this.ctx.lineTo(this.x + this.width,this.y - y + 0.5);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.moveTo(this.x ,this.y - y + this.height + 0.5);
            this.ctx.lineTo(this.x + this.width,this.y - y + this.height + 0.5);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.moveTo(this.x + this.width - 0.5,this.y - y);
            this.ctx.lineTo(this.x + this.width - 0.5,this.y - y + this.height);
            this.ctx.stroke(); 
            if(this.text !== "") this.draw_text(0,y);

        }else{
            this.x = this.column.x;
            this.y = this.row.y;
            this.height = this.row.cellHeight;
            this.width = this.row.cellWidth;
            this.align = isNaN(this.text)?"left":"right";
            if(this.isFocus){
                this.ctx.fillStyle = this.fillStyle;
                this.ctx.fillRect(this.x - x + 1.5,this.y - y + 1.5,this.width - 1.5,this.height - 1.5);
                if(!this.isSelected){
                    this.ctx.strokeStyle =this.focusStyle;
                    this.ctx.lineWidth = "2";
                    this.ctx.strokeRect(this.x - x + 1,this.y - y + 1,this.width - 1,this.height - 1);
                }
            } else if(this.isSelected){
                this.ctx.fillStyle = "#e7f1ec";
                this.ctx.fillRect(this.x - x,this.y - y,this.width,this.height);
            }
        if(this.text !== "") this.draw_text(x,y);
        }
        this.ctx.restore();
  
    }

    draw_text(x,y){
        this.ctx.font = this.font;
        this.ctx.fillStyle = this.Header && this.isSelected ? "white":this.textStyle;
        let visblefraction = 1;
        let textwidth = this.ctx.measureText(this.text).width;
        if(textwidth > this.width) visblefraction = this.width/textwidth;
        if(this.align === "left"){
            this.ctx.fillText(this.text.toString().substring(0,parseInt((this.text.toString().length)*visblefraction)),this.x - x + 5,this.y - y +this.height - 5);
        }else if(this.align === "right"){
            this.ctx.fillText(this.text.toString().substring(0,parseInt((this.text.toString().length)*visblefraction)),this.x - x + this.width - textwidth - 5,this.y - y  + this.height - 5);
        }else if(this.align === "middle"){
            this.ctx.fillText(this.text.toString().substring(0,parseInt((this.text.toString().length)*visblefraction)),this.x - x +this.width/2 - (textwidth+1)/2,this.y - y +this.height -5);
        }
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
        this.inputbox.setAttribute("id",`C${this.column.x}${this.row.y}${this.height}${this.width}`);
        this.inputbox.setAttribute("class","input-box");
        this.inputbox.setAttribute("style",`top:${this.row.y + 0.5}px;left:${this.column.x + 0.5}px;height:${this.row.cellHeight-1.5}px;width:${this.row.cellWidth-1.5}px;font:${this.font}`)
        this.canvas.parentElement.appendChild(this.inputbox); 
        this.inputbox.addEventListener('pointerdown',() => this.oninputpointerdown());
    }
    remove_inputbox(){
        if(this.inputbox){
            this.canvas.parentElement.removeChild(this.inputbox);
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
    update_row(row){
        if(!row){
            var a =10;
        }
        this.row = row;
    }
    update_col(col){
        if(!col){
            var a = 10;
        }
        this.column = col;
    }

    static createCell(row,column){
        let cell = new Cell(row.canvas,"",false,row,column);
        row.add_cell(cell);
        column.add_cell(cell);
        return cell;
    }

    static deleteCell(cell){
        if(cell.row && cell.column){
            let rowindex = cell.row.index;
            let colindex = cell.column.index;
            delete cell.row.cells[colindex];
            delete cell.column.cells[rowindex];
        };
    }
}

export default Cell;