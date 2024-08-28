
class Scrollbar{
/**
 * 
 * @param {HTMLElement} scroll_element 
 * @param {HTMLElement} offset_element 
 */
    constructor(scroll_element = document.getElementById("main-canvas-container"),offset_element = document.getElementById("scroll-offset")){
        this.onscrollfunction = null;
        this.scroll_element = scroll_element;
        this.offset_element = offset_element;
        this.scrollLeft = 0;
        this.scrollTop = 0;
        this.onscrollbound = () => this.onscroll();
    }

    onscroll(){
        
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
        // window.setTimeout(this.onscrollfunction,100);
        this.onscrollfunction();
    }

    getScrollLeft(){
        return this.scroll_element.scrollLeft;
    }

    getScrollTop(){
        return this.scroll_element.scrollTop;
    }

    /**
     * 
     * @param {Function} func 
     */
    setOnScrollFunction(func){
        this.onscrollfunction = func;
        this.scroll_element.addEventListener("scroll",this.onscrollbound);
    }
/**
 * 
 * @param {Number} X 
 */
    scrollToXY(X,Y){
        if((X >= this.scroll_element.scrollLeft && X <=this.scroll_element.scrollLeft + window.innerWidth - 40) && (Y >= this.scroll_element.scrollTop && Y <= this.scroll_element.scrollTop + window.innerHeight - 40))
            return;
        if(X > this.offset_element.scrollWidth){
            this.offset_element.setAttribute('style',`width:${X + 1000}px ; height:${this.offset_element.scrollHeight}px`);
        }
        if(Y > this.offset_element.scrollHeight){
            this.offset_element.setAttribute('style',`width:${this.offset_element.scrollWidth}px ; height:${Y + 1000}px`);
        }
        this.scroll_element.scrollLeft = X;
        this.scroll_element.scrollTop = Y;
    }


}

export default Scrollbar;