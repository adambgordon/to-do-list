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
    document.querySelector(".active-folder").classList.remove("active-folder");
    document.getElementById(now).classList.add("active-folder");
}

function updateFolders (list) {
    const folders = document.querySelector("#folders");
    while (folders.firstChild) {
        folders.removeChild(folders.firstChild);
    }
    list.getFolders().forEach( (element) => {
        const folder = document.createElement("div");
        folder.classList.add("folder");
        folder.id = element.getDateAdded();

        folder.appendChild(createName(list, element.getName()));
        if (element.getName() !== "All Tasks" && element.getName() !== "Starred") {
            folder.appendChild(createTrashButton(list));
        }
        folders.appendChild(folder);
    });
    folders.lastChild.classList.add("active-folder");
    updateTasks(list);
}

function createName (list, nameText) {
    const name = document.createElement("div");
    name.classList.add("name");
    name.textContent = nameText;
    name.onclick = function (event) {
        if (this.parentElement.classList.contains(".active-folder")) return;
        document.querySelector(".active-folder").classList.remove("active-folder");
        this.parentElement.classList.add("active-folder");
        updateTasks(list);
    }
    return name;
}

function createTrashButton (list) {
    const trash = document.createElement("div");
    trash.classList.add("trash");
    trash.addEventListener("click", function (event) {
        list.deleteFolder(trash.parentElement.id);
        updateFolders(list);
    });
    const icon = document.createElement("i");
    icon.classList.add("far");
    icon.classList.add("fa-trash-alt");
    trash.appendChild(icon);
    return trash;
}

