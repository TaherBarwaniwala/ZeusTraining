class Toast{
    static Notification(text = ""){
        document.body.appendChild(Toast.createtoast(text));

    }

    static Alert(text =""){
        document.body.append(Toast.createtoast(text,"Alert"))
    }

    static createtoast(text,type="Notification"){
        const toast = document.createElement('div');
        toast.id = "toast-"+Math.random();
        toast.className = "toastContainer";
        toast.style.zIndex = Toast.z_index;
        Toast.z_index += 1;
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
            e.stopPropagation();
            document.body.removeChild(document.getElementById(toast.id));
        })
        toast.appendChild(symbol);
        toast.appendChild(textContainer);
        toast.appendChild(ok);
        toast.style.opacity = 0;
        document.body.appendChild(toast);
        let h = toast.clientHeight;
        let w = toast.clientWidth;
        document.body.removeChild(toast);
        toast.style.opacity = 1;
        toast.style.top = "calc(50% - "+h/2+"px)";
        toast.style.left = "calc(50% - "+w/2+"px)";
        return toast;
    }

    static z_index = 3;
}

export default Toast;