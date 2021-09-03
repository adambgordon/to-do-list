const list = require("./list.js");
import folderFactory from "./folder.js";
import {newDiv, newIcon} from "./helper-functions.js"
import {updateTasks} from "./create-tasks.js";

export {createFolders, buildFolders};

function createFolders () {
    const folderInput = createFolderInput();
    const folderWrapper = newDiv("id","folder-wrapper");
    const folders = newDiv("id","folders");
    folderWrapper.appendChild(folders);
    folderWrapper.appendChild(folderInput);
    return folderWrapper;
}

function createFolderInput () {
    const input = document.createElement("input");
    input.type = "text";
    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            const folder = folderFactory(input.value, Date.now().toString());
            input.value = "";
            list.addFolder(folder);
            updateFolders();
        }
    });
    const inputWrapper = newDiv("class","input-wrapper");
    inputWrapper.appendChild(input);
    return inputWrapper;
}

function buildFolders() {
    const now = Date.now();
    const all = folderFactory("All Tasks",now.toString());
    const starred = folderFactory("Starred",(now+1).toString());
    list.addFolder(all);
    list.addFolder(starred);
    updateFolders();
    document.querySelector(".active-folder").classList.remove("active-folder");
    document.getElementById(now).classList.add("active-folder");
}

function updateFolders () {
    const folders = document.querySelector("#folders");
    while (folders.firstChild) {
        folders.removeChild(folders.firstChild);
    }
    list.getFolders().forEach( (element) => {
        const folder = newDiv("class","folder");
        folder.id = element.getID();
        folder.appendChild(createName(element.getName()));
        if (element.getName() !== "All Tasks" && element.getName() !== "Starred") {
            folder.appendChild(createTrashButton());
        }
        folders.appendChild(folder);
    });
    folders.lastChild.classList.add("active-folder");
    updateTasks();
}

function createName (nameText) {
    const name = newDiv("class","name");
    name.textContent = nameText;
    name.addEventListener("click", function (event) {
        if (this.parentElement.classList.contains(".active-folder")) return;
        document.querySelector(".active-folder").classList.remove("active-folder");
        this.parentElement.classList.add("active-folder");
        updateTasks();
    });
    return name;
}

function createTrashButton () {
    const trash = newDiv("class","trash");
    trash.appendChild(newIcon("far fa-trash-alt"));
    trash.addEventListener("click", function (event) {
        list.deleteFolder(list.getFolder(trash.parentElement.id));
        updateFolders();
    });
    return trash;
}

