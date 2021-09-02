import listFactory from "./list.js";
import folderFactory from "./folder.js";

export default createFolders;


function createList () {
    return listFactory();
}
function createFolders () {
    const list = createList();
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
            list.printFolders();
            updateFolders(list);
        }
    }
    return input;
}

function updateFolders (list) {
    const folders = document.querySelector("#folders");
    while (folders.firstChild) {
        folders.removeChild(folders.firstChild);
    }
    list.getFolders().forEach( (element) => {
        const folder = document.createElement("div");
        const name = document.createElement("div");
        const close = createCloseButton(list);

        folder.classList.add("folder");
        folder.id = element.getDateAdded();
        name.textContent = element.getName();

        folder.appendChild(name);
        folder.appendChild(close);
        folders.appendChild(folder);
    });
}

function createCloseButton (list) {
    const close = document.createElement("div");
    close.textContent = "x";
    close.onclick = function (event) {
        list.deleteFolder(close.parentElement.id);
        updateFolders(list);
    }
    return close;
}