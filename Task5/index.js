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
    constructor(x, y, w, h ,canvas,fillStyle = "white",strokeStyle = "black"){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.fillStyle = fillStyle;
        this.strokeStyle = strokeStyle;
        this.objects = [];
        this.activeObj = null;

        this.pointerdownbound = (e)=>this.onpointerdown(e);
        this.pointermovebound = (e)=>this.onpointermove(e);
        this.pointerupbound = ()=>this.onpointerup();
        this.pointerupcancel = ()=>this.onpointerupcancel();
        this.canvas.addEventListener("pointerdown", this.pointerdownbound);       
        this.draw();  
    }

    onpointerdown(e) { 
        for(let i = this.objects.length-1;i>=0;i-- ){
            if(this.objects[i].isclicked(e.pageX,e.pageY)===true){
                this.activeObj = this.objects[i];
                window.addEventListener("pointermove", this.pointermovebound);
                window.addEventListener("pointerup", this.pointerupbound);
                window.addEventListener("pointercancel", this.pointerupcancel);
                break;
            }
        }
        
    };

    onpointermove(event) {
            if(this.activeObj){
                let x = event.pageX;
                let y =  event.pageY;
                this.activeObj.move(x,y);
                this.drawObjects();
            }
    };

    onpointerup () {
        window.removeEventListener("pointermove",this.pointermovebound);        
        this.activeObj = null;
    };

    onpointerupcancel(){
        window.removeEventListener("pointermove",this.pointermovebound);        
        this.activeObj = null;
    }

    draw = () => {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.fillStyle = this.fillStyle;
        this.ctx.fillRect(this.x,this.y,this.w,this.h);
        this.ctx.strokeStyle = this.strokeStyle;
        this.ctx.strokeRect(this.x,this.y,this.w,this.h);
        this.ctx.restore();
    };

    drawObjects = () => {
        this.draw();
        this.objects.forEach(object => object.draw());
    };

    add_object = (obj) => {
        obj.addboundary(this.x,this.y,this.w,this.h);
        this.objects.push(obj);
     };

}

class Circle{
    

    constructor(x,y,radius,context,margin=16,strokeStyle="random",fillStyle = "rgba(0,0,0,0)",lineWidth = 5){
        
        this.x = x;
        this.y = y;
        this.radius = radius;
        if(strokeStyle === "random"){
            this.strokeStyle = this.colorArray[Math.floor(Math.random()*31)];
        }else{
            this.strokeStyle = strokeStyle;
        }
        this.lineWidth = lineWidth;
        this.fillStyle = fillStyle;
        this.margin = margin;
        this.ctx = context;
        this.initialx = x;
        this.initialy = y;
        this.pointerx = x;
        this.pointery = y;
        this.hasbound = false;
        this.draw();
    }

    draw = () => {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.strokeStyle;
        this.ctx.lineWidth = this.lineWidth
        this.ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
        this.ctx.fillStyle = this.fillStyle;
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.restore();
    
    };

    distance = (x,y) => {
        return ((this.x - x)**2 + (this.y - y)**2)**0.5;
    };

    isclicked = ( x , y ) => {
        if(this.distance(x,y)> this.radius + this.margin) return false;
        if(this.distance(x,y)< this.radius - this.margin) return false;
        this.pointerx = x;
        this.pointery = y;
        this.initialx = this.x;
        this.initialy = this.y;
        return true;
    };

    move = (x , y) => {
        // console.log(x,y);
        if(this.hasbound){
            let offsetx = x - this.pointerx;
            let offsety = y - this.pointery;
            // console.log(offsetx,offsety);

            if(this.initialx + offsetx + this.radius + this.lineWidth/2 > this.bounadaryRight) offsetx = this.bounadaryRight - (this.initialx + this.radius + this.lineWidth/2 );
            if(this.initialx + offsetx - this.radius - this.lineWidth/2 < this.bounadaryLeft) offsetx = this.bounadaryLeft - (this.initialx - this.radius - this.lineWidth/2 ) ;
            if(this.initialy + offsety + this.radius + this.lineWidth/2 > this.boundaryDown) offsety = this.boundaryDown - (this.initialy + this.radius + this.lineWidth/2 );
            if(this.initialy + offsety - this.radius - this.lineWidth/2 < this.bounadaryUp) offsety = this.bounadaryUp - (this.initialy - this.radius - this.lineWidth/2 );
            // console.log(offsetx,offsety);
            this.x = this.initialx + offsetx;
            this.y = this.initialy + offsety;
        }else{
            this.x += x;
            this.y += y;
        }
    };

    addboundary(x,y,w,h){
        this.hasbound = true;
        this.bounadaryLeft = x;
        this.bounadaryRight = x+w;
        this.bounadaryUp = y;
        this.boundaryDown = y+h;
    }
    colorArray = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
        '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
        '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
        '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
        '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
        '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
        '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
        '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
        '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
        '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];

}

const container = new CanvasContainer(20,20,800,800,canvas);
const circle1 = new Circle(100,100,50 , context = ctx );
container.add_object(circle1);
const circle2 = new Circle(200,200,80,context = ctx);
container.add_object(circle2);
const circle3 = new Circle(150,150,50,context = ctx);
container.add_object(circle3);

// const container1 = new CanvasContainer(500,500,400,400);
// const circle11 = new Circle(600,600,50);
// container1.add_object(circle11);
// const circle21 = new Circle(700,700,80,16);
// container1.add_object(circle21);
// const circle31 = new Circle(650,650,50,16);
// container1.add_object(circle31);