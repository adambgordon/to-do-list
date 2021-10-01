/*
create-folders.js creates all folder related DOM elements as wells as all functions
required to manipulate and access folder items both in the DOM and in the list module
*/

const list = require("./list.js");
import * as helper from "./helper-functions.js"

export {createFolders, buildFolders, updateFolders, collapseInputField};

// creates the main structure for folder elements
function createFolders () {
    const folderWrapper = helper.newDiv("id","folder-wrapper");
    const folders = helper.newDiv("id","folders");
    folderWrapper.appendChild(folders);
    folderWrapper.appendChild(createInputWrapper());
    return folderWrapper;
}

// creates the default starting folders: "All Tasks" & "Starred"
function buildFolders() {
    const now = Date.now();
    const allTasks = helper.folderFactory("All Tasks",now.toString());
    const starredTasks = helper.folderFactory("Starred",(now+1).toString());
    list.addFolder(allTasks);
    list.addFolder(starredTasks);
    updateFolders();
}

// returns a text input for new folders
function createInput() {
    const input = document.createElement("input");
    input.type = "text"; 
    input.placeholder = "Add Folder";
    return input;
}

// returns and initializes the entire folder input structure
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
// receives a click event on the "plus"
function receiveClick (event) {
    const inputWrapper = this.parentElement;
    const input = this.nextSibling;
    // if the input structure is already expanded, focus on input or submit a new folder
    if (inputWrapper.classList.contains("expanded")) {
        if (input.value.trim() === "") {
            input.focus();
        } else {
            input.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter"}));
        }
    } else {
        // otherwise expand the input structure
        expandInputField(inputWrapper);
    }
}
// expands input structure by adding "expanded" class to relevant elements
function expandInputField (inputWrapper) {
    const iconWrapper = inputWrapper.firstChild.firstChild;
    const input = inputWrapper.lastChild;
    const expanded = "expanded";
    input.value = "";
    iconWrapper.classList.add(expanded);
    inputWrapper.classList.add(expanded);
    setTimeout(() => {input.classList.add(expanded);}, 50);
    setTimeout(() => {input.focus();}, 400);
}
// collapses input structure by removing "expanded" class to relevant elements
function collapseInputField (inputWrapper) {
    const iconWrapper = inputWrapper.firstChild.firstChild;
    const input = inputWrapper.lastChild;
    const expanded = "expanded";
    iconWrapper.classList.remove(expanded);
    input.classList.remove(expanded);
    inputWrapper.classList.remove(expanded);
}
// keyboard event handler for folder-add input
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
// updates folders in the DOM by removing the curent folder elements
// and adding the updated list of folders from the list module
function updateFolders () {
    const activeFolderID = helper.getActiveFolderId();
    const folders = document.getElementById("folders");
    helper.removeAllChildren(folders);
    addFoldersFromList(folders);
    activeFolderID ? helper.activateElementByID(activeFolderID) : folders.firstChild.classList.add("active");
    helper.updateTasks();
}
// creates and appends folder elements from list module and assigns appropriate icon
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
// double click event handler for non-default folders
function editName (event) {
    const folderElement = this.parentElement;
    if (!folderElement.classList.contains("active")) return;
    if (this.textContent === "All Tasks" || this.textContent === "Starred") return;
    const folder = list.getFolder(folderElement.id);
    // replaces name element with a new input element
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
// event handler for actively editing folders
function receiveEdit (event) {
    // if enter or click away, save the folder name
    if (event.key === "Enter" || event.type === "blur") {
        if (!this.value || this.value.trim() === "") return;
        list.getFolder(this.parentElement.id).setName(this.value.trim());
        setTimeout(() => {updateFolders();}, 0); // timeout allows elements to be updated in correct order
    // if escape, discard folder name
    } else if (event.key === "Escape") {
        this.removeEventListener("blur",receiveEdit);
        updateFolders();
    } 
}
// creates and appends trash element for non-default folders
function addTrash (folderElement,folder) {
    if (folder.getName() !== "All Tasks" && folder.getName() !== "Starred") {
        const trash = helper.createTrashButton();
        trash.onclick = prompt;
        folderElement.appendChild(trash);
    }
}
// returns name element
function createName (folder) {
    const name = helper.newDiv("class","name");
    name.textContent = folder.getName();
    return name;
}
// event handler to prompt user for folder delete confirmation
function prompt (event) {
    const modal = helper.createTrashModal();
    modal.lastChild.onclick = trashFolder;
    this.parentElement.parentElement.insertBefore(modal,this.parentElement);
    setTimeout(() => {modal.classList.add("fade-in");}, 0);
}
// event handler to actually delete the folder, remvoing it from the list module and the DOM
function trashFolder (event) {
    list.deleteFolder(list.getFolder(helper.getActiveFolderId()));
    helper.deactivateActiveTaskElement();
    helper.deactivateActiveFolderElement();
    updateFolders();
}