class FormSubmission{
/**
 * 
 * @param {HTMLFormElement} form 
 */
    constructor(form){
        this.form = form;
        this.form.addEventListener("submit",(e) => {
            e.preventDefault();
            this.formSubmit(this.form)
    });
    }

    async formSubmit(form){
        let formData = new FormData(form);
        try{
            const res = await fetch("http://127.0.0.1:5081/api/FileUpload",{
                method: "POST",
                body:formData,
                mode:"cors",
                headers:{
                   "Access-Control-Allow-Origin": "http://127.0.0.1:5081/api",
                }
            });
            console.log(res);
        }catch(e){
            console.error(e);
        }
    }
}

export default FormSubmission;