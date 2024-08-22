class ProgressBar {

    constructor(){
        this.footer = document.getElementById("footer-canvas");
        this.footerctx = this.footer.getContext("2d");
    }

    /**
 * 
 * @param {Number} progress 
 */
    draw(progress,statusmsg = "Uploading Files",){
        this.footerctx.save();
        this.footerctx.font = "12px Arial";
        this.footerctx.clearRect(5,5,600,30);
        let width = this.footerctx.measureText(statusmsg).width;
        this.footerctx.fillStyle = "black";
        this.footerctx.fillText(statusmsg,5,15,width<200?width:200);
        this.footerctx.fillStyle = "green";
        this.footerctx.strokeStyle = "#e0e0e0";
        this.footerctx.strokeRect(10+(width<200?width:200),6,300,10);
        this.footerctx.fillRect(10+(width<200?width:200),6,3*progress,10);
        this.footerctx.restore();
    }

    clear(){
        this.footerctx.save();
        this.footerctx.clearRect(4,4,600,12);
        this.footerctx.restore();
    }

}

export default ProgressBar;