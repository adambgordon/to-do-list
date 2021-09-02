import folderFactory from "./folder.js";
import {updateTasks} from "./create-tasks.js";

export {createFolders, buildFolders};

function createFolders (list) {
    const folderInput = createFolderInput(list);
    const folderWrapper = document.createElement("div");
    folderWrapper.id = "folder-wrapper";
    const folders = document.createElement("div");
    folders.id = "folders";
    folderWrapper.appendChild(folders);
    folderWrapper.appendChild(folderInput);
    return folderWrapper;
}

function createFolderInput (list) {
    const input = document.createElement("input");
    input.type = "text";
    input.onkeydown = function (event) {
        if (event.key === "Enter") {
            const folder = folderFactory(input.value,Date.now());
            input.value = "";
            list.addFolder(folder);
            updateFolders(list);
        }
    }
    return input;
}

function buildFolders(list) {
    const now = Date.now();
    const all = folderFactory("All Tasks",now);
    const starred = folderFactory("Starred",now+1);
    list.addFolder(all);
    list.addFolder(starred);
    updateFolders(list);
    document.getElementById(now).classList.add("active-folder");
}

function updateFolders (list) {
    const folders = document.querySelector("#folders");
    while (folders.firstChild) {
        folders.removeChild(folders.firstChild);
    }
    list.getFolders().forEach( (element) => {
        const folder = document.createElement("div");
        createFolderListener(folder,list);
        const name = document.createElement("div");

        folder.classList.add("folder");
        folder.id = element.getDateAdded();
        name.textContent = element.getName();

        folder.appendChild(name);

        if (element.getName() !== "All Tasks" && element.getName() !== "Starred") {
            const trash = createTrashButton(list);
            folder.appendChild(trash);
        }
        folders.appendChild(folder);
    });
}

function createTrashButton (list) {
    const trash = document.createElement("div");
    trash.textContent = "x";
    trash.onclick = function (event) {
        list.deleteFolder(trash.parentElement.id);
        updateFolders(list);
    }
    return trash;
}

function createFolderListener (folder,list) {
    folder.onclick = function (event) {
        if (this.classList.contains(".active-folder")) {
            return;
        } else {
            document.querySelector(".active-folder").classList.remove("active-folder");
            this.classList.add("active-folder");
            updateTasks(list);
        }
    }
}