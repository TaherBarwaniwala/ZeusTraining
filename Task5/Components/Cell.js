import Column from "./Column.js";
import Row from "./Row.js";

class Cell{
    /**
     * 
     * @param {HTMLCanvasElement} canvas 
     * @param {String} text 
     * @param {String} Header 
     * @param {Row} row 
     * @param {Column} column 
     * @param {String} strokeStyle 
     * @param {String} fillStyle 
     * @param {String} textStyle 
     * @param {String} align 
     * @param {Srting} lineWidth 
     * @param {String} font 
     * @returns {Cell}
     */
    constructor(canvas,text = "",Header = false,row=null,column=null,strokeStyle = "#101010",fillStyle="white",textStyle = "black",align = "left",lineWidth="0.1",font="12px Arial"){
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
        this.text = text;
        this.ctx.font = font;
        this.textwidth = this.ctx.measureText(this.text).width;
        this.onpointerdownbound = (e) => this.onpointerdown(e);
        this.onkeypressbound = (e) => this.onkeypress(e);
        this.onpointerdownupbound = () => this.onpointerup();
        // this.canvas.addEventListener('pointerdown',this.onpointerdownbound)
        return new Proxy(this,handler);

    }


    onpointerdown(){

        this.isFocus != this.isFocus;
        if(this.inputbox){
            this.text = this.inputbox.value;
            this.remove_inputbox();
        }
        this.draw();
    }
/**
 * 
 * @param {Number} x 
 * @param {Number} y 
 * @returns {Boolean}
 */
    hittest(x,y){
        if(x<this.x + 2 || x>this.x+this.width - 2 || y<this.y + 2 || y>this.y+this.height - 2) return false;
        return true;
    }

    /**
     * 
     * @param {KeyboardEvent} event 
     */
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

    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     */

    draw(x,y){
        this.ctx.save();
        this.ctx.beginPath();
        if(this.Header === "column"){
            this.ctx.fillStyle = this.fillStyle;
            this.x = this.column.x;
            this.width = this.column.cellWidth;
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
            this.y = this.row.y;
            this.height = this.row.cellHeight;
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
            this.width = this.column.cellWidth;
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

    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     */

    draw_text(x,y){
        this.ctx.font = this.font;
        this.ctx.fillStyle = this.Header && this.isSelected ? "white":this.textStyle;
        let visblefraction = 1;
        if(this.textwidth > this.width) visblefraction = this.width/this.textwidth;
        if(this.align === "left"){
            this.ctx.fillText(this.text.toString().substring(0,parseInt((this.text.toString().length)*visblefraction)),this.x - x + 5,this.y - y +this.height - 5);
        }else if(this.align === "right"){
            this.ctx.fillText(this.text.toString().substring(0,parseInt((this.text.toString().length)*visblefraction)),this.x - x + this.width - this.textwidth - 5,this.y - y  + this.height - 5);
        }else if(this.align === "middle"){
            this.ctx.fillText(this.text.toString().substring(0,parseInt((this.text.toString().length)*visblefraction)),this.x - x +this.width/2 - (this.textwidth+1)/2,this.y - y +this.height -5);
        }
    }


    clear(x,y){
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.fillStyle = this.fillStyle;
        this.ctx.fillRect(this.x - x,this.y - y,this.renderWidth,this.height);
        this.ctx.strokeStyle = this.isFocus?this.focusStyle:this.strokeStyle;
        this.ctx.strokeRect(this.x - x,this.y - y,this.renderWidth,this.height);
        this.ctx.restore();
    }

    create_inputbox(){
        this.inputbox = document.createElement('input');
        this.inputbox.setAttribute("type","text");
        this.inputbox.setAttribute("id",`C${this.column.x}${this.row.y}${this.row.cellHeight}${this.column.cellWidth}`);
        this.inputbox.setAttribute("class","input-box");
        this.inputbox.setAttribute("style",`top:${this.row.y + 0.5}px;left:${this.column.x + 0.5}px;height:${this.row.cellHeight-1.5}px;width:${this.column.cellWidth-1.5}px;font:${this.font}`)
        this.canvas.parentElement.appendChild(this.inputbox); 
        this.inputbox.addEventListener('pointerdown',() => this.oninputpointerdown());
    }
    remove_inputbox(){
        if(this.inputbox){
            this.canvas.parentElement.removeChild(this.inputbox);
            this.inputbox = null;
            let updateEvent = new CustomEvent("updateRows",{
                detail : {
                    rows : [this.row]
                }
            });
            document.dispatchEvent(updateEvent);
        }
    }

    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     */
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
    /**
     * 
     * @param {Row} row 
     */
    update_row(row){
        if(!row){
            var a =10;
        }
        this.row = row;
    }

    /**
     * 
     * @param {Column} col 
     */
    update_col(col){
        if(!col){
            var a = 10;
        }
        this.column = col;
    }

    /**
     * 
     * @param {Row} row 
     * @param {Column} column 
     * @returns {Cell}
     */
    static createCell(row,column){
        let cell = new Cell(row.canvas,"",false,row,column);
        row.add_cell(cell);
        column.add_cell(cell);
        return cell;
    }

    /**
     * 
     * @param {Cell} cell 
     */

    static deleteCell(cell){
        if(cell.row && cell.column && !cell.isFocus && !cell.isSelected){
            let rowindex = cell.row.index;
            let colindex = cell.column.index;
            delete cell.row.cells[colindex];
            delete cell.column.cells[rowindex];
        };
    }

    static updateCellDB(cell){
        let obj = {};
        obj["Email"] = cell.row.cells[1]?.text;
        obj["Name"] = cell.row.cells[2]?.text;
        obj["Country"] = cell.row.cells[3]?.text;
        obj["State"] = cell.row.cells[4]?.text;
        obj["City"] = cell.row.cells[5]?.text;
        obj["TelephoneNumber"] = cell.row.cells[6]?.text;
        obj["AddressLine1"] = cell.row.cells[7]?.text;
        obj["AddressLine2"] = cell.row.cells[8]?.text;
        obj["DOB"] = cell.row.cells[9]?.text;
        obj["FY2019_20"] = cell.row.cells[10]?.text;
        obj["FY2020_21"] = cell.row.cells[11]?.text;
        obj["FY2021_22"] = cell.row.cells[12]?.text;
        obj["FY2022_23"] = cell.row.cells[13]?.text;
        obj["FY2023_24"] = cell.row.cells[14]?.text;
        fetch(`http://localhost:5081/api/UserDatas/${obj["Email"]}`,{
            method:"PUT",
            body:JSON.stringify(obj),
            headers : new Headers({"content-type":"application/json"}),
        }).then((res)=>console.log(res));
    }
}

const handler = {
    set(obj,prop,value){
        if(prop === "text"){
            let textwidth= obj.ctx.measureText(value).width;
            Reflect.set(obj,"textwidth",textwidth);
        }
        Reflect.set(obj,prop,value);
        // if(prop === "text" || prop === "row" || prop === "column"){
        //     Cell.updateCellDB(obj);
        // }
        return true;
    },
    
}

export default Cell;