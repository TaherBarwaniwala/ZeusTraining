import Toast from "./Toast.js";
import ProgressBar  from "./ProgressBar.js";

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

        this.progressBar = new ProgressBar();
        this.activeFileIds = [];
        document.addEventListener('DOMContentLoaded',()=>this.setProgressBar());
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
            await this.setProgressBar();
        }catch(e){
            console.error(e);
        }
    }

    async formStatus(clear,draw,obj){
        let totalprogress = 0;
        let totaltasks = obj.activeFileIds.length;
        for(var file_Id of obj.activeFileIds){
            try{
                let res = await fetch("http://127.0.0.1:5081/api/FileUpload/"+file_Id,{
                    method: "GET",
                    // body:formData,
                    mode:"cors",
                    headers:{
                       "Access-Control-Allow-Origin": "http://127.0.0.1:5081/api",
                    }
                });
                res = await res.json();
                if(res.status == "Completed" || res.status == "Failed"){
                    if(res.status=="Completed"){
                        Toast.Notification(res.fileName + " Uploaded Successfully");
                        obj.activeFileIds = obj.activeFileIds.filter(fileId => fileId !== file_Id);
                        totalprogress += 100;
                    }else{
                        Toast.Alert(res.fileName + " Upload Failed");
                        obj.activeFileIds = obj.activeFileIds.filter(fileId => fileId !== file_Id);
                        totaltasks -= 1;
                    }

                }else{
                    totalprogress += res.progress;
                }
            }catch(e){
                console.error(e);
            }
        }
        draw(totalprogress/totaltasks);
        if(totaltasks == 0) clear();

    }

    async getActive(){
        try {
            let res = await fetch("http://localhost:5081/api/FileUpload/status",{
                method: "GET",
                // body:formData,
                mode:"cors",
                headers:{
                   "Access-Control-Allow-Origin": "http://127.0.0.1:5081/api",
                }
            });
            res = await res.json();
            return res.activeFileIds;
        } catch (error) {
            console.error(error);
        }
    }

    clearStatusInterval(){
        clearInterval(this.timer);
        setTimeout(()=>{
            this.progressBar.clear();
        },1000);
    }

    async setProgressBar(){
        if(this.timer){
            this.clearStatusInterval();
            this.timer = null;
        }
        this.activeFileIds = await this.getActive();
        this.timer = setInterval(await this.formStatus,150,() => this.clearStatusInterval(),(progress)=> this.progressBar.draw(progress),this);
    }



}

export default FormSubmission;