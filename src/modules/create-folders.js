const list = require("./list.js");
import * as helper from "./helper-functions.js"

export {createFolders, buildFolders};

function createFolders () {
    const folderInput = helper.createInput("text");
    const folderWrapper = helper.newDiv("id","folder-wrapper");
    const folders = helper.newDiv("id","folders");
    folderWrapper.appendChild(folders);
    folderWrapper.appendChild(folderInput);
    initInput(folderInput.firstChild);
    return folderWrapper;
}

function buildFolders() {
    const now = Date.now();
    const all = helper.folderFactory("All Tasks",now.toString());
    const starred = helper.folderFactory("Starred",(now+1).toString());
    list.addFolder(all);
    list.addFolder(starred);
    updateFolders();
}

function initInput (input) {
    input.placeholder = "Add Folder";
    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            if (!input.value || input.value.trim() === "") return;
            const folder = helper.folderFactory(input.value.trim(), Date.now().toString());
            input.value = "";
            list.addFolder(folder);
            updateFolders("new folder");
        }
    });
}

function updateFolders (newFolder) {
    const folders = document.querySelector("#folders");
    helper.removeAllChildren(folders);
    addFoldersFromList(folders);
    (newFolder ? folders.lastChild : folders.firstChild).classList.add("active");
    helper.updateTasks();
}

function addFoldersFromList (folders) {
    list.getFolders().forEach( (folder) => {
        const folderElement = helper.newDiv("class","folder");
        folderElement.id = folder.getID();
        
        const fontAwesomeString = folder.getName() === "All Tasks" ? "fas fa-check-double"
            : folder.getName() === "Starred" ? "fas fa-star"
            : "far fa-folder";
        folderElement.appendChild(createFolderIcon(fontAwesomeString));

        folderElement.appendChild(helper.createName(folder));
        if (folder.getName() !== "All Tasks" && folder.getName() !== "Starred") {
            const trash = helper.createTrashButton();
            trash.onclick = trashFolder;
            folderElement.appendChild(trash);
        }
        folders.appendChild(folderElement);
    });
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