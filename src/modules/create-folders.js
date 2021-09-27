const list = require("./list.js");
import * as helper from "./helper-functions.js"

export {createFolders, buildFolders, updateFolders, toggleExpanded};

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

function receiveInput () {
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
    input.focus();
    input.select();
}

function receiveEdit () {
    if (event.key === "Enter") {
        if (!this.value || this.value.trim() === "") return;
        list.getFolder(this.parentElement.id).setName(this.value.trim());
        updateFolders();
    } else if (event.key === "Escape") {
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
    modal.getElementsByClassName("cancel")[0].onclick = removePrompt;
    modal.getElementsByClassName("delete")[0].onclick = trashFolder;
    this.parentElement.parentElement.insertBefore(modal,this.parentElement);
}
function removePrompt () {
    this.parentElement.remove();
}
function trashFolder () {
    list.deleteFolder(list.getFolder(helper.getActiveFolderId()));
    helper.deactivateActiveFolderElement();
    updateFolders();
}