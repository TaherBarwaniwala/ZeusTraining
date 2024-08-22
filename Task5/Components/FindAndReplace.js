class FindAndReplace{

constructor(){

}

createWindow(){
    let container = document.createElement('div');
    let header = document.createElement('div');
    let selector = document.createElement('div');
    let findOption = document.createElement('div');
    let replaceOption = document.createElement('div');
    let findWindow = document.createElement('div');
    let replaceWindow = document.createElement('div');
    replaceWindow.innerText = "replace window";
    replaceWindow.className = "subWindow";
    findWindow.innerText = "findWindow";
    findWindow.className = "subWindow";
    replaceOption.innerText = "Replace";
    findOption.innerText = "Find";
    replaceOption.className = "selectorOption";
    findOption.className = "selectorOption";
    selector.className = "selector";
    selector.appendChild(findOption);
    selector.appendChild(replaceOption);
    header.className = "dialogHeader";
    container.className = "dialogContainer";
    container.appendChild(header);
    container.appendChild(selector);
    container.appendChild(findWindow);
    container.appendChild(replaceWindow);
    document.body.appendChild(container);
}

}

export default FindAndReplace;