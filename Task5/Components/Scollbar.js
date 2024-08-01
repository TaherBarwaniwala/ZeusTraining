class Scrollbar{

    constructor(scroll_element = document.getElementById("main-canvas-container"),offset_element = document.getElementById("scroll-offset")){
        this.onscrollfunction = null;
        this.scroll_element = scroll_element;
        this.offset_element = offset_element;
        this.scrollLeft = 0;
        this.scrollTop = 0;
        this.onscrollbound = (e) => this.onscroll(e);
    }

    onscroll(e){
        
        if((this.offset_element.getBoundingClientRect().right <= window.innerWidth + 50) && (this.offset_element.getBoundingClientRect().right >= window.innerWidth - 50)){
            this.offset_element.setAttribute("style",`width:${Math.min(this.offset_element.scrollWidth*2,this.offset_element.scrollWidth + 4000)}px;height:${this.offset_element.scrollHeight}px`);
        }
        if((this.offset_element.getBoundingClientRect().bottom <= window.innerHeight + 50) && (this.offset_element.getBoundingClientRect().bottom >= window.innerHeight - 50)){
            this.offset_element.setAttribute("style",`width:${this.offset_element.scrollWidth}px;height:${Math.min(this.offset_element.scrollHeight*2,this.offset_element.scrollHeight + 4000)}px`);
        }
        if((this.offset_element.getBoundingClientRect().left <= 50)&&((this.offset_element.getBoundingClientRect().left >= 0))){
            this.offset_element.setAttribute("style",`width:${Math.max(2000,this.offset_element.scrollWidth/2)}px;height:${this.offset_element.scrollHeight}px`);
        }
        if((this.offset_element.getBoundingClientRect().top <= window.innerHeight + 50) && (this.offset_element.getBoundingClientRect().top >= window.innerHeight - 50)){
            this.offset_element.setAttribute("style",`width:${this.offset_element.scrollWidth}px;height:${Math.max(2000,this.offset_element.scrollHeight/2)}px`);
        }
        window.setTimeout(this.onscrollfunction,200);
    }

    getScrollLeft(){
        return this.scroll_element.scrollLeft;
    }

    getScrollTop(){
        return this.scroll_element.scrollTop;
    }

    setOnScrollFunction(func){
        this.onscrollfunction = func;
        this.scroll_element.addEventListener("scroll",this.onscrollbound);
    }
    
}

export default Scrollbar;