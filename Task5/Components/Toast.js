class Toast{
    static Notification(text = ""){
        document.body.appendChild(Toast.createtoast(text));

    }

    static Alert(text =""){
        document.body.append(Toast.createtoast(text,"Alert"))
    }

    static createtoast(text,type="Notification"){
        const toast = document.createElement('div');
        toast.id = "toast";
        toast.className = "toastContainer";
        const textContainer = document.createElement('div');
        textContainer.innerText = text;
        textContainer.className = "textContainer";
        const symbol = document.createElement('img');
        if(type === "Alert"){
            symbol.src = "./assets/Alert.svg"
        }else if(type === "Notification"){
            symbol.src = "./assets/Notification.svg"
        }
        symbol.className = "Symbol";
        const ok = document.createElement('input');
        ok.className = "okButton"
        ok.type = "button";
        ok.value = "OK";
        ok.addEventListener("pointerdown",(e)=>{
            document.body.removeChild(document.getElementById("toast"));
        })
        toast.appendChild(symbol);
        toast.appendChild(textContainer);
        toast.appendChild(ok);
        return toast;
    }
}

export default Toast;