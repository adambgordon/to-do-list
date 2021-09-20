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

function initInputWrapper (inputWrapper) {
    const plus = helper.createPlus();
    const input = createInput();
    plus.onclick = toggleInputField;
    input.onkeydown = receiveInput;
    inputWrapper.appendChild(plus);
    inputWrapper.appendChild(input);
}

function toggleInputField() {    
    toggleExpanded(this);
}

function toggleExpanded(plus) {
    const inputWrapper = plus.parentElement;
    const iconWrapper = plus.firstChild;
    const input = inputWrapper.children[1];
    const expanded = "expanded";
    if (iconWrapper.classList.contains(expanded)) {
        iconWrapper.classList.remove(expanded);
        inputWrapper.classList.remove(expanded);
        input.classList.remove(expanded);
    } else {
        iconWrapper.classList.add(expanded);
        inputWrapper.classList.add(expanded);
        setTimeout(() => {input.classList.add(expanded);}, 50);
        setTimeout(() => {input.focus();}, 400);
    }
    
}
function receiveInput() {
    if (event.key === "Enter") {
        if (!this.value || this.value.trim() === "") return;
        const folder = helper.folderFactory(this.value.trim(), Date.now().toString());
        this.value = "";
        list.addFolder(folder);
        updateFolders();
        helper.deactivateActiveFolderElement();
        helper.activateElementByID(folder.getID());
        helper.deactivateActiveTaskElement();
        helper.updateTasks();
        toggleExpanded(this.previousSibling);
    }
}


function updateFolders () {
    const activeFolderID = helper.getActiveFolderId();
    const folders = document.getElementById("folders");
    helper.removeAllChildren(folders);
    addFoldersFromList(folders);
    activeFolderID ? helper.activateElementByID(activeFolderID) : folders.firstChild.classList.add("active");
    helper.updateTasks();
}

function addFoldersFromList (folders) {
    list.getFolders().forEach( (folder) => {
        const folderElement = helper.newDiv("id",folder.getID(),"class","folder");
        const fontAwesomeString = folder.getName() === "All Tasks" ? "fas fa-check-double"
            : folder.getName() === "Starred" ? "fas fa-star"
            : "fas fa-folder";
        folderElement.appendChild(helper.createLeftHandIconContainer(fontAwesomeString));

        const name = createName(folder);
        name.ondblclick = editFolderName;
        folderElement.appendChild(name);

        addTrash(folderElement,folder);
        folders.appendChild(folderElement);
    });
}

function editFolderName () {
    const taskElement = this.parentElement;
    if (!taskElement.classList.contains("active")) return;
    if (this.textContent === "All Tasks" || this.textContent === "Starred") return;
    const folder = list.getFolder(taskElement.id);
    while (!taskElement.lastChild.classList.contains("left-hand-icon-wrapper")) {
        taskElement.lastChild.remove();
    }
    const input = document.createElement("input");
    taskElement.appendChild(input);
    input.id = "folder-edit-field"; // get rid of this
    input.type = "text";
    input.value = folder.getName();
    input.onkeydown = receiveFolderEdit;
    input.focus();
    input.select();
}

function receiveFolderEdit () {
    if (event.key === "Enter") {
        if (!this.value || this.value.trim() === "") return;
        list.getFolder(this.parentElement.id).setName(this.value.trim());
        this.remove();
        updateFolders();
    } else if (event.key === "Escape") {
        this.remove();
        updateFolders();
    }
}

function addTrash (folderElement,folder) {
    if (folder.getName() !== "All Tasks" && folder.getName() !== "Starred") {
        const trash = helper.createTrashButton();
        trash.onclick = trashFolder;
        folderElement.appendChild(trash);
    }
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