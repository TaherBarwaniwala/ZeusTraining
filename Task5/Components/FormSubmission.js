class FormSubmission{
/**
 * 
 * @param {HTMLFormElement} form 
 */
    constructor(form){
        this.form = form;
        this.file_Id = null;
        this.form.addEventListener("submit",(e) => {
            e.preventDefault();
            this.formSubmit(this.form)
    });
        this.footer = document.getElementById("footer-canvas");
        this.footerctx = this.footer.getContext("2d");
    }

    async formSubmit(form){
        let formData = new FormData(form);
        try{
            let res = await fetch("http://127.0.0.1:5081/api/FileUpload",{
                method: "POST",
                body:formData,
                mode:"cors",
                headers:{
                   "Access-Control-Allow-Origin": "http://127.0.0.1:5081/api",
                }
            });
            res = await res.json();
            this.file_Id = res.id;
            this.timer = setInterval(await this.formStatus,150,this.file_Id,() => this.clearStatusInterval(),(progress)=> this.draw_progress(progress));
        }catch(e){
            console.error(e);
        }
    }

    async formStatus(file_Id,clear,draw){
        try{
            let res =await fetch("http://127.0.0.1:5081/api/FileUpload/"+file_Id,{
                method: "GET",
                // body:formData,
                mode:"cors",
                headers:{
                   "Access-Control-Allow-Origin": "http://127.0.0.1:5081/api",
                }
            });
            res = await res.json();
            if(res.status == "Completed" || res.status == "Failed"){
                clear();
                draw(100)
            }else{
                draw(res.progress);
            }
            console.log(res);
        }catch(e){
            console.error(e);
            clear();
        }
    }

    clearStatusInterval(){
        clearInterval(this.timer);
        setTimeout(()=>{
            this.footerctx.save();
            this.footerctx.clearRect(4,4,302,12);
            this.footerctx.restore();
        },1000);
    }

        /**
     * 
     * @param {Number} progress 
     */
        draw_progress(progress){
            this.footerctx.save();
            this.footerctx.fillStyle = "green";
            this.footerctx.strokeStyle = "#e0e0e0";
            this.footerctx.clearRect(5,5,300,10);
            this.footerctx.strokeRect(5,5,300,10);
            this.footerctx.fillRect(5,5,3*progress,10);
            this.footerctx.restore();
        }

}

export default FormSubmission;