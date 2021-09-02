import format from "date-fns/format";
import taskFactory from "./task.js";
import folderFactory from "./folder.js";
import listFactory from "./list.js";

function initPage () {
    const content = createContent();
    const folderSection = createFolders();
    content.appendChild(folderSection);
    document.body.appendChild(content);
}

export default initPage;

function createContent () {
    const content = document.createElement("div");
    content.id = "content";
    return content;
}

function createFolders () {
    const list = createList();
    const folderInput = createFolderInput();
    folderInput.onkeydown = function (event) {
        if (event.key === "Enter") {
            const folder = folderFactory(folderInput.value,Date.now());
            list.addFolder(folder);
            list.printFolders();
            updateFolders(list);
        }
    }
    const folderWrapper = document.createElement("div");
    folderWrapper.id = "folder-wrapper";
    const folders = document.createElement("div");
    folders.id = "folders";

    folderWrapper.appendChild(folders);
    folderWrapper.appendChild(folderInput);
    return folderWrapper;
}

function createList () {
    return listFactory();
}

function createFolderInput () {
    const input = document.createElement("input");
    input.type = "text";
    return input;
}

function updateFolders (list) {
    const folders = document.querySelector("#folders");
    while (folders.firstChild) {
        folders.removeChild(folders.firstChild);
    }
    list.getFolders().forEach( (element) => {
        const folder = document.createElement("div");
        folder.textContent = element.getName();
        folder.id = element.getDateAdded();
        folders.appendChild(folder);
    });
}



 // const task = taskFactory("Walk Frankie", Date.now());
    // const folder = folderFactory("Main List", Date.now());
    // const list = listFactory();

    // folder.getTasks().push(task);
    // console.log(folder.getTasks().map( (element) => {
    //     return element.getName();
    // }));

    // console.log(task.getDueDate());
    // task.setDueDate(Date.now());
    // console.log(format(task.getDueDate(), "E, MMMM do"));
    // task.setDueDate(false);
    // console.log(task.getDueDate());
    
    // console.log(task.isCompleted());
    // task.setCompletedAs(true);
    // console.log(task.isCompleted());

    // console.log(task.getName());
    // task.setName("Feed Frankie");
    // console.log(task.getName());