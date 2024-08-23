class FindAndReplace{

constructor(){
    this.onDragBound = (e) => this.Ondrag(e);
    this.onDragEndBound = ()=>this.OndragEnd();
}

createWindow(){
    let container = document.createElement('div');
    let header = document.createElement('div');
    let selector = document.createElement('div');

    this.AddDragingSupport(header);

    let findWindow = this.createContainer(this.createFindSubWindow());
    let findOption = this.createOption("Find");
    let replaceOption = this.createOption("replace");
    let replaceWindow = this.createContainer(this.craeteReplaceSubWindow());
    this.createSubWindowListner(findOption,replaceOption,findWindow,replaceWindow);
    this.createSubWindowListner(replaceOption,findOption,replaceWindow,findWindow);

    let cancelationButton = this.createCancel();

    selector.className = "selector";
    header.className = "dialogHeader";
    header.innerText = "Find & Replace";
    container.className = "dialogContainer";

    findOption.classList.add(["active"]);
    findWindow.classList.add(['active']);

    selector.appendChild(findOption);
    selector.appendChild(replaceOption);
    container.appendChild(cancelationButton);
    container.appendChild(header);
    container.appendChild(selector);
    container.appendChild(findWindow);
    container.appendChild(replaceWindow);

    document.body.appendChild(container);
}
/**
 * 
 * @param {HTMLElement | null} elem 
 * @returns 
 */
createContainer(elem){
    let findWindow = document.createElement('div');
    if(elem) findWindow.appendChild(elem);
    findWindow.className = "subWindow";
    return findWindow;
}
 /**
  * 
  * @param {string } elem 
  * @returns 
  */
createOption(elem){
    let findOption = document.createElement('div');
    findOption.innerHTML = elem;
    findOption.className = "selectorOption";
    return findOption;
}

createCancel(){
    let cancelationButton = document.createElement('div');
    cancelationButton.innerText = "X";
    cancelationButton.className = "cancellationButton";
    cancelationButton.addEventListener("pointerdown",()=>document.body.removeChild(cancelationButton.parentElement));
    return cancelationButton;
}

/**
 * 
 * @param {HTMLElement} activeoption 
 * @param {*HTMLElement} passiveoption 
 * @param {*HTMLElement} activewindow 
 * @param {*HTMLElement} passivewindow 
 */
createSubWindowListner(activeoption,passiveoption,activewindow,passivewindow){
    activeoption.addEventListener("pointerdown",()=>{
        activeoption.classList.add(["active"]);
        passiveoption.classList.remove(["active"]);
        activewindow.classList.add(['active']);
        passivewindow.classList.remove(['active']);
    });
}

createFindSubWindow(){
    let subwindow = document.createElement("div");
    subwindow.className = "findSubWindow";
    let textInput = this.createTextInput('Find');
    subwindow.appendChild(textInput);
    let findButton = this.createButton("Find","find");
    let findAllButton = this.createButton("FindAll","");
    let buttonConatiner = this.createButtonsContainer([findButton,findAllButton]);
    subwindow.appendChild(buttonConatiner);
    return subwindow;
}

craeteReplaceSubWindow(){
    let subwindow = document.createElement("div");
    subwindow.className = "replaceSubWindow";
    let findInput = this.createTextInput('Find');
    let replaceInput = this.createTextInput('Replace');
    subwindow.appendChild(findInput);
    subwindow.appendChild(replaceInput);
    let findButton = this.createButton("Find","find");
    let findAllButton = this.createButton("FindAll","");
    let replaceButton = this.createButton("Replace","");
    let replaceAllButton = this.createButton("ReplaceAll");
    let buttonConatiner = this.createButtonsContainer([findButton,findAllButton,replaceButton,replaceAllButton]);
    subwindow.appendChild(buttonConatiner);
    return subwindow;
}

/**
 * 
 * @param {string} labelText 
 */
createTextInput(labelText){
    let textInput = document.createElement('div');
    textInput.className = "textInputContainer";
    let label = document.createElement('div');
    label.className = "label";
    label.innerText = labelText;
    let inputBox = document.createElement('input');
    inputBox.type = "text";
    inputBox.className = "inputBox";
    textInput.appendChild(label);
    textInput.appendChild(inputBox);
    return textInput;
}

/**
 * 
 * @param {string} text 
 * @param {string} className 
 * @returns 
 */

createButton(text,className){
    let button = document.createElement('button');
    button.className = className;
    button.innerText = text;
    return button;
}
/**
 * 
 * @param {Array<HTMLButtonElement>} buttons 
 */
createButtonsContainer(buttons){
    let btnContainer = document.createElement('div');
    for(let btn of buttons) btnContainer.appendChild(btn);
    btnContainer.className = "buttonContainer";
    return btnContainer;
}

/**
 * 
 * @param {HTMLElement} elem 
 */

AddDragingSupport(elem){
    elem.addEventListener("pointerdown",(e)=>{
        this.X = e.target.parentElement.getBoundingClientRect().x;
        this.Y = e.target.parentElement.getBoundingClientRect().y;
        this.pointerX = e.clientX;
        this.pointerY = e.clientY;
        this.elem = e.target.parentElement;
        window.addEventListener("pointermove",this.onDragBound);
        window.addEventListener("pointerup",this.onDragEndBound);
        window.addEventListener("pointercancel",this.onDragEndBound);
    });
}

/**
 * 
 * @param {PointerEvent} e 
 */

Ondrag(e){
    let offsetX = e.clientX - this.pointerX;
    let offsetY = e.clientY - this.pointerY;
    this.elem.style.left = this.X + offsetX + "px";
    this.elem.style.top = this.Y + offsetY + "px"; 
    this.elem.style.cursor = "garbbing";
}

/**
 * 
 * @param {PointerEvent} e 
 */

OndragEnd(){
    window.removeEventListener("pointermove",this.onDragBound);
    window.removeEventListener("pointerup",this.onDragEndBound);
    window.removeEventListener("pointercancel",this.onDragEndBound);
    this.elem.style.cursor = "default";
}

}

export default FindAndReplace;