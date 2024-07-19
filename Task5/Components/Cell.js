class Cell{
    constructor(x,y,width,height,canvas,text = "",isHeader = false,strokeStyle = "#101010",fillStyle="white",textStyle = "black",align = "left",lineWidth="0.1",font="12px Arial"){
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
        this.row = null;
        this.column = null;
        this.isHeader = isHeader;
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
        if(this.isHeader){
            this.ctx.fillStyle = this.fillStyle;
            this.ctx.fillRect(this.x,this.y,this.renderWidth,this.height);
            this.ctx.strokeStyle =this.strokeStyle;
            this.ctx.lineWidth = this.lineWidth;
            this.ctx.strokeRect(this.x,this.y,this.renderWidth,this.height);
            }
        if(this.isFocus){
            this.ctx.fillStyle = this.fillStyle;
            this.ctx.fillRect(this.x,this.y,this.renderWidth,this.height);
            this.ctx.strokeStyle =this.focusStyle;
            this.ctx.lineWidth = "1";
            this.ctx.strokeRect(this.x,this.y,this.renderWidth,this.height);
            }
        if(this.isHeader && this.isFocus){
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
        }
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

    create_inputbox(topX,topY){
        this.inputbox = document.createElement('input');
        this.inputbox.setAttribute("type","text");
        this.inputbox.setAttribute("id",`C${this.x+topX}${this.y+topY}${this.height}${this.width}`);
        this.inputbox.setAttribute("class","input-box");
        this.inputbox.setAttribute("style",`top:${this.y+topY}px;left:${this.x+topX}px;height:${this.height}px;width:${this.renderWidth}px;`)
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

export default Cell;