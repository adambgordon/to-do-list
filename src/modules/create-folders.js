const list = require("./list.js");
import * as helper from "./helper-functions.js"

export {createFolders, buildFolders, updateFolders};

function createFolders () {
    const folderWrapper = helper.newDiv("id","folder-wrapper");
    const folders = helper.newDiv("id","folders");
    const folderInputWrapper = helper.newDiv("class","input-wrapper");
    initInputWrapper(folderInputWrapper);
    folderWrapper.appendChild(folders);
    folderWrapper.appendChild(folderInputWrapper);
    return folderWrapper;
}

function buildFolders() {
    const now = Date.now();
    const allTasks = helper.folderFactory("All Tasks",now.toString());
    const starredTasks = helper.folderFactory("Starred",(now+1).toString());
    list.addFolder(allTasks);
    list.addFolder(starredTasks);
    updateFolders();
}

function createInput() {
    const input = document.createElement("input");
    input.type = "text"; 
    input.placeholder = "Add Folder";
    return input;
}

function createPlus() {
    const plus = helper.createLeftHandIconWrapper("fas fa-plus");
    plus.classList.add("plus");
    return plus;
}

function initInputWrapper (inputWrapper) {
    const plus = createPlus();
    const input = createInput();
    plus.onclick = toggleInputField;
    input.onkeydown = receiveInput;
    inputWrapper.appendChild(plus);
    inputWrapper.appendChild(input);
}

function toggleInputField() {
    const inputWrapper = this.parentElement;
    const iconWrapper = this.firstChild;
    const input = inputWrapper.children[1];
    const expanded = "expanded";
    
    if (inputWrapper.classList.contains(expanded)) {
        iconWrapper.classList.remove(expanded);
        inputWrapper.classList.remove(expanded);
        input.classList.remove(expanded);
    } else {
        iconWrapper.classList.add(expanded);
        inputWrapper.classList.add(expanded);
        setTimeout(() => {
            input.classList.add(expanded);
        }, 50);
        input.focus();
    }
}


function receiveInput () {
    if (event.key === "Enter") {
        if (!this.value || this.value.trim() === "") return;
        const folder = helper.folderFactory(this.value.trim(), Date.now().toString());
        this.value = "";
        list.addFolder(folder);
        updateFolders();
        helper.deactivateActiveFolderElement();
        helper.activateElementByID(folder.getID());
    }
}


function updateFolders () {
    const activeFolderID = helper.getActiveFolderElement() ? helper.getActiveFolderElement().id : null;
    const folders = document.querySelector("#folders");
    helper.removeAllChildren(folders);
    addFoldersFromList(folders);
    activeFolderID ? helper.activateElementByID(activeFolderID) : folders.firstChild.classList.add("active");
    helper.updateTasks();
}

function addFoldersFromList (folders) {
    list.getFolders().forEach( (folder) => {
        const folderElement = helper.newDiv("class","folder");
        folderElement.id = folder.getID();
        
        const fontAwesomeString = folder.getName() === "All Tasks" ? "fas fa-check-double"
            : folder.getName() === "Starred" ? "fas fa-star"
            : "fas fa-folder";
        folderElement.appendChild(helper.createLeftHandIconWrapper(fontAwesomeString));

        

        folderElement.appendChild(createName(folder));
        if (folder.getName() !== "All Tasks" && folder.getName() !== "Starred") {
            const trash = helper.createTrashButton();
            trash.onclick = trashFolder;
            folderElement.appendChild(trash);
        }
        folders.appendChild(folderElement);
    });
}

function createName (folder) {
    const name = helper.newDiv("class","name");
    name.textContent = folder.getName();
    return name;
}

function trashFolder() {
    list.deleteFolder(list.getFolder(this.parentElement.id));
    helper.deactivateActiveFolderElement();
    updateFolders();
}