const canvas = document.getElementById("circle-drag");
canvas.setAttribute("height","1000px");
canvas.setAttribute("width","1000px");
const ctx = canvas.getContext("2d");

// const rect = [ 20 , 20 , 500 , 500];
// const circle = [ 100 , 100 , 80];

// const drawCircle = (x,y,r) => {
//     this.ctx.beginPath();
//     this.ctx.arc(x,y,r,0,2*Math.PI);
//     this.ctx.stroke();
// }

// const drawRect = (x,y,h,w) => {
//     // this.ctx.beginPath();
//     // this.ctx.moveTo(x,y);
//     // this.ctx.lineTo(x,y+h);
//     // this.ctx.lineTo(x+w,y+h);
//     // this.ctx.lineTo(x+w,y);
//     // this.ctx.lineTo(x,y);
//     // this.ctx.stroke();
//     this.ctx.beginPath();
//     this.ctx.fillStyle="white";
//     this.ctx.fillRect(x,y,h,w);
//     this.ctx.strokeStyle = "black";
//     this.ctx.strokeRect(x,y,w,h);
// }

// const isboundRect = (x,y) => {
//     if(x + circle[2]>= rect[0] + rect[2] ) return false;
//     if(x - circle[2]<= rect[0]) return false;
//     if(y + circle[2]>= rect[1] + rect[3] ) return false;
//     if(y - circle[2]<= rect[1] ) return false;

//     return true;

// }

// const isboundCircle = (x,y) => {
//     if(x >= circle[0]+circle[2] ) return false;
//     if(x <= circle[0] - circle[2]) return false;
//     if(y >= circle[1] + circle[2]) return false;
//     if(y <= circle[1] - circle[2] ) return false;

//     return true;

// }
// drawRect(...rect);
// drawCircle(...circle);

// let ismousedown = false;

// document.addEventListener("mousedown", (event) => {
//     ismousedown = true;
// });

// document.addEventListener("mousemove",(event)=>{
//     if(ismousedown===true && isboundRect(event.clientX,event.clientY) && isboundCircle(event.clientX,event.clientY)){


//         drawRect(...rect);
//         console.log(event.clientX,event.clientY);
//         circle[0] = event.clientX;
//         circle[1] = event.clientY;


//         drawCircle(...circle);
//     }
// });

// document.addEventListener("mouseup",(event)=>{
//     ismousedown = false;
// })


// class CanvasContainer

// class circle
// {
//     pointerdown
//     pointerup
//     pointermove
//     pointercancel

// }

// css properties - touch-action
// pointer-events
// window.addEventListener

class CanvasContainer {
    constructor(x, y, w, h ,fillStyle = "white",strokeStyle = "black"){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.fillStyle = fillStyle;
        this.strokeStyle = strokeStyle;
        this.isdown = false;
        this.objects = [];
        this.initialx = 0;
        this.initialy = 0;
        this.activeObj = null;
        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute("height","1000px");
        this.canvas.setAttribute("width","1000px");
        this.ctx = this.canvas.getContext("2d");
        window.addEventListener("pointerdown",(e)=>{
            this.isdown = true;
            this.initialx = e.pageX - canvas.offsetLeft;
            this.initialy = e.pageY - canvas.offsetTop;
            var element;
            for(let i = this.objects.length-1;i>=0;i-- ){
                element = this.objects[i];
                // console.log(element);
            
                if(element.isclick(e.pageX,e.pageY)===true){
                    this.activeObj = element;
                    break;
                }
            }
            
        });
        window.addEventListener("pointermove",(event)=>{
            if(this.isdown && this.activeObj){
             // console.log(event);
             x = event.pageX - this.initialx - canvas.offsetLeft ;
             y =  event.pageY-this.initialy - canvas.offsetTop;
             if(this.inbound(x,y)){
                 this.activeObj.move(x,y);
                 this.initialx = event.pageX - canvas.offsetLeft;
                 this.initialy = event.pageY - canvas.offsetTop;
             }else{
                 let newX = x;
                 let newY = y;
                 if(this.activeObj.x+this.activeObj.radius + x >= this.x + this.w) newX =(this.activeObj.x + this.activeObj.radius) -  (this.x + this.w) ;
                 if(this.activeObj.x-this.activeObj.radius + x <= this.x) newX = (this.activeObj.x - this.activeObj.radius) -  (this.x);
                 if(this.activeObj.y+this.activeObj.radius + y>=this.y + this.h) newY = (this.activeObj.y + this.activeObj.radius) -  (this.y + this.h);
                 if(this.activeObj.y-this.activeObj.radius + y<= this.y) newY = (this.activeObj.y - this.activeObj.radius) -  (this.y);
                //  console.log(newX,newY);
                 this.activeObj.move(newX,newY);
                 this.initialx = event.pageX - canvas.offsetLeft;
                 this.initialy = event.pageY - canvas.offsetTop;
             }
             this.draw();
             this.drawObjects();
            }
         });
        window.addEventListener("pointerup", () => {
            this.isdown = false;
            this.initialx = 0;
            this.initialy = 0;
            this.activeObj = null;
        });
        this.draw();
       
    }

    draw(){
        this.ctx.beginPath();
        this.ctx.fillStyle = this.fillStyle;
        this.ctx.fillRect(this.x,this.y,this.w,this.h);
        this.ctx.strokeStyle = this.strokeStyle;
        this.ctx.strokeRect(this.x,this.y,this.w,this.h);
        ctx.drawImage(this.canvas,0,0);
    }

    drawObjects(){
        this.objects.forEach(object => object.draw());
    }

     add_object(obj){
        this.objects.push(obj);
     }

    inbound(x,y){
        if(this.activeObj.x+this.activeObj.radius + x >= this.x + this.w) return false;
        if(this.activeObj.x-this.activeObj.radius + x <= this.x) return false;
        if(this.activeObj.y+this.activeObj.radius + y>=this.y + this.h) return false;
        if(this.activeObj.y-this.activeObj.radius + y<= this.y) return false;
        return true;

    }

}

class Circle{
    constructor(x,y,radius,margin=16,strokeStyle="black"){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.strokeStyle= strokeStyle;
        this.margin = margin;
        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute("height","1000px");
        this.canvas.setAttribute("width","1000px");
        this.ctx = this.canvas.getContext("2d");
        this.draw();
    }

    draw(){
        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute("height","1000px");
        this.canvas.setAttribute("width","1000px");
        this.ctx = this.canvas.getContext("2d");
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.strokeStyle;
        this.ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
        this.ctx.stroke();
        ctx.drawImage(this.canvas,0,0);    
    }

    distance(x,y){
        // console.log(x,y,this.x,this.y);
        // console.log(((this.x - x)**2 + (this.y - y)**2)**0.5);
        return ((this.x - x)**2 + (this.y - y)**2)**0.5;
    }

    isclick( x , y ){
        if(this.distance(x,y)> this.radius+this.margin) return false;
        if(this.distance(x,y)< this.radius - this.margin) return false;
        return true;
    }

    move(x , y){
        this.clear();
        this.x += x;
        this.y += y;
        this.draw();
    }

    clear(){
        this.ctx.save();
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 3;
        this.ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
        this.ctx.stroke();
        this.ctx.restore();
    }

}

const container = new CanvasContainer(20,20,800,800);
const circle1 = new Circle(100,100,50);
container.add_object(circle1);
const circle2 = new Circle(200,200,80,8);
container.add_object(circle2);
const circle3 = new Circle(150,150,50,16);
container.add_object(circle3);