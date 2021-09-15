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
    const plus = inputContainer.firstChild;
    const input = inputContainer.getElementsByTagName("input")[0];
    input.placeholder = "Add Folder";
    console.log(input.style.display === "");

    let maxWidth = "2.25rem";
    let backgroundColor = "none";
    let display = "none"
    let timeout = 0;
    plus.addEventListener("click", function (event) {
        if (plus.firstChild.classList.contains("rotated-180")) {
            plus.firstChild.classList.remove("rotated-180");
            maxWidth = "2.25rem";
            backgroundColor = "none";
            display = "none";
            timeout = 50;
        } else {
            plus.firstChild.classList.add("rotated-180");
            maxWidth = "12rem";
            backgroundColor = "rgba(0,0,0,20%)";
            display = "flex";
            timeout = 300;
        }
        inputContainer.style.setProperty("--folder-input-wrapper-max-width",maxWidth);
        inputContainer.style.setProperty("--folder-input-wrapper-background-color",backgroundColor);
        
        setTimeout(function() {
            inputContainer.style.setProperty("--folder-input-display",display);
        }, timeout);
    });

    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            if (!input.value || input.value.trim() === "") return;
            const folder = helper.folderFactory(input.value.trim(), Date.now().toString());
            input.value = "";
            list.addFolder(folder);
            updateFolders();
            helper.deactivateActiveFolderElement();
            helper.activateElementByID(folder.getID());
        }
    });
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
    return name;
}

function trashFolder() {
    list.deleteFolder(list.getFolder(this.parentElement.id));
    helper.deactivateActiveFolderElement();
    updateFolders();
}

function createFolderIcon (fontAwesomeString) {
    const folderIcon = helper.newDiv("class","folder-icon");
    folderIcon.appendChild(helper.newIcon(fontAwesomeString));
    return folderIcon;
}