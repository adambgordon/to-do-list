const list = require("./list.js");
import * as helper from "./helper-functions.js"

export {createFolders, buildFolders, updateFolders};

function createFolders () {
    const folderWrapper = helper.newDiv("id","folder-wrapper");
    const folderInput = helper.createInput("text","fas fa-plus");
    const folders = helper.newDiv("id","folders");

    initInput(folderInput);

    folderWrapper.appendChild(folders);
    folderWrapper.appendChild(folderInput);


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

function initInput (inputContainer) {
    const input = inputContainer.getElementsByTagName("input")[0];
    input.placeholder = "Add Folder";
    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            if (!input.value || input.value.trim() === "") return;
            const folder = helper.folderFactory(input.value.trim(), Date.now().toString());
            input.value = "";
            list.addFolder(folder);
            updateFolders(folder.getID());
        }
    });
}

function updateFolders (activeFolderID,activeTaskID) {
    const folders = document.querySelector("#folders");
    helper.removeAllChildren(folders);
    addFoldersFromList(folders);
    // (newFolder ? folders.lastChild : folders.firstChild).classList.add("active");
    (activeFolderID ? document.querySelector(`[id="${activeFolderID}"]`) : folders.firstChild).classList.add("active");
    helper.updateTasks(activeTaskID);
}

function addFoldersFromList (folders) {
    list.getFolders().forEach( (folder) => {
        const folderElement = helper.newDiv("class","folder");
        folderElement.id = folder.getID();
        
        const fontAwesomeString = folder.getName() === "All Tasks" ? "fas fa-check-double"
            : folder.getName() === "Starred" ? "fas fa-star"
            : "fas fa-folder";
        folderElement.appendChild(createFolderIcon(fontAwesomeString));

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
    name.addEventListener("click", function (event) {
        const parent = this.parentElement;
        if (parent.classList.contains("active")) {
            return;
        }
        const currentActive = document.querySelector(".active.folder");
        if (currentActive) {
            currentActive.classList.remove("active");
        }
        parent.classList.add("active");
        helper.updateTasks();
    });
    name.addEventListener("dblclick", function (event) {
        const parent = this.parentElement;
        if (parent.classList.contains("active")) {
            if (folder.getName() === "All Tasks" || folder.getName() === "Starred") return;
            // add listeners for esc and click anywhere
            this.remove();
            parent.lastChild.remove();
            const input = document.createElement("input");
            parent.appendChild(input);
            input.id = "folder-edit-field"
            input.type = "text";
            input.value = folder.getName();
            input.addEventListener("keydown", function (event) {
                if (event.key === "Enter") {
                    if (!input.value || input.value.trim() === "") return;
                    list.getFolder(folder.getID()).setName(input.value.trim());
                    input.remove();
                    updateFolders(folder.getID(),helper.getActiveTaskID());
                } else if (event.key === "Escape") {
                    input.remove();
                    updateFolders(folder.getID(),helper.getActiveTaskID());
                }
            });
            input.focus();
            return;
        }
    });

    return name;
}

function trashFolder() {
    list.deleteFolder(list.getFolder(this.parentElement.id));
    updateFolders();
}

function createFolderIcon (fontAwesomeString) {
    const folderIcon = helper.newDiv("class","folder-icon");
    folderIcon.appendChild(helper.newIcon(fontAwesomeString));
    return folderIcon;
}