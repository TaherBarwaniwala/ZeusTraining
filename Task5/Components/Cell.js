class Cell{
    constructor(x,y,width,height,canvas,text = "",Header = false,row=null,column=null,strokeStyle = "#101010",fillStyle="white",textStyle = "black",align = "left",lineWidth="0.1",font="12px Arial"){
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
        this.focusStyle = "#137e43";
        this.renderWidth = this.width;
        this.align = align;
        this.Header = Header;
        this.row = row;
        this.column = column;
        this.textAlign = "left";
        this.isSelected = false;
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

    draw(){
        this.ctx.save();
        this.ctx.beginPath();
        if(this.Header === "column"){
            this.ctx.fillStyle = this.fillStyle;
            this.ctx.fillRect(this.x,this.y,this.renderWidth,this.height);
            this.ctx.strokeStyle =this.strokeStyle;
            this.ctx.lineWidth = this.lineWidth;
            this.ctx.strokeRect(this.x,this.y,this.renderWidth,this.height);
            if(this.isFocus){
                this.ctx.beginPath();
                this.ctx.fillStyle = "#caead8";
                this.ctx.fillRect(this.x,this.y,this.renderWidth,this.height);
                this.ctx.strokeStyle =this.strokeStyle;
                this.ctx.lineWidth = "5";
                // this.ctx.strokeRect(this.x,this.y,this.renderWidth,this.height)
                this.ctx.strokeStyle = this.focusStyle;
                this.ctx.moveTo(this.x,this.y+this.height);
                this.ctx.lineTo(this.x+this.width,this.y+this.height);
                this.ctx.stroke();

            }else if(this.isSelected){
                this.ctx.fillStyle = "#107c41";
                this.ctx.fillRect(this.x,this.y,this.renderWidth,this.height);
                this.ctx.strokeStyle =this.strokeStyle;
                this.ctx.lineWidth = "1";
                // this.ctx.strokeRect(this.x,this.y,this.renderWidth,this.height)
                this.ctx.strokeStyle = "white";
                this.ctx.moveTo(this.x,this.y);
                this.ctx.lineTo(this.x,this.y+this.height);
                this.ctx.moveTo(this.x+this.width,this.y);
                this.ctx.lineTo(this.x+this.width,this.y+this.height);
                this.ctx.stroke();

            }
 
        }else if(this.Header === "row"){
            this.ctx.fillStyle = this.fillStyle;
            this.ctx.fillRect(this.x,this.y,this.renderWidth,this.height);
            this.ctx.strokeStyle =this.strokeStyle;
            this.ctx.lineWidth = this.lineWidth;
            this.ctx.strokeRect(this.x,this.y,this.renderWidth,this.height);
            if(this.isFocus){
                this.ctx.beginPath();
                this.ctx.fillStyle = "#caead8";
                this.ctx.fillRect(this.x,this.y,this.renderWidth,this.height);
                this.ctx.strokeStyle =this.strokeStyle;
                this.ctx.lineWidth = "5";
                // this.ctx.strokeRect(this.x,this.y,this.renderWidth,this.height)
                this.ctx.strokeStyle = this.focusStyle;
                this.ctx.moveTo(this.x+this.width,this.y);
                this.ctx.lineTo(this.x+this.width,this.y+this.height);
                this.ctx.stroke();

            }else if(this.isSelected){
                this.ctx.fillStyle = "#107c41";
                this.ctx.fillRect(this.x,this.y,this.renderWidth,this.height);
                this.ctx.strokeStyle =this.strokeStyle;
                this.ctx.lineWidth = "1";
                // this.ctx.strokeRect(this.x,this.y,this.renderWidth,this.height)
                this.ctx.strokeStyle = "white";
                this.ctx.moveTo(this.x,this.y);
                this.ctx.lineTo(this.x,this.y+this.height);
                this.ctx.moveTo(this.x+this.width,this.y);
                this.ctx.lineTo(this.x+this.width,this.y+this.height);
                this.ctx.stroke();

            }
 
        }else{
            this.x = this.column.x;
            this.y = this.row.y;
            this.height = this.row.cellHeight;
            this.width = this.row.cellWidth;
            this.align = isNaN(this.text)?"left":"right";
            if(this.isFocus){
                this.ctx.fillStyle = this.fillStyle;
                this.ctx.fillRect(this.x,this.y,this.renderWidth,this.height);
                if(!this.isSelected){
                    this.ctx.strokeStyle =this.focusStyle;
                    this.ctx.lineWidth = "1";
                    this.ctx.strokeRect(this.x,this.y,this.renderWidth,this.height);
                }
            } else if(this.isSelected){
                this.ctx.fillStyle = "#e7f1ec";
                this.ctx.fillRect(this.x,this.y,this.renderWidth,this.height);
            }
        }
        if(this.text !== "") this.draw_text();
        this.ctx.restore();
  
    }

    draw_text(){
        this.ctx.font = this.font;
        this.ctx.fillStyle = this.Header && this.isSelected ? "white":this.textStyle;
        if(this.align === "left"){
            this.ctx.fillText(this.text,this.x + 4,this.y+this.height - 4);
        }else if(this.align === "right"){
            let textwidth = this.ctx.measureText(this.text).width;
            this.ctx.fillText(this.text,this.x + this.width - textwidth - 4,this.y + this.height - 4);
        }else if(this.align === "middle"){
            let textwidth = this.ctx.measureText(this.text).width;
            this.ctx.fillText(this.text,this.x+this.width/2 - textwidth+1/2,this.y+this.height -4);
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
        this.inputbox.setAttribute("id",`C${this.column.x + 40}${this.row.y +40}${this.height}${this.width}`);
        this.inputbox.setAttribute("class","input-box");
        this.inputbox.setAttribute("style",`top:${this.row.y + 40}px;left:${this.column.x + 40}px;height:${this.height}px;width:${this.renderWidth}px;`)
        document.body.appendChild(this.inputbox); 
        this.inputbox.addEventListener('pointerdown',() => this.oninputpointerdown());
    }
    remove_inputbox(){
        if(this.inputbox){
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

export default Cell;