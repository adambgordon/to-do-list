const list = require("./list.js");
import * as helper from "./helper-functions.js"

export {createFolders, buildFolders, updateFolders, collapseInputField};

function createFolders () {
    const folderWrapper = helper.newDiv("id","folder-wrapper");
    const folders = helper.newDiv("id","folders");
    folderWrapper.appendChild(folders);
    folderWrapper.appendChild(createInputWrapper());
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
function createInputWrapper () {
    const inputWrapper = helper.newDiv("class","input-wrapper");
    const plus = helper.createPlus();
    const input = createInput();
    plus.onclick = receiveClick;
    input.onkeydown = receiveInput;
    inputWrapper.appendChild(plus);
    inputWrapper.appendChild(input);
    return inputWrapper;
}
function receiveClick (event) {
    const inputWrapper = this.parentElement;
    const input = this.nextSibling;
    if (inputWrapper.classList.contains("expanded")) {
        if (input.value.trim() === "") {
            input.focus();
        } else {
            input.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter"}));
        }
    } else {
        expandInputField(inputWrapper);
    }
}
function expandInputField (inputWrapper) {
    const iconWrapper = inputWrapper.firstChild.firstChild;
    const input = inputWrapper.lastChild;
    const expanded = "expanded";
    input.value = "";
    input.addEventListener("blur", receiveInput);
    iconWrapper.classList.add(expanded);
    inputWrapper.classList.add(expanded);
    setTimeout(() => {input.classList.add(expanded);}, 50);
    setTimeout(() => {input.focus();}, 400);
}
function collapseInputField (inputWrapper) {
    const iconWrapper = inputWrapper.firstChild.firstChild;
    const input = inputWrapper.lastChild;
    const expanded = "expanded";
    iconWrapper.classList.remove(expanded);
    input.classList.remove(expanded);
    inputWrapper.classList.remove(expanded);
}

function receiveInput (event) {
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
        collapseInputField(this.parentElement);
    } else if (event.key === "Escape") {
        collapseInputField(this.parentElement);
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
        name.ondblclick = editName;
        folderElement.appendChild(name);

        addTrash(folderElement,folder);
        folders.appendChild(folderElement);
    });
}

function editName () {
    const folderElement = this.parentElement;
    if (!folderElement.classList.contains("active")) return;
    if (this.textContent === "All Tasks" || this.textContent === "Starred") return;
    const folder = list.getFolder(folderElement.id);
    while (!folderElement.lastChild.classList.contains("left-hand-icon-container")) {
        folderElement.lastChild.remove();
    }
    const input = document.createElement("input");
    folderElement.appendChild(input);
    input.type = "text";
    input.value = folder.getName();
    input.onkeydown = receiveEdit;
    input.addEventListener("blur",receiveEdit);
    input.focus();
    input.select();
}
function receiveEdit (event) {
    if (event.key === "Enter" || event.type === "blur") {
        if (!this.value || this.value.trim() === "") return;
        list.getFolder(this.parentElement.id).setName(this.value.trim());
        setTimeout(() => {updateFolders();}, 0);
    } else if (event.key === "Escape") {
        this.removeEventListener("blur",receiveEdit);
        updateFolders();
    } 
}
function addTrash (folderElement,folder) {
    if (folder.getName() !== "All Tasks" && folder.getName() !== "Starred") {
        const trash = helper.createTrashButton();
        trash.onclick = prompt;
        folderElement.appendChild(trash);
    }
}
function createName (folder) {
    const name = helper.newDiv("class","name");
    name.textContent = folder.getName();
    return name;
}
function prompt () {
    const modal = helper.createTrashModal();
    modal.lastChild.onclick = trashFolder;
    this.parentElement.parentElement.insertBefore(modal,this.parentElement);
    setTimeout(() => {modal.classList.add("fade-in");}, 0);
}
function trashFolder () {
    list.deleteFolder(list.getFolder(helper.getActiveFolderId()));
    helper.deactivateActiveTaskElement();
    helper.deactivateActiveFolderElement();
    updateFolders();
}